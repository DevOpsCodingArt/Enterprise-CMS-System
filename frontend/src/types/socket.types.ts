import { Message, Conversation, MessageType } from './chat.types';

export interface SendMessagePayload {
  conversationId: string;
  type: MessageType;
  content: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isInternalNote?: boolean;
  replyToMessageId?: string;
}

export interface TypingPayload {
  conversationId: string;
  userId?: string;
  userName?: string;
}

export interface MessageReceiptPayload {
  conversationId: string;
  messageIds: string[];
}

export interface PresencePayload {
  userId: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface TransferPayload {
  conversationId: string;
  fromAgentId: string;
  toAgentId: string;
  reason: string;
}

export interface ClosePayload {
  conversationId: string;
  closedBy: string;
  outcome: string;
  reason?: string;
}
