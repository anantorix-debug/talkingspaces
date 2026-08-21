import { prisma } from "@/lib/prisma";
import { ContentStatus } from "@prisma/client";

/**
 * "Services" are the public-facing service pages, backed by a Category (parent)
 * + its optional Service content (child, 1:1). The category's own status governs
 * visibility for both — callers only ever see the flat shape below.
 */
export type PublicServiceData = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  heroImage: string | null;
};

function toPublicService(category: {
  name: string;
  slug: string;
  service: { id: string; shortDescription: string; description: string; heroImage: string | null } | null;
}): PublicServiceData | null {
  if (!category.service) return null;
  return {
    id: category.service.id,
    title: category.name,
    slug: category.slug,
    shortDescription: category.service.shortDescription,
    description: category.service.description,
    heroImage: category.service.heroImage,
  };
}

export async function getPublishedServices(): Promise<PublicServiceData[]> {
  const categories = await prisma.projectCategory.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: { sortOrder: "asc" },
    include: { service: true },
  });
  return categories.map(toPublicService).filter((s): s is PublicServiceData => s !== null);
}

export async function getServiceBySlug(slug: string): Promise<PublicServiceData | null> {
  const category = await prisma.projectCategory.findFirst({
    where: { slug, status: ContentStatus.PUBLISHED },
    include: { service: true },
  });
  return category ? toPublicService(category) : null;
}
