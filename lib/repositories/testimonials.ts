import { prisma } from "@/lib/prisma";
import { ContentStatus } from "@prisma/client";

export function getPublishedTestimonials(limit?: number) {
  return prisma.testimonial.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
}

// --- Admin (all statuses) ---------------------------------------------------

export function getAllTestimonialsAdmin() {
  return prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
}

export function getTestimonialByIdAdmin(id: string) {
  return prisma.testimonial.findUnique({ where: { id } });
}
