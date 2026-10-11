"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/hooks/use-public-data";

export function HeroSection({ settings }: { settings?: SiteSettings }) {
  return (
    <section className="hero-mesh relative overflow-hidden">
      <div className="container-page section-pad grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {settings?.availabilityText || "Available for new projects"}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground"
          >
            {settings?.tagline || "Product Designer"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="display-title mt-4 max-w-2xl text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl"
          >
            {settings?.heroHeadline ||
              "Crafting digital experiences that feel effortless"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            {settings?.heroSubheadline ||
              "I turn complex problems into intuitive interfaces — strategy meets craft, backed by research and clear outcomes."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button asChild size="lg">
              <Link href="#work">
                View my work <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#contact">Get in touch</Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8"
          >
            {[
              {
                value: `${settings?.yearsExperience ?? 5}+`,
                label: "Years experience",
              },
              {
                value: `${settings?.projectsDelivered ?? 50}+`,
                label: "Projects delivered",
              },
              {
                value: `${settings?.clientSatisfaction ?? 98}%`,
                label: "Client satisfaction",
              },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="display-title text-2xl font-semibold sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative hidden aspect-[4/5] overflow-hidden rounded-2xl border border-border lg:block"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted" />
          <div className="absolute inset-6 rounded-xl border border-border/80 bg-card/80 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Selected craft
            </p>
            <p className="display-title mt-4 text-3xl font-semibold">
              Interfaces with intention
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Research-led flows, systems that scale, and polish that users feel
              even when they can&apos;t name it.
            </p>
            <div className="mt-8 space-y-3">
              {["User research", "Interface design", "Design systems"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-border px-4 py-3 text-sm"
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full gold-gradient opacity-30 blur-3xl dark:opacity-40" />
        </motion.div>
      </div>
    </section>
  );
}
