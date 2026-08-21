"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, type EnquiryInput } from "@/lib/validation/enquiry";
import { submitEnquiry } from "@/app/actions/enquiry";

const inputClass =
  "w-full border border-charcoal/20 bg-paper px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-charcoal focus:outline-none";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal/70";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryInput>({ resolver: zodResolver(enquirySchema) });

  async function onSubmit(data: EnquiryInput) {
    setStatus("submitting");
    const result = await submitEnquiry({ ...data, source: "contact_page" });
    if (result.success) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm text-charcoal">
        Thank you for reaching out — we&apos;ll get back to you shortly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Name
        </label>
        <input id="contact-name" className={inputClass} {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="contact-phone" className={labelClass}>
          Phone
        </label>
        <input id="contact-phone" className={inputClass} {...register("phone")} />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
      </div>
      <div>
        <label htmlFor="contact-email" className={labelClass}>
          Email
        </label>
        <input id="contact-email" type="email" className={inputClass} {...register("email")} />
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea id="contact-message" rows={5} className={inputClass} {...register("message")} />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
      </div>

      {status === "error" && (
        <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-teal-dark px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-paper transition-colors hover:bg-teal disabled:opacity-50"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
