'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Building2,
  CreditCard,
  Server,
  Shield,
  Layers,
  Sparkles,
  Zap,
  Globe,
  Radio,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export const PlatformSidebar: React.FC = () => {
  const pathname = usePathname();

  const platformNavItems = [
    {
      group: 'SaaS Command Center',
      items: [
        {
          name: 'Global Overview',
          href: '/platform',
          icon: <Activity className="w-4 h-4" />,
          badge: 'Live',
          badgeVariant: 'primary' as const,
        },
        {
          name: 'Tenant ISPs & Provisioning',
          href: '/companies',
          icon: <Building2 className="w-4 h-4" />,
          badge: '14 ISPs',
          badgeVariant: 'outline' as const,
        },
        {
          name: 'SaaS Plans & Limits',
          href: '/subscriptions',
          icon: <CreditCard className="w-4 h-4" />,
        },
      ],
    },
    {
      group: 'System & Security',
      items: [
        {
          name: 'Infrastructure Telemetry',
          href: '/system',
          icon: <Server className="w-4 h-4" />,
          badge: '0.3ms',
          badgeVariant: 'info' as const,
        },
        {
          name: 'Security & Audit Logs',
          href: '/audit',
          icon: <Shield className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 h-screen max-h-screen bg-card border-r border-border flex flex-col justify-between flex-shrink-0 z-30 overflow-hidden select-none">
      {/* 1. Dedicated Top Brand Header */}
      <div className="h-16 flex-shrink-0 flex items-center px-4 border-b border-border bg-card">
        <Link href="/platform" className="flex items-center gap-2.5 group">
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
            <div className="font-heading font-bold text-base tracking-tight leading-none text-foreground flex items-center gap-1.5">
              PRIME<span className="text-primary">ONE</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono font-bold">
                ROOT
              </span>
            </div>
            <div className="text-xs text-muted-foreground uppercase font-medium tracking-wider mt-0.5">
              Global SaaS Fleet
            </div>
          </div>
        </Link>
      </div>

      {/* 2. Navigation Groups */}
      <div className="flex-1 min-h-0 p-3.5 space-y-5 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {platformNavItems.map((grp, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-2.5 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {grp.group}
            </div>

            <div className="space-y-0.5">
              {grp.items.map((item, iIdx) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/platform' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={iIdx}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all duration-150',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20 font-semibold'
                        : 'text-foreground/85 hover:text-foreground hover:bg-muted/40'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          'px-1.5 py-0.5 text-xs rounded-full font-medium',
                          isActive
                            ? 'bg-primary-foreground/20 text-primary-foreground'
                            : 'bg-primary/10 text-primary'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer Info */}
      <div className="flex-shrink-0 p-3.5 border-t border-border bg-muted/20 text-xs">
        <div className="flex items-center justify-between text-muted-foreground mb-1 text-xs">
          <span>PostgreSQL RLS</span>
          <span className="text-success font-mono font-medium">100% Enforced</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground/70 text-xs">
          <span>SaaS Super-Admin</span>
          <span className="font-mono">v3.4 Core</span>
        </div>
      </div>
    </aside>
  );
};
