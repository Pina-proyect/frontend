// Orquesta el wizard y el polling KYC. Hace la conversión File -> base64.
import { registrationGateway } from "../infra/registration.gateway";
import type { IRegistrationGateway } from "../model/registration.port";
import type {
  DniData,
  PersonalData,
  SelfieData,
  RegisterPayload,
  KycStatus,
} from "../model/register";

async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++)
    binary += String.fromCharCode(bytes[i]);
  return `data:${file.type};base64,${btoa(binary)}`;
}

export type WizardData = PersonalData & DniData & SelfieData;

function toPayload(data: WizardData): Promise<RegisterPayload> {
  return Promise.all([
    fileToBase64(data.foto_dni_file),
    fileToBase64(data.selfie_file),
  ]).then(([dni64, selfie64]) => ({
    nombre: data.nombre,
    email: data.email,
    dni: data.dni,
    fecha_nacimiento: data.fecha_nacimiento,
    foto_dni: dni64,
    selfie: selfie64,
  }));
}

export function createRegisterService(gw: IRegistrationGateway) {
  return {
    async start(
      data: WizardData
    ): Promise<{ idUsuario: string; estado: KycStatus }> {
      const payload = await toPayload(data);
      const res = await gw.start(payload);
      return { idUsuario: res.idUsuario, estado: res.estado };
    },
    async pollKyc(
      id: string,
      tries = 10,
      intervalMs = 1500
    ): Promise<KycStatus> {
      for (let i = 0; i < tries; i++) {
        const { estado } = await gw.kycState(id);
        if (estado !== "pendiente") return estado;
        await new Promise((r) => setTimeout(r, intervalMs));
      }
      return "pendiente";
    },
    retry: (p: Partial<RegisterPayload>) => gw.retry(p),
  };
}

// Instancia por defecto usando el adapter HTTP
export const registerService = createRegisterService(registrationGateway);
