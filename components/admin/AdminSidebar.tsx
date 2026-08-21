"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/permissions";
import {
  LayoutDashboard,
  Building2,
  FolderTree,
  Quote,
  Inbox,
  Users,
} from "lucide-react";

const NAV_SECTIONS: { title: string; items: { label: string; href: string; icon: typeof LayoutDashboard; masterOnly?: boolean }[] }[] = [
  {
    title: "",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      { label: "Projects", href: "/admin/projects", icon: Building2 },
      { label: "Categories & Services", href: "/admin/categories", icon: FolderTree },
      { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
    ],
  },
  {
    title: "Leads",
    items: [{ label: "Leads", href: "/admin/leads", icon: Inbox }],
  },
  {
    title: "System",
    items: [{ label: "Users", href: "/admin/users", icon: Users, masterOnly: true }],
  },
];

export function AdminSidebar({
  role,
  variant = "desktop",
  onNavigate,
}: {
  role: Role;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={
        variant === "desktop"
          ? "hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:sticky lg:top-0 lg:block lg:h-screen lg:overflow-y-auto"
          : "fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto border-r border-gray-200 bg-white"
      }
    >
      <div className="flex h-16 items-center gap-2.5 border-b border-gray-200 px-6">
        <Image
          src="/images/logo/logo-full-teal.png"
          alt="Talking Spaces Interiors"
          width={1134}
          height={1394}
          className="h-11 w-auto"
          unoptimized
        />
        <span className="text-xs font-semibold uppercase tracking-wide text-teal">Admin</span>
      </div>
      <nav className="space-y-6 px-3 py-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title || "root"}>
            {section.title && (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
              {section.items
                .filter((item) => !item.masterOnly || role === "MASTER_ADMIN")
                .map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-teal-dark text-white"
                            : "text-gray-600 hover:bg-teal-light hover:text-teal-dark"
                        }`}
                      >
                        <Icon size={16} strokeWidth={1.75} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
