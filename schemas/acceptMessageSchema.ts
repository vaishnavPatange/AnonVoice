import { z } from "zod";

export const messageAccteptanceSchema = z.object({
  accept: z.boolean()
});