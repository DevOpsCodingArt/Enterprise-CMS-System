import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  DM_Sans,
  JetBrains_Mono,
} from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

/* ----------------------------------------------------------------
   FONT LOADING
   - Bricolage Grotesque: Headings & Display
   - DM Sans: Body
   - JetBrains Mono: Telemetry / Data / Codes
   ---------------------------------------------------------------- */

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
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
      className={`${bricolage.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/*
          Inline theme-init script: Defaults to Light Mode unless the user has
          explicitly saved 'dark' in localStorage.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  if (stored === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
