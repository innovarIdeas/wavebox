import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  phoneNumber: z.string().refine((value) => /^[+]?[0-9]{10,}$/.test(value), {
    message: "Must be a valid phone number with at least 10 digits",
  }),
  email: z
    .string().email(),
  location: z.string().optional(),
  source: z.string().optional()
});

export type LeadSchema = z.infer<typeof leadSchema>;

export const createWaveboxMessageSchema = z.object({
  organization_id: z.string(),
  wavebox_chat_id: z.string(),
  wavebox_lead_id: z.string(),
  message: z.string(),
  responder_id: z.string().optional()
});

export type CreateWaveboxMessageSchema = z.infer<typeof createWaveboxMessageSchema>;

export const fetchMessagesSchema = z.object({
  organization_id: z.string(),
  wavebox_chat_id: z.string(),
  wavebox_lead_id: z.string(),
});

export type FetchMessagesSchema = z.infer<typeof fetchMessagesSchema>;

export const popupSettingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(["Active", "Inactive"]),
  position: z.enum([
    "center",
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
  ]),
  trigger: z.enum(["immediate", "delay", "scroll", "exit-intent"]),
  triggerValue: z.number().optional(),
  duration: z.number().min(0).optional(),
  frequency: z.enum(["once", "once-per-session", "always", "custom"]),
  frequencyDays: z.number().min(1).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  showOnMobile: z.boolean(),
  showOnDesktop: z.boolean(),
  targetPages: z.enum(["all", "specific"]),
  specificPages: z.array(z.string()).optional(),
  targetAudience: z.enum(["all", "new", "returning"]),
  animation: z
    .enum(["fade", "slide-up", "slide-down", "zoom", "none"])
    .default("fade"),
  zIndex: z.number().min(0).default(9999),
  showOverlay: z.boolean().default(true),
  showCloseButton: z.boolean().default(true),
});

export type PopupSettingsSchema = z.infer<typeof popupSettingsSchema>;

export const fetchActivePopupsSchema = z.object({
  path: z.string(),
  isMobile: z.boolean(),
  isNewVisitor: z.boolean(),
});

export type FetchActivePopupsSchema = z.infer<typeof fetchActivePopupsSchema>;

