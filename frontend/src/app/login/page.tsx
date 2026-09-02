"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Building2,
  Users,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  ChevronLeft,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToast } from "@/components/ui/toast";
import { DEMO_USERS, DemoUserCredential, getRoleHomeRoute } from "@/config/role-routing";
import { mockDb } from "@/mock/db";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const toast = useToast();
  const { setAuth, switchDemoRole } = useAuthStore();

  const [email, setEmail] = useState("owner@primenetworks.pk");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<DemoUserCredential | null>(DEMO_USERS[0]);

  // Autofill demo persona
  const handleSelectPersona = (persona: DemoUserCredential) => {
    setSelectedPersona(persona);
    setEmail(persona.email);
    setPassword(persona.password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Required Fields Missing", "Please enter both your email address and password.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Find matching user or fallback to company owner
      const matchedPersona =
        DEMO_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || DEMO_USERS[0];

      // Update Zustand Auth Store
      const userProfile = mockDb.users[matchedPersona.role as keyof typeof mockDb.users] || mockDb.users.company_owner;
      setAuth(userProfile, mockDb.tenantCompany, "mock-jwt-token-prime-one", "mock-jwt-refresh-token");

      // Set cookie for Edge proxy
      document.cookie = `prime_access_token=mock-jwt-token-prime-one; path=/; max-age=86400; SameSite=Lax`;

      toast.success(
        `Welcome Back, ${matchedPersona.name}!`,
        `Authenticated as ${matchedPersona.badgeLabel}. Routing to your workspace...`
      );

      // Route destination: search redirect or role home route
      const destination = redirectUrl || matchedPersona.homeRoute;
      router.push(destination);
    }, 600);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* 1. Header Card */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-mono font-bold text-primary mb-1 shadow-2xs">
          <Sparkles className="h-3 w-3" />
          <span>PRIME ONE ENTERPRISE OS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground tracking-tight">
          Sign In to Your Console
        </h1>
        <p className="text-xs text-muted-foreground">
          Enter your credentials to access your unified telecom workspace.
        </p>
      </div>

      {/* 2. Login Card */}
      <Card className="bg-card border-border shadow-elevated overflow-hidden">
        <form onSubmit={handleSubmit}>
          <CardHeader className="p-5 border-b border-border bg-card-subtle/50 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Universal Account Login
              </span>
              {selectedPersona && (
                <Badge variant={selectedPersona.badgeVariant} className="text-[10px] py-0 px-2 font-mono font-bold">
                  {selectedPersona.badgeLabel}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center justify-between">
                <span>Email Address / Username</span>
                <span className="text-[10px] text-muted-foreground font-mono">Required</span>
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    const match = DEMO_USERS.find((u) => u.email.toLowerCase() === e.target.value.toLowerCase());
                    setSelectedPersona(match || null);
                  }}
                  placeholder="name@primenetworks.pk"
                  required
                  className="w-full h-10 pl-9 pr-3 text-xs bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Password</label>
                <button
                  type="button"
                  onClick={() => toast.info("Demo Mode", "Password for all demo accounts is password123")}
                  className="text-[11px] text-primary hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full h-10 pl-9 pr-10 text-xs bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-border bg-background text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span>Keep me signed in</span>
              </label>
              <span className="font-mono text-[10px] text-success flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>SSL Encrypted</span>
              </span>
            </div>
          </CardContent>

          <CardFooter className="p-5 pt-0 flex flex-col gap-3">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full h-10 justify-center text-xs font-bold shadow-glow-primary cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Sign In to Console</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* 3. One-Click Demo Personas Bar */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
            Fast One-Click Demo Logins
          </span>
          <span className="text-[10px] font-mono text-primary font-medium">Click to Autofill</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DEMO_USERS.map((persona) => {
            const isSelected = selectedPersona?.email === persona.email;
            return (
              <button
                key={persona.email}
                type="button"
                onClick={() => handleSelectPersona(persona)}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-16 ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/20"
                    : "border-border bg-card hover:bg-muted/50 hover:border-border-hover"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-bold text-foreground truncate">{persona.name.split(" ")[0]}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-primary" : "bg-muted-foreground/40"}`} />
                </div>
                <span className="font-mono text-[9px] text-muted-foreground truncate">{persona.badgeLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useTheme } from "@/hooks/useTheme";

export default function LoginPage() {
  const { isDark: isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground font-body flex flex-col justify-between relative overflow-hidden">
      {/* Subtle Background Glow Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="flex h-16 w-full items-center justify-between px-4 md:px-8 border-b border-border bg-card/60 backdrop-blur-md shrink-0 z-10">
        <Link href="/" className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium">
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Landing Page</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-heading font-extrabold text-xs shadow-xs">
            P1
          </div>
          <span className="font-heading font-bold text-xs text-foreground hidden sm:inline">
            Prime One
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="h-8 px-2.5 font-mono text-xs shadow-xs cursor-pointer"
        >
          {isDarkMode ? (
            <Sun className="h-3.5 w-3.5 text-warning mr-1" />
          ) : (
            <Moon className="h-3.5 w-3.5 text-primary mr-1" />
          )}
          <span>{isDarkMode ? "Light" : "Dark"}</span>
        </Button>
      </header>

      {/* Center Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 z-10">
        <Suspense fallback={<div className="text-xs font-mono text-muted-foreground">Loading authentication...</div>}>
          <LoginForm />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-3 px-4 text-center text-[11px] text-muted-foreground font-mono shrink-0 z-10">
        Prime One Enterprise Operating System • Role-Isolated Defense-in-Depth Architecture
      </footer>
    </div>
  );
}
