// src/lib/apiResponse.ts
import { type Response } from "express";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = "Success",
    statusCode = 200,
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(res: Response, data: T, message = "Created"): Response {
    return ApiResponse.success(res, data, message, 201);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    pagination: PaginationMeta,
    message = "Success",
  ): Response {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination,
    });
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
