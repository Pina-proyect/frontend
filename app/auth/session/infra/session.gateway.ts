// Adapter HTTP hacia tus endpoints de HU1.2
import type {
  LoginPayload,
  ResetRequestPayload,
  ResetConfirmPayload,
  Tokens,
} from "../model/session";

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

export const SessionGateway = {
  login: (body: LoginPayload) =>
    http<Tokens>("/api/login", { method: "POST", body: JSON.stringify(body) }),
  resetRequest: (body: ResetRequestPayload) =>
    http<unknown>("/api/password/reset-request", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  resetConfirm: (body: ResetConfirmPayload) =>
    http<unknown>("/api/password/reset-confirm", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
