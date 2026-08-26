"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Mic,
  Smile,
  Image as ImageIcon,
  CheckCheck,
  Check,
  Phone,
  Video,
  Search,
  MoreVertical,
  ExternalLink,
  ShieldCheck,
  Zap,
  Play,
  Pause,
  FileText,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useChatStore } from "@/stores/useChatStore";

export default function CustomerLiveChatPage() {
  const toast = useToast();
  const { messages, addMessage, activeConversationId } = useChatStore();
  const [inputText, setInputText] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationId = activeConversationId || "conv-01";
  const chatMessages = messages[conversationId] || [];

  // Filter out internal private staff notes from customer view
  const visibleMessages = chatMessages.filter((m) => !m.isPrivateNote);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [visibleMessages.length, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 1. Add customer message
    addMessage(conversationId, {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: "cus-99482",
      senderName: "Ahmed Malik",
      senderRole: "customer",
      content: inputText.trim(),
      type: "text",
      status: "sent",
      createdAt: new Date().toISOString(),
    });

    setInputText("");
    setIsTyping(true);

    // 2. Simulate CSR typing and response
    setTimeout(() => {
      setIsTyping(false);
      addMessage(conversationId, {
        id: `msg-${Date.now() + 1}`,
        conversationId,
        senderId: "usr-csr-01",
        senderName: "Fatima Noor (CSR #03)",
        senderRole: "agent",
        content: "Thank you Ahmed! Splicer Usman Ali (Van #04) has reached your street and is calibrating GPON Splitter #4 now.",
        type: "text",
        status: "delivered",
        createdAt: new Date().toISOString(),
      });
      toast.info("New Message", "Fatima Noor replied to your message.");
    }, 2200);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[580px] max-w-5xl mx-auto rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
      {/* 1. WhatsApp-Style Header Bar */}
      <header className="flex h-16 items-center justify-between border-b border-border bg-card-subtle px-4 py-2 select-none shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar name="Fatima Noor" size="md" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card-subtle" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-sm text-foreground">
                Prime Support Helpdesk
              </span>
              <ShieldCheck className="h-3.5 w-3.5 text-success fill-success/20" />
            </div>
            <span className="font-mono text-[11px] text-muted-foreground block">
              {isTyping ? (
                <span className="text-primary font-bold animate-pulse">typing...</span>
              ) : (
                "Fatima Noor (CSR #03) • Online"
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open("tel:11177463")}
            className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground rounded-full cursor-pointer"
            title="Call Support"
          >
            <Phone className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast.info("Video Call", "Starting secure optical video inspection session...")}
            className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground rounded-full cursor-pointer"
            title="Video Inspection"
          >
            <Video className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(
                "https://wa.me/923001234567?text=Hello%20Prime%20Networks%20Support%20(Account:%20CUS-99482)",
                "_blank"
              )
            }
            className="h-8 px-2.5 text-xs gap-1.5 text-success border-success/30 hover:bg-success/10 font-bold ml-1"
          >
            <span>WhatsApp</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </header>

      {/* 2. WhatsApp Message Conversation Canvas */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-3 bg-card/40 backdrop-blur-xs flex flex-col justify-between">
        <div className="space-y-3">
          {/* Encryption Notice */}
          <div className="mx-auto flex items-center justify-center gap-1.5 max-w-sm rounded-lg bg-card-subtle/80 border border-border/60 py-1.5 px-3 text-center text-[10px] font-mono text-muted-foreground shadow-2xs">
            <Lock className="h-3 w-3 text-warning" />
            <span>Messages are end-to-end encrypted with Prime One NOC.</span>
          </div>

          {/* Date Separator Pill */}
          <div className="flex justify-center my-2">
            <span className="rounded-full bg-card-subtle border border-border px-3 py-0.5 text-[10px] font-mono font-bold uppercase text-muted-foreground shadow-2xs">
              TODAY
            </span>
          </div>

          {/* Message Stream */}
          {visibleMessages.map((msg) => {
            const isCustomer = msg.senderRole === "customer";
            const isSystem = msg.senderRole === "system";

            if (isSystem) {
              return (
                <div
                  key={msg.id}
                  className="mx-auto max-w-md rounded-xl bg-warning/10 border border-warning/30 p-3 text-xs font-mono text-warning text-center space-y-1 my-2 shadow-2xs"
                >
                  <div className="flex items-center justify-center gap-1.5 font-bold">
                    <Zap className="h-3.5 w-3.5" />
                    <span>Automated Diagnostic Alert</span>
                  </div>
                  <p className="text-[11px]">{msg.content}</p>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isCustomer ? "items-end" : "items-start"}`}
              >
                {!isCustomer && (
                  <span className="text-[10px] font-mono text-muted-foreground mb-1 pl-2 font-bold">
                    {msg.senderName}
                  </span>
                )}

                <div
                  className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                    isCustomer
                      ? "bg-primary text-primary-foreground rounded-tr-xs"
                      : "bg-card-subtle border border-border text-foreground rounded-tl-xs"
                  }`}
                >
                  <p>{msg.content}</p>

                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[10px] font-mono select-none ${
                      isCustomer ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    <span suppressHydrationWarning>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isCustomer && (
                      <CheckCheck className="h-3.5 w-3.5 text-info font-extrabold" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Simulated Voice Message Waveform */}
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-mono text-muted-foreground mb-1 pl-2 font-bold">
              Fatima Noor (Voice Note)
            </span>
            <div className="rounded-2xl bg-card-subtle border border-border p-3 flex items-center gap-3 w-64 shadow-xs">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="h-8 w-8 p-0 rounded-full shrink-0"
              >
                {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </Button>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-0.5 h-4">
                  {[40, 70, 30, 90, 60, 80, 40, 100, 50, 80, 60, 30, 70, 50].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full ${
                        isPlayingAudio && i < 7 ? "bg-primary" : "bg-muted-foreground/40"
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                  <span>{isPlayingAudio ? "0:12" : "0:24"}</span>
                  <span>Audio Splicing Update</span>
                </div>
              </div>
            </div>
          </div>

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-1.5 rounded-full bg-card-subtle border border-border px-3 py-1.5 w-fit text-xs text-muted-foreground shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
              <span className="text-[10px] font-mono ml-1">Fatima is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 3. Quick Canned Suggestion Chips */}
      <div className="px-4 py-2 border-t border-border bg-card-subtle flex items-center gap-2 overflow-x-auto text-xs shrink-0 select-none">
        <span className="text-[10px] font-mono uppercase text-muted-foreground shrink-0 font-bold">
          Quick Inquiries:
        </span>
        <button
          type="button"
          onClick={() => handleQuickPrompt("My router optical LOS light is blinking red.")}
          className="rounded-full border border-border bg-card px-3 py-1 text-[11px] text-foreground hover:border-primary hover:text-primary transition-colors shrink-0 cursor-pointer shadow-2xs"
        >
          🔴 Red Optical Light Blinking
        </button>
        <button
          type="button"
          onClick={() => handleQuickPrompt("I uploaded my JazzCash bill payment receipt.")}
          className="rounded-full border border-border bg-card px-3 py-1 text-[11px] text-foreground hover:border-primary hover:text-primary transition-colors shrink-0 cursor-pointer shadow-2xs"
        >
          💳 Bill Payment Verification
        </button>
        <button
          type="button"
          onClick={() => handleQuickPrompt("What is the current location of Splicer Van #04?")}
          className="rounded-full border border-border bg-card px-3 py-1 text-[11px] text-foreground hover:border-primary hover:text-primary transition-colors shrink-0 cursor-pointer shadow-2xs"
        >
          🚚 Splicer Van ETA
        </button>
      </div>

      {/* 4. WhatsApp-Style Input Toolbar */}
      <footer className="p-3 border-t border-border bg-card flex items-center gap-2 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => toast.info("Emojis", "Emoji palette active.")}
          className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground rounded-full shrink-0"
        >
          <Smile className="h-5 w-5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => toast.info("Attachment", "Select photos of router optical lights or bank receipts.")}
          className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground rounded-full shrink-0"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="text-xs h-10 rounded-xl bg-card-subtle border-border focus-visible:ring-primary"
          />

          {inputText.trim() ? (
            <Button
              type="submit"
              size="sm"
              className="h-10 px-4 rounded-xl gap-1.5 shadow-xs font-bold shrink-0"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => toast.info("Voice Note", "Hold to record audio voice message...")}
              className="h-10 w-10 p-0 text-primary hover:bg-primary/10 rounded-full shrink-0"
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </form>
      </footer>
    </div>
  );
}
