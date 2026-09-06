"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Wifi,
  PhoneCall,
  Sun,
  Moon,
  LifeBuoy,
  ShieldCheck,
  ChevronDown,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { CustomerNav } from "@/components/customer/CustomerNav";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToast } from "@/components/ui/toast";
import { useTheme } from "@/hooks/useTheme";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const toast = useToast();
  const { user, logout } = useAuthStore();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isDark: isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    document.cookie = "prime_access_token=; path=/; max-age=0;";
    document.cookie = "prime_refresh_token=; path=/; max-age=0;";
    setIsProfileMenuOpen(false);
    toast.info("Logged Out", "Signed out of Customer Portal.");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-body pb-16 md:pb-6">
      {/* Customer Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/90 backdrop-blur-md px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading font-extrabold text-sm shadow-sm hover:opacity-90 transition-opacity">
            P1
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-sm text-foreground">
                Prime Networks Self-Care
              </span>
              <Badge variant="secondary" className="text-[9px] py-0 px-1.5 font-mono">
                SUBSCRIBER PORTAL
              </Badge>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground block">
              Customer Portal • 24/7 Helpline 111-PRIME
            </span>
          </div>
        </div>

        {/* Action Controls & Profile Menu */}
        <div className="flex items-center gap-3">
          {/* Fiber Link Status indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card-subtle text-xs font-mono">
            <Wifi className="h-3.5 w-3.5 text-success" />
            <span className="text-muted-foreground">GPON Link:</span>
            <span className="text-success font-bold">ACTIVE (100 Mbps)</span>
          </div>

          {/* Quick Support Link */}
          <a
            href="tel:111774631"
            className="hidden md:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors p-2"
          >
            <PhoneCall className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono">111-PRIME</span>
          </a>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0 font-mono text-xs shadow-xs rounded-lg cursor-pointer"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-warning" />
            ) : (
              <Moon className="h-4 w-4 text-primary" />
            )}
          </Button>

          {/* Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 border-l border-border pl-3.5 py-0.5 hover:opacity-80 transition-opacity cursor-pointer select-none text-left"
            >
              <Avatar name={user?.name || "Subscriber"} presence="online" size="sm" />
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-foreground leading-tight">
                  {user?.name || "Ali Khan"}
                </span>
                <span className="font-mono text-[9px] text-muted-foreground">
                  Sub-049281
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block ml-0.5" />
            </button>

            {/* Profile Dropdown - STRICT SESSION LOCK (NO PERSONA SWITCHER) */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-2">
                <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground truncate">{user?.name || "Ali Khan"}</span>
                    <Badge variant="success" className="text-[9px] py-0 px-1.5 font-mono">
                      SUBSCRIBER
                    </Badge>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground block truncate">
                    {user?.email || "ali.khan@gmail.com"}
                  </span>
                  <div className="pt-1.5 flex items-center gap-1.5 text-[10px] font-mono text-emerald-500 font-semibold border-t border-border/40">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Customer Session Locked</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-1 border-t border-border space-y-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-2.5 py-2 rounded-lg text-xs text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-between cursor-pointer font-bold"
                  >
                    <span>Sign Out</span>
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
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
