import { z } from "zod";

const passwordRegisterMinLen = 8;
const passwordLoginMinLen = 1;
const passwordMaxLen = 72;

const emailMaxLen = 255;

const nameMinLen = 1;
const nameMaxLen = 100;

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(passwordLoginMinLen, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(nameMinLen, "Name is required").max(nameMaxLen),
    email: z.email(`Enter a valid email address`).max(emailMaxLen),
    password: z
      .string()
      .min(passwordRegisterMinLen, `Password must be at least ${passwordRegisterMinLen} characters`)
      .max(passwordMaxLen, `Password must be at most ${passwordMaxLen} characters`),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
