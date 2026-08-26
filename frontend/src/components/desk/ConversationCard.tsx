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
        'p-3.5 rounded-lg border cursor-pointer select-none text-left transition-all duration-150',
        isActive
          ? 'bg-primary/5 border-primary shadow-xs'
          : 'bg-card border-border hover:border-primary/40 hover:bg-muted/40'
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
            <div className="font-heading font-semibold text-xs text-foreground truncate">
              {customer?.fullName || 'Anonymous Customer'}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {customer?.username ? (
                <span>
                  PPPoE: <span className="font-mono font-medium text-foreground/80">{customer.username}</span>
                </span>
              ) : (
                customer?.phone
              )}
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground flex-shrink-0 text-right">
          {formatChatTimestamp(conversation.lastMessageAt || conversation.createdAt)}
        </div>
      </div>

      {/* Snippet in clean body font */}
      <p className="font-body text-xs text-muted-foreground/90 line-clamp-1 mt-2 leading-relaxed">
        {conversation.lastMessage?.content || conversation.subject || 'No messages yet...'}
      </p>

      {/* Bottom tags: SLA + Status + Unread badge */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/60 text-xs">
        <div className="flex items-center gap-1.5">
          {isWaiting ? (
            <Badge variant="destructive" size="xs">
              Waiting Queue
            </Badge>
          ) : isClosed ? (
            <Badge variant="default" size="xs">
              Closed
            </Badge>
          ) : conversation.isSlaBreached ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-destructive/10 text-destructive font-medium border border-destructive/20 text-xs">
              <AlertTriangle className="w-3 h-3" /> SLA Breached
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-warning/15 text-warning-foreground dark:text-warning font-medium border border-warning/20 text-xs">
              <Clock className="w-3 h-3" /> SLA: 18m
            </span>
          )}

          {customer?.area && (
            <span className="text-muted-foreground hidden sm:inline truncate max-w-24 text-xs">
              {customer.area}
            </span>
          )}
        </div>

        {conversation.unreadCountStaff > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-xs">
            {conversation.unreadCountStaff} New
          </span>
        )}
      </div>
    </div>
  );
};
