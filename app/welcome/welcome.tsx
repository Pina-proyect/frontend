import { Link, useNavigate } from "react-router";
import { useState, type ReactNode } from "react";
import { Colorizer } from "~/shared/components/Colorizer";
import { Logo } from "~/shared/components/Logo";
import CreatorLeft from "./creator-left.jpg";
import CreatorRight from "./creator-right.jpg";
import Ilustradora from "./ilustradora.jpg";
import Podcaster from "./podcaster.jpg";
import Musica from "./musica.jpg";

/* --------------------------- utils opcional --------------------------- */
function getComplementaryColor(hex: string) {
  const s = hex.replace("#", "");
  const r = parseInt(s.substring(0, 2), 16) / 255;
  const g = parseInt(s.substring(2, 4), 16) / 255;
  const b = parseInt(s.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    sv = 0,
    l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    sv = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  h = (h + 0.5) % 1;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + sv) : l + sv - l * sv;
  const p = 2 * l - q;
  const r2 = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g2 = Math.round(hue2rgb(p, q, h) * 255);
  const b2 = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return `#${((1 << 24) + (r2 << 16) + (g2 << 8) + b2).toString(16).slice(1)}`;
}

/* ------------------------------ Íconos ------------------------------- */
const IconTip = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1v4" /><circle cx="12" cy="9" r="3.5"/><path d="M7 22h10M5 18h14M6 15h12" />
  </svg>
);
const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 1 1 8 0v3"/>
  </svg>
);
const IconFlag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 3v18"/><path d="M4 4h12l-2 4 2 4H4"/>
  </svg>
);
const IconChat = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3 1.5-4A4 4 0 0 1 3 15V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
    <path d="M8.5 10.5a1 1 0 1 0 0 2M12 10.5a1 1 0 1 0 0 2M15.5 10.5a1 1 0 1 0 0 2"/>
  </svg>
);

/* ------------------------- Features (2x2) --------------------------- */
type Accent = "primary" | "secondary";
type FeatureProps = { icon: ReactNode; title: string; text: string; accent?: Accent };

const FEATURES: FeatureProps[] = [
  { icon: <IconTip />,  title: "Apoyos pagos",           text: "Recibe propinas y aporta valor extra a tus fans.", accent: "primary"   },
  { icon: <IconLock />, title: "Contenido exclusivo",    text: "Publica posts, videos o perks solo para miembros.", accent: "secondary" },
  { icon: <IconFlag />, title: "Campañas de recaudación", text: "Activa metas y celebra avances con tu comunidad.",  accent: "primary"   },
  { icon: <IconChat />, title: "Soporte & comunidad",    text: "Herramientas simples, sin enredos técnicos.",       accent: "secondary" },
];

function FeatureCard({ icon, title, text, accent = "primary" }: FeatureProps) {
  const colorVar = `var(--color-${accent})`;
  return (
    <article className="group h-full rounded-3xl ring-1 ring-black/5 bg-white/70 backdrop-blur p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="mb-3 flex items-center gap-3">
        <div
          aria-hidden
          className="w-10 h-10 shrink-0 rounded-full grid place-items-center"
          style={{ background: `${colorVar}1A`, boxShadow: `inset 0 0 0 2px ${colorVar}33`, color: colorVar }}
        >
          {icon}
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-sm text-black/70">{text}</p>
    </article>
  );
}

