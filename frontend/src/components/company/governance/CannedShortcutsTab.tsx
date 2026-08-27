"use client";

import React, { useState } from "react";
import { Plus, CheckCircle2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockDb, CannedTemplate } from "@/mock/db";

export function CannedShortcutsTab() {
  const [cannedList, setCannedList] = useState<CannedTemplate[]>(mockDb.cannedShortcuts);
  const [isCreateCannedOpen, setIsCreateCannedOpen] = useState(false);
  const [newShortcut, setNewShortcut] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newTemplate, setNewTemplate] = useState("");
  const [newCategory, setNewCategory] = useState<"NOC Diagnostic" | "Billing" | "Field Dispatch" | "General">("General");

  const handleAddCanned = (e: React.FormEvent) => {
    e.preventDefault();
    const newCanned: CannedTemplate = {
      id: `can-${Date.now()}`,
      shortcut: newShortcut.startsWith("/") ? newShortcut : `/${newShortcut}`,
      label: newLabel || "Quick Shortcut",
      category: newCategory,
      templateText: newTemplate,
    };

    setCannedList([...cannedList, newCanned]);
    setIsCreateCannedOpen(false);
    setNewShortcut("");
    setNewLabel("");
    setNewTemplate("");
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-3.5 border-b border-border bg-card flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-heading font-bold text-sm text-foreground">
            Slash Shortcut Instant Canned Responses (/)
          </h2>
          <p className="text-xs text-muted-foreground">
            Type slash shortcuts in chat to instantly populate dynamic diagnostic templates and dispatch notes.
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateCannedOpen(true)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Canned Template
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cannedList.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-primary">{c.shortcut}</span>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {c.category}
                </Badge>
              </div>
              <div className="font-heading font-bold text-xs text-foreground">{c.label}</div>
              <div className="p-3 rounded-xl bg-muted/30 border border-border text-xs text-muted-foreground font-mono leading-relaxed">
                {c.templateText}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE CANNED MODAL */}
      {isCreateCannedOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-heading font-bold text-base text-foreground">Create Canned Slash Shortcut</h3>
              <button onClick={() => setIsCreateCannedOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddCanned} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-muted-foreground mb-1">Shortcut (e.g. /promo)</label>
                <input
                  type="text"
                  required
                  placeholder="/discount"
                  value={newShortcut}
                  onChange={(e) => setNewShortcut(e.target.value)}
                  className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-muted-foreground mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as "NOC Diagnostic" | "Billing" | "Field Dispatch" | "General")}
                  className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground"
                >
                  <option value="General">General</option>
                  <option value="NOC Diagnostic">NOC Diagnostic</option>
                  <option value="Billing">Billing</option>
                  <option value="Field Dispatch">Field Dispatch</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-muted-foreground mb-1">Label</label>
                <input
                  type="text"
                  required
                  placeholder="Special Discount Offer"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground"
                />
              </div>
              <div>
                <label className="block font-bold text-muted-foreground mb-1">Template Message</label>
                <textarea
                  required
                  placeholder="Type message with {{customer_name}} placeholders..."
                  value={newTemplate}
                  onChange={(e) => setNewTemplate(e.target.value)}
                  className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground h-24 font-mono text-[11px]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateCannedOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Add Template
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
