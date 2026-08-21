import { z } from "zod";

export const consultationSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  email: z.string().email().optional().or(z.literal("")),
  location: z.string().optional(),
  message: z.string().optional(),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;
