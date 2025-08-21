import { useNavigate, Link } from "react-router";
import LoginForm from "../components/LoginForm";
import { SessionService } from "../../application/session.service";

export default function LoginPage() {
  const nav = useNavigate();

  async function handleLogin(data: { email: string; password: string }) {
    try {
      await SessionService.login(data.email, data.password);
      nav("/"); // o a /finance, etc.
    } catch {
      alert("Credenciales inválidas o error de red");
    }
  }

  return (
    <main className="grid gap-4">
      <h1>Iniciar sesión</h1>
      <LoginForm onSubmit={handleLogin} />
      <Link to="/auth/reset">¿Olvidaste tu contraseña?</Link>
    </main>
  );
}
