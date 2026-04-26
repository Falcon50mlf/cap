import { ImageResponse } from "next/og";

// Favicon dynamique : wordmark "Cap'" avec apostrophe jaune iconique.
// Next.js le sert sur /icon.png et l'injecte automatiquement dans <head>.

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0E0E10",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#F0F0F0",
          fontWeight: 900,
          fontSize: 42,
          letterSpacing: "-0.06em",
          fontFamily: "system-ui, -apple-system, sans-serif",
          lineHeight: 1,
        }}
      >
        Cap
        <span
          style={{
            color: "#FFDC32",
            fontSize: 50,
            marginLeft: -2,
            marginTop: -8,
            fontWeight: 900,
          }}
        >
          &apos;
        </span>
      </div>
    ),
    { ...size },
  );
}
