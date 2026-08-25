import React from 'react';
import { Conversation } from '@/types/chat.types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatChatTimestamp, cn } from '@/lib/utils';
import { Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ConversationCardProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  isActive,
  onClick,
}) => {
  const customer = conversation.customer;
  const isWaiting = conversation.status === 'waiting';
  const isClosed = conversation.status === 'closed';

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-3.5 border-2 cursor-pointer select-none text-left',
        isActive
          ? 'bg-card border-primary shadow-primary'
          : 'bg-card border-border hover:border-primary/60 hover:bg-card-subtle'
      )}
    >
      {/* Top row: Avatar + Name + Timestamp */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar
            name={customer?.fullName || 'Customer'}
            size="sm"
            status={customer?.status === 'active' ? 'online' : 'offline'}
          />
          <div className="min-w-0">
            <div className="font-heading font-black text-xs text-foreground truncate">
              {customer?.fullName || 'Anonymous Customer'}
            </div>
            <div className="font-mono text-[10px] text-muted-foreground truncate">
              {customer?.username ? `PPPoE: ${customer.username}` : customer?.phone}
            </div>
          </div>
        </div>

        <div className="font-mono text-[10px] text-muted-foreground flex-shrink-0 text-right">
          {formatChatTimestamp(conversation.lastMessageAt || conversation.createdAt)}
        </div>
      </div>

      {/* Snippet */}
      <p className="font-mono text-xs text-muted-foreground line-clamp-1 mt-2">
        {conversation.lastMessage?.content || conversation.subject || 'No messages yet...'}
      </p>

      {/* Bottom tags: SLA + Status + Unread badge */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/80 text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          {isWaiting ? (
            <Badge variant="destructive" size="xs">
              WAITING QUEUE
            </Badge>
          ) : isClosed ? (
            <Badge variant="default" size="xs">
              CLOSED ✓
            </Badge>
          ) : conversation.isSlaBreached ? (
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-destructive text-destructive-foreground font-bold border border-border">
              <AlertTriangle className="w-3 h-3" /> SLA BREACHED
            </span>
          ) : (
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-warning text-warning-foreground font-bold border border-border">
              <Clock className="w-3 h-3" /> SLA: 18m
            </span>
          )}

          {customer?.area && (
            <span className="text-muted-foreground hidden sm:inline truncate max-w-[90px]">
              {customer.area}
            </span>
          )}
        </div>

        {conversation.unreadCountStaff > 0 && (
          <span className="px-1.5 py-0.2 bg-primary text-primary-foreground font-bold border border-border shadow-sm">
            {conversation.unreadCountStaff} NEW
          </span>
        )}
      </div>
    </div>
  );
};
