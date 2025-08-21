# Dominio : Auth (Identidad y Acceso)

> **Propósito**: Identidad y Acceso (IAM). Alta de cuentas, verificación KYC, inicio/cierre de sesión y recuperación de contraseña.

## Alcance

- **Responsable de**: registro, login, gestión/rotación de tokens, recuperación de contraseña.
- **Fuera de alcance**: perfil público, contenidos, pagos, finanzas.
- Seguridad transversal (tokens, rate limiting del backend, auditoría, logs).

## Submódulos (features)

- `registration/` — Registro + KYC (HU1.1)
- `session/` — Login + refresh + reset por email (HU1.2)

## Contratos y límites

- **Expone rutas UI**: `/auth/register`, `/auth/login`, `/auth/reset`
- **Depende de**: `shared/http` (cliente HTTP), `shared/store` (auth store), `kyc/` (opcional, si está desacoplado)
- **No hace**: persistencia definitiva de archivos KYC (solo sube y orquesta)

## Estado global (UI)

Zustand `auth.store`:

```ts
{ token?: string; refresh?: string; user?: { id?: string; email?: string; role?: "creator"|"donor"|"admin" } }
```

## Estructura (screaming architecture)

```
auth/
├─ registration/
│  ├─ model/          # tipos, schemas Zod, puertos (interfaces)
│  ├─ application/    # casos de uso / orquestación
│  ├─ infra/          # adapters HTTP a /api/registro y /api/kyc
│  └─ ui/             # páginas y componentes del wizard
├─ session/
│  ├─ model/          # tipos, schemas Zod
│  ├─ application/    # casos de uso de sesión
│  ├─ infra/          # adapters HTTP a /api/login y /api/password/*
│  └─ ui/             # páginas y componentes de login/reset
└─ routes/
   └─ auth.routes.ts  # composición de rutas del dominio
```

## Principios de dependencia

- `ui → application → model`
- `application ↔ (puertos) ↔ infra`
- `infra` no importa de `ui` ni de `application` (solo implementa interfaces de `model`).

## Routing (React Router v7 + @react-router/dev)

Archivo: `app/auth/routes/auth.routes.ts`

```ts
import type { RouteConfig } from "@react-router/dev/routes";
import { route } from "@react-router/dev/routes";

export const authRoutes = [
  route("auth/register", "auth/registration/ui/pages/RegisterPage.tsx"),
  route("auth/login", "auth/session/ui/pages/LoginPage.tsx"),
  route("auth/reset", "auth/session/ui/pages/ResetRequestPage.tsx"),
  route("auth/reset/confirm", "auth/session/ui/pages/ResetConfirmPage.tsx"),
] satisfies RouteConfig;
```

Composición global (`app/routes.ts`):

```ts
import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout } from "@react-router/dev/routes";
import { authRoutes } from "./auth/routes/auth.routes";

export default [
  layout("root.tsx", [index("routes/home.tsx"), ...authRoutes]),
] satisfies RouteConfig;
```

## Dependencias y utilidades

- **Alias**: `~` → `app/` (en `tsconfig.paths` y `vite.config.ts`).
- **Store** (Zustand): `~/shared/store/auth.store.ts` (estado y persistencia; sin HTTP).
- **HTTP client**: `~/shared/http/client.ts` lee el token del store y agrega `Authorization`.
- **React Router v7**: hooks desde `"react-router"` (`useNavigate`, `useParams`, `Link`).
- **Zod**: normalización de email con `.trim().toLowerCase().pipe(z.email(...))`.

## Seguridad (resumen)

- **HTTPS obligatorio** para todas las rutas.
- **JWT RS256** (access + refresh) con rotación controlada desde backend.
- **Tokens en memoria + persistencia mínima** (store persistida; evaluar cookies httpOnly según riesgo).
- **No loguear PII ni imágenes/documentos** en clientes ni en logs de servidor.
- **Cumplimiento Ley 25.326 (AR)** y políticas de retención/eliminación (rechazos KYC a 7 días, lado backend).
- **Rate limiting** y bloqueo temporal en login (Redis/server-side).
- **Auditoría**: login OK/fail, reintentos KYC, reset password.

## Integraciones

- **KYC provider**: Veriff/Didi (vía `infra/*`).
- **Email**: envío de reset password (webhook/SMTP desde backend).

---

# Subdominio: Registration (HU1.1)

> **Objetivo**: Alta de creadora con verificación de identidad (KYC) y activación post-verificación.

## Árbol

