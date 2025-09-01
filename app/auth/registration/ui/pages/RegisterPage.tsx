import React from "react";
import { makeRegisterService } from "../../application/register.service";
import {
  makeFakeRegistrationGateway /* or makeRegistrationGateway */,
} from "../../infra/registration.gateway";
import type { DniData, PersonalData, SelfieData } from "../../model/register";
import StepDNI from "../components/StepDNI";
import StepPersonal from "../components/StepPersonal";
import StepSelfie from "../components/StepSelfie";
import StepConfirm from "../components/StepConfirm";

// Elegí FAKE mientras no tengas backend:
const service = makeRegisterService(makeFakeRegistrationGateway());
// Si ya tenés backend: const service = makeRegisterService(makeRegistrationGateway(import.meta.env.VITE_API_URL));

type Step = 0 | 1 | 2 | 3;

export default function RegisterPage() {
  const [step, setStep] = React.useState<Step>(0);
  const [dni, setDni] = React.useState<DniData | null>(null);
  const [personal, setPersonal] = React.useState<PersonalData | null>(null);
  const [selfie, setSelfie] = React.useState<SelfieData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const next = () => setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  const back = () => setStep((s) => (s > 0 ? ((s - 1) as Step) : s));

  async function onDniSubmit(data: DniData) {
    setError(null);
    try {
      const valid = service.validateDni(data);
      setDni(valid);
      next();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function onPersonalSubmit(data: PersonalData) {
    setError(null);
    try {
      const valid = service.validatePersonal(data);
      setPersonal(valid);
      next();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function onSelfieSubmit(file: File) {
    setError(null);
    setLoading(true);
    try {
      const selfieId = await service.uploadSelfie(file);
      const valid = service.validateSelfie({ selfieId });
      setSelfie(valid);
      next();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function onConfirm() {
    if (!dni || !personal || !selfie) return;
    setError(null);
    setLoading(true);
    try {
      const user = await service.register(dni, personal, selfie);
      alert(`¡Registrado! Bienvenido ${user.name}`);
      // aquí podés navegar a /auth/login o setear sesión
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto grid gap-4">
      <h1>Registro</h1>
      {error && <div style={{ color: "tomato" }}>{error}</div>}
      {step === 0 && <StepDNI onNext={onDniSubmit} />}
      {step === 1 && <StepPersonal onBack={back} onNext={onPersonalSubmit} />}
      {step === 2 && (
        <StepSelfie onBack={back} onNext={onSelfieSubmit} loading={loading} />
      )}
      {step === 3 && (
        <StepConfirm
          onBack={back}
          onConfirm={onConfirm}
          dni={dni!}
          personal={personal!}
          selfie={selfie!}
          loading={loading}
        />
      )}
    </main>
  );
}
function setSplash(arg0: boolean): void {
  throw new Error("Function not implemented.");
}
