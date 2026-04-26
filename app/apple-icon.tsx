import { ImageResponse } from "next/og";

// Apple touch icon (iOS home screen, Safari favoris).
// Même monogramme "C'" que /icon, juste plus grand.

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
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          <span style={{ color: "#F0F0F0", fontSize: 130 }}>C</span>
          <span
            style={{
              color: "#FFDC32",
              fontSize: 168,
              marginLeft: -6,
            }}
          >
            ’
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
