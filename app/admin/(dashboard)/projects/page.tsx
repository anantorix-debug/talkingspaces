import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { auth } from "@/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { can } from "@/lib/permissions";
import { getAllProjectsAdmin } from "@/lib/repositories/projects";
import { deleteProject } from "@/app/actions/admin/projects";
import type { Project } from "@prisma/client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Projects", robots: { index: false } };

type Row = Project;

export default async function AdminProjectsPage() {
  const [session, projects] = await Promise.all([auth(), getAllProjectsAdmin()]);
  const role = session!.user.role;
  const canDelete = can(role, "delete", "project");

  const columns: Column<Row>[] = [
    { header: "Title", render: (p) => <span className="font-medium text-gray-900">{p.title}</span> },
    { header: "Location", render: (p) => p.location ?? "—" },
    { header: "Featured", render: (p) => (p.featured ? "Yes" : "—") },
    { header: "Status", render: (p) => <StatusBadge status={p.status} /> },
    {
      header: "",
      className: "text-right",
      render: (p) => (
        <div className="flex justify-end gap-3">
          <Link href={`/admin/projects/${p.id}`} className="text-gray-500 hover:text-gray-900" aria-label="Edit">
            <Pencil size={16} />
          </Link>
          {canDelete && (
            <DeleteButton
              action={deleteProject.bind(null, p.id)}
              confirmMessage={`Delete "${p.title}"? This cannot be undone.`}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage portfolio projects."
        actions={
          <Link
            href="/admin/projects/new"
            className="rounded-md bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800"
          >
            Add Project
          </Link>
        }
      />
      <DataTable columns={columns} rows={projects} emptyMessage="No projects yet." />
    </div>
  );
}
