"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api, type ApiListResponse } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Overview = {
  published: number;
  totalProjects: number;
  unread: number;
  totalMessages: number;
  socialCount: number;
  recentMessages: {
    _id: string;
    name: string;
    email: string;
    body: string;
    status: string;
    createdAt: string;
  }[];
};

export default function AdminOverviewPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => api.get<ApiListResponse<Overview>>("/admin/overview"),
  });
  const overview = data?.data;

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="display-title text-3xl font-semibold">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Portfolio health at a glance
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">New project</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Published projects", value: overview?.published ?? 0 },
          { label: "Total projects", value: overview?.totalProjects ?? 0 },
          { label: "Unread messages", value: overview?.unread ?? 0 },
          { label: "Social links", value: overview?.socialCount ?? 0 },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="display-title text-3xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent messages</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/messages">View inbox</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {(overview?.recentMessages ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          )}
          {overview?.recentMessages.map((m) => (
            <Link
              key={m._id}
              href={`/admin/messages/${m._id}`}
              className="flex items-start justify-between gap-4 rounded-lg border border-border p-3 transition hover:border-primary/40"
            >
              <div>
                <p className="text-sm font-medium">
                  {m.name}{" "}
                  <span className="font-normal text-muted-foreground">
                    · {m.email}
                  </span>
                </p>
                <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                  {m.body}
                </p>
              </div>
              <Badge className="capitalize shrink-0">{m.status}</Badge>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
