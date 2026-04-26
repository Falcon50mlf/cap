"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setLoading(false);
        setError(friendlyError(signUpError.message, mode));
        return;
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setLoading(false);
        setError(friendlyError(signInError.message, mode));
        return;
      }
    }

    // Auth OK → décider where based on profile.role
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      setError("Auth réussie mais session introuvable. Réessaie.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    router.push(profile?.role ? "/hub" : "/onboarding");
  }

  return (
    <main className="relative min-h-screen flex flex-col">
      <header className="px-6 md:px-10 py-6 flex items-center justify-between">
        <Logo size="nav" />
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-widest text-night-500">
            {mode === "login" ? "// Bon retour" : "// Bienvenue"}
          </span>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 grid place-items-center px-6 md:px-10 pb-20">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 16 }}
          className="w-full max-w-md"
        >
          <h1
            className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] mb-3"
            style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
          >
            Donne-toi un{" "}
            <span className="text-sun" style={{ fontStyle: "italic" }}>
              cap
            </span>
            <span className="text-sun">.</span>
          </h1>
          <p className="text-snow/70 text-lg mb-3">
            {mode === "login"
              ? "Connecte-toi en 5 secondes."
              : "Crée ton compte en 5 secondes."}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-widest text-night-500 mb-10">
            // Pas d&rsquo;email de confirmation, pas de magic link, juste toi
            et ton cap.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-snow/40 pointer-events-none" />
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prenom@ecole.fr"
                disabled={loading}
                className="w-full bg-night-soft border border-night-200 rounded-2xl pl-14 pr-5 py-5 text-lg font-sans placeholder:text-snow/30 focus:outline-none focus:border-snow transition-colors disabled:opacity-50"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-snow/40 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  mode === "signup"
                    ? "Min. 6 caractères"
                    : "Ton mot de passe"
                }
                disabled={loading}
                className="w-full bg-night-soft border border-night-200 rounded-2xl pl-14 pr-14 py-5 text-lg font-sans placeholder:text-snow/30 focus:outline-none focus:border-snow transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                tabIndex={-1}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-snow/40 hover:text-snow/70 transition-colors"
                aria-label={
                  showPassword
                    ? "Cacher le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-coral/40 bg-coral/10 px-4 py-3 text-coral text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || email.length < 3 || password.length < 6}
              className="w-full inline-flex items-center justify-center gap-2 bg-sun text-night font-bold px-8 py-5 rounded-2xl text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-[1.01] active:scale-[0.99]"
              style={{
                boxShadow: loading ? "none" : "0 0 24px var(--sun)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {mode === "signup" ? "Création..." : "Connexion..."}
                </>
              ) : (
                <>
                  {mode === "signup" ? "Créer mon compte" : "Se connecter"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                setMode((m) => (m === "login" ? "signup" : "login"));
                setError(null);
              }}
              className="text-snow/60 hover:text-snow text-sm transition-colors"
            >
              {mode === "login" ? (
                <>
                  Première fois ?{" "}
                  <span className="text-sun font-semibold">
                    Crée ton compte
                  </span>
                </>
              ) : (
                <>
                  Tu as déjà un compte ?{" "}
                  <span className="text-sun font-semibold">Connecte-toi</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

// Map les messages d'erreur Supabase vers du français parlant.
function friendlyError(msg: string, mode: Mode): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "Email ou mot de passe incorrect.";
  }
  if (m.includes("user already registered") || m.includes("already exists")) {
    return "Cet email est déjà utilisé. Connecte-toi plutôt.";
  }
  if (m.includes("password should be at least")) {
    return "Le mot de passe doit faire au moins 6 caractères.";
  }
  if (m.includes("email not confirmed")) {
    return "Ton email n'est pas confirmé (re-désactive 'Confirm email' dans Supabase).";
  }
  if (m.includes("rate limit")) {
    return "Trop de tentatives. Réessaie dans une minute.";
  }
  if (m.includes("invalid email")) {
    return "Cet email a l'air invalide.";
  }
  return mode === "signup"
    ? `Création impossible : ${msg}`
    : `Connexion impossible : ${msg}`;
}
