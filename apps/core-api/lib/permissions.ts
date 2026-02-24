import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
} from "better-auth/plugins/admin/access";

/**
 * 360 Feedback Platform - RBAC Permission Definitions
 *
 * Roles: ic (Individual Contributor), tm (Team Manager), hod (Head of Department), admin (CXO/HR Admin)
 * Uses `as const` so TypeScript can infer literal types correctly.
 */

export const statement = {
  ...defaultStatements,
  cycle: ["create", "read", "update", "activate", "publish"],
  selfFeedback: ["write", "read"],
  survey: [
    "submit",
    "read",
    "assign",
    "bulkAssign",
    "fillOnBehalf",
    "reopen",
    "rollback",
  ],
  question: ["read", "create", "update", "import", "toggleActive"],
  employee: ["read", "list", "sync", "updateRole", "updateGroups"],
  result: ["readOwn", "readTeam", "readDepartment", "readOrg"],
  report: ["individual", "department", "org", "csv"],
  notification: ["read", "configure"],
} as const;

export const ac = createAccessControl(statement);

// IC - Individual Contributor: basic self-service access
export const ic = ac.newRole({
  cycle: ["read"],
  selfFeedback: ["write", "read"],
  survey: ["submit", "read"],
  question: ["read"],
  employee: ["read"],
  result: ["readOwn"],
  notification: ["read"],
});

// TM - Team Manager: IC permissions + team visibility
export const tm = ac.newRole({
  cycle: ["read"],
  selfFeedback: ["write", "read"],
  survey: ["submit", "read"],
  question: ["read"],
  employee: ["read", "list"],
  result: ["readOwn", "readTeam"],
  report: ["individual"],
  notification: ["read"],
});

// HOD - Head of Department: TM permissions + department visibility
export const hod = ac.newRole({
  cycle: ["read"],
  selfFeedback: ["write", "read"],
  survey: ["submit", "read"],
  question: ["read"],
  employee: ["read", "list"],
  result: ["readOwn", "readTeam", "readDepartment"],
  report: ["individual", "department"],
  notification: ["read"],
});

// Admin (CXO/HR) - Full access to everything including Better Auth admin actions
export const admin = ac.newRole({
  ...adminAc.statements,
  cycle: ["create", "read", "update", "activate", "publish"],
  selfFeedback: ["write", "read"],
  survey: [
    "submit",
    "read",
    "assign",
    "bulkAssign",
    "fillOnBehalf",
    "reopen",
    "rollback",
  ],
  question: ["read", "create", "update", "import", "toggleActive"],
  employee: ["read", "list", "sync", "updateRole", "updateGroups"],
  result: ["readOwn", "readTeam", "readDepartment", "readOrg"],
  report: ["individual", "department", "org", "csv"],
  notification: ["read", "configure"],
});

export const roles = { admin, hod, tm, ic };
export type Role = keyof typeof roles;
