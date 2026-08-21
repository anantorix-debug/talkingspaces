import { z } from "zod";
import { ContentStatus } from "@prisma/client";
import { optionalInt } from "@/lib/validation/helpers";

export const testimonialSchema = z.object({
  name: z.string().min(2, "Name is required"),
  location: z.string().optional(),
  content: z.string().min(5, "Content is required"),
  image: z.string().optional(),
  status: z.nativeEnum(ContentStatus),
  sortOrder: optionalInt.default(0),
});

export type TestimonialInput = z.output<typeof testimonialSchema>;
export type TestimonialFormValues = z.input<typeof testimonialSchema>;
