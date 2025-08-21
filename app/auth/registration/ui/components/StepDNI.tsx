import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dniSchema, type DniData } from "../../model/register";

type Props = {
  onNext: (data: DniData) => void;
  onBack: () => void;
  defaultValues?: Partial<DniData>;
};

export default function StepDNI({ onNext, onBack, defaultValues }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DniData>({
    resolver: zodResolver(dniSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="grid gap-3">
      <label>
        Foto del DNI
        <input type="file" accept="image/*" {...register("foto_dni_file")} />
        {errors.foto_dni_file && (
          <small>{errors.foto_dni_file.message as string}</small>
        )}
      </label>

      <div className="flex gap-2">
        <button type="button" onClick={onBack}>
          Atrás
        </button>
        <button type="submit">Continuar</button>
      </div>
    </form>
  );
}
