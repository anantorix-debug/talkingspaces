import type { ContentStatus } from "@prisma/client";
import type { Role } from "@/lib/permissions";

/**
 * Draft -> Pending Review -> Published, with Unpublished as a reversible end state.
 * EDITOR can only move content into review; publishing/unpublishing is ADMIN+.
 */
export function allowedNextStatuses(role: Role, current: ContentStatus): ContentStatus[] {
  if (role === "EDITOR") {
    if (current === "DRAFT") return ["DRAFT", "PENDING_REVIEW"];
    return [current];
  }

  switch (current) {
    case "DRAFT":
      return ["DRAFT", "PENDING_REVIEW", "PUBLISHED"];
    case "PENDING_REVIEW":
      return ["PENDING_REVIEW", "DRAFT", "PUBLISHED"];
    case "PUBLISHED":
      return ["PUBLISHED", "UNPUBLISHED"];
    case "UNPUBLISHED":
      return ["UNPUBLISHED", "DRAFT", "PUBLISHED"];
    default:
      return [current];
  }
}

export function assertStatusTransition(role: Role, current: ContentStatus, next: ContentStatus): void {
  if (current === next) return;
  if (!allowedNextStatuses(role, current).includes(next)) {
    throw new Error(`Role ${role} cannot move status from ${current} to ${next}`);
  }
}
