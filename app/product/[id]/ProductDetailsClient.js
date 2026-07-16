"use client";

import { useState } from "react";
import Link from "next/link";
import InquireButton from "@/components/InquireButton";
import { formatImagePath } from "@/lib/utils";

export default function ProductDetailsClient({ product, relatedProducts, whatsappNumber }) {
  const [activeImage, setActiveImage] = useState(product.image);
  const [activeTab, setActiveTab] = useState("tabSpecs");

  const whatsappQuery = encodeURIComponent(
    `Hi Aurelia Exports, I am looking to request a manufacturing quote for bulk orders of ${product.name} (ID: ${product.id}). Could you please share catalog specifications and FOB pricing?`
  );

  const requestCadUrl = `/contact?product=${product.id}`;

  return (
    <div>
      {/* Normal details layout */}
      <div className="container">
        <div id="productDetailsContent" className="product-details-grid">
          
          {/* Left: Product Media Gallery */}
          <div className="product-media-column reveal active">
            <div className="cert-frame">
              <div className="main-image-wrapper">
                <span className="product-badge" id="productMoqBadge">MOQ: {product.moq}</span>
                <img src={formatImagePath(activeImage)} alt={product.name} id="mainShowcaseImg" />
              </div>
            </div>
            <div className="thumbnail-strip" id="galleryThumbnails">
              {product.gallery && product.gallery.map((imgSrc, idx) => (
                <div 
                  key={idx} 
                  className={`thumbnail-item ${activeImage === imgSrc ? "active" : ""}`}
                  onClick={() => setActiveImage(imgSrc)}
                >
                  <img src={formatImagePath(imgSrc)} alt={`${product.name} preview angle ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Specifications Info */}
          <div className="product-info-column reveal active">
            <span className="product-division-tag" id="productCategoryTag">{product.category.toUpperCase()} DIVISION</span>
            <h1 className="product-title" id="productTitle">{product.name}</h1>
            <p className="product-description" id="productDesc">{product.description}</p>
            
            <div className="spec-report-card cert-frame">
              <div className="report-header">
                <span className="report-title">TECHNICAL PROFILE</span>
                <span className="report-number">REPORT NO. AU-SPEC-B2B</span>
              </div>
               <div className="spec-grid">
                <div className="spec-grid-item full-width">
                  <span className="spec-label"><i className="fa-solid fa-circle-nodes"></i> Metal Alloy Choices</span>
                  <span className="spec-value" id="specAlloys">14k / 18k Yellow Gold, White Gold, Rose Gold, Platinum (PT950)</span>
                </div>
                <div className="spec-grid-item full-width">
                  <span className="spec-label"><i className="fa-solid fa-gem"></i> Gemstone Details</span>
                  <span className="spec-value" id="specGems">{product.gemstones}</span>
                </div>
                <div className="spec-grid-item full-width">
                  <span className="spec-label"><i className="fa-solid fa-calendar-check"></i> Est. Production Lead</span>
                  <span className="spec-value" id="specLead">15 Business Days</span>
                </div>
                <div className="spec-grid-item full-width price-highlight">
                  <span className="spec-label"><i className="fa-solid fa-shield-halved"></i> Pricing Structure</span>
                  <span className="spec-value highlight-gold" id="specPrice">{product.fobPrice}</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons Panel */}
            <div className="detail-action-buttons">
              <Link href={requestCadUrl} className="btn btn-primary" id="btnRequestCad">
                <i className="fa-solid fa-drafting-compass"></i> Request a Sample
              </Link>
              <a 
                href={`https://wa.me/${whatsappNumber || "919427059390"}?text=${whatsappQuery}`} 
                className="btn btn-secondary" 
                id="btnInquireWhatsapp" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <i className="fab fa-whatsapp"></i> Ask on WhatsApp
              </a>
            </div>

            <div className="factory-trust-logos">
              <div className="trust-item"><i className="fa-solid fa-award"></i> <span>RJC Audited</span></div>
              <div className="trust-item"><i className="fa-solid fa-certificate"></i> <span>GIA Assured</span></div>
              <div className="trust-item"><i className="fa-solid fa-globe"></i> <span>Global Freight</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Information & Shipping Tabs Section */}
      <section className="product-tabs-section reveal active" id="productTechnicalInfo" style={{ marginTop: "4rem" }}>
        <div className="container">
          <div className="tabs-header">
            <button 
              className={`tab-link ${activeTab === "tabSpecs" ? "active" : ""}`} 
              onClick={() => setActiveTab("tabSpecs")}
            >
              Casting Details
            </button>
            <button 
              className={`tab-link ${activeTab === "tabPackaging" ? "active" : ""}`} 
              onClick={() => setActiveTab("tabPackaging")}
            >
              Packaging & Freight
            </button>
            <button 
              className={`tab-link ${activeTab === "tabCompliance" ? "active" : ""}`} 
              onClick={() => setActiveTab("tabCompliance")}
            >
              Trade Compliance
            </button>
          </div>

          <div className="tabs-content-wrapper">
            {/* Tab 1: Specs */}
            <div className={`tab-pane ${activeTab === "tabSpecs" ? "active" : ""}`} id="tabSpecs">
              <h3>Advanced Casting Engineering</h3>
              <p>Our casting division leverages computer-aided design (CAD) modeling software to generate exact metal densities. Every batch undergoes ultrasonic gold cleaning and chemical verification tests to guarantee absolute alloy purities matching international trade hallmarking certifications.</p>
              <ul className="spec-detail-list">
                <li><strong>CNC Mold Verification:</strong> 3D master waxes are printed at 25-micron resolutions for perfect geometric fidelity.</li>
                <li><strong>Stone Setting Control:</strong> Hand-setting performed under high-magnification stereomicroscopes with secure bead or claw mountings.</li>
                <li><strong>Laser Markings:</strong> Laser-engraved alloy fineness hallmarks (750 for 18k, 585 for 14k, 950 for Pt) and customer-specified trademark stamps.</li>
              </ul>
            </div>

            {/* Tab 2: Packaging */}
            <div className={`tab-pane ${activeTab === "tabPackaging" ? "active" : ""}`} id="tabPackaging">
              <h3>International Export Boxing</h3>
              <p>To withstand long-distance shipping, bulk orders are packed in heavy-duty moisture-resistant chambers with secure double-seal tracking tags.</p>
              <ul className="spec-detail-list">
                <li><strong>Individual Unit Packaging:</strong> Anti-tarnish velvet boxes or polybag sleeves per client brand guidelines.</li>
                <li><strong>Outer Freight Casing:</strong> Corrugated steel-clad export crates filled with high-impact foam protection barriers.</li>
                <li><strong>Insurance & Air Transport:</strong> Dispatched via fully-insured Malca-Amit or Brinks global luxury logistics networks.</li>
              </ul>
            </div>

            {/* Tab 3: Compliance */}
            <div className={`tab-pane ${activeTab === "tabCompliance" ? "active" : ""}`} id="tabCompliance">
              <h3>Certified Ethical Chain of Custody</h3>
              <p>We believe in strict ethical standards, complying with global human rights laws and responsible metal sourcing frameworks.</p>
              <ul className="spec-detail-list">
                <li><strong>Responsible Jewellery Council (RJC):</strong> Materials are sourced from audited foundries matching certified COP standards.</li>
                <li><strong>Conflict-Free Gems:</strong> Every diamond incorporates Kimberley Process System of Warranties (SoW) validation.</li>
                <li><strong>Anti-Money Laundering (AML):</strong> Fully compliant with international financial export protocols and commercial declarations.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section reveal active" id="relatedProducts" style={{ marginTop: "4rem" }}>
          <div className="container">
            <span className="subtitle">You May Also Like</span>
            <h2>More From This Collection</h2>
            
            <div className="products-grid" id="relatedProductsGrid">
              {relatedProducts.map((item) => (
                <div key={item.id} className="product-card" data-category={item.category}>
                  <Link href={`/product/${item.id}`} className="product-card-link">
                    <div className="product-img-holder">
                      <span className="product-badge">MOQ: {item.moq.split(" ")[0]}</span>
                      <img src={formatImagePath(item.image)} alt={item.name} />
                    </div>
                    <div className="product-info">
                      <span className="product-category">{item.category.toUpperCase()}</span>
                      <h3>{item.name}</h3>
                      <div className="product-specs">
                        <div className="product-spec-item">
                          <span>Metal</span> <span>{item.alloys.split(",")[0]}</span>
                        </div>
                        <div className="product-spec-item">
                          <span>Gemstone</span> <span>{item.gemstones.split(",")[0]}</span>
                        </div>
                        <div className="product-spec-item">
                          <span>Lead Time</span> <span>{item.leadTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="product-footer">
                    <Link href={`/product/${item.id}`} className="product-price">
                      View Details &rarr;
                    </Link>
                    <InquireButton productName={item.name} whatsappNumber={whatsappNumber} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
