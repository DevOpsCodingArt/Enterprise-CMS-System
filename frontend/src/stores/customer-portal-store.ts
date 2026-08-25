import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer } from '@/types/customer.types';
import {
  mockDb,
  CustomerInvoice,
  CustomerTicket,
  CustomerChatMessage,
} from '@/mock-db';

export type { CustomerInvoice, CustomerTicket, CustomerChatMessage };

interface CustomerPortalState {
  // Profile & Connection
  customer: Customer;
  opticalRxDbm: number;
  opticalTxDbm: number;
  opticalStatus: 'nominal' | 'warning' | 'critical' | 'dead';
  pppoeStatus: 'online' | 'offline' | 'authenticating';
  sessionUptime: string;
  currentIp: string;
  macAddress: string;
  usageGb: number;
  usageLimitGb: string;

  // Invoices & Payment Ledger
  invoices: CustomerInvoice[];
  activePaymentProof: {
    channel: string;
    amount: number;
    transactionId: string;
    slipUrl: string;
    uploadedAt: string;
    status: 'uploaded' | 'under_verification' | 'verified';
  } | null;

  // Trouble Tickets & Diagnostics
  tickets: CustomerTicket[];
  activeTicketId: string | null;

  // Live Support Chat
  chatMessages: CustomerChatMessage[];
  isAgentTyping: boolean;

  // Modals & UI States
  isPaymentModalOpen: boolean;
  isComplaintModalOpen: boolean;
  isCsatModalOpen: boolean;

  // Actions
  setPaymentModalOpen: (open: boolean) => void;
  setComplaintModalOpen: (open: boolean) => void;
  setCsatModalOpen: (open: boolean) => void;
  setActiveTicketId: (id: string | null) => void;
  
  submitPaymentProof: (payment: {
    channel: string;
    amount: number;
    transactionId: string;
    slipUrl: string;
  }) => void;

  lodgeComplaint: (complaint: {
    category: CustomerTicket['category'];
    title: string;
    description: string;
    priority: CustomerTicket['priority'];
  }) => void;

  sendChatMessage: (text: string, fileUrl?: string, fileType?: 'image' | 'document' | 'audio') => void;
  
  simulateOpticalCut: () => void;
  simulateRestoreLink: () => void;
  submitCsatRating: (rating: number, feedback: string) => void;
}

