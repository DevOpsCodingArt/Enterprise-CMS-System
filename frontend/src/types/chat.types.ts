import { Customer } from './customer.types';
import { AuthUser } from './auth.types';

export type ConversationInitiator = 'customer' | 'staff';
export type ConversationStatus = 'waiting' | 'active' | 'on_hold' | 'closed';
export type ConversationPriority = 'low' | 'normal' | 'high' | 'urgent';

export type MessageSenderType = 'customer' | 'staff' | 'system';
export type MessageType =
  | 'text'
  | 'image'
  | 'voice'
  | 'video'
  | 'document'
  | 'system'
  | 'ticket_created'
  | 'payment_proof';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Conversation {
  id: string;
  companyId: string;
  customerId: string;
  initiatedBy: ConversationInitiator;
  status: ConversationStatus;
  assignedTo?: string | null;
  assignedAt?: string | null;
  previousAssignee?: string | null;
  priority: ConversationPriority;
  subject?: string | null;
  closureReason?: string | null;
  closureOutcome?: string | null;
  closedBy?: string | null;
  closedAt?: string | null;
  customerRating?: number | null; // 1 to 5
  customerFeedback?: string | null;
  lastMessageAt?: string | null;
  lastCustomerMessageAt?: string | null;
  lastStaffMessageAt?: string | null;
  unreadCountCustomer: number;
  unreadCountStaff: number;
  slaExpiresAt?: string | null;
  isSlaBreached?: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;

  // Joined / Populated entities
  customer?: Customer;
  assignee?: AuthUser | null;
  lastMessage?: Message;
}

export interface Message {
  id: string;
  conversationId: string;
  companyId: string;
  senderType: MessageSenderType;
  senderCustomerId?: string | null;
  senderUserId?: string | null;
  senderName: string;
  messageType: MessageType;
  content: string;
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  fileMimeType?: string | null;
  thumbnailUrl?: string | null;
  duration?: number | null; // seconds for audio
  replyToMessageId?: string | null;
  isInternalNote: boolean;
  isPublicNote: boolean;
  status: MessageStatus;
  deliveredAt?: string | null;
  readAt?: string | null;
  isDeleted: boolean;
  metadata?: Record<string, any>;
  createdAt: string;

  // Optimistic tracking
  tempId?: string;
}

export interface ChatTransfer {
  id: string;
  conversationId: string;
  companyId: string;
  fromUserId: string;
  toUserId: string;
  reason: string;
  transferredAt: string;
  fromUser?: { id: string; fullName: string };
  toUser?: { id: string; fullName: string };
}

export interface QuickReply {
  id: string;
  companyId: string;
  title: string;
  content: string;
  shortcut?: string | null; // e.g. /signal, /dispatch
  category?: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkingHour {
  id: string;
  companyId: string;
  dayOfWeek: number; // 0=Mon, 6=Sun
  isWorkingDay: boolean;
  startTime: string;
  endTime: string;
  offlineMessage?: string | null;
}
