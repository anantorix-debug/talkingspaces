import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // Defense in depth: proxy.ts already gates /admin/*, but every server-rendered
  // admin page re-checks the session directly rather than trusting the proxy alone.
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <AdminShell role={session.user.role} userName={session.user.name ?? session.user.email ?? "Admin"}>
      {children}
    </AdminShell>
  );
}
