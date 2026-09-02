export interface DefaultSettingPreset {
  key: string;
  value: string;
}

export const DEFAULT_COMPANY_SETTINGS: DefaultSettingPreset[] = [
  { key: 'max_concurrent_chats', value: '5' },
  { key: 'auto_assign_enabled', value: 'true' },
  { key: 'auto_assign_strategy', value: 'round_robin' },
  { key: 'sla_response_minutes', value: '15' },
  { key: 'sla_resolution_hours', value: '4' },
  { key: 'optical_signal_warning_dbm', value: '-25.00' },
  { key: 'optical_signal_critical_dbm', value: '-28.00' },
  { key: 'portal_recharge_enabled', value: 'true' },
  { key: 'pppoe_auto_disconnect_on_expiry', value: 'true' },
];
