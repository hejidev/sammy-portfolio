"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api, type ApiListResponse } from "@/lib/api";

type SocialLink = {
  _id: string;
  platform: string;
  label: string;
  url: string;
};

export function SiteFooter({
  siteName,
  tagline,
}: {
  siteName: string;
  tagline?: string;
}) {
  const { data } = useQuery({
    queryKey: ["social-links"],
    queryFn: () => api.get<ApiListResponse<SocialLink[]>>("/social-links"),
  });
  const links = data?.data ?? [];

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container-page section-pad grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="display-title text-2xl font-semibold">{siteName}</p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            {tagline ||
              "UI/UX designer focused on clear, human-centered products."}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/#work" className="hover:text-foreground">
                Work
              </Link>
            </li>
            <li>
              <Link href="/#about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Connect</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {links.length === 0 && <li>Social links coming soon</li>}
            {links.map((link) => (
              <li key={link._id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {siteName}. All rights reserved.
      </div>
    </footer>
  );
}
