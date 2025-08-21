import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalSchema, type PersonalData } from "../../model/register";

type Props = {
  defaultValues?: Partial<PersonalData>;
  onNext: (data: PersonalData) => void;
};

export default function StepPersonal({ defaultValues, onNext }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalData>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      nombre: "",
      email: "",
      dni: "",
      fecha_nacimiento: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="grid gap-3">
      <label>
        Nombre
        <input {...register("nombre")} />
        {errors.nombre && <small>{errors.nombre.message}</small>}
      </label>

      <label>
        Email
        <input type="email" {...register("email")} />
        {errors.email && <small>{errors.email.message}</small>}
      </label>

      <label>
        DNI
        <input {...register("dni")} />
        {errors.dni && <small>{errors.dni.message}</small>}
      </label>

      <label>
        Fecha de nacimiento
        <input type="date" {...register("fecha_nacimiento")} />
        {errors.fecha_nacimiento && (
          <small>{errors.fecha_nacimiento.message}</small>
        )}
      </label>

      <button type="submit" disabled={isSubmitting}>
        Continuar
      </button>
    </form>
  );
}
