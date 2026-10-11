"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactMessageSchema } from "@ux-portfolio/shared";
import type { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { SiteSettings } from "@/hooks/use-public-data";

type FormValues = z.infer<typeof ContactMessageSchema>;

export function ContactSection({ settings }: { settings?: SiteSettings }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(ContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      projectType: "Product design",
      body: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      api.post<{ success: boolean; message: string }>("/contact", values),
    onSuccess: (res) => {
      toast.success(res.message || "Message sent");
      form.reset();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <section id="contact" className="section-pad scroll-mt-20">
      <div className="container-page grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Contact
          </p>
          <h2 className="display-title mt-2 text-3xl font-semibold sm:text-4xl">
            Let&apos;s create something meaningful
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Have a product, brand, or experience in mind? Share a few details and
            I&apos;ll respond within 24 hours.
          </p>
          <dl className="mt-8 space-y-4 text-sm">
            {settings?.contactEmail && (
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{settings.contactEmail}</dd>
              </div>
            )}
            {settings?.contactPhone && (
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-medium">{settings.contactPhone}</dd>
              </div>
            )}
            {settings?.location && (
              <div>
                <dt className="text-muted-foreground">Location</dt>
                <dd className="font-medium">{settings.location}</dd>
              </div>
            )}
          </dl>
        </div>

        <form
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
          className="space-y-4 rounded-xl border border-border bg-card p-6"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Your name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectType">Project type</Label>
            <Input id="projectType" {...form.register("projectType")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea id="body" {...form.register("body")} />
            {form.formState.errors.body && (
              <p className="text-xs text-destructive">
                {form.formState.errors.body.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Sending…" : "Send message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
