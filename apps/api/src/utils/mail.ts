import nodemailer from "nodemailer";
import { env } from "../config/env";

export function createMailer() {
  if (!env.smtp.user || !env.smtp.pass) {
    return null;
  }
  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });
}

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const transporter = createMailer();
  const subject = "Your portfolio admin login code";
  const text = `Your one-time login code is: ${otp}\n\nIt expires in 10 minutes. If you did not request this, ignore this email.`;

  if (!transporter) {
    if (env.isDev) {
      console.log(`[DEV OTP] ${to}: ${otp}`);
      return;
    }
    throw new Error("SMTP is not configured");
  }

  await transporter.sendMail({
    from: env.smtp.from || env.smtp.user,
    to,
    subject,
    text,
    html: `<p>Your one-time login code is:</p><p style="font-size:28px;letter-spacing:6px;font-weight:700">${otp}</p><p>It expires in 10 minutes.</p>`,
  });
}

export async function sendContactReplyEmail(
  to: string,
  name: string,
  replyBody: string
): Promise<boolean> {
  const transporter = createMailer();
  if (!transporter) {
    if (env.isDev) {
      console.log(`[DEV REPLY] to ${to}: ${replyBody}`);
      return false;
    }
    return false;
  }

  await transporter.sendMail({
    from: env.smtp.from || env.smtp.user,
    to,
    subject: "Re: Your portfolio inquiry",
    text: `Hi ${name},\n\n${replyBody}\n\n— Portfolio`,
    html: `<p>Hi ${name},</p><p>${replyBody.replace(/\n/g, "<br/>")}</p><p>— Portfolio</p>`,
  });
  return true;
}
