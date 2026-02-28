import { SPIRAL_STOPS } from "@/components/spiral/spiralData";

type PageProps = { params: Promise<{ slug: string }> };

export default async function EssayPage({ params }: PageProps) {
  const { slug } = await params;
  const stop = SPIRAL_STOPS.find((s) => s.slug === slug);

  const title = stop?.title ?? slug.replaceAll("-", " ");
  const hook = stop?.hook;
  const tags = stop?.tags ?? [];
  const readTime = stop?.readTime;

  return (
    <main style={{
      minHeight: "100vh",
      background: "#2d3c34",
      color: "#ffffff",
      fontFamily: "var(--font-geist-sans, sans-serif)",
      overflowY: "auto",
    }}>
      {/* top gradient bar */}
      <div style={{
        height: 3,
        background: "linear-gradient(90deg, #e8607a, #B4B7A8)",
      }} />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 100px" }}>

        {/* back link */}
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "rgba(232, 96, 122, 0.75)",
            textDecoration: "none",
            letterSpacing: "0.06em",
            fontWeight: 500,
          }}
        >
          ← back to the spiral
        </a>

        {/* header */}
        <header style={{ marginTop: 40 }}>
          {/* meta row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            {tags.map((tag) => (
              <span key={tag} style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "3px 10px",
                borderRadius: 999,
                background: "rgba(232, 96, 122, 0.12)",
                color: "#e8607a",
                border: "1px solid rgba(232, 96, 122, 0.25)",
              }}>
                {tag}
              </span>
            ))}
            {readTime && (
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>
                {readTime} read
              </span>
            )}
          </div>

          {/* title */}
          <h1 style={{
            fontFamily: "Tanker, sans-serif",
            fontSize: "clamp(32px, 6vw, 56px)",
            fontWeight: 400,
            letterSpacing: "0.05em",
            lineHeight: 1.1,
            margin: "0 0 20px",
            color: "#ffffff",
          }}>
            {title}
          </h1>

          {/* subtitle */}
          {hook && (
            <p style={{
              fontSize: 18,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.55)",
              margin: "0 0 32px",
              fontStyle: "italic",
            }}>
              {hook}
            </p>
          )}

          {/* divider */}
          <div style={{
            height: 1,
            background: "linear-gradient(90deg, rgba(232,96,122,0.4), transparent)",
            marginBottom: 48,
          }} />
        </header>

        {/* essay body */}
        <article style={{
          fontSize: 17,
          lineHeight: 1.8,
          color: "rgba(255,255,255,0.82)",
        }}>
          <p>Write your narrative here. Replace this with your essay content, charts, and interactive components.</p>
        </article>

      </div>
    </main>
  );
}
