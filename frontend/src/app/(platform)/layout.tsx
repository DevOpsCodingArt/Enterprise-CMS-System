"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  Server,
  Activity,
  Layers,
  Sun,
  Moon,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    setIsDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-body">
      {/* Platform Super-Admin Topbar */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/90 backdrop-blur-md px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mr-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Gateway</span>
          </Link>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading font-extrabold text-sm shadow-sm">
            P1
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-sm text-foreground">
                Prime One Super-Admin
              </span>
              <Badge variant="info" className="text-[9px] py-0 px-1.5 font-mono">
                SAAS MASTER
              </Badge>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground block">
              Multi-Tenant Cloud Control Plane
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="success" hasPulse className="text-[10px] font-mono">
            4 CLUSTERS LIVE
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="h-8 px-2.5 font-mono text-xs"
          >
            {isDarkMode ? (
              <Sun className="h-3.5 w-3.5 text-warning" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-primary" />
            )}
          </Button>

          <div className="flex items-center gap-2 border-l border-border pl-3">
            <Avatar name="Platform Super Admin" presence="online" size="sm" />
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-bold text-foreground">Platform Master</span>
              <span className="font-mono text-[9px] text-muted-foreground uppercase">
                Root Access
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
        {children}
      </main>
    </div>
  );
}
