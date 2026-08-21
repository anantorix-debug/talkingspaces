import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { getTestimonialByIdAdmin } from "@/lib/repositories/testimonials";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit Testimonial", robots: { index: false } };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [session, testimonial] = await Promise.all([auth(), getTestimonialByIdAdmin(id)]);

  if (!testimonial) notFound();

  return (
    <div>
      <PageHeader title={`Edit — ${testimonial.name}`} />
      <TestimonialForm
        role={session!.user.role}
        testimonialId={testimonial.id}
        currentStatus={testimonial.status}
        defaultValues={{
          name: testimonial.name,
          location: testimonial.location ?? "",
          content: testimonial.content,
          image: testimonial.image ?? "",
          status: testimonial.status,
          sortOrder: testimonial.sortOrder,
        }}
      />
    </div>
  );
}
