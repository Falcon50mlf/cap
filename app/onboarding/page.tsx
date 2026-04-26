"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { createClient } from "@/lib/supabase/client";
import type { Role } from "@/types/database";

export default function OnboardingPage() {
  const router = useRouter();
  const [picking, setPicking] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  // Si pas de session → /login. Si rôle déjà set → /hub.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (profile?.role) {
        router.replace("/hub");
        return;
      }
      setChecking(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function pick(role: Role) {
    setPicking(role);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/login");
      return;
    }

    // Le trigger handle_new_user a déjà créé une row profiles avec role=null.
    // On update.
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (updateError) {
      // Fallback : la row n'existe pas (trigger absent ?), on insert.
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({ id: user.id, role });
      if (insertError) {
        setPicking(null);
        setError(insertError.message);
        return;
      }
    }

    router.push("/hub");
  }

  if (checking) {
    return (
      <main className="min-h-screen grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-snow/50" />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col">
      <header className="px-6 md:px-10 py-6 flex items-center justify-between">
        <Logo size="nav" />
        <span className="font-mono text-[11px] uppercase tracking-widest text-night-500">
          // Une dernière chose
        </span>
      </header>

      <div className="flex-1 grid place-items-center px-6 md:px-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 16 }}
          className="w-full max-w-2xl"
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
              loading={picking === "lyceen"}
              disabled={picking !== null}
              onClick={() => pick("lyceen")}
            />
            <RoleCard
              color="var(--pivot)"
              Icon={Briefcase}
              title="Jeune diplômé·e"
              subtitle="Je cherche mon orientation pro"
              tag="Explore les 6 familles de métiers"
              loading={picking === "diplome"}
              disabled={picking !== null}
              onClick={() => pick("diplome")}
            />
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-coral/40 bg-coral/10 px-4 py-3 text-coral text-sm text-center">
              {error}
            </div>
          )}

          <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-widest text-night-500">
            // Tu pourras changer plus tard
          </p>
        </motion.div>
      </div>
    </main>
  );
}

function RoleCard({
  color,
  Icon,
  title,
  subtitle,
  tag,
  loading,
  disabled,
  onClick,
}: {
  color: string;
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  tag: string;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { y: -4, scale: 1.01 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      disabled={disabled}
      onClick={onClick}
      className="text-left p-7 rounded-3xl border-2 transition-shadow hover:shadow-card group disabled:cursor-not-allowed"
      style={{
        borderColor: color,
        background: `${color}14`,
        opacity: disabled && !loading ? 0.4 : 1,
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl grid place-items-center mb-6"
        style={{ background: `${color}33`, color }}
      >
        {loading ? (
          <Loader2 className="w-7 h-7 animate-spin" />
        ) : (
          <Icon className="w-7 h-7" />
        )}
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
