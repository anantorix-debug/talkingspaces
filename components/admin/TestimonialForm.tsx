"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ContentStatus } from "@prisma/client";
import { testimonialSchema, type TestimonialInput, type TestimonialFormValues } from "@/lib/validation/testimonial";
import { allowedNextStatuses } from "@/lib/workflow";
import type { Role } from "@/lib/permissions";
import { createTestimonial, updateTestimonial } from "@/app/actions/admin/testimonials";
import { FormField, inputClass } from "@/components/admin/FormControls";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { useToast } from "@/components/admin/ToastProvider";

export function TestimonialForm({
  role,
  defaultValues,
  testimonialId,
  currentStatus,
}: {
  role: Role;
  defaultValues?: Partial<TestimonialInput>;
  testimonialId?: string;
  currentStatus?: ContentStatus;
}) {
  const router = useRouter();
  const toast = useToast();
  const isEdit = Boolean(testimonialId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues, unknown, TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { name: "", location: "", content: "", image: "", status: "DRAFT", sortOrder: 0, ...defaultValues },
  });

  const statusOptions = allowedNextStatuses(role, currentStatus ?? "DRAFT");

  async function onSubmit(data: TestimonialInput) {
    const result = isEdit ? await updateTestimonial(testimonialId!, data) : await createTestimonial(data);
    if (result.success) {
      toast.success(isEdit ? "Testimonial updated" : "Testimonial created");
      router.push("/admin/testimonials");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6" noValidate>
      <FormField label="Name" htmlFor="name" error={errors.name?.message}>
        <input id="name" className={inputClass} {...register("name")} />
      </FormField>
      <FormField label="Location" htmlFor="location" error={errors.location?.message}>
        <input id="location" className={inputClass} {...register("location")} />
      </FormField>
      <FormField label="Content" htmlFor="content" error={errors.content?.message}>
        <textarea id="content" rows={4} className={inputClass} {...register("content")} />
      </FormField>

      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <ImagePicker label="Photo (optional)" value={field.value ?? ""} onChange={field.onChange} />
        )}
      />

      <div className="grid grid-cols-2 gap-6">
        <FormField label="Status" htmlFor="status" error={errors.status?.message}>
          <select id="status" className={inputClass} {...register("status")}>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Sort Order" htmlFor="sortOrder" error={errors.sortOrder?.message}>
          <input id="sortOrder" type="number" className={inputClass} {...register("sortOrder")} />
        </FormField>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-teal-dark px-5 py-2.5 text-sm font-medium text-white hover:bg-teal disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Testimonial"}
      </button>
    </form>
  );
}
