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
    <header className="sticky top-0 z-40 bg-card border-b-2 border-border h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      {/* Left: Hamburger + Logo & Company */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 border-2 border-border bg-card hover:bg-card-subtle text-foreground"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <Link href="/app/desk" className="flex items-center gap-2.5 group">
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
            <div className="font-heading font-black text-lg tracking-tight leading-none">
              PRIME<span className="text-primary">ONE</span>
            </div>
            <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
              {user?.company?.name || 'PRIME NETWORKS'}
            </div>
          </div>
        </Link>

        {/* Branch Selector Dropdown */}
        <div className="relative hidden md:block ml-2">
          <button
            onClick={() => setBranchOpen(!branchOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-card-subtle border-2 border-border hover:border-primary text-xs font-mono font-bold"
          >
            <Building2 className="w-3.5 h-3.5 text-primary" />
            <span>{currentBranch.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
          </button>

          {branchOpen && (
            <div className="absolute left-0 mt-1 w-60 bg-card border-2 border-border shadow-lg z-50 py-1 font-mono text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground border-b border-border uppercase">
                SWITCH REGIONAL HUB (20)
              </div>
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setActiveBranch(b.id);
                    setBranchOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-card-subtle ${
                    activeBranchId === b.id ? 'bg-primary/10 text-primary font-bold' : 'text-foreground'
                  }`}
                >
                  <span>{b.name}</span>
                  <Badge variant="outline" size="xs">
                    {b.code}
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
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-card-subtle border border-border text-[10px] font-mono font-bold">
          <span
            className={`w-2 h-2 rounded-none ${
              wsConnected ? 'bg-primary animate-pulse' : 'bg-destructive animate-ping'
            }`}
          />
          <span className="text-muted-foreground">
            {wsConnected ? 'WS: SYNCED (0.3ms)' : 'WS: CONNECTING'}
          </span>
        </div>

        {/* Theme Toggle (Icon Only) */}
        <button
          onClick={toggleTheme}
          className="p-2 border-2 border-border bg-card hover:bg-card-subtle text-foreground text-xs font-mono font-bold flex items-center justify-center shadow-sm cursor-pointer"
          title={isDark ? "Switch to Blueprint Light" : "Switch to Terminal Dark"}
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
          className="relative p-2 border-2 border-border bg-card hover:bg-card-subtle text-foreground"
          title="Notifications"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive" />
        </button>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 pr-2.5 bg-card hover:bg-card-subtle border-2 border-border text-xs font-mono font-bold"
          >
            <Avatar name={user?.fullName || 'Moiz'} size="sm" status="online" />
            <div className="hidden md:block text-left">
              <div className="leading-tight truncate max-w-[120px]">{user?.displayName || user?.fullName}</div>
              <div className="text-[9px] text-muted-foreground uppercase">{user?.designation}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-0.5" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-1 w-56 bg-card border-2 border-border shadow-lg z-50 py-1 font-mono text-xs">
              <div className="px-3.5 py-2 border-b border-border bg-card-subtle">
                <div className="font-bold text-foreground">{user?.fullName}</div>
                <div className="text-[10px] text-muted-foreground truncate">{user?.email}</div>
                <div className="mt-1">
                  <Badge variant="primary" size="xs">
                    {user?.department?.toUpperCase()} // {user?.userType?.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <Link
                href="/app/staff"
                onClick={() => setProfileOpen(false)}
                className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-card-subtle text-foreground"
              >
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                <span>My Profile</span>
              </Link>

              <Link
                href="/app/roles"
                onClick={() => setProfileOpen(false)}
                className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-card-subtle text-foreground"
              >
                <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                <span>RBAC Permissions</span>
              </Link>

              <div className="border-t border-border mt-1 pt-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-destructive hover:bg-destructive-light font-bold"
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
