"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema, changePasswordSchema, type ChangePasswordInput } from "@/lib/validation/auth";

export async function signOutAction() {
  await signOut({ redirectTo: "/admin/login" });
}

export type LoginActionState = { error?: string } | undefined;

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Please enter a valid email and password." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}

export type ChangePasswordResult = { success: true } | { success: false; error: string };

export async function changeOwnPassword(input: ChangePasswordInput): Promise<ChangePasswordResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { success: false, error: "User not found" };

  const validCurrent = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!validCurrent) return { success: false, error: "Current password is incorrect." };

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return { success: true };
}
