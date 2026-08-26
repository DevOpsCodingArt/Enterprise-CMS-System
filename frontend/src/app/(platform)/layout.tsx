"use client";

import React from "react";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {children}
    </div>
  );
}
