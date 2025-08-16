import { ImageResponse } from "next/og";

export const runtime = "edge"; // keep icon generation at the edge
export const size = { width: 64, height: 64 }; // fallback meta; Next may not require
export const contentType = "image/png";

export default function Icon() {
  // Simple neutral icon; feel free to revisit visuals later
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "black",
          color: "white",
          fontSize: 42,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        EP
      </div>
    ),
    { width: 64, height: 64 }
  );
}
