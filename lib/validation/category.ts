import { z } from "zod";
import { ContentStatus } from "@prisma/client";
import { optionalInt } from "@/lib/validation/helpers";

export const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "lowercase-with-hyphens only"),
  description: z.string().optional(),
  status: z.nativeEnum(ContentStatus),
  sortOrder: optionalInt.default(0),
  // Service (child) content for this category's public "Our Services" page —
  // optional: a category can exist for portfolio filtering alone.
  serviceShortDescription: z.string().optional(),
  serviceDescription: z.string().optional(),
  serviceHeroImage: z.string().optional(),
});

export type CategoryInput = z.output<typeof categorySchema>;
export type CategoryFormValues = z.input<typeof categorySchema>;
