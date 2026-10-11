import { z } from "zod";

export const projectCategories = [
  "product",
  "web",
  "mobile",
  "branding",
  "other",
] as const;

export const ProjectCategorySchema = z.enum(projectCategories);
export type ProjectCategory = z.infer<typeof ProjectCategorySchema>;

export const CaseStudyBlockSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(10000),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const ProjectSchema = z.object({
  title: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  summary: z.string().min(10).max(500),
  category: ProjectCategorySchema,
  tags: z.array(z.string().min(1).max(40)).max(12).default([]),
  coverUrl: z.string().url().optional().or(z.literal("")),
  gallery: z.array(z.string().url()).max(20).default([]),
  cloudinaryIds: z.array(z.string()).default([]),
  challenge: z.string().max(5000).optional().default(""),
  process: z.string().max(5000).optional().default(""),
  results: z.string().max(5000).optional().default(""),
  blocks: z.array(CaseStudyBlockSchema).max(12).default([]),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  metaDescription: z.string().max(160).optional().default(""),
});

export const ProjectUpdateSchema = ProjectSchema.partial();
export type ProjectInput = z.infer<typeof ProjectSchema>;

export const ContactMessageSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  projectType: z.string().min(1).max(80).optional().default("General"),
  body: z.string().min(10).max(5000),
});
export type ContactMessageInput = z.infer<typeof ContactMessageSchema>;

export const messageStatuses = [
  "new",
  "read",
  "replied",
  "archived",
] as const;
export const MessageStatusSchema = z.enum(messageStatuses);

export const MessageReplySchema = z.object({
  body: z.string().min(1).max(5000),
  sendEmail: z.boolean().optional().default(true),
});

export const socialPlatforms = [
  "linkedin",
  "dribbble",
  "behance",
  "instagram",
  "twitter",
  "github",
  "figma",
  "website",
  "other",
] as const;

export const SocialLinkSchema = z.object({
  platform: z.enum(socialPlatforms),
  label: z.string().min(1).max(60),
  url: z.string().url(),
  iconKey: z.string().min(1).max(40).optional().default("link"),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});
export const SocialLinkUpdateSchema = SocialLinkSchema.partial();
export type SocialLinkInput = z.infer<typeof SocialLinkSchema>;

export const SiteSettingsSchema = z.object({
  siteName: z.string().min(1).max(80).default("Studio Portfolio"),
  tagline: z.string().max(200).optional().default(""),
  availabilityText: z.string().max(120).optional().default("Available for new projects"),
  heroHeadline: z.string().max(200).optional().default(""),
  heroSubheadline: z.string().max(400).optional().default(""),
  aboutBio: z.string().max(3000).optional().default(""),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().max(40).optional().default(""),
  location: z.string().max(120).optional().default(""),
  resumeUrl: z.string().url().optional().or(z.literal("")),
  yearsExperience: z.number().int().min(0).max(50).optional().default(5),
  projectsDelivered: z.number().int().min(0).max(999).optional().default(50),
  clientSatisfaction: z.number().int().min(0).max(100).optional().default(98),
});
export type SiteSettingsInput = z.infer<typeof SiteSettingsSchema>;

export const TestimonialSchema = z.object({
  name: z.string().min(2).max(100),
  role: z.string().min(1).max(120),
  quote: z.string().min(10).max(1000),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(true),
  order: z.number().int().default(0),
});
export type TestimonialInput = z.infer<typeof TestimonialSchema>;

export const OtpRequestSchema = z.object({
  email: z.string().email(),
});

export const OtpVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6).regex(/^\d{6}$/),
});
