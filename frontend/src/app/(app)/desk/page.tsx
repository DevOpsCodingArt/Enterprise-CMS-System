'use client';

import React, { useState } from 'react';
import { InboxList } from '@/components/desk/InboxList';
import { ChatStream } from '@/components/desk/ChatStream';
import { Customer360Drawer } from '@/components/desk/Customer360Drawer';
import { useChatUiStore } from '@/stores/chat-ui-store';
import { Conversation, Message } from '@/types/chat.types';
import { Customer360 } from '@/types/customer.types';
import { mockDb } from '@/mock-db';

export default function PrimeDeskPage() {
  const { activeConversationId, isCustomer360Open } = useChatUiStore();

  const [conversations, setConversations] = useState<Conversation[]>(
    mockDb.getDeskConversations()
  );

  const [messages, setMessages] = useState<Message[]>(
    mockDb.getDeskMessages()
  );

  const activeConv =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const handleSendMessage = (content: string, isInternalNote: boolean) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId: activeConv.id,
      companyId: activeConv.companyId,
      senderType: 'staff',
      senderName: isInternalNote ? 'Eng. Moiz (Staff Note)' : 'NOC Lead (Moiz)',
      messageType: 'text',
      content,
      status: 'sending',
      isInternalNote,
      isPublicNote: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);

    // Simulate Server Delivery Ack
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, status: 'delivered' } : m))
      );
    }, 400);
  };

  const handleSimulateCut = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg_sys_${Date.now()}`,
        conversationId: activeConv.id,
        companyId: activeConv.companyId,
        senderType: 'system',
        senderName: 'SmartOLT System',
        messageType: 'system',
        content: 'SMARTOLT ALARM: Optical RX loss degraded to -32.54 dBm (Critical Cut detected on PON-4).',
        status: 'read',
        isInternalNote: false,
        isPublicNote: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const handleRestoreLink = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg_sys_${Date.now()}`,
        conversationId: activeConv.id,
        companyId: activeConv.companyId,
        senderType: 'system',
        senderName: 'SmartOLT System',
        messageType: 'system',
        content: 'SMARTOLT RESTORED: Optical RX recovered to nominal -19.24 dBm. PPPoE link re-authenticated.',
        status: 'read',
        isInternalNote: false,
        isPublicNote: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: `msg_cust_${Date.now() + 1}`,
        conversationId: activeConv.id,
        companyId: activeConv.companyId,
        senderType: 'customer',
        senderName: 'Ali Hassan',
        messageType: 'text',
        content: 'Thank you! The router LOS light turned solid green and full 50 Mbps speed is back online!',
        status: 'read',
        isInternalNote: false,
        isPublicNote: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="flex-1 min-h-0 flex h-full w-full overflow-hidden">
      {/* Column 1: Active Inboxes & Queues */}
      <InboxList conversations={conversations} />

      {/* Column 2: Live Message Stream & Action Composer */}
      <ChatStream
        conversation={activeConv}
        messages={messages}
        onSendMessage={handleSendMessage}
      />

      {/* Column 3: Customer 360° & Live Optical Telemetry Drawer */}
      {isCustomer360Open && (
        <Customer360Drawer
          data={{ customer: activeConv.customer } as any}
          onSimulateOpticalCut={handleSimulateCut}
          onRestoreOpticalLink={handleRestoreLink}
        />
      )}
    </div>
  );
}
