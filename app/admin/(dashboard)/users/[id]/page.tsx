import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { UserForm } from "@/components/admin/UserForm";
import { getUserById, getAllRoles } from "@/lib/repositories/users";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit User", robots: { index: false } };

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session!.user.role !== "MASTER_ADMIN") redirect("/admin");

  const { id } = await params;
  const [user, roles] = await Promise.all([getUserById(id), getAllRoles()]);

  if (!user) notFound();

  return (
    <div>
      <PageHeader title={`Edit — ${user.name}`} />
      <UserForm
        roles={roles}
        userId={user.id}
        defaultValues={{ name: user.name, email: user.email, roleId: user.roleId, active: user.active, password: "" }}
      />
    </div>
  );
}
