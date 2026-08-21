import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { auth } from "@/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { can } from "@/lib/permissions";
import { getAllCategoriesAdmin } from "@/lib/repositories/projects";
import { deleteCategory } from "@/app/actions/admin/categories";
import type { ProjectCategory, Service } from "@prisma/client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Categories & Services", robots: { index: false } };

type Row = ProjectCategory & { service: Service | null };

export default async function AdminCategoriesPage() {
  const [session, categories] = await Promise.all([auth(), getAllCategoriesAdmin()]);
  const role = session!.user.role;
  const canDelete = can(role, "delete", "category");

  const columns: Column<Row>[] = [
    { header: "Name", render: (c) => <span className="font-medium text-gray-900">{c.name}</span> },
    { header: "Slug", render: (c) => c.slug },
    { header: "Service Page", render: (c) => (c.service ? "Configured" : "Portfolio only") },
    { header: "Status", render: (c) => <StatusBadge status={c.status} /> },
    {
      header: "",
      className: "text-right",
      render: (c) => (
        <div className="flex justify-end gap-3">
          <Link href={`/admin/categories/${c.id}`} className="text-gray-500 hover:text-gray-900" aria-label="Edit">
            <Pencil size={16} />
          </Link>
          {canDelete && (
            <DeleteButton action={deleteCategory.bind(null, c.id)} confirmMessage={`Delete "${c.name}"?`} />
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Categories & Services"
        description="Add service content to a category to publish its public Our Services page. Categories also power the Before & After filter."
        actions={
          <Link href="/admin/categories/new" className="rounded-md bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800">
            Add Category
          </Link>
        }
      />
      <DataTable columns={columns} rows={categories} emptyMessage="No categories yet." />
    </div>
  );
}
