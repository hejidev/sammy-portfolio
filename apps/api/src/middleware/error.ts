import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(
        new AppError(
          parsed.error.errors.map((e) => e.message).join(", "),
          400
        )
      );
    }
    req.body = parsed.data;
    next();
  };
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err instanceof AppError ? err.statusCode : 500;
  const message =
    err instanceof AppError ? err.message : "Internal server error";
  if (!(err instanceof AppError)) {
    console.error(err);
  }
  res.status(status).json({ success: false, message });
}