```
auth/registration/
├─ model/
│  ├─ register.ts           # Zod schemas + tipos
│  └─ registration.port.ts  # interfaz IRegistrationGateway
├─ application/
│  └─ register.service.ts   # orquesta: File→base64, start, pollKyc, retry
├─ infra/
│  └─ registration.gateway.ts# HTTP hacia /api/registro y /api/kyc
└─ ui/
   ├─ pages/RegisterPage.tsx
   └─ components/
      ├─ StepPersonal.tsx
      ├─ StepDNI.tsx
      ├─ StepSelfie.tsx
      └─ StepConfirm.tsx
```

## Endpoints (backend HU)

- `POST /api/registro/creadora` → `{ estado, idUsuario }`
- `GET  /api/kyc/estado/:id` → `{ estado }`
- `POST /api/kyc/reintento` → `204/200`

## Tipos & Schemas (resumen)

```ts
// personalSchema (email normalizado)
email: z.string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ message: "Email inválido" }));
```

Estados KYC: `"pendiente" | "verificada" | "rechazada"`.

## Flujo de UI

1. Datos personales → 2) Foto DNI → 3) Selfie → 4) Confirmar → **Enviar**

- Al enviar: `start()` → si `estado === pendiente` → `pollKyc()`.
- Estados visuales: `idle | sending | pending | ok | rejected`.

## Errores y Edge cases

- Documento inválido / selfie no coincidente → mensaje y `retry()`.
- Fallo proveedor KYC → mantener `pendiente`; mostrar aviso y notificación email.

## Seguridad y cumplimiento

- HTTPS-only, base64 solo transitorio (considerar presigned uploads si excede tamaño).
- Eliminación automática de rechazos a los 7 días (backend).
- Cumplimiento Ley 25.326 (datos personales).

## Checklist

- [ ] Hooks desde `"react-router"` (no `react-router-dom`).
- [ ] Email normalizado en login/reset.
- [ ] `SessionService.login()` guarda tokens + user en store persistida.
- [ ] `logout()` limpia estado completo (tokens + user).
- [ ] Rate limiting y bloqueo tras intentos fallidos cubiertos en backend.
- [ ] Errores del backend mapeados a mensajes de UI (sin filtrar PII).
- [ ] Accesibilidad: labels, foco tras error, feedback `aria-live`.
- [ ] Tests: unit (service), integración (gateway con mocks), E2E (login ok/fail, reset flow).
- [ ] Métricas: tiempo medio de login; ratio de reset exitoso.

---

## Utilidades compartidas

- **HTTP** `~/shared/http/client.ts` con cabecera `Authorization: Bearer <token>` leyendo del store.
- **Alias** `~` (TS y Vite) para imports no relativos.
- **Barrels** opcionales (`index.ts`) en `ui/pages`, `application`, etc.

## Roadmap corto

- Refresh automático (interceptor) y reintento 401 → refresh → replay.
- Telemetría de eventos (login success/fail, tiempos KYC).
- Hardened storage (migrar tokens a cookies httpOnly si el riesgo lo amerita).

## Observabilidad

- Propagar `x-request-id` por request (cliente y servidor).
- Logs estructurados sin PII (traza por `x-request-id`).
- Métricas: tasa de aprobación KYC, tiempo medio de login, ratio de reset exitoso.

## Checklist de PR

- [ ] Actualizaste este README si cambió el contrato.
- [ ] Errores mapeados a mensajes de UI claros.
- [ ] Accesibilidad (labels, focus, errores) validada.
- [ ] Tests mínimos incluidos (unit + integración + E2E).

---

## QA / Tests (ideas rápidas)

**Unit (application)**

- Registration: orquestación `start`/`pollKyc` y manejo de estados (`ok/rejected/pendiente`).
- Session: `login/logout/resetRequest/resetConfirm` actualizando el store.

**Integración (infra)**

- Gateways con mocks de fetch: 200/4xx/5xx, timeouts, reintentos.

**E2E**

- Registration: flujo completo happy, rechazo por documentación, timeout proveedor.
- Session: login ok/fail, bloqueo por intentos, reset-request + reset-confirm.

**Accesibilidad**

- Labels asociados, foco tras error, `aria-live` para estados/toasts.

---

## KPIs (del negocio)

- Aprobación KYC (primer intento) > 85%.
- Tiempo medio de verificación < 15 s.
- Tiempo medio de autenticación < 1 s.
- Ratio de bloqueos por intentos fallidos < 2%.
