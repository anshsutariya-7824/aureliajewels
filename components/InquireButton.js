"use client";

export default function InquireButton({ productName, className = "product-inquire-btn", whatsappNumber }) {
  const handleInquire = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const actualWhatsappNumber = whatsappNumber || "919427059390";
    const customMessage = encodeURIComponent(
      `Hi CrownCarat, I am looking to request a manufacturing quote for bulk orders of ${productName}. Could you please share catalog specifications and FOB pricing?`
    );
    window.open(`https://wa.me/${actualWhatsappNumber}?text=${customMessage}`, "_blank");
  };

  return (
    <span className={className} onClick={handleInquire} style={{ cursor: "pointer" }}>
      Inquire &rarr;
    </span>
  );
}
