"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToast } from "@/components/ui/toast";
import { useTheme } from "@/hooks/useTheme";
import { getRoleHomeRoute } from "@/config/role-routing";
import { apiClient } from "@/lib/api";
import { loginFormSchema } from "@/schemas/auth.schema";


function SplitLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect");
  const toast = useToast();
  const { user: authUser, accessToken, setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});

  // Auto-redirect if already authenticated with a valid JWT and cookie
  useEffect(() => {
    if (accessToken && accessToken.includes(".") && authUser) {
      if (typeof document !== "undefined" && document.cookie.includes("prime_access_token=")) {
        let destination = redirectUrl;
        if (!destination || destination === "/" || destination.startsWith("/login")) {
          const userRole = (authUser.role as string || "").toLowerCase();
          if (userRole === "customer" || (authUser as any).userType === "customer") {
            destination = "/portal";
          } else if (userRole === "platform_owner" || userRole === "super_admin") {
            destination = "/platform";
          } else if (userRole === "field_engineer" || (authUser as any).department === "field_operations") {
            destination = "/company/tickets";
          } else {
            destination = getRoleHomeRoute(userRole);
          }
        }
        window.location.href = destination;
      }
    }
  }, [accessToken, authUser, redirectUrl]);

  // Clean up any stale/circular redirect parameters in the URL
  useEffect(() => {
    if (redirectUrl === "/" || redirectUrl === "/login" || redirectUrl?.startsWith("/login")) {
      router.replace("/");
    }
  }, [redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Client-side Zod boundary validation & sanitization
    const validationResult = loginFormSchema.safeParse({
      identifier: email,
      password,
    });

    if (!validationResult.success) {
      const errors: { identifier?: string; password?: string } = {};
      for (const issue of validationResult.error.issues) {
        if (issue.path[0] === "identifier" && !errors.identifier) {
          errors.identifier = issue.message;
        }
        if (issue.path[0] === "password" && !errors.password) {
          errors.password = issue.message;
        }
      }
      setFieldErrors(errors);
      toast.error(
        "Validation Error",
        errors.identifier || errors.password || "Please check your credentials."
      );
      return;
    }

    const cleanIdentifier = validationResult.data.identifier;
    const cleanPassword = validationResult.data.password;

    setIsLoading(true);

    try {
      const isCustomer = cleanIdentifier.toLowerCase().includes("ali.khan") || cleanIdentifier.toLowerCase().includes("customer");
      const isPlatform = cleanIdentifier.toLowerCase().includes("superadmin") || cleanIdentifier.toLowerCase().includes("primeone.io");

      let loginEndpoint = "/auth/login";
      if (isCustomer) loginEndpoint = "/auth/login/customer";
      else if (isPlatform) loginEndpoint = "/auth/login/platform";

      let payload: Record<string, any>;
      if (isCustomer) {
        payload = { identifier: cleanIdentifier, password: cleanPassword };
      } else if (isPlatform) {
        payload = { email: cleanIdentifier, password: cleanPassword };
      } else {
        payload = { identifier: cleanIdentifier, email: cleanIdentifier, password: cleanPassword };
      }

      const response = await apiClient.post<{
        statusCode: number;
        data: {
          user: any;
          company: any;
          accessToken: string;
          refreshToken: string;
        };
      }>(loginEndpoint, payload);

      const { user, company, accessToken, refreshToken } = response.data.data;

      // Update Zustand Auth Store
      setAuth(user, company, accessToken, refreshToken);

      // Set cookie for Edge proxy
      document.cookie = `prime_access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;

      toast.success(
        `Welcome Back, ${user.displayName || user.name}!`,
        `Authenticated as ${user.role}. Routing to your workspace...`
      );

      // Route destination: strictly prevent looping back to / or /login
      let destination = redirectUrl;
      if (!destination || destination === "/" || destination.startsWith("/login")) {
        const userRole = (user.role || "").toLowerCase();
        if (userRole === "customer" || user.userType === "customer") {
          destination = "/portal";
        } else if (userRole === "platform_owner" || userRole === "super_admin") {
          destination = "/platform";
        } else if (userRole === "field_engineer" || user.department === "field_operations") {
          destination = "/company/tickets";
        } else {
          destination = getRoleHomeRoute(userRole);
        }
      }

      window.location.href = destination;
    } catch (err: any) {
      console.error("[Auth] Login error caught:", err);
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Invalid email or password. Please verify your credentials.";

      toast.error("Authentication Failed", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Brand & Title */}
      <div className="space-y-3 text-left">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground font-heading font-extrabold flex items-center justify-center text-sm shadow-xs">
            P1
          </div>
          <span className="font-heading font-extrabold text-2xl text-foreground tracking-tight">
            Prime One
          </span>
        </div>

        <div className="pt-2">
          <h1 className="font-heading font-extrabold text-3xl text-foreground tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to access your operations console
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground block">
            Email or Username
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.identifier) {
                  setFieldErrors((prev) => ({ ...prev, identifier: undefined }));
                }
              }}
              placeholder="name@example.com or username"
              className={`w-full h-12 pl-10 pr-3 text-xs bg-card dark:bg-card-subtle border-2 ${
                fieldErrors.identifier
                  ? "border-destructive dark:border-destructive focus:border-destructive"
                  : "border-black dark:border-white/30 hover:border-black/80 focus:border-black dark:focus:border-white"
              } rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-hidden focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 transition-colors font-mono shadow-xs`}
            />
          </div>
          {fieldErrors.identifier && (
            <p className="text-[11px] text-destructive font-mono mt-1">
              {fieldErrors.identifier}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <button
              type="button"
              onClick={() => toast.info("Password Reset", "Please contact your organization administrator to request a password reset.")}
              className="text-xs text-primary hover:underline font-medium cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              placeholder="••••••••••••"
              className={`w-full h-12 pl-10 pr-10 text-xs bg-card dark:bg-card-subtle border-2 ${
                fieldErrors.password
                  ? "border-destructive dark:border-destructive focus:border-destructive"
                  : "border-black dark:border-white/30 hover:border-black/80 focus:border-black dark:focus:border-white"
              } rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-hidden focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 transition-colors font-mono shadow-xs`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-muted-foreground hover:text-foreground transition-colors p-0.5 cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-[11px] text-destructive font-mono mt-1">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Remember this device */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-border bg-card text-primary focus:ring-primary h-4 w-4 cursor-pointer"
            />
            <span>Remember this device</span>
          </label>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full h-12 justify-center text-xs font-bold rounded-xl shadow-glow-primary cursor-pointer transition-all"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 font-mono uppercase tracking-wider">
                <span>Sign In to Console</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </div>

        {/* Enterprise Security Guarantee */}
        <div className="pt-4 border-t border-border/60">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground/80 py-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>256-Bit Encrypted Enterprise Gateway</span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function UniversalLandingGatewayPage() {
  const { isDark: isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground font-body flex flex-col md:flex-row antialiased selection:bg-primary selection:text-primary-foreground overflow-hidden">

      {/* 1. LEFT PANE: BRAND SHOWCASE & INSPIRATIONAL QUOTE */}
      <div className="hidden md:flex flex-col w-1/2 relative bg-[#040814] border-r border-border overflow-hidden">
        {/* Vibrant Fiber Light Artwork */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/fiber_bg.jpg"
            alt="Enterprise Software Abstract Light Wave"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover opacity-90 scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#040814]/90 via-[#040814]/40 to-[#040814]/20" />
        </div>

        {/* Left Pane Foreground Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12 lg:p-16 text-white">
          {/* Top Inspirational Quote */}
          <div className="space-y-6 pt-4 max-w-lg">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-4 py-1.5 rounded-full backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span className="font-mono text-xs font-bold text-blue-300 tracking-wide uppercase">
                Unified Cloud Platform
              </span>
            </div>

            <blockquote className="space-y-3">
              <p className="font-heading font-extrabold text-3xl lg:text-4xl text-white leading-[1.2] tracking-tight drop-shadow-md">
                “Simplicity is prerequisite for reliability.”
              </p>
              <footer className="text-sm font-mono text-slate-300">
                — Edsger W. Dijkstra
              </footer>
            </blockquote>
          </div>

          {/* Bottom Universal Software Feature Highlights */}
          <div className="space-y-4 pb-4 max-w-lg">
            <div className="rounded-2xl bg-[#091540]/80 backdrop-blur-xl border border-white/10 p-5 shadow-2xl space-y-3">
              <p className="text-sm font-light text-slate-200 leading-relaxed">
                A unified enterprise ecosystem designed to streamline business operations, automate workflows, and deliver real-time operational intelligence across any organization.
              </p>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-300 border-t border-white/10 pt-3">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  99.99% Uptime
                </span>
                <span>•</span>
                <span>Enterprise Security</span>
                <span>•</span>
                <span>Scalable Cloud</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RIGHT PANE: MINIMALIST LOGIN FORM */}
      <div className="w-full md:w-1/2 flex flex-col justify-between min-h-screen p-6 sm:p-12 relative bg-background">
        {/* Top Header Controls */}
        <div className="flex justify-end items-center w-full z-20">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="h-8 px-2.5 font-mono text-xs shadow-xs cursor-pointer rounded-lg"
          >
            {isDarkMode ? (
              <Sun className="h-3.5 w-3.5 text-warning mr-1" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-primary mr-1" />
            )}
            <span>{isDarkMode ? "Light" : "Dark"}</span>
          </Button>
        </div>

        {/* Center Login Form */}
        <div className="flex-1 flex items-center justify-center my-6 z-10">
          <Suspense fallback={<div className="text-xs font-mono text-muted-foreground">Loading workspace gateway...</div>}>
            <SplitLoginForm />
          </Suspense>
        </div>

        {/* Minimal Footer */}
        <footer className="text-center text-xs text-muted-foreground font-mono z-10 pt-4">
          <span>© 2026 Zayan Sheikh. All rights reserved.</span>
        </footer>
      </div>
    </div>
  );
}
