"use client";

import { useParams } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-title text-3xl font-semibold">Edit project</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update case study content and publish status
        </p>
      </div>
      <ProjectForm projectId={params.id} />
    </div>
  );
}
