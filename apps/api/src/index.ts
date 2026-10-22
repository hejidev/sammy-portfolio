import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { connectDb } from "./config/db";
import { configureCloudinary } from "./config/cloudinary";
import { errorHandler } from "./middleware/error";
import publicRoutes from "./routes/public";
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";

const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

async function main() {
  await connectDb();
  configureCloudinary();

  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        console.warn("CORS blocked origin:", origin);
        console.warn("Allowed origins:", allowedOrigins);
        return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());

  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  });
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many auth attempts" },
  });
  const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many contact submissions" },
  });

  app.use(generalLimiter);
  app.get("/health", (_req, res) =>
    res.json({ success: true, status: "ok" })
  );

  app.use("/auth", authLimiter, authRoutes);
  app.use("/contact", contactLimiter);
  app.use(publicRoutes);
  app.use("/admin", adminRoutes);

  app.use(errorHandler);

  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  console.error("Failed to start API", err);
  process.exit(1);
});
