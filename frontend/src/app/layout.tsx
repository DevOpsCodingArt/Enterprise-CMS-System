import type { Metadata } from "next";
import { Bricolage_Grotesque, Epilogue, IBM_Plex_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-heading-main",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const epilogue = Epilogue({
  variable: "--font-body-main",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono-main",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Prime One // Telecom Operating System",
  description: "Next-Generation Multi-Tenant SaaS Telecom Operations & Customer Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${epilogue.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-body bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
