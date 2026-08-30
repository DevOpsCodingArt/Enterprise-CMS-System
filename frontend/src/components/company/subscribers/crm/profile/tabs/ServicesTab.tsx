"use client";

import React, { useState } from "react";
import { Globe, Tv, Shield, Wifi } from "lucide-react";
import { SubscriberRecord } from "@/mock/db";
import { useToast } from "@/components/ui/toast";

export function ServicesTab({ subscriber }: { subscriber: SubscriberRecord }) {
  const toast = useToast();
  const [services, setServices] = useState([
    {
      id: "srv-1",
      name: "Static IP Allocation",
      desc: "Fixed public IPv4 (/32) routed via BGP for hosting DVR cameras and gaming servers.",
      icon: Globe,
      active: true,
      price: "Rs. 500/mo",
    },
    {
      id: "srv-2",
      name: "IPTV HD Premium",
      desc: "200+ HD Live TV Channels with 7-day catchup playback and VOD streaming.",
      icon: Tv,
      active: false,
      price: "Rs. 450/mo",
    },
    {
      id: "srv-3",
      name: "SafeNet DNS Security",
      desc: "Real-time AI malware, phishing, and parental content DNS filter at edge gateway.",
      icon: Shield,
      active: true,
      price: "Included Free",
    },
    {
      id: "srv-4",
      name: "Whole-Home Mesh Wi-Fi",
      desc: "Gigabit dual-band 802.11ax Wi-Fi 6 mesh nodes for seamless zero-dead-zone roaming.",
      icon: Wifi,
      active: false,
      price: "Rs. 1,200/mo",
    },
  ]);

  const toggleService = (id: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextState = !s.active;
          toast.success(
            nextState ? "Service Enabled" : "Service Disabled",
            `${s.name} ${nextState ? "activated" : "deactivated"} for ${subscriber.pppoeUsername}.`
          );
          return { ...s, active: nextState };
        }
        return s;
      })
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((srv) => (
        <div
          key={srv.id}
          className="bg-card rounded-xl border border-border p-5 shadow-xs flex items-center justify-between transition-all hover:border-primary/40"
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl transition-colors ${
                srv.active ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground"
              }`}
            >
              <srv.icon size={22} strokeWidth={2} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground tracking-tight">{srv.name}</h4>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-[220px] sm:max-w-[280px]">
                {srv.desc}
              </p>
              <div className="mt-2 text-[11px] font-mono font-bold text-muted-foreground bg-muted inline-block px-2 py-0.5 rounded border border-border/60">
                {srv.price}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2.5">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                srv.active
                  ? "bg-success/10 text-success border border-success/20"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              {srv.active ? "ACTIVE" : "INACTIVE"}
            </span>

            {/* Modern Toggle Switch */}
            <button
              type="button"
              onClick={() => toggleService(srv.id)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                srv.active ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-card shadow-sm transition-transform ${
                  srv.active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
