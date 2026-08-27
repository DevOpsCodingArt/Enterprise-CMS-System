"use client";

import React from "react";
import { User, Server, Wifi, Phone, RotateCcw, Unplug, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { SubscriberRecord } from "@/mock/db";
import { Tooltip } from "@/components/ui/tooltip";

export function SubscribersGridView({
  subscribers,
  onSelectSubscriber,
  onDisconnect,
  onRestart,
}: {
  subscribers: SubscriberRecord[];
  onSelectSubscriber: (sub: SubscriberRecord) => void;
  onDisconnect: (sub: SubscriberRecord) => void;
  onRestart: (sub: SubscriberRecord) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-4 custom-scrollbar">
      {subscribers.map((sub) => {
        const isOnline = sub.status === "active";
        return (
          <div
            key={sub.id}
            onClick={() => onSelectSubscriber(sub)}
            className="p-4 bg-card border border-border rounded-xl shadow-xs hover:border-primary/50 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Top Row: Avatar & Status */}
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {sub.fullName.charAt(0)}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                        isOnline ? "bg-success" : "bg-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground leading-tight group-hover:text-primary transition-colors truncate max-w-[130px]">
                      {sub.fullName}
                    </h4>
                    <p className="text-xs text-muted-foreground font-mono truncate max-w-[130px]">
                      {sub.pppoeUsername}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    sub.status === "active"
                      ? "bg-success/10 text-success border border-success/20"
                      : "bg-destructive/10 text-destructive border border-destructive/20"
                  }`}
                >
                  {sub.status === "active" ? "ACTIVE" : "SUSPENDED"}
                </span>
              </div>

              {/* Data Rows */}
              <div className="space-y-1.5 py-2 border-y border-border/50 text-xs font-mono">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="text-[10px] uppercase font-bold">Package:</span>
                  <span className="font-bold text-primary truncate max-w-[120px]">{sub.packageName}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="text-[10px] uppercase font-bold">IP Address:</span>
                  <span className="text-foreground">{sub.staticIp || "103.14.22.84"}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="text-[10px] uppercase font-bold">Optical Rx:</span>
                  <span className="font-bold text-success">{sub.opticalRxDbm || -18.4} dBm</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="text-[10px] uppercase font-bold">Balance:</span>
                  <span className={`font-bold ${sub.ledgerBalancePkr > 0 ? "text-destructive" : "text-foreground"}`}>
                    Rs. {(sub.ledgerBalancePkr || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 mt-1">
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <Tooltip content="Disconnect Radius Session" position="top">
                  <button
                    type="button"
                    onClick={() => onDisconnect(sub)}
                    className="p-1.5 border border-border rounded text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    <Unplug className="w-3.5 h-3.5" />
                  </button>
                </Tooltip>
                <Tooltip content="Restart ONT & Port" position="top">
                  <button
                    type="button"
                    onClick={() => onRestart(sub)}
                    className="p-1.5 border border-border rounded text-success hover:bg-success/10 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </Tooltip>
              </div>

              <span className="text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                View 360° <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
