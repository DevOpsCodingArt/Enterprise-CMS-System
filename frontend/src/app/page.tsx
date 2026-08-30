"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Building2,
  Users,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/useAuthStore";
import { staggerContainer, staggerItem } from "@/lib/motion";

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
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading font-extrabold text-sm shadow-xs">
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
        <div className="text-center space-y-2.5 max-w-2xl mx-auto relative">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-mono font-bold text-primary mb-1 shadow-2xs">
            <Sparkles className="h-3 w-3" />
            <span>UNIFIED PORTAL GATEWAY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground tracking-tight leading-heading">
            Select Your Operating Portal
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-body">
            Choose your dedicated workspace tier. Each portal is isolated, permission-gated, and engineered with calibrated design system tokens.
          </p>
        </div>

        {/* 3 Dedicated Portal Cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1: Platform Owner Portal */}
          <motion.div variants={staggerItem} className="h-full">
            <Card className="flex flex-col justify-between h-full bg-card border-border shadow-ambient hover:border-primary/50 hover:bg-card-hover transition-all duration-200 group">
              <CardHeader className="p-5 border-b border-border bg-card-subtle/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform border border-primary/20">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <Badge variant="info" className="font-mono text-[10px]">
                    LEVEL 1
                  </Badge>
                </div>
                <CardTitle className="text-base font-heading font-bold">
                  Platform Owner Portal
                </CardTitle>
                <CardDescription className="text-xs leading-body">
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
                  <Button variant="outline" className="w-full justify-between text-xs group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors font-medium">
                    <span>Open Fleet Console</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Card 2: Company Operations Portal (Recommended) */}
          <motion.div variants={staggerItem} className="h-full">
            <Card className="flex flex-col justify-between h-full bg-card border-border shadow-elevated hover:border-primary ring-2 ring-primary/20 hover:bg-card-hover transition-all duration-200 group relative">
              <CardHeader className="p-5 border-b border-border bg-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground group-hover:scale-105 transition-transform shadow-glow-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <Badge variant="success" hasPulse className="font-mono text-[10px]">
                    RECOMMENDED
                  </Badge>
                </div>
                <CardTitle className="text-base font-heading font-bold">
                  Company Operations Portal
                </CardTitle>
                <CardDescription className="text-xs leading-body">
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
                  <Button variant="primary" className="w-full justify-between text-xs font-bold shadow-glow-primary">
                    <span>Enter Operations Command</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Card 3: Customer Self-Service Portal */}
          <motion.div variants={staggerItem} className="h-full">
            <Card className="flex flex-col justify-between h-full bg-card border-border shadow-ambient hover:border-primary/50 hover:bg-card-hover transition-all duration-200 group">
              <CardHeader className="p-5 border-b border-border bg-card-subtle/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform border border-primary/20">
                    <Users className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    SUBSCRIBER
                  </Badge>
                </div>
                <CardTitle className="text-base font-heading font-bold">
                  Customer Self-Care Portal
                </CardTitle>
                <CardDescription className="text-xs leading-body">
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
                  <Button variant="outline" className="w-full justify-between text-xs group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors font-medium">
                    <span>Enter Subscriber Portal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 px-4 text-center text-xs text-muted-foreground font-mono">
        Prime One SaaS Telecom Operating System • Enterprise Multi-Tenant Engine
      </footer>
    </div>
  );
}

