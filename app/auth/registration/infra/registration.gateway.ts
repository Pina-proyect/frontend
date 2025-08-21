// Adapter HTTP hacia tu backend (usa fetch directamente)
import type { IRegistrationGateway } from "../model/registration.port";
import type { RegisterPayload, KycStatus } from "../model/register";

// Pequeño wrapper fetch
async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const registrationGateway: IRegistrationGateway = {
  start(payload: RegisterPayload) {
    return http<{ mensaje: string; estado: KycStatus; idUsuario: string }>(
      "/api/registro/creadora",
      { method: "POST", body: JSON.stringify(payload) }
    );
  },
  kycState(id: string) {
    return http<{ estado: KycStatus }>(`/api/kyc/estado/${id}`, {
      method: "GET",
    });
  },
  retry(body: Partial<RegisterPayload>) {
    return http<unknown>("/api/kyc/reintento", {
      method: "POST",
      body: JSON.stringify(body),
    }).then(() => undefined);
  },
};
