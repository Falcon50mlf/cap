"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

type Theme = "dark" | "light";

const STORAGE_KEY = "cap-theme";

export function ThemeToggle({ className }: { className?: string }) {
  // Le thème réel est piloté par <html data-theme>. Le state local sert juste
  // à animer l'icône. On le sync au mount pour éviter le mismatch.
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage indispo (private mode) — silent fail, le state vit en mémoire
    }
  }

  // En SSR/avant mount, on rend un placeholder neutre pour éviter le mismatch
  // (l'état du DOM peut ne pas matcher l'état React au premier render).
  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className={`inline-block w-9 h-9 rounded-xl border border-night-200 ${className ?? ""}`}
      />
    );
  }

  const isDark = theme === "dark";
  const Icon = isDark ? Sun : Moon;
  const label = isDark ? "Passer en mode clair" : "Passer en mode sombre";

  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-xl border border-night-200 hover:border-night-500 hover:bg-night-100 transition-colors ${className ?? ""}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.2 }}
          className="inline-flex"
        >
          <Icon className="w-4 h-4" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
