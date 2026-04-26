import type { Metadata } from "next";
import Script from "next/script";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GrainOverlay } from "@/components/layout/grain-overlay";

// Inline script qui applique le thème AVANT l'hydratation React.
// Évite le FOUC (flash of unstyled content) quand l'user a choisi light.
const themeInitScript = `(function(){try{var t=localStorage.getItem('cap-theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})();`;

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cap' — Donne-toi un cap.",
  description:
    "La plateforme qui te fait découvrir les écoles de commerce et leurs métiers à travers des mini-jeux.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${bricolage.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="cap-theme-init"
          strategy="beforeInteractive"
        >
          {themeInitScript}
        </Script>
      </head>
      <body className="bg-night text-snow font-sans antialiased min-h-screen">
        <GrainOverlay />
        {children}
      </body>
    </html>
  );
}
