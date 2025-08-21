import type { RegisterPayload, KycStatus } from "./register";

export interface IRegistrationGateway {
  start(p: RegisterPayload): Promise<{ estado: KycStatus; idUsuario: string }>;
  kycState(id: string): Promise<{ estado: KycStatus }>;
  retry(p: Partial<RegisterPayload>): Promise<void>;
}
