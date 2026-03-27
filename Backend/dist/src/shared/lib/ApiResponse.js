import {} from "express";
export class ApiResponse {
    static success(res, data, message = "Success", statusCode = 200, cookies) {
        if (cookies && cookies.length > 0) {
            cookies.forEach((cookie) => {
                res.cookie(cookie.name, cookie.value, cookie.options);
            });
        }
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }
    static created(res, data, message = "Created", cookies) {
        return ApiResponse.success(res, data, message, 201, cookies);
    }
    static paginated(res, data, pagination, message = "Success") {
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination,
        });
    }
    static noContent(res) {
        return res.status(204).send();
    }
}
//# sourceMappingURL=ApiResponse.js.map