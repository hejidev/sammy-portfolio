import mongoose, { Schema } from "mongoose";

export interface ISiteSettings {
  _id: string;
  siteName: string;
  tagline: string;
  availabilityText: string;
  heroHeadline: string;
  heroSubheadline: string;
  aboutBio: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
  resumeUrl: string;
  yearsExperience: number;
  projectsDelivered: number;
  clientSatisfaction: number;
}

const SiteSettingsSchema = new Schema(
  {
    _id: { type: String, default: "main" },
    siteName: { type: String, default: "Studio Portfolio" },
    tagline: { type: String, default: "Product Designer" },
    availabilityText: {
      type: String,
      default: "Available for new projects",
    },
    heroHeadline: {
      type: String,
      default: "Crafting digital experiences that feel effortless",
    },
    heroSubheadline: {
      type: String,
      default:
        "I turn complex problems into intuitive interfaces — strategy meets craft, backed by research and clear outcomes.",
    },
    aboutBio: {
      type: String,
      default:
        "I'm a product designer passionate about making digital experiences feel human, clear, and a little delightful. I collaborate with teams from discovery through polished delivery.",
    },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    location: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    yearsExperience: { type: Number, default: 5 },
    projectsDelivered: { type: Number, default: 50 },
    clientSatisfaction: { type: Number, default: 98 },
  },
  { _id: false }
);

export const SiteSettings = mongoose.model(
  "SiteSettings",
  SiteSettingsSchema
);

export async function getOrCreateSiteSettings() {
  let settings = await SiteSettings.findById("main");
  if (!settings) {
    settings = await SiteSettings.create({ _id: "main" });
  }
  return settings;
}
