export interface DemoChatMessage {
  senderType: 'customer' | 'staff' | 'system';
  senderName: string;
  messageType:
    | 'text'
    | 'image'
    | 'voice'
    | 'video'
    | 'document'
    | 'system'
    | 'ticket_created'
    | 'payment_proof';
  isInternalNote?: boolean;
  content: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface DemoConversation {
  customerCode: string;
  userUsername: string;
  initiatedBy: 'customer' | 'staff';
  status: 'active' | 'waiting' | 'on_hold' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  subject: string;
  messages: DemoChatMessage[];
}

export const DEMO_CONVERSATION: DemoConversation = {
  customerCode: 'CUS-1001',
  userUsername: 'agent.ali',
  initiatedBy: 'customer',
  status: 'active',
  priority: 'high',
  subject: 'Internet speed drop in evening hours',
  messages: [
    {
      senderType: 'customer',
      senderName: 'Muhammad Ali Khan',
      messageType: 'text',
      content:
        'Hello, my internet speed is dropping significantly every evening around 8 PM. Can you check my connection?',
      status: 'read',
    },
    {
      senderType: 'staff',
      senderName: 'Agent Ali',
      messageType: 'text',
      content:
        'Hello Muhammad Ali! Let me check your optical signal power and MikroTik live session right now.',
      status: 'read',
    },
    {
      senderType: 'staff',
      senderName: 'Agent Ali',
      messageType: 'text',
      isInternalNote: true,
      content:
        'Checked SmartOLT: Signal is optimal (-19.5 dBm). MikroTik interface shows high latency on F-10 core switch.',
      status: 'read',
    },
    {
      senderType: 'customer',
      senderName: 'Muhammad Ali Khan',
      messageType: 'text',
      content: 'Thank you. I have attached the speed test screenshot as well.',
      status: 'read',
    },
  ],
};
