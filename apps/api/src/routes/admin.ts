import { Router } from "express";
import multer from "multer";
import {
  ProjectSchema,
  ProjectUpdateSchema,
  MessageReplySchema,
  MessageStatusSchema,
  SocialLinkSchema,
  SocialLinkUpdateSchema,
  SiteSettingsSchema,
  TestimonialSchema,
} from "@ux-portfolio/shared";
import { z } from "zod";
import { Project } from "../models/Project";
import { ContactMessage } from "../models/ContactMessage";
import { SocialLink } from "../models/SocialLink";
import { Testimonial } from "../models/Testimonial";
import { getOrCreateSiteSettings } from "../models/SiteSettings";
import { requireAdmin } from "../middleware/auth";
import { validateBody, AppError } from "../middleware/error";
import { cloudinary } from "../config/cloudinary";
import { sendContactReplyEmail } from "../utils/mail";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

router.use(requireAdmin);

router.get("/overview", async (_req, res, next) => {
  try {
    const [published, totalProjects, unread, totalMessages, socialCount] =
      await Promise.all([
        Project.countDocuments({ published: true }),
        Project.countDocuments(),
        ContactMessage.countDocuments({ status: "new" }),
        ContactMessage.countDocuments(),
        SocialLink.countDocuments(),
      ]);
    const recentMessages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    res.json({
      success: true,
      data: {
        published,
        totalProjects,
        unread,
        totalMessages,
        socialCount,
        recentMessages,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ——— Projects ———
router.get("/projects", async (_req, res, next) => {
  try {
    const projects = await Project.find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/projects",
  validateBody(ProjectSchema),
  async (req, res, next) => {
    try {
      const exists = await Project.findOne({ slug: req.body.slug });
      if (exists) throw new AppError("Slug already in use", 409);
      const project = await Project.create(req.body);
      res.status(201).json({ success: true, data: project });
    } catch (err) {
      next(err);
    }
  }
);

router.get("/projects/:id", async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) throw new AppError("Project not found", 404);
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/projects/:id",
  validateBody(ProjectUpdateSchema),
  async (req, res, next) => {
    try {
      if (req.body.slug) {
        const clash = await Project.findOne({
          slug: req.body.slug,
          _id: { $ne: req.params.id },
        });
        if (clash) throw new AppError("Slug already in use", 409);
      }
      const project = await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!project) throw new AppError("Project not found", 404);
      res.json({ success: true, data: project });
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/projects/:id", async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) throw new AppError("Project not found", 404);
    if (project.cloudinaryIds?.length) {
      await Promise.allSettled(
        project.cloudinaryIds.map((id) =>
          cloudinary.uploader.destroy(id).catch(() => undefined)
        )
      );
    }
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

// ——— Messages ———
router.get("/messages", async (req, res, next) => {
  try {
    const filter: Record<string, unknown> = {};
    if (typeof req.query.status === "string" && req.query.status) {
      filter.status = req.query.status;
    }
    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
});

router.get("/messages/:id", async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) throw new AppError("Message not found", 404);
    if (message.status === "new") {
      message.status = "read";
      await message.save();
    }
    res.json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/messages/:id",
  validateBody(
    z.object({ status: MessageStatusSchema })
  ),
  async (req, res, next) => {
    try {
      const message = await ContactMessage.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );
      if (!message) throw new AppError("Message not found", 404);
      res.json({ success: true, data: message });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/messages/:id/reply",
  validateBody(MessageReplySchema),
  async (req, res, next) => {
    try {
      const message = await ContactMessage.findById(req.params.id);
      if (!message) throw new AppError("Message not found", 404);

      let sentEmail = false;
      if (req.body.sendEmail !== false) {
        sentEmail = await sendContactReplyEmail(
          message.email,
          message.name,
          req.body.body
        );
      }

      message.replies.push({
        body: req.body.body,
        createdAt: new Date(),
        sentEmail,
      });
      message.status = "replied";
      await message.save();

      res.json({ success: true, data: message });
    } catch (err) {
      next(err);
    }
  }
);

// ——— Social links ———
router.get("/social-links", async (_req, res, next) => {
  try {
    const links = await SocialLink.find().sort({ order: 1 }).lean();
    res.json({ success: true, data: links });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/social-links",
  validateBody(SocialLinkSchema),
  async (req, res, next) => {
    try {
      const link = await SocialLink.create(req.body);
      res.status(201).json({ success: true, data: link });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/social-links/:id",
  validateBody(SocialLinkUpdateSchema),
  async (req, res, next) => {
    try {
      const link = await SocialLink.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!link) throw new AppError("Social link not found", 404);
      res.json({ success: true, data: link });
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/social-links/:id", async (req, res, next) => {
  try {
    const link = await SocialLink.findByIdAndDelete(req.params.id);
    if (!link) throw new AppError("Social link not found", 404);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

// ——— Settings ———
router.get("/site-settings", async (_req, res, next) => {
  try {
    const settings = await getOrCreateSiteSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/site-settings",
  validateBody(SiteSettingsSchema.partial()),
  async (req, res, next) => {
    try {
      await getOrCreateSiteSettings();
      const settings = await (
        await import("../models/SiteSettings")
      ).SiteSettings.findByIdAndUpdate("main", req.body, {
        new: true,
      });
      res.json({ success: true, data: settings });
    } catch (err) {
      next(err);
    }
  }
);

// ——— Testimonials ———
router.get("/testimonials", async (_req, res, next) => {
  try {
    const data = await Testimonial.find().sort({ order: 1 }).lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/testimonials",
  validateBody(TestimonialSchema),
  async (req, res, next) => {
    try {
      const item = await Testimonial.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/testimonials/:id",
  validateBody(TestimonialSchema.partial()),
  async (req, res, next) => {
    try {
      const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!item) throw new AppError("Testimonial not found", 404);
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/testimonials/:id", async (req, res, next) => {
  try {
    const item = await Testimonial.findByIdAndDelete(req.params.id);
    if (!item) throw new AppError("Testimonial not found", 404);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

// ——— Uploads ———
router.post("/uploads", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError("No file uploaded", 400);

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "ux-portfolio" },
        (error, uploaded) => {
          if (error || !uploaded) {
            reject(error ?? new Error("Upload failed"));
            return;
          }
          resolve({
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id,
          });
        }
      );
      stream.end(req.file!.buffer);
    });

    res.status(201).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
