import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal";

export const labelClass = "mb-1.5 block text-xs font-medium text-gray-700";

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
