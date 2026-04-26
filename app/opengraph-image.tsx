import { ImageResponse } from "next/og";

// Image qui s'affiche quand quelqu'un partage le lien Cap' sur Slack /
// WhatsApp / X / LinkedIn. 1200x630 = format OG standard.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const alt = "Cap' — Donne-toi un cap.";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0E0E10",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Tag mono en haut */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 60,
            color: "rgba(255,255,255,0.5)",
            fontSize: 22,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          // 2 univers · 6 familles · 30 métiers
        </div>

        {/* Wordmark Cap' */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 900,
            letterSpacing: "-0.06em",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#F0F0F0", fontSize: 280 }}>Cap</span>
          <span
            style={{
              color: "#FFDC32",
              fontSize: 340,
              marginLeft: -10,
            }}
          >
            ’
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            color: "rgba(240,240,240,0.75)",
            fontSize: 38,
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 400,
            marginTop: 24,
            letterSpacing: "-0.02em",
          }}
        >
          Donne-toi un cap.
        </div>

        {/* Footer mention */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 60,
            color: "rgba(255,255,255,0.4)",
            fontSize: 20,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          // Découvre les écoles de commerce par le jeu
        </div>
      </div>
    ),
    { ...size },
  );
}
