import type { RouteConfig } from "@react-router/dev/routes";
import { route } from "@react-router/dev/routes";

export const authRoutes = [
  route("auth/register", "auth/registration/ui/pages/RegisterPage.tsx"),
] satisfies RouteConfig;
