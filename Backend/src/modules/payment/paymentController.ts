// Backend/src/modules/payment/paymentController.ts
//
// Flow:
//   1. POST /payment/create-order
//      → validate course exists & student not already enrolled
//      → create Razorpay order
//      → save StudentPayment (status: "pending")
//      → return { orderId, amount, currency, keyId, courseName, thumbnailUrl }
//
//   2. POST /payment/verify
//      → verify Razorpay HMAC signature
//      → mark StudentPayment (status: "success")
//      → create CourseEnrollment
//      → send confirmation email (via emailQueue)
//      → return { success: true }

import crypto from "crypto"
import Razorpay from "razorpay"
import { Types } from "mongoose"
import { asyncHandler } from "../../shared/lib/asyncHandler.js"
import { AppError } from "../../shared/lib/AppError.js"
import { ApiResponse } from "../../shared/lib/ApiResponse.js"
import { getEnv } from "../../shared/config/env.js"
const { Course } = await import("../course/CourseModel.js");
import { CourseEnrollment } from "../enrollment/CourseEnrollment.js"
import { StudentPayment } from "./PaymentModel.js"
import { emailQueue } from "../../shared/queue/emailQueue.js"
import { createOrderSchema, verifyPaymentSchema } from "./paymentValidation.js"
import type { Handler } from "../../shared/types.js"

// ── Razorpay instance ─────────────────────────────────────────────────────────
const env=getEnv();
const razorpay = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
})

// ─────────────────────────────────────────────────────────────────────────────
//  POST /payment/create-order
// ─────────────────────────────────────────────────────────────────────────────
export const createOrder: Handler = asyncHandler(async (req, res) => {
    const parsed = createOrderSchema.safeParse(req.body)
       if (!parsed.success) {
  const message = parsed.error?.issues?.[0]?.message || "Invalid request";
  throw AppError.badRequest(message);
}

    const { courseId } = parsed.data
    const studentId = req.userId!

    if (!Types.ObjectId.isValid(courseId))
        throw AppError.badRequest("Invalid course ID")

    // ── Fetch course ──────────────────────────────────────────────────────────
    const course = await Course.findOne({ _id: courseId, isActive: true })
    if (!course) throw AppError.notFound("Course not found")

    // ── Block free course checkout ────────────────────────────────────────────
    if (course.typeOfCourse === "Free")
        throw AppError.badRequest("This course is free — use enroll endpoint instead")

    // ── Block if already enrolled ─────────────────────────────────────────────
    const alreadyEnrolled = await CourseEnrollment.exists({ courseId, userId: studentId })
    if (alreadyEnrolled) throw AppError.conflict("You are already enrolled in this course")

    // ── Determine amount in paise (Razorpay expects paise) ───────────────────
    const priceInRupees = course.discountPrice > 0 ? course.discountPrice : course.originalPrice
    const amountInPaise = Math.round(priceInRupees * 100)

    // ── Create Razorpay order ─────────────────────────────────────────────────
    const rzpOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: {
            courseId,
            studentId: studentId.toString(),
            courseName: course.courseName,
        },
    })

    // ── Save pending payment record ───────────────────────────────────────────
    await StudentPayment.create({
        studentId: new Types.ObjectId(studentId),
        courseId: new Types.ObjectId(courseId),
        razorpayOrderId: rzpOrder.id,
        amount: amountInPaise,
        finalAmount: amountInPaise,
        currency: "INR",
        status: "pending",
    })

    ApiResponse.success(
        res,
        {
            orderId: rzpOrder.id,
            amount: amountInPaise,
            currency: "INR",
            keyId: env.RAZORPAY_KEY_ID,   // sent to frontend to init Razorpay JS
            courseName: course.courseName,
            thumbnailUrl: course.thumbnailUrl,
        },
        "Order created successfully"
    )
})

// ─────────────────────────────────────────────────────────────────────────────
//  POST /payment/verify
// ─────────────────────────────────────────────────────────────────────────────
export const verifyPayment: Handler = asyncHandler(async (req, res) => {
    const parsed = verifyPaymentSchema.safeParse(req.body)

    if (!parsed.success) {
  const message = parsed.error?.issues?.[0]?.message || "Invalid request";
  throw AppError.badRequest(message);
}

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, courseId } = parsed.data
    const studentId = req.userId!

    // ── Verify HMAC signature ─────────────────────────────────────────────────
    // Razorpay signature = HMAC-SHA256(orderId + "|" + paymentId, key_secret)
    const expectedSignature = crypto
        .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex")

    if (expectedSignature !== razorpaySignature) {
        // Mark payment as failed
        await StudentPayment.findOneAndUpdate(
            { razorpayOrderId },
            { status: "failed" }
        )
        throw AppError.badRequest("Payment verification failed — invalid signature")
    }

    // ── Fetch the pending payment ─────────────────────────────────────────────
    const payment = await StudentPayment.findOne({ razorpayOrderId })
    if (!payment) throw AppError.notFound("Payment record not found")

    // ── Idempotency: already verified? ───────────────────────────────────────
    if (payment.status === "success") {
        return ApiResponse.success(res, { alreadyEnrolled: true }, "Already enrolled")
    }

    // ── Create enrollment ─────────────────────────────────────────────────────
    const course = await Course.findById(courseId).lean()
    if(!course) throw AppError.notFound("Course Not Found")
    const enrollment = await CourseEnrollment.create({
        userId: new Types.ObjectId(studentId),
        courseId: new Types.ObjectId(courseId),
        instructorId: course.instructorId,
        enrolledAt: new Date(),
    })

    // ── Update payment record ─────────────────────────────────────────────────
    await StudentPayment.findOneAndUpdate(
        { razorpayOrderId },
        {
            status: "success",
            razorpayPaymentId,
            razorpaySignature,
            enrollmentId: enrollment._id,
            transactionDate: new Date(),
        }
    )

    // ── Send confirmation email (non-blocking) ────────────────────────────────
    
    const User = (await import("../user/UserModel.js")).default
    const student = await User.findById(studentId).select("email firstName").lean()

    if (student?.email && course) {
        emailQueue.add("send-email",{
            to: student.email,
            subject: `You're enrolled in "${course.courseName}"!`,
            html: `
        <div style="font-family:Arial,sans-serif;background:#0F1117;color:#F1F2FF;padding:32px;border-radius:12px;">
          <h2 style="color:#FFD60A;">Enrollment Confirmed! 🎉</h2>
          <p>Hey ${student.firstName},</p>
          <p>You're now enrolled in <strong>${course.courseName}</strong>.</p>
          <a href="${env.FRONTEND_URL}/courses/${courseId}/learn"
             style="display:inline-block;margin-top:16px;padding:12px 28px;background:#FFD60A;
                    color:#000;font-weight:700;border-radius:8px;text-decoration:none;">
            Start Learning →
          </a>
          <p style="margin-top:24px;color:#6B7280;font-size:12px;">
            © ${new Date().getFullYear()} StudyNotion
          </p>
        </div>
      `,
        }).catch(() => { })  // fire-and-forget, don't fail the response
    }

    ApiResponse.success(res, { enrolled: true, enrollmentId: enrollment._id }, "Payment verified and enrolled successfully")
})