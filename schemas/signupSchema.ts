import { z } from "zod";

export const usernameValidation = z.string()
                                  .min(2, "username must be atleast 2 charachters")
                                  .max(10, "username must be atmost 10 charachters")
                                  .regex(/^[a-zA-Z0-9]+$/, "Special characters are not allowed")


export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email({message: "Invalid email address"}),
  password: z.string().min(6, {message: "Password must be atleast 6 character"})
})