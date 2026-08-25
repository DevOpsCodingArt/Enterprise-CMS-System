'use client';

import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface OpticalPowerGaugeProps {
  rxDbm: number;
  txDbm?: number;
  oltPonPort?: string | null;
  compact?: boolean;
}

export function OpticalPowerGauge({
  rxDbm,
  txDbm,
  oltPonPort = 'EPON0/1:4',
  compact = false,
}: OpticalPowerGaugeProps) {
  // Classification
  // Normal / Good: -15.0 to -24.5 dBm
  // Warning: -24.6 to -27.9 dBm
  // Critical Cut: <= -28.0 dBm
  const isGood = rxDbm >= -24.5 && rxDbm <= -14.0;
  const isWarning = rxDbm < -24.5 && rxDbm >= -27.9;
  const isCritical = rxDbm < -27.9;

  // Gauge Percentage mapping (-35 dBm = 0%, -10 dBm = 100%)
  const minDbm = -35;
  const maxDbm = -10;
  const percentage = Math.min(100, Math.max(0, ((rxDbm - minDbm) / (maxDbm - minDbm)) * 100));

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isGood ? 'bg-emerald-500 animate-pulse' : isWarning ? 'bg-amber-500' : 'bg-red-500 animate-ping'
          }`}
        />
        <span className="font-mono font-bold text-xs text-foreground">
          {rxDbm.toFixed(1)} dBm
        </span>
        <Badge
          variant={isGood ? 'primary' : isWarning ? 'warning' : 'destructive'}
          size="xs"
        >
          {isGood ? 'Optimal' : isWarning ? 'Weak' : 'Fiber Cut'}
        </Badge>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isGood ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : isWarning ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'}`}>
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="font-heading font-semibold text-xs text-foreground">
              SmartOLT Fiber Attenuation
            </div>
            <div className="text-[11px] text-muted-foreground font-mono">
              Port: {oltPonPort || 'GPON0/1:4'}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="font-mono font-bold text-lg text-foreground">
            {rxDbm.toFixed(2)}{' '}
            <span className="text-xs font-normal text-muted-foreground">dBm</span>
          </div>
          <Badge
            variant={isGood ? 'primary' : isWarning ? 'warning' : 'destructive'}
            size="xs"
          >
            {isGood ? 'Optimal Signal' : isWarning ? 'Marginal Attenuation' : 'LOS Red / Fiber Cut'}
          </Badge>
        </div>
      </div>

      {/* Visual Attenuation Gauge Bar */}
      <div className="space-y-1 pt-1">
        <div className="relative w-full h-2.5 bg-muted rounded-full overflow-hidden flex">
          {/* Red Zone (< -28 dBm) */}
          <div className="h-full w-[28%] bg-red-500/80" />
          {/* Yellow Zone (-28 to -24.5 dBm) */}
          <div className="h-full w-[14%] bg-amber-500/80" />
          {/* Green Zone (-24.5 to -14 dBm) */}
          <div className="h-full w-[42%] bg-emerald-500/90" />
          {/* High Power Zone (> -14 dBm) */}
          <div className="h-full w-[16%] bg-blue-500/80" />
        </div>

        {/* Needle Marker Indicator */}
        <div className="relative w-full h-2">
          <div
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
            style={{ left: `${percentage}%` }}
          >
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[5px] border-b-foreground" />
          </div>
        </div>

        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>-35 dBm (Cut)</span>
          <span>-28 dBm (Warn)</span>
          <span>-19 dBm (Target)</span>
          <span>-10 dBm</span>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed pt-1 border-t border-border/60">
        {isGood && (
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            ✓ Optical light power is inside nominal parameters (-15 to -24 dBm). Zero packet loss.
          </span>
        )}
        {isWarning && (
          <span className="text-amber-600 dark:text-amber-400 font-medium">
            ⚠️ Light signal is slightly weak. Ensure yellow fiber patch cord is not bent sharply.
          </span>
        )}
        {isCritical && (
          <span className="text-red-600 dark:text-red-400 font-medium animate-pulse">
            🚨 Critical optical loss detected. Fiber drop cable cut or disconnected. Splicing technician dispatch recommended.
          </span>
        )}
      </p>
    </div>
  );
}
