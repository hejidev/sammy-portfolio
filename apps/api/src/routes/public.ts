import { Router } from "express";
import { ContactMessageSchema } from "@ux-portfolio/shared";
import { Project } from "../models/Project";
import { ContactMessage } from "../models/ContactMessage";
import { SocialLink } from "../models/SocialLink";
import { Testimonial } from "../models/Testimonial";
import { getOrCreateSiteSettings } from "../models/SiteSettings";
import { validateBody, AppError } from "../middleware/error";

const router = Router();

router.get("/projects", async (req, res, next) => {
  try {
    const filter: Record<string, unknown> = { published: true };
    if (typeof req.query.category === "string" && req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.featured === "true") {
      filter.featured = true;
    }
    const projects = await Project.find(filter)
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
});

router.get("/projects/:slug", async (req, res, next) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
      published: true,
    }).lean();
    if (!project) throw new AppError("Project not found", 404);
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
});

router.get("/social-links", async (_req, res, next) => {
  try {
    const links = await SocialLink.find({ visible: true })
      .sort({ order: 1 })
      .lean();
    res.json({ success: true, data: links });
  } catch (err) {
    next(err);
  }
});

router.get("/site-settings", async (_req, res, next) => {
  try {
    const settings = await getOrCreateSiteSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
});

router.get("/testimonials", async (_req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ featured: true })
      .sort({ order: 1 })
      .lean();
    res.json({ success: true, data: testimonials });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/contact",
  validateBody(ContactMessageSchema),
  async (req, res, next) => {
    try {
      const message = await ContactMessage.create(req.body);
      res.status(201).json({
        success: true,
        message: "Message received. We'll be in touch soon.",
        data: { id: message._id },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
