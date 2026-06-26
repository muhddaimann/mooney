/**
 * Auth constants
 * --------------
 * Single source of truth for roles, the permissions each role grants, and the
 * shape of an authenticated user. Keeping this declarative (data, not logic)
 * lets the rest of the app stay role-aware by reading from here rather than
 * hard-coding role checks.
 */

/* -------------------------------------------------------------------------- */
/*  Roles                                                                     */
/* -------------------------------------------------------------------------- */

export const Roles = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

/** Human-readable labels for display in the UI. */
export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrator',
  user: 'Member',
};

/* -------------------------------------------------------------------------- */
/*  Permissions                                                               */
/* -------------------------------------------------------------------------- */

export type Permission =
  | 'dashboard:view'
  | 'transactions:view'
  | 'transactions:manage'
  | 'settings:manage'
  | 'users:manage'
  | 'billing:manage';

/** What each role is allowed to do. Admin is a superset of user. */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'dashboard:view',
    'transactions:view',
    'transactions:manage',
    'settings:manage',
    'users:manage',
    'billing:manage',
  ],
  user: ['dashboard:view', 'transactions:view'],
};

/** Whether a role grants a given permission. */
export const roleHasPermission = (role: Role, permission: Permission): boolean =>
  ROLE_PERMISSIONS[role].includes(permission);

/* -------------------------------------------------------------------------- */
/*  Authenticated user                                                        */
/* -------------------------------------------------------------------------- */

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

/**
 * Demo accounts used by the mock sign-in flow. Swap this out for a real auth
 * backend later — the context API stays the same.
 */
export const DEMO_USERS: Record<Role, AuthUser> = {
  admin: { id: 'u_admin', name: 'Ada Admin', email: 'admin@mooney.app', role: 'admin' },
  user: { id: 'u_member', name: 'Sam Member', email: 'member@mooney.app', role: 'user' },
};
