"use client";

import React, { useState, useEffect } from "react";
import {
  Gauge,
  Play,
  RotateCcw,
  ArrowDown,
  ArrowUp,
  Activity,
  Server,
  CheckCircle2,
  Zap,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SpeedTestWidget() {
  const [isRunning, setIsRunning] = useState(false);
  const [testPhase, setTestPhase] = useState<"idle" | "ping" | "download" | "upload" | "complete">("idle");
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [ping, setPing] = useState(6);
  const [jitter, setJitter] = useState(1.2);
  const [downloadSpeed, setDownloadSpeed] = useState(48.7);
  const [uploadSpeed, setUploadSpeed] = useState(47.2);

  const startTest = () => {
    setIsRunning(true);
    setTestPhase("ping");
    setCurrentSpeed(0);

    // Phase 1: Ping (0s - 1.5s)
    setTimeout(() => {
      setPing(Math.floor(4 + Math.random() * 4));
      setJitter(+(0.8 + Math.random() * 0.8).toFixed(1));
      setTestPhase("download");
    }, 1500);

    // Phase 2: Download Speed (1.5s - 4.5s)
    setTimeout(() => {
      setTestPhase("upload");
    }, 4500);

    // Phase 3: Upload Speed (4.5s - 7.5s)
    setTimeout(() => {
      setTestPhase("complete");
      setIsRunning(false);
      setDownloadSpeed(+(47.5 + Math.random() * 3.5).toFixed(1));
      setUploadSpeed(+(46.0 + Math.random() * 3.5).toFixed(1));
      setCurrentSpeed(49.2);
    }, 7500);
  };

  // Speed simulation tick effect
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (testPhase === "download") {
        setCurrentSpeed((prev) => {
          const target = 49.5 + (Math.random() * 4 - 2);
          const next = prev + (target - prev) * 0.15;
          return +next.toFixed(1);
        });
      } else if (testPhase === "upload") {
        setCurrentSpeed((prev) => {
          const target = 48.0 + (Math.random() * 3 - 1.5);
          const next = prev + (target - prev) * 0.15;
          return +next.toFixed(1);
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, testPhase]);

  return (
    <Card className="bg-card border-border shadow-xs overflow-hidden">
      <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Gauge className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-heading font-bold">
              Fiber Speed & Latency Diagnostic
            </CardTitle>
            <CardDescription className="text-xs">
              Direct throughput test to your GPON OLT Metro Node.
            </CardDescription>
          </div>
        </div>

        <Badge variant={testPhase === "complete" ? "success" : "outline"} className="font-mono text-xs">
          {testPhase === "idle" && "READY"}
          {testPhase === "ping" && "MEASURING PING..."}
          {testPhase === "download" && "TESTING DOWNLOAD..."}
          {testPhase === "upload" && "TESTING UPLOAD..."}
          {testPhase === "complete" && "TEST COMPLETE"}
        </Badge>
      </CardHeader>

      <CardContent className="p-6 flex flex-col items-center justify-center">
        {/* Animated Speed Gauge */}
        <div className="relative flex flex-col items-center justify-center my-2">
          <div className="relative h-44 w-44 rounded-full border-4 border-dashed border-border flex items-center justify-center bg-card-subtle/40 shadow-inner">
            <div
              className={`absolute inset-2 rounded-full border-4 transition-all duration-300 ${
                isRunning
                  ? "border-primary animate-pulse shadow-md"
                  : "border-success/40"
              }`}
            />

            <div className="text-center z-10 space-y-0.5">
              <span className="font-heading font-extrabold text-4xl text-foreground tracking-tight">
                {isRunning ? currentSpeed : downloadSpeed}
              </span>
              <span className="text-xs font-mono text-muted-foreground uppercase block font-bold">
                Mbps
              </span>
              <span className="text-[10px] font-mono text-primary block mt-1 font-bold">
                {testPhase === "download" && "⬇ DOWNLOADING"}
                {testPhase === "upload" && "⬆ UPLOADING"}
                {testPhase === "ping" && "⏱ TESTING PING"}
                {testPhase === "idle" && "50M ALLOCATED"}
                {testPhase === "complete" && "100% PROVISIONED"}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-4">
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-mono uppercase">Ping Latency</span>
            </div>
            <span className="font-heading font-extrabold text-lg text-foreground font-mono">
              {ping} <span className="text-xs text-muted-foreground font-normal">ms</span>
            </span>
          </div>

          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Zap className="h-3.5 w-3.5 text-warning" />
              <span className="text-[11px] font-mono uppercase">Jitter</span>
            </div>
            <span className="font-heading font-extrabold text-lg text-foreground font-mono">
              {jitter} <span className="text-xs text-muted-foreground font-normal">ms</span>
            </span>
          </div>

          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <ArrowDown className="h-3.5 w-3.5 text-success" />
              <span className="text-[11px] font-mono uppercase">Download</span>
            </div>
            <span className="font-heading font-extrabold text-lg text-success font-mono">
              {downloadSpeed} <span className="text-xs text-muted-foreground font-normal">Mbps</span>
            </span>
          </div>

          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <ArrowUp className="h-3.5 w-3.5 text-info" />
              <span className="text-[11px] font-mono uppercase">Upload</span>
            </div>
            <span className="font-heading font-extrabold text-lg text-info font-mono">
              {uploadSpeed} <span className="text-xs text-muted-foreground font-normal">Mbps</span>
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 border-t border-border bg-card-subtle/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px]">
          <Server className="h-3.5 w-3.5 text-primary" />
          <span>Server Node: Prime Networks Islamabad GPON Edge #01</span>
        </div>

        <Button
          variant={isRunning ? "outline" : "primary"}
          size="sm"
          onClick={startTest}
          disabled={isRunning}
          className="gap-2 w-full sm:w-auto font-bold shadow-xs"
        >
          {isRunning ? (
            <>
              <RotateCcw className="h-3.5 w-3.5 animate-spin" />
              <span>Testing Line Throughput...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Run Speed Test</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
