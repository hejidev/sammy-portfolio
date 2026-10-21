import { Resend } from "resend";
import { env } from "../config/env";

let client: Resend | null = null;

function getClient(): Resend | null {
  if (!env.resend.apiKey) return null;
  if (!client) client = new Resend(env.resend.apiKey);
  return client;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const resend = getClient();

  if (!resend) {
    if (env.isDev) {
      console.log(`[DEV OTP] ${to}: ${otp}`);
      return;
    }
    throw new Error("Resend is not configured (missing RESEND_API_KEY)");
  }

  const { error } = await resend.emails.send({
    from: env.resend.from,
    to,
    subject: "Your portfolio admin login code",
    text: `Your one-time login code is: ${otp}\n\nIt expires in 10 minutes. If you did not request this, ignore this email.`,
    html: `<p>Your one-time login code is:</p><p style="font-size:28px;letter-spacing:6px;font-weight:700">${otp}</p><p>It expires in 10 minutes.</p>`,
  });

  if (error) {
    throw new Error(`Resend failed to send the login code: ${error.message}`);
  }
}

export async function sendContactReplyEmail(
  to: string,
  name: string,
  replyBody: string
): Promise<boolean> {
  const resend = getClient();

  if (!resend) {
    if (env.isDev) {
      console.log(`[DEV REPLY] to ${to}: ${replyBody}`);
    }
    return false;
  }

  const { error } = await resend.emails.send({
    from: env.resend.from,
    to,
    subject: "Re: Your portfolio inquiry",
    text: `Hi ${name},\n\n${replyBody}\n\n— Portfolio`,
    html: `<p>Hi ${escapeHtml(name)},</p><p>${escapeHtml(replyBody).replace(/\n/g, "<br/>")}</p><p>— Portfolio</p>`,
  });

  if (error) {
    throw new Error(`Resend failed to send the reply: ${error.message}`);
  }
  return true;
}