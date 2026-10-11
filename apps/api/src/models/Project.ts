import mongoose, { Schema, Document } from "mongoose";
import type { ProjectCategory } from "@ux-portfolio/shared";

export interface IProject extends Document {
  title: string;
  slug: string;
  summary: string;
  category: ProjectCategory;
  tags: string[];
  coverUrl: string;
  gallery: string[];
  cloudinaryIds: string[];
  challenge: string;
  process: string;
  results: string;
  blocks: { title: string; body: string; imageUrl?: string }[];
  published: boolean;
  featured: boolean;
  sortOrder: number;
  metaDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    summary: { type: String, required: true },
    category: {
      type: String,
      enum: ["product", "web", "mobile", "branding", "other"],
      required: true,
    },
    tags: { type: [String], default: [] },
    coverUrl: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    cloudinaryIds: { type: [String], default: [] },
    challenge: { type: String, default: "" },
    process: { type: String, default: "" },
    results: { type: String, default: "" },
    blocks: [
      {
        title: String,
        body: String,
        imageUrl: String,
      },
    ],
    published: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    metaDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
