"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  Plus,
  Maximize2,
  X,
  Trash2,
  User,
  Wallet,
  Server,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewConnectionLead } from "@/mock/db";
import { cn } from "@/lib/utils";

export function ConnectionsManagerWorkspace({
  connectionsList,
  setConnectionsList,
  selectedLead,
  setSelectedLead,
}: {
  connectionsList: NewConnectionLead[];
  setConnectionsList: React.Dispatch<React.SetStateAction<NewConnectionLead[]>>;
  selectedLead: NewConnectionLead | null;
  setSelectedLead: (lead: NewConnectionLead | null) => void;
}) {
  const [viewMode, setViewMode] = useState<"table" | "pipeline">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedCard, setExpandedCard] = useState<"customer" | "services" | "accounts" | "assignment" | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Lead Form State
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadCnic, setLeadCnic] = useState("");
  const [leadAddress, setLeadAddress] = useState("");
  const [leadPackage, setLeadPackage] = useState("50 Mbps Turbo Fiber (PKR 3,850/mo)");
  const [leadTech, setLeadTech] = useState("Usman Ali (Van #04)");

  const activeLead = selectedLead || connectionsList[0] || null;

  const filteredConnections = useMemo(() => {
    return connectionsList.filter((conn) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        conn.leadNo.toLowerCase().includes(q) ||
        conn.applicantName.toLowerCase().includes(q) ||
        conn.phone.includes(q);

      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && conn.stage === "installation_scheduled") ||
        (statusFilter === "Pending" && (conn.stage === "inquiry" || conn.stage === "feasibility_passed"));

      return matchSearch && matchStatus;
    });
  }, [connectionsList, searchQuery, statusFilter]);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: NewConnectionLead = {
      id: `lead-${Date.now()}`,
      leadNo: `NC-${Math.floor(1000 + Math.random() * 9000)}`,
      applicantName: leadName || "New Applicant",
      cnic: leadCnic || "37405-1234567-1",
      phone: leadPhone || "+92 300 0000000",
      address: leadAddress || "Sector F-10, Islamabad",
      branchName: "Islamabad Core (F-10 HQ)",
      selectedPackage: leadPackage,
      stage: "feasibility_passed",
      fatBoxNearest: "FAT-F10-12 (Port 3)",
      fatDistanceMeters: 45,
      portAvailable: true,
      securityDepositPkr: 5000,
      assignedVan: leadTech,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setConnectionsList([newLead, ...connectionsList]);
    setSelectedLead(newLead);
    setIsCreateOpen(false);
    setLeadName("");
    setLeadPhone("");
    setLeadCnic("");
    setLeadAddress("");
  };

  const handleDeleteLead = (id: string) => {
    setConnectionsList((prev) => prev.filter((c) => c.id !== id));
    if (selectedLead?.id === id) {
      setSelectedLead(connectionsList.find((c) => c.id !== id) || null);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full overflow-hidden bg-background">
      {/* 1. TOP HEADER & FILTER BAR */}
      <div className="p-3.5 border-b border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search connections by SR #, applicant, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-muted/30 rounded-lg px-3 py-1.5 border border-border focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* View Switcher */}
          <div className="flex items-center rounded-lg bg-muted/60 p-0.5 border border-border text-xs">
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer",
                viewMode === "table" ? "bg-card text-foreground font-bold shadow-2xs" : "text-muted-foreground"
              )}
            >
              Table & Dock
            </button>
            <button
              onClick={() => setViewMode("pipeline")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer",
                viewMode === "pipeline" ? "bg-card text-foreground font-bold shadow-2xs" : "text-muted-foreground"
              )}
            >
              GIS Pipeline
            </button>
          </div>

          <Button size="sm" onClick={() => setIsCreateOpen(true)} className="text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" /> New Connection Lead
          </Button>
        </div>
      </div>

      {viewMode === "table" ? (
        /* 2. DUAL-PANE TABLE + BOTTOM INSPECTION PANE */
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Main Connections Table */}
          <div className="flex-1 overflow-y-auto custom-scrollbar border-b border-border bg-card">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-muted/70 backdrop-blur-xs border-b border-border text-[11px] font-mono uppercase text-muted-foreground z-10">
                <tr>
                  <th className="p-3">SR No</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Area / Sector</th>
                  <th className="p-3">Package & Type</th>
                  <th className="p-3">Setup & Monthly</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Assigned Tech</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredConnections.map((conn) => {
                  const isSelected = activeLead?.id === conn.id;

                  return (
                    <tr
                      key={conn.id}
                      onClick={() => setSelectedLead(conn)}
                      className={cn(
                        "hover:bg-muted/20 transition-colors cursor-pointer group",
                        isSelected ? "bg-muted/50 border-l-2 border-l-primary" : "border-l-2 border-l-transparent"
                      )}
                    >
                      <td className="p-3 font-mono font-bold text-primary">{conn.leadNo}</td>
                      <td className="p-3">
                        <div className="font-bold text-foreground">{conn.applicantName}</div>
                      </td>
                      <td className="p-3 font-mono text-muted-foreground">{conn.phone}</td>
                      <td className="p-3 text-muted-foreground">Sector F-10, Islamabad</td>
                      <td className="p-3">
                        <div className="font-medium text-foreground">{conn.selectedPackage}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">GPON Fiber Drop</div>
                      </td>
                      <td className="p-3 font-mono">
                        <span className="font-bold text-foreground">PKR 8,850</span>
                        <div className="text-[10px] text-muted-foreground">OTC + 1st Mo</div>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            conn.stage === "installation_scheduled"
                              ? "warning"
                              : conn.stage === "feasibility_passed"
                              ? "info"
                              : "secondary"
                          }
                          className="text-[10px] capitalize"
                        >
                          {conn.stage.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="p-3 font-mono text-muted-foreground">{conn.assignedVan}</td>
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title="Delete Lead"
                            onClick={() => handleDeleteLead(conn.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 3. DOCKED BOTTOM INSPECTION PANE */}
          {activeLead && (
            <div className="h-72 border-t-2 border-border bg-card/90 backdrop-blur-xs flex flex-col shrink-0 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-xs text-foreground uppercase tracking-wider">
                    Connection Lead Inspection: {activeLead.leadNo} - {activeLead.applicantName}
                  </span>
                  <Badge variant="info" className="text-[10px]">
                    {activeLead.stage.replace("_", " ")}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => alert(`Activated subscriber profile for ${activeLead.applicantName}`)}
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Activate & Provision Profile
                  </Button>
                </div>
              </div>

              {/* 4 Bottom Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1 overflow-y-auto custom-scrollbar">
                {/* Card 1: Customer Details */}
                <div className="p-3 rounded-xl bg-background border border-border shadow-2xs space-y-2 relative group">
                  <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold flex items-center gap-1">
                      <User className="w-3 h-3 text-primary" /> Customer Info
                    </span>
                    <button
                      onClick={() => setExpandedCard("customer")}
                      className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-foreground">{activeLead.applicantName}</div>
                    <div className="font-mono text-muted-foreground text-[11px]">{activeLead.phone}</div>
                    <div className="text-muted-foreground text-[11px] truncate">{activeLead.address}</div>
                  </div>
                </div>

                {/* Card 2: Service & Hardware Details */}
                <div className="p-3 rounded-xl bg-background border border-border shadow-2xs space-y-2 relative group">
                  <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold flex items-center gap-1">
                      <Server className="w-3 h-3 text-emerald-600" /> Service & GIS
                    </span>
                    <button
                      onClick={() => setExpandedCard("services")}
                      className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-xs space-y-1 font-mono">
                    <div className="font-bold text-foreground truncate">{activeLead.selectedPackage}</div>
                    <div className="text-muted-foreground text-[11px]">FAT: {activeLead.fatBoxNearest}</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                      Fiber Drop: {activeLead.fatDistanceMeters}m
                    </div>
                  </div>
                </div>

                {/* Card 3: Financial Accounts */}
                <div className="p-3 rounded-xl bg-background border border-border shadow-2xs space-y-2 relative group">
                  <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold flex items-center gap-1">
                      <Wallet className="w-3 h-3 text-teal-600" /> Accounts & Billing
                    </span>
                    <button
                      onClick={() => setExpandedCard("accounts")}
                      className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-xs space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Setup (OTC):</span>
                      <span className="font-bold">PKR 5,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Fee:</span>
                      <span className="font-bold">PKR 3,850</span>
                    </div>
                    <div className="flex justify-between border-t border-border/60 pt-0.5">
                      <span className="text-muted-foreground font-bold">Total Expected:</span>
                      <span className="font-bold text-primary">PKR 8,850</span>
                    </div>
                  </div>
                </div>

                {/* Card 4: Assignment Details */}
                <div className="p-3 rounded-xl bg-background border border-border shadow-2xs space-y-2 relative group">
                  <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-primary" /> Assignment
                    </span>
                    <button
                      onClick={() => setExpandedCard("assignment")}
                      className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-foreground">{activeLead.assignedVan}</div>
                    <div className="text-muted-foreground font-mono text-[11px]">Assigned by NOC Admin</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] font-mono">
                      ✓ Splicer Ready
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 5-STAGE GIS PIPELINE VIEW */
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {/* Stage 1 */}
            <div className="p-3.5 rounded-2xl bg-muted/20 border border-border space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-heading font-bold text-xs text-foreground uppercase">1. Inquiries</span>
                <Badge variant="secondary" className="text-[10px] font-mono">1 Lead</Badge>
              </div>
              {connectionsList
                .filter((l) => l.stage === "inquiry")
                .map((lead) => (
                  <div key={lead.id} className="p-3 rounded-xl bg-card border border-border shadow-2xs space-y-2">
                    <div className="font-mono font-bold text-xs text-primary">{lead.leadNo}</div>
                    <div className="font-heading font-bold text-xs text-foreground">{lead.applicantName}</div>
                    <div className="text-[11px] text-muted-foreground">{lead.selectedPackage}</div>
                    <div className="p-2 rounded-lg bg-muted/30 border border-border/60 text-[10px] font-mono text-muted-foreground">
                      Nearest FAT: {lead.fatBoxNearest} ({lead.fatDistanceMeters}m)
                    </div>
                  </div>
                ))}
            </div>

            {/* Stage 2 */}
            <div className="p-3.5 rounded-2xl bg-muted/20 border border-border space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-heading font-bold text-xs text-foreground uppercase">2. Feasibility OK</span>
                <Badge variant="info" className="text-[10px] font-mono">1 Lead</Badge>
              </div>
              {connectionsList
                .filter((l) => l.stage === "feasibility_passed")
                .map((lead) => (
                  <div key={lead.id} className="p-3 rounded-xl bg-card border border-border shadow-2xs space-y-2">
                    <div className="font-mono font-bold text-xs text-info">{lead.leadNo}</div>
                    <div className="font-heading font-bold text-xs text-foreground">{lead.applicantName}</div>
                    <div className="text-[11px] text-muted-foreground">{lead.selectedPackage}</div>
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                      ✓ FAT Distance: {lead.fatDistanceMeters}m OK
                    </div>
                  </div>
                ))}
            </div>

            {/* Stage 3 */}
            <div className="p-3.5 rounded-2xl bg-muted/20 border border-border space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-heading font-bold text-xs text-foreground uppercase">3. Deposit Paid</span>
                <Badge variant="success" className="text-[10px] font-mono">PKR 5,000</Badge>
              </div>
              <div className="p-4 text-center text-xs text-muted-foreground">0 Pending KYC</div>
            </div>

            {/* Stage 4 */}
            <div className="p-3.5 rounded-2xl bg-muted/20 border border-border space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-heading font-bold text-xs text-foreground uppercase">4. Scheduled</span>
                <Badge variant="warning" className="text-[10px] font-mono">Today</Badge>
              </div>
              {connectionsList
                .filter((l) => l.stage === "installation_scheduled")
                .map((lead) => (
                  <div key={lead.id} className="p-3 rounded-xl bg-card border border-border shadow-2xs space-y-2">
                    <div className="font-mono font-bold text-xs text-warning">{lead.leadNo}</div>
                    <div className="font-heading font-bold text-xs text-foreground">{lead.applicantName}</div>
                    <div className="text-[11px] text-muted-foreground">{lead.selectedPackage}</div>
                    <div className="p-2 rounded-lg bg-warning/10 border border-warning/30 text-[10px] font-mono text-warning font-bold">
                      Assigned: {lead.assignedVan}
                    </div>
                    <Button
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => alert(`Activated subscriber profile for ${lead.applicantName}`)}
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Activate & Create User
                    </Button>
                  </div>
                ))}
            </div>

            {/* Stage 5 */}
            <div className="p-3.5 rounded-2xl bg-muted/20 border border-border space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-heading font-bold text-xs text-foreground uppercase">5. Activated</span>
                <Badge variant="success" className="text-[10px] font-mono">1,840 Total</Badge>
              </div>
              <div className="p-4 text-center text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                ✓ 14 Activations This Week
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXPANDED MODAL ZOOM FOR CONNECTION BOTTOM PANE */}
      {expandedCard && activeLead && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setExpandedCard(null)}
        >
          <div
            className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-heading font-bold text-lg text-foreground capitalize">
                {expandedCard} Inspection - {activeLead.leadNo}
              </h3>
              <button
                onClick={() => setExpandedCard(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {expandedCard === "customer" && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2">
                  <div className="text-xs text-muted-foreground uppercase font-mono">Applicant Name</div>
                  <div className="font-bold text-base text-foreground">{activeLead.applicantName}</div>
                  <div className="text-xs text-muted-foreground font-mono">{activeLead.phone}</div>
                  <div className="text-xs text-foreground">{activeLead.address}</div>
                </div>
              </div>
            )}

            {expandedCard === "services" && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2">
                  <div className="text-muted-foreground uppercase">Selected Broadband Plan</div>
                  <div className="font-bold text-base text-foreground">{activeLead.selectedPackage}</div>
                  <div>Nearest FAT Box: {activeLead.fatBoxNearest}</div>
                  <div className="text-emerald-600 font-bold">Calculated Drop Distance: {activeLead.fatDistanceMeters}m</div>
                </div>
              </div>
            )}

            {expandedCard === "accounts" && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2">
                  <div className="flex justify-between">
                    <span>One-Time Charge (OTC):</span>
                    <span className="font-bold">PKR 5,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>First Month Tariff:</span>
                    <span className="font-bold">PKR 3,850</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-primary">
                    <span>Total Deposit Expected:</span>
                    <span>PKR 8,850</span>
                  </div>
                </div>
              </div>
            )}

            {expandedCard === "assignment" && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                  <span className="text-xs font-mono uppercase text-primary font-bold">Assigned Field Unit</span>
                  <div className="font-heading font-bold text-base text-foreground">{activeLead.assignedVan}</div>
                  <div className="text-xs text-muted-foreground font-mono">Ready for on-site fiber splicing and drop cable installation.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE NEW LEAD MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-heading font-bold text-base text-foreground">
                Intake New Connection Lead
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-foreground">Applicant Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="mt-1 w-full text-xs bg-muted/30 rounded-lg p-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+92 300 1234567"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="mt-1 w-full text-xs bg-muted/30 rounded-lg p-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Installation Address</label>
                <input
                  type="text"
                  required
                  placeholder="Sector F-10/4, Islamabad"
                  value={leadAddress}
                  onChange={(e) => setLeadAddress(e.target.value)}
                  className="mt-1 w-full text-xs bg-muted/30 rounded-lg p-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Package</label>
                <select
                  value={leadPackage}
                  onChange={(e) => setLeadPackage(e.target.value)}
                  className="mt-1 w-full text-xs bg-muted/30 rounded-lg p-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="50 Mbps Turbo Fiber (PKR 3,850/mo)">50 Mbps Turbo Fiber (PKR 3,850/mo)</option>
                  <option value="100 Mbps Ultra Fiber (PKR 6,200/mo)">100 Mbps Ultra Fiber (PKR 6,200/mo)</option>
                  <option value="25 Mbps Home Fiber (PKR 2,450/mo)">25 Mbps Home Fiber (PKR 2,450/mo)</option>
                </select>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full text-xs">
                  Create Lead & Run GIS Feasibility
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
