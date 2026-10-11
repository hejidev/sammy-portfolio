"use client";

import type { SiteSettings } from "@/hooks/use-public-data";

const skills = [
  "User Research",
  "Interface Design",
  "Prototyping",
  "Design Systems",
  "User Testing",
  "Collaboration",
];

const tools = ["Figma", "FigJam", "Notion", "Maze", "Slack", "Framer"];

export function AboutSection({ settings }: { settings?: SiteSettings }) {
  return (
    <section id="about" className="section-pad scroll-mt-20">
      <div className="container-page grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            About
          </p>
          <h2 className="display-title mt-2 text-3xl font-semibold sm:text-4xl">
            Design with purpose
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            {settings?.aboutBio ||
              "I'm a product designer passionate about making digital experiences feel human, clear, and a little delightful. I collaborate with teams from discovery through polished delivery."}
          </p>
          {(settings?.location || settings?.contactEmail) && (
            <p className="mt-4 text-sm text-muted-foreground">
              {[settings.location, settings.contactEmail].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Core skills
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border px-3 py-1.5 text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Tools
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {tools.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-muted px-3 py-1.5 text-sm text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
