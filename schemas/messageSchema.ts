import { z } from "zod";

export const messageValidationSchema = z.object({
  message: z.string().min(10, "message must be atleast 10 characters long")
                    .max(300, "message must be atmost 300 characters long")
});