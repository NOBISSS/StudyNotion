import { Schema, model, Types } from "mongoose"

export interface IStudentPayment {
    studentId: Types.ObjectId
    courseId: Types.ObjectId
    enrollmentId: Types.ObjectId
    razorpayOrderId: string        // rzp order id — created before payment
    razorpayPaymentId?: string     // rzp payment id — filled after success
    razorpaySignature?: string     // stored for audit
    amount: number        // in paise (multiply ₹ × 100)
    currency: string        // "INR"
    discountApplied?: string
    finalAmount: number        // same as amount for now; future: after discount
    status: "pending" | "success" | "failed"
    paymentMethod?: string        // "upi", "card", etc
    transactionDate?: Date
    createdAt: Date
    updatedAt: Date
}

const StudentPaymentSchema = new Schema<IStudentPayment>(
    {
        studentId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
        enrollmentId: { type: Schema.Types.ObjectId, ref: "CourseEnrollment" },
        razorpayOrderId: { type: String, required: true, unique: true },
        razorpayPaymentId: { type: String, default: null },
        razorpaySignature: { type: String, default: null },
        amount: { type: Number, required: true },
        currency: { type: String, default: "INR" },
        discountApplied: { type: String, default: null },
        finalAmount: { type: Number, required: true },
        status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
        paymentMethod: { type: String, default: null },
        transactionDate: { type: Date, default: null },
    },
    { timestamps: true }
)

export const StudentPayment = model<IStudentPayment>("StudentPayment", StudentPaymentSchema)