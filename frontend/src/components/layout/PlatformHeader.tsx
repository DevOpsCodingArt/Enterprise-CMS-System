'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useThemeStore } from '@/stores/theme-store';
import {
  Sun,
  Moon,
  Activity,
  ArrowRight,
  Shield,
  Bell,
  ChevronDown,
  Building2,
  Server,
  Layers,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

export const PlatformHeader: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border h-16 flex items-center justify-between px-4 sm:px-6 shadow-xs flex-shrink-0">
      {/* Left / Middle: Live Global Telemetry Ticker */}
      <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground overflow-x-auto py-1">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/40 border border-border/70">
          <span className="text-xs">Platform MRR:</span>
          <span className="font-mono font-semibold text-primary">PKR 4.85M</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-muted/40 border border-border/70">
          <span className="text-xs">Active Tenants:</span>
          <span className="font-mono font-semibold text-foreground">14 ISPs</span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-muted/40 border border-border/70">
          <span className="text-xs">Global Subs:</span>
          <span className="font-mono font-semibold text-foreground">48,420</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-muted/40 border border-border/70">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs">Gateway:</span>
          <span className="font-mono font-medium text-success">0.3ms</span>
        </div>
      </div>

      {/* Right: Switch Portal Button + Theme Toggle + Super-Admin Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Switch into Tenant Portal Preview */}
        <Link
          href="/desk"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-medium transition-colors"
          title="Switch into Tenant Console Preview"
        >
          <span>Launch Tenant Console (Prime Networks)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-warning" />
          ) : (
            <Moon className="w-4 h-4 text-foreground" />
          )}
        </button>

        {/* Notifications Icon */}
        <button
          className="relative p-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors"
          title="Platform Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>

        {/* Super-Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-card hover:bg-muted border border-border text-xs transition-colors"
          >
            <Avatar name="Super Admin" size="sm" status="online" />
            <div className="hidden md:block text-left">
              <div className="leading-tight font-semibold text-foreground truncate max-w-32">
                Super Admin
              </div>
              <div className="text-xs font-mono text-primary">Global Root (Tier 1)</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-0.5" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-1.5 w-60 rounded-xl bg-card border border-border shadow-lg z-50 py-1.5 text-xs">
              <div className="px-3.5 py-2.5 border-b border-border/70 bg-muted/20">
                <div className="font-semibold text-foreground">SaaS Platform Operator</div>
                <div className="text-xs text-muted-foreground truncate">superadmin@primeone.io</div>
                <div className="mt-1.5">
                  <Badge variant="primary" size="xs">
                    Full Root Access
                  </Badge>
                </div>
              </div>

              <Link
                href="/platform/system"
                onClick={() => setProfileOpen(false)}
                className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-muted/40 text-foreground transition-colors"
              >
                <Server className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Infrastructure Telemetry</span>
              </Link>

              <Link
                href="/platform/audit"
                onClick={() => setProfileOpen(false)}
                className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-muted/40 text-foreground transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Security & Audit Trail</span>
              </Link>

              <div className="border-t border-border/70 mt-1 pt-1">
                <Link
                  href="/login"
                  onClick={() => setProfileOpen(false)}
                  className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-destructive hover:bg-destructive/10 font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout Super-Admin</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
