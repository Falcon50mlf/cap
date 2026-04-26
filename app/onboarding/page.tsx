import { Logo } from "@/components/layout/logo";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen px-6 md:px-10 py-10 flex flex-col">
      <Logo size="nav" />
      <div className="flex-1 grid place-items-center">
        <div className="text-center max-w-md">
          <div className="font-mono text-[11px] uppercase tracking-widest text-sun mb-3">
            // Onboarding
          </div>
          <h1
            className="font-display font-extrabold tracking-[-0.04em] leading-[0.95]"
            style={{ fontSize: "clamp(48px, 7vw, 88px)" }}
          >
            Bientôt.
          </h1>
          <p className="mt-4 text-snow/60">
            On te demandera juste : lycéen·ne ou jeune diplômé·e ?
          </p>
        </div>
      </div>
    </main>
  );
}
