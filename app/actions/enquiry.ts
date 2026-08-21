"use server";

import { prisma } from "@/lib/prisma";
import { enquirySchema, type EnquiryInput } from "@/lib/validation/enquiry";

export type EnquiryActionResult = { success: true } | { success: false; error: string };

export async function submitEnquiry(input: EnquiryInput): Promise<EnquiryActionResult> {
  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.lead.create({
    data: {
      type: "ENQUIRY",
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      message: parsed.data.message,
      source: parsed.data.source || "contact_page",
    },
  });

  return { success: true };
}
