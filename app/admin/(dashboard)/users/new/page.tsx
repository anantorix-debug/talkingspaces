import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { UserForm } from "@/components/admin/UserForm";
import { getAllRoles } from "@/lib/repositories/users";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Add User", robots: { index: false } };

export default async function NewUserPage() {
  const session = await auth();
  if (session!.user.role !== "MASTER_ADMIN") redirect("/admin");

  const roles = await getAllRoles();

  return (
    <div>
      <PageHeader title="Add User" />
      <UserForm roles={roles} />
    </div>
  );
}
