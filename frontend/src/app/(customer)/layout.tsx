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
  Shield,
  ChevronDown,
  LogOut,
  ExternalLink,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { CustomerNav } from "@/components/customer/CustomerNav";
import { useAuthStore } from "@/stores/useAuthStore";
import { DEMO_USERS, DemoUserCredential, getRoleDisplayName } from "@/config/role-routing";
import { mockDb } from "@/mock/db";
import { useToast } from "@/components/ui/toast";
import { useTheme } from "@/hooks/useTheme";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const toast = useToast();
  const { user, setAuth, logout } = useAuthStore();
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

  const handleSwitchPersona = (persona: DemoUserCredential) => {
    const userProfile = mockDb.users[persona.role as keyof typeof mockDb.users] || mockDb.users.company_owner;
    const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
      JSON.stringify({
        id: userProfile.id,
        email: persona.email,
        role: persona.role,
        role_code: persona.role,
        permissions: userProfile.permissions || ["*"],
        exp: Math.floor(Date.now() / 1000) + 86400,
      })
    )}.mock-signature`;
    setAuth(userProfile, mockDb.tenantCompany, mockJwt, "mock-jwt-refresh-token");
    document.cookie = `prime_access_token=${mockJwt}; path=/; max-age=86400; SameSite=Lax`;
    setIsProfileMenuOpen(false);
    toast.success("Switched Persona", `Active as ${persona.name} (${persona.badgeLabel})`);
    router.push(persona.homeRoute);
  };

  const handleLogout = () => {
    logout();
    document.cookie = "prime_access_token=; path=/; max-age=0;";
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

          {/* User Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-3 border-l border-border pl-3.5 py-0.5 rounded-lg hover:bg-card-subtle transition-colors cursor-pointer select-none text-left"
            >
              <div className="relative">
                <Avatar name={user?.name || "Ahmed Malik"} size="md" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-foreground">
                    {user?.name || "Ahmed Malik"}
                  </span>
                  <Badge variant="success" className="text-[8px] py-0 px-1 font-mono uppercase">
                    ACTIVE
                  </Badge>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  CUS-99482 • Islamabad HQ
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block ml-0.5" />
            </button>

            {/* Profile & Switcher Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-2">
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground truncate">{user?.name || "Ahmed Malik"}</span>
                    <Badge variant="secondary" className="text-[9px] py-0 px-1 font-mono">
                      SUBSCRIBER
                    </Badge>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground block truncate">
                    {user?.email || "customer@primenetworks.pk"}
                  </span>
                </div>

                {/* Quick Persona Switcher */}
                <div className="space-y-1">
                  <div className="px-2 py-1 text-[9.5px] font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Zap className="h-3 w-3 text-warning" /> Switch Persona (Demo Mode)
                  </div>
                  <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-0.5">
                    {DEMO_USERS.map((persona) => {
                      const isActive = user?.role?.toLowerCase() === persona.role.toLowerCase();
                      return (
                        <button
                          key={persona.email}
                          type="button"
                          onClick={() => handleSwitchPersona(persona)}
                          className={`w-full px-2 py-1.5 rounded-lg text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${isActive
                              ? "bg-primary/15 text-primary font-bold"
                              : "text-foreground hover:bg-muted"
                            }`}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="truncate">{persona.name}</span>
                            <span className="font-mono text-[9px] text-muted-foreground truncate">{persona.badgeLabel}</span>
                          </div>
                          {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-1 border-t border-border space-y-1">
                  <Link
                    href="/"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full px-2 py-1.5 rounded-lg text-xs text-foreground hover:bg-muted transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Universal Landing Page</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-2 py-1.5 rounded-lg text-xs text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-between cursor-pointer font-medium"
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
