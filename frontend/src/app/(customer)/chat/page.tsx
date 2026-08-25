'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  CheckCheck,
  Check,
  Bot,
  User,
  ShieldCheck,
  Star,
  LifeBuoy,
  Receipt,
  Zap,
  Image as ImageIcon,
  Sparkles,
  Info,
} from 'lucide-react';
import { useCustomerPortalStore } from '@/stores/customer-portal-store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

export default function CustomerLiveChatPage() {
  const {
    chatMessages,
    sendChatMessage,
    isAgentTyping,
    opticalRxDbm,
    pppoeStatus,
    setPaymentModalOpen,
    setComplaintModalOpen,
    setCsatModalOpen,
  } = useCustomerPortalStore();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isOnline = pppoeStatus === 'online';

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAgentTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    sendChatMessage(inputText.trim());
    setInputText('');
  };

  const quickProblemChips = [
    { label: '🔴 Router Red LOS Light', text: 'Hello, my router LOS red light is blinking and internet is disconnected.' },
    { label: '📉 Slow Speed / High Ping', text: 'Hello, I am experiencing high packet loss and bufferbloat on gaming servers.' },
    { label: '💳 Submit Recharge Slip', text: 'I have transferred my monthly billing fee and attached the payment slip proof.' },
    { label: '🔧 Request Van Technician', text: 'Requesting on-site fiber technician inspection for yellow patch cord damage.' },
  ];

  return (
    <div className="h-[calc(100vh-140px)] min-h-[500px] flex flex-col bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
      {/* Top Chat Header */}
      <div className="p-4 bg-card border-b border-border flex items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/15 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm">
              NOC
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
          </div>

          <div>
            <div className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
              Prime One Helpdesk & NOC
              <Badge variant="primary" size="xs">
                24/7 Priority
              </Badge>
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>SmartOLT Telemetry: {opticalRxDbm.toFixed(1)} dBm</span>
              <span>·</span>
              <span>{isOnline ? 'Session Active' : 'Session Down'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="xs"
            onClick={() => setCsatModalOpen(true)}
            leftIcon={<Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
          >
            Rate Support
          </Button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-muted/10">
        {/* System Notice Banner */}
        <div className="p-3 bg-muted/40 rounded-xl border border-border text-xs flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>
              End-to-end verified customer interaction. All telemetry is logged under Customer Code <b>CUS-ISB-1001</b>.
            </span>
          </div>
        </div>

        {chatMessages.map((msg) => {
          const isMe = msg.sender === 'customer';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="px-3 py-1.5 rounded-full bg-muted border border-border text-[11px] text-muted-foreground flex items-center gap-1.5 max-w-lg text-center font-mono">
                  <Bot className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span>{msg.text}</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
                {!isMe && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0 border border-primary/20">
                    P
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl text-xs space-y-1.5 shadow-2xs ${
                    isMe
                      ? 'bg-primary text-white rounded-br-xs'
                      : 'bg-card border border-border text-foreground rounded-bl-xs'
                  }`}
                >
                  {!isMe && (
                    <div className="font-heading font-semibold text-[11px] text-primary flex items-center gap-1">
                      {msg.senderName}
                      <span className="text-[10px] text-muted-foreground font-normal">
                        (Officer)
                      </span>
                    </div>
                  )}

                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  <div
                    className={`flex items-center justify-end gap-1 text-[10px] ${
                      isMe ? 'text-white/80' : 'text-muted-foreground'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isMe && (
                      <span>
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-3 h-3 text-cyan-200" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Live Typing Indicator */}
        {isAgentTyping && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pl-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
              P
            </div>
            <div className="flex items-center gap-1 px-3 py-2 bg-card rounded-xl border border-border">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px]">NOC Lead is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Problem Selector Chips */}
      <div className="p-2.5 bg-card border-t border-border/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1 flex-shrink-0 pl-1">
          <Sparkles className="w-3 h-3 text-primary" /> Suggestions:
        </span>
        {quickProblemChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => sendChatMessage(chip.text)}
            className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-muted/40 hover:bg-muted text-foreground hover:border-primary/50 transition-colors flex-shrink-0 whitespace-nowrap"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-card border-t border-border flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => setPaymentModalOpen(true)}
          className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Upload Payment Proof Slip"
        >
          <Receipt className="w-4 h-4 text-primary" />
        </button>

        <button
          type="button"
          onClick={() => setComplaintModalOpen(true)}
          className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Self Diagnostic / Lodge Ticket"
        >
          <LifeBuoy className="w-4 h-4 text-primary" />
        </button>

        <input
          type="text"
          placeholder="Type your message or inquiry here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3.5 py-2 text-xs bg-muted/30 border border-border rounded-xl focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground"
        />

        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!inputText.trim()}
          leftIcon={<Send className="w-3.5 h-3.5" />}
        >
          Send
        </Button>
      </form>
    </div>
  );
}
