"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Loader2,
  CheckCircle2,
  Building2,
  User,
  Mail,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  open: boolean;
  onClose: () => void;
};

type FormState = {
  school_name: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
  contact_role: string;
  message: string;
};

const empty: FormState = {
  school_name: "",
  contact_first_name: "",
  contact_last_name: "",
  contact_email: "",
  contact_role: "",
  message: "",
};

export function PartnershipDialog({ open, onClose }: Props) {
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("leads").insert({
      school_name: form.school_name,
      contact_first_name: form.contact_first_name,
      contact_last_name: form.contact_last_name,
      contact_email: form.contact_email,
      contact_role: form.contact_role || null,
      message: form.message || null,
      source: "landing",
    });

    setLoading(false);
    if (insertError) {
      setError(
        "Impossible d'envoyer ta candidature. Réessaie ou écris-nous direct.",
      );
      return;
    }
    setDone(true);
  }

  function handleClose() {
    onClose();
    // reset après fermeture
    setTimeout(() => {
      setForm(empty);
      setError(null);
      setDone(false);
    }, 250);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] grid place-items-center px-4 py-10 overflow-y-auto"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-night-soft border border-night-200 rounded-3xl p-6 md:p-10 my-auto"
            style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-pivot mb-2">
                  // Devenir partenaire
                </div>
                <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">
                  {done ? "Reçu." : "Parlons-en."}
                </h2>
              </div>
              <button
                onClick={handleClose}
                aria-label="Fermer"
                className="p-2 rounded-xl border border-night-200 hover:border-night-500 hover:bg-night-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {done ? (
              <SuccessView email={form.contact_email} onClose={handleClose} />
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <p className="text-snow/70 mb-2">
                  On revient vers toi sous{" "}
                  <strong className="text-snow">48h</strong>. Pas de blabla.
                </p>

                <Field
                  Icon={Building2}
                  placeholder="Nom de l'école *"
                  required
                  value={form.school_name}
                  onChange={(v) => set("school_name", v)}
                  disabled={loading}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field
                    Icon={User}
                    placeholder="Prénom *"
                    required
                    value={form.contact_first_name}
                    onChange={(v) => set("contact_first_name", v)}
                    disabled={loading}
                  />
                  <Field
                    placeholder="Nom *"
                    required
                    value={form.contact_last_name}
                    onChange={(v) => set("contact_last_name", v)}
                    disabled={loading}
                  />
                </div>
                <Field
                  Icon={Mail}
                  type="email"
                  placeholder="Email pro *"
                  required
                  value={form.contact_email}
                  onChange={(v) => set("contact_email", v)}
                  disabled={loading}
                />
                <Field
                  placeholder="Ton rôle (optionnel)"
                  value={form.contact_role}
                  onChange={(v) => set("contact_role", v)}
                  disabled={loading}
                />
                <textarea
                  placeholder="Quelques mots sur ton école ou les modules que tu aimerais transformer (optionnel)"
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  disabled={loading}
                  rows={3}
                  className="w-full bg-night border border-night-200 rounded-2xl px-5 py-4 text-base font-sans placeholder:text-snow/30 focus:outline-none focus:border-snow transition-colors disabled:opacity-50 resize-none"
                />

                {error && (
                  <div className="rounded-2xl border border-coral/40 bg-coral/10 px-4 py-3 text-coral text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !form.school_name ||
                    !form.contact_first_name ||
                    !form.contact_last_name ||
                    !form.contact_email
                  }
                  className="w-full inline-flex items-center justify-center gap-2 bg-pivot text-snow font-bold px-8 py-4 rounded-2xl text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    boxShadow: loading ? "none" : "0 0 24px var(--pivot)",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      Envoyer
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-center font-mono text-[10px] uppercase tracking-widest text-night-500 pt-1">
                  // RGPD compliant. Aucune donnée vendue.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  Icon,
  ...props
}: {
  Icon?: React.ComponentType<{ className?: string }>;
  type?: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-snow/40 pointer-events-none" />
      )}
      <input
        type={props.type ?? "text"}
        required={props.required}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        disabled={props.disabled}
        className={`w-full bg-night border border-night-200 rounded-2xl ${Icon ? "pl-12" : "pl-5"} pr-5 py-4 text-base font-sans placeholder:text-snow/30 focus:outline-none focus:border-snow transition-colors disabled:opacity-50`}
      />
    </div>
  );
}

function SuccessView({
  email,
  onClose,
}: {
  email: string;
  onClose: () => void;
}) {
  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ scale: 0.6, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 12 }}
        className="w-16 h-16 mx-auto mb-6 rounded-3xl grid place-items-center"
        style={{ background: "var(--mint)", color: "var(--night)" }}
      >
        <CheckCircle2 className="w-8 h-8" strokeWidth={2.5} />
      </motion.div>
      <p className="text-snow/80 mb-2">
        On a bien reçu ta candidature.
      </p>
      <p className="font-mono text-snow text-sm mb-8 break-all">{email}</p>
      <p className="text-snow/60 mb-8 max-w-sm mx-auto">
        On te répond sous 48h. Si c&rsquo;est urgent, écris à{" "}
        <span className="text-snow">team@cap.app</span>.
      </p>
      <button
        onClick={onClose}
        className="inline-flex items-center gap-2 border border-night-200 text-snow font-semibold px-6 py-3 rounded-2xl hover:bg-night-100 transition-colors"
      >
        Fermer
      </button>
    </div>
  );
}
