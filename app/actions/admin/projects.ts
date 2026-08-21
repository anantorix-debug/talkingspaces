"use server";

import { revalidatePath } from "next/cache";
import { ContentStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { assertStatusTransition } from "@/lib/workflow";
import { projectSchema, type ProjectInput } from "@/lib/validation/project";
import { deleteStoredImages } from "@/lib/image-cleanup";

export type ProjectActionResult = { success: true; id: string } | { success: false; error: string };

export async function createProject(input: ProjectInput): Promise<ProjectActionResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };
  requireRole(session.user.role, "create", "project");

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const status = session.user.role === "EDITOR" ? ContentStatus.DRAFT : parsed.data.status;

  try {
    const project = await prisma.project.create({
      data: {
        ...parsed.data,
        status,
        createdById: session.user.id,
      },
    });
    revalidatePath("/admin/projects");
    return { success: true, id: project.id };
  } catch {
    return { success: false, error: "Could not save project — check the slug is unique." };
  }
}

export async function updateProject(id: string, input: ProjectInput): Promise<ProjectActionResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };
  requireRole(session.user.role, "edit", "project");

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return { success: false, error: "Project not found" };

  try {
    assertStatusTransition(session.user.role, existing.status, parsed.data.status);
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }

  try {
    await prisma.project.update({ where: { id }, data: parsed.data });
    await deleteStoredImages(
      [
        [existing.imageUrl, parsed.data.imageUrl],
        [existing.beforeImage, parsed.data.beforeImage],
        [existing.afterImage, parsed.data.afterImage],
      ]
        .filter(([oldUrl, newUrl]) => oldUrl && oldUrl !== newUrl)
        .map(([oldUrl]) => oldUrl),
    );
    revalidatePath("/admin/projects");
    revalidatePath(`/portfolio/${parsed.data.slug}`);
    return { success: true, id };
  } catch {
    return { success: false, error: "Could not save project — check the slug is unique." };
  }
}

export async function deleteProject(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  requireRole(session.user.role, "delete", "project");

  const existing = await prisma.project.findUnique({ where: { id } });
  await prisma.project.delete({ where: { id } });
  if (existing) {
    await deleteStoredImages([existing.imageUrl, existing.beforeImage, existing.afterImage]);
  }
  revalidatePath("/admin/projects");
}
