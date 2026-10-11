import { connectDb } from "./config/db";
import { Project } from "./models/Project";
import { SocialLink } from "./models/SocialLink";
import { Testimonial } from "./models/Testimonial";
import { getOrCreateSiteSettings } from "./models/SiteSettings";

async function seed() {
  await connectDb();
  await getOrCreateSiteSettings();

  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany([
      {
        title: "TaskFlow Productivity Suite",
        slug: "taskflow-productivity",
        summary:
          "A task management web experience designed to simplify productivity while staying visually engaging and calm under pressure.",
        category: "web",
        tags: ["Web Design", "UX Research", "Design System"],
        coverUrl:
          "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200",
        gallery: [],
        challenge:
          "Teams were drowning in noisy task tools. We needed clarity, focus modes, and a hierarchy that scales from solo freelancers to small squads.",
        process:
          "Discovery interviews, journey mapping, low-fi wireframes, interactive prototypes in Figma, and iterative usability tests with 12 participants.",
        results:
          "Prototype tested with a 40% reduction in time-to-create-task and strong preference for the calm visual system over competitors.",
        blocks: [
          {
            title: "Research insights",
            body: "Users wanted fewer chrome elements and clearer priority cues. Notifications were the top friction point.",
          },
          {
            title: "Interface direction",
            body: "We built a modular card system with soft elevation, generous whitespace, and gold accent moments for primary actions.",
          },
        ],
        published: true,
        featured: true,
        sortOrder: 1,
        metaDescription:
          "Case study: redesigning a calm, focused task management product.",
      },
      {
        title: "CICI Wellness Companion",
        slug: "cici-wellness",
        summary:
          "A mobile wellness companion supporting women through every phase — education, tracking, and gentle daily rituals.",
        category: "mobile",
        tags: ["Mobile", "Health", "UX"],
        coverUrl:
          "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200",
        challenge:
          "Sensitive health content needed trust, privacy cues, and a tone that felt supportive rather than clinical.",
        process:
          "Persona workshops, content audit, accessibility review, and high-fidelity mobile flows with motion guidelines.",
        results:
          "Stakeholder approval for MVP; design system handed off with component specs for engineering.",
        published: true,
        featured: true,
        sortOrder: 2,
        metaDescription: "Mobile wellness app case study.",
      },
      {
        title: "Eventra Platform",
        slug: "eventra-platform",
        summary:
          "A modern event management platform that simplifies how events are planned, organized, and attended.",
        category: "product",
        tags: ["Product Design", "SaaS"],
        coverUrl:
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200",
        challenge:
          "Organizers juggled multiple tools for tickets, schedules, and attendee comms.",
        process:
          "Service blueprinting, IA restructuring, and a unified dashboard concept validated with organizers.",
        results:
          "Clearer IA reduced support tickets in the pilot; marketing site conversion improved with sharper storytelling.",
        published: true,
        featured: false,
        sortOrder: 3,
        metaDescription: "Event management product design case study.",
      },
    ]);
    console.log("Seeded projects");
  }

  if ((await SocialLink.countDocuments()) === 0) {
    await SocialLink.insertMany([
      {
        platform: "linkedin",
        label: "LinkedIn",
        url: "https://linkedin.com",
        iconKey: "linkedin",
        order: 1,
        visible: true,
      },
      {
        platform: "dribbble",
        label: "Dribbble",
        url: "https://dribbble.com",
        iconKey: "dribbble",
        order: 2,
        visible: true,
      },
      {
        platform: "behance",
        label: "Behance",
        url: "https://behance.net",
        iconKey: "behance",
        order: 3,
        visible: true,
      },
    ]);
    console.log("Seeded social links");
  }

  if ((await Testimonial.countDocuments()) === 0) {
    await Testimonial.insertMany([
      {
        name: "Jephthah Adeleke",
        role: "Software Developer",
        quote:
          "Some of the cleanest product design work I've seen — attention to detail, layout structure, and overall UX on another level.",
        featured: true,
        order: 1,
      },
      {
        name: "Rosemary Rotimi",
        role: "Product Designer",
        quote:
          "Trust and clarity always beat flashy UI. This portfolio proves that.",
        featured: true,
        order: 2,
      },
      {
        name: "Md Mehedi Hasan Roni",
        role: "Product Designer",
        quote:
          "In fintech, confidence is the real conversion metric. Clean, calm, and trustworthy beats fancy every time.",
        featured: true,
        order: 3,
      },
    ]);
    console.log("Seeded testimonials");
  }

  console.log("Seed complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
