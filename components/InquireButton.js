"use client";

export default function InquireButton({ productName, className = "product-inquire-btn" }) {
  const handleInquire = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const whatsappNumber = "919427059390";
    const customMessage = encodeURIComponent(
      `Hi Aurelia Exports, I am looking to request a manufacturing quote for bulk orders of ${productName}. Could you please share catalog specifications and FOB pricing?`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${customMessage}`, "_blank");
  };

  return (
    <span className={className} onClick={handleInquire} style={{ cursor: "pointer" }}>
      Inquire &rarr;
    </span>
  );
}
