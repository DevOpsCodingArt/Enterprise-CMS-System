export interface DefaultWorkingHourPreset {
  dayOfWeek: number; // 0=Mon, 6=Sun
  isWorkingDay: boolean;
  startTime: string;
  endTime: string;
  offlineMessage: string;
}

export const DEFAULT_OFFLINE_MESSAGE =
  'Our support team is currently offline. Please leave a message, and our NOC duty officer will respond shortly.';

export const DEFAULT_WORKING_HOURS: DefaultWorkingHourPreset[] = [
  {
    dayOfWeek: 0, // Monday
    isWorkingDay: true,
    startTime: '09:00:00',
    endTime: '18:00:00',
    offlineMessage: DEFAULT_OFFLINE_MESSAGE,
  },
  {
    dayOfWeek: 1, // Tuesday
    isWorkingDay: true,
    startTime: '09:00:00',
    endTime: '18:00:00',
    offlineMessage: DEFAULT_OFFLINE_MESSAGE,
  },
  {
    dayOfWeek: 2, // Wednesday
    isWorkingDay: true,
    startTime: '09:00:00',
    endTime: '18:00:00',
    offlineMessage: DEFAULT_OFFLINE_MESSAGE,
  },
  {
    dayOfWeek: 3, // Thursday
    isWorkingDay: true,
    startTime: '09:00:00',
    endTime: '18:00:00',
    offlineMessage: DEFAULT_OFFLINE_MESSAGE,
  },
  {
    dayOfWeek: 4, // Friday
    isWorkingDay: true,
    startTime: '09:00:00',
    endTime: '18:00:00',
    offlineMessage: DEFAULT_OFFLINE_MESSAGE,
  },
  {
    dayOfWeek: 5, // Saturday
    isWorkingDay: true,
    startTime: '09:00:00',
    endTime: '18:00:00',
    offlineMessage: DEFAULT_OFFLINE_MESSAGE,
  },
  {
    dayOfWeek: 6, // Sunday
    isWorkingDay: false,
    startTime: '09:00:00',
    endTime: '18:00:00',
    offlineMessage: DEFAULT_OFFLINE_MESSAGE,
  },
];
