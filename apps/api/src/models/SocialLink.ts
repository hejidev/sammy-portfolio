import mongoose, { Schema, Document } from "mongoose";
import type { SocialLinkInput } from "@ux-portfolio/shared";

export interface ISocialLink extends Document, SocialLinkInput {
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinkSchema = new Schema<ISocialLink>(
  {
    platform: {
      type: String,
      enum: [
        "linkedin",
        "dribbble",
        "behance",
        "instagram",
        "twitter",
        "github",
        "figma",
        "website",
        "other",
      ],
      required: true,
    },
    label: { type: String, required: true },
    url: { type: String, required: true },
    iconKey: { type: String, default: "link" },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const SocialLink = mongoose.model<ISocialLink>(
  "SocialLink",
  SocialLinkSchema
);
