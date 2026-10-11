import mongoose, { Schema, Document } from "mongoose";

export interface IMessageReply {
  body: string;
  createdAt: Date;
  sentEmail: boolean;
}

export interface IContactMessage extends Document {
  name: string;
  email: string;
  projectType: string;
  body: string;
  status: "new" | "read" | "replied" | "archived";
  replies: IMessageReply[];
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    projectType: { type: String, default: "General" },
    body: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
      index: true,
    },
    replies: [
      {
        body: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        sentEmail: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export const ContactMessage = mongoose.model<IContactMessage>(
  "ContactMessage",
  ContactMessageSchema
);
