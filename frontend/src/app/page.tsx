"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  Users,
  ArrowRight,
  Radio,
  Activity,
  Zap,
  Layers,
  Sun,
  Moon,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Ticket,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/useAuthStore";
import { mockDb } from "@/mock/db";

export default function UniversalGatewayPage() {
  const { user } = useAuthStore();
  const isDarkMode = React.useSyncExternalStore(
    (callback) => {
      window.addEventListener("theme-change", callback);
      return () => window.removeEventListener("theme-change", callback);
    },
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
    () => false
  );

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    window.dispatchEvent(new Event("theme-change"));
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body flex flex-col justify-between">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/90 backdrop-blur-md px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading font-extrabold text-sm shadow-sm">
            P1
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-sm text-foreground">
                Prime One // Telecom OS
              </span>
              <Badge variant="success" hasPulse className="text-[9px] py-0 px-1.5 font-mono">
                FLEET ONLINE
              </Badge>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground block">
              Multi-Tenant ISP Command Architecture
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="h-8 px-2.5 font-mono text-xs shadow-xs"
          >
            {isDarkMode ? (
              <Sun className="h-3.5 w-3.5 text-warning mr-1" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-primary mr-1" />
            )}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </Button>

          <div className="flex items-center gap-2 border-l border-border pl-3">
            <Avatar name={user?.name || "Admin"} presence="online" size="sm" />
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-foreground">{user?.name}</span>
              <span className="font-mono text-[9px] text-muted-foreground uppercase">
                {user?.role.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Command Gateway Body */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 space-y-8 flex flex-col justify-center">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge variant="info" className="font-mono text-[10px] uppercase">
            Unified Portal Gateway
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground tracking-tight">
            Select Your Operating Portal
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Choose your dedicated workspace tier. Each portal is isolated, permission-gated, and engineered with zero hardcoded styling.
          </p>
        </div>

        {/* 3 Dedicated Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Platform Owner Portal */}
          <Card className="flex flex-col justify-between bg-card border-border shadow-xs hover:border-primary transition-all duration-200 group">
            <CardHeader className="p-5 border-b border-border bg-card-subtle/40">
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <Badge variant="info" className="font-mono text-[10px]">
                  LEVEL 1
                </Badge>
              </div>
              <CardTitle className="text-base font-heading font-bold">
                Platform Owner Portal
              </CardTitle>
              <CardDescription className="text-xs">
                SaaS Super-Admin control plane for global fleet management and tenant provisioning.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-3 text-xs flex-1">
              <div className="flex justify-between items-center py-1 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Active ISP Tenants:</span>
                <span className="font-mono font-bold text-foreground">8 Companies</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Total Subscribers:</span>
                <span className="font-mono font-bold text-foreground">480,200</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Monthly SaaS MRR:</span>
                <span className="font-mono font-bold text-success">$142,500</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground font-mono">Infrastructure SLA:</span>
                <span className="font-mono font-bold text-success">99.99%</span>
              </div>
            </CardContent>

            <CardFooter className="p-5 pt-0">
              <Link href="/platform" className="w-full">
                <Button variant="outline" className="w-full justify-between text-xs group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                  <span>Enter SaaS Master Console</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Card 2: Company Operations Portal */}
          <Card className="flex flex-col justify-between bg-card border-border shadow-xs hover:border-primary ring-1 ring-primary/20 transition-all duration-200 group">
            <CardHeader className="p-5 border-b border-border bg-primary/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground group-hover:scale-105 transition-transform shadow-xs">
                  <Building2 className="h-5 w-5" />
                </div>
                <Badge variant="success" className="font-mono text-[10px]">
                  LEVEL 2 & 3
                </Badge>
              </div>
              <CardTitle className="text-base font-heading font-bold">
                Company Operations Portal
              </CardTitle>
              <CardDescription className="text-xs">
                Command center for ISP Owners, Branch Managers, NOC Engineers, and Helpdesk CSRs.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-3 text-xs flex-1">
              <div className="flex justify-between items-center py-1 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Active Tenant:</span>
                <span className="font-bold text-foreground truncate max-w-[140px]">Prime Networks PK</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Branch Offices:</span>
                <span className="font-mono font-bold text-foreground">20 Active Hubs</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Prime Desk Queue:</span>
                <span className="font-mono font-bold text-warning">3 Live Chats</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground font-mono">Optical Health (Rx):</span>
                <span className="font-mono font-bold text-success">-18.4 dBm Avg</span>
              </div>
            </CardContent>

            <CardFooter className="p-5 pt-0">
              <Link href="/company" className="w-full">
                <Button variant="primary" className="w-full justify-between text-xs shadow-xs">
                  <span>Enter Operations Command</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Card 3: Customer Self-Service Portal */}
          <Card className="flex flex-col justify-between bg-card border-border shadow-xs hover:border-primary transition-all duration-200 group">
            <CardHeader className="p-5 border-b border-border bg-card-subtle/40">
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                  <Users className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  SUBSCRIBER
                </Badge>
              </div>
              <CardTitle className="text-base font-heading font-bold">
                Customer Self-Care Portal
              </CardTitle>
              <CardDescription className="text-xs">
                End-user subscriber portal for optical line tests, invoices, complaints, and live chat.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-3 text-xs flex-1">
              <div className="flex justify-between items-center py-1 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Demo Subscriber:</span>
                <span className="font-bold text-foreground">Ahmed Malik</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Package Plan:</span>
                <span className="font-mono font-bold text-foreground">50 Mbps Fiber</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Fiber Diagnostics:</span>
                <span className="font-mono font-bold text-success">Live Light Test</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground font-mono">Billing & Support:</span>
                <span className="font-mono font-bold text-foreground">ZL Ultra Sync</span>
              </div>
            </CardContent>

            <CardFooter className="p-5 pt-0">
              <Link href="/portal" className="w-full">
                <Button variant="outline" className="w-full justify-between text-xs group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                  <span>Enter Subscriber Portal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 px-4 text-center text-xs text-muted-foreground font-mono">
        Prime One SaaS Telecom Operating System • Enterprise Multi-Tenant Engine
      </footer>
    </div>
  );
}
