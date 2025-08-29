/* import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout } from "@react-router/dev/routes";
import { authRoutes } from "./auth/routes/auth.routes";

export default [
  layout("root.tsx", [
    index("routes/home.tsx"),
    ...authRoutes,
    // ...aquí irán packagesRoutes, financeRoutes, etc. en el mismo formato
  ]),
] satisfies RouteConfig;
 */

import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { authRoutes } from "./auth/routes/auth.routes";

export default [index("routes/home.tsx"), ...authRoutes] satisfies RouteConfig;
