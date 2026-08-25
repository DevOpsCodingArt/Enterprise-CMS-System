import React from 'react';
import { Message } from '@/types/chat.types';
import { cn, formatChatTimestamp } from '@/lib/utils';
import { Lock, Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  // 1. System Event Message
  if (message.senderType === 'system') {
    return (
      <div className="flex justify-center my-3">
        <div className="px-3.5 py-1.5 bg-card border border-border text-[11px] font-mono text-muted-foreground max-w-md text-center shadow-sm">
          <span className="font-bold text-foreground">SYSTEM: </span>
          {message.content}
        </div>
      </div>
    );
  }

  // 2. Staff Private Internal Note
  if (message.isInternalNote) {
    return (
      <div className="my-2.5 max-w-[90%] sm:max-w-[80%] mr-auto">
        <div className="p-3 bg-warning-light border-2 border-dashed border-warning text-warning-foreground text-xs font-mono shadow-sm">
          <div className="flex items-center gap-1.5 font-bold mb-1 text-warning">
            <Lock className="w-3.5 h-3.5" />
            <span>INTERNAL STAFF AUDIT NOTE (CONFIDENTIAL)</span>
          </div>
          <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
          <div className="text-[9px] text-warning/80 text-right mt-1.5 font-bold">
            {message.senderName} · {formatChatTimestamp(message.createdAt)}
          </div>
        </div>
      </div>
    );
  }

  // 3. Regular Customer or Agent Message
  const isAgent = message.senderType === 'staff' || isCurrentUser;

  return (
    <div
      className={cn(
        'my-1.5 max-w-[85%] sm:max-w-[75%] flex flex-col',
        isAgent ? 'ml-auto items-end' : 'mr-auto items-start'
      )}
    >
      <div
        className={cn(
          'p-3.5 text-xs leading-relaxed border-2 shadow-sm font-body',
          isAgent
            ? 'bg-primary text-primary-foreground border-border text-left'
            : 'bg-card text-foreground border-border text-left'
        )}
      >
        {/* Sender Name */}
        <div className="font-heading font-black text-[11px] mb-1 opacity-90 uppercase">
          {message.senderName}
        </div>

        {/* Content */}
        <div className="whitespace-pre-wrap">{message.content}</div>

        {/* Timestamp & Read Receipt Checkmarks */}
        <div
          className={cn(
            'flex items-center justify-end gap-1 text-[9px] font-mono mt-1.5 opacity-80'
          )}
        >
          <span>{formatChatTimestamp(message.createdAt)}</span>

          {isAgent && (
            <span className="flex items-center ml-0.5">
              {message.status === 'sending' ? (
                <Clock className="w-3 h-3 animate-spin" />
              ) : message.status === 'failed' ? (
                <AlertCircle className="w-3 h-3 text-destructive" />
              ) : message.status === 'read' ? (
                <CheckCheck className="w-3.5 h-3.5 text-info font-bold" />
              ) : message.status === 'delivered' ? (
                <CheckCheck className="w-3.5 h-3.5" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
