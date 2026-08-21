import type { Metadata } from "next";
import { auth } from "@/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Add Category", robots: { index: false } };

export default async function NewCategoryPage() {
  const session = await auth();
  return (
    <div>
      <PageHeader title="Add Category" />
      <CategoryForm role={session!.user.role} />
    </div>
  );
}
