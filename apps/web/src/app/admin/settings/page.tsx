"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiteSettingsSchema } from "@ux-portfolio/shared";
import type { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, type ApiListResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

type FormValues = z.infer<typeof SiteSettingsSchema>;

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(SiteSettingsSchema),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () =>
      api.get<ApiListResponse<FormValues>>("/admin/site-settings"),
  });

  useEffect(() => {
    if (data?.data) form.reset(data.data);
  }, [data, form]);

  const save = useMutation({
    mutationFn: (values: FormValues) =>
      api.patch("/admin/site-settings", values),
    onSuccess: () => {
      toast.success("Settings saved");
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="display-title text-3xl font-semibold">Site settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hero copy, contact details, and headline metrics
        </p>
      </div>

      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit((v) => save.mutate(v))}
      >
        {(
          [
            ["siteName", "Site name"],
            ["tagline", "Tagline"],
            ["availabilityText", "Availability text"],
            ["heroHeadline", "Hero headline"],
            ["heroSubheadline", "Hero subheadline"],
            ["contactEmail", "Contact email"],
            ["contactPhone", "Contact phone"],
            ["location", "Location"],
            ["resumeUrl", "Resume URL"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="space-y-2">
            <Label>{label}</Label>
            {key.includes("headline") || key === "heroSubheadline" ? (
              <Textarea {...form.register(key)} />
            ) : (
              <Input {...form.register(key)} />
            )}
          </div>
        ))}
        <div className="space-y-2">
          <Label>About bio</Label>
          <Textarea {...form.register("aboutBio")} rows={5} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Years experience</Label>
            <Input
              type="number"
              {...form.register("yearsExperience", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label>Projects delivered</Label>
            <Input
              type="number"
              {...form.register("projectsDelivered", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label>Client satisfaction %</Label>
            <Input
              type="number"
              {...form.register("clientSatisfaction", { valueAsNumber: true })}
            />
          </div>
        </div>
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save settings"}
        </Button>
      </form>
    </div>
  );
}
