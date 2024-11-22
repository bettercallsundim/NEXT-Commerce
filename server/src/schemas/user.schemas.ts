// schemas/userSchema.ts
import { z } from "zod";

export const userSignIn = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  picture: z.string().optional(),
});

export type UserSchema = z.infer<typeof userSignIn>;
