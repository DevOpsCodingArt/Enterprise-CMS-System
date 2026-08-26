import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prime One // Telecom Operating System",
  description: "Next-Generation Multi-Tenant SaaS Telecom Operations Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
