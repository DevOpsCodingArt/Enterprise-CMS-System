export interface MockChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'customer' | 'staff' | 'system';
  senderName: string;
  content: string;
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
  isPrivateNote?: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'document';
}

export interface MockConversation {
  id: string;
  customerId: string;
  customerName: string;
  pppoeUsername: string;
  area: string;
  branchId: string;
  branchName: string;
  assignedAgentId?: string | null;
  assignedAgentName?: string | null;
  status: 'active' | 'waiting' | 'closed';
  unreadCount: number;
  lastMessageText: string;
  lastMessageTime: string;
  messages: MockChatMessage[];
}

export const mockConversations: MockConversation[] = [
  {
    id: 'conv_01',
    customerId: 'cus_01',
    customerName: 'Zayan Tariq',
    pppoeUsername: 'zayan.tariq_f10',
    area: 'F-10/2',
    branchId: 'br_isb_f10',
    branchName: 'Islamabad F-10 Main Hub',
    assignedAgentId: 'usr_03',
    assignedAgentName: 'Ayesha Khan',
    status: 'active',
    unreadCount: 0,
    lastMessageText: 'Fiber optical signal dropped to -32.54 dBm (LOS Cut).',
    lastMessageTime: '04:28 AM',
    messages: [
      {
        id: 'msg_01',
        conversationId: 'conv_01',
        senderId: 'cus_01',
        senderType: 'customer',
        senderName: 'Zayan Tariq',
        content: 'Salam, red light is blinking on my fiber router in F-10/2.',
        createdAt: '04:15 AM',
        status: 'read',
      },
      {
        id: 'msg_02',
        conversationId: 'conv_01',
        senderId: 'usr_03',
        senderType: 'staff',
        senderName: 'Ayesha Khan',
        content: 'Wa Alaikum Assalam Zayan sahib. Let me inspect your optical signal link in our SmartOLT telemetry right now.',
        createdAt: '04:18 AM',
        status: 'read',
      },
      {
        id: 'msg_03',
        conversationId: 'conv_01',
        senderId: 'usr_03',
        senderType: 'staff',
        senderName: 'Ayesha Khan',
        content: 'SmartOLT shows severe attenuation at -32.54 dBm on EPON0/2:4. Checking joint box on Street 18.',
        createdAt: '04:20 AM',
        status: 'read',
        isPrivateNote: true,
      },
      {
        id: 'msg_04',
        conversationId: 'conv_01',
        senderId: 'usr_03',
        senderType: 'staff',
        senderName: 'Ayesha Khan',
        content: 'Our telemetry detected an optical attenuation drop. I have escalated this to Van 04 for urgent on-site OTDR splicing.',
        createdAt: '04:22 AM',
        status: 'delivered',
      },
    ],
  },
  {
    id: 'conv_02',
    customerId: 'cus_02',
    customerName: 'Dr. Sarah Ahmed',
    pppoeUsername: 'sarah.ahmed_f10',
    area: 'F-10 Markaz',
    branchId: 'br_isb_f10',
    branchName: 'Islamabad F-10 Main Hub',
    assignedAgentId: null,
    assignedAgentName: null,
    status: 'waiting',
    unreadCount: 1,
    lastMessageText: 'Can you please verify my monthly payment receipt uploaded via JazzCash?',
    lastMessageTime: '04:30 AM',
    messages: [
      {
        id: 'msg_05',
        conversationId: 'conv_02',
        senderId: 'cus_02',
        senderType: 'customer',
        senderName: 'Dr. Sarah Ahmed',
        content: 'Can you please verify my monthly payment receipt uploaded via JazzCash?',
        createdAt: '04:30 AM',
        status: 'delivered',
      },
    ],
  },
];
