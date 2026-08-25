export interface PermissionCategory {
  id: string;
  companyId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  displayOrder: number;
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string | null;
  isSystem: boolean;
}

export interface PermissionGroup {
  id: string;
  companyId: string;
  name: string;
  description?: string | null;
  isDefault: boolean;
  userCount?: number;
  permissions?: string[]; // array of permission slugs
  createdAt: string;
  updatedAt: string;
}

export interface PermissionMatrixCategory {
  categoryName: string;
  categorySlug: string;
  permissions: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    granted: boolean;
  }>;
}
