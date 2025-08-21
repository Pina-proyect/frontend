import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: "Email inválido" })),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
export type LoginPayload = z.infer<typeof loginSchema>;

export type Tokens = { token: string; refreshToken: string };

export const resetRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: "Email inválido" })),
});
export type ResetRequestPayload = z.infer<typeof resetRequestSchema>;

export const resetConfirmSchema = z.object({
  token: z.string().min(10, "Token inválido"),
  newPassword: z.string().min(6, "Mínimo 6 caracteres"),
});
export type ResetConfirmPayload = z.infer<typeof resetConfirmSchema>;
