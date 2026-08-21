import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(5, "Please add a short message"),
  source: z.string().optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
