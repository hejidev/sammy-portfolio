"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectSchema, projectCategories } from "@ux-portfolio/shared";
import type { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, type ApiListResponse } from "@/lib/api";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type FormValues = z.infer<typeof ProjectSchema>;

const defaults: FormValues = {
  title: "",
  slug: "",
  summary: "",
  category: "web",
  tags: [],
  coverUrl: "",
  gallery: [],
  cloudinaryIds: [],
  challenge: "",
  process: "",
  results: "",
  blocks: [],
  published: false,
  featured: false,
  sortOrder: 0,
  metaDescription: "",
};

export function ProjectForm({ projectId }: { projectId?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tagsInput, setTagsInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-project", projectId],
    queryFn: () =>
      api.get<ApiListResponse<FormValues & { _id: string }>>(
        `/admin/projects/${projectId}`
      ),
    enabled: !!projectId,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: defaults,
  });

  useEffect(() => {
    if (data?.data) {
      const p = data.data;
      form.reset({
        ...defaults,
        ...p,
        tags: p.tags ?? [],
        gallery: p.gallery ?? [],
        cloudinaryIds: p.cloudinaryIds ?? [],
        blocks: p.blocks ?? [],
      });
      setTagsInput((p.tags ?? []).join(", "));
    }
  }, [data, form]);

  const save = useMutation({
    mutationFn: (values: FormValues) =>
      projectId
        ? api.patch(`/admin/projects/${projectId}`, values)
        : api.post("/admin/projects", values),
    onSuccess: () => {
      toast.success(projectId ? "Project updated" : "Project created");
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      router.push("/admin/projects");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await api.upload<{
        success: boolean;
        data: { url: string; publicId: string };
      }>("/admin/uploads", file);
      form.setValue("coverUrl", res.data.url);
      const ids = form.getValues("cloudinaryIds") ?? [];
      form.setValue("cloudinaryIds", [...ids, res.data.publicId]);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (projectId && isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <form
      className="mx-auto max-w-3xl space-y-6"
      onSubmit={form.handleSubmit((values) => {
        const tags = tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        save.mutate({ ...values, tags });
      })}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label>Title</Label>
          <Input
            {...form.register("title")}
            onBlur={(e) => {
              if (!form.getValues("slug")) {
                form.setValue("slug", slugify(e.target.value));
              }
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input {...form.register("slug")} />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...form.register("category")}
          >
            {projectCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Summary</Label>
          <Textarea {...form.register("summary")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Tags (comma-separated)</Label>
          <Input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="UX Research, Design System"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Cover image URL</Label>
          <Input {...form.register("coverUrl")} />
          <Input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onUpload(file);
            }}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Challenge</Label>
          <Textarea {...form.register("challenge")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Process</Label>
          <Textarea {...form.register("process")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Results</Label>
          <Textarea {...form.register("results")} />
        </div>
        <div className="space-y-2">
          <Label>Sort order</Label>
          <Input
            type="number"
            {...form.register("sortOrder", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <Label>Meta description</Label>
          <Input {...form.register("metaDescription")} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("published")} />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("featured")} />
          Featured
        </label>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save project"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
