import Link from "next/link";
import { getContentData } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getContentData();
  
  const aboutContent = content.about || {};
  const hero = aboutContent.hero || {
    subtitle: "The People Behind the Pieces",
    title: "Every piece starts with someone who checks their work twice."
  };
  const philosophy = aboutContent.philosophy || {
    subtitle: "Scale & Precision",
    title: "From a single casting bench to a global workshop",
    description1: "AURELIA began as a small casting workshop and has grown into a full manufacturing atelier. We handle 3D CAD modeling, custom casting, and hand-setting under one roof — with the capacity to produce 50,000+ pieces a month for retail chains, wholesalers, and importers, and the patience to build a single custom commission the same way.",
    description2: "Every stone we set is certified conflict-free, and every shipment carries the paperwork to prove it.",
    feature1Title: "RJC Certified Sourcing",
    feature1Desc: "We source only conflict-free metals and diamonds, audited for compliance.",
    feature2Title: "OEM/ODM Castings",
    feature2Desc: "Work with our engineers to create custom 3D CAD models and custom casting molds.",
    image: "images/craftsmanship.png"
  };
  const history = aboutContent.history || {
    subtitle: "Industrial Milestones",
    title: "Our History",
    milestones: []
  };

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero" id="aboutHero">
        <div className="container">
          <span className="subtitle">{hero.subtitle}</span>
          <h1>{hero.title}</h1>
          <div className="breadcrumbs">
            <Link href="/">Home</Link> &nbsp;/&nbsp; <span>About</span>
          </div>
        </div>
      </section>

      {/* Story Details Section */}
      <section className="about-story" id="aboutPhilosophy">
        <div className="container">
          <div className="grid-2">
            <div className="reveal active">
              <span className="subtitle">{philosophy.subtitle}</span>
              <h3 style={{ fontSize: "2.2rem", fontStyle: "italic", marginBottom: "1.5rem" }}>
                {philosophy.title}
              </h3>
              <p>{philosophy.description1}</p>
              <p>{philosophy.description2}</p>
              
              <div className="story-features">
                <div className="story-feature">
                  <h4>{philosophy.feature1Title}</h4>
                  <p>{philosophy.feature1Desc}</p>
                </div>
                <div className="story-feature">
                  <h4>{philosophy.feature2Title}</h4>
                  <p>{philosophy.feature2Desc}</p>
                </div>
              </div>
            </div>
            
            <div className="craft-img-wrapper reveal active">
              <img src={philosophy.image} alt="Aurelia master jeweler hand-finishing a gold ring at the workshop bench" />
            </div>
          </div>
        </div>
      </section>

      {/* The Crafting Process (Timeline) */}
      <section className="crafting-process" id="atelierTimeline">
        <div className="container">
          <span className="subtitle">{history.subtitle}</span>
          <h2>{history.title}</h2>
          
          <div className="steps-container" id="aboutMilestonesGrid">
            {history.milestones && history.milestones.map((m, idx) => (
              <div key={idx} className="step-card reveal active">
                <div className="step-number">{m.year}</div>
                <div className="step-content">
                  <h3>{m.title}</h3>
                  <p>{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="reveal active" id="timelineCta" style={{ textAlign: "center", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <span className="subtitle">Custom Sampling</span>
          <h2 style={{ marginBottom: "1.5rem" }}>Want to See a Sample First?</h2>
          <p style={{ maxWidth: "600px", margin: "0 auto 3rem auto" }}>
            Send your design brief and we'll build a 3D render and a casting proof so you can check every dimension before we run production.
          </p>
          <Link href="/contact" className="btn btn-secondary" id="timelineContactBtn">
            Request a Sample
          </Link>
        </div>
      </section>
    </div>
  );
}
