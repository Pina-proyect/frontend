import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetConfirmSchema } from "../../model/session";
import { SessionService } from "../../application/session.service";

export default function ResetConfirmPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ token: string; newPassword: string }>({
    resolver: zodResolver(resetConfirmSchema),
  });

  async function submit({
    token,
    newPassword,
  }: {
    token: string;
    newPassword: string;
  }) {
    await SessionService.resetConfirm(token, newPassword);
    alert("Contraseña actualizada. Iniciá sesión.");
    window.location.href = "/auth/login";
  }

  return (
    <main className="grid gap-4">
      <h1>Definir nueva contraseña</h1>
      <form onSubmit={handleSubmit(submit)} className="grid gap-3">
        <label>
          Token
          <input {...register("token")} />
          {errors.token && <small>{errors.token.message}</small>}
        </label>
        <label>
          Nueva contraseña
          <input type="password" {...register("newPassword")} />
          {errors.newPassword && <small>{errors.newPassword.message}</small>}
        </label>
        <button disabled={isSubmitting}>Actualizar</button>
      </form>
    </main>
  );
}
