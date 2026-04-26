import { ImageResponse } from "next/og";

// Favicon : monogramme "C'" — la lettre + l'apostrophe jaune iconique.
// Le wordmark complet "Cap'" devient illisible au scale favicon (16x16),
// donc on garde l'élément brand le plus distinctif : la grande apostrophe.

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
          <span style={{ color: "#F0F0F0", fontSize: 46 }}>C</span>
          <span
            style={{
              color: "#FFDC32",
              fontSize: 60,
              marginLeft: -2,
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
