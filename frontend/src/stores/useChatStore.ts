import { create } from "zustand";
import type { Conversation, ChatMessage } from "@/types/chat.types";
import { mockDb } from "@/mock/db";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, ChatMessage[]>;
  typingMap: Record<string, boolean>;
  setActiveConversationId: (id: string | null) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  setTyping: (conversationId: string, isTyping: boolean) => void;
  setConversations: (conversations: Conversation[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: mockDb.conversations,
  activeConversationId: "conv-01",
  messages: mockDb.messages,
  typingMap: {},

  setActiveConversationId: (activeConversationId) => set({ activeConversationId }),

  addMessage: (conversationId, message) =>
    set((state) => {
      const existing = state.messages[conversationId] || [];
      const updatedConversations = state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: message.content,
              lastMessageAt: message.createdAt,
            }
          : c
      );

      return {
        messages: {
          ...state.messages,
          [conversationId]: [...existing, message],
        },
        conversations: updatedConversations,
      };
    }),

  setTyping: (conversationId, isTyping) =>
    set((state) => ({
      typingMap: { ...state.typingMap, [conversationId]: isTyping },
    })),

  setConversations: (conversations) => set({ conversations }),
}));
