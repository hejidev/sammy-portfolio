"use client";

import { useQuery } from "@tanstack/react-query";
import { api, type ApiListResponse } from "@/lib/api";

export type SiteSettings = {
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
};

export type Project = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  coverUrl: string;
  gallery: string[];
  challenge: string;
  process: string;
  results: string;
  blocks: { title: string; body: string; imageUrl?: string }[];
  featured: boolean;
  metaDescription?: string;
};

export type Testimonial = {
  _id: string;
  name: string;
  role: string;
  quote: string;
  avatarUrl?: string;
};

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: () => api.get<ApiListResponse<SiteSettings>>("/site-settings"),
  });
}

export function useProjects(params?: { category?: string; featured?: boolean }) {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.featured) qs.set("featured", "true");
  const query = qs.toString();
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () =>
      api.get<ApiListResponse<Project[]>>(
        `/projects${query ? `?${query}` : ""}`
      ),
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: () => api.get<ApiListResponse<Project>>(`/projects/${slug}`),
    enabled: !!slug,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: () =>
      api.get<ApiListResponse<Testimonial[]>>("/testimonials"),
  });
}
