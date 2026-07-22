import Link from "next/link";
import { getProductsData, getContentData } from "@/lib/db";
import InquireButton from "@/components/InquireButton";
import HeroSlider from "@/components/HeroSlider";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getContentData();
  const { products, diamonds } = await getProductsData();
  const whatsappNumber = content?.settings?.whatsappNumber || "919427059390";

  // Home configuration defaults
  const homeContent = content.home || {};
  const hero = homeContent.hero || {
    subtitle: "Exclusive Fine Jewelry & Certified Diamonds",
    title: "Fine jewelry, made to a standard you can verify.",
    description: "AURELIA designs and casts 18k gold and certified diamond jewelry — one bespoke piece for a private client, or a full production run for a retail partner. Every stone traceable, every setting inspected.",
    image: "images/hero-bg.png"
  };
  
  const pillars = homeContent.pillars || [];
  const divisions = homeContent.divisions || {
    subtitle: "Browse by Category",
    title: "Four Divisions, One Standard"
  };
  const craftsmanship = homeContent.craftsmanship || {
    subtitle: "Inside the Workshop",
    title: "Casting and prototyping, done in-house",
    description1: "AURELIA combines 3D resin prototyping, precise CAD modeling, and vacuum induction casting with hand-finishing by master setters. Every setting is checked for accuracy to within 10 microns.",
    description2: "We use only RJC-certified metal and Kimberley Process diamonds — a supply chain our clients can trace, whether they're buying one ring or one thousand.",
    image: "images/craftsmanship_new.png"
  };

  // Get featured diamonds (Limit 3)
  let featuredDiamonds = diamonds.filter(d => d.isFeatured);
  if (featuredDiamonds.length === 0) {
    featuredDiamonds = diamonds.slice(0, 3);
  } else {
    featuredDiamonds = featuredDiamonds.slice(0, 3);
  }

  // Get featured products (Limit 4, active only)
  const featuredProducts = products.filter(p => p.isActive !== false).slice(0, 4);

  // Prepare banners list
  const banners = hero.banners || [
    {
      id: "default",
      image: hero.image,
      subtitle: hero.subtitle,
      title: hero.title,
      description: hero.description
    }
  ];

  return (
    <div>
      {/* Hero Slider Section */}
      <HeroSlider banners={banners} />

      {/* Brand Pillars */}
      <section className="pillars" id="brandPillars">
        <div className="container">
          <div className="pillars-grid" id="brandPillarsGrid">
            {pillars.map((p, idx) => (
              <div key={idx} className="pillar-card reveal active">
                <div className="pillar-icon">
                  <i className={p.icon}></i>
                </div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection Categories */}
      <section className="collections-preview" id="featuredCollection">
        <div className="container">
          <div className="section-head">
            <span className="subtitle">{divisions.subtitle}</span>
            <h2>{divisions.title}</h2>
          </div>

          <div className="categories-grid reveal active">
            <Link href="/collections?filter=rings" className="category-card" id="categoryRings">
              <div className="category-img">
                <img src="images/ring-collection.png" alt="AURELIA gold and diamond ring collection" />
              </div>
              <div className="category-overlay">
                <h3>Rings</h3>
                <span className="btn-text">Shop Rings &rarr;</span>
              </div>
            </Link>

            <Link href="/collections?filter=necklaces" className="category-card" id="categoryNecklaces">
              <div className="category-img">
                <img src="images/necklace-collection.png" alt="AURELIA gold and emerald necklace collection" />
              </div>
              <div className="category-overlay">
                <h3>Necklaces</h3>
                <span className="btn-text">Shop Necklaces &rarr;</span>
              </div>
            </Link>

            <Link href="/collections?filter=bracelets" className="category-card" id="categoryBracelets">
              <div className="category-img">
                <img src="images/bracelet-collection.png" alt="AURELIA diamond bracelet collection" />
              </div>
              <div className="category-overlay">
                <h3>Bangles &amp; Bracelets</h3>
                <span className="btn-text">Shop Bracelets &rarr;</span>
              </div>
            </Link>

            <Link href="/collections?filter=earrings" className="category-card" id="categoryEarrings">
              <div className="category-img">
                <img src="images/earring-collection.png" alt="AURELIA drop earring collection" />
              </div>
              <div className="category-overlay">
                <h3>Earrings</h3>
                <span className="btn-text">Shop Earrings &rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Wholesale & Trade Section */}
      <section className="wholesale-section" id="wholesaleB2B" style={{ borderTop: "1px solid var(--paper-line)", padding: "6rem 0" }}>
        <div className="container">
          <div className="grid-2" style={{ direction: "rtl" }}>
            <div className="wholesale-img-wrapper reveal active cert-frame" style={{ direction: "ltr" }}>
              <img src="images/wholesale-b2b.png" alt="Aurelia wholesale diamond sourcing and bulk jewelry manufacturing setup" />
            </div>
            <div className="wholesale-content reveal active" style={{ direction: "ltr" }}>
              <span className="subtitle">B2B & Sourcing</span>
              <h2>Wholesale & Sourcing Partnerships</h2>
              <p style={{ marginBottom: "1.5rem" }}>
                Aurelia partners with fine jewelry brands, retail chains, and boutique importers to deliver reliable volume casting and precision stone sourcing. By integrating in-house CAD modeling, casting, and certified grading, we assure absolute consistency from sample to final delivery.
              </p>
              <ul className="spec-detail-list" style={{ marginBottom: "2rem", display: "grid", gap: "0.8rem" }}>
                <li style={{ position: "relative", paddingLeft: "1.5rem" }}>
                  <strong>Factory-Direct Sourcing:</strong> Calibrated diamond parcels, custom CAD mountings, and direct pricing sheets.
                </li>
                <li style={{ position: "relative", paddingLeft: "1.5rem" }}>
                  <strong>Ethical Supply Chain:</strong> 100% RJC-certified metals and Kimberley Process conflict-free diamonds.
                </li>
                <li style={{ position: "relative", paddingLeft: "1.5rem" }}>
                  <strong>Global Sourcing Support:</strong> Insured international shipping and customs clearing handled by our logistics team.
                </li>
              </ul>
              <Link href="/contact" className="btn btn-primary" id="wholesaleContactBtn">
                Apply for Trade Account &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Diamond Sourcing Section */}
      <section className="featured-products-section" id="homeDiamonds" style={{ borderTop: "1px solid var(--paper-line)" }}>
        <div className="container">
          <div className="section-head center" style={{ marginLeft: "auto", marginRight: "auto" }}>
            <span className="subtitle">IGI Assured</span>
            <h2>Loose Diamonds, Individually Graded</h2>
            <p style={{ maxWidth: "620px", margin: "1rem auto 0" }}>
              A rotating inventory of calibrated parcels and single certified stones. Have any piece in our collections set with the diamond of your choice.
            </p>
          </div>

          <div className="diamonds-grid reveal active" id="homeDiamondsGrid">
            {featuredDiamonds.map((d) => {
              const badgeNew = d.isNew ? <span className="badge-new">New</span> : null;
              const badgeFeatured = d.isFeatured ? <span className="badge-featured">Featured</span> : null;
              return (
                <div key={d.id} className="diamond-card reveal active">
                  <Link href={`/diamonds/${d.id}`} style={{ display: "block", color: "inherit" }}>
                    <div className="diamond-img-holder">
                      <div className="badge-wrapper">
                        {badgeNew}
                        {badgeFeatured}
                      </div>
                      <img src={d.image} alt={d.name} />
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

          <div style={{ textAlign: "center", marginTop: "3.5rem" }} className="reveal active">
            <Link href="/diamonds" className="btn btn-secondary" id="searchAllDiamondsBtn">
              Browse the Diamond Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products-section" id="featuredProducts" style={{ borderTop: "1px solid var(--paper-line)" }}>
        <div className="container">
          <div className="section-head">
            <span className="subtitle">Signature Pieces</span>
            <h2>Featured Products</h2>
          </div>

          <div className="products-grid reveal active" id="homeProductsGrid">
            {featuredProducts.map((item) => (
              <div key={item.id} className="product-card reveal active" data-category={item.category}>
                <Link href={`/product/${item.id}`} className="product-card-link">
                  <div className="product-img-holder">
                    <span className="product-badge">MOQ: {item.moq.split(" ")[0]}</span>
                    <img src={item.image} alt={item.name} />
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

          <div style={{ textAlign: "center", marginTop: "3.5rem" }} className="reveal active">
            <Link href="/collections" className="btn btn-primary" id="viewAllProductsBtn">
              View Full Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="craftsmanship-teaser" id="craftsmanshipTeaser">
        <div className="container">
          <div className="grid-2">
            <div className="craft-img-wrapper reveal active cert-frame">
              <img src={craftsmanship.image} alt="Master jeweler hand-finishing a diamond setting in the AURELIA workshop" />
            </div>
            <div className="craft-content reveal active">
              <span className="subtitle">{craftsmanship.subtitle}</span>
              <h3>{craftsmanship.title}</h3>
              <p>{craftsmanship.description1}</p>
              <p>{craftsmanship.description2}</p>
              <Link href="/about" className="btn btn-primary" id="teaserAboutBtn">
                Tour the Workshop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section reveal active" id="clientTestimonials">
        <div className="container">
          <div className="section-head center" style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center", marginBottom: "4rem" }}>
            <span className="subtitle">Trusted Worldwide</span>
            <h2>What Our Partners Say</h2>
            <p style={{ maxWidth: "620px", margin: "1rem auto 0" }}>
              We build long-term relationships with retail jewelry stores, private curators, and diamond importers based on certified grading, consistency, and exceptional quality.
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card cert-frame reveal active">
              <div className="testimonial-stars">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <blockquote className="testimonial-quote">
                "Aurelia has transformed our inventory cycle. Their 3D prototyping is accurate down to the micron, and the finished 18k pieces match our CAD files flawlessly. The IGI-certified stones are consistently top-grade."
              </blockquote>
              <div className="testimonial-meta">
                <span className="client-name">Marcus Vance</span>
                <span className="client-title">Director, Vance Luxury Group (New York)</span>
              </div>
            </div>

            <div className="testimonial-card cert-frame reveal active">
              <div className="testimonial-stars">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <blockquote className="testimonial-quote">
                "For our bespoke commissions, Aurelia’s craftsmanship is exceptional. Their sourcing conforms strictly to the Kimberley Process, giving our private buyers complete confidence. Truly the gold standard."
              </blockquote>
              <div className="testimonial-meta">
                <span className="client-name">Evelyn Dubois</span>
                <span className="client-title">Founder, Dubois Fine Art (London)</span>
              </div>
            </div>

            <div className="testimonial-card cert-frame reveal active">
              <div className="testimonial-stars">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <blockquote className="testimonial-quote">
                "Their wholesale casting capacity combined with strict QA has made Aurelia our key manufacturing partner. Lead times are reliable, and their custom-cast mountings have set a new benchmark for our stores."
              </blockquote>
              <div className="testimonial-meta">
                <span className="client-name">Kenji Sato</span>
                <span className="client-title">Head of Procurement, Sato Jewels (Tokyo)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="reveal active" id="inquiryCta" style={{ textAlign: "center", borderTop: "1px solid var(--paper-line)", borderBottom: "1px solid var(--paper-line)" }}>
        <div className="container">
          <span className="subtitle">Custom Orders</span>
          <h2 style={{ marginBottom: "1.5rem" }}>Have Something Specific in Mind?</h2>
          <p style={{ maxWidth: "600px", margin: "0 auto 3rem auto" }}>
            Send us a sketch, a photo, or just a description. We'll return a 3D render and a sample before anything goes into production.
          </p>
          <Link href="/contact" className="btn btn-secondary" id="ctaContactBtn">
            Start Your Order
          </Link>
        </div>
      </section>
    </div>
  );
}
