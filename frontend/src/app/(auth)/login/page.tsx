'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Lock, Mail, ArrowRight, ShieldCheck, Terminal, Key } from 'lucide-react';
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

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

      showToast('Authentication Successful', 'Welcome to Prime One Telecom Command OS', 'success');
      router.push('/app/desk');
    } catch {
      showToast('Login Failed', 'Invalid credentials or company slug', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (roleName: string, roleEmail: string, roleTitle: string) => {
    setEmail(roleEmail);
    showToast('Demo Credentials Injected', `Testing as ${roleName} (${roleTitle})`, 'info');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 font-body">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2">
          <div className="relative w-14 h-14 mx-auto mb-2">
            <Image
              src="/prime-logo.png"
              alt="Prime Networks Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="font-heading font-black text-2xl tracking-tight uppercase">
            PRIME<span className="text-primary">ONE</span> // TELECOM OS
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Multi-Tenant SaaS Operations & Customer Interaction Platform
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-card border-2 border-border p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b-2 border-border mb-6 font-mono text-xs">
            <span className="font-bold uppercase text-muted-foreground">STAFF AUTHENTICATION</span>
            <Badge variant="primary" size="xs">
              V3.4 SECURE
            </Badge>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
            <Input
              label="WORK EMAIL // USERNAME"
              type="text"
              placeholder="user@primenetworks.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="PASSWORD"
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
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              LAUNCH PRIME DESK
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t-2 border-border space-y-2 font-mono text-xs">
            <div className="text-[10px] text-muted-foreground uppercase font-bold text-center mb-2">
              QUICK DEMO ROLES (1-CLICK FILL)
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => handleQuickDemo('Eng. Moiz', 'noc.lead@primenetworks.pk', 'NOC Lead')}
                className="p-2 bg-card-subtle hover:bg-card border border-border hover:border-primary text-left transition-colors font-bold"
              >
                <div>🎧 NOC LEAD</div>
                <div className="text-muted-foreground text-[9px]">Full Telemetry</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('CEO Admin', 'ceo@primenetworks.pk', 'Company Owner')}
                className="p-2 bg-card-subtle hover:bg-card border border-border hover:border-primary text-left transition-colors font-bold"
              >
                <div>👑 OWNER ROOT</div>
                <div className="text-muted-foreground text-[9px]">All Portals</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center font-mono text-[10px] text-muted-foreground">
          © 2026 PRIME NETWORKS (PVT) LTD. ALL RIGHTS RESERVED.
        </div>
      </div>
    </div>
  );
}
