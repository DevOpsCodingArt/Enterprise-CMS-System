export interface MockSupervisorAgent {
  id: string;
  name: string;
  status: 'In Chat' | 'Online' | 'In Field' | 'Offline';
  activeChats: number;
  branch: string;
  avgResponse: string;
  csat: string;
}

export const mockSupervisorAgents: MockSupervisorAgent[] = [
  {
    id: 'a1',
    name: 'Eng. Moiz (NOC Lead)',
    status: 'In Chat',
    activeChats: 3,
    branch: 'ISB-F10',
    avgResponse: '28s',
    csat: '4.9 ★',
  },
  {
    id: 'a2',
    name: 'Bilal Ahmed',
    status: 'In Chat',
    activeChats: 2,
    branch: 'ISB-G11',
    avgResponse: '45s',
    csat: '4.8 ★',
  },
  {
    id: 'a3',
    name: 'Fatima Noor',
    status: 'Online',
    activeChats: 0,
    branch: 'ISB-BLUE',
    avgResponse: '32s',
    csat: '5.0 ★',
  },
  {
    id: 'a4',
    name: 'Eng. Imran Khan',
    status: 'In Field',
    activeChats: 1,
    branch: 'ISB-F10',
    avgResponse: '1m 12s',
    csat: '4.7 ★',
  },
];
