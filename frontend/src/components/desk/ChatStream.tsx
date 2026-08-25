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
    <div className="flex-1 flex flex-col h-full bg-card-subtle min-w-0">
      {/* 1. Conversation Topbar Header */}
      <div className="p-3.5 border-b-2 border-border bg-card flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-sm text-foreground truncate">
                {conversation.customer?.fullName || 'Ali Hassan'}
              </span>
              <Badge variant="primary" size="xs">
                {conversation.customer?.username || 'ali_f10'}
              </Badge>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
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
            <span className="hidden sm:inline">TRANSFER</span>
          </Button>

          <Button
            variant="outline"
            size="xs"
            onClick={() => alert(`Escalated to Trouble Ticket for ${conversation.customer?.fullName}`)}
            leftIcon={<Ticket className="w-3 h-3 text-destructive" />}
          >
            <span className="hidden sm:inline">CREATE TICKET</span>
          </Button>

          <Button
            variant="primary"
            size="xs"
            onClick={() => setCloseModalOpen(true)}
            leftIcon={<CheckCircle2 className="w-3 h-3" />}
          >
            <span>CLOSE</span>
          </Button>

          <button
            onClick={toggleCustomer360}
            className="p-1.5 border border-border bg-card hover:bg-card-subtle text-foreground ml-1"
            title="Toggle Customer 360 Telemetry"
          >
            {isCustomer360Open ? <SidebarClose className="w-4 h-4" /> : <SidebarOpen className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Message Thread Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
      <div className="border-t-2 border-border bg-card p-3 space-y-2">
        {/* Canned replies chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-mono">
          <span className="text-muted-foreground flex items-center gap-1 flex-shrink-0 font-bold">
            <Zap className="w-3 h-3 text-warning" /> CANNED:
          </span>
          {cannedTemplates.map((c, i) => (
            <button
              key={i}
              onClick={() => handleCannedInsert(c.text)}
              className="px-2 py-1 bg-card-subtle border border-border hover:border-primary text-muted-foreground hover:text-foreground whitespace-nowrap"
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Private note mode alert banner */}
        {isInternalNoteMode && (
          <div className="p-2 bg-warning-light border-2 border-dashed border-warning flex items-center justify-between text-[11px] font-mono text-warning font-bold">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>LOGGING PRIVATE STAFF AUDIT NOTE (HIDDEN FROM CUSTOMER)</span>
            </div>
            <button
              onClick={toggleInternalNoteMode}
              className="underline text-[10px] hover:opacity-80"
            >
              Exit Private Mode
            </button>
          </div>
        )}

        {/* 4. Action Composer */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleInternalNoteMode}
            className={`p-2.5 border-2 text-xs font-mono font-bold ${isInternalNoteMode
                ? 'bg-warning text-warning-foreground border-border shadow-sm'
                : 'bg-card border-border hover:border-warning text-muted-foreground'
              }`}
            title="Toggle Private Staff Note"
          >
            <Lock className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder={
              isInternalNoteMode
                ? 'Write confidential staff audit note...'
                : "Type message or press '/' for canned replies..."
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className={`flex-1 bg-card border-2 px-3.5 py-2.5 text-xs font-mono text-foreground focus:outline-none ${isInternalNoteMode ? 'border-warning focus:border-warning' : 'border-border focus:border-primary'
              }`}
          />

          <Button
            variant={isInternalNoteMode ? 'warning' : 'primary'}
            size="md"
            onClick={handleSend}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            <span>{isInternalNoteMode ? 'LOG NOTE' : 'SEND'}</span>
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
