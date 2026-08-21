"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { consultationSchema, type ConsultationInput } from "@/lib/validation/consultation";
import { submitConsultationRequest } from "@/app/actions/consultation";

const inputClass =
  "w-full border border-charcoal/20 bg-paper px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-charcoal focus:outline-none";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal/70";

export function ConsultationForm({ onSuccess }: { onSuccess?: () => void }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsultationInput>({ resolver: zodResolver(consultationSchema) });

  async function onSubmit(data: ConsultationInput) {
    setStatus("submitting");
    const result = await submitConsultationRequest(data);
    if (result.success) {
      setStatus("success");
      reset();
      onSuccess?.();
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm text-charcoal">
        Thank you — we&apos;ve received your request and will be in touch shortly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input id="name" className={inputClass} {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone
        </label>
        <input id="phone" className={inputClass} {...register("phone")} />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input id="email" type="email" className={inputClass} {...register("email")} />
      </div>
      <div>
        <label htmlFor="location" className={labelClass}>
          Location
        </label>
        <input id="location" className={inputClass} {...register("location")} />
      </div>
      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea id="message" rows={4} className={inputClass} {...register("message")} />
      </div>

      {status === "error" && (
        <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-teal-dark px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-paper transition-colors hover:bg-teal disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting..." : "Request a Consultation"}
      </button>
    </form>
  );
}
