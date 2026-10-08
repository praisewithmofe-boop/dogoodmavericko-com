// The branded title card (charcoal background, gold eyebrow, bone title),
// shared by the thumbnail generator (1280x720) and the social-share image
// generator (1200x630). Rendered with next/og's ImageResponse (satori).
import React from "react";

export function titleCard(title, width, height, eyebrow = "Dogood Mavericko") {
  return React.createElement(
    "div",
    {
      style: {
        width: `${width}px`,
        height: `${height}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        backgroundColor: "#0b0b0a",
        padding: "88px",
      },
    },
    React.createElement(
      "div",
      {
        style: {
          color: "#c69a3c",
          fontSize: 26,
          letterSpacing: 4,
          textTransform: "uppercase",
          display: "flex",
        },
      },
      eyebrow
    ),
    React.createElement(
      "div",
      {
        style: {
          color: "#f4f2ec",
          fontSize: 58,
          fontWeight: 700,
          marginTop: 28,
          display: "flex",
          lineHeight: 1.2,
        },
      },
      title
    )
  );
}
