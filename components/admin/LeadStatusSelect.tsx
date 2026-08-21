"use client";

import { useTransition } from "react";
import type { LeadStatus } from "@prisma/client";
import { inputClass } from "@/components/admin/FormControls";

const STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST", "ARCHIVED"];

export function LeadStatusSelect({
  status,
  onChange,
}: {
  status: LeadStatus;
  onChange: (status: LeadStatus) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => startTransition(() => onChange(e.target.value as LeadStatus))}
      className={`${inputClass} w-auto text-xs`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
