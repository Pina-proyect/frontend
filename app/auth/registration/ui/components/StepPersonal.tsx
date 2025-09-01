import React from "react";
import type { PersonalData } from "../../model/register";

export default function StepPersonal({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: (data: PersonalData) => void;
}) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext({ name, email, password });
      }}
      className="grid gap-2"
    >
      <label>Nombre</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <label>Contraseña</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-2">
        <button type="button" onClick={onBack}>
          Volver
        </button>
        <button type="submit">Siguiente</button>
      </div>
    </form>
  );
}
