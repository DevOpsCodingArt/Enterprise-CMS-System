'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Conversation, Message } from '@/types/chat.types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { TransferChatModal } from './TransferChatModal';
import { CloseChatModal } from './CloseChatModal';
import { useAuthStore } from '@/stores/auth-store';
import { useChatUiStore } from '@/stores/chat-ui-store';
import {
  Send,
  Paperclip,
  Lock,
  ArrowRightLeft,
  CheckCircle2,
  Ticket,
  Zap,
  MoreVertical,
  SidebarClose,
  SidebarOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ChatStreamProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string, isInternalNote: boolean) => void;
  isTyping?: boolean;
}

export const ChatStream: React.FC<ChatStreamProps> = ({
  conversation,
  messages,
  onSendMessage,
  isTyping = false,
}) => {
  const { user } = useAuthStore();
  const {
    isCustomer360Open,
    toggleCustomer360,
    isTransferModalOpen,
    setTransferModalOpen,
    isCloseModalOpen,
    setCloseModalOpen,
    isInternalNoteMode,
    toggleInternalNoteMode,
  } = useChatUiStore();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage.trim(), isInternalNoteMode);
    setInputMessage('');
  };

  const handleCannedInsert = (text: string) => {
    setInputMessage(text);
  };

  const cannedTemplates = [
    { label: '/signal', text: 'SmartOLT diagnostic shows optical signal is normal at -19.2 dBm.' },
    { label: '/dispatch', text: 'Field Engineer Imran (Van 04) has been dispatched with OTDR splicing meter.' },
    { label: '/bill', text: 'Payment receipt verified and synced to your ZL Ultra ledger.' },
    { label: '/reboot', text: 'Please turn off the power adapter of your router for 30 seconds and turn it back on.' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full max-h-full bg-muted/20 min-w-0 overflow-hidden">
      {/* 1. Conversation Topbar Header */}
      <div className="flex-shrink-0 p-3.5 border-b border-border bg-card flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-semibold text-sm text-foreground truncate">
                {conversation.customer?.fullName || 'Ali Hassan'}
              </span>
              <Badge variant="primary" size="xs">
                <span className="font-mono">{conversation.customer?.username || 'ali_f10'}</span>
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              50M Ultra Fiber · Sector F-10/2 · PON-04
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="outline"
            size="xs"
            onClick={() => setTransferModalOpen(true)}
            leftIcon={<ArrowRightLeft className="w-3 h-3" />}
          >
            <span className="hidden sm:inline">Transfer</span>
          </Button>

          <Button
            variant="outline"
            size="xs"
            onClick={() => alert(`Escalated to Trouble Ticket for ${conversation.customer?.fullName}`)}
            leftIcon={<Ticket className="w-3 h-3 text-destructive" />}
          >
            <span className="hidden sm:inline">Create Ticket</span>
          </Button>

          <Button
            variant="primary"
            size="xs"
            onClick={() => setCloseModalOpen(true)}
            leftIcon={<CheckCircle2 className="w-3 h-3" />}
          >
            <span>Close</span>
          </Button>

          <button
            onClick={toggleCustomer360}
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground ml-1 transition-colors"
            title="Toggle Customer 360 Telemetry"
          >
            {isCustomer360Open ? <SidebarClose className="w-4 h-4" /> : <SidebarOpen className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Message Thread Stream */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-2.5 custom-scrollbar">
        {messages.map((m) => (
          <MessageBubble
            key={m.id || m.tempId}
            message={m}
            isCurrentUser={m.senderUserId === user?.id || m.senderType === 'staff'}
          />
        ))}

        {isTyping && <TypingIndicator name={conversation.customer?.fullName || 'Customer'} />}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Canned Replies Bar + Private Note Mode Indicator */}
      <div className="flex-shrink-0 border-t border-border bg-card p-3 space-y-2.5">
        {/* Quick Canned Slash Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono font-medium">
            <Zap className="w-3 h-3 text-warning" /> /
          </span>
          {cannedTemplates.map((t, idx) => (
            <button
              key={idx}
              onClick={() => handleCannedInsert(t.text)}
              className="px-2 py-0.5 rounded-md bg-muted/50 hover:bg-primary/10 hover:text-primary border border-border/80 text-xs font-mono text-muted-foreground transition-colors flex-shrink-0"
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Private Note Mode Banner */}
        {isInternalNoteMode && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-warning/15 border border-warning/30 text-xs text-warning-foreground dark:text-warning font-medium">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Internal Staff Note Mode (Visible only to NOC & Helpdesk, NOT Customer)</span>
            </div>
            <button
              onClick={toggleInternalNoteMode}
              className="text-xs underline hover:no-underline font-semibold"
            >
              Switch to Public Reply
            </button>
          </div>
        )}

        {/* Text Input & Actions Bar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleInternalNoteMode}
            className={`p-2 rounded-lg border transition-colors ${
              isInternalNoteMode
                ? 'bg-warning/20 border-warning text-warning-foreground dark:text-warning'
                : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground'
            }`}
            title={isInternalNoteMode ? 'Switch to Customer Chat' : 'Write Private Staff Note'}
          >
            <Lock className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder={
              isInternalNoteMode
                ? 'Type confidential internal note (saved to subscriber audit trail)...'
                : 'Type message or use / for quick replies...'
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className={`flex-1 rounded-lg border px-3.5 py-2 text-xs text-foreground focus:outline-none transition-all ${
              isInternalNoteMode
                ? 'bg-warning/5 border-warning/40 focus:ring-1 focus:ring-warning'
                : 'bg-card border-border focus:ring-1 focus:ring-primary'
            }`}
          />

          <Button
            variant={isInternalNoteMode ? 'warning' : 'primary'}
            size="sm"
            onClick={handleSend}
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            <span>{isInternalNoteMode ? 'Add Note' : 'Send'}</span>
          </Button>
        </div>
      </div>

      {/* Modals */}
      <TransferChatModal
        isOpen={isTransferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        conversationId={conversation.id}
      />

      <CloseChatModal
        isOpen={isCloseModalOpen}
        onClose={() => setCloseModalOpen(false)}
        conversationId={conversation.id}
      />
    </div>
  );
};
