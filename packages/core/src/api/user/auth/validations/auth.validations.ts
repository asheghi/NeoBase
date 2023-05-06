import { z } from "zod";

export const passwordSchema = z.string().min(8).max(128);
export const usernameSchema = z.string().min(4).max(64);
export const emailSchema = z.string().email();
export const userSchema = z.object({
  username: usernameSchema,
  _id: z.any(),
  role: z.string().optional(),
});
