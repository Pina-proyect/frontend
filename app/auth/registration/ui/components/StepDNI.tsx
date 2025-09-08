import React from "react";
import type { DniData } from "../../model/register";

export default function StepDNI({
  onNext,
}: {
  onNext: (data: DniData) => void;
}) {
  const [dni, setDni] = React.useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext({ dni });
      }}
      className="grid gap-2"
    >
      <label>DNI</label>
      <input value={dni} onChange={(e) => setDni(e.target.value)} />
      <button type="submit">Siguiente</button>
    </form>
  );
}
