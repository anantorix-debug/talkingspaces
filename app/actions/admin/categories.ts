"use server";

import { revalidatePath } from "next/cache";
import { ContentStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { assertStatusTransition } from "@/lib/workflow";
import { categorySchema, type CategoryInput } from "@/lib/validation/category";
import { deleteStoredImages } from "@/lib/image-cleanup";

export type CategoryActionResult = { success: true; id: number } | { success: false; error: string };

function splitInput(input: CategoryInput) {
  const { serviceShortDescription, serviceDescription, serviceHeroImage, ...category } = input;
  const hasServiceContent = Boolean(serviceShortDescription && serviceDescription);
  return {
    category,
    service: hasServiceContent
      ? {
          shortDescription: serviceShortDescription!,
          description: serviceDescription!,
          heroImage: serviceHeroImage || null,
        }
      : null,
  };
}

export async function createCategory(input: CategoryInput): Promise<CategoryActionResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };
  requireRole(session.user.role, "create", "category");

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const status = session.user.role === "EDITOR" ? ContentStatus.DRAFT : parsed.data.status;
  const { category, service } = splitInput(parsed.data);

  try {
    const created = await prisma.projectCategory.create({
      data: {
        ...category,
        status,
        ...(service ? { service: { create: service } } : {}),
      },
    });
    revalidatePath("/admin/categories");
    return { success: true, id: created.id };
  } catch {
    return { success: false, error: "Could not save category — check the slug is unique." };
  }
}

export async function updateCategory(id: number, input: CategoryInput): Promise<CategoryActionResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };
  requireRole(session.user.role, "edit", "category");

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const existing = await prisma.projectCategory.findUnique({ where: { id }, include: { service: true } });
  if (!existing) return { success: false, error: "Category not found" };

  try {
    assertStatusTransition(session.user.role, existing.status, parsed.data.status);
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }

  const { category, service } = splitInput(parsed.data);
  const oldHeroImage = existing.service?.heroImage;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.projectCategory.update({ where: { id }, data: category });
      if (service) {
        await tx.service.upsert({
          where: { categoryId: id },
          update: service,
          create: { ...service, categoryId: id },
        });
      } else {
        await tx.service.deleteMany({ where: { categoryId: id } });
      }
    });
    if (oldHeroImage && oldHeroImage !== service?.heroImage) {
      await deleteStoredImages([oldHeroImage]);
    }
    revalidatePath("/admin/categories");
    revalidatePath(`/services/${parsed.data.slug}`);
    return { success: true, id };
  } catch {
    return { success: false, error: "Could not save category — check the slug is unique." };
  }
}

export async function deleteCategory(id: number): Promise<void> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  requireRole(session.user.role, "delete", "category");

  const existing = await prisma.projectCategory.findUnique({ where: { id }, include: { service: true } });
  if (!existing) return;

  await prisma.projectCategory.delete({ where: { id } });
  if (existing.service?.heroImage) {
    await deleteStoredImages([existing.service.heroImage]);
  }
  revalidatePath("/admin/categories");
}
