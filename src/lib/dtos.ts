import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  phoneNumber: z.string().refine((value) => /^[0-9]{10}$/.test(value), {
    message: "Must be at least 10 digits",
  }),
  email: z
    .string().email(),
  location: z.string().optional()
});

export type LeadSchema = z.infer<typeof leadSchema>;
