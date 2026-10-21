import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const candidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "apps/api/.env"),
  path.resolve(__dirname, "../.env"),
];

for (const file of candidates) {
  if (fs.existsSync(file)) {
    dotenv.config({ path: file });
    break;
  }
}

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  mongodbUri: required(
    "MONGODB_URI",
    "mongodb://127.0.0.1:27017/ux_portfolio"
  ),
  webUrl: required("WEB_URL", "http://localhost:3000"),
  sessionSecret: required(
    "SESSION_SECRET",
    "dev-session-secret-change-in-production"
  ),
  adminEmails: (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  },
    resend: {
    apiKey: process.env.RESEND_API_KEY ?? "",
    from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
  },
  isDev: (process.env.NODE_ENV ?? "development") !== "production",
};
