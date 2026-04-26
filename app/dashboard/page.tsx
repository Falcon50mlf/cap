import { Logo } from "@/components/layout/logo";

export default function DashboardPage() {
  return (
    <main className="min-h-screen px-6 md:px-10 py-10 flex flex-col">
      <Logo size="nav" />
      <div className="flex-1 grid place-items-center">
        <div className="text-center max-w-md">
          <div className="font-mono text-[11px] uppercase tracking-widest text-sun mb-3">
            // Dashboard
          </div>
          <h1
            className="font-display font-extrabold tracking-[-0.04em] leading-[0.95]"
            style={{ fontSize: "clamp(48px, 7vw, 88px)" }}
          >
            WIP
          </h1>
          <p className="mt-4 text-snow/60">
            Ta progression sur les 6 familles + tes contacts ESCP.
          </p>
        </div>
      </div>
    </main>
  );
}
