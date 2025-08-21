// Tipos y schemas del registro (HU1.1)
import { z } from "zod";

// --- Helpers ---
function isAdult(isoDate: string) {
  const dob = new Date(isoDate);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age >= 18;
}

// --- Esquemas por paso ---
export const personalSchema = z.object({
  nombre: z.string().min(2, "Nombre demasiado corto"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: "Email inválido" })),

  dni: z.string().min(6).max(20),
  fecha_nacimiento: z.string().refine(isAdult, "Debés ser mayor de 18 años"),
});
export type PersonalData = z.infer<typeof personalSchema>;

export const dniSchema = z.object({
  // guardamos el File y luego lo convertimos en base64 antes de enviar
  foto_dni_file: z.instanceof(File, { message: "Seleccioná una imagen" }),
});
export type DniData = z.infer<typeof dniSchema>;

export const selfieSchema = z.object({
  selfie_file: z.instanceof(File, { message: "Seleccioná una selfie" }),
});
export type SelfieData = z.infer<typeof selfieSchema>;

// --- Payload final para la API ---
export type KycStatus = "pendiente" | "verificada" | "rechazada";

export type RegisterPayload = {
  nombre: string;
  email: string;
  dni: string;
  fecha_nacimiento: string; // ISO
  foto_dni: string; // base64
  selfie: string; // base64
};
