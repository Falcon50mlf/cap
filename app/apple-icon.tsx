import { ImageResponse } from "next/og";

// Apple touch icon (iOS home screen, Safari favoris).
// Même design que /icon, juste plus grand.

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 116,
          letterSpacing: "-0.06em",
          fontFamily: "system-ui, -apple-system, sans-serif",
          lineHeight: 1,
        }}
      >
        Cap
        <span
          style={{
            color: "#FFDC32",
            fontSize: 140,
            marginLeft: -6,
            marginTop: -22,
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
