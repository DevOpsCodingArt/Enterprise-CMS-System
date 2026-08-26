"use client";

import React, { useState } from "react";
import { Send, MessageSquare, Plus, Ticket, HelpCircle, CheckCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";

export function LiveSupportWidget() {
  const toast = useToast();
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "system",
      text: "👋 Welcome to Prime Networks Customer Support! An agent from Islamabad HQ is connected.",
      time: "12:50 PM",
    },
    {
      id: "2",
      sender: "user",
      text: "Hello, my optical light is blinking red and the connection dropped.",
      time: "12:52 PM",
    },
    {
      id: "3",
      sender: "agent",
      agentName: "Fatima Noor (NOC Support)",
      text: "Hello Ahmed, I checked your optical telemetry from our OLT port. Your optical power is -27.4 dBm which indicates a fiber bend or attenuation on Street 4. I have lodged Priority Ticket #TK-8842 and routed Field Van #04 to your location.",
      time: "12:55 PM",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: String(Date.now()),
      sender: "user",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    toast.success("Message Sent", "Delivered to Prime Desk CSR queue.");
  };

  return (
    <Card className="bg-card border-border shadow-xs flex flex-col h-[480px]">
      <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar name="Fatima Noor" size="md" presence="online" />
          <div>
            <CardTitle className="text-sm font-heading font-bold">
              Prime Desk Live Support
            </CardTitle>
            <span className="font-mono text-[11px] text-muted-foreground block">
              Islamabad HQ Desk • CSR Lead Online
            </span>
          </div>
        </div>

        <Badge variant="success" hasPulse className="font-mono text-[10px]">
          CSR CONNECTED
        </Badge>
      </CardHeader>

      <CardContent className="p-4 overflow-y-auto flex-1 space-y-3 bg-card-subtle/30">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.sender === "user"
                ? "items-end"
                : m.sender === "system"
                ? "items-center"
                : "items-start"
            }`}
          >
            {m.sender === "system" ? (
              <div className="w-full bg-primary/10 border border-primary/20 rounded-lg p-2 text-center text-xs text-primary font-mono">
                {m.text}
              </div>
            ) : (
              <div
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed shadow-xs ${
                  m.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground"
                }`}
              >
                {m.sender === "agent" && (
                  <span className="font-bold text-[11px] text-primary block mb-1">
                    {m.agentName}
                  </span>
                )}
                <p>{m.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1 opacity-70">
                  <span className="text-[10px] font-mono" suppressHydrationWarning>
                    {m.time}
                  </span>
                  {m.sender === "user" && <CheckCheck className="h-3 w-3" />}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>

      <CardFooter className="p-3 border-t border-border bg-card">
        <form onSubmit={handleSend} className="flex w-full items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message to support..."
            className="text-xs"
          />
          <Button type="submit" size="sm" className="gap-1.5 shrink-0">
            <Send className="h-3.5 w-3.5" />
            <span>Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
