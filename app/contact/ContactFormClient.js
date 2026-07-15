"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SuccessModal from "@/components/SuccessModal";

export default function ContactFormClient({ info }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company || !formData.message || !formData.consent) {
      alert("Please fill out all required fields.");
      return;
    }

    setModalTitle("Inquiry Submitted");
    setModalText(
      `Thank you, ${formData.name}. We have received your wholesale request for ${formData.interest || "manufacturing catalog"}. A corporate account manager from AURELIA will contact you at ${formData.email} within 24 hours with our factory pricing sheet and catalogue.`
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
  };

  return (
    <>
      <div className="diamond-catalog-layout" style={{ gap: "4rem" }}>
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

          <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "2rem", marginTop: "1rem", textAlign: "center" }}>
            <p style={{ marginBottom: "1.5rem", fontSize: "0.9rem" }}>Prefer immediate chat? Talk directly with a corporate sourcing manager.</p>
            <a 
              href="https://wa.me/919427059390?text=Hi%20Aurelia%2C%20I%27d%20like%20to%20request%20more%20details." 
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
          <p style={{ marginBottom: "2rem", fontSize: "0.95rem" }}>Tell us what you're looking for — a single custom piece or a wholesale order — and an advisor will follow up with pricing and next steps.</p>
          
          <form id="contactForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="text" 
                id="name" 
                className="form-control" 
                placeholder=" " 
                required 
                value={formData.name}
                onChange={handleChange}
              />
              <label htmlFor="name" className="form-label">Full Name *</label>
            </div>

            <div className="form-group">
              <input 
                type="text" 
                id="company" 
                className="form-control" 
                placeholder=" "
                required
                value={formData.company}
                onChange={handleChange}
              />
              <label htmlFor="company" className="form-label">Company Name *</label>
            </div>

            <div className="form-group">
              <input 
                type="email" 
                id="email" 
                className="form-control" 
                placeholder=" " 
                required 
                value={formData.email}
                onChange={handleChange}
              />
              <label htmlFor="email" className="form-label">Email Address *</label>
            </div>

            <div className="form-group">
              <input 
                type="tel" 
                id="phone" 
                className="form-control" 
                placeholder=" "
                value={formData.phone}
                onChange={handleChange}
              />
              <label htmlFor="phone" className="form-label">Phone Number (Optional)</label>
            </div>

            <div className="form-group">
              <select 
                id="volume" 
                className="form-control" 
                required
                value={formData.volume}
                onChange={handleChange}
              >
                <option value="" disabled></option>
                <option value="Single piece">A single custom piece</option>
                <option value="Under 100 units/mo">Under 100 units/mo</option>
                <option value="100 - 500 units/mo">100 - 500 units/mo</option>
                <option value="500 - 1000 units/mo">500 - 1000 units/mo</option>
                <option value="1000+ units/mo">1000+ units/mo</option>
              </select>
              <label htmlFor="volume" className="form-label">Order Size *</label>
            </div>

            <div className="form-group">
              <select 
                id="interest" 
                className="form-control" 
                required
                value={formData.interest}
                onChange={handleChange}
              >
                <option value="" disabled></option>
                <option value="Diamond Rings Sourcing">Diamond Rings Sourcing</option>
                <option value="Fine Necklaces Assembly">Fine Necklaces Assembly</option>
                <option value="Bangles & Bracelets Sourcing">Bangles & Bracelets Sourcing</option>
                <option value="Fine Earrings Sourcing">Fine Earrings Sourcing</option>
                <option value="Bespoke Custom Order">Bespoke Custom Order</option>
              </select>
              <label htmlFor="interest" className="form-label">What Are You Interested In? *</label>
            </div>

            <div className="form-group">
              <textarea 
                id="message" 
                className="form-control" 
                placeholder=" " 
                rows="4" 
                required
                value={formData.message}
                onChange={handleChange}
              ></textarea>
              <label htmlFor="message" className="form-label">Tell us more about what you need *</label>
            </div>

            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="consent" 
                required
                checked={formData.consent}
                onChange={handleChange}
              />
              <label htmlFor="consent">I agree to be contacted about this request. *</label>
            </div>

            <button type="submit" className="btn btn-secondary" id="submitFormBtn" style={{ width: "100%" }}>
              Submit Request
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
            src="https://maps.google.com/maps?q=742%20Rue%20du%20Faubourg%20Saint-Honor%C3%A9%2075008%20Paris%20France&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="450" 
            style={{ border: 0 }}
            allowFullScreen="" 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Aurelia Showroom Location Map"
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
