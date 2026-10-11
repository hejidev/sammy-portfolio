import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-title text-3xl font-semibold">New project</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a case study for the public portfolio
        </p>
      </div>
      <ProjectForm />
    </div>
  );
}
