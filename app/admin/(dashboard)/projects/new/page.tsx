import type { Metadata } from "next";
import { auth } from "@/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Add Project", robots: { index: false } };

export default async function NewProjectPage() {
  const session = await auth();

  return (
    <div>
      <PageHeader title="Add Project" />
      <ProjectForm role={session!.user.role} />
    </div>
  );
}
