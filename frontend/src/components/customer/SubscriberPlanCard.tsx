"use client";

import React from "react";
import {
  Wifi,
  Calendar,
  CreditCard,
  Radio,
  CheckCircle2,
  RefreshCw,
  HardDrive,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function SubscriberPlanCard() {
  const toast = useToast();

  return (
    <Card className="bg-card border-border shadow-xs">
      <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Wifi className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-heading font-bold">
              Fiber Pro (50 Mbps Unlimited)
            </CardTitle>
            <span className="font-mono text-[11px] text-muted-foreground block">
              PPPoE: ahmed_malik_isb • IP: 103.14.22.84
            </span>
          </div>
        </div>

        <Badge variant="success" hasPulse className="font-mono text-[10px]">
          ONLINE
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg bg-card-subtle/60 p-3 border border-border">
            <span className="text-[10px] text-muted-foreground font-mono uppercase block">
              Bandwidth Speed
            </span>
            <span className="font-heading font-extrabold text-base text-foreground">
              50 Mbps
            </span>
            <span className="text-[10px] text-success font-mono block">Symmetric Up/Down</span>
          </div>

          <div className="rounded-lg bg-card-subtle/60 p-3 border border-border">
            <span className="text-[10px] text-muted-foreground font-mono uppercase block">
              Monthly Bill
            </span>
            <span className="font-heading font-extrabold text-base text-foreground">
              Rs. 3,500
            </span>
            <span className="text-[10px] text-success font-mono block">Paid (Valid till 30 Sep)</span>
          </div>

          <div className="rounded-lg bg-card-subtle/60 p-3 border border-border">
            <span className="text-[10px] text-muted-foreground font-mono uppercase block">
              MikroTik Uptime
            </span>
            <span className="font-heading font-extrabold text-base text-foreground">
              4d 12h
            </span>
            <span className="text-[10px] text-muted-foreground font-mono block">0 Reconnects</span>
          </div>

          <div className="rounded-lg bg-card-subtle/60 p-3 border border-border">
            <span className="text-[10px] text-muted-foreground font-mono uppercase block">
              Branch Hub
            </span>
            <span className="font-heading font-bold text-xs text-foreground truncate block">
              Islamabad HQ
            </span>
            <span className="text-[10px] text-muted-foreground font-mono block">Blue Area Sector</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">
            Having connectivity problems? You can trigger a remote power cycle on your ONU terminal.
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.success("ONU Power Cycle", "Reboot signal transmitted. Your modem will restart in 10 seconds.")
            }
            className="text-xs gap-1.5 shadow-xs"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Remote Reboot My ONU</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
