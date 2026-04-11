import { z } from "zod";
export declare const createOrderSchema: z.ZodObject<{
    courseId: z.ZodString;
}, z.core.$strip>;
export declare const verifyPaymentSchema: z.ZodObject<{
    razorpayOrderId: z.ZodString;
    razorpayPaymentId: z.ZodString;
    razorpaySignature: z.ZodString;
    courseId: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=paymentValidation.d.ts.map