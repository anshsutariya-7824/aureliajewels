"use client";

import { useState } from "react";
import Link from "next/link";
import SuccessModal from "./SuccessModal";
import { usePathname } from "next/navigation";

export default function Footer({ settings }) {
  const pathname = usePathname();
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setModalTitle("Subscription Confirmed");
    setModalText("Welcome to the world of AURELIA. You will now receive private access to new collections, exclusive boutique events, and bespoke content.");
    setModalOpen(true);
    setEmail("");
  };

  return (
    <>
      <footer id="siteFooter">
        <div className="container">
          <div className="footer-grid">
            {/* Col 1: Brand Info */}
            <div className="footer-col">
              <h3 className="footer-logo">
                 AURELIA<span>.</span>
              </h3>
              <p>
                Fine jewelry manufacturer and diamond exporter, supplying certified pieces to individual buyers, retail stores, and importers worldwide.
              </p>
              <div className="social-links">
                <a href={settings?.instagram || "#"} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href={settings?.facebook || "#"} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i>
                </a>
              </div>
            </div>
            {/* Col 2 */}
            <div className="footer-col">
              <h4>Explore</h4>
              <nav className="footer-links" aria-label="Footer Navigation">
                <Link href="/">Home</Link>
                <Link href="/about">About Us</Link>
                <Link href="/collections">Collections</Link>
                <Link href="/diamonds">Diamonds</Link>
                <Link href="/contact">Contact</Link>
              </nav>
            </div>
            {/* Col 3 */}
            <div className="footer-col">
              <h4>Assistance</h4>
              <nav className="footer-links" aria-label="Customer Services">
                <Link href="/contact">Custom & Bespoke Orders</Link>
                <Link href="/collections">Wholesale & MOQs</Link>
                <Link href="/contact">Request a Prototype</Link>
                <Link href="/about">Shipping & Export Policy</Link>
              </nav>
            </div>
            {/* Col 4: Newsletter */}
            <div className="footer-col">
              <h4>Stay Updated</h4>
              <p>New collections, diamond arrivals, and trade show dates — a few times a year, nothing more.</p>
              <form className="newsletter-form" id="newsletterForm" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  placeholder="Your email"
                  required
                  aria-label="Newsletter Email Input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="newsletter-btn" aria-label="Submit Newsletter">
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} AURELIA Jewelry Exports. All Rights Reserved. Certified RJC Manufacturer.</p>
          </div>
        </div>
      </footer>

      <SuccessModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        text={modalText}
      />
    </>
  );
}
