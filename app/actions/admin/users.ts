"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { createUserSchema, updateUserSchema, type CreateUserInput, type UpdateUserInput } from "@/lib/validation/user";

export type UserActionResult = { success: true } | { success: false; error: string };

export async function createUser(input: CreateUserInput): Promise<UserActionResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };
  requireRole(session.user.role, "manage", "user");

  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  try {
    await prisma.user.create({
      data: { name: parsed.data.name, email: parsed.data.email, passwordHash, roleId: parsed.data.roleId },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch {
    return { success: false, error: "A user with this email already exists." };
  }
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<UserActionResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };
  requireRole(session.user.role, "manage", "user");

  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const data: Record<string, unknown> = {
    name: parsed.data.name,
    email: parsed.data.email,
    roleId: parsed.data.roleId,
    active: parsed.data.active,
  };
  if (parsed.data.password) {
    data.passwordHash = await bcrypt.hash(parsed.data.password, 12);
  }

  try {
    await prisma.user.update({ where: { id }, data });
    revalidatePath("/admin/users");
    return { success: true };
  } catch {
    return { success: false, error: "A user with this email already exists." };
  }
}

export async function deleteUser(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  requireRole(session.user.role, "manage", "user");

  if (session.user.id === id) {
    throw new Error("You cannot delete your own account.");
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}
