export interface MockAuditLog {
  id: string;
  timestamp: string;
  tenantSlug: string;
  tenantName: string;
  actor: string;
  actorRole: string;
  action:
    | 'TENANT_PROVISIONED'
    | 'PLAN_UPGRADED'
    | 'IMPERSONATION_STARTED'
    | 'RLS_SCHEMA_MIGRATED'
    | 'BRANCH_CREATED'
    | 'SUPER_ADMIN_LOGIN'
    | 'SECURITY_CONFIG_UPDATED';
  details: string;
  ipAddress: string;
  sha256Hash: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export const mockAuditLogs: MockAuditLog[] = [
  {
    id: 'aud_01',
    timestamp: '2026-08-25 04:32:10',
    tenantSlug: 'speedlink-khi',
    tenantName: 'SpeedLink Gigabit',
    actor: 'Platform Root (Super-Admin)',
    actorRole: 'SUPER_ADMIN',
    action: 'TENANT_PROVISIONED',
    details: 'Allocated isolated schema tenant_speedlink and provisioned Growth Tier.',
    ipAddress: '182.180.120.45',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'SUCCESS',
  },
  {
    id: 'aud_02',
    timestamp: '2026-08-25 03:15:44',
    tenantSlug: 'optinet-isb',
    tenantName: 'OptiNet Communications',
    actor: 'Zainab Tariq (CEO)',
    actorRole: 'COMPANY_OWNER',
    action: 'PLAN_UPGRADED',
    details: 'Upgraded tenant tier from Growth to Enterprise (14 branches unlocked).',
    ipAddress: '39.40.12.88',
    sha256Hash: 'a8b1c23498fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852c912',
    status: 'SUCCESS',
  },
  {
    id: 'aud_03',
    timestamp: '2026-08-25 01:45:22',
    tenantSlug: 'prime-networks',
    tenantName: 'Prime Networks (Pvt) Ltd',
    actor: 'Platform Root (Super-Admin)',
    actorRole: 'SUPER_ADMIN',
    action: 'IMPERSONATION_STARTED',
    details: 'Impersonation session initiated for Prime Desk telemetry review.',
    ipAddress: '182.180.120.45',
    sha256Hash: 'f4c2d33498fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852a410',
    status: 'SUCCESS',
  },
  {
    id: 'aud_04',
    timestamp: '2026-08-24 22:00:00',
    tenantSlug: 'GLOBAL',
    tenantName: 'Platform Global Cluster',
    actor: 'System Cron Worker',
    actorRole: 'SYSTEM',
    action: 'RLS_SCHEMA_MIGRATED',
    details: 'PostgreSQL WAL snapshot verified for all 14 active tenant schemas.',
    ipAddress: '127.0.0.1',
    sha256Hash: 'b5a3e11498fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852e773',
    status: 'SUCCESS',
  },
];
