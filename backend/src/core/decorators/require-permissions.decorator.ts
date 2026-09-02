import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator to declare required RBAC permissions for a controller endpoint.
 * Example: `@RequirePermissions('chat.view', 'chat.send')`
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
