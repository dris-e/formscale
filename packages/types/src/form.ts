import { z } from "zod";
import { SubmissionSentSchema, SubmissionStatusSchema } from "./submission";
import { MAX_FILE_SIZE, ValidationSchema } from "./validations";

export const HookEnum = z.enum(["webhook", "discord", "email", "slack"]);

export const WebhookSchema = z.object({
  type: HookEnum.default("webhook"),
  enabled: z.boolean().default(false),
  url: z.string().url(),
  method: z.enum(["GET", "POST"]).optional().default("POST"),
  secret: z.string().optional(),
  headers: z.record(z.string()).optional().default({}),
});

export const DiscordSchema = WebhookSchema.extend({
  type: z.literal("discord").default("discord"),
  url: z
    .string()
    .url()
    .regex(/^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/, "Please enter a valid Discord webhook URL"),
});

export const SlackSchema = WebhookSchema.extend({
  type: z.literal("slack").default("slack"),
  url: z
    .string()
    .url()
    .refine((url) => /^https:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]+\/B[A-Z0-9]+\/[a-zA-Z0-9]+$/.test(url), {
      message: "Must be a valid Slack webhook URL (https://hooks.slack.com/services/...)",
    }),
});

export const EmailSettingsSchema = z.object({
  enabled: z.boolean().default(true),
  to: z
    .array(z.string().email({ message: "Please enter a valid email address" }))
    .optional()
    .default([]),
  template: z.enum(["Default", "Custom"]).optional().default("Default"),
  text: z.string().optional(),
});

// automatically parse links & data (handlebars format)
// export const AutoReplySchema = z.object({
//   enabled: z.boolean().default(false),
//   to: z.string().email({ message: "Please enter a valid email address" }),
//   subject: z.string().optional(),
//   content: z.string().optional(),
// });

export const ThemeSchema = z.object({
  name: z.string().min(3).max(60).optional().or(z.literal("")),
  accent: z
    .string()
    .regex(/^#([0-9a-f]{6})$/i, "Please enter a valid hex color.")
    .optional()
    .or(z.literal("")),
  logo: z.string().optional(),
  icon: z.string().optional(),
  branding: z.boolean().optional().default(true),
});

export const LogoUploadSchema = z.object({
  logo: z.instanceof(File).refine((file) => file.size <= MAX_FILE_SIZE, {
    message: `File too large.`,
  }),
});

export const AdminSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "owner", "viewer"]).default("viewer"),
  verified: z.boolean().optional().default(false),
});

export const TeamPayloadSchema = z.object({
  email: z.string().email(),
  formId: z.string(),
  invitee: z.string().min(1),
});

export const UTMSettingsSchema = z.object({
  enabled: z.boolean().optional().default(false),
  source: z.string().optional(),
  medium: z.string().optional(),
  campaign: z.string().optional(),
});

// yeah i know this is cooked

export const FormSettingsSchema = z.object({
  isPublic: z.boolean().optional().default(true),
  allowAnonymous: z.boolean().optional().default(true),
  saveResponses: z.boolean().optional().default(true),
  spamProtection: z.boolean().optional().default(false),
  defaultStatus: SubmissionStatusSchema.default("completed"),
  emailSettings: EmailSettingsSchema.optional().default({}),
  admins: z.array(AdminSchema).optional().default([]),
  theme: ThemeSchema.optional().default({}),
  utm: UTMSettingsSchema.optional().default({}),
  captchaService: z.enum(["None", "reCAPTCHA", "hCAPTCHA", "Turnstile"]).optional().default("None"),
  reCaptcha: z
    .string()
    .regex(/^[0-9a-f]{32}$/, "Please enter a valid CAPTCHA site key")
    .optional()
    .or(z.literal("")),
  webhooks: z.array(WebhookSchema).optional().default([]),
  successUrl: z.string().url().optional().or(z.literal("")),
  customDomain: z.string().optional(),
  allowedOrigins: z
    .array(
      z
        .string()
        .refine(
          (origin) => origin === "*" || origin === "null" || /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(origin),
          `Origin must be a valid URL, "*", or blank`
        )
    )
    .optional()
    .default([]),
  validation: ValidationSchema.optional().default({}),
});

export const idString = "23456789abcdefghjkmnpqrstuvwxyz";
export const IdSchema = z
  .string()
  .regex(
    new RegExp(`^[${idString}]{8}(-dev)?$`),
    "Please use a valid form ID (8 characters, followed by '-dev' for development)"
  );

export const FormSchema = z.object({
  id: IdSchema,
  name: z.string().min(3).max(60),
  settings: FormSettingsSchema,
  development: z.boolean().optional().default(true),
  submissions: z.array(SubmissionSentSchema).optional(),
  updatedAt: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  createdAt: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
});

export const CreateFormSchema = z.object({
  name: z.string().min(3).max(60),
});

export const FormEditSchema = FormSchema.omit({
  submissions: true,
  updatedAt: true,
  createdAt: true,
});

export type Form = z.infer<typeof FormSchema>;
export type Id = z.infer<typeof IdSchema>;
export type CreateForm = z.infer<typeof CreateFormSchema>;
export type FormEdit = z.infer<typeof FormEditSchema>;
export type FormSettings = z.infer<typeof FormSettingsSchema>;
export type Webhook = z.infer<typeof WebhookSchema>;
export type Discord = z.infer<typeof DiscordSchema>;
export type EmailSettings = z.infer<typeof EmailSettingsSchema>;
export type Admin = z.infer<typeof AdminSchema>;
export type TeamPayload = z.infer<typeof TeamPayloadSchema>;
