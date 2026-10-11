import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./error";

export interface AuthPayload {
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AuthPayload;
    }
  }
}

export function signSession(email: string): string {
  return jwt.sign({ email }, env.sessionSecret, { expiresIn: "7d" });
}

export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const token =
    req.cookies?.admin_session ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : undefined);

  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const payload = jwt.verify(token, env.sessionSecret) as AuthPayload;
    if (!env.adminEmails.includes(payload.email.toLowerCase())) {
      return next(new AppError("Unauthorized", 401));
    }
    req.admin = { email: payload.email.toLowerCase() };
    next();
  } catch {
    next(new AppError("Unauthorized", 401));
  }
}
