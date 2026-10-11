"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TestimonialSchema } from "@ux-portfolio/shared";
import type { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, type ApiListResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

type FormValues = z.infer<typeof TestimonialSchema>;
type Item = FormValues & { _id: string };

export default function AdminTestimonialsPage() {
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(TestimonialSchema),
    defaultValues: {
      name: "",
      role: "",
      quote: "",
      avatarUrl: "",
      featured: true,
      order: 0,
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: () =>
      api.get<ApiListResponse<Item[]>>("/admin/testimonials"),
  });

  const create = useMutation({
    mutationFn: (values: FormValues) =>
      api.post("/admin/testimonials", values),
    onSuccess: () => {
      toast.success("Added");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/testimonials/${id}`),
    onSuccess: () => {
      toast.success("Deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="display-title text-3xl font-semibold">Testimonials</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Social proof shown on the public site
        </p>
      </div>

      <form
        className="space-y-4 rounded-xl border border-border p-6"
        onSubmit={form.handleSubmit((v) => create.mutate(v))}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...form.register("name")} />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input {...form.register("role")} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Quote</Label>
          <Textarea {...form.register("quote")} />
        </div>
        <Button type="submit" disabled={create.isPending}>
          Add testimonial
        </Button>
      </form>

      {isLoading && <Skeleton className="h-24 w-full" />}

      <div className="space-y-3">
        {(data?.data ?? []).map((t) => (
          <div
            key={t._id}
            className="flex items-start justify-between gap-4 rounded-lg border border-border p-4"
          >
            <div>
              <p className="font-medium">
                {t.name}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  · {t.role}
                </span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (confirm("Delete?")) remove.mutate(t._id);
              }}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
