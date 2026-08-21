"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import type { Role as RoleModel } from "@prisma/client";
import { createUserSchema, updateUserSchema } from "@/lib/validation/user";
import { createUser, updateUser } from "@/app/actions/admin/users";
import { FormField, inputClass } from "@/components/admin/FormControls";
import { useToast } from "@/components/admin/ToastProvider";

type FormValues = {
  name: string;
  email: string;
  password: string;
  roleId: number;
  active: boolean;
};

export function UserForm({
  roles,
  userId,
  defaultValues,
}: {
  roles: RoleModel[];
  userId?: string;
  defaultValues?: Partial<FormValues>;
}) {
  const router = useRouter();
  const toast = useToast();
  const isEdit = Boolean(userId);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: "", email: "", password: "", roleId: roles[0]?.id, active: true, ...defaultValues },
  });

  async function onSubmit(data: FormValues) {
    const schema = isEdit ? updateUserSchema : createUserSchema;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    const result = isEdit
      ? await updateUser(userId!, parsed.data as z.infer<typeof updateUserSchema>)
      : await createUser(parsed.data as z.infer<typeof createUserSchema>);

    if (result.success) {
      toast.success(isEdit ? "User updated" : "User created");
      router.push("/admin/users");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6" noValidate>
      <FormField label="Name" htmlFor="name">
        <input id="name" className={inputClass} {...register("name")} />
      </FormField>
      <FormField label="Email" htmlFor="email">
        <input id="email" type="email" className={inputClass} {...register("email")} />
      </FormField>
      <FormField label={isEdit ? "New Password (leave blank to keep current)" : "Password"} htmlFor="password">
        <input id="password" type="password" className={inputClass} {...register("password")} />
      </FormField>
      <FormField label="Role" htmlFor="roleId">
        <select id="roleId" className={inputClass} {...register("roleId")}>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name.replace("_", " ")}
            </option>
          ))}
        </select>
      </FormField>

      {isEdit && (
        <div className="flex items-center gap-2">
          <input id="active" type="checkbox" {...register("active")} className="h-4 w-4" />
          <label htmlFor="active" className="text-sm text-gray-700">
            Active
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-teal-dark px-5 py-2.5 text-sm font-medium text-white hover:bg-teal disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save User"}
      </button>
    </form>
  );
}
