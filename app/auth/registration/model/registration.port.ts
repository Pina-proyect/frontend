import type { RegisterInput, RegisteredUser } from "./register";

export interface RegistrationPort {
  /** Endpoint final de registro */
  register(input: RegisterInput): Promise<RegisteredUser>;
  /** Subida de selfie; devuelve id/URL para guardar en dominio */
  uploadSelfie(file: Blob): Promise<string>;
}
