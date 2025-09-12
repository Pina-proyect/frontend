import React from "react";
import type { DniData, PersonalData, SelfieData } from "../../model/register";

export default function StepConfirm({
  dni,
  personal,
  selfie,
  onBack,
  onConfirm,
  loading,
}: {
  dni: DniData;
  personal: PersonalData;
  selfie: SelfieData;
  onBack: () => void;
  onConfirm: () => void;
  loading?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <h2>Confirmá tus datos</h2>
      <div>
        <strong>DNI:</strong> {dni.dni}
      </div>
      <div>
        <strong>Nombre:</strong> {personal.name}
      </div>
      <div>
        <strong>Email:</strong> {personal.email}
      </div>
      <div>
        <strong>SelfieId:</strong> {selfie.selfieId}
      </div>
      <div className="flex gap-2">
        <button onClick={onBack}>Volver</button>
        <button onClick={onConfirm} disabled={loading}>
          {loading ? "Registrando..." : "Confirmar"}
        </button>
      </div>
    </div>
  );
}
