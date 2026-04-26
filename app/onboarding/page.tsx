"use client";

import { useState } from "react";
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

type Step = "role" | "email" | "sent";

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!role) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/hub`,
        data: { role },
      },
    });

    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setStep("sent");
  }

  return (
    <main className="relative min-h-screen flex flex-col">
      <header className="px-6 md:px-10 py-6 flex items-center justify-between">
        <Logo size="nav" />
        <span className="font-mono text-[11px] uppercase tracking-widest text-night-500">
          {step === "role" && "// Étape 1 / 2"}
          {step === "email" && "// Étape 2 / 2"}
          {step === "sent" && "// Lien envoyé"}
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
                onBack={() => setStep("role")}
                onSubmit={sendMagicLink}
              />
            )}
            {step === "sent" && (
              <SentStep
                key="sent"
                email={email}
                onBack={() => {
                  setStep("email");
                  setError(null);
                }}
              />
            )}
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
        On t&rsquo;envoie un lien magique. Pas de mot de passe à retenir.
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
              Recevoir le lien magique
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
// Step 3 — Sent
// ─────────────────────────────────────────────────────────────────────────────

function SentStep({ email, onBack }: { email: string; onBack: () => void }) {
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
        transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.1 }}
        className="w-20 h-20 mx-auto mb-8 rounded-3xl grid place-items-center"
        style={{ background: "var(--mint)", color: "var(--night)" }}
      >
        <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
      </motion.div>

      <h1
        className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-4"
        style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
      >
        Check tes mails.
      </h1>
      <p className="text-snow/70 max-w-md mx-auto mb-2 text-lg">
        On a envoyé un lien magique à
      </p>
      <p className="font-mono text-snow text-base mb-10 break-all">{email}</p>

      <div className="rounded-2xl border border-night-200 bg-night-soft p-5 max-w-md mx-auto text-left text-sm text-snow/60 space-y-2">
        <p>
          <strong className="text-snow">Tu as 1h</strong> pour cliquer sur le
          lien.
        </p>
        <p>Pas reçu ? Vérifie tes spams ou réessaie.</p>
      </div>

      <button
        onClick={onBack}
        className="mt-8 inline-flex items-center gap-2 text-snow/60 hover:text-snow text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Renvoyer le lien
      </button>
    </motion.div>
  );
}
