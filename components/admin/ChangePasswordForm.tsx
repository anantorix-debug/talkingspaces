"use client";

import { useForm } from "react-hook-form";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validation/auth";
import { changeOwnPassword } from "@/app/actions/admin/auth";
import { FormField, inputClass } from "@/components/admin/FormControls";
import { useToast } from "@/components/admin/ToastProvider";

export function ChangePasswordForm() {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ChangePasswordInput>({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(data: ChangePasswordInput) {
    const parsed = changePasswordSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    const result = await changeOwnPassword(parsed.data);
    if (result.success) {
      toast.success("Password updated");
      reset();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-6" noValidate>
      <FormField label="Current Password" htmlFor="currentPassword">
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          className={inputClass}
          {...register("currentPassword")}
        />
      </FormField>
      <FormField label="New Password" htmlFor="newPassword">
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          className={inputClass}
          {...register("newPassword")}
        />
      </FormField>
      <FormField label="Confirm New Password" htmlFor="confirmPassword">
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className={inputClass}
          {...register("confirmPassword")}
        />
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-teal-dark px-5 py-2.5 text-sm font-medium text-white hover:bg-teal disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Update Password"}
      </button>
    </form>
  );
}
