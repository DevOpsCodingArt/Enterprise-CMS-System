"use client";

import React, { useState } from "react";
import {
  Send,
  Radio,
  Users,
  Search,
  Plus,
  ArrowUpRight,
  ExternalLink,
  Shield,
  Activity,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Sparkles,
  Wifi,
  Filter,
  CheckCheck,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { PermissionGuard } from "@/components/guards/PermissionGuard";

export function PrimeDeskWorkspace() {
  const toast = useToast();
  const { user } = useAuthStore();
  const {
    conversations,
    activeConversationId,
    messages,
    addMessage,
    setActiveConversationId,
  } = useChatStore();

  const [inputText, setInputText] = useState("");
  const [isPrivateNoteMode, setIsPrivateNoteMode] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);

  const activeMessages = activeConversationId
    ? messages[activeConversationId] || []
    : [];
  const activeConv = conversations.find((c) => c.id === activeConversationId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    addMessage(activeConversationId, {
      id: `msg-${Date.now()}`,
      conversationId: activeConversationId,
      senderId: user?.id || "usr-01",
      senderName: user?.name || "Agent",
      senderRole: "agent",
      content: inputText.trim(),
      type: "text",
      isPrivateNote: isPrivateNoteMode,
      status: "sent",
      createdAt: new Date().toISOString(),
    });

    setInputText("");
    setIsPrivateNoteMode(false);
    toast.success(
      isPrivateNoteMode ? "Private Note Logged" : "Message Dispatched",
      isPrivateNoteMode
        ? "Note saved to ticket timeline."
        : "Delivered to subscriber channel."
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
            Prime Desk — 3-Column Live Chat Workspace
          </h2>
          <p className="text-xs text-muted-foreground">
            Omni-channel helpdesk queue, live WhatsApp timeline, and real-time optical power diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" hasPulse className="font-mono text-[10px]">
            RADAR SYNC ACTIVE
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 1. Left Column: Conversation Queue (Width: 320px–360px) */}
        <Card className="lg:col-span-4 flex flex-col h-[640px] shadow-xs">
          <CardHeader className="p-3.5 pb-2.5 border-b border-border bg-card-subtle/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs uppercase tracking-wider font-mono text-muted-foreground">
                Inquiries Queue
              </CardTitle>
              <Badge variant="secondary" className="font-mono text-[10px]">
                {conversations.length} Active
              </Badge>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Filter by name, phone, PPPoE..."
                className="h-8 w-full rounded-md border border-input bg-card pl-8 pr-2.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </CardHeader>

          <CardContent className="p-2 overflow-y-auto flex-1 divide-y divide-border-subtle">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  conv.id === activeConversationId
                    ? "bg-primary/10 border-l-4 border-primary"
                    : "hover:bg-card-subtle"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar name={conv.customerName} size="sm" presence="online" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground leading-tight truncate">
                        {conv.customerName}
                      </p>
                      <span className="font-mono text-[10px] text-muted-foreground truncate block">
                        {conv.pppoeUsername}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <span
                      className="font-mono text-[10px] text-muted-foreground"
                      suppressHydrationWarning
                    >
                      {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {conv.opticalRxDbm && conv.opticalRxDbm < -24 ? (
                      <Badge variant="destructive" className="text-[9px] py-0 px-1 font-mono">
                        {conv.opticalRxDbm} dBm
                      </Badge>
                    ) : (
                      <Badge variant="success" className="text-[9px] py-0 px-1 font-mono">
                        OPTIMAL
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-2 line-clamp-1 leading-relaxed">
                  {conv.lastMessage}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 2. Middle Column: Active Live Chat Timeline */}
        <Card className="lg:col-span-5 flex flex-col h-[640px] shadow-xs">
          <CardHeader className="p-3.5 py-3 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar
                name={activeConv?.customerName || "Customer"}
                size="md"
                presence="online"
              />
              <div className="min-w-0">
                <CardTitle className="text-sm truncate">
                  {activeConv?.customerName}
                </CardTitle>
                <span className="font-mono text-[11px] text-muted-foreground block truncate">
                  {activeConv?.branchName} • WhatsApp Business
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <PermissionGuard permission="chat.transfer">
                <Tooltip content="Transfer chat with mandatory reason">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsTransferDialogOpen(true)}
                    className="h-8 text-xs"
                  >
                    Transfer
                  </Button>
                </Tooltip>
              </PermissionGuard>
              <PermissionGuard permission="chat.close">
                <Tooltip content="Close conversation with outcome note">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsCloseDialogOpen(true)}
                    className="h-8 text-xs"
                  >
                    Close
                  </Button>
                </Tooltip>
              </PermissionGuard>
            </div>
          </CardHeader>

          <CardContent className="p-4 overflow-y-auto flex-1 space-y-3 bg-card-subtle/40">
            {activeMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.senderRole === "agent"
                    ? "items-end"
                    : msg.senderRole === "system"
                    ? "items-center"
                    : "items-start"
                }`}
              >
                {msg.senderRole === "system" ? (
                  <div className="w-full bg-warning/10 border border-warning/30 rounded-lg p-2.5 text-center text-xs font-mono text-warning">
                    {msg.content}
                  </div>
                ) : msg.isPrivateNote ? (
                  <PermissionGuard permission="chat.view_internal_notes">
                    <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 text-xs font-mono text-amber-500 flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 shrink-0" />
                      <span>{msg.content}</span>
                    </div>
                  </PermissionGuard>
                ) : (
                  <div
                    className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed shadow-xs ${
                      msg.senderRole === "agent"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1 opacity-70">
                      <span className="text-[10px] font-mono" suppressHydrationWarning>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {msg.senderRole === "agent" && <CheckCheck className="h-3 w-3" />}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>

          <CardFooter className="p-3 border-t border-border bg-card flex flex-col gap-2">
            <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isPrivateNoteMode
                    ? "Type private internal note (invisible to customer)..."
                    : "Type a message or press '/' for canned replies..."
                }
                className="text-xs"
              />
              <Button type="submit" size="sm" className="gap-1.5 shrink-0">
                <Send className="h-3.5 w-3.5" />
                <span>Send</span>
              </Button>
            </form>

            <div className="flex items-center justify-between w-full text-[11px]">
              <PermissionGuard permission="chat.add_internal_note">
                <button
                  type="button"
                  onClick={() => setIsPrivateNoteMode(!isPrivateNoteMode)}
                  className={`font-mono flex items-center gap-1 cursor-pointer transition-colors ${
                    isPrivateNoteMode ? "text-amber-500 font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Lock className="h-3 w-3" />
                  <span>{isPrivateNoteMode ? "Private Note Mode Active" : "Add Private Staff Note"}</span>
                </button>
              </PermissionGuard>
              <span className="text-muted-foreground font-mono">Press &apos;/&apos; for Quick Replies</span>
            </div>
          </CardFooter>
        </Card>

        {/* 3. Right Column: Customer 360° Live Diagnostics Panel */}
        <Card className="lg:col-span-3 flex flex-col h-[640px] shadow-xs">
          <CardHeader className="p-3.5 pb-2 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs uppercase tracking-wider font-mono text-muted-foreground">
              Customer 360° Telemetry
            </CardTitle>
            <Badge variant="outline" className="text-[9px] font-mono">
              LIVE ONU
            </Badge>
          </CardHeader>

          <CardContent className="p-4 space-y-4 text-xs overflow-y-auto flex-1">
            <div className="space-y-1">
              <span className="text-muted-foreground font-mono text-[11px]">
                Active Subscriber Plan
              </span>
              <p className="font-bold text-foreground text-sm">
                Fiber Pro (50 Mbps Unlimited)
              </p>
            </div>

            {/* Optical Power Diagnostics */}
            <div className="space-y-1.5 rounded-lg border border-border bg-card-subtle p-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-mono text-[11px]">
                  Optical Rx Power
                </span>
                <Badge variant="destructive" className="font-mono text-[10px]">
                  -27.4 dBm
                </Badge>
              </div>

              {/* Optical Power Gauge Bar */}
              <div className="w-full bg-card rounded-full h-2 overflow-hidden border border-border">
                <div className="bg-destructive h-full w-[88%]" />
              </div>
              <span className="text-[10px] text-destructive font-mono block">
                GPON 0/2/4 (Splitter #4 Attenuation)
              </span>
            </div>

            {/* PPPoE Session Details */}
            <div className="space-y-1.5 rounded-lg border border-border bg-card-subtle p-3">
              <span className="text-muted-foreground font-mono text-[11px]">
                MikroTik Radius Session
              </span>
              <p className="font-mono text-foreground font-medium text-[11px]">
                IP: 103.14.22.84
              </p>
              <p className="font-mono text-muted-foreground text-[11px]">
                Uptime: 4 days 12 hours
              </p>
            </div>

            {/* Branch Hub Assignment */}
            <div className="space-y-1">
              <span className="text-muted-foreground font-mono text-[11px]">
                Assigned Branch Office
              </span>
              <p className="font-medium text-foreground">
                Islamabad Blue Area (HQ)
              </p>
            </div>

            {/* Quick Operations Actions */}
            <div className="pt-2 border-t border-border space-y-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs shadow-xs"
                onClick={() =>
                  toast.success("Dispatched Splicer", "Ticket #TK-8842 routed to Splicer Usman Ali (Van #04).")
                }
              >
                🚀 Dispatch Splicer Van
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() =>
                  toast.info("ONU Reboot Signal", "SmartOLT power-cycle command sent.")
                }
              >
                🔄 Remote Reboot ONU
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transfer Dialog Modal */}
      <Dialog isOpen={isTransferDialogOpen} onClose={() => setIsTransferDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>Transfer Active Chat Session</DialogTitle>
        </DialogHeader>
        <DialogContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Please select the target department and state a mandatory reason before transferring the session.
          </p>
          <Textarea
            label="Mandatory Transfer Reason"
            placeholder="e.g. Requires physical optical splicing on Street 4..."
          />
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setIsTransferDialogOpen(false);
              toast.success("Chat Transferred", "Session transferred to Field Operations.");
            }}
          >
            Confirm Transfer
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Close Chat Dialog Modal */}
      <Dialog isOpen={isCloseDialogOpen} onClose={() => setIsCloseDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>Close Conversation</DialogTitle>
        </DialogHeader>
        <DialogContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Please log the resolution outcome before closing this subscriber inquiry.
          </p>
          <Textarea
            label="Resolution Summary"
            placeholder="e.g. Optical attenuation calibrated to -18.2 dBm nominal. Customer confirmed working."
          />
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCloseDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setIsCloseDialogOpen(false);
              toast.success("Chat Closed", "Outcome code: Resolved remotely.");
            }}
          >
            Close & Resolve
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
