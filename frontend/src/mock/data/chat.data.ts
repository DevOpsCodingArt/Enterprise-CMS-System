import type { Conversation, ChatMessage } from "@/types/chat.types";

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-01",
    companyId: "comp-prime-01",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    customerId: "cus-84920",
    customerName: "Ali Hassan",
    customerPhone: "+92 300 8594021",
    customerAccountNo: "PK-84920",
    pppoeUsername: "ali_f10",
    status: "active",
    assignedAgentId: "usr-csr-01",
    assignedAgentName: "Fatima Noor",
    lastMessage: "Salam, my router LOS light started blinking red 10 minutes ago.",
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
    channel: "whatsapp",
    slaExpiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    isSlaBreached: false,
    opticalRxDbm: -19.24,
  },
];

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  "conv-01": [
    {
      id: "msg-01",
      conversationId: "conv-01",
      senderId: "cus-84920",
      senderName: "Ali Hassan",
      senderRole: "customer",
      content: "Salam, my router LOS light started blinking red 10 minutes ago.",
      type: "text",
      status: "read",
      createdAt: new Date().toISOString(),
    },
  ],
};
