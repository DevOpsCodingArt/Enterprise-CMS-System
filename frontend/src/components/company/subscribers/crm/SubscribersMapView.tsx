"use client";

import React, { useState } from "react";
import { MapPin, Server, Wifi, Activity, Radio, Users, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { SubscriberRecord } from "@/mock/db";

interface SectorNode {
  id: string;
  name: string;
  sector: string;
  olt: string;
  totalSubs: number;
  onlineSubs: number;
  opticalRxAvg: string;
  status: "optimal" | "warning";
  coords: { x: number; y: number };
}

const SECTOR_NODES: SectorNode[] = [
  {
    id: "node-f10",
    name: "F-10 OLT Core Hub",
    sector: "Sector F-10 Islamabad",
    olt: "Huawei MA5800-X7 (ISB-F10)",
    totalSubs: 1240,
    onlineSubs: 1218,
    opticalRxAvg: "-18.2 dBm",
    status: "optimal",
    coords: { x: 35, y: 42 },
  },
  {
    id: "node-f8",
    name: "F-8 OLT Substation",
    sector: "Sector F-8 Islamabad",
    olt: "Huawei MA5800-X7 (ISB-F8)",
    totalSubs: 890,
    onlineSubs: 874,
    opticalRxAvg: "-17.9 dBm",
    status: "optimal",
    coords: { x: 55, y: 30 },
  },
  {
    id: "node-f7",
    name: "F-7 Distribution OLT",
    sector: "Sector F-7 Islamabad",
    olt: "Huawei MA5800-X7 (ISB-F7)",
    totalSubs: 760,
    onlineSubs: 752,
    opticalRxAvg: "-18.8 dBm",
    status: "optimal",
    coords: { x: 72, y: 22 },
  },
  {
    id: "node-g11",
    name: "G-11 Markaz OLT",
    sector: "Sector G-11 Islamabad",
    olt: "ZTE C320 (ISB-G11)",
    totalSubs: 640,
    onlineSubs: 610,
    opticalRxAvg: "-20.4 dBm",
    status: "warning",
    coords: { x: 28, y: 68 },
  },
  {
    id: "node-e11",
    name: "E-11 Executive OLT",
    sector: "Sector E-11 Islamabad",
    olt: "Huawei MA5800-X7 (ISB-E11)",
    totalSubs: 420,
    onlineSubs: 412,
    opticalRxAvg: "-16.5 dBm",
    status: "optimal",
    coords: { x: 18, y: 28 },
  },
  {
    id: "node-be",
    name: "Bahria Enclave Sector C Hub",
    sector: "Bahria Enclave Islamabad",
    olt: "FiberHome AN5516-04",
    totalSubs: 310,
    onlineSubs: 302,
    opticalRxAvg: "-19.1 dBm",
    status: "optimal",
    coords: { x: 84, y: 72 },
  },
];

export function SubscribersMapView({
  subscribers,
  onSelectSubscriber,
}: {
  subscribers: SubscriberRecord[];
  onSelectSubscriber: (sub: SubscriberRecord) => void;
}) {
  const [selectedNode, setSelectedNode] = useState<SectorNode>(SECTOR_NODES[0]);

  // Filter subscribers belonging to the active sector or all
  const nodeSubscribers = subscribers.filter(
    (s) =>
      s.address.toLowerCase().includes(selectedNode.sector.split(" ")[1]?.toLowerCase() || "f-10") ||
      s.branchName.toLowerCase().includes("islamabad")
  );

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-[500px]">
      {/* Visual Spatial Map Canvas */}
      <div className="flex-1 bg-card border border-border rounded-xl shadow-sm p-4 relative overflow-hidden flex flex-col justify-between">
        <div className="flex justify-between items-center z-10">
          <div>
            <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" /> Islamabad Metro FTTH Topology Map
            </h3>
            <p className="text-xs text-muted-foreground font-mono">Live GPON OLT node telemetry & drop coverage</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-success"></span> Optimal (5)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-warning"></span> Minor Alert (1)
            </span>
          </div>
        </div>

        {/* Map Grid Surface */}
        <div className="relative w-full h-[400px] my-3 rounded-lg border border-border/80 bg-muted/20 overflow-hidden">
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40"></div>

          {/* Node Connecting Circuit Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-primary/30 stroke-[1.5] stroke-dasharray-4">
            <line x1="35%" y1="42%" x2="55%" y2="30%" />
            <line x1="55%" y1="30%" x2="72%" y2="22%" />
            <line x1="35%" y1="42%" x2="28%" y2="68%" />
            <line x1="35%" y1="42%" x2="18%" y2="28%" />
            <line x1="72%" y1="22%" x2="84%" y2="72%" />
          </svg>

          {/* Sector Node Pins */}
          {SECTOR_NODES.map((node) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedNode(node)}
                style={{ left: `${node.coords.x}%`, top: `${node.coords.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl transition-all cursor-pointer group flex items-center gap-2 ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20 z-20 scale-110"
                    : "bg-card border border-border hover:border-primary text-foreground shadow-sm hover:scale-105 z-10"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full shrink-0 ${
                    node.status === "optimal" ? "bg-success animate-pulse" : "bg-warning animate-pulse"
                  }`}
                />
                <div className="text-left font-mono">
                  <p className="text-[11px] font-bold leading-tight">{node.name.split(" ")[0]}</p>
                  <p className={`text-[9px] ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {node.onlineSubs}/{node.totalSubs}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Node Status Footer */}
        <div className="p-3 bg-muted/30 border border-border rounded-lg flex flex-wrap justify-between items-center text-xs font-mono">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground">{selectedNode.name}</span>
            <span className="text-muted-foreground">({selectedNode.olt})</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Avg Rx: <strong className="text-success">{selectedNode.opticalRxAvg}</strong></span>
            <span>Uptime: <strong className="text-foreground">99.98%</strong></span>
            <span>Capacity: <strong className="text-primary">{selectedNode.onlineSubs} Active Subs</strong></span>
          </div>
        </div>
      </div>

      {/* Node Connected Subscribers Sidebar */}
      <div className="w-full lg:w-80 bg-card border border-border rounded-xl shadow-sm p-4 flex flex-col">
        <div className="flex justify-between items-center pb-3 border-b border-border mb-3">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">Sector Subscribers</h4>
            <p className="text-[11px] text-muted-foreground font-mono">{selectedNode.sector}</p>
          </div>
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs font-bold">
            {nodeSubscribers.length} Links
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar max-h-[460px] pr-1">
          {nodeSubscribers.map((sub) => (
            <div
              key={sub.id}
              onClick={() => onSelectSubscriber(sub)}
              className="p-2.5 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors cursor-pointer group flex flex-col gap-1"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors truncate max-w-[140px]">
                  {sub.fullName}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-success/10 text-success border border-success/20">
                  ONLINE
                </span>
              </div>
              <div className="flex justify-between items-center text-[10.5px] font-mono text-muted-foreground">
                <span>{sub.pppoeUsername}</span>
                <span className="text-primary font-medium">{sub.packageName.split(" ")[0]} Mbps</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono pt-1 border-t border-border/50">
                <span className="text-success font-bold">{sub.opticalRxDbm || -18.4} dBm</span>
                <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-primary font-bold">
                  Inspect 360° <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
