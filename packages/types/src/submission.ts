import { z } from "zod";
import { IdSchema } from "./form";
import { LogSchema } from "./logs";

export const SubmissionStatusSchema = z.enum(["pending", "completed", "blocked", "failed"]);

export const SubmissionSchema = z.object({
  id: IdSchema,
  data: z.record(z.string(), z.any()),
});

export const EditStatusSchema = z.object({
  status: SubmissionStatusSchema.default("completed"),
});

export const SubmissionSentSchema = z.object({
  id: z.string().min(1),
  formId: IdSchema,
  data: z.any().optional().default({}),
  status: SubmissionStatusSchema.default("pending"),
  location: z.string().optional().default("Unknown"),
  site: z.string().url().optional(),
  logs: z.array(LogSchema).optional(),
  updatedAt: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  createdAt: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
});

export type Submission = z.infer<typeof SubmissionSchema>;
export type SubmissionSent = z.infer<typeof SubmissionSentSchema>;
export type SubmissionStatus = z.infer<typeof SubmissionStatusSchema>;
export type EditStatus = z.infer<typeof EditStatusSchema>;
