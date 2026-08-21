"use client";

import { useTransition } from "react";
import { inputClass } from "@/components/admin/FormControls";

export function NotesField({
  defaultValue,
  onSave,
}: {
  defaultValue: string;
  onSave: (notes: string) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <textarea
      defaultValue={defaultValue}
      disabled={pending}
      rows={2}
      placeholder="Add notes..."
      onBlur={(e) => startTransition(() => onSave(e.target.value))}
      className={`${inputClass} min-w-[200px] text-xs`}
    />
  );
}
