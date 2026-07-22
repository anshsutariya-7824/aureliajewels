"use client";

import { useState } from "react";
import Link from "next/link";
import { formatImagePath } from "@/lib/utils";

export default function DiamondDetailClient({ diamond, relatedDiamonds, whatsappNumber }) {
  const [activeImage, setActiveImage] = useState(diamond.image);

  const whatsappMsg = encodeURIComponent(
    `Hi CrownCarat, I'm interested in this IGI certified diamond: ${diamond.name} (${diamond.certificate})`
  );

  const contactUrl = `/contact?product=${encodeURIComponent(diamond.name)}`;

  const gallery = diamond.gallery && diamond.gallery.length > 0 ? diamond.gallery : (diamond.image ? [diamond.image] : []);

  return (
    <div>
      <div className="diamond-detail-layout" id="diamondDetailContent">
        {/* Left Side: Image and Photo/Video Toggles */}
        <div className="detail-left reveal active">
          <div className="detail-img-box">
            <img 
              src={formatImagePath(activeImage)} 
              id="detailImage" 
              alt={`${diamond.name} loose diamond showcase`}
            />
          </div>
          
          {gallery.length > 1 && (
            <div className="thumbnail-strip" id="galleryThumbnails" style={{ justifyContent: "center" }}>
              {gallery.map((imgSrc, idx) => (
                <div 
                  key={idx} 
                  className={`thumbnail-item ${activeImage === imgSrc ? "active" : ""}`}
                  onClick={() => setActiveImage(imgSrc)}
                >
                  <img src={formatImagePath(imgSrc)} alt={`${diamond.name} preview angle ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Specs Title and Actions */}
        <div className="detail-right reveal active">
          <div>
            <div className="badge-wrapper" style={{ position: "static", display: "flex", gap: "0.5rem", marginBottom: "1.2rem" }}>
              {diamond.isNew && <span className="badge-new">New</span>}
              {diamond.isFeatured && <span className="badge-featured">Featured</span>}
              {diamond.isRare && <span className="badge-rare">Rare</span>}
              {diamond.isInvestment && <span className="badge-investment">Investment</span>}
            </div>
            <h1 id="detailName">{diamond.name}</h1>
            <p className="detail-subtitle" id="detailSubtitle">
              {diamond.carat} ct<span>&bull;</span>{diamond.cut} Cut<span>&bull;</span>{diamond.clarity} Clarity<span>&bull;</span>{diamond.color} Color
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="detail-actions">
            <a 
              href={`https://wa.me/${whatsappNumber || "919427059390"}?text=${whatsappMsg}`} 
              id="whatsappContactBtn" 
              className="btn-whatsapp" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className="fab fa-whatsapp"></i> Ask on WhatsApp
            </a>
            <Link href={contactUrl} id="inquiryContactBtn" className="btn-inquiry">
              Send Inquiry
            </Link>
          </div>

          {/* Specifications Table */}
          <div>
            <h3 className="specs-title">Diamond Specifications</h3>
            <table className="specs-table" style={{ marginTop: "1rem" }}>
              <tbody>
                <tr>
                  <td>Shape</td>
                  <td>{diamond.shape.charAt(0).toUpperCase() + diamond.shape.slice(1)}</td>
                </tr>
                <tr>
                  <td>Carat Weight</td>
                  <td>{diamond.carat} ct</td>
                </tr>
                <tr>
                  <td>Cut Grade</td>
                  <td>{diamond.cut}</td>
                </tr>
                <tr>
                  <td>Clarity</td>
                  <td>{diamond.clarity}</td>
                </tr>
                <tr>
                  <td>Color</td>
                  <td>{diamond.color}</td>
                </tr>
                <tr>
                  <td>Measurements</td>
                  <td>{diamond.measurements}</td>
                </tr>
                <tr>
                  <td>Table</td>
                  <td>{diamond.table}</td>
                </tr>
                <tr>
                  <td>Depth</td>
                  <td>{diamond.depth}</td>
                </tr>
                <tr>
                  <td>Polish</td>
                  <td>{diamond.polish}</td>
                </tr>
                <tr>
                  <td>Symmetry</td>
                  <td>{diamond.symmetry}</td>
                </tr>
                <tr>
                  <td>Fluorescence</td>
                  <td>{diamond.fluorescence}</td>
                </tr>
                <tr>
                  <td>Certificate</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.9em" }}>{diamond.certificate}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Related Diamonds Grid */}
      {relatedDiamonds.length > 0 && (
        <section className="related-products-section" style={{ borderTop: "1px solid var(--color-border)", marginTop: "4rem" }} id="relatedDiamondsSection">
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", marginBottom: "3rem", textAlign: "center", color: "var(--text-primary)" }}>
            You May Also Like
          </h2>
          <div className="diamonds-grid" id="relatedGrid">
            {relatedDiamonds.map((d) => {
              const badgeNew = d.isNew ? <span className="badge-new">New</span> : null;
              const badgeFeatured = d.isFeatured ? <span className="badge-featured">Featured</span> : null;
              
              return (
                <div key={d.id} className="diamond-card reveal active" style={{ opacity: 1 }}>
                  <Link href={`/diamonds/${d.id}`} style={{ display: "block", color: "inherit" }}>
                    <div className="diamond-img-holder">
                      <div className="badge-wrapper">
                        {badgeNew}
                        {badgeFeatured}
                      </div>
                      <img src={formatImagePath(d.image)} alt={`${d.name} loose diamond showcase`} />
                    </div>
                    <div className="diamond-info">
                      <h3>{d.name}</h3>
                      <p className="diamond-specs">
                        {d.carat} ct<span>&bull;</span>{d.cut}<span>&bull;</span>{d.clarity}<span>&bull;</span>{d.color}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
