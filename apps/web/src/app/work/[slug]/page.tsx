"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProject, useSiteSettings } from "@/hooks/use-public-data";

export default function CaseStudyPage() {
  const params = useParams<{ slug: string }>();
  const { data: settingsData } = useSiteSettings();
  const { data, isLoading, isError } = useProject(params.slug);
  const project = data?.data;
  const siteName =
    settingsData?.data?.siteName ||
    process.env.NEXT_PUBLIC_SITE_NAME ||
    "Studio Portfolio";

  return (
    <>
      <SiteHeader siteName={siteName} />
      <main className="container-page section-pad">
        <Button asChild variant="ghost" className="mb-8 -ml-3">
          <Link href="/#work">← Back to work</Link>
        </Button>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="aspect-video w-full rounded-xl" />
          </div>
        )}

        {isError && (
          <p className="text-muted-foreground">Case study not found.</p>
        )}

        {project && (
          <article>
            <div className="flex flex-wrap gap-2">
              <Badge className="capitalize">{project.category}</Badge>
              {project.tags.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
            <h1 className="display-title mt-4 text-4xl font-semibold sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              {project.summary}
            </p>

            {project.coverUrl && (
              <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
                <Image
                  src={project.coverUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
              </div>
            )}

            <div className="mt-16 grid gap-12 lg:grid-cols-3">
              {[
                { title: "Challenge", body: project.challenge },
                { title: "Process", body: project.process },
                { title: "Results", body: project.results },
              ]
                .filter((s) => s.body)
                .map((s) => (
                  <section key={s.title}>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
                      {s.title}
                    </h2>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {s.body}
                    </p>
                  </section>
                ))}
            </div>

            {project.blocks?.length > 0 && (
              <div className="mt-16 space-y-12">
                {project.blocks.map((block, i) => (
                  <section key={`${block.title}-${i}`}>
                    <h2 className="display-title text-2xl font-semibold">
                      {block.title}
                    </h2>
                    <p className="mt-3 max-w-3xl whitespace-pre-wrap text-muted-foreground">
                      {block.body}
                    </p>
                    {block.imageUrl && (
                      <div className="relative mt-6 aspect-video overflow-hidden rounded-xl border border-border">
                        <Image
                          src={block.imageUrl}
                          alt={block.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </section>
                ))}
              </div>
            )}

            {project.gallery?.length > 0 && (
              <div className="mt-16 grid gap-4 md:grid-cols-2">
                {project.gallery.map((url) => (
                  <div
                    key={url}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border"
                  >
                    <Image
                      src={url}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </article>
        )}
      </main>
      <SiteFooter siteName={siteName} tagline={settingsData?.data?.tagline} />
    </>
  );
}
