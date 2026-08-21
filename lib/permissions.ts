export type Role = "MASTER_ADMIN" | "ADMIN" | "EDITOR";

export type Action = "view" | "create" | "edit" | "publish" | "delete" | "manage";

export type Resource =
  | "project"
  | "category"
  | "testimonial"
  | "lead"
  | "user";

const CONTENT_RESOURCES: Resource[] = ["project", "category", "testimonial"];

const OPERATIONAL_RESOURCES: Resource[] = ["lead"];

const permissionMatrix: Record<Role, Partial<Record<Resource, Action[]>>> = {
  MASTER_ADMIN: Object.fromEntries(
    [...CONTENT_RESOURCES, ...OPERATIONAL_RESOURCES, "user"].map((r) => [
      r,
      ["view", "create", "edit", "publish", "delete", "manage"],
    ]),
  ),
  ADMIN: Object.fromEntries(
    [...CONTENT_RESOURCES, ...OPERATIONAL_RESOURCES].map((r) => [
      r,
      ["view", "create", "edit", "publish", "delete", "manage"],
    ]),
  ),
  EDITOR: {
    ...Object.fromEntries(CONTENT_RESOURCES.map((r) => [r, ["view", "create", "edit"]])),
    lead: ["view"],
  },
};

export function can(role: Role, action: Action, resource: Resource): boolean {
  const allowed = permissionMatrix[role]?.[resource];
  return allowed?.includes(action) ?? false;
}

export function requireRole(role: Role, action: Action, resource: Resource): void {
  if (!can(role, action, resource)) {
    throw new Error(`Forbidden: role ${role} cannot ${action} ${resource}`);
  }
}
