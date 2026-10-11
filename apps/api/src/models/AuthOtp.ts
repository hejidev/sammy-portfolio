import mongoose, { Schema, Document } from "mongoose";

export interface IAuthOtp extends Document {
  email: string;
  tokenHash: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

const AuthOtpSchema = new Schema<IAuthOtp>({
  email: { type: String, required: true, index: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: true },
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

AuthOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AuthOtp = mongoose.model<IAuthOtp>("AuthOtp", AuthOtpSchema);
