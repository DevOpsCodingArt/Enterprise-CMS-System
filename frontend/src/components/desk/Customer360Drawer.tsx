'use client';

import React, { useState } from 'react';
import { Customer360 } from '@/types/customer.types';
import { getOpticalHealthStatus, formatCurrencyPKR } from '@/lib/utils';
import {
  Activity,
  CreditCard,
  QrCode,
  History,
  Phone,
  MapPin,
  Wifi,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Ticket,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useChatUiStore } from '@/stores/chat-ui-store';

interface Customer360DrawerProps {
  data?: Customer360 | null;
  onSimulateOpticalCut?: () => void;
  onRestoreOpticalLink?: () => void;
}

export const Customer360Drawer: React.FC<Customer360DrawerProps> = ({
  data,
  onSimulateOpticalCut,
  onRestoreOpticalLink,
}) => {
  const { setTransferModalOpen, setCloseModalOpen } = useChatUiStore();
  const [opticalDbm, setOpticalDbm] = useState<number>(-19.24);

  const customer = data?.customer;
  const opticalHealth = getOpticalHealthStatus(opticalDbm);

  const handleToggleSignal = () => {
    if (opticalDbm < -25) {
      setOpticalDbm(-19.24);
      if (onRestoreOpticalLink) onRestoreOpticalLink();
    } else {
      setOpticalDbm(-32.54);
      if (onSimulateOpticalCut) onSimulateOpticalCut();
    }
  };

  return (
    <div className="w-full lg:w-80 xl:w-96 border-l-2 border-border bg-card flex flex-col h-full flex-shrink-0 font-mono text-xs overflow-y-auto">
      {/* Drawer Header */}
      <div className="p-3.5 border-b-2 border-border flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="font-heading font-black text-sm tracking-tight uppercase">
            CUSTOMER 360°
          </span>
        </div>
        <Badge
          variant={opticalDbm >= -25 ? 'primary' : 'destructive'}
          size="xs"
        >
          {opticalDbm >= -25 ? 'ONLINE 🟢' : 'LOS CUT 🔴'}
        </Badge>
      </div>

      <div className="p-4 space-y-4">
        {/* 1. Subscriber Identity Box */}
        <div className="p-3.5 bg-card-subtle border-2 border-border space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="font-heading font-bold text-foreground">
              {customer?.fullName || 'Ali Hassan'}
            </span>
            <Badge variant="outline" size="xs">
              {customer?.customerCode || 'CUS-F10-9102'}
            </Badge>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{customer?.phone || '+92 300 5551234'}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{customer?.address || 'House 142, Street 18, Sector F-10/2, ISB'}</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-bold">
              <Wifi className="w-3.5 h-3.5 flex-shrink-0" />
              <span>PPPoE: {customer?.username || 'ali_f10'}</span>
            </div>
          </div>
        </div>

        {/* 2. Real-Time SmartOLT Optical Power Gauge */}
        <div className="p-3.5 bg-card-subtle border-2 border-border space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[10px] text-muted-foreground uppercase">
              SMARTOLT OPTICAL POWER (RX)
            </span>
            <span
              className={`px-1.5 py-0.5 font-bold text-[10px] border ${opticalHealth.bgClass} ${opticalHealth.colorClass} ${opticalHealth.borderClass}`}
            >
              {opticalDbm} dBm ({opticalHealth.label})
            </span>
          </div>

          {/* Hard Visual Gauge Bar */}
          <div className="w-full bg-card border-2 border-border h-3.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${opticalDbm >= -25 ? 'w-[78%] bg-primary' : 'w-[22%] bg-destructive'
                }`}
            />
          </div>
          <div className="flex justify-between text-[9px] text-muted-foreground">
            <span>-40 dBm (DEAD)</span>
            <span>-27 dBm (WARN)</span>
            <span>-19 dBm (NOMINAL)</span>
            <span>-10 dBm</span>
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">OLT_PORT:</span>
            <span className="font-bold">Huawei-MA5608T // PON-4</span>
          </div>

          <Button
            variant="outline"
            size="xs"
            onClick={handleToggleSignal}
            className="w-full mt-1"
            leftIcon={<RefreshCw className="w-3 h-3 text-warning" />}
          >
            {opticalDbm < -25 ? 'REPAIR FIBER CUT (-19 dBm)' : 'SIMULATE FIBER CUT (-32 dBm)'}
          </Button>
        </div>

        {/* 3. ZL Ultra Billing Ledger */}
        <div className="p-3.5 bg-card-subtle border-2 border-border space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-border">
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-primary" />
              <span className="font-bold text-[10px] uppercase">ZL ULTRA BILLING</span>
            </div>
            <Badge variant="primary" size="xs">
              PAID ✓
            </Badge>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Package:</span>
              <span className="font-bold text-foreground">50M Ultra Unlimited</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly Fee:</span>
              <span className="font-bold text-primary">{formatCurrencyPKR(3500)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Billing Expiry:</span>
              <span className="font-bold">15-Sep-2026</span>
            </div>
          </div>
        </div>

        {/* 4. Hardware Asset QR Verification */}
        <div className="p-3.5 bg-card-subtle border-2 border-border space-y-1.5">
          <div className="flex items-center gap-1.5 text-info font-bold text-[10px] uppercase mb-1">
            <QrCode className="w-3.5 h-3.5" />
            <span>DEPLOYED ASSET SERIALS</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-muted-foreground">ONU Serial:</span>
            <span className="font-bold">HWTC-98B2-F104</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-muted-foreground">Router Model:</span>
            <span className="font-bold">TP-Link Archer C6</span>
          </div>
        </div>

        {/* 5. Interaction & Ticket History */}
        <div className="p-3.5 bg-card-subtle border-2 border-border space-y-2">
          <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[10px] uppercase">
            <History className="w-3.5 h-3.5" />
            <span>RECENT TICKETS & CHATS</span>
          </div>

          <div className="space-y-1.5 text-[10px]">
            <div className="p-2 bg-card border border-border flex justify-between items-center">
              <div>
                <div className="font-bold">TKT-8419 // Fiber Cut</div>
                <div className="text-muted-foreground">Resolved in 22m</div>
              </div>
              <Badge variant="default" size="xs">
                RESOLVED
              </Badge>
            </div>
            <div className="p-2 bg-card border border-border flex justify-between items-center">
              <div>
                <div className="font-bold">TX-9102 // Recharge Slip</div>
                <div className="text-muted-foreground">Verified by Accounts</div>
              </div>
              <Badge variant="primary" size="xs">
                SYNCED
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
