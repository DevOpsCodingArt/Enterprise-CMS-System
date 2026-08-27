"use client";

import React, { useState } from "react";
import { X, Search as SearchIcon, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/shared/DateTimePicker";
import { mockDb, SubscriberRecord } from "@/mock/db";
import { FullTroubleTicket } from "./TicketDetailPane";

function createTicketRecord(
  customer: SubscriberRecord,
  category: string,
  priority: "Urgent" | "High" | "Normal",
  assignedStaff: string,
  vanNo: string,
  remarks: string,
  ettrValue: string
): FullTroubleTicket {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const targetEttr = ettrValue || new Date(timestamp + 7200000).toISOString();

  return {
    id: `TKT-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    ticketNo: `TK-${randomSuffix}`,
    customerName: customer.fullName,
    username: customer.pppoeUsername || `${customer.fullName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_pppoe`,
    contact: customer.phone,
    address: customer.address,
    type: category,
    priority: priority,
    status: "Pending",
    assignedTo: assignedStaff,
    vanNo: vanNo,
    createdBy: "Admin (NOC)",
    createdAt: new Date().toISOString(),
    creationRemarks: remarks || `${category} reported on subscriber line. Field dispatch ordered.`,
    ettr: targetEttr,
    ettrHistory: [
      {
        timestamp: new Date().toISOString(),
        changedBy: "Admin (NOC)",
        change: `Initial ETTR set to ${new Date(targetEttr).toLocaleString()}`,
        reason: "Automatic SLA assignment.",
      },
    ],
    transferHistory: [],
    notes: [
      {
        id: `note-${timestamp}`,
        timestamp: new Date().toISOString(),
        author: "System Dispatcher",
        content: `Complaint registered under category: ${category}. Assigned to ${assignedStaff}.`,
      },
    ],
    opticalDbm: customer.opticalRxDbm || -28.5,
    ontStatus: "LOS / Offline",
    lat: 33.6844,
    lng: 73.0479,
    slaMinutesLeft: priority === "Urgent" ? 60 : priority === "High" ? 120 : 240,
    description: remarks || `${category} reported on subscriber line. Field dispatch ordered.`,
  };
}

export function GenerateTicketDrawer({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newTicket: FullTroubleTicket) => void;
}) {
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<SubscriberRecord | null>(null);
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);

  const [category, setCategory] = useState("Fiber Drop Cut / Red LOS");
  const [priority, setPriority] = useState<"Urgent" | "High" | "Normal">("High");
  const [ettr, setEttr] = useState("");
  const [assignedStaff, setAssignedStaff] = useState("Usman Ali (Lead Splicer)");
  const [vanNo, setVanNo] = useState("Van #04");
  const [remarks, setRemarks] = useState("");

  const filteredCustomers = mockDb.subscribers.filter((s) => {
    if (!customerSearch) return false;
    const q = customerSearch.toLowerCase();
    return (
      s.fullName.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      s.customerCode.toLowerCase().includes(q) ||
      s.pppoeUsername.toLowerCase().includes(q)
    );
  });

  const isValid = selectedCustomer && category && priority;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const newTicket = createTicketRecord(
      selectedCustomer,
      category,
      priority,
      assignedStaff,
      vanNo,
      remarks,
      ettr
    );

    onCreate(newTicket);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setCustomerSearch("");
    setSelectedCustomer(null);
    setCategory("Fiber Drop Cut / Red LOS");
    setPriority("High");
    setEttr("");
    setRemarks("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-xs"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md h-full bg-card border-l border-border shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-card shrink-0">
              <div>
                <h2 className="text-base font-heading font-bold text-foreground">
                  Generate New Trouble Ticket
                </h2>
                <p className="text-xs text-muted-foreground">Register customer complaint & dispatch technician</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleGenerate} className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 custom-scrollbar text-xs">
              {/* Customer Autocomplete */}
              <div className="relative">
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-1 font-mono">
                  Select Subscriber <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search name, phone, PPPoE user..."
                    value={selectedCustomer ? selectedCustomer.fullName : customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setSelectedCustomer(null);
                      setIsCustomerOpen(true);
                    }}
                    onFocus={() => setIsCustomerOpen(true)}
                    className="w-full pl-9 pr-3 py-2 bg-muted/30 border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono text-xs shadow-sm"
                  />
                  {selectedCustomer && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCustomer(null);
                        setCustomerSearch("");
                      }}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {isCustomerOpen && filteredCustomers.length > 0 && !selectedCustomer && (
                  <div className="absolute z-20 w-full mt-1 bg-card text-foreground border border-border rounded-md shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                    {filteredCustomers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedCustomer(c);
                          setIsCustomerOpen(false);
                        }}
                        className="p-2.5 hover:bg-muted/60 cursor-pointer flex flex-col border-b border-border/50 last:border-0 text-xs"
                      >
                        <span className="font-bold text-foreground">{c.fullName}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {c.customerCode} • {c.phone} • {c.address}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ticket Category */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-1 font-mono">
                  Fault Category <span className="text-destructive">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-muted/30 border border-border rounded p-2 text-foreground font-mono"
                >
                  <option value="Complaint - Fiber (Red LOS)">Complaint - Fiber (Red LOS / No Light)</option>
                  <option value="High Optical Attenuation">High Optical Attenuation (Signal Degradation)</option>
                  <option value="Speed Degradation">Speed Degradation (Bandwidth Issue)</option>
                  <option value="Router / Hardware Fault">Router / Hardware Fault (LAN/WLAN Issue)</option>
                  <option value="Billing / Payment Lock">Billing / Payment Lock</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-1 font-mono">
                  Priority SLA <span className="text-destructive">*</span>
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as "Urgent" | "High" | "Normal")}
                  className="w-full bg-muted/30 border border-border rounded p-2 text-foreground font-mono"
                >
                  <option value="Urgent">Urgent (P1 - 1 Hour SLA)</option>
                  <option value="High">High (P2 - 2 Hours SLA)</option>
                  <option value="Normal">Normal (P3 - 4 Hours SLA)</option>
                </select>
              </div>

              {/* Target ETTR */}
              <DateTimePicker
                label="Target Resolution Time (ETTR)"
                value={ettr}
                onChange={setEttr}
              />

              {/* Assign to Staff & Van */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-1 font-mono">
                    Assign Technician
                  </label>
                  <select
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    className="w-full bg-muted/30 border border-border rounded p-2 text-foreground font-mono"
                  >
                    <option value="Usman Ali (Lead Splicer)">Usman Ali (Lead Splicer)</option>
                    <option value="Bilal Hassan (Technician)">Bilal Hassan (Technician)</option>
                    <option value="Imran Splicer (Drop Team)">Imran Splicer (Drop Team)</option>
                    <option value="Farhan NOC (Remote Desk)">Farhan NOC (Remote Desk)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-1 font-mono">
                    Dispatch Vehicle
                  </label>
                  <select
                    value={vanNo}
                    onChange={(e) => setVanNo(e.target.value)}
                    className="w-full bg-muted/30 border border-border rounded p-2 text-foreground font-mono"
                  >
                    <option value="Van #04">Van #04 (OTDR Equipped)</option>
                    <option value="Van #02">Van #02 (Heavy Splicer)</option>
                    <option value="Bike #02">Bike #02 (Fast Response)</option>
                    <option value="Remote">Remote Console</option>
                  </select>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-1 font-mono">
                  Field Dispatch Remarks
                </label>
                <textarea
                  placeholder="Enter specific instructions, splitter details, or landmark notes..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full p-2.5 bg-muted/30 border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[90px]"
                />
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-border mt-auto flex flex-col gap-2">
                <Button type="submit" size="lg" disabled={!isValid} className="w-full font-bold shadow-sm cursor-pointer rounded">
                  <Plus className="h-4 w-4 mr-1" /> Create Ticket & Dispatch
                </Button>
                <p className="text-[10px] text-center text-muted-foreground font-mono">
                  SLA timer starts automatically upon creation.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
