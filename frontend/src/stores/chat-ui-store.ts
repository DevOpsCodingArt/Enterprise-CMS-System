import { create } from 'zustand';

export type ChatQueueFilter = 'all' | 'my_chats' | 'waiting' | 'closed';

interface ChatUiState {
  activeConversationId: string | null;
  activeFilter: ChatQueueFilter;
  searchQuery: string;
  isCustomer360Open: boolean;
  isTransferModalOpen: boolean;
  isCloseModalOpen: boolean;
  isCreateTicketModalOpen: boolean;
  isInternalNoteMode: boolean;
  activeCannedSearch: string | null;

  // Actions
  setActiveConversationId: (id: string | null) => void;
  setActiveFilter: (filter: ChatQueueFilter) => void;
  setSearchQuery: (query: string) => void;
  toggleCustomer360: () => void;
  setCustomer360Open: (open: boolean) => void;
  setTransferModalOpen: (open: boolean) => void;
  setCloseModalOpen: (open: boolean) => void;
  setCreateTicketModalOpen: (open: boolean) => void;
  toggleInternalNoteMode: () => void;
  setInternalNoteMode: (val: boolean) => void;
  setActiveCannedSearch: (val: string | null) => void;
}

export const useChatUiStore = create<ChatUiState>((set) => ({
  activeConversationId: 'conv_ali_f10_01',
  activeFilter: 'all',
  searchQuery: '',
  isCustomer360Open: true,
  isTransferModalOpen: false,
  isCloseModalOpen: false,
  isCreateTicketModalOpen: false,
  isInternalNoteMode: false,
  activeCannedSearch: null,

  setActiveConversationId: (id) => set({ activeConversationId: id }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleCustomer360: () => set((state) => ({ isCustomer360Open: !state.isCustomer360Open })),
  setCustomer360Open: (open) => set({ isCustomer360Open: open }),
  setTransferModalOpen: (open) => set({ isTransferModalOpen: open }),
  setCloseModalOpen: (open) => set({ isCloseModalOpen: open }),
  setCreateTicketModalOpen: (open) => set({ isCreateTicketModalOpen: open }),
  toggleInternalNoteMode: () => set((state) => ({ isInternalNoteMode: !state.isInternalNoteMode })),
  setInternalNoteMode: (val) => set({ isInternalNoteMode: val }),
  setActiveCannedSearch: (val) => set({ activeCannedSearch: val }),
}));
