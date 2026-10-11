"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OtpRequestSchema, OtpVerifySchema } from "@ux-portfolio/shared";
import type { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

type EmailValues = z.infer<typeof OtpRequestSchema>;
type OtpValues = z.infer<typeof OtpVerifySchema>;

export default function GatePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(OtpRequestSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(OtpVerifySchema),
    defaultValues: { email: "", otp: "" },
  });

  const requestOtp = useMutation({
    mutationFn: (values: EmailValues) =>
      api.post<{ success: boolean; message: string }>("/auth/otp/request", values),
    onSuccess: (res, values) => {
      toast.success(res.message);
      setEmail(values.email);
      otpForm.setValue("email", values.email);
      setStep("otp");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const verifyOtp = useMutation({
    mutationFn: (values: OtpValues) =>
      api.post<{ success: boolean }>("/auth/otp/verify", values),
    onSuccess: () => {
      toast.success("Welcome back");
      router.replace("/admin");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="display-title text-2xl">Access</CardTitle>
          <CardDescription>
            {step === "email"
              ? "Enter your authorized email to receive a one-time code."
              : `Enter the 6-digit code sent to ${email}.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" ? (
            <form
              className="space-y-4"
              onSubmit={emailForm.handleSubmit((v) => requestOtp.mutate(v))}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...emailForm.register("email")}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={requestOtp.isPending}
              >
                {requestOtp.isPending ? "Sending…" : "Send code"}
              </Button>
            </form>
          ) : (
            <form
              className="space-y-4"
              onSubmit={otpForm.handleSubmit((v) => verifyOtp.mutate(v))}
            >
              <input type="hidden" {...otpForm.register("email")} />
              <div className="space-y-2">
                <Label htmlFor="otp">One-time code</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  {...otpForm.register("otp")}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={verifyOtp.isPending}
              >
                {verifyOtp.isPending ? "Verifying…" : "Continue"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setStep("email")}
              >
                Use a different email
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
      <p className="mt-6 text-xs text-muted-foreground">
        Restricted area · Ctrl+Shift+O
      </p>
    </div>
  );
}
