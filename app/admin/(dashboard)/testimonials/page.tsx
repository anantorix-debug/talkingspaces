import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { auth } from "@/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { can } from "@/lib/permissions";
import { getAllTestimonialsAdmin } from "@/lib/repositories/testimonials";
import { deleteTestimonial } from "@/app/actions/admin/testimonials";
import type { Testimonial } from "@prisma/client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Testimonials", robots: { index: false } };

export default async function AdminTestimonialsPage() {
  const [session, testimonials] = await Promise.all([auth(), getAllTestimonialsAdmin()]);
  const role = session!.user.role;
  const canDelete = can(role, "delete", "testimonial");

  const columns: Column<Testimonial>[] = [
    { header: "Name", render: (t) => <span className="font-medium text-gray-900">{t.name}</span> },
    { header: "Location", render: (t) => t.location ?? "—" },
    { header: "Content", className: "max-w-sm truncate", render: (t) => t.content },
    { header: "Status", render: (t) => <StatusBadge status={t.status} /> },
    {
      header: "",
      className: "text-right",
      render: (t) => (
        <div className="flex justify-end gap-3">
          <Link href={`/admin/testimonials/${t.id}`} className="text-gray-500 hover:text-gray-900" aria-label="Edit">
            <Pencil size={16} />
          </Link>
          {canDelete && <DeleteButton action={deleteTestimonial.bind(null, t.id)} confirmMessage={`Delete testimonial from "${t.name}"?`} />}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Testimonials"
        actions={
          <Link href="/admin/testimonials/new" className="rounded-md bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800">
            Add Testimonial
          </Link>
        }
      />
      <DataTable columns={columns} rows={testimonials} emptyMessage="No testimonials yet." />
    </div>
  );
}
