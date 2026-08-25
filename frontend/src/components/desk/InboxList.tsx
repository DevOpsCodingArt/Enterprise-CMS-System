'use client';

import React from 'react';
import { useChatUiStore, ChatQueueFilter } from '@/stores/chat-ui-store';
import { Conversation } from '@/types/chat.types';
import { ConversationCard } from './ConversationCard';
import { Tabs } from '@/components/ui/Tabs';
import { Search, Filter, RefreshCw, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface InboxListProps {
  conversations: Conversation[];
  isLoading?: boolean;
}

export const InboxList: React.FC<InboxListProps> = ({ conversations, isLoading }) => {
  const {
    activeConversationId,
    setActiveConversationId,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
  } = useChatUiStore();

  const tabs = [
    { id: 'all', label: 'All', count: conversations.length },
    {
      id: 'my_chats',
      label: 'My Chats',
      count: conversations.filter((c) => c.status === 'active').length,
    },
    {
      id: 'waiting',
      label: 'Waiting',
      count: conversations.filter((c) => c.status === 'waiting').length,
    },
    {
      id: 'closed',
      label: 'Closed',
      count: conversations.filter((c) => c.status === 'closed').length,
    },
  ];

  // Filtering Logic
  const filteredConversations = conversations.filter((c) => {
    // 1. Filter Tab
    if (activeFilter === 'my_chats' && c.status !== 'active') return false;
    if (activeFilter === 'waiting' && c.status !== 'waiting') return false;
    if (activeFilter === 'closed' && c.status !== 'closed') return false;

    // 2. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = c.customer?.fullName?.toLowerCase() || '';
      const username = c.customer?.username?.toLowerCase() || '';
      const phone = c.customer?.phone || '';
      const code = c.customer?.customerCode?.toLowerCase() || '';
      return name.includes(q) || username.includes(q) || phone.includes(q) || code.includes(q);
    }

    return true;
  });

  return (
    <div className="w-full lg:w-80 xl:w-96 border-r-2 border-border bg-card flex flex-col h-full flex-shrink-0">
      {/* Top Header: Title & Stats */}
      <div className="p-3.5 border-b-2 border-border flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="font-heading font-black text-sm tracking-tight uppercase">
            ACTIVE INBOX
          </span>
        </div>
        <Badge variant="primary" size="xs">
          {conversations.filter((c) => c.status === 'waiting').length} WAITING
        </Badge>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b-2 border-border bg-card-subtle">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search subscriber, PPPoE, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border-2 border-border pl-8 pr-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b-2 border-border">
        <Tabs
          tabs={tabs}
          activeTab={activeFilter}
          onChange={(tab) => setActiveFilter(tab as ChatQueueFilter)}
          size="sm"
        />
      </div>

      {/* Conversation Cards List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="p-4 border-2 border-border animate-pulse bg-card-subtle space-y-2">
                <div className="h-4 bg-muted w-2/3" />
                <div className="h-3 bg-muted w-full" />
                <div className="h-3 bg-muted w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-muted-foreground">
            <Filter className="w-6 h-6 mx-auto mb-2 opacity-40" />
            <div>NO CONVERSATIONS FOUND</div>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <ConversationCard
              key={conv.id}
              conversation={conv}
              isActive={activeConversationId === conv.id}
              onClick={() => setActiveConversationId(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
