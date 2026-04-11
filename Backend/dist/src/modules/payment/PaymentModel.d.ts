import { Types } from "mongoose";
export interface IStudentPayment {
    studentId: Types.ObjectId;
    courseId: Types.ObjectId;
    enrollmentId: Types.ObjectId;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    amount: number;
    currency: string;
    discountApplied?: string;
    finalAmount: number;
    status: "pending" | "success" | "failed";
    paymentMethod?: string;
    transactionDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const StudentPayment: import("mongoose").Model<IStudentPayment, {}, {}, {}, import("mongoose").Document<unknown, {}, IStudentPayment, {}, import("mongoose").DefaultSchemaOptions> & IStudentPayment & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IStudentPayment>;
//# sourceMappingURL=PaymentModel.d.ts.map