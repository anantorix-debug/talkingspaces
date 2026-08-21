import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Settings", robots: { index: false } };

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Manage your own account." />
      <div className="max-w-xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-gray-900">Change Password</h2>
        <p className="mt-1 text-sm text-gray-500">
          Update the password you use to sign in to the admin panel.
        </p>
        <div className="mt-6">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
