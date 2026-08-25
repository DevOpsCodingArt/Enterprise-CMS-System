export interface MockQuickReply {
  id: string;
  title: string;
  shortcut: string;
  category: string;
  content: string;
}

export interface MockWorkingDay {
  day: string;
  dayIndex: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export const mockQuickReplies: MockQuickReply[] = [
  {
    id: 'qr_01',
    title: 'SmartOLT Nominal Signal',
    shortcut: '/signal',
    category: 'Diagnostics',
    content: 'SmartOLT diagnostic shows optical signal is normal at -19.2 dBm.',
  },
  {
    id: 'qr_02',
    title: 'Field Engineer Van Dispatch',
    shortcut: '/dispatch',
    category: 'Field Operations',
    content: 'Field Engineer Imran (Van 04) has been dispatched with OTDR splicing meter.',
  },
  {
    id: 'qr_03',
    title: 'Payment Slip Verification',
    shortcut: '/bill',
    category: 'Billing',
    content: 'Payment receipt verified and synced to your ZL Ultra ledger.',
  },
  {
    id: 'qr_04',
    title: 'Router Power Cycle Reboot',
    shortcut: '/reboot',
    category: 'Troubleshooting',
    content: 'Please turn off the power adapter of your router for 30 seconds and turn it back on.',
  },
];

export const mockWorkingHours: MockWorkingDay[] = [
  { day: 'Monday', dayIndex: 1, isOpen: true, openTime: '08:00', closeTime: '22:00' },
  { day: 'Tuesday', dayIndex: 2, isOpen: true, openTime: '08:00', closeTime: '22:00' },
  { day: 'Wednesday', dayIndex: 3, isOpen: true, openTime: '08:00', closeTime: '22:00' },
  { day: 'Thursday', dayIndex: 4, isOpen: true, openTime: '08:00', closeTime: '22:00' },
  { day: 'Friday', dayIndex: 5, isOpen: true, openTime: '08:00', closeTime: '22:00' },
  { day: 'Saturday', dayIndex: 6, isOpen: true, openTime: '09:00', closeTime: '20:00' },
  { day: 'Sunday', dayIndex: 0, isOpen: false, openTime: '10:00', closeTime: '18:00' },
];
