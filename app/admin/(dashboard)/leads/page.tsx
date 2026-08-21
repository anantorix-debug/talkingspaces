import type { Metadata } from "next";
import { auth } from "@/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { NotesField } from "@/components/admin/NotesField";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { can } from "@/lib/permissions";
import { getAllLeads } from "@/lib/repositories/leads";
import { updateLeadStatus, updateLeadNotes, removeLead } from "@/app/actions/admin/leads";
import { CONSULTATION_BUDGET_OPTIONS } from "@/lib/constants";
import type { Lead } from "@prisma/client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Leads", robots: { index: false } };

function budgetLabel(value: string | null) {
  if (!value) return "—";
  return CONSULTATION_BUDGET_OPTIONS.find((b) => b.value === value)?.label ?? value;
}

export default async function AdminLeadsPage() {
  const [session, leads] = await Promise.all([auth(), getAllLeads()]);
  const canEdit = can(session!.user.role, "edit", "lead");
  const canDelete = can(session!.user.role, "delete", "lead");

  const columns: Column<Lead>[] = [
    {
      header: "Type",
      render: (l) => (
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {l.type === "CONSULTATION" ? "Consultation" : "Enquiry"}
        </span>
      ),
    },
    {
      header: "Contact",
      render: (l) => (
        <div>
          <p className="font-medium text-gray-900">{l.name}</p>
          <p className="text-xs text-gray-500">{l.phone}</p>
          {l.email && <p className="text-xs text-gray-500">{l.email}</p>}
        </div>
      ),
    },
    {
      header: "Details",
      className: "max-w-xs",
      render: (l) =>
        l.type === "CONSULTATION" ? (
          <span>
            {l.projectType ?? "—"} · {l.location ?? "—"} · {budgetLabel(l.budget)}
          </span>
        ) : (
          l.message ?? "—"
        ),
    },
    { header: "Received", render: (l) => l.createdAt.toLocaleDateString() },
    {
      header: "Status",
      render: (l) =>
        canEdit ? (
          <LeadStatusSelect status={l.status} onChange={updateLeadStatus.bind(null, l.id)} />
        ) : (
          l.status
        ),
    },
    {
      header: "Notes",
      render: (l) =>
        canEdit ? (
          <NotesField defaultValue={l.notes ?? ""} onSave={updateLeadNotes.bind(null, l.id)} />
        ) : (
          l.notes ?? "—"
        ),
    },
    ...(canDelete
      ? [
          {
            header: "",
            render: (l: Lead) => (
              <DeleteButton
                action={removeLead.bind(null, l.id)}
                confirmMessage={`Delete this lead from ${l.name}?`}
              />
            ),
          } satisfies Column<Lead>,
        ]
      : []),
  ];

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Every client request — contact form enquiries and consultation requests — in one place."
      />
      <DataTable columns={columns} rows={leads} emptyMessage="No leads yet." />
    </div>
  );
}
