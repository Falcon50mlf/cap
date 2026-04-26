import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen px-6 md:px-10 py-10 flex flex-col">
      <Logo size="nav" />
      <div className="flex-1 grid place-items-center">
        <div className="text-center max-w-md">
          <div className="font-mono text-[11px] uppercase tracking-widest text-coral mb-3">
            // Lien expiré
          </div>
          <h1
            className="font-display font-extrabold tracking-[-0.04em] leading-[0.95]"
            style={{ fontSize: "clamp(48px, 7vw, 88px)" }}
          >
            Mince.
          </h1>
          <p className="mt-4 text-snow/60">
            Le lien magique n&rsquo;a pas marché. Demande-en un nouveau.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 bg-sun text-night font-bold px-6 py-3 rounded-2xl"
          >
            Recommencer
          </Link>
        </div>
      </div>
    </main>
  );
}
