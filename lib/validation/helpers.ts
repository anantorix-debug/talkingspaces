import { z } from "zod";

/**
 * Native form fields submit "" for an empty number input/select. Plain z.coerce.number()
 * turns "" into 0 (Number("") === 0), which is wrong for optional FK fields like
 * categoryId — an empty select must resolve to undefined, not 0.
 */
function emptyToUndefined(val: unknown) {
  return val === "" || val === null || val === undefined ? undefined : val;
}

export const optionalInt = z.preprocess(emptyToUndefined, z.coerce.number().int().optional());

export const requiredPositiveInt = (message: string) =>
  z.preprocess(emptyToUndefined, z.coerce.number().int().positive(message));
