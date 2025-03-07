import { z } from "zod";


export const loginSchema = z.object({
    username: z.string().min(5, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 6 characters"),
  });