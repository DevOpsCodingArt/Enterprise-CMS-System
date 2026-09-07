"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  MessageSquarePlus,
  Send,
  X,
  AlertCircle,
  RefreshCw,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { telecomService } from "@/services/telecom.service";
import type { SubscriberRecord, StaffUserRecord } from "@/types/telecom-entities.types";
import { cn } from "@/lib/utils";

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConversationCreated: (conversation: any) => void;
}

export function NewConversationModal({
  isOpen,
  onClose,
  onConversationCreated,
}: NewConversationModalProps) {
  const toast = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [knownSubscribers, setKnownSubscribers] = useState<SubscriberRecord[]>([]);
  const [knownStaff, setKnownStaff] = useState<StaffUserRecord[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load existing subscribers and company staff/admins for instant directory lookup
  useEffect(() => {
    if (!isOpen) return;

    Promise.all([
      telecomService.subscribers.list({ limit: 100 }).catch(() => []),
      telecomService.workforce.getStaff().catch(() => []),
    ]).then(([subs, staff]) => {
      setKnownSubscribers(subs || []);
      setKnownStaff(staff || []);
    });
  }, [isOpen]);

  // Focus input automatically when opened and reset state
  useEffect(() => {
    if (isOpen) {
      setPhoneNumber("");
      setIsError(false);
      setErrorText(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Extract core numbers for preview matching
  const cleanDigits = phoneNumber.replace(/\D/g, "");
  const coreInput = cleanDigits.startsWith("92")
    ? cleanDigits.slice(2)
    : cleanDigits.startsWith("0")
    ? cleanDigits.slice(1)
    : cleanDigits;

  const matchedSubscriber =
    coreInput.length >= 4
      ? knownSubscribers.find((s) => {
          const sDigits = (s.phone || "").replace(/\D/g, "");
          return sDigits.includes(coreInput);
        })
      : null;

  const matchedStaff =
    !matchedSubscriber && coreInput.length >= 4
      ? knownStaff.find((s) => {
          const sDigits = (s.phone || "").replace(/\D/g, "");
          return sDigits.includes(coreInput);
        })
      : null;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.trim();

    if (!cleanPhone) {
      setIsError(true);
      setErrorText("Please enter a mobile phone number.");
      toast.error("Input Required", "Please enter a mobile phone number.");
      inputRef.current?.focus();
      return;
    }

    if (cleanPhone.replace(/\D/g, "").length < 7) {
      setIsError(true);
      setErrorText("Please enter a valid mobile number with at least 7 digits.");
      toast.error("Invalid Number", "Please enter a valid mobile number with at least 7 digits.");
      inputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setIsError(false);
    setErrorText(null);

    try {
      const conv = await telecomService.chat.createConversation({
        phone: cleanPhone,
        customerId: matchedSubscriber?.id,
        subject: "Direct Chat",
      });

      if (conv?.error || conv?.notFound) {
        const msg =
          conv.error ||
          `No registered subscriber, staff member, or admin found with mobile number: ${cleanPhone}`;
        setIsError(true);
        setErrorText(msg);
        toast.error("User Not Found", `No registered subscriber or company staff found with number: ${cleanPhone}`);
        inputRef.current?.select();
        inputRef.current?.focus();
        return;
      }

      if (conv?.id) {
        onConversationCreated(conv);
        onClose();
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        `No registered subscriber, staff member, or admin found for ${cleanPhone}.`;

      setIsError(true);
      setErrorText(msg);
      toast.error("User Not Found", `No registered subscriber or company staff found with number: ${cleanPhone}`);
      inputRef.current?.select();
      inputRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-elevated overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-chat-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-2xs">
              <MessageSquarePlus className="h-5 w-5" />
            </div>
            <div>
              <h2 id="new-chat-title" className="font-heading font-extrabold text-sm text-foreground">
                Start New Chat
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Search subscriber, staff member, or admin by phone
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card-subtle transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="phone-number-input"
              className={cn(
                "text-xs font-heading font-bold flex items-center justify-between transition-colors",
                isError ? "text-destructive" : "text-foreground"
              )}
            >
              <span>Mobile Phone Number</span>
              <span className="text-[10.5px] font-normal text-muted-foreground">
                e.g. 0300 1234567 or 0300 5550001
              </span>
            </label>

            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-colors">
                <Phone className={cn("h-4 w-4", isError ? "text-destructive" : "text-primary")} />
              </div>

              <input
                id="phone-number-input"
                ref={inputRef}
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (isError) {
                    setIsError(false);
                    setErrorText(null);
                  }
                }}
                placeholder="0300 1234567 or +92 300 5550001"
                disabled={isSubmitting}
                autoComplete="off"
                className={cn(
                  "w-full pl-10 pr-4 py-2.5 text-sm rounded-xl placeholder:text-muted-foreground shadow-2xs transition-all font-mono border focus:outline-none",
                  isError
                    ? "bg-destructive/10 border-destructive text-destructive placeholder:text-destructive/50 ring-2 ring-destructive/30 focus:ring-destructive focus:border-destructive"
                    : "bg-card border-border text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                )}
              />
            </div>

            {/* Red error alert under the input */}
            {isError && (
              <div className="flex items-center gap-2 text-xs text-destructive font-medium pt-1 animate-in fade-in-50 duration-150">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errorText || `No registered subscriber or staff member found with number ${phoneNumber.trim()}`}</span>
              </div>
            )}
          </div>

          {/* Contact Matching Banner / Live Preview: Subscriber */}
          {matchedSubscriber && (
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/25 text-xs flex items-center justify-between gap-2 animate-in fade-in-50 duration-150">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-heading font-bold text-xs shrink-0">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-heading font-bold text-foreground truncate">
                    {matchedSubscriber.fullName}
                  </div>
                  <div className="text-[10.5px] font-mono text-muted-foreground">
                    {matchedSubscriber.customerCode} • {matchedSubscriber.packageName || "Broadband"}
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-[9.5px] font-mono shrink-0">
                Subscriber
              </Badge>
            </div>
          )}

          {/* Contact Matching Banner / Live Preview: Staff Member or Admin */}
          {matchedStaff && (
            <div className="p-3 rounded-xl bg-accent/20 border border-accent/40 text-xs flex items-center justify-between gap-2 animate-in fade-in-50 duration-150">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-accent/30 text-accent-foreground flex items-center justify-center font-heading font-bold text-xs shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-heading font-bold text-foreground truncate">
                    {matchedStaff.name}
                  </div>
                  <div className="text-[10.5px] font-mono text-muted-foreground">
                    {matchedStaff.designation} • {matchedStaff.department}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="text-[9.5px] font-mono shrink-0 border-accent/60 bg-accent/10">
                Company Staff
              </Badge>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl px-4 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={isError ? "destructive" : "primary"}
              size="sm"
              disabled={isSubmitting || !phoneNumber.trim()}
              className="rounded-xl px-5 text-xs font-bold cursor-pointer shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  <span>Chat</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
