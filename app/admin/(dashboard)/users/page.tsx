import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Pencil } from "lucide-react";
import { auth } from "@/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAllUsers } from "@/lib/repositories/users";
import { deleteUser } from "@/app/actions/admin/users";
import type { User, Role as RoleModel } from "@prisma/client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Users", robots: { index: false } };

type Row = User & { role: RoleModel };

export default async function AdminUsersPage() {
  const session = await auth();
  if (session!.user.role !== "MASTER_ADMIN") redirect("/admin");

  const users = await getAllUsers();

  const columns: Column<Row>[] = [
    {
      header: "Name",
      render: (u) => (
        <div>
          <p className="font-medium text-gray-900">{u.name}</p>
          <p className="text-xs text-gray-500">{u.email}</p>
        </div>
      ),
    },
    { header: "Role", render: (u) => u.role.name.replace("_", " ") },
    {
      header: "Status",
      render: (u) => (
        <span className={u.active ? "text-green-700" : "text-gray-400"}>{u.active ? "Active" : "Inactive"}</span>
      ),
    },
    {
      header: "",
      className: "text-right",
      render: (u) => (
        <div className="flex justify-end gap-3">
          <Link href={`/admin/users/${u.id}`} className="text-gray-500 hover:text-gray-900" aria-label="Edit">
            <Pencil size={16} />
          </Link>
          {u.id !== session!.user.id && (
            <DeleteButton action={deleteUser.bind(null, u.id)} confirmMessage={`Delete user "${u.name}"?`} />
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage admin panel access. Master Admin only."
        actions={
          <Link href="/admin/users/new" className="rounded-md bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800">
            Add User
          </Link>
        }
      />
      <DataTable columns={columns} rows={users} emptyMessage="No users yet." />
    </div>
  );
}
