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
      group: 'Operations',
      items: [
        {
          name: 'Prime Desk (Live Chat)',
          href: '/desk',
          icon: <MessageSquare className="w-4 h-4" />,
          permission: 'chat.view',
          badge: 'Live',
          badgeVariant: 'primary' as const,
        },
        {
          name: 'Subscriber Directory',
          href: '/customers',
          icon: <Users className="w-4 h-4" />,
          permission: 'customers.view',
        },
        {
          name: 'Customer Simulator',
          href: '/chat',
          icon: <Smartphone className="w-4 h-4 text-info-foreground dark:text-info" />,
          badge: 'Test',
          badgeVariant: 'info' as const,
        },
      ],
    },
    {
      group: 'Administration',
      items: [
        {
          name: 'Staff & Provisioning',
          href: '/staff',
          icon: <UserCheck className="w-4 h-4" />,
          permission: 'users.view',
        },
        {
          name: 'RBAC Permission Matrix',
          href: '/roles',
          icon: <Shield className="w-4 h-4" />,
          permission: 'users.view',
        },
        {
          name: '20 Regional Hubs',
          href: '/branches',
          icon: <Building2 className="w-4 h-4" />,
          permission: 'users.view',
        },
      ],
    },
    {
      group: 'NOC & Operations',
      items: [
        {
          name: 'Supervisor Live HUD',
          href: '/supervisor',
          icon: <Gauge className="w-4 h-4" />,
          permission: 'reports.view',
        },
        {
          name: 'Analytics & CSAT',
          href: '/reports',
          icon: <BarChart3 className="w-4 h-4" />,
          permission: 'reports.view',
        },
        {
          name: 'Working Hours & SLA',
          href: '/settings/working-hours',
          icon: <Clock className="w-4 h-4" />,
          permission: 'users.view',
        },
        {
          name: 'Canned Shortcuts (/)',
          href: '/settings/quick-replies',
          icon: <Zap className="w-4 h-4" />,
          permission: 'chat.view',
        },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        'w-64 bg-card border-r border-border flex flex-col justify-between flex-shrink-0 z-30',
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
              <div className="px-2.5 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {grp.group}
              </div>

              <div className="space-y-0.5">
                {visibleItems.map((item, iIdx) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={iIdx}
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all duration-150',
                        isActive
                          ? 'bg-primary text-white shadow-xs shadow-primary/20 font-semibold'
                          : 'text-foreground/85 hover:text-foreground hover:bg-muted/40'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-white' : 'text-muted-foreground'}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.name}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={cn(
                            'px-1.5 py-0.2 text-[10px] rounded-full font-medium',
                            isActive
                              ? 'bg-white/20 text-white'
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
          );
        })}
      </div>

      {/* Bottom Footer Info */}
      <div className="p-3.5 border-t border-border bg-muted/20 text-xs">
        <div className="flex items-center justify-between text-muted-foreground mb-1 text-[11px]">
          <span>Core Gateway</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-mono font-medium">Online (0.3ms)</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground/70 text-[10px]">
          <span>Prime One OS</span>
          <span className="font-mono">v3.4 Enterprise</span>
        </div>
      </div>
    </aside>
  );
};
