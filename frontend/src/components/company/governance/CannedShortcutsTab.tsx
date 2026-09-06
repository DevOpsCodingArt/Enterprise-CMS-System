"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CannedTemplate } from "@/types/telecom-entities.types";
import { telecomService } from "@/services/telecom.service";
import { staggerContainer, staggerItem, modalVariants } from "@/lib/motion";

export function CannedShortcutsTab() {
  const [cannedList, setCannedList] = useState<CannedTemplate[]>([]);
  const [isCreateCannedOpen, setIsCreateCannedOpen] = useState(false);
  const [newShortcut, setNewShortcut] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newTemplate, setNewTemplate] = useState("");
  const [newCategory, setNewCategory] = useState<"NOC Diagnostic" | "Billing" | "Field Dispatch" | "General">("General");

  useEffect(() => {
    let isMounted = true;
    telecomService.governance.getCannedShortcuts().then((data) => {
      if (isMounted) {
        setCannedList(
          data.map((d: any) => ({
            ...d,
            label: d.title || d.label || d.shortcut,
            templateText: d.body || d.content || d.templateText,
          }))
        );
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddCanned = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedShortcut = newShortcut.startsWith("/") ? newShortcut : `/${newShortcut}`;
    try {
      const created = await telecomService.governance.createCannedShortcut({
        shortcut: formattedShortcut,
        title: newLabel || "Quick Shortcut",
        body: newTemplate,
        category: newCategory,
      });

      const newCanned: CannedTemplate = {
        id: created.id || `can-${Date.now()}`,
        shortcut: formattedShortcut,
        label: newLabel || "Quick Shortcut",
        category: newCategory,
        templateText: newTemplate,
      };

      setCannedList((prev) => [...prev, newCanned]);
      setIsCreateCannedOpen(false);
      setNewShortcut("");
      setNewLabel("");
      setNewTemplate("");
    } catch (err) {
      console.error("Failed to create canned shortcut:", err);
    }
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
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {cannedList.map((c) => (
            <motion.div
              key={c.id}
              variants={staggerItem}
              className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 hover:bg-card-hover transition-all shadow-ambient space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-primary">{c.shortcut}</span>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {c.category}
                </Badge>
              </div>
              <div className="font-heading font-bold text-xs text-foreground">{c.label}</div>
              <div className="p-3 rounded-xl bg-card-subtle/50 border border-border/80 text-xs text-muted-foreground font-mono leading-relaxed">
                {c.templateText}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CREATE CANNED MODAL */}
      <AnimatePresence>
        {isCreateCannedOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-md bg-card rounded-2xl border border-border shadow-elevated p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="font-heading font-bold text-base text-foreground">Create Canned Slash Shortcut</h3>
                <button onClick={() => setIsCreateCannedOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
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
                    className="w-full bg-card-subtle/40 rounded-xl p-2 border border-border text-foreground font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-muted-foreground mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as "NOC Diagnostic" | "Billing" | "Field Dispatch" | "General")}
                    className="w-full bg-card-subtle/40 rounded-xl p-2 border border-border text-foreground"
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
                    className="w-full bg-card-subtle/40 rounded-xl p-2 border border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="block font-bold text-muted-foreground mb-1">Template Message</label>
                  <textarea
                    required
                    placeholder="Type message with {{customer_name}} placeholders..."
                    value={newTemplate}
                    onChange={(e) => setNewTemplate(e.target.value)}
                    className="w-full bg-card-subtle/40 rounded-xl p-2 border border-border text-foreground h-24 font-mono text-[11px]"
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
