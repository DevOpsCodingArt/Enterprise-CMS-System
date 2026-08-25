'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Send, Smartphone, ShieldCheck, ArrowLeft, RefreshCw, CheckCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 font-body">
      {/* Top Banner Link */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 font-mono text-xs">
        <Link
          href="/app/desk"
          className="flex items-center gap-1.5 text-primary font-bold hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO PRIME DESK</span>
        </Link>
        <Badge variant="info" size="xs">
          MOBILE WEB SIMULATOR
        </Badge>
      </div>

      {/* Simulated Mobile Device Frame */}
      <div className="w-full max-w-md bg-card border-4 border-border shadow-2xl flex flex-col h-[650px] overflow-hidden">
        {/* Mobile Header */}
        <div className="p-3.5 bg-primary text-primary-foreground border-b-2 border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 bg-card border border-border p-1">
              <Image src="/prime-logo.png" alt="Prime Logo" fill className="object-contain" />
            </div>
            <div>
              <div className="font-heading font-black text-sm leading-tight">PRIME SUPPORT</div>
              <div className="text-[10px] font-mono opacity-90">Eng. Moiz (NOC Lead) · Online</div>
            </div>
          </div>

          <Badge variant="default" size="xs">
            50M ULTRA
          </Badge>
        </div>

        {/* Diagnostic Pill */}
        <div className="p-2 bg-card-subtle border-b border-border text-[10px] font-mono flex items-center justify-between">
          <span>SUBSCRIBER: <strong className="text-foreground">ali_f10</strong></span>
          <span className="text-primary font-bold">SIGNAL: -19.2 dBm ✓</span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
          {messages.map((m) => {
            const isCust = m.sender === 'customer';
            return (
              <div
                key={m.id}
                className={`p-3 max-w-[85%] border-2 ${
                  isCust
                    ? 'bg-primary text-primary-foreground border-border ml-auto text-left shadow-sm'
                    : 'bg-card text-foreground border-border mr-auto text-left shadow-sm'
                }`}
              >
                {!isCust && (
                  <div className="font-heading font-bold text-[10px] text-primary mb-1 uppercase">
                    {m.name}
                  </div>
                )}
                <div>{m.text}</div>
                <div className="text-[9px] text-right mt-1 opacity-80 flex items-center justify-end gap-1">
                  <span>{m.time}</span>
                  {isCust && <CheckCheck className="w-3 h-3" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t-2 border-border bg-card flex gap-2">
          <input
            type="text"
            placeholder="Type your message to support..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-card-subtle border-2 border-border px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
          />
          <Button variant="primary" size="sm" onClick={handleSend}>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
