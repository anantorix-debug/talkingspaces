"use client";

import { useState, type ReactNode } from "react";
import { Menu, LogOut } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/admin/ToastProvider";
import type { Role } from "@/lib/permissions";
import { signOutAction } from "@/app/actions/admin/auth";

export function AdminShell({
  role,
  userName,
  children,
}: {
  role: Role;
  userName: string;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar role={role} />

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <AdminSidebar role={role} variant="mobile" onNavigate={() => setMobileOpen(false)} />
          </>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-8">
            <button
              type="button"
              className="text-gray-600 lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs uppercase tracking-wide text-gray-400">{role.replace("_", " ")}</p>
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </form>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
