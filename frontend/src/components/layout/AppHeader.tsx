'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useThemeStore } from '@/stores/theme-store';
import { socketManager } from '@/lib/socket';
import {
  Sun,
  Moon,
  Wifi,
  ChevronDown,
  Building2,
  LogOut,
  User,
  Shield,
  Bell,
  Menu,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

export const AppHeader: React.FC = () => {
  const { user, logout, activeBranchId, setActiveBranch } = useAuthStore();
  const { isDark, toggleTheme, toggleSidebar } = useThemeStore();
  const [wsConnected, setWsConnected] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);

  // Monitor Socket Status
  useEffect(() => {
    const socket = socketManager.connect();
    setWsConnected(socket.connected);

    const onConnect = () => setWsConnected(true);
    const onDisconnect = () => setWsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const branches = [
    { id: 'br_isb_f10', name: 'ISB F-10 Main Hub', code: 'ISB-F10' },
    { id: 'br_isb_g11', name: 'ISB G-11 Sub-Station', code: 'ISB-G11' },
    { id: 'br_isb_blue', name: 'Blue Area Corporate Core', code: 'ISB-BLUE' },
    { id: 'br_rwp_sdr', name: 'RWP Saddar Hub', code: 'RWP-SDR' },
  ];

  const currentBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border h-16 flex items-center justify-between px-4 sm:px-6 shadow-xs">
      {/* Left: Hamburger + Logo & Company */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <Link href="/desk" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image
              src="/prime-logo.png"
              alt="Prime Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="font-heading font-bold text-lg tracking-tight leading-none text-foreground">
              PRIME<span className="text-primary">ONE</span>
            </div>
            <div className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider mt-0.5">
              {user?.company?.name || 'Prime Networks'}
            </div>
          </div>
        </Link>

        {/* Branch Selector Dropdown */}
        <div className="relative hidden md:block ml-2">
          <button
            onClick={() => setBranchOpen(!branchOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/40 border border-border hover:border-primary/50 text-xs font-medium text-foreground transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-primary" />
            <span>{currentBranch.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
          </button>

          {branchOpen && (
            <div className="absolute left-0 mt-1.5 w-64 rounded-xl bg-card border border-border shadow-lg z-50 py-1.5 text-xs">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground border-b border-border/70 uppercase tracking-wider">
                Switch Regional Hub (20)
              </div>
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setActiveBranch(b.id);
                    setBranchOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-muted/40 transition-colors ${
                    activeBranchId === b.id ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
                  }`}
                >
                  <span>{b.name}</span>
                  <Badge variant="outline" size="xs">
                    <span className="font-mono text-[10px]">{b.code}</span>
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: WS Indicator + Toggles + Notifications + Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Socket.io Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-muted/40 border border-border/80 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              wsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-destructive animate-ping'
            }`}
          />
          <span className="text-muted-foreground text-[11px]">
            {wsConnected ? (
              <span>WS: <span className="font-mono font-medium text-foreground">Synced (0.3ms)</span></span>
            ) : (
              'WS: Connecting'
            )}
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
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
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
        </button>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-card hover:bg-muted border border-border text-xs transition-colors"
          >
            <Avatar name={user?.fullName || 'Moiz'} size="sm" status="online" />
            <div className="hidden md:block text-left">
              <div className="leading-tight font-medium text-foreground truncate max-w-[120px]">
                {user?.displayName || user?.fullName}
              </div>
              <div className="text-[10px] text-muted-foreground">{user?.designation}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-0.5" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-1.5 w-60 rounded-xl bg-card border border-border shadow-lg z-50 py-1.5 text-xs">
              <div className="px-3.5 py-2.5 border-b border-border/70 bg-muted/20">
                <div className="font-semibold text-foreground">{user?.fullName}</div>
                <div className="text-[11px] text-muted-foreground truncate">{user?.email}</div>
                <div className="mt-1.5">
                  <Badge variant="primary" size="xs">
                    {user?.department} · {user?.userType}
                  </Badge>
                </div>
              </div>

              <Link
                href="/staff"
                onClick={() => setProfileOpen(false)}
                className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-muted/40 text-foreground transition-colors"
              >
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                <span>My Profile</span>
              </Link>

              <Link
                href="/roles"
                onClick={() => setProfileOpen(false)}
                className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-muted/40 text-foreground transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                <span>RBAC Permissions</span>
              </Link>

              <div className="border-t border-border/70 mt-1 pt-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-destructive hover:bg-destructive/10 font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
