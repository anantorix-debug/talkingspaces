import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProjectByIdAdmin } from "@/lib/repositories/projects";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit Project", robots: { index: false } };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [session, project] = await Promise.all([auth(), getProjectByIdAdmin(id)]);

  if (!project) notFound();

  return (
    <div>
      <PageHeader title={`Edit — ${project.title}`} />
      <ProjectForm
        role={session!.user.role}
        projectId={project.id}
        currentStatus={project.status}
        defaultValues={{
          title: project.title,
          slug: project.slug,
          imageUrl: project.imageUrl ?? "",
          location: project.location ?? "",
          year: project.year,
          shortDescription: project.shortDescription,
          description: project.description,
          featured: project.featured,
          beforeImage: project.beforeImage ?? "",
          afterImage: project.afterImage ?? "",
          status: project.status,
          sortOrder: project.sortOrder,
        }}
      />
    </div>
  );
}
