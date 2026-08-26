'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Send, Smartphone, ShieldCheck, ArrowLeft, RefreshCw, CheckCheck, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default function CustomerChatSimulatorPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'customer',
      text: 'Salam, router LOS red light is blinking since 15 minutes. Internet link is disconnected.',
      time: '10:40 AM',
    },
    {
      id: 2,
      sender: 'agent',
      name: 'NOC Lead (Moiz)',
      text: 'Walaikum Assalam Ali, optical fault confirmed on PON Port 4. Ticket #8491 generated and Field Engineer Imran (Van 04) dispatched with OTDR splicing meter.',
      time: '10:41 AM',
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'customer',
      text: input.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Simulate Agent Automated Reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'agent',
          name: 'NOC Lead (Moiz)',
          text: 'Field technician is currently 3 minutes away from your location in Sector F-10/2.',
          time: 'Just now',
        },
      ]);
    }, 1200);
  };

  return (
    <div className="h-screen max-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      {/* Top Banner Link */}
      <div className="w-full max-w-md flex items-center justify-between mb-3 text-xs">
        <Link
          href="/desk"
          className="flex items-center gap-1.5 text-primary hover:underline font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Prime Desk
        </Link>
        <span className="text-[11px] text-muted-foreground">
          Subscriber Simulator Mode
        </span>
      </div>

      {/* Simulated Mobile Device Frame */}
      <div className="w-full max-w-md h-[580px] sm:h-[620px] bg-card rounded-2xl border border-border shadow-xl flex flex-col overflow-hidden">
        {/* Mobile App Header */}
        <div className="p-3.5 bg-primary text-white flex items-center justify-between flex-shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
              P
            </div>
            <div>
              <div className="font-heading font-semibold text-sm leading-tight">
                Prime Networks Support
              </div>
              <div className="text-[10px] text-white/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online · Helpdesk & NOC Active
              </div>
            </div>
          </div>
          <Badge variant="outline" size="xs">
            <span className="text-white font-mono text-[10px]">50M Fiber</span>
          </Badge>
        </div>

        {/* Optical Telemetry Banner */}
        <div className="p-2.5 bg-muted/40 border-b border-border text-xs flex items-center justify-between flex-shrink-0">
          <div>
            <div className="text-[10px] text-muted-foreground">Broadband Status:</div>
            <div className="font-medium text-foreground">Ali Hassan (ali_f10)</div>
          </div>
          <Badge variant="primary" size="xs">
            <span className="font-mono text-[10px]">-19.24 dBm (Normal)</span>
          </Badge>
        </div>

        {/* Message Thread Stream */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-muted/10 custom-scrollbar">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'customer' ? 'items-end' : 'items-start'}`}
            >
              {m.name && (
                <span className="text-[10px] font-medium text-muted-foreground mb-0.5">
                  {m.name}
                </span>
              )}
              <div
                className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                  m.sender === 'customer'
                    ? 'bg-primary text-white rounded-br-none shadow-xs'
                    : 'bg-card border border-border text-foreground rounded-bl-none shadow-2xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-muted-foreground mt-0.5 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Mobile Input Field */}
        <div className="p-3 border-t border-border bg-card flex items-center gap-2 flex-shrink-0">
          <input
            type="text"
            placeholder="Type your message to helpdesk..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 bg-muted/40 rounded-lg border border-border px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button variant="primary" size="sm" onClick={handleSend} rightIcon={<Send className="w-3.5 h-3.5" />}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
