import type { RegistrationPort } from "../model/registration.port";
import type { RegisterInput, RegisteredUser } from "../model/register";
import { RegistrationError } from "../model/register";

/** Real */
export function makeRegistrationGateway(baseUrl: string): RegistrationPort {
  return {
    async uploadSelfie(file: Blob): Promise<string> {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${baseUrl}/files/selfie`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok)
        throw new RegistrationError("Error subiendo selfie", "NETWORK");
      const data = await res.json();
      return data.id as string; // { id: "selfie_123" }
    },

    async register(input: RegisterInput): Promise<RegisteredUser> {
      const res = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (res.status === 409)
        throw new RegistrationError("Email ya registrado", "EMAIL_TAKEN");
      if (!res.ok) throw new RegistrationError("Error de red", "NETWORK");
      return (await res.json()) as RegisteredUser;
    },
  };
}

/** Fake (para desarrollar UI sin backend) */
export function makeFakeRegistrationGateway(): RegistrationPort {
  return {
    async uploadSelfie(_file: Blob): Promise<string> {
      await delay(500);
      return "selfie_demo_1";
    },
    async register(input: RegisterInput): Promise<RegisteredUser> {
      await delay(700);
      if (input.email === "taken@example.com") {
        throw new RegistrationError("Email ya registrado", "EMAIL_TAKEN");
      }
      return { id: "u_1", email: input.email, name: input.name };
    },
  };
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
