/**
 * Real-Time Chat & Helpdesk Communication Types.
 */

export type MessageDeliveryStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export type MessageType = "text" | "image" | "audio" | "video" | "document" | "system" | "private_note";

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: "customer" | "agent" | "system";
  content: string;
  type: MessageType;
  mediaUrl?: string;
  mediaFileName?: string;
  mediaSizeKb?: number;
  status: MessageDeliveryStatus;
  isPrivateNote?: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  companyId: string;
  branchId: string;
  branchName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAccountNo: string;
  pppoeUsername: string;
  status: "active" | "waiting" | "closed";
  assignedAgentId?: string;
  assignedAgentName?: string;
  lastMessage?: string;
  lastMessageAt: string;
  unreadCount: number;
  channel: "whatsapp" | "web_chat" | "mobile_app" | "ivr";
  slaExpiresAt: string;
  isSlaBreached: boolean;
  opticalRxDbm?: number;
}
