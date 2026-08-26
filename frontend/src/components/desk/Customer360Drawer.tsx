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
    <div className="w-full lg:w-80 xl:w-96 border-l border-border bg-card flex flex-col h-full max-h-full flex-shrink-0 text-xs overflow-hidden">
      {/* Drawer Header */}
      <div className="flex-shrink-0 p-3.5 border-b border-border flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="font-heading font-bold text-sm tracking-tight text-foreground">
            Customer 360°
          </span>
        </div>
        <Badge variant={opticalDbm < -25 ? 'destructive' : 'primary'} size="xs">
          <span className="font-mono">{opticalDbm} dBm</span>
        </Badge>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-4 custom-scrollbar">
        {/* 1. Subscriber Identity Box */}
        <div className="p-3 rounded-xl bg-muted/30 border border-border/70 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-heading font-semibold text-foreground text-sm">
                {customer?.fullName || 'Ali Hassan'}
              </div>
              <div className="text-xs font-mono text-primary font-medium mt-0.5">
                {customer?.customerCode || 'PK-84920'} · PPPoE: {customer?.username || 'ali_f10'}
              </div>
            </div>
            <Badge variant="primary" size="xs">
              Active
            </Badge>
          </div>

          <div className="space-y-1 pt-2 border-t border-border/60 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 text-muted-foreground" />
              <span>{customer?.phone || '+92 300 8594021'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span>{customer?.address || 'House 24, St 12, Sector F-10/2, Islamabad'}</span>
            </div>
          </div>
        </div>

        {/* 2. SmartOLT Live Optical Signal Gauge */}
        <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-heading font-semibold text-xs text-foreground flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-primary" /> SmartOLT Optical Power
            </span>
            <button
              onClick={handleToggleSignal}
              className="text-xs text-primary hover:underline font-medium"
            >
              Simulate {opticalDbm < -25 ? 'Restore' : 'Cut'}
            </button>
          </div>

          <div className="p-2.5 rounded-lg bg-muted/30 border border-border/70 text-center space-y-1">
            <div className="text-xs text-muted-foreground">Optical RX Signal Level</div>
            <div
              className={`font-mono font-bold text-2xl ${
                opticalDbm < -25
                  ? 'text-destructive animate-pulse'
                  : 'text-success'
              }`}
            >
              {opticalDbm} dBm
            </div>
            <div className="text-xs font-medium text-muted-foreground">
              {opticalDbm < -25 ? 'CRITICAL: Fiber Cut Detected' : 'Nominal Signal (-15 to -24 dBm)'}
            </div>
          </div>

          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>OLT Chassis:</span>
              <span className="font-mono font-medium text-foreground">Huawei MA5800-X7</span>
            </div>
            <div className="flex justify-between">
              <span>PON Board & Port:</span>
              <span className="font-mono font-medium text-foreground">Slot 0/2 · PON-04</span>
            </div>
            <div className="flex justify-between">
              <span>ONU Serial:</span>
              <span className="font-mono font-medium text-foreground">HWTC-98B2-F104</span>
            </div>
          </div>
        </div>

        {/* 3. ZL Ultra Billing Ledger & Package */}
        <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-heading font-semibold text-xs text-foreground flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-info-foreground dark:text-info" /> ZL Ultra Billing Ledger
            </span>
            <Badge variant="primary" size="xs">
              Paid
            </Badge>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subscribed Package:</span>
              <span className="font-medium text-foreground">50 Mbps Ultra Fiber</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly Fee:</span>
              <span className="font-mono font-semibold text-foreground">{formatCurrencyPKR(3850)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Billing Cycle Expiry:</span>
              <span className="font-mono font-medium text-foreground">2026-09-01</span>
            </div>
          </div>
        </div>

        {/* 4. Quick Operational Escalation Triggers */}
        <div className="space-y-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs"
            leftIcon={<Ticket className="w-3.5 h-3.5 text-primary" />}
            onClick={() => alert(`Creating linked NOC ticket for ${customer?.fullName}`)}
          >
            Escalate to NOC Dispatch
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs"
            leftIcon={<RefreshCw className="w-3.5 h-3.5 text-warning" />}
            onClick={() => alert(`TR-069 router reboot sent to ONU HWTC-98B2-F104`)}
          >
            Send TR-069 Soft Reboot
          </Button>
        </div>
      </div>
    </div>
  );
};
