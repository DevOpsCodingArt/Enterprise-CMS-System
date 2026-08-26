import type { Metadata, Viewport } from "next";
import Script from "next/script";
import {
  Plus_Jakarta_Sans,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

/* ----------------------------------------------------------------
   PREMIUM TYPOGRAPHY
   - Plus Jakarta Sans: Editorial / Modern Headings & Display
   - Inter: Pixel-perfect UI body & high-density data readability
   - JetBrains Mono: Telemetry / IP Addresses / Optical dBm / Codes
   ---------------------------------------------------------------- */

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/* ----------------------------------------------------------------
   METADATA & VIEWPORT
   ---------------------------------------------------------------- */

export const metadata: Metadata = {
  title: {
    default: "Prime One // Telecom Operating System",
    template: "%s — Prime One",
  },
  description:
    "Next-Generation Multi-Tenant SaaS Platform for ISP & Telecom Operations. Manage subscribers, infrastructure, billing, and field operations from a unified command center.",
  keywords: [
    "telecom",
    "ISP",
    "operations",
    "network management",
    "multi-tenant",
    "SaaS",
  ],
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3F8FE" },
    { media: "(prefers-color-scheme: dark)", color: "#091540" },
  ],
  width: "device-width",
  initialScale: 1,
};

/* ----------------------------------------------------------------
   ROOT LAYOUT (Light Mode Default)
   ---------------------------------------------------------------- */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head />
      <body className="min-h-screen bg-background text-foreground font-body antialiased selection:bg-primary selection:text-primary-foreground tracking-[-0.01em]">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('theme');
                if (stored === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