export const useCustomerPortalStore = create<CustomerPortalState>()(
  persist(
    (set, get) => ({
      customer: mockDb.getCustomerPortalSubscriber(),

      opticalRxDbm: -19.5,
      opticalTxDbm: 2.1,
      opticalStatus: 'nominal',
      pppoeStatus: 'online',
      sessionUptime: '18d 04h 12m',
      currentIp: '192.168.10.45',
      macAddress: 'BC:A9:93:4F:11:A2',
      usageGb: 428,
      usageLimitGb: 'Unlimited',

      invoices: mockDb.getCustomerInvoices(),
      activePaymentProof: null,
      tickets: mockDb.getCustomerTickets(),
      activeTicketId: 'tkt_8491',
      chatMessages: mockDb.getCustomerChatMessages(),

      isAgentTyping: false,
      isPaymentModalOpen: false,
      isComplaintModalOpen: false,
      isCsatModalOpen: false,

      setPaymentModalOpen: (open) => set({ isPaymentModalOpen: open }),
      setComplaintModalOpen: (open) => set({ isComplaintModalOpen: open }),
      setCsatModalOpen: (open) => set({ isCsatModalOpen: open }),
      setActiveTicketId: (id) => set({ activeTicketId: id }),

      submitPaymentProof: (payment) => {
        const newProof = {
          ...payment,
          uploadedAt: new Date().toISOString(),
          status: 'under_verification' as const,
        };

        const newInvoice: CustomerInvoice = {
          id: `inv_${Date.now()}`,
          invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          month: 'September 2026 (Advance)',
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
          amount: payment.amount,
          status: 'pending_verification',
          paymentMethod: payment.channel,
          transactionRef: payment.transactionId,
        };

        set((state) => ({
          activePaymentProof: newProof,
          invoices: [newInvoice, ...state.invoices],
          isPaymentModalOpen: false,
          chatMessages: [
            ...state.chatMessages,
            {
              id: `cmsg_${Date.now()}`,
              sender: 'customer',
              senderName: 'Ali Hassan',
              text: `Submitted recharge payment proof of PKR ${payment.amount.toLocaleString()} via ${payment.channel}. Transaction Ref: ${payment.transactionId}`,
              timestamp: 'Just now',
              status: 'sent',
            },
            {
              id: `cmsg_${Date.now() + 1}`,
              sender: 'system',
              senderName: 'Accounts Bot',
              text: 'Payment slip received in Accounts Queue. Verification typically completes within 10-15 minutes.',
              timestamp: 'Just now',
              status: 'delivered',
            },
          ],
        }));
      },

      lodgeComplaint: (complaint) => {
        const newTicket: CustomerTicket = {
          id: `tkt_${Date.now()}`,
          ticketNumber: `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          category: complaint.category,
          title: complaint.title,
          description: complaint.description,
          status: 'assigned',
          priority: complaint.priority,
          createdAt: new Date().toISOString(),
          ettr: '45 mins remaining',
          assignedTechnician: {
            name: 'Eng. Usman Tariq',
            vanCode: 'Van 02 (Troubleshooting)',
            phone: '+92 300 7654321',
            distanceEta: '2.1 km away (ETA: 8 mins)',
            currentStage: 'en_route',
          },
        };

        set((state) => ({
          tickets: [newTicket, ...state.tickets],
          activeTicketId: newTicket.id,
          isComplaintModalOpen: false,
          chatMessages: [
            ...state.chatMessages,
            {
              id: `cmsg_${Date.now()}`,
              sender: 'customer',
              senderName: 'Ali Hassan',
              text: `Registered Complaint #${newTicket.ticketNumber}: ${complaint.title}`,
              timestamp: 'Just now',
              status: 'sent',
            },
            {
              id: `cmsg_${Date.now() + 1}`,
              sender: 'system',
              senderName: 'Helpdesk Dispatch',
              text: `Complaint registered and assigned to Islamabad F-10 field team. Track live progress under Trouble Tickets tab.`,
              timestamp: 'Just now',
              status: 'delivered',
            },
          ],
        }));
      },

      sendChatMessage: (text, fileUrl, fileType) => {
        const userMsg: CustomerChatMessage = {
          id: `cmsg_${Date.now()}`,
          sender: 'customer',
          senderName: 'Ali Hassan',
          text,
          fileUrl,
          fileType,
          timestamp: 'Just now',
          status: 'sent',
        };

        set((state) => ({
          chatMessages: [...state.chatMessages, userMsg],
        }));

        // Simulate Agent Typing & Delivery Ack
        setTimeout(() => {
          set((state) => ({
            chatMessages: state.chatMessages.map((m) =>
              m.id === userMsg.id ? { ...m, status: 'read' } : m
            ),
            isAgentTyping: true,
          }));
        }, 800);

        setTimeout(() => {
          set((state) => ({
            isAgentTyping: false,
            chatMessages: [
              ...state.chatMessages,
              {
                id: `cmsg_${Date.now() + 1}`,
                sender: 'agent',
                senderName: 'NOC Lead (Moiz)',
                text: 'Thank you Ali, I am monitoring your optical fiber port telemetry in real-time.',
                timestamp: 'Just now',
                status: 'delivered',
              },
            ],
          }));
        }, 2200);
      },

      simulateOpticalCut: () => {
        set((state) => ({
          opticalRxDbm: -32.54,
          opticalStatus: 'critical',
          pppoeStatus: 'offline',
          chatMessages: [
            ...state.chatMessages,
            {
              id: `cmsg_sys_${Date.now()}`,
              sender: 'system',
              senderName: 'SmartOLT System',
              text: 'SMARTOLT ALARM: Optical RX loss detected at -32.54 dBm. LOS Red alert active.',
              timestamp: 'Just now',
              status: 'read',
            },
          ],
        }));
      },

      simulateRestoreLink: () => {
        set((state) => ({
          opticalRxDbm: -19.24,
          opticalStatus: 'nominal',
          pppoeStatus: 'online',
          chatMessages: [
            ...state.chatMessages,
            {
              id: `cmsg_sys_${Date.now()}`,
              sender: 'system',
              senderName: 'SmartOLT System',
              text: 'SMARTOLT RESTORED: Optical RX recovered to nominal -19.24 dBm. Link online at full 50 Mbps.',
              timestamp: 'Just now',
              status: 'read',
            },
          ],
          isCsatModalOpen: true,
        }));
      },

      submitCsatRating: (rating, feedback) => {
        set((state) => ({
          isCsatModalOpen: false,
          chatMessages: [
            ...state.chatMessages,
            {
              id: `cmsg_csat_${Date.now()}`,
              sender: 'customer',
              senderName: 'Ali Hassan',
              text: `Submitted ⭐ ${rating}/5 CSAT Rating: "${feedback || 'Excellent service!'}"`,
              timestamp: 'Just now',
              status: 'read',
            },
            {
              id: `cmsg_csat_ack_${Date.now() + 1}`,
              sender: 'system',
              senderName: 'Prime One',
              text: 'Thank you for your feedback! Your rating has been logged in our quality assurance records.',
              timestamp: 'Just now',
              status: 'read',
            },
          ],
        }));
      },
    }),
    {
      name: 'prime_one_customer_portal',
    }
  )
);
