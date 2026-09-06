"use client";

import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatTenantTime, DEFAULT_TENANT_TIMEZONE } from "@/lib/timezone";

interface EttrLiveCountdownProps {
  ettrUtc?: string | null;
  companyTimezone?: string;
  isResolved?: boolean;
  compact?: boolean;
  className?: string;
}

export function EttrLiveCountdown({
  ettrUtc,
  companyTimezone = DEFAULT_TENANT_TIMEZONE,
  isResolved = false,
  compact = false,
  className = "",
}: EttrLiveCountdownProps) {
  const [diffMs, setDiffMs] = useState<number | null>(null);

  useEffect(() => {
    if (!ettrUtc) {
      setDiffMs(null);
      return;
    }

    const targetMs = new Date(ettrUtc).getTime();
    if (isNaN(targetMs)) {
      setDiffMs(null);
      return;
    }

    const calculate = () => {
      setDiffMs(targetMs - Date.now());
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [ettrUtc]);

  if (isResolved) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-mono text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md ${className}`}
      >
        <CheckCircle2 className="h-3 w-3" /> Resolved
      </span>
    );
  }

  if (!ettrUtc || diffMs === null) {
    return (
      <span className={`font-mono text-xs text-muted-foreground ${className}`}>
        No SLA Set
      </span>
    );
  }

  const isBreached = diffMs < 0;
  const absMs = Math.abs(diffMs);
  const hours = Math.floor(absMs / 3600000);
  const minutes = Math.floor((absMs % 3600000) / 60000);
  const seconds = Math.floor((absMs % 60000) / 1000);

  const pad = (n: number) => String(n).padStart(2, "0");
  const timeString = `${hours > 0 ? `${hours}h ` : ""}${pad(minutes)}m ${pad(seconds)}s`;

  // Color coding thresholds
  let colorClass = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  if (isBreached) {
    colorClass = "text-red-500 bg-red-500/15 border-red-500/40 animate-pulse";
  } else if (diffMs < 900000) {
    // < 15 mins
    colorClass = "text-orange-500 bg-orange-500/15 border-orange-500/30 animate-pulse";
  } else if (diffMs < 3600000) {
    // < 1 hour
    colorClass = "text-amber-500 bg-amber-500/10 border-amber-500/20";
  }

  const targetFormatted = formatTenantTime(ettrUtc, companyTimezone);

  if (compact) {
    return (
      <span
        title={`SLA Target: ${targetFormatted} (${companyTimezone})`}
        className={`inline-flex items-center gap-1 font-mono text-[11px] font-bold px-1.5 py-0.5 rounded-md border ${colorClass} ${className}`}
      >
        {isBreached ? (
          <>
            <AlertTriangle className="h-3 w-3 shrink-0" />
            <span>BREACHED -{timeString}</span>
          </>
        ) : (
          <>
            <Clock className="h-3 w-3 shrink-0" />
            <span>{timeString}</span>
          </>
        )}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex flex-col p-2.5 rounded-xl border ${colorClass} ${className}`}
    >
      <div className="flex items-center gap-1.5">
        {isBreached ? (
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
        ) : (
          <Clock className="h-4 w-4 shrink-0" />
        )}
        <span className="font-mono text-xs font-bold uppercase tracking-wider">
          {isBreached ? "SLA Target Breached" : "Resolution Countdown"}
        </span>
      </div>

      <div className="flex items-baseline justify-between gap-4 mt-1">
        <span className="font-mono text-base font-extrabold tracking-tight">
          {isBreached ? `-${timeString}` : timeString}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">
          Target: {targetFormatted}
        </span>
      </div>
    </div>
  );
}
