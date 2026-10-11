"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api, type ApiListResponse } from "@/lib/api";
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
};

export default function AdminMessagesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => api.get<ApiListResponse<Message[]>>("/admin/messages"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-title text-3xl font-semibold">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Contact form inbox — reply from here
        </p>
      </div>

      {isLoading && <Skeleton className="h-40 w-full" />}

      <div className="space-y-3">
        {(data?.data ?? []).map((m) => (
          <Link
            key={m._id}
            href={`/admin/messages/${m._id}`}
            className="block rounded-xl border border-border bg-card p-4 transition hover:border-primary/40"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">
                  {m.name}{" "}
                  <span className="font-normal text-muted-foreground">
                    · {m.email}
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {m.projectType} ·{" "}
                  {new Date(m.createdAt).toLocaleString()}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {m.body}
                </p>
              </div>
              <Badge className="capitalize">{m.status}</Badge>
            </div>
          </Link>
        ))}
        {!isLoading && (data?.data ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">Inbox is empty.</p>
        )}
      </div>
    </div>
  );
}
