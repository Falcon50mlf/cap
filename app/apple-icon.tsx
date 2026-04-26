import { ImageResponse } from "next/og";

// Apple touch icon (iOS home screen, Safari favoris).
// Même design que /icon.svg : apostrophe jaune sur fond noir arrondi.
// On le génère en PNG via ImageResponse pour iOS qui ne lit pas SVG.

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
          borderRadius: 34,
        }}
      >
        <div
          style={{
            transform: "rotate(-10deg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Bulb */}
          <div
            style={{
              width: 50,
              height: 56,
              borderRadius: "50%",
              background: "#FFDC32",
              marginBottom: -8,
            }}
          />
          {/* Tail (trapèze effilé) */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "22px solid transparent",
              borderRight: "22px solid transparent",
              borderTop: "70px solid #FFDC32",
              marginTop: -2,
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
