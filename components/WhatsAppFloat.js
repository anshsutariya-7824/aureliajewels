"use client";

import { usePathname } from "next/navigation";

export default function WhatsAppFloat({ settings }) {
  const pathname = usePathname();
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }
  const whatsappNumber = settings?.whatsappNumber || "919427059390";
  const message = encodeURIComponent("Hi Aurelia, I'm interested in your jewelry & diamonds.");
  const href = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a 
      href={href}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact Aurelia via WhatsApp"
      id="whatsappButton"
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
}
