import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout } from "@react-router/dev/routes";
import { authRoutes } from "./auth/routes/auth.routes";

export default [
  layout("root.tsx", [
    index("routes/home.tsx"),
    ...authRoutes,
    // ...aquí irán packagesRoutes, financeRoutes, etc. en el mismo formato
  ]),
] satisfies RouteConfig;
