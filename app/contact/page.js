import { getContentData } from "@/lib/db";
import ContactFormClient from "./ContactFormClient";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact Aurelia | Fine Jewelry & Diamond Sourcing",
  description: "Get in touch with Aurelia. Start custom CAD jewelry designs, order prototypes, or request loose diamond pricing.",
};

export default async function ContactPage() {
  const content = await getContentData();
  const contactContent = content.contact || {};
  const hero = contactContent.hero || {
    subtitle: "Get in Touch",
    title: "Let's talk about your order."
  };
  const info = contactContent.info || {
    address: "742 Rue du Faubourg Saint-Honoré,<br>75008 Paris, France",
    phone: "+33 (0) 1 42 68 53 00",
    email: "hello@aureliajewelry.com",
    hours: []
  };

  return (
    <div>
      {/* Contact Hero Banner */}
      <section className="page-hero" id="contactHero">
        <div className="container">
          <span className="subtitle">{hero.subtitle}</span>
          <h1>{hero.title}</h1>
          <div className="breadcrumbs">
            <Link href="/">Home</Link> &nbsp;/&nbsp; <span>Contact</span>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="catalog-section">
        <div className="container">
          <Suspense fallback={<div style={{ textAlign: "center", padding: "4rem 0" }}>Loading contact details...</div>}>
            <ContactFormClient info={info} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
