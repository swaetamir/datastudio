"use client";

import { SPIRAL_STOPS } from "./spiralData";

interface ListViewProps {
  onClose: () => void;
}

const posts = SPIRAL_STOPS.filter(
  (s) => s.id !== "start" && s.id !== "end"
);

export function ListView({ onClose }: ListViewProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(30, 40, 35, 0.97)",
        backdropFilter: "blur(12px)",
        zIndex: 100,
        overflowY: "auto",
        animation: "listFadeIn 0.5s ease forwards",
        fontFamily: "sans-serif",
      }}
    >
      <style>{`
        @font-face { font-family: "Tanker"; src: url("/fonts/Tanker-Regular.ttf") format("truetype"); }
        @keyframes listFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .list-card:hover { border-color: rgba(232, 96, 122, 0.6) !important; }
        .list-card:hover .list-card-img { transform: scale(1.03); }
      `}</style>

      {/* header */}
      <div style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "48px 24px 32px",
        borderBottom: "1px solid rgba(232, 96, 122, 0.15)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
      }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: "0.18em", color: "rgba(232,96,122,0.7)", textTransform: "uppercase", margin: "0 0 6px" }}>
            the data studio archive
          </p>
          <h1 style={{ fontFamily: "Tanker, sans-serif", fontSize: 36, color: "#ffffff", margin: 0, letterSpacing: "0.06em", lineHeight: 1.1 }}>
            ALL STORIES
          </h1>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8,
            color: "rgba(255,255,255,0.5)",
            fontSize: 12,
            padding: "6px 14px",
            cursor: "pointer",
            letterSpacing: "0.06em",
            fontFamily: "inherit",
          }}
        >
          ← back to spiral
        </button>
      </div>

      {/* post list */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 80px", display: "flex", flexDirection: "column", gap: 16 }}>
        {posts.map((stop) => {
          const isPublished = stop.status === "Published";
          const href = stop.externalUrl ?? (stop.slug ? `/${stop.slug}` : undefined);

          return (
            <a
              key={stop.id}
              href={isPublished && href ? href : undefined}
              target={stop.externalUrl ? "_blank" : undefined}
              rel={stop.externalUrl ? "noopener noreferrer" : undefined}
              className="list-card"
              style={{
                display: "flex",
                gap: 0,
                background: "rgba(73, 91, 81, 0.7)",
                border: "1px solid rgba(232, 96, 122, 0.2)",
                borderRadius: 16,
                overflow: "hidden",
                textDecoration: "none",
                cursor: isPublished && href ? "pointer" : "default",
                transition: "border-color 0.2s ease",
              }}
            >
              {/* image */}
              {stop.image && (
                <div style={{ width: 160, flexShrink: 0, overflow: "hidden" }}>
                  <img
                    src={stop.image}
                    alt={stop.title}
                    className="list-card-img"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.35s ease" }}
                  />
                </div>
              )}

              {/* content */}
              <div style={{ padding: "20px 24px", flex: 1 }}>
                {/* status + read time row */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: isPublished ? "rgba(232,96,122,0.15)" : "rgba(255,255,255,0.06)",
                    color: isPublished ? "#e8607a" : "rgba(255,255,255,0.35)",
                    border: `1px solid ${isPublished ? "rgba(232,96,122,0.3)" : "rgba(255,255,255,0.1)"}`,
                  }}>
                    {stop.status}
                  </span>
                  {stop.readTime && (
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>
                      {stop.readTime}
                    </span>
                  )}
                </div>

                {/* title */}
                <h2 style={{
                  fontFamily: "Tanker, sans-serif",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#ffffff",
                  margin: "0 0 8px",
                  letterSpacing: "0.06em",
                  lineHeight: 1.2,
                }}>
                  {stop.title}
                </h2>

                {/* hook */}
                {stop.hook && (
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: "0 0 12px" }}>
                    {stop.hook}
                  </p>
                )}

                {/* tags */}
                {stop.tags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {stop.tags.map((tag) => (
                      <span key={tag} style={{
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: "rgba(232, 96, 122, 0.08)",
                        color: "rgba(232, 96, 122, 0.6)",
                        border: "1px solid rgba(232, 96, 122, 0.15)",
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* read link */}
                {isPublished && href && (
                  <p style={{ marginTop: 14, fontSize: 11, color: "#e8607a", fontWeight: 600, letterSpacing: "0.04em" }}>
                    Read essay →
                  </p>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
