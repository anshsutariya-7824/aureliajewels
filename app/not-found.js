import Link from "next/link";

export default function NotFound() {
  return (
    <div 
      className="container" 
      style={{ 
        padding: "8rem 1.5rem 10rem", 
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "75vh"
      }}
    >
      <span 
        style={{ 
          fontFamily: "var(--font-mono)", 
          fontSize: "0.75rem", 
          letterSpacing: "0.2em", 
          textTransform: "uppercase", 
          color: "var(--garnet)", 
          marginBottom: "1.5rem",
          display: "block"
        }}
      >
        Error 404
      </span>
      
      <h1 
        style={{ 
          fontFamily: "var(--font-serif)", 
          fontSize: "clamp(2.5rem, 7vw, 5.5rem)", 
          fontWeight: "400", 
          lineHeight: "1.15", 
          marginBottom: "1.5rem",
          color: "var(--ink)",
          letterSpacing: "-0.02em"
        }}
      >
        Lost in the Details
      </h1>
      
      <div 
        style={{ 
          width: "60px", 
          height: "1px", 
          background: "var(--gold-dim)", 
          margin: "0.5rem auto 2rem" 
        }}
      />
      
      <p 
        style={{ 
          maxWidth: "480px", 
          margin: "0 auto 3rem", 
          fontSize: "1.05rem", 
          color: "var(--ink-soft)",
          lineHeight: "1.7",
          fontWeight: "300"
        }}
      >
        The request you made points to a catalog index or page address that does not exist or has been permanently moved.
      </p>
      
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" className="btn btn-primary" style={{ padding: "0.95rem 2.2rem" }}>
          Return to Home
        </Link>
        <Link href="/collections" className="btn btn-secondary" style={{ padding: "0.95rem 2.2rem" }}>
          Browse Collections
        </Link>
      </div>
    </div>
  );
}
