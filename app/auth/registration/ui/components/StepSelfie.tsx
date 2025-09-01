import React from "react";

export default function StepSelfie({
  onBack,
  onNext,
  loading,
}: {
  onBack: () => void;
  onNext: (file: File) => void;
  loading?: boolean;
}) {
  const [file, setFile] = React.useState<File | null>(null);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (file) onNext(file);
      }}
      className="grid gap-2"
    >
      <label>Subí tu selfie</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <div className="flex gap-2">
        <button type="button" onClick={onBack}>
          Volver
        </button>
        <button type="submit" disabled={!file || loading}>
          {loading ? "Subiendo..." : "Siguiente"}
        </button>
      </div>
    </form>
  );
}
