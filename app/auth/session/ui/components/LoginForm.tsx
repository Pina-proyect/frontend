import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginPayload } from "../../model/session";

export default function LoginForm({
  onSubmit,
}: {
  onSubmit: (data: LoginPayload) => Promise<void> | void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>({ resolver: zodResolver(loginSchema) });

  return (
    <form className="grid gap-3" onSubmit={handleSubmit((d) => onSubmit(d))}>
      <label>
        Email
        <input type="email" {...register("email")} />
        {errors.email && <small>{errors.email.message}</small>}
      </label>
      <label>
        Contraseña
        <input type="password" {...register("password")} />
        {errors.password && <small>{errors.password.message}</small>}
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
