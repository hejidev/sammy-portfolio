"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, type ApiListResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Message = {
  _id: string;
  name: string;
  email: string;
  projectType: string;
  body: string;
  status: string;
  createdAt: string;
  replies: { body: string; createdAt: string; sentEmail: boolean }[];
};

export default function MessageDetailPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const form = useForm<{ body: string; sendEmail: boolean }>({
    defaultValues: { body: "", sendEmail: true },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-message", params.id],
    queryFn: () =>
      api.get<ApiListResponse<Message>>(`/admin/messages/${params.id}`),
  });

  const reply = useMutation({
    mutationFn: (values: { body: string; sendEmail: boolean }) =>
      api.post(`/admin/messages/${params.id}/reply`, values),
    onSuccess: () => {
      toast.success("Reply saved");
      form.reset({ body: "", sendEmail: true });
      queryClient.invalidateQueries({ queryKey: ["admin-message", params.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const archive = useMutation({
    mutationFn: () =>
      api.patch(`/admin/messages/${params.id}`, { status: "archived" }),
    onSuccess: () => {
      toast.success("Archived");
      queryClient.invalidateQueries({ queryKey: ["admin-message", params.id] });
    },
  });

  const message = data?.data;

  if (isLoading) return <Skeleton className="h-40 w-full" />;
  if (!message) return <p>Message not found</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button asChild variant="ghost" className="-ml-3">
        <Link href="/admin/messages">← Inbox</Link>
      </Button>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">{message.name}</h1>
            <p className="text-sm text-muted-foreground">{message.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {message.projectType} ·{" "}
              {new Date(message.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className="capitalize">{message.status}</Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => archive.mutate()}
            >
              Archive
            </Button>
          </div>
        </div>
        <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed">
          {message.body}
        </p>
      </div>

      {message.replies?.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">
            Replies
          </h2>
          {message.replies.map((r, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-muted/30 p-4 text-sm"
            >
              <p className="whitespace-pre-wrap">{r.body}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(r.createdAt).toLocaleString()}
                {r.sentEmail ? " · emailed" : ""}
              </p>
            </div>
          ))}
        </div>
      )}

      <form
        className="space-y-3 rounded-xl border border-border p-6"
        onSubmit={form.handleSubmit((v) => reply.mutate(v))}
      >
        <Label htmlFor="reply">Your reply</Label>
        <Textarea id="reply" {...form.register("body", { required: true })} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("sendEmail")} />
          Also email the visitor
        </label>
        <Button type="submit" disabled={reply.isPending}>
          {reply.isPending ? "Sending…" : "Send reply"}
        </Button>
      </form>
    </div>
  );
}
