import { useState } from "react";
import StepPersonal from "../components/StepPersonal";
import StepDNI from "../components/StepDNI";
import StepSelfie from "../components/StepSelfie";
import StepConfirm from "../components/StepConfirm";
import {
  registerService,
  type WizardData,
} from "../../application/register.service";
import type { PersonalData, DniData, SelfieData } from "../../model/register";

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<WizardData>>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "pending" | "ok" | "rejected"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  function next(p: any) {
    setData((prev) => ({ ...prev, ...p }));
    setStep((s) => s + 1);
  }
  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  async function submit() {
    setStatus("sending");
    setMessage(null);
    try {
      const full = data as WizardData;
      const { idUsuario, estado } = await registerService.start(full);
      if (estado === "pendiente") {
        setStatus("pending");
        const finalStatus = await registerService.pollKyc(idUsuario);
        if (finalStatus === "verificada") {
          setStatus("ok");
          setMessage("✅ Cuenta verificada. ¡Ya podés operar!");
        } else if (finalStatus === "rechazada") {
          setStatus("rejected");
          setMessage(
            "❌ Verificación rechazada. Podés reintentar con mejores imágenes."
          );
        } else {
          setMessage("⏳ Verificación en curso. Te avisaremos por email.");
        }
      } else if (estado === "verificada") {
        setStatus("ok");
        setMessage("✅ Cuenta verificada. ¡Ya podés operar!");
      } else {
        setStatus("rejected");
        setMessage(
          "❌ Verificación rechazada. Revisá la calidad de tus fotos."
        );
      }
    } catch (e: any) {
      setStatus("idle");
      setMessage(e?.message ?? "Error inesperado");
    }
  }

  return (
    <main className="grid gap-6">
      <h1>Registro de Creadora (KYC)</h1>
      <Progress step={step} />

      {step === 0 && (
        <StepPersonal
          defaultValues={data as Partial<PersonalData>}
          onNext={(p) => next(p)}
        />
      )}

      {step === 1 && (
        <StepDNI
          defaultValues={data as Partial<DniData>}
          onBack={back}
          onNext={(p) => next(p)}
        />
      )}

      {step === 2 && (
        <StepSelfie
          defaultValues={data as Partial<SelfieData>}
          onBack={back}
          onNext={(p) => next(p)}
        />
      )}

      {step === 3 && (
        <StepConfirm
          data={data as any}
          onBack={back}
          onSubmit={submit}
          isSubmitting={status === "sending"}
        />
      )}

      {status !== "idle" && (
        <div role="status" aria-live="polite">
          <p>
            <strong>Estado:</strong> {status}
          </p>
          {message && <p>{message}</p>}
        </div>
      )}

      {/* Controles del wizard */}
      <nav className="flex gap-2">
        {step > 0 && <button onClick={back}>Atrás</button>}
        {step < 3 && (
          <button onClick={() => setStep((s) => s + 1)} disabled={step === 0}>
            Saltar (debug)
          </button>
        )}
      </nav>
    </main>
  );
}

function Progress({ step }: { step: number }) {
  const labels = ["Datos", "DNI", "Selfie", "Confirmar"];
  return (
    <ol className="flex gap-4">
      {labels.map((l, i) => (
        <li key={l} aria-current={i === step ? "step" : undefined}>
          {i === step ? `● ${l}` : `○ ${l}`}
        </li>
      ))}
    </ol>
  );
}
