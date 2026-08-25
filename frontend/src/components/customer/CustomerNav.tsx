'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Receipt,
  LifeBuoy,
  UserCheck,
  Zap,
} from 'lucide-react';
import { useCustomerPortalStore } from '@/stores/customer-portal-store';
import { Badge } from '@/components/ui/Badge';

export function CustomerNav() {
  const pathname = usePathname();
  const { tickets } = useCustomerPortalStore();

  const activeTicketsCount = tickets.filter(
    (t) => t.status !== 'closed' && t.status !== 'resolved'
  ).length;

  const navItems = [
    {
      href: '/customer',
      label: 'Overview',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/chat',
      label: 'Live Chat',
      icon: MessageSquare,
      badge: null,
    },
    {
      href: '/bills',
      label: 'Bills & Recharge',
      icon: Receipt,
    },
    {
      href: '/tickets',
      label: 'Trouble Tickets',
      icon: LifeBuoy,
      badge: activeTicketsCount > 0 ? activeTicketsCount : null,
    },
    {
      href: '/profile',
      label: 'My Account',
      icon: UserCheck,
    },
  ];

  return (
    <>
      {/* Desktop Navigation Tabs (Hidden on mobile) */}
      <nav className="hidden md:block bg-card/60 border-b border-border/80 sticky top-16 z-30 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-primary'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-white text-primary'
                        : 'bg-primary/15 text-primary'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Sticky Bottom Navigation Bar (Visible only on mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border px-2 py-1 shadow-lg">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-colors relative ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 truncate max-w-full">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-4 h-0.5 bg-primary rounded-full mt-0.5" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
