"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SuccessModal from "@/components/SuccessModal";

export default function ContactFormClient({ info, whatsappNumber }) {
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    volume: "",
    interest: "",
    message: "",
    consent: false,
  });

  useEffect(() => {
    const productParam = searchParams.get("product");
    if (productParam) {
      // Auto-prefill interest select if category matches
      let matchedInterest = "Bespoke Custom Order";
      const nameLower = productParam.toLowerCase();
      if (nameLower.includes("ring")) {
        matchedInterest = "Diamond Rings Sourcing";
      } else if (nameLower.includes("necklace") || nameLower.includes("pendant")) {
        matchedInterest = "Fine Necklaces Assembly";
      } else if (nameLower.includes("bangle") || nameLower.includes("bracelet") || nameLower.includes("link")) {
        matchedInterest = "Bangles & Bracelets Sourcing";
      } else if (nameLower.includes("earring") || nameLower.includes("huggie")) {
        matchedInterest = "Fine Earrings Sourcing";
      }

      setFormData((prev) => ({
        ...prev,
        interest: matchedInterest,
        message: `We represent a registered jewelry business and are interested in contract manufacturing/sourcing for: ${productParam}. Could your team provide standard casting estimates, metal alloy samples, and sample prototyping timelines?`,
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company || !formData.message || !formData.consent) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          volume: formData.volume,
          interest: formData.interest,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setModalTitle("Inquiry Submitted");
        setModalText(
          `Thank you, ${formData.name}. We have received your wholesale request for ${formData.interest || "manufacturing catalog"}. A corporate account manager from CrownCarat will contact you at ${formData.email} within 24 hours with our factory pricing sheet and catalogue.`
        );
        setModalOpen(true);
        
        // Reset form
        setFormData({
          name: "",
          company: "",
          email: "",
          phone: "",
          volume: "",
          interest: "",
          message: "",
          consent: false,
        });
      } else {
        alert("Failed to submit inquiry: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error submitting inquiry:", err);
      alert("Something went wrong while submitting your inquiry. Please try again.");
    }
  };

  return (
    <>
      <div className="contact-grid">
        {/* Column 1: Info Panel */}
        <div className="contact-info-panel reveal active">
          <div className="contact-info-item">
            <div className="contact-info-icon"><i className="fa-solid fa-industry"></i></div>
            <div className="contact-info-text">
              <h4>Factory Showroom</h4>
              <p dangerouslySetInnerHTML={{ __html: info.address || "742 Rue du Faubourg Saint-Honoré,<br>75008 Paris, France" }} />
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon"><i className="fa-solid fa-envelope-open-text"></i></div>
            <div className="contact-info-text">
              <h4>Talk to Us</h4>
              <p>
                Direct Phone: <a href={`tel:${info.phone}`} style={{ color: "inherit" }}>{info.phone}</a>
                <br />
                Email: <a href={`mailto:${info.email}`} style={{ color: "inherit" }}>{info.email}</a>
              </p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon"><i className="fa-solid fa-clock"></i></div>
            <div className="contact-info-text">
              <h4>Showroom Hours</h4>
              <table className="hours-table" id="showroomHoursTable">
                <tbody>
                  {info.hours && info.hours.map((h, idx) => (
                    <tr key={idx}>
                      <td>{h.days}</td>
                      <td>{h.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="contact-whatsapp-box">
            <p>Prefer immediate chat? Talk directly with a corporate sourcing manager.</p>
            <a 
              href={`https://wa.me/${whatsappNumber || "919427059390"}?text=Hi%20CrownCarat%2C%20I%27d%20like%20to%20request%20more%20details.`} 
              className="btn btn-secondary" 
              target="_blank" 
              rel="noopener noreferrer" 
              id="whatsappDirectBtn"
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.8rem" }}
            >
              <i className="fab fa-whatsapp"></i> Chat On WhatsApp
            </a>
          </div>
        </div>

        {/* Column 2: Form Panel */}
        <div className="contact-form-panel reveal active">
          <h3>Send Us a Request</h3>
          <p style={{ marginBottom: "2rem", fontSize: "0.95rem" }}>
            Specify your requirements — whether a single bespoke custom design or a high-volume trade order. Our corporate sourcing office will respond with pricing, catalogs, and lead times.
          </p>
          
          <form id="contactForm" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  className="form-control" 
                  placeholder="e.g. John Doe" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="company" className="form-label">Company / Brand Name *</label>
                <input 
                  type="text" 
                  id="company" 
                  className="form-control" 
                  placeholder="e.g. CrownCarat Fine Jewelry (Write 'Individual' if personal)" 
                  required 
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address *</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-control" 
                  placeholder="e.g. contact@yourbrand.com" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="form-control" 
                  placeholder="e.g. +1 (555) 123-4567" 
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="volume" className="form-label">Estimated Order Size *</label>
                <select 
                  id="volume" 
                  className="form-control" 
                  required
                  value={formData.volume}
                  onChange={handleChange}
                >
                  <option value="" disabled hidden>Select your order volume</option>
                  <option value="Single piece">A single custom piece (Bespoke)</option>
                  <option value="Under 100 units/mo">Under 100 units / month</option>
                  <option value="100 - 500 units/mo">100 - 500 units / month</option>
                  <option value="500 - 1000 units/mo">500 - 1000 units / month</option>
                  <option value="1000+ units/mo">1000+ units / month</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="interest" className="form-label">Primary Sourcing Interest *</label>
                <select 
                  id="interest" 
                  className="form-control" 
                  required
                  value={formData.interest}
                  onChange={handleChange}
                >
                  <option value="" disabled hidden>Select an area of interest</option>
                  <option value="Diamond Rings Sourcing">Diamond Rings Sourcing</option>
                  <option value="Fine Necklaces Assembly">Fine Necklaces Assembly</option>
                  <option value="Bangles & Bracelets Sourcing">Bangles & Bracelets Sourcing</option>
                  <option value="Fine Earrings Sourcing">Fine Earrings Sourcing</option>
                  <option value="Bespoke Custom Order">Bespoke Custom Order</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">Tell us more about what you need *</label>
              <textarea 
                id="message" 
                className="form-control" 
                placeholder="Please describe your specifications: target budget, gemstone types, metal carats (e.g. 14k/18k gold, platinum), or specific custom designs..." 
                rows="4" 
                required
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="checkbox-group" style={{ marginTop: "1rem" }}>
              <input 
                type="checkbox" 
                id="consent" 
                required
                checked={formData.consent}
                onChange={handleChange}
              />
              <label htmlFor="consent" style={{ cursor: "pointer" }}>
                I agree to the privacy terms and consent to being contacted by a CrownCarat corporate advisor regarding this request. *
              </label>
            </div>

            <button type="submit" className="btn btn-primary" id="submitFormBtn" style={{ width: "100%", justifyContent: "center", padding: "1.1rem", fontSize: "0.85rem", letterSpacing: "0.15em", cursor: "pointer" }}>
              Submit Sourcing Request
            </button>
          </form>
        </div>
      </div>

      {/* Map Location Section */}
      <section className="map-section" id="contactMap" style={{ paddingTop: "4rem" }}>
        <div className="section-head center">
          <span className="subtitle">Location</span>
          <h2>Visit Our Showroom</h2>
        </div>
        <div className="map-container cert-frame reveal active">
          <iframe 
            src={info.mapUrl || "https://maps.google.com/maps?q=742%20Rue%20du%20Faubourg%20Saint-Honor%C3%A9%2075008%20Paris%20France&t=&z=15&ie=UTF8&iwloc=&output=embed"} 
            width="100%" 
            height="450" 
            style={{ border: 0 }}
            allowFullScreen="" 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="CrownCarat Showroom Location Map"
          ></iframe>
        </div>
      </section>

      <SuccessModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        text={modalText}
      />
    </>
  );
}
