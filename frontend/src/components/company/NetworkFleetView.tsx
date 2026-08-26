"use client";

import React, { useState } from "react";
import {
  Network,
  Radio,
  Server,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Cpu,
  Search,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";

export interface OltNode {
  id: string;
  name: string;
  model: string;
  branchName: string;
  ipAddress: string;
  totalPonPorts: number;
  activeOnus: number;
  opticalHealthPercent: number;
  status: "NOMINAL" | "HIGH_ATTENUATION" | "LOS_OUTAGE";
  lastPolled: string;
}

export function NetworkFleetView() {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const oltNodes: OltNode[] = [
    {
      id: "olt-01",
      name: "OLT-ISB-CORE-01",
      model: "Huawei SmartAX MA5800-X17",
      branchName: "Islamabad Blue Area (HQ)",
      ipAddress: "10.200.1.10",
      totalPonPorts: 16,
      activeOnus: 1024,
      opticalHealthPercent: 98.7,
      status: "NOMINAL",
      lastPolled: "Just now",
    },
    {
      id: "olt-02",
      name: "OLT-ISB-F7-02",
      model: "ZTE ZXA10 C320 GPON",
      branchName: "Islamabad F-7",
      ipAddress: "10.200.1.22",
      totalPonPorts: 8,
      activeOnus: 512,
      opticalHealthPercent: 92.4,
      status: "HIGH_ATTENUATION",
      lastPolled: "30s ago",
    },
    {
      id: "olt-03",
      name: "OLT-LHR-GLB-01",
      model: "Huawei SmartAX MA5800-X7",
      branchName: "Lahore Gulberg III",
      ipAddress: "10.200.2.10",
      totalPonPorts: 16,
      activeOnus: 980,
      opticalHealthPercent: 99.1,
      status: "NOMINAL",
      lastPolled: "Just now",
    },
    {
      id: "olt-04",
      name: "OLT-RWP-SDR-01",
      model: "Huawei SmartAX MA5608T",
      branchName: "Rawalpindi Saddar",
      ipAddress: "10.200.3.10",
      totalPonPorts: 8,
      activeOnus: 480,
      opticalHealthPercent: 88.0,
      status: "LOS_OUTAGE",
      lastPolled: "1m ago",
    },
  ];

  const filteredNodes = oltNodes.filter(
    (n) =>
      n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
            SmartOLT Fleet & Core Network Radar
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time telemetry of 20 branch GPON OLT hardware nodes, active PPPoE BRAS sessions, and optical attenuation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" hasPulse className="font-mono text-xs">
            RADAR SYNC ACTIVE (0ms LAG)
          </Badge>
        </div>
      </div>

      {/* 2. KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-card border-border shadow-xs">
          <span className="text-xs font-mono uppercase text-muted-foreground">
            Total GPON OLT Nodes
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-2xl text-foreground">
              20 Core OLTs
            </span>
            <Badge variant="secondary" className="font-mono text-xs">
              184 PON Ports
            </Badge>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border shadow-xs">
          <span className="text-xs font-mono uppercase text-muted-foreground">
            Active Online ONUs
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-2xl text-success">
              142,850 ONUs
            </span>
            <span className="text-xs font-mono text-success font-bold">
              99.2% Online
            </span>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border shadow-xs">
          <span className="text-xs font-mono uppercase text-muted-foreground">
            MikroTik BRAS Throughput
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-2xl text-primary">
              184.2 Gbps
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              Upstream Transit
            </span>
          </div>
        </Card>
      </div>

      {/* 3. OLT Table */}
      <Card className="bg-card border-border shadow-xs">
        <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-heading font-bold">
            Branch OLT Node Telemetry Ledger
          </CardTitle>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search OLT nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OLT Node</TableHead>
                <TableHead>Branch Office</TableHead>
                <TableHead>Management IP</TableHead>
                <TableHead>PON Ports / ONUs</TableHead>
                <TableHead>Optical Health</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNodes.map((node) => (
                <TableRow key={node.id} className="hover:bg-card-subtle/40 transition-colors">
                  <TableCell>
                    <div>
                      <span className="font-bold text-xs text-foreground block">
                        {node.name}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {node.model}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {node.branchName}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-primary font-bold">
                    {node.ipAddress}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-foreground">
                    {node.totalPonPorts} Ports • {node.activeOnus} ONUs
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-card-subtle overflow-hidden border border-border-subtle">
                        <div
                          className={`h-full rounded-full ${
                            node.opticalHealthPercent >= 98
                              ? "bg-success"
                              : node.opticalHealthPercent >= 90
                              ? "bg-warning"
                              : "bg-destructive"
                          }`}
                          style={{ width: `${node.opticalHealthPercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold text-foreground">
                        {node.opticalHealthPercent}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        node.status === "NOMINAL"
                          ? "success"
                          : node.status === "HIGH_ATTENUATION"
                          ? "warning"
                          : "destructive"
                      }
                      hasPulse={node.status !== "NOMINAL"}
                      className="font-mono text-[9px]"
                    >
                      {node.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
