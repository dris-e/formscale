import { z } from "zod";

export const LogTypeSchema = z.enum(["submission", "webhook", "email"]);

export const LogSchema = z.object({
  id: z.string().min(1),
  type: LogTypeSchema.default("submission"),
  data: z.any().optional().default({}),
  message: z.string().optional(),
  code: z.number().optional(),
  updatedAt: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  createdAt: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
});

export type Log = z.infer<typeof LogSchema>;
