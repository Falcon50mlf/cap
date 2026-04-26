import { cn } from "@/lib/utils";

type LogoSize = "nav" | "hero" | "default";

const sizeMap: Record<LogoSize, string> = {
  nav: "text-2xl",
  default: "text-3xl",
  hero: "text-[clamp(48px,8vw,96px)]",
};

export function Logo({
  size = "default",
  className,
}: {
  size?: LogoSize;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "logo-wrap font-display font-extrabold tracking-tight inline-flex items-center leading-none select-none",
        sizeMap[size],
        className
      )}
    >
      <span>Cap</span>
      <span
        aria-hidden="true"
        className="logo-apostrophe text-sun inline-block"
        style={{
          transform: "translateY(-0.08em) scale(1.2)",
          transformOrigin: "center",
          marginLeft: "0.02em",
        }}
      >
        &rsquo;
      </span>
    </span>
  );
}
