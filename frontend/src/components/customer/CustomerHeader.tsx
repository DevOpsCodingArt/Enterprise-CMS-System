'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Wifi,
  Sun,
  Moon,
  Shield,
  Zap,
  Activity,
  ArrowRightLeft,
  LogOut,
  Sliders,
} from 'lucide-react';
import { useCustomerPortalStore } from '@/stores/customer-portal-store';
import { useThemeStore } from '@/stores/theme-store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function CustomerHeader() {
  const {
    customer,
    opticalRxDbm,
    opticalStatus,
    pppoeStatus,
    simulateOpticalCut,
    simulateRestoreLink,
  } = useCustomerPortalStore();

  const { isDark, toggleTheme } = useThemeStore();

  const isOnline = pppoeStatus === 'online';

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand / Tenant Identity */}
        <div className="flex items-center gap-3">
          <Link href="/customer" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform overflow-hidden relative">
              <Image
                src="/prime-logo.png"
                alt="Prime One"
                width={28}
                height={28}
                className="object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-heading font-bold text-xs">P</span>
            </div>
            <div>
              <div className="font-heading font-bold text-sm tracking-tight text-foreground flex items-center gap-1.5">
                Prime One <span className="text-[10px] text-muted-foreground font-normal">Broadband</span>
              </div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span>{customer.branch?.name || 'Islamabad F-10'}</span>
              </div>
            </div>
          </Link>

          {/* Optical Telemetry Pill */}
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-border">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${
                isOnline
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 animate-pulse'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                }`}
              />
              <span className="font-semibold">{isOnline ? 'Connected' : 'Link Offline'}</span>
              <span className="text-muted-foreground">|</span>
              <span>{opticalRxDbm.toFixed(1)} dBm</span>
            </div>
          </div>
        </div>

        {/* Right: Telemetry Triggers & Tools */}
        <div className="flex items-center gap-2">
          {/* Quick Simulation Triggers (for testing/demoing) */}
          <div className="hidden lg:flex items-center gap-1.5 mr-2">
            {opticalStatus === 'nominal' ? (
              <Button
                variant="outline"
                size="xs"
                onClick={simulateOpticalCut}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                Simulate Fiber Cut
              </Button>
            ) : (
              <Button
                variant="outline"
                size="xs"
                onClick={simulateRestoreLink}
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-semibold"
              >
                Restore Fiber Link ✓
              </Button>
            )}
          </div>

          {/* Return to Admin Desk Link */}
          <Link
            href="/desk"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-md border border-border bg-card hover:bg-muted transition-colors"
          >
            <ArrowRightLeft className="w-3 h-3 text-primary" />
            <span>Agent Desk</span>
          </Link>

          {/* Dark / Light Theme Toggle */}
          <Button
            variant="ghost"
            size="xs"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-warning" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </Button>

          {/* Customer Avatar & Status */}
          <Link
            href="/profile"
            className="flex items-center gap-2 pl-2 border-l border-border hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {customer.fullName.charAt(0)}
            </div>
            <div className="hidden xl:block text-left">
              <div className="font-heading font-semibold text-xs text-foreground leading-tight">
                {customer.fullName}
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">
                {customer.customerCode}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
