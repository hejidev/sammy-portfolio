"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SocialLinkSchema, socialPlatforms } from "@ux-portfolio/shared";
import type { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, type ApiListResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type FormValues = z.infer<typeof SocialLinkSchema>;
type LinkItem = FormValues & { _id: string };

export default function AdminSocialPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-social"],
    queryFn: () =>
      api.get<ApiListResponse<LinkItem[]>>("/admin/social-links"),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(SocialLinkSchema),
    defaultValues: {
      platform: "linkedin",
      label: "",
      url: "",
      iconKey: "link",
      order: 0,
      visible: true,
    },
  });

  const save = useMutation({
    mutationFn: (values: FormValues) =>
      editingId
        ? api.patch(`/admin/social-links/${editingId}`, values)
        : api.post("/admin/social-links", values),
    onSuccess: () => {
      toast.success(editingId ? "Updated" : "Added");
      setEditingId(null);
      form.reset({
        platform: "linkedin",
        label: "",
        url: "",
        iconKey: "link",
        order: 0,
        visible: true,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-social"] });
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/social-links/${id}`),
    onSuccess: () => {
      toast.success("Deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-social"] });
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="display-title text-3xl font-semibold">Social links</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage links shown in the public footer
        </p>
      </div>

      <form
        className="grid gap-4 rounded-xl border border-border p-6 md:grid-cols-2"
        onSubmit={form.handleSubmit((v) => save.mutate(v))}
      >
        <div className="space-y-2">
          <Label>Platform</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...form.register("platform")}
          >
            {socialPlatforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Label</Label>
          <Input {...form.register("label")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>URL</Label>
          <Input {...form.register("url")} placeholder="https://" />
        </div>
        <div className="space-y-2">
          <Label>Order</Label>
          <Input
            type="number"
            {...form.register("order", { valueAsNumber: true })}
          />
        </div>
        <label className="flex items-center gap-2 self-end text-sm">
          <input type="checkbox" {...form.register("visible")} />
          Visible on site
        </label>
        <div className="flex gap-2 md:col-span-2">
          <Button type="submit" disabled={save.isPending}>
            {editingId ? "Update link" : "Add link"}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingId(null);
                form.reset();
              }}
            >
              Cancel edit
            </Button>
          )}
        </div>
      </form>

      {isLoading && <Skeleton className="h-24 w-full" />}

      <div className="space-y-3">
        {(data?.data ?? []).map((link) => (
          <div
            key={link._id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4"
          >
            <div>
              <p className="font-medium">
                {link.label}{" "}
                <span className="text-xs capitalize text-muted-foreground">
                  · {link.platform}
                </span>
              </p>
              <a
                href={link.url}
                className="text-sm text-muted-foreground hover:text-foreground"
                target="_blank"
                rel="noreferrer"
              >
                {link.url}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{link.visible ? "Visible" : "Hidden"}</Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingId(link._id);
                  form.reset(link);
                }}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (confirm("Delete this link?")) remove.mutate(link._id);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
