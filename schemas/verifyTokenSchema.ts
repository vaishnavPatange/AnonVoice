import { z } from "zod";

export const verifySchema = z.object({
  token: z.string().length(6, "invalid token")
})