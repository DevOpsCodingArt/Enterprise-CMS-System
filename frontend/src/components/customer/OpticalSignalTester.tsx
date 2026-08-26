"use client";

import React, { useState } from "react";
import { Radio, Activity, CheckCircle2, AlertTriangle, RefreshCw, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function OpticalSignalTester() {
  const [isTesting, setIsTesting] = useState(false);
  const [opticalPower, setOpticalPower] = useState(-18.4);
  const [testTime, setTestTime] = useState<string | null>("Just now");

  const runTest = () => {
    setIsTesting(true);
    setTimeout(() => {
      // Simulate random realistic optical fluctuation
      const newDbm = Number((-17.8 - Math.random() * 1.5).toFixed(1));
      setOpticalPower(newDbm);
      setIsTesting(false);
      setTestTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 1500);
  };

  const isHealthy = opticalPower >= -24;

  return (
    <Card className="bg-card border-border shadow-xs">
      <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-heading font-bold">
            Live Optical Fiber Line Diagnostics
          </CardTitle>
          <CardDescription className="text-xs">
            Directly poll the optical light attenuation (Rx power) from the ISP SmartOLT port to your home.
          </CardDescription>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={runTest}
          disabled={isTesting}
          className="text-xs gap-1.5 shadow-xs"
        >
          <RefreshCw className={`h-3 w-3 ${isTesting ? "animate-spin" : ""}`} />
          <span>{isTesting ? "Testing Light Power..." : "Run Optical Test"}</span>
        </Button>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-card-subtle/60 border border-border">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl font-heading font-bold text-sm ${
                isHealthy
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
              }`}
            >
              <Radio className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl text-foreground">
                  {opticalPower} dBm
                </span>
                <Badge variant={isHealthy ? "success" : "destructive"}>
                  {isHealthy ? "EXCELLENT OPTICAL SIGNAL" : "HIGH ATTENUATION WARNING"}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground block mt-0.5" suppressHydrationWarning>
                Last verified: {testTime} • SmartOLT GPON Port 0/2/4
              </span>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end text-xs font-mono text-muted-foreground">
            <span>Nominal Range: -14 to -24 dBm</span>
            <span>Critical Cutoff: -28 dBm</span>
          </div>
        </div>

        {/* Optical Health Progress Gauge Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
            <span>Strong Signal (-14 dBm)</span>
            <span className="font-bold text-foreground">Current: {opticalPower} dBm</span>
            <span>Degraded (-28 dBm)</span>
          </div>

          <div className="w-full bg-card-subtle rounded-full h-2.5 overflow-hidden border border-border">
            <div
              className={`h-full transition-all duration-700 ${
                isHealthy ? "bg-emerald-500 w-[78%]" : "bg-rose-500 w-[94%]"
              }`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
