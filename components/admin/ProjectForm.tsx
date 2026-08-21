"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ContentStatus } from "@prisma/client";
import { projectSchema, type ProjectInput, type ProjectFormValues } from "@/lib/validation/project";
import { allowedNextStatuses } from "@/lib/workflow";
import type { Role } from "@/lib/permissions";
import { createProject, updateProject } from "@/app/actions/admin/projects";
import { FormField, inputClass } from "@/components/admin/FormControls";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { useToast } from "@/components/admin/ToastProvider";

export function ProjectForm({
  role,
  defaultValues,
  projectId,
  currentStatus,
}: {
  role: Role;
  defaultValues?: Partial<ProjectInput>;
  projectId?: string;
  currentStatus?: ContentStatus;
}) {
  const router = useRouter();
  const toast = useToast();
  const isEdit = Boolean(projectId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues, unknown, ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      slug: "",
      shortDescription: "",
      description: "",
      featured: false,
      status: "DRAFT",
      sortOrder: 0,
      ...defaultValues,
    },
  });

  const statusOptions = allowedNextStatuses(role, currentStatus ?? "DRAFT");

  async function onSubmit(data: ProjectInput) {
    const result = isEdit ? await updateProject(projectId!, data) : await createProject(data);
    if (result.success) {
      toast.success(isEdit ? "Project updated" : "Project created");
      router.push("/admin/projects");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label="Title" htmlFor="title" error={errors.title?.message}>
          <input id="title" className={inputClass} {...register("title")} />
        </FormField>
        <FormField label="Slug" htmlFor="slug" error={errors.slug?.message} hint="lowercase-with-hyphens">
          <input id="slug" className={inputClass} {...register("slug")} />
        </FormField>

        <FormField label="Location" htmlFor="location" error={errors.location?.message}>
          <input id="location" className={inputClass} {...register("location")} />
        </FormField>

        <FormField label="Year" htmlFor="year" error={errors.year?.message}>
          <input id="year" type="number" className={inputClass} {...register("year")} />
        </FormField>
        <FormField label="Sort Order" htmlFor="sortOrder" error={errors.sortOrder?.message}>
          <input id="sortOrder" type="number" className={inputClass} {...register("sortOrder")} />
        </FormField>
      </div>

      <FormField label="Short Description" htmlFor="shortDescription" error={errors.shortDescription?.message}>
        <textarea id="shortDescription" rows={2} className={inputClass} {...register("shortDescription")} />
      </FormField>

      <FormField label="Full Description" htmlFor="description" error={errors.description?.message}>
        <textarea id="description" rows={6} className={inputClass} {...register("description")} />
      </FormField>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <FormField label="Status" htmlFor="status" error={errors.status?.message}>
          <select id="status" className={inputClass} {...register("status")}>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </FormField>
        <div className="flex items-center gap-2 pt-6">
          <input id="featured" type="checkbox" {...register("featured")} className="h-4 w-4" />
          <label htmlFor="featured" className="text-sm text-gray-700">
            Featured on homepage
          </label>
        </div>
      </div>

      <Controller
        name="imageUrl"
        control={control}
        render={({ field }) => (
          <ImagePicker label="Image" value={field.value ?? ""} onChange={field.onChange} />
        )}
      />

      <div className="border-t border-gray-200 pt-6">
        <h3 className="mb-1 text-sm font-semibold text-gray-900">Before &amp; After</h3>
        <p className="mb-4 text-xs text-gray-500">
          Optional — set both images to show this project on the public Before &amp; After page.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Controller
            name="beforeImage"
            control={control}
            render={({ field }) => (
              <ImagePicker label="Before Image" value={field.value ?? ""} onChange={field.onChange} />
            )}
          />
          <Controller
            name="afterImage"
            control={control}
            render={({ field }) => (
              <ImagePicker label="After Image" value={field.value ?? ""} onChange={field.onChange} />
            )}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-teal-dark px-5 py-2.5 text-sm font-medium text-white hover:bg-teal disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Project"}
        </button>
      </div>
    </form>
  );
}
