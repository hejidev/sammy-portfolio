"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useProjects, type Project } from "@/hooks/use-public-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const filters = ["all", "product", "web", "mobile", "branding"] as const;

export function WorkSection() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const { data, isLoading, isError } = useProjects();
  const projects = useMemo(() => {
    const list = data?.data ?? [];
    if (filter === "all") return list;
    return list.filter((p) => p.category === filter);
  }, [data, filter]);

  return (
    <section id="work" className="section-pad scroll-mt-20">
      <div className="container-page">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Portfolio
            </p>
            <h2 className="display-title mt-2 text-3xl font-semibold sm:text-4xl">
              Featured projects
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Case studies across product, web, and mobile — each framed around
              problem, process, and measurable outcomes.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm capitalize transition",
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
            ))}
          </div>
        )}

        {isError && (
          <p className="mt-10 text-sm text-muted-foreground">
            Unable to load projects. Start the API and try again.
          </p>
        )}

        {!isLoading && !isError && projects.length === 0 && (
          <p className="mt-10 text-sm text-muted-foreground">
            No published projects yet.
          </p>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/40"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {project.coverUrl ? (
          <Image
            src={project.coverUrl}
            alt={project.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No cover
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          <Badge className="capitalize">{project.category}</Badge>
          {project.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} className="border-transparent bg-muted">
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="mt-3 text-lg font-semibold">{project.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {project.summary}
        </p>
        <p className="mt-4 text-sm font-medium text-primary">View case study →</p>
      </div>
    </Link>
  );
}

export function WorkCta() {
  return (
    <div className="container-page pb-8 text-center">
      <Button asChild variant="outline">
        <Link href="#contact">Discuss a project</Link>
      </Button>
    </div>
  );
}
