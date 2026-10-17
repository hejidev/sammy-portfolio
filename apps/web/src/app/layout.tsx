import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { AdminShortcut } from "@/components/admin-shortcut";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME || "Studio Portfolio",
    template: `%s · ${process.env.NEXT_PUBLIC_SITE_NAME || "Studio Portfolio"}`,
  },
  description:
    "UI/UX designer portfolio — case studies, process, and contact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased`}
      >
        <ThemeProvider>
          <Providers>
            <AdminShortcut />
            {children}
            <Toaster richColors position="top-right" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
