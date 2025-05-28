import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string(), // identifier -> better name for email
  password: z.string()
});