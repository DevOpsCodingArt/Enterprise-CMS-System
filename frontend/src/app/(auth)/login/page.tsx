'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import {
  Lock,
  Mail,
  ArrowRight,
  Shield,
  Building2,
  Smartphone,
  CheckCircle2,
  Sparkles,
  Headphones,
  Activity,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { showToast } = useToast();

  const [email, setEmail] = useState('noc.lead@primenetworks.pk');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      if (email.toLowerCase().includes('superadmin') || email.toLowerCase().includes('platform')) {
        // Platform Owner Super-Admin
        setAuth(
          {
            id: 'usr_superadmin_01',
            companyId: 'cmp_platform_global',
            branchId: 'br_isb_core',
            email: 'superadmin@primeone.io',
            username: 'superadmin',
            fullName: 'Super Admin',
            displayName: 'Super Admin (Global Root)',
            userType: 'staff',
            department: 'admin',
            designation: 'SaaS Platform Operator',
            isActive: true,
            isOnline: true,
            languagePreference: 'en',
            permissions: [
              'chat.view',
              'customers.view',
              'users.view',
              'reports.view',
              'inventory.view',
              'billing.view',
            ],
            company: {
              id: 'cmp_platform_global',
              name: 'Prime One SaaS Core',
              slug: 'platform-root',
              logoUrl: '/prime-logo.png',
            },
          },
          {
            accessToken: 'mock_jwt_access_token_platform_superadmin',
            refreshToken: 'mock_jwt_refresh_token_platform_superadmin',
          }
        );
        showToast('Platform Owner Authenticated', 'Launching SaaS Global Command Center', 'success');
        router.push('/platform');
      } else if (email.toLowerCase().includes('customer')) {
        // Customer
        showToast('Customer Authenticated', 'Entering Prime One Customer Portal', 'success');
        router.push('/customer');
      } else {
        // ISP Staff / Owner
        setAuth(
          {
            id: 'usr_f10_lead_01',
            companyId: 'cmp_prime_networks_01',
            branchId: 'br_isb_f10',
            email,
            username: 'moiz_noc',
            fullName: 'Eng. Moiz Ahmad',
            displayName: 'Moiz (NOC Lead)',
            userType: 'staff',
            department: 'noc',
            designation: 'NOC Lead Engineer',
            isActive: true,
            isOnline: true,
            languagePreference: 'en',
            permissions: [
              'chat.view',
              'chat.reply',
              'chat.transfer',
              'chat.close',
              'chat.private_notes',
              'customers.view',
              'customers.create',
              'tickets.view',
              'tickets.create',
              'users.view',
              'users.create',
              'reports.view',
            ],
            company: {
              id: 'cmp_prime_networks_01',
              name: 'Prime Networks (Pvt) Ltd',
              slug: 'prime-networks',
              logoUrl: '/prime-logo.png',
            },
          },
          {
            accessToken: 'mock_jwt_access_token_prime_one_v1',
            refreshToken: 'mock_jwt_refresh_token_prime_one_v1',
          }
        );
        showToast('Authentication Successful', 'Welcome to Prime Desk Workspace', 'success');
        router.push('/desk');
      }
    } catch {
      showToast('Login Failed', 'Invalid credentials or company slug', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Direct 1-Click Launch for the 3 Portals
  const handleDirectLaunch = async (targetPortal: 'platform' | 'desk' | 'customer') => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (targetPortal === 'platform') {
      setEmail('superadmin@primeone.io');
      setAuth(
        {
          id: 'usr_superadmin_01',
          companyId: 'cmp_platform_global',
          branchId: 'br_isb_core',
          email: 'superadmin@primeone.io',
          username: 'superadmin',
          fullName: 'Super Admin',
          displayName: 'Super Admin (Global Root)',
          userType: 'staff',
          department: 'admin',
          designation: 'SaaS Platform Operator',
          isActive: true,
          isOnline: true,
          languagePreference: 'en',
          permissions: [
            'chat.view',
            'customers.view',
            'users.view',
            'reports.view',
            'inventory.view',
            'billing.view',
          ],
          company: {
            id: 'cmp_platform_global',
            name: 'Prime One SaaS Core',
            slug: 'platform-root',
            logoUrl: '/prime-logo.png',
          },
        },
        {
          accessToken: 'mock_jwt_access_token_platform_superadmin',
          refreshToken: 'mock_jwt_refresh_token_platform_superadmin',
        }
      );
      showToast('SaaS Super-Admin Access', 'Entering Global Fleet Command Center', 'success');
      router.push('/platform');
    } else if (targetPortal === 'desk') {
      setEmail('noc.lead@primenetworks.pk');
      setAuth(
        {
          id: 'usr_f10_lead_01',
          companyId: 'cmp_prime_networks_01',
          branchId: 'br_isb_f10',
          email: 'noc.lead@primenetworks.pk',
          username: 'moiz_noc',
          fullName: 'Eng. Moiz Ahmad',
          displayName: 'Moiz (NOC Lead)',
          userType: 'staff',
          department: 'noc',
          designation: 'NOC Lead Engineer',
          isActive: true,
          isOnline: true,
          languagePreference: 'en',
          permissions: [
            'chat.view',
            'chat.reply',
            'chat.transfer',
            'chat.close',
            'chat.private_notes',
            'customers.view',
            'customers.create',
            'tickets.view',
            'tickets.create',
            'users.view',
            'users.create',
            'reports.view',
          ],
          company: {
            id: 'cmp_prime_networks_01',
            name: 'Prime Networks (Pvt) Ltd',
            slug: 'prime-networks',
            logoUrl: '/prime-logo.png',
          },
        },
        {
          accessToken: 'mock_jwt_access_token_prime_one_v1',
          refreshToken: 'mock_jwt_refresh_token_prime_one_v1',
        }
      );
      showToast('ISP Operations Access', 'Entering Prime Desk Live Chat Workspace', 'success');
      router.push('/desk');
    } else {
      setEmail('customer@nayatel.pk');
      showToast('Customer Portal', 'Entering Customer Command Center & Dashboard', 'info');
      router.push('/customer');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2">
          <div className="relative w-12 h-12 mx-auto mb-1.5">
            <Image
              src="/prime-logo.png"
              alt="Prime Networks Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground">
            PRIME<span className="text-primary">ONE</span> // TELECOM OS
          </h1>
          <p className="text-xs text-muted-foreground">
            Multi-Tenant SaaS Operations & Customer Interaction Platform
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/70 text-xs">
            <span className="font-semibold text-foreground">Staff & User Authentication</span>
            <Badge variant="primary" size="xs">
              v3.4 Secure
            </Badge>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
            <Input
              label="Work Email / Username"
              type="text"
              placeholder="user@primenetworks.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Workspace
            </Button>
          </form>

          {/* 3 Dedicated Direct Access Portals */}
          <div className="pt-4 border-t border-border/70 space-y-2.5">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-center">
              Direct Portal Access (1-Click Launch)
            </div>

            <div className="grid grid-cols-1 gap-2">
              {/* Portal 1: SaaS Platform Owner */}
              <button
                type="button"
                onClick={() => handleDirectLaunch('platform')}
                className="w-full p-3 rounded-xl bg-muted/30 hover:bg-primary/10 border border-border hover:border-primary/50 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                      1. SaaS Platform Owner (Super-Admin)
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Global Fleet, Tenant ISPs, SaaS Plans & Telemetry
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Portal 2: ISP Company Operations */}
              <button
                type="button"
                onClick={() => handleDirectLaunch('desk')}
                className="w-full p-3 rounded-xl bg-muted/30 hover:bg-primary/10 border border-border hover:border-primary/50 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-info/10 text-info-foreground dark:text-info group-hover:bg-info group-hover:text-white transition-colors">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                      2. ISP Operations & Prime Desk
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      3-Column Live Chat, Customer 360 & NOC HUD
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Portal 3: Customer Web Chat */}
              <button
                type="button"
                onClick={() => handleDirectLaunch('customer')}
                className="w-full p-3 rounded-xl bg-muted/30 hover:bg-primary/10 border border-border hover:border-primary/50 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                      3. Customer Web Chat Simulator
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Subscriber 2-Way Chat & Optical Status (-19.2 dBm)
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          © 2026 Prime Networks (Pvt) Ltd. All rights reserved.
        </div>
      </div>
    </div>
  );
}
