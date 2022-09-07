import { z } from "zod";

export const passwordSchema = z.string().min(8).max(128);
export const emailSchema = z.string().email();
export const sessionIdSchema = z.string({
  required_error: "session id is required",
  invalid_type_error: "invalid session id",
  description: "session id",
});
export const userSchema = z.object({
  email: emailSchema,
  _id: z.any(),
  role: z.string().optional(),
});
