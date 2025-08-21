import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetRequestSchema } from "../../model/session";
import { SessionService } from "../../application/session.service";

export default function ResetRequestPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>({ resolver: zodResolver(resetRequestSchema) });

  async function submit(data: { email: string }) {
    await SessionService.resetRequest(data.email);
    alert("Si el email existe, te enviamos instrucciones.");
  }

  return (
    <main className="grid gap-4">
      <h1>Recuperar contraseña</h1>
      <form onSubmit={handleSubmit(submit)} className="grid gap-3">
        <label>
          Email
          <input type="email" {...register("email")} />
          {errors.email && <small>{errors.email.message}</small>}
        </label>
        <button disabled={isSubmitting}>Enviar</button>
      </form>
    </main>
  );
}
