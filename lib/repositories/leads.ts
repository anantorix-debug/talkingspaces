import { prisma } from "@/lib/prisma";
import type { LeadStatus } from "@prisma/client";

export function getAllLeads() {
  return prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
}

export function getRecentLeads(limit = 5) {
  return prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: limit });
}

export function updateLead(id: string, data: { status?: LeadStatus; notes?: string | null }) {
  return prisma.lead.update({ where: { id }, data });
}

export function deleteLead(id: string) {
  return prisma.lead.delete({ where: { id } });
}
