import { Schema, model, Types } from "mongoose";
const StudentPaymentSchema = new Schema({
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
}, { timestamps: true });
export const StudentPayment = model("StudentPayment", StudentPaymentSchema);
//# sourceMappingURL=PaymentModel.js.map