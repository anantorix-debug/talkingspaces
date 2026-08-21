"use server";

import { prisma } from "@/lib/prisma";
import { consultationSchema, type ConsultationInput } from "@/lib/validation/consultation";

export type ConsultationActionResult = { success: true } | { success: false; error: string };

export async function submitConsultationRequest(
  input: ConsultationInput,
): Promise<ConsultationActionResult> {
  const parsed = consultationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.lead.create({
    data: {
      type: "CONSULTATION",
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      location: parsed.data.location || null,
      message: parsed.data.message || null,
      source: "consultation_dialog",
    },
  });

  return { success: true };
}
