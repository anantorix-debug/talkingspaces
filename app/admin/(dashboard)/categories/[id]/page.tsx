import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getCategoryByIdAdmin } from "@/lib/repositories/projects";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit Category", robots: { index: false } };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [session, category] = await Promise.all([auth(), getCategoryByIdAdmin(Number(id))]);

  if (!category) notFound();

  return (
    <div>
      <PageHeader title={`Edit — ${category.name}`} />
      <CategoryForm
        role={session!.user.role}
        categoryId={category.id}
        currentStatus={category.status}
        defaultValues={{
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          status: category.status,
          sortOrder: category.sortOrder,
          serviceShortDescription: category.service?.shortDescription ?? "",
          serviceDescription: category.service?.description ?? "",
          serviceHeroImage: category.service?.heroImage ?? "",
        }}
      />
    </div>
  );
}
