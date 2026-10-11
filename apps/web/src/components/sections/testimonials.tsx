"use client";

import { useTestimonials } from "@/hooks/use-public-data";
import { Skeleton } from "@/components/ui/skeleton";

export function TestimonialsSection() {
  const { data, isLoading } = useTestimonials();
  const items = data?.data ?? [];

  return (
    <section
      id="testimonials"
      className="scroll-mt-20 border-y border-border bg-muted/20 section-pad"
    >
      <div className="container-page">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Testimonials
        </p>
        <h2 className="display-title mt-2 text-3xl font-semibold sm:text-4xl">
          What collaborators say
        </h2>
        {isLoading && (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        )}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <blockquote
              key={t._id}
              className="rounded-xl border border-border bg-card p-6"
            >
              <p className="text-sm leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-6">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
