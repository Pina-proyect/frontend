import {
  dniSchema,
  personalSchema,
  selfieSchema,
  registerInputSchema,
  type DniData,
  type PersonalData,
  type SelfieData,
  type RegisterInput,
  type RegisteredUser,
  RegistrationError,
} from "../model/register";
import type { RegistrationPort } from "../model/registration.port";

export function makeRegisterService(port: RegistrationPort) {
  return {
    /** valida y normaliza cada paso */
    validateDni(input: DniData): DniData {
      return dniSchema.parse(input);
    },
    validatePersonal(input: PersonalData): PersonalData {
      return personalSchema.parse(input);
    },
    validateSelfie(input: SelfieData): SelfieData {
      return selfieSchema.parse(input);
    },

    /** sube selfie (devuelve selfieId para guardarlo en dominio) */
    async uploadSelfie(file: Blob): Promise<string> {
      return await port.uploadSelfie(file);
    },

    /** compone el input final, valida y registra */
    async register(
      dni: DniData,
      personal: PersonalData,
      selfie: SelfieData
    ): Promise<RegisteredUser> {
      const input: RegisterInput = registerInputSchema.parse({
        ...dni,
        ...personal,
        ...selfie,
      });
      try {
        return await port.register(input);
      } catch (e: any) {
        if (e instanceof RegistrationError) throw e;
        throw new RegistrationError("Fallo al registrar", "NETWORK");
      }
    },
  };
}
