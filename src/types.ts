import { type Request, type Response } from "express";

export type Handler = (req: Request, res: Response) => any;

export enum StatusCode {
  Success = 200,
  InputError = 411,
  DocumentExists = 403,
  ServerError = 500,
  NotFound = 404,
  Unauthorized = 401,
}
