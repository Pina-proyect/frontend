import { z } from "zod";

/** Paso 1: DNI */
export const dniSchema = z.object({
  dni: z.string().min(7).max(10),
});
export type DniData = z.infer<typeof dniSchema>;

/** Paso 2: Datos personales */
export const personalSchema = z.object({
  name: z.string().min(2),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: "Email inválido" })),
  password: z.string().min(8),
});
export type PersonalData = z.infer<typeof personalSchema>;

/** Paso 3: Selfie (en dominio guardamos un id/URL ya subido, no el File) */
export const selfieSchema = z.object({
  selfieId: z.string().min(1),
});
export type SelfieData = z.infer<typeof selfieSchema>;

/** Input final de registro (composición de pasos) */
export const registerInputSchema = dniSchema
  .and(personalSchema)
  .and(selfieSchema);
export type RegisterInput = z.infer<typeof registerInputSchema>;

/** Resultado de éxito */
export type RegisteredUser = {
  id: string;
  email: string;
  name: string;
};

export class RegistrationError extends Error {
  constructor(
    message: string,
    public code?: "EMAIL_TAKEN" | "NETWORK" | "INVALID_INPUT"
  ) {
    super(message);
  }
}
