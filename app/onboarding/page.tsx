"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Mail,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { createClient } from "@/lib/supabase/client";
import type { Role } from "@/types/database";

type Step = "role" | "email" | "code" | "success";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    if (!role) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Pas de emailRedirectTo : on lit le code 6 chiffres dans l'email.
        // Le magic link reste actif en backup si l'allowlist Supabase est OK.
        data: { role },
      },
    });

    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setStep("code");
  }

  async function verifyCode(token: string) {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (verifyError) {
      setLoading(false);
      setError(verifyError.message);
      return;
    }

    setStep("success");
    // Petite pause visuelle puis redirect
    setTimeout(() => router.push("/hub"), 900);
  }

  return (
    <main className="relative min-h-screen flex flex-col">
      <header className="px-6 md:px-10 py-6 flex items-center justify-between">
        <Logo size="nav" />
        <span className="font-mono text-[11px] uppercase tracking-widest text-night-500">
          {step === "role" && "// Étape 1 / 3"}
          {step === "email" && "// Étape 2 / 3"}
          {step === "code" && "// Étape 3 / 3"}
          {step === "success" && "// Bienvenue"}
        </span>
      </header>

      <div className="flex-1 grid place-items-center px-6 md:px-10 pb-20">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {step === "role" && (
              <RoleStep
                key="role"
                onPick={(r) => {
                  setRole(r);
                  setStep("email");
                }}
              />
            )}
            {step === "email" && role && (
              <EmailStep
                key="email"
                role={role}
                email={email}
                setEmail={setEmail}
                loading={loading}
                error={error}
                onBack={() => {
                  setStep("role");
                  setError(null);
                }}
                onSubmit={sendCode}
              />
            )}
            {step === "code" && role && (
              <CodeStep
                key="code"
                role={role}
                email={email}
                loading={loading}
                error={error}
                onSubmit={verifyCode}
                onResend={() => {
                  setError(null);
                  sendCode();
                }}
                onBack={() => {
                  setStep("email");
                  setError(null);
                }}
              />
            )}
            {step === "success" && <SuccessStep key="success" />}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — Role
// ─────────────────────────────────────────────────────────────────────────────

function RoleStep({ onPick }: { onPick: (r: Role) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 90, damping: 16 }}
    >
      <h1
        className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] text-center mb-3"
        style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
      >
        Tu es...
      </h1>
      <p className="text-center text-snow/60 mb-12 max-w-md mx-auto">
        On adapte Cap&rsquo; à là où tu en es. Pas de mauvaise réponse.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <RoleCard
          color="var(--sun)"
          Icon={GraduationCap}
          title="Lycéen·ne"
          subtitle="J'hésite encore pour mes études"
          tag="Découvre les écoles & métiers"
          onClick={() => onPick("lyceen")}
        />
        <RoleCard
          color="var(--pivot)"
          Icon={Briefcase}
          title="Jeune diplômé·e"
          subtitle="Je cherche mon orientation pro"
          tag="Explore les 6 familles de métiers"
          onClick={() => onPick("diplome")}
        />
      </div>

      <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-widest text-night-500">
        // Tu pourras changer plus tard
      </p>
    </motion.div>
  );
}

