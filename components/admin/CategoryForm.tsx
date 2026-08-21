"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ContentStatus } from "@prisma/client";
import { categorySchema, type CategoryInput, type CategoryFormValues } from "@/lib/validation/category";
import { allowedNextStatuses } from "@/lib/workflow";
import type { Role } from "@/lib/permissions";
import { createCategory, updateCategory } from "@/app/actions/admin/categories";
import { FormField, inputClass } from "@/components/admin/FormControls";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { useToast } from "@/components/admin/ToastProvider";

export function CategoryForm({
  role,
  defaultValues,
  categoryId,
  currentStatus,
}: {
  role: Role;
  defaultValues?: Partial<CategoryFormValues>;
  categoryId?: number;
  currentStatus?: ContentStatus;
}) {
  const router = useRouter();
  const toast = useToast();
  const isEdit = Boolean(categoryId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues, unknown, CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      status: "DRAFT",
      sortOrder: 0,
      serviceShortDescription: "",
      serviceDescription: "",
      serviceHeroImage: "",
      ...defaultValues,
    },
  });

  const statusOptions = allowedNextStatuses(role, currentStatus ?? "DRAFT");

  async function onSubmit(data: CategoryInput) {
    const result = isEdit ? await updateCategory(categoryId!, data) : await createCategory(data);
    if (result.success) {
      toast.success(isEdit ? "Category updated" : "Category created");
      router.push("/admin/categories");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-8" noValidate>
      <div>
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Category Details</h3>
        <div className="space-y-6">
          <FormField label="Name" htmlFor="name" error={errors.name?.message}>
            <input id="name" className={inputClass} {...register("name")} />
          </FormField>
          <FormField label="Slug" htmlFor="slug" error={errors.slug?.message} hint="Also used as the /services/[slug] URL">
            <input id="slug" className={inputClass} {...register("slug")} />
          </FormField>
          <FormField label="Description" htmlFor="description" error={errors.description?.message}>
            <textarea id="description" rows={2} className={inputClass} {...register("description")} />
          </FormField>
          <div className="grid grid-cols-2 gap-6">
            <FormField label="Status" htmlFor="status" error={errors.status?.message} hint="Governs visibility of this category's Our Services page and its Before & After filter option">
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
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="mb-1 text-sm font-semibold text-gray-900">Service Page Content</h3>
        <p className="mb-4 text-xs text-gray-500">
          Optional — fill this in to publish a public &quot;Our Services&quot; page for this category.
        </p>
        <div className="space-y-6">
          <FormField label="Short Description" htmlFor="serviceShortDescription" error={errors.serviceShortDescription?.message}>
            <textarea id="serviceShortDescription" rows={2} className={inputClass} {...register("serviceShortDescription")} />
          </FormField>
          <FormField label="Full Description" htmlFor="serviceDescription" error={errors.serviceDescription?.message}>
            <textarea id="serviceDescription" rows={5} className={inputClass} {...register("serviceDescription")} />
          </FormField>
          <Controller
            name="serviceHeroImage"
            control={control}
            render={({ field }) => (
              <ImagePicker label="Hero Image" value={field.value ?? ""} onChange={field.onChange} />
            )}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-teal-dark px-5 py-2.5 text-sm font-medium text-white hover:bg-teal disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Category"}
      </button>
    </form>
  );
}
