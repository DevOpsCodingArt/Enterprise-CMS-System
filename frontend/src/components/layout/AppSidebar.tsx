'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useThemeStore } from '@/stores/theme-store';
import {
  MessageSquare,
  Users,
  Ticket,
  UserCheck,
  Shield,
  Building2,
  Gauge,
  BarChart3,
  Clock,
  Zap,
  Smartphone,
  Layers,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const { hasPermission, user } = useAuthStore();
  const { sidebarCollapsed } = useThemeStore();

  const navigationGroups = [
    {
      group: 'OPERATIONS',
      items: [
        {
          name: 'PRIME DESK (CHAT)',
          href: '/app/desk',
          icon: <MessageSquare className="w-4 h-4" />,
          permission: 'chat.view',
          badge: 'LIVE',
          badgeVariant: 'primary' as const,
        },
        {
          name: 'CUSTOMER DIRECTORY',
          href: '/app/customers',
          icon: <Users className="w-4 h-4" />,
          permission: 'customers.view',
        },
        {
          name: 'CUSTOMER SIMULATOR',
          href: '/customer/chat',
          icon: <Smartphone className="w-4 h-4 text-info" />,
          badge: 'TEST',
          badgeVariant: 'info' as const,
        },
      ],
    },
    {
      group: 'ADMINISTRATION',
      items: [
        {
          name: 'STAFF & INVITES',
          href: '/app/staff',
          icon: <UserCheck className="w-4 h-4" />,
          permission: 'users.view',
        },
        {
          name: 'RBAC PERMISSION MATRIX',
          href: '/app/roles',
          icon: <Shield className="w-4 h-4" />,
          permission: 'users.view',
        },
        {
          name: '20 REGIONAL HUBS',
          href: '/app/branches',
          icon: <Building2 className="w-4 h-4" />,
          permission: 'users.view',
        },
      ],
    },
    {
      group: 'NOC & SETTINGS',
      items: [
        {
          name: 'SUPERVISOR LIVE HUD',
          href: '/app/supervisor',
          icon: <Gauge className="w-4 h-4" />,
          permission: 'reports.view',
        },
        {
          name: 'ANALYTICS & CSAT',
          href: '/app/reports',
          icon: <BarChart3 className="w-4 h-4" />,
          permission: 'reports.view',
        },
        {
          name: 'WORKING HOURS // SLA',
          href: '/app/settings/working-hours',
          icon: <Clock className="w-4 h-4" />,
          permission: 'users.view',
        },
        {
          name: 'CANNED REPLIES (/)',
          href: '/app/settings/quick-replies',
          icon: <Zap className="w-4 h-4" />,
          permission: 'chat.view',
        },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        'w-64 bg-card border-r-2 border-border flex flex-col justify-between flex-shrink-0 z-30',
        sidebarCollapsed ? 'hidden lg:flex' : 'flex'
      )}
    >
      {/* Top Menu Links */}
      <div className="p-3.5 space-y-5 overflow-y-auto">
        {navigationGroups.map((grp, gIdx) => {
          // Filter items by permission
          const visibleItems = grp.items.filter(
            (item) => !item.permission || hasPermission(item.permission)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-1">
              <div className="px-2.5 py-1 font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {grp.group}
              </div>

              <div className="space-y-0.5">
                {visibleItems.map((item, iIdx) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={iIdx}
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 text-xs font-mono font-bold uppercase border',
                        isActive
                          ? 'bg-primary text-primary-foreground border-border shadow-sm'
                          : 'bg-transparent text-foreground hover:bg-card-subtle border-transparent'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.name}</span>
                      </div>

                      {item.badge && (
                        <Badge
                          variant={isActive ? 'default' : item.badgeVariant || 'default'}
                          size="xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Footer Info */}
      <div className="p-3.5 border-t-2 border-border bg-card-subtle text-xs font-mono">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
          <span>SYS_CORE</span>
          <span className="text-primary font-bold">ONLINE (0.3ms)</span>
        </div>
        <div className="flex items-center justify-between text-[9px] text-muted-foreground">
          <span>PRIME ONE OS</span>
          <span>V3.4 // ENTERPRISE</span>
        </div>
      </div>
    </aside>
  );
};
