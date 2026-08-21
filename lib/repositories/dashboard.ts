import { prisma } from "@/lib/prisma";
import { ContentStatus, LeadStatus, LeadType } from "@prisma/client";

export async function getDashboardStats() {
  const [
    totalProjects,
    publishedProjects,
    draftProjects,
    pendingReview,
    newLeads,
    consultationLeads,
    testimonials,
    beforeAfterProjects,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.project.count({ where: { status: ContentStatus.DRAFT } }),
    prisma.project.count({ where: { status: ContentStatus.PENDING_REVIEW } }),
    prisma.lead.count({ where: { status: LeadStatus.NEW } }),
    prisma.lead.count({ where: { type: LeadType.CONSULTATION } }),
    prisma.testimonial.count(),
    prisma.project.count({ where: { beforeImage: { not: null }, afterImage: { not: null } } }),
  ]);

  return {
    totalProjects,
    publishedProjects,
    draftProjects,
    pendingReview,
    newLeads,
    consultationLeads,
    testimonials,
    beforeAfterProjects,
  };
}
