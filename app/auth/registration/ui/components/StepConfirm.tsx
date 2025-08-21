import type { PersonalData, DniData, SelfieData } from "../../model/register";

type Props = {
  data: PersonalData & Partial<DniData> & Partial<SelfieData>;
  onBack: () => void;
  onSubmit: () => Promise<void> | void;
  isSubmitting?: boolean;
};

export default function StepConfirm({
  data,
  onBack,
  onSubmit,
  isSubmitting,
}: Props) {
  return (
    <section className="grid gap-4">
      <h2>Confirmá tus datos</h2>
      <ul>
        <li>
          <strong>Nombre:</strong> {data.nombre}
        </li>
        <li>
          <strong>Email:</strong> {data.email}
        </li>
        <li>
          <strong>DNI:</strong> {data.dni}
        </li>
        <li>
          <strong>Nacimiento:</strong> {data.fecha_nacimiento}
        </li>
        <li>
          <strong>Foto DNI:</strong> {data.foto_dni_file ? "Cargada" : "—"}
        </li>
        <li>
          <strong>Selfie:</strong> {data.selfie_file ? "Cargada" : "—"}
        </li>
      </ul>

      <div className="flex gap-2">
        <button type="button" onClick={onBack}>
          Atrás
        </button>
        <button onClick={() => void onSubmit()} disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar para verificación"}
        </button>
      </div>
    </section>
  );
}
