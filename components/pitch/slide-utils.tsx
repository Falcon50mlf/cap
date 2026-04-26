"use client";

import { motion } from "framer-motion";

export function SlideContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={`min-h-screen w-full flex flex-col px-8 md:px-16 lg:px-24 pt-16 pb-28 ${className}`}
    >
      {children}
    </main>
  );
}

export const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 18 },
  },
};

export function MotionDiv(
  props: React.ComponentProps<typeof motion.div>,
) {
  return <motion.div {...props} />;
}

export function Tag({
  children,
  color = "var(--sun)",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="font-mono text-[12px] uppercase tracking-[0.2em] mb-4"
      style={{ color }}
    >
      {children}
    </motion.div>
  );
}

export function NumCircle({
  n,
  color = "var(--sun)",
}: {
  n: number | string;
  color?: string;
}) {
  return (
    <div
      className="w-10 h-10 rounded-full grid place-items-center font-display font-extrabold text-base shrink-0"
      style={{ background: color, color: "#0E0E10" }}
    >
      {n}
    </div>
  );
}