function RoleCard({
  color,
  Icon,
  title,
  subtitle,
  tag,
  onClick,
}: {
  color: string;
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  tag: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="text-left p-7 rounded-3xl border-2 transition-shadow hover:shadow-card group"
      style={{ borderColor: color, background: `${color}14` }}
    >
      <div
        className="w-14 h-14 rounded-2xl grid place-items-center mb-6"
        style={{ background: `${color}33`, color }}
      >
        <Icon className="w-7 h-7" />
      </div>
      <div
        className="font-display font-extrabold text-3xl tracking-tight mb-2"
        style={{ color }}
      >
        {title}
      </div>
      <p className="text-snow/70 text-base mb-6">{subtitle}</p>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-snow/50">
          {tag}
        </span>
        <ArrowRight
          className="w-5 h-5 transition-transform group-hover:translate-x-1"
          style={{ color }}
        />
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Email
// ─────────────────────────────────────────────────────────────────────────────

function EmailStep({
  role,
  email,
  setEmail,
  loading,
  error,
  onBack,
  onSubmit,
}: {
  role: Role;
  email: string;
  setEmail: (v: string) => void;
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const accent = role === "lyceen" ? "var(--sun)" : "var(--pivot)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 90, damping: 16 }}
    >
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-snow/60 hover:text-snow text-sm mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      <div
        className="font-mono text-[11px] uppercase tracking-widest mb-3"
        style={{ color: accent }}
      >
        // {role === "lyceen" ? "Lycéen·ne" : "Jeune diplômé·e"}
      </div>
      <h1
        className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-4"
        style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
      >
        Ton email.
      </h1>
      <p className="text-snow/60 mb-10 max-w-md">
        On t&rsquo;envoie un code à 6 chiffres. Pas de mot de passe à retenir.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-snow/40 pointer-events-none" />
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="prenom@ecole.fr"
            disabled={loading}
            className="w-full bg-night-soft border border-night-200 rounded-2xl pl-14 pr-5 py-5 text-lg font-sans placeholder:text-snow/30 focus:outline-none focus:border-snow transition-colors disabled:opacity-50"
            style={{
              boxShadow: error ? `0 0 0 2px var(--coral)` : undefined,
            }}
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-coral text-sm flex items-start gap-2"
          >
            <span>×</span>
            <span>{error}</span>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading || email.length < 3}
          className="w-full inline-flex items-center justify-center gap-2 text-night font-bold px-8 py-5 rounded-2xl text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: accent,
            boxShadow: loading ? "none" : `0 0 24px ${accent}55`,
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Envoi...
            </>
          ) : (
            <>
              Recevoir le code
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <p className="text-center font-mono text-[11px] uppercase tracking-widest text-night-500 pt-2">
          // Aucune donnée vendue. RGPD compliant.
        </p>
      </form>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 3 — 6-digit code
// ─────────────────────────────────────────────────────────────────────────────

function CodeStep({
  role,
  email,
  loading,
  error,
  onSubmit,
  onResend,
  onBack,
}: {
  role: Role;
  email: string;
  loading: boolean;
  error: string | null;
  onSubmit: (token: string) => void;
  onResend: () => void;
  onBack: () => void;
}) {
  const accent = role === "lyceen" ? "var(--sun)" : "var(--pivot)";
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const [resendCooldown, setResendCooldown] = useState(30);

  // Cooldown for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Focus first input on mount
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  function setDigit(i: number, value: string) {
    const v = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    if (v && i < 5) inputs.current[i + 1]?.focus();

    // Auto-submit when all 6 filled
    const filled = [...digits];
    filled[i] = v;
    if (filled.every((d) => d !== "") && filled.join("").length === 6) {
      onSubmit(filled.join(""));
    }
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setDigits(next);
    const lastFilled = Math.min(pasted.length, 6) - 1;
    inputs.current[Math.min(lastFilled + 1, 5)]?.focus();
    if (pasted.length === 6) onSubmit(pasted);
  }

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = digits.join("");
    if (token.length === 6) onSubmit(token);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 90, damping: 16 }}
    >
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-snow/60 hover:text-snow text-sm mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Changer d&rsquo;email
      </button>

      <div
        className="font-mono text-[11px] uppercase tracking-widest mb-3"
        style={{ color: accent }}
      >
        // Code envoyé à <span className="text-snow normal-case">{email}</span>
      </div>
      <h1
        className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-4"
        style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
      >
        Le code.
      </h1>
      <p className="text-snow/60 mb-10 max-w-md">
        Tape les 6 chiffres reçus par email. Valable 1h.
      </p>

      <form onSubmit={handleManualSubmit} className="space-y-6">
        <div className="flex gap-2 sm:gap-3 justify-between max-w-md">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={d}
              disabled={loading}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              className="w-12 h-16 sm:w-14 sm:h-18 bg-night-soft border-2 border-night-200 rounded-2xl text-center font-mono font-bold text-3xl text-snow focus:outline-none focus:border-snow transition-colors disabled:opacity-50"
              style={{
                boxShadow: error
                  ? `0 0 0 2px var(--coral)`
                  : d
                    ? `0 0 0 2px ${accent}88`
                    : undefined,
              }}
            />
          ))}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-coral text-sm flex items-start gap-2"
          >
            <span>×</span>
            <span>{error}</span>
          </motion.div>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-snow/60 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Vérification...
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-night-500">
            // Pas reçu ?
          </span>
          <button
            type="button"
            disabled={resendCooldown > 0 || loading}
            onClick={() => {
              onResend();
              setResendCooldown(30);
            }}
            className="text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:underline"
            style={{ color: accent }}
          >
            {resendCooldown > 0
              ? `Renvoyer (${resendCooldown}s)`
              : "Renvoyer le code"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 4 — Success
// ─────────────────────────────────────────────────────────────────────────────

function SuccessStep() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 90, damping: 16 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0.6, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 12 }}
        className="w-20 h-20 mx-auto mb-8 rounded-3xl grid place-items-center"
        style={{ background: "var(--mint)", color: "var(--night)" }}
      >
        <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
      </motion.div>

      <h1
        className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-4"
        style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
      >
        C&rsquo;est parti.
      </h1>
      <p className="text-snow/60 max-w-md mx-auto">
        On t&rsquo;emmène sur ton hub...
      </p>
    </motion.div>
  );
}
