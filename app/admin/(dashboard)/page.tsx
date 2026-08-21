import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { getDashboardStats } from "@/lib/repositories/dashboard";
import { getRecentLeads } from "@/lib/repositories/leads";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };

export default async function AdminDashboardPage() {
  const [stats, leads] = await Promise.all([getDashboardStats(), getRecentLeads(6)]);

  const cards = [
    { label: "Total Projects", value: stats.totalProjects },
    { label: "Published Projects", value: stats.publishedProjects },
    { label: "Draft Projects", value: stats.draftProjects },
    { label: "Pending Reviews", value: stats.pendingReview },
    { label: "New Leads", value: stats.newLeads },
    { label: "Consultation Requests", value: stats.consultationLeads },
    { label: "Testimonials", value: stats.testimonials },
    { label: "Before & After Projects", value: stats.beforeAfterProjects },
  ];

  const quickActions = [
    { label: "Add Project", href: "/admin/projects/new" },
    { label: "Add Category / Service", href: "/admin/categories/new" },
    { label: "View Leads", href: "/admin/leads" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your site's content and leads." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="border border-gray-200 bg-white p-5">
            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-md bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800"
          >
            {action.label}
          </Link>
        ))}
      </div>

      <div className="mt-10 border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">Recent Leads</h2>
        </div>
        <ul className="divide-y divide-gray-100">
          {leads.length === 0 && (
            <li className="px-5 py-8 text-center text-sm text-gray-400">No leads yet.</li>
          )}
          {leads.map((lead) => (
            <li key={lead.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                <p className="truncate text-xs text-gray-500">{lead.message ?? lead.projectType ?? "—"}</p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {lead.type === "CONSULTATION" ? "Consultation" : "Enquiry"}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-200 px-5 py-3">
          <Link href="/admin/leads" className="text-xs font-medium text-gray-600 hover:text-gray-900">
            View all →
          </Link>
        </div>
      </div>
    </div>
  );
}
