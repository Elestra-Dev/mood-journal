import { z } from "zod";

export const upsertMoodSchema = z.object({
  day: z.coerce.date(),
  emoji: z.string().min(1).max(4),
  note: z.string().max(280).optional()
});

export const deleteMoodSchema = z.object({
  day: z.coerce.date()
});
