import type { Metadata } from "next";
import { auth } from "@/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Add Testimonial", robots: { index: false } };

export default async function NewTestimonialPage() {
  const session = await auth();
  return (
    <div>
      <PageHeader title="Add Testimonial" />
      <TestimonialForm role={session!.user.role} />
    </div>
  );
}