function FeaturesSection() {
  return (
    <section className="mt-16 px-6" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto">
        <h2 id="features-heading" className="text-2xl font-bold mb-6">Hecho para creadores</h2>
        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <li key={f.title} className="h-full">
              <FeatureCard {...f} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------- Creador/a target + CTA ----------------------- */
function CreatorCTASection({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="mt-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <img className="rounded-3xl w-full h-72 object-cover" src={CreatorRight} alt="Creadora en su estudio" loading="lazy" />
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-3">Monetiza tu talento</h3>
          <button
            onClick={onCreate}
            className="px-6 py-3 rounded-full text-white font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-black/10"
            style={{ background: "var(--color-secondary)" }}
          >
            Crear cuenta
          </button>
          <p className="text-sm text-black/60 mt-3">Gratis para empezar • Sin tarjeta</p>
        </div>
        <img className="rounded-3xl w-full h-72 object-cover object-top" 
        src={CreatorLeft} alt="Creador grabando" loading="lazy" />
      </div>
    </section>
  );
}

/* --------------------------- Testimonios --------------------------- */
type TestimonialT = { quote: string; name: string; role: string; avatar: string };
const TESTIMONIALS: TestimonialT[] = [
  { quote: "Subí mis ingresos sin cambiar mi rutina.",       name: "Valen", role: "Ilustradora", avatar: Ilustradora },
  { quote: "Las membresías me dieron previsibilidad.",       name: "Ari",   role: "Podcaster",   avatar: Podcaster },
  { quote: "Monté una campaña en minutos.",                  name: "Juana", role: "Música",      avatar: Musica },
];

function Testimonial({ quote, name, role, avatar }: TestimonialT) {
  return (
    <figure className="rounded-3xl ring-1 ring-black/5 bg-white/70 backdrop-blur p-6">
      <div className="flex items-center gap-4 mb-4">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" loading="lazy" />
        <figcaption>
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-black/60">{role}</div>
        </figcaption>
      </div>
      <blockquote className="text-black/80">“{quote}”</blockquote>
    </figure>
  );
}

function TestimonialsSection() {
  return (
    <section className="mt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Lo que dicen los creadores</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => <Testimonial key={t.name} {...t} />)}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Footer ----------------------------- */
function FooterSection() {
  return (
    <footer className="mt-24 px-6 py-10 border-t border-black/5 bg-white/60 backdrop-blur">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h4 className="font-semibold mb-3">Ayuda</h4>
          <ul className="space-y-2 text-sm text-black/70">
            <li><Link to="/faq">Preguntas frecuentes</Link></li>
            <li><Link to="/soporte">Soporte</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-black/70">
            <li><Link to="/terminos">Términos y condiciones</Link></li>
            <li><Link to="/privacidad">Políticas de privacidad</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Pina</h4>
          <ul className="space-y-2 text-sm text-black/70">
            <li>© Pina {new Date().getFullYear()}</li>
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Redes sociales</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

/* --------------------------- CTA móvil ----------------------------- */
function MobileCTA({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="fixed md:hidden bottom-4 left-0 right-0 px-4">
      <div className="mx-auto max-w-sm flex gap-3">
        <button
          onClick={onCreate}
          className="flex-1 py-3 rounded-full text-white font-semibold shadow-lg focus:outline-none focus:ring-4 focus:ring-black/10"
          style={{ background: "var(--color-secondary)" }}
        >
          Comenzar
        </button>
        <Link
          to="/auth/login"
          className="flex-1 py-3 rounded-full text-white text-center font-semibold shadow-lg focus:outline-none focus:ring-4 focus:ring-black/10"
          style={{ background: "var(--color-primary)" }}
        >
          Ingresar
        </Link>
      </div>
    </div>
  );
}

/* =============================== PAGE =============================== */
export function Welcome() {
  const navigate = useNavigate();
  const [primary, setPrimary] = useState("#38b6ff");
  const [secondary, setSecondary] = useState("#f28ae8");
  const headlineColor = getComplementaryColor(primary);

  const handleComenzar = () => navigate("/auth/register");

  return (
    <div
      className="min-h-screen relative"
      style={{
        ["--color-primary" as any]: primary,
        ["--color-secondary" as any]: secondary,
      }}
    >
      {/* fondo sutil con tus colores */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(1200px 600px at 20% 10%, var(--color-primary)/.10, transparent 60%),
            radial-gradient(1000px 500px at 80% 20%, var(--color-secondary)/.12, transparent 65%),
            linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)
          `,
        }}
      />

      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <nav className="flex items-center space-x-8">
          <Link to="/fac" className="text-black font-medium">FAC</Link>
          <Link to="/precios" className="text-black font-medium">Precios</Link>
          <Link to="/recursos" className="text-black font-medium">Recursos</Link>
          <Link to="/labs" className="text-black font-medium">Pina Labs</Link>
        </nav>

        <div className="flex items-center space-x-2 ml-4">
          <Logo color={primary} size={30} />
          <span className="text-xl font-semibold" style={{ color: "var(--color-primary)" }}>Pina</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar creadores"
              aria-label="Buscar creadores"
              className="pl-4 pr-10 py-2 w-28 focus:w-48 transition-all duration-300 rounded-full text-sm bg-rose-100 border focus:outline-none focus:ring-2 border-[var(--color-secondary)] border-opacity-30 focus:ring-[var(--color-secondary)] focus:ring-opacity-50"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button
            onClick={handleComenzar}
            className="px-4 py-2 rounded-full font-medium text-white transition-colors hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-black/10"
            style={{ background: "var(--color-secondary)" }}
          >
            Comenzar
          </button>
          <Link
            to="/auth/login"
            className="px-4 py-2 rounded-full font-medium text-white transition-colors hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-black/10"
            style={{ background: "var(--color-primary)" }}
          >
            Iniciar sesión
          </Link>
        </div>
      </header>

      {/* Pickers de color */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-4 z-50">
        <Colorizer defaultColor="#38b6ff" onChange={setPrimary} classNameProperty="fixed bottom-15 right-4 w-12 h-12 rounded-full cursor-pointer shadow-lg" />
        <Colorizer defaultColor="#f28ae8" onChange={setSecondary} classNameProperty="fixed bottom-4 right-4 w-12 h-12 rounded-full cursor-pointer shadow-lg" />
      </div>

      {/* HERO */}
      <main className="flex items-center justify-center pt-20 pb-8 px-6">
        <div className="text-center max-w-6xl mx-auto flex flex-col min-h-[60vh] justify-end">
          <div className="mb-8">
            {/* si querés complementar el color: style={{ color: headlineColor }} */}
            <h1 className="text-8xl font-bold text-black mb-6 leading-tight">
              Crea con libertad.
              <br />
              Gana con facilidad.
            </h1>
            <p className="text-xl text-black/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Recibe donaciones, suscripciones y ventas, todo en un solo lugar.
            </p>
            <button
              onClick={handleComenzar}
              className="px-8 py-4 rounded-full text-white text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
              style={{ background: "var(--color-secondary)" }}
            >
              Comenzar
            </button>
          </div>
        </div>

        {/* (Nada aquí; las secciones siguen fuera del contenedor del hero) */}
      </main>

      <FeaturesSection />
      <CreatorCTASection onCreate={handleComenzar} />
      <TestimonialsSection />
      <FooterSection />
      <MobileCTA onCreate={handleComenzar} />
    </div>
  );
}
