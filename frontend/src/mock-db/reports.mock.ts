export interface MockOperationalReports {
  totalChatsMonth: number;
  frtSeconds: number;
  mttrMinutes: number;
  csatRating: number;
  positivePercentage: number;
  outcomeBreakdown: {
    resolvedDirectly: number;
    ticketFieldDispatched: number;
    billingRecharged: number;
    unreachableSpam: number;
  };
  branchLeaderboard: {
    branchName: string;
    branchCode: string;
    chatsHandled: number;
    avgFrt: string;
    csat: string;
    status: 'EXCELLENT' | 'GOOD' | 'WARNING';
  }[];
}

export const mockOperationalReports: MockOperationalReports = {
  totalChatsMonth: 3842,
  frtSeconds: 24,
  mttrMinutes: 18.4,
  csatRating: 4.89,
  positivePercentage: 98,
  outcomeBreakdown: {
    resolvedDirectly: 78,
    ticketFieldDispatched: 14,
    billingRecharged: 6,
    unreachableSpam: 2,
  },
  branchLeaderboard: [
    {
      branchName: 'Islamabad F-10 Main Hub',
      branchCode: 'ISB-F10',
      chatsHandled: 1420,
      avgFrt: '22s',
      csat: '4.92 ★',
      status: 'EXCELLENT',
    },
    {
      branchName: 'Blue Area Corporate Core',
      branchCode: 'ISB-BLUE',
      chatsHandled: 1180,
      avgFrt: '19s',
      csat: '4.95 ★',
      status: 'EXCELLENT',
    },
    {
      branchName: 'Rawalpindi Saddar Regional Hub',
      branchCode: 'RWP-SDR',
      chatsHandled: 840,
      avgFrt: '28s',
      csat: '4.81 ★',
      status: 'GOOD',
    },
    {
      branchName: 'Islamabad G-11 Sub-Station',
      branchCode: 'ISB-G11',
      chatsHandled: 402,
      avgFrt: '31s',
      csat: '4.84 ★',
      status: 'GOOD',
    },
  ],
};
