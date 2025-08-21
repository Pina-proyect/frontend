import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { selfieSchema, type SelfieData } from "../../model/register";

type Props = {
  onNext: (data: SelfieData) => void;
  onBack: () => void;
  defaultValues?: Partial<SelfieData>;
};

export default function StepSelfie({ onNext, onBack, defaultValues }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SelfieData>({
    resolver: zodResolver(selfieSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="grid gap-3">
      <label>
        Selfie
        <input type="file" accept="image/*" {...register("selfie_file")} />
        {errors.selfie_file && (
          <small>{errors.selfie_file.message as string}</small>
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
