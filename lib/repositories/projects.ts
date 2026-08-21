import { prisma } from "@/lib/prisma";
import { ContentStatus } from "@prisma/client";

export function getFeaturedProjects(limit = 4) {
  return prisma.project.findMany({
    where: { status: ContentStatus.PUBLISHED, featured: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
}

export function getPublishedProjects(limit?: number) {
  return prisma.project.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
}

export function getProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: { slug, status: ContentStatus.PUBLISHED },
  });
}

// Before & After is merged into Project (same pattern as Category/Service) —
// a project appears here once both images are set, no separate model.
export function getPublishedProjectsWithBeforeAfter() {
  return prisma.project.findMany({
    where: { status: ContentStatus.PUBLISHED, beforeImage: { not: null }, afterImage: { not: null } },
    orderBy: { sortOrder: "asc" },
  });
}

export function getPublishedCategories() {
  return prisma.projectCategory.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: { sortOrder: "asc" },
  });
}

// --- Admin (all statuses) ---------------------------------------------------

export function getAllProjectsAdmin() {
  return prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

export function getProjectByIdAdmin(id: string) {
  return prisma.project.findUnique({
    where: { id },
  });
}

export function getAllCategoriesAdmin() {
  return prisma.projectCategory.findMany({ orderBy: { sortOrder: "asc" }, include: { service: true } });
}

export function getCategoryByIdAdmin(id: number) {
  return prisma.projectCategory.findUnique({ where: { id }, include: { service: true } });
}
