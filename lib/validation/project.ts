import { z } from "zod";
import { ContentStatus } from "@prisma/client";
import { optionalInt } from "@/lib/validation/helpers";

export const projectSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers, and hyphens"),
  imageUrl: z.string().optional(),
  location: z.string().optional(),
  year: optionalInt.nullable(),
  shortDescription: z.string().min(5, "Short description is required"),
  description: z.string().min(5, "Description is required"),
  featured: z.boolean().default(false),
  beforeImage: z.string().optional(),
  afterImage: z.string().optional(),
  status: z.nativeEnum(ContentStatus),
  sortOrder: optionalInt.default(0),
});

export type ProjectInput = z.output<typeof projectSchema>;
export type ProjectFormValues = z.input<typeof projectSchema>;
