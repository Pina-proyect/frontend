import { useAuthStore } from "~/shared/store/auth.store";
import { SessionGateway } from "../infra/session.gateway";
import type {
  LoginPayload,
  ResetRequestPayload,
  ResetConfirmPayload,
} from "../model/session";

export const SessionService = {
  // Inicia sesión y guarda tokens + user básico en el store (persistido)
  async login(payload: LoginPayload) {
    const { token, refreshToken } = await SessionGateway.login(payload);

    useAuthStore.getState().setSession({
      token,
      refresh: refreshToken,
      user: { email: payload.email, role: "creator" }, // ajustá role si lo devuelve el backend
    });

    return { token, refreshToken };
  },

  // Limpia todo el estado de sesión
  logout() {
    useAuthStore.getState().clear();
  },

  // Flujo de recuperación
  resetRequest(payload: ResetRequestPayload) {
    return SessionGateway.resetRequest(payload);
  },

  resetConfirm(payload: ResetConfirmPayload) {
    return SessionGateway.resetConfirm(payload);
  },
};
