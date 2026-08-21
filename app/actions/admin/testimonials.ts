"use server";

import { revalidatePath } from "next/cache";
import { ContentStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { assertStatusTransition } from "@/lib/workflow";
import { testimonialSchema, type TestimonialInput } from "@/lib/validation/testimonial";
import { deleteStoredImages } from "@/lib/image-cleanup";

export type TestimonialActionResult = { success: true } | { success: false; error: string };

export async function createTestimonial(input: TestimonialInput): Promise<TestimonialActionResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };
  requireRole(session.user.role, "create", "testimonial");

  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const status = session.user.role === "EDITOR" ? ContentStatus.DRAFT : parsed.data.status;

  await prisma.testimonial.create({ data: { ...parsed.data, status } });
  revalidatePath("/admin/testimonials");
  return { success: true };
}

export async function updateTestimonial(id: string, input: TestimonialInput): Promise<TestimonialActionResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };
  requireRole(session.user.role, "edit", "testimonial");

  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) return { success: false, error: "Not found" };

  try {
    assertStatusTransition(session.user.role, existing.status, parsed.data.status);
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }

  await prisma.testimonial.update({ where: { id }, data: parsed.data });
  if (existing.image && existing.image !== parsed.data.image) {
    await deleteStoredImages([existing.image]);
  }
  revalidatePath("/admin/testimonials");
  return { success: true };
}

export async function deleteTestimonial(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  requireRole(session.user.role, "delete", "testimonial");

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  await prisma.testimonial.delete({ where: { id } });
  if (existing?.image) {
    await deleteStoredImages([existing.image]);
  }
  revalidatePath("/admin/testimonials");
}
