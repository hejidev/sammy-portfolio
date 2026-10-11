"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSection } from "@/components/sections/hero";
import { WorkSection } from "@/components/sections/work";
import { ProcessSection } from "@/components/sections/process";
import { AboutSection } from "@/components/sections/about";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { ContactSection } from "@/components/sections/contact";
import { useSiteSettings } from "@/hooks/use-public-data";

export default function HomePage() {
  const { data } = useSiteSettings();
  const settings = data?.data;
  const siteName =
    settings?.siteName ||
    process.env.NEXT_PUBLIC_SITE_NAME ||
    "Studio Portfolio";

  return (
    <>
      <SiteHeader siteName={siteName} />
      <main>
        <HeroSection settings={settings} />
        <WorkSection />
        <ProcessSection />
        <AboutSection settings={settings} />
        <TestimonialsSection />
        <ContactSection settings={settings} />
      </main>
      <SiteFooter siteName={siteName} tagline={settings?.tagline} />
    </>
  );
}
