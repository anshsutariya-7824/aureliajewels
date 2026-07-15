"use client";

export default function SuccessModal({ isOpen, onClose, title, text }) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
        padding: "1.5rem"
      }}
      onClick={(e) => {
        if (e.target.id === "successModalWrapper") onClose();
      }}
      id="successModalWrapper"
    >
      <div 
        style={{
          background: "#121214",
          border: "1px solid #d4af37",
          borderRadius: "8px",
          padding: "2.5rem",
          width: "100%",
          maxWidth: "460px",
          textAlign: "center",
          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.7)",
          fontFamily: "'Montserrat', sans-serif"
        }}
      >
        <div style={{ fontSize: "2.5rem", color: "#d4af37", marginBottom: "1rem" }}>
          <i className="fa-solid fa-circle-check"></i>
        </div>
        <h3 
          style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: "1.45rem", 
            color: "#ffffff", 
            marginBottom: "1rem",
            letterSpacing: "1px"
          }}
        >
          {title || "Action Successful"}
        </h3>
        <p 
          style={{ 
            color: "#a0a0ab", 
            fontSize: "0.92rem", 
            lineHeight: "1.6", 
            marginBottom: "2rem" 
          }}
        >
          {text}
        </p>
        <button 
          onClick={onClose}
          style={{
            background: "#d4af37",
            color: "#121214",
            border: "none",
            borderRadius: "4px",
            padding: "0.8rem 2.2rem",
            fontSize: "0.9rem",
            fontWeight: "600",
            cursor: "pointer",
            letterSpacing: "1px",
            textTransform: "uppercase",
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.background = "#aa861c"}
          onMouseLeave={(e) => e.target.style.background = "#d4af37"}
        >
          Close
        </button>
      </div>
    </div>
  );
}
