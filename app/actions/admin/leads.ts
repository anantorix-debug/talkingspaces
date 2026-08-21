"use server";

import { revalidatePath } from "next/cache";
import type { LeadStatus } from "@prisma/client";
import { auth } from "@/auth";
import { requireRole } from "@/lib/permissions";
import { updateLead, deleteLead } from "@/lib/repositories/leads";

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  requireRole(session.user.role, "edit", "lead");

  await updateLead(id, { status });
  revalidatePath("/admin/leads");
}

export async function updateLeadNotes(id: string, notes: string): Promise<void> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  requireRole(session.user.role, "edit", "lead");

  await updateLead(id, { notes });
  revalidatePath("/admin/leads");
}

export async function removeLead(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  requireRole(session.user.role, "delete", "lead");

  await deleteLead(id);
  revalidatePath("/admin/leads");
}
