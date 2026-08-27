"use client";

import React, { useState } from "react";
import { Search, Plus, Download, Upload, Flame, Edit, X, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockDb, TariffPackage } from "@/mock/db";

export function TariffPackagesView() {
  const [packagesList, setPackagesList] = useState<TariffPackage[]>(mockDb.packages);
  const [searchPackage, setSearchPackage] = useState("");
  const [isCreatePackageOpen, setIsCreatePackageOpen] = useState(false);
  const [newPkgName, setNewPkgName] = useState("");
  const [newPkgSpeedDown, setNewPkgSpeedDown] = useState(50);
  const [newPkgSpeedUp, setNewPkgSpeedUp] = useState(50);
  const [newPkgPrice, setNewPkgPrice] = useState(3850);
  const [newPkgContention, setNewPkgContention] = useState("1:4 Shared");
  const [newPkgIpPool, setNewPkgIpPool] = useState("pool_residential_dhcp");

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Top Filter & Search Bar (Flush with top) */}
      <div className="p-3.5 border-b border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search packages by plan name, speed, IP pool..."
            value={searchPackage}
            onChange={(e) => setSearchPackage(e.target.value)}
            className="w-full text-xs bg-muted/30 rounded-lg px-3 py-1.5 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <Button size="sm" onClick={() => setIsCreatePackageOpen(true)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Create Tariff Plan
        </Button>
      </div>

      {/* Packages Bento Cards Grid (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {packagesList
            .filter((p) => {
              if (searchPackage.trim()) {
                const q = searchPackage.toLowerCase();
                return (
                  p.name.toLowerCase().includes(q) ||
                  p.ipPool.toLowerCase().includes(q) ||
                  `${p.speedDownMbps}`.includes(q)
                );
              }
              return true;
            })
            .map((pkg) => (
              <div
                key={pkg.id}
                className="p-5 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all shadow-xs space-y-4 relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[11px] font-bold text-muted-foreground uppercase">
                        {pkg.contentionRatio}
                      </span>
                      <h3 className="font-heading font-bold text-base text-foreground mt-0.5">
                        {pkg.name}
                      </h3>
                    </div>
                    {pkg.isPopular && (
                      <Badge variant="warning" className="text-[10px] flex items-center gap-1 font-mono">
                        <Flame className="h-3 w-3" /> Popular
                      </Badge>
                    )}
                  </div>

                  {/* Speed Gauges */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-muted/30 border border-border text-center font-mono">
                    <div className="space-y-0.5">
                      <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                        <Download className="h-3 w-3 text-emerald-600" /> Down
                      </div>
                      <div className="font-extrabold text-lg text-foreground">
                        {pkg.speedDownMbps} <span className="text-xs font-normal text-muted-foreground">Mbps</span>
                      </div>
                    </div>
                    <div className="space-y-0.5 border-l border-border/80">
                      <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                        <Upload className="h-3 w-3 text-primary" /> Up
                      </div>
                      <div className="font-extrabold text-lg text-foreground">
                        {pkg.speedUpMbps} <span className="text-xs font-normal text-muted-foreground">Mbps</span>
                      </div>
                    </div>
                  </div>

                  {/* Technical Config */}
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Radius IP Pool:</span>
                      <span className="text-foreground font-bold">{pkg.ipPool}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subscribers:</span>
                      <span className="text-primary font-bold">{pkg.activeSubscribers.toLocaleString()} Active</span>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Monthly Rate</span>
                    <span className="font-mono font-extrabold text-base text-foreground">
                      PKR {pkg.pricePkrMonthly.toLocaleString()}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => alert(`Editing configuration for plan ${pkg.name}`)}
                  >
                    <Edit className="h-3 w-3 mr-1" /> Edit
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* CREATE PACKAGE MODAL */}
      {isCreatePackageOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-heading font-bold text-base text-foreground">Create New Tariff Plan</h3>
              <button onClick={() => setIsCreatePackageOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newP: TariffPackage = {
                  id: `pkg-${Date.now()}`,
                  name: newPkgName || "Custom High-Speed Fiber",
                  speedDownMbps: Number(newPkgSpeedDown) || 50,
                  speedUpMbps: Number(newPkgSpeedUp) || 50,
                  contentionRatio: newPkgContention,
                  pricePkrMonthly: Number(newPkgPrice) || 3850,
                  ipPool: newPkgIpPool,
                  activeSubscribers: 0,
                };
                setPackagesList([...packagesList, newP]);
                setIsCreatePackageOpen(false);
                setNewPkgName("");
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-muted-foreground mb-1">Package Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 75 Mbps Turbo Gaming"
                  value={newPkgName}
                  onChange={(e) => setNewPkgName(e.target.value)}
                  className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-muted-foreground mb-1">Download Speed (Mbps)</label>
                  <input
                    type="number"
                    required
                    value={newPkgSpeedDown}
                    onChange={(e) => setNewPkgSpeedDown(Number(e.target.value))}
                    className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-muted-foreground mb-1">Upload Speed (Mbps)</label>
                  <input
                    type="number"
                    required
                    value={newPkgSpeedUp}
                    onChange={(e) => setNewPkgSpeedUp(Number(e.target.value))}
                    className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-muted-foreground mb-1">Monthly Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(Number(e.target.value))}
                    className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-muted-foreground mb-1">Contention Ratio</label>
                  <select
                    value={newPkgContention}
                    onChange={(e) => setNewPkgContention(e.target.value)}
                    className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground"
                  >
                    <option value="1:4 Shared">1:4 Shared</option>
                    <option value="1:2 Low Latency">1:2 Low Latency</option>
                    <option value="1:1 Dedicated CIR">1:1 Dedicated CIR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-muted-foreground mb-1">Radius IP Pool Name</label>
                <input
                  type="text"
                  required
                  value={newPkgIpPool}
                  onChange={(e) => setNewPkgIpPool(e.target.value)}
                  className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreatePackageOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Create Tariff Plan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
