"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Camera,
  StickyNote,
  Clock,
  Zap,
  PowerOff,
  ShieldAlert,
  LineChart,
  Plus,
  FileText,
  Settings,
  Server,
  Lock,
  Key,
  Link as LinkIcon,
  List,
  XCircle,
  User,
  X,
  MoreVertical,
  File,
} from "lucide-react";
import { SubscriberRecord } from "@/mock/db";
import { useToast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";

export function ProfileHeader({
  subscriber,
  onAction,
}: {
  subscriber: SubscriberRecord;
  onAction: (actionName: string) => void;
}) {
  const toast = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (splitRef.current && !splitRef.current.contains(event.target as Node)) {
        setIsActionsOpen(false);
      }
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsFabOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("Profile Synced", "Subscriber profile synced with RADIUS backend.");
    }, 1200);
  };

  const handlePhotoClick = () => fileInputRef.current?.click();
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      toast.success("Photo Updated", "Subscriber profile photo updated.");
    }
  };

  const handleAddNote = () => {
    const note = window.prompt("Add a quick note for this subscriber:");
    if (note) toast.success("Note Saved", "Note saved successfully to subscriber logs.");
  };

  const accountBillingActions = [
    {
      cat: "Account & Security",
      items: [
        { icon: Lock, label: "Change Password" },
        { icon: Key, label: "Toggle Password View" },
        { icon: LinkIcon, label: "Generate Login Link" },
        { icon: Camera, label: "Update Photo" },
        { icon: List, label: "Custom Attributes" },
        { icon: File, label: "View Documents" },
      ],
    },
    {
      cat: "Billing & Subscriptions",
      items: [
        { icon: FileText, label: "Generate New Invoice" },
        { icon: Clock, label: "Add Grace Period" },
      ],
    },
  ];

  const networkFabActions = [
    { icon: ShieldAlert, label: "Disable Network", variant: "danger" },
    { icon: XCircle, label: "Disable Profile", variant: "danger" },
    { icon: PowerOff, label: "Disconnect Session", variant: "danger" },
    { icon: Server, label: "Box / POP Info", variant: "default" },
    { icon: Settings, label: "Service Settings", variant: "default" },
    { icon: LineChart, label: "Live Optical Graph", variant: "default" },
    { icon: RefreshCw, label: "Migrate Node", variant: "default" },
    { icon: Zap, label: "Activate Connection", variant: "primary" },
  ];

  return (
    <>
      {/* Main Header Card */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-card border border-border rounded-xl shadow-xs p-6 mb-6 relative z-30">
        {/* Profile Info Left */}
        <div className="flex items-center gap-5">
          <div
            className="w-20 h-20 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center relative group cursor-pointer shrink-0 shadow-xs"
            onClick={handlePhotoClick}
          >
            <span className="text-3xl font-black text-primary font-heading">
              {subscriber.fullName.charAt(0)}
            </span>
            <div className="absolute inset-0 bg-background/80 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-primary" />
            </div>
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-success ring-2 ring-card" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h1 className="text-2xl font-heading font-extrabold text-foreground tracking-tight">
                {subscriber.fullName}
                <span className="text-muted-foreground font-mono font-normal text-base ml-2">
                  ({subscriber.pppoeUsername})
                </span>
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                Subscriber • {subscriber.customerCode}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-success/10 text-success border border-success/20">
                ONLINE
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-success/10 text-success border border-success/20">
                ACTIVE PROFILE
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-muted text-muted-foreground border border-border">
                {subscriber.packageName}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Area */}
        <div className="flex flex-wrap items-center gap-3 mt-4 lg:mt-0 relative z-10">
          {/* Sync & Note Controls */}
          <div className="flex items-center bg-muted/50 border border-border p-1 rounded-lg">
            <Tooltip content="Sync Profile" position="top">
              <button
                type="button"
                onClick={handleSync}
                disabled={isSyncing}
                className="p-2 text-muted-foreground hover:text-primary hover:bg-card rounded-md transition-colors cursor-pointer"
              >
                <RefreshCw size={16} className={isSyncing ? "animate-spin text-primary" : ""} />
              </button>
            </Tooltip>
            <div className="w-[1px] h-5 bg-border mx-1" />
            <Tooltip content="Add Quick Note" position="top">
              <button
                type="button"
                onClick={handleAddNote}
                className="p-2 text-muted-foreground hover:text-primary hover:bg-card rounded-md transition-colors cursor-pointer"
              >
                <StickyNote size={16} />
              </button>
            </Tooltip>
          </div>

          {/* Edit Profile & Balance Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onAction("Edit Profile")}
              className="px-3.5 py-2 bg-card border border-border text-foreground hover:bg-muted font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <User size={15} className="text-primary" /> Edit Profile
            </button>
            <button
              type="button"
              onClick={() => onAction("Add Payment")}
              className="px-3.5 py-2 bg-success text-success-foreground hover:bg-success/90 font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={15} /> Balance
            </button>

            {/* Split Menu */}
            <div className="relative" ref={splitRef}>
              <button
                type="button"
                onClick={() => setIsActionsOpen(!isActionsOpen)}
                className="p-2 bg-muted/50 hover:bg-muted border border-border text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
              >
                <MoreVertical size={16} />
              </button>

              {isActionsOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95">
                  {accountBillingActions.map((group) => (
                    <div key={group.cat}>
                      <div className="px-3.5 py-1.5 text-[10px] font-mono uppercase font-bold text-muted-foreground border-b border-border/60 mb-1">
                        {group.cat}
                      </div>
                      {group.items.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            onAction(item.label);
                            setIsActionsOpen(false);
                          }}
                          className="w-full text-left px-3.5 py-1.5 hover:bg-muted flex items-center gap-2 font-medium text-foreground transition-colors cursor-pointer"
                        >
                          <item.icon size={14} className="text-muted-foreground" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SPEED DIAL (FAB) for Network & Connection Actions */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2" ref={fabRef}>
        <AnimatePresence>
          {isFabOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                hidden: { transition: { staggerChildren: 0.03, staggerDirection: 1 } },
              }}
              className="flex flex-col items-end gap-1.5 mb-2"
            >
              {networkFabActions.map((item) => (
                <motion.button
                  key={item.label}
                  variants={{
                    hidden: { opacity: 0, y: 10, scale: 0.8 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  onClick={() => {
                    onAction(item.label);
                    setIsFabOpen(false);
                  }}
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <span className="px-2.5 py-1 bg-card border border-border text-foreground text-xs font-bold rounded-md shadow-md opacity-90 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                      item.variant === "danger"
                        ? "bg-destructive text-destructive-foreground"
                        : item.variant === "primary"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground"
                    }`}
                  >
                    <item.icon size={16} />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setIsFabOpen(!isFabOpen)}
          className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-2xl hover:bg-primary/90 transition-all cursor-pointer"
        >
          <motion.div
            animate={{ rotate: isFabOpen ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {isFabOpen ? <X size={24} /> : <Settings size={24} />}
          </motion.div>
        </button>
      </div>
    </>
  );
}
