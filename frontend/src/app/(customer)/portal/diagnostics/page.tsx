"use client";

import React, { useState } from "react";
import {
  Activity,
  Gauge,
  RotateCcw,
  Wifi,
  Radio,
  Server,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Lock,
  Cpu,
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { SpeedTestWidget } from "@/components/customer/SpeedTestWidget";

export default function CustomerDiagnosticsPage() {
  const toast = useToast();
  const [isRebooting, setIsRebooting] = useState(false);
  const [wifiSsid, setWifiSsid] = useState("Prime_Fiber_5G_99482");
  const [wifiPass, setWifiPass] = useState("Prime@2026!");

  const handleRemoteReboot = () => {
    setIsRebooting(true);
    toast.info(
      "Reboot Signal Dispatched",
      "Sending TR-069 power-cycle command to your GPON ONU modem (HWTC884291A)..."
    );

    setTimeout(() => {
      setIsRebooting(false);
      toast.success(
        "Modem Rebooted Successfully",
        "GPON light synchronizing. Optical session restored in 30 seconds."
      );
    }, 3500);
  };

  const handleSaveWifi = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      "WiFi Settings Updated",
      `New SSID "${wifiSsid}" applied to your dual-band router.`
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div>
        <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
          Fiber Line Diagnostics & Self-Care Tools
        </h2>
        <p className="text-xs text-muted-foreground">
          Perform live throughput speed tests, check latency, and manage your home WiFi router.
        </p>
      </div>

      {/* 2. Interactive Speed & Latency Test Widget */}
      <SpeedTestWidget />

      {/* 3. Home WiFi Router & Modem Remote Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Remote Modem Reboot & Status Card */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="p-4 border-b border-border bg-card-subtle/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-heading font-bold">
                  Modem Hardware & OLT Session
                </CardTitle>
              </div>
              <Badge variant="success" className="text-[10px] font-mono">
                ONLINE
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Huawei EchoLife HG8145V5 Dual-Band Gigabit ONT
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted-foreground font-mono">ONU Serial Number:</span>
              <span className="font-mono font-bold text-foreground">HWTC884291A</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted-foreground font-mono">GPON OLT Node:</span>
              <span className="font-bold text-foreground">OLT-ISB-CORE-01 (Port 0/2/4)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted-foreground font-mono">Connected WiFi Devices:</span>
              <span className="font-bold text-foreground">6 Active Devices</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground font-mono">Continuous Uptime:</span>
              <span className="font-mono font-bold text-foreground">4 Days, 12 Hours</span>
            </div>
          </CardContent>

          <CardFooter className="p-4 border-t border-border bg-card-subtle/50 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              Experiencing slow connection?
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoteReboot}
              disabled={isRebooting}
              className="gap-1.5 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <RotateCcw className={`h-3.5 w-3.5 ${isRebooting ? "animate-spin" : ""}`} />
              <span>{isRebooting ? "Rebooting ONU..." : "Remote Reboot Modem"}</span>
            </Button>
          </CardFooter>
        </Card>

        {/* WiFi SSID & Password Changer Form */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="p-4 border-b border-border bg-card-subtle/50">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-heading font-bold">
                Home WiFi Settings
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Change your 2.4GHz & 5GHz dual-band wireless credentials.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSaveWifi}>
            <CardContent className="p-4 space-y-3">
              <Input
                label="WiFi Network Name (SSID)"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                required
              />

              <Input
                label="WiFi Security Password"
                type="password"
                value={wifiPass}
                onChange={(e) => setWifiPass(e.target.value)}
                required
              />
            </CardContent>

            <CardFooter className="p-4 border-t border-border bg-card-subtle/50 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                WPA2/WPA3 AES Encryption
              </span>
              <Button variant="primary" size="sm" type="submit" className="text-xs font-bold">
                Save WiFi Credentials
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
