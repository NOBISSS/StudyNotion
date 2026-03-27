import { ZodError } from "zod";
import { AppError } from "./AppError.js";
import { getLogger } from "./logger.js";
const logger = getLogger();
export function globalErrorHandler(err, req, res, _next) {
    if (err instanceof ZodError) {
        res.status(400).json({
            success: false,
            code: "VALIDATION_ERROR",
            errors: err.flatten().fieldErrors,
        });
        return;
    }
    if (err?.code === 11000) {
        const field = Object.keys(err.keyPattern ?? {})[0] ?? "field";
        res.status(409).json({
            success: false,
            code: "CONFLICT",
            message: `${field} already exists`,
        });
        return;
    }
    if (err instanceof AppError) {
        if (!err.isOperational) {
            logger.error({ err, url: req.url }, "Non-operational error");
        }
        res.status(err.statusCode).json({
            success: false,
            code: err.code,
            message: err.message,
            ...(process.env.NODE_ENV !== "production" && { meta: err.meta }),
        });
        return;
    }
    logger.error({ err, url: req.url }, "Unhandled error");
    res.status(500).json({
        success: false,
        code: "INTERNAL_ERROR",
        message: "Something went wrong from our side",
    });
}
//# sourceMappingURL=ErrorHandler.js.map