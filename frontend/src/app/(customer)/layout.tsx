"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wifi,
  PhoneCall,
  Sun,
  Moon,
  LifeBuoy,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { CustomerNav } from "@/components/customer/CustomerNav";

export default function CustomerLayout({
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
    <div className="flex min-h-screen flex-col bg-background text-foreground font-body pb-16 md:pb-6">
      {/* Customer Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/90 backdrop-blur-md px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading font-extrabold text-sm shadow-sm">
            P1
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-sm text-foreground">
                Prime Networks Self-Care
              </span>
              <Badge variant="success" className="text-[9px] py-0 px-1.5 font-mono">
                SUBSCRIBER
              </Badge>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground block">
              Customer Portal • 24/7 Helpline 111-PRIME
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0 font-mono text-xs cursor-pointer rounded-lg shrink-0"
            title="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-warning" />
            ) : (
              <Moon className="h-4 w-4 text-primary" />
            )}
          </Button>

          <Link
            href="/portal/profile"
            className="flex items-center gap-3 border-l border-border pl-3.5 py-0.5 rounded-lg hover:bg-card-subtle transition-colors cursor-pointer"
          >
            <div className="relative">
              <Avatar name="Ahmed Malik" size="md" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground">
                  Ahmed Malik
                </span>
                <Badge variant="success" className="text-[8px] py-0 px-1 font-mono uppercase">
                  ACTIVE
                </Badge>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                CUS-99482 • Islamabad HQ
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-3 md:p-6 max-w-6xl mx-auto w-full space-y-4">
        <CustomerNav />
        {children}
      </main>
    </div>
  );
}
