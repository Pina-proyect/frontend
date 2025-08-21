import type { RouteConfig } from "@react-router/dev/routes";
import { route } from "@react-router/dev/routes";

// Array de entries; usamos `satisfies` para verificar forma, pero sigue siendo un array
export const authRoutes = [
  route("auth/register", "auth/registration/ui/pages/RegisterPage.tsx"),
  route("auth/login", "auth/session/ui/pages/LoginPage.tsx"),
  route("auth/reset", "auth/session/ui/pages/ResetRequestPage.tsx"),
  route("auth/reset/confirm", "auth/session/ui/pages/ResetConfirmPage.tsx"),
] satisfies RouteConfig;
