import { cn } from "@/lib/cn";
import { BASE_URL } from "@/lib/url";
import { TRPCProvider } from "@/trpc/client";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "./globals.css";

const displaySans = localFont({
  src: [
    {
      path: "../../public/fonts/PPNeueMontreal-Book.otf",
      weight: "400",
    },
    {
      path: "../../public/fonts/PPNeueMontreal-Medium.otf",
      weight: "500",
    },
    {
      path: "../../public/fonts/PPNeueMontreal-Bold.otf",
      weight: "700",
    },
  ],
  fallback: ["ui-sans-serif", "system-ui", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
  variable: "--font-sans",
});

const displayMono = localFont({
  src: [
    {
      path: "../../public/fonts/PPNeueMontrealMono-Book.otf",
      weight: "400",
    },
    {
      path: "../../public/fonts/PPNeueMontrealMono-Medium.otf",
      weight: "500",
    },
    {
      path: "../../public/fonts/PPNeueMontrealMono-Bold.otf",
      weight: "700",
    },
  ],
  fallback: ["ui-monospace", "system-ui", "monospace", "SFMono-Regular", "Consolas", "monospace"],
  variable: "--font-mono",
});
export const metadata: Metadata = {
  metadataBase: new URL(`https://${BASE_URL}`),
  alternates: {
    canonical: "/",
  },
  title: "working.dev",
  description: "Working is a new toolbox for product builders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(displaySans.variable, displayMono.variable)}>
        <TRPCProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </TRPCProvider>
        <Analytics />
      </body>
    </html>
  );
}
