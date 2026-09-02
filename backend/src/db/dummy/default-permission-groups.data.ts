export interface DefaultPermissionGroupPreset {
  name: string;
  description: string;
  isDefault: boolean;
}

export const DEFAULT_PERMISSION_GROUPS: DefaultPermissionGroupPreset[] = [
  {
    name: 'Executive Super Administrator',
    description:
      'Complete administrative governance over all ISP operations and tenant settings',
    isDefault: true,
  },
  {
    name: 'Helpdesk & Customer Support CSR',
    description: 'Live chat inbox, subscriber CRM, and ticket management',
    isDefault: true,
  },
  {
    name: 'NOC & Network Operations Engineer',
    description: 'OLT/PON telemetry, MikroTik sessions, and fiber monitoring',
    isDefault: true,
  },
  {
    name: 'Field Operations Technician',
    description: 'On-site fiber repairs, ONT replacements, and field tickets',
    isDefault: true,
  },
  {
    name: 'Billing & Accounts Officer',
    description:
      'Customer recharge approvals, ledger verification, and package management',
    isDefault: true,
  },
];
