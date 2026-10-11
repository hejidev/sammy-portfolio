import { Router } from "express";
import bcrypt from "bcryptjs";
import {
  OtpRequestSchema,
  OtpVerifySchema,
} from "@ux-portfolio/shared";
import { env } from "../config/env";
import { AuthOtp } from "../models/AuthOtp";
import { validateBody, AppError } from "../middleware/error";
import { requireAdmin, signSession } from "../middleware/auth";
import { sendOtpEmail } from "../utils/mail";

const router = Router();

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

router.post(
  "/otp/request",
  validateBody(OtpRequestSchema),
  async (req, res, next) => {
    try {
      const email = (req.body.email as string).toLowerCase();
      const isAllowed = env.adminEmails.includes(email);

      // Always return success to avoid email enumeration
      if (isAllowed) {
        const otp = generateOtp();
        const tokenHash = await bcrypt.hash(otp, 10);
        await AuthOtp.deleteMany({ email });
        await AuthOtp.create({
          email,
          tokenHash,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
          attempts: 0,
        });
        await sendOtpEmail(email, otp);
      }

      res.json({
        success: true,
        message: "If that email is authorized, a login code has been sent.",
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/otp/verify",
  validateBody(OtpVerifySchema),
  async (req, res, next) => {
    try {
      const email = (req.body.email as string).toLowerCase();
      const otp = req.body.otp as string;

      if (!env.adminEmails.includes(email)) {
        throw new AppError("Invalid email or code", 401);
      }

      const record = await AuthOtp.findOne({ email }).sort({ createdAt: -1 });
      if (!record || record.expiresAt < new Date()) {
        throw new AppError("Invalid or expired code", 401);
      }

      if (record.attempts >= 5) {
        await AuthOtp.deleteMany({ email });
        throw new AppError("Too many attempts. Request a new code.", 429);
      }

      const valid = await bcrypt.compare(otp, record.tokenHash);
      if (!valid) {
        record.attempts += 1;
        await record.save();
        throw new AppError("Invalid or expired code", 401);
      }

      await AuthOtp.deleteMany({ email });
      const token = signSession(email);

      res.cookie("admin_session", token, {
        httpOnly: true,
        secure: !env.isDev,
        sameSite: env.isDev ? "lax" : "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.json({
        success: true,
        message: "Logged in",
        token,
        admin: { email },
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post("/logout", (_req, res) => {
  res.clearCookie("admin_session", {
    httpOnly: true,
    secure: !env.isDev,
    sameSite: env.isDev ? "lax" : "none",
    path: "/",
  });
  res.json({ success: true, message: "Logged out" });
});

router.get("/me", requireAdmin, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

export default router;
