import { getProductsData, getContentData } from "@/lib/db";
import DiamondDetailClient from "./DiamondDetailClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { diamonds } = await getProductsData();
  const targetId = resolvedParams.id;
  const diamond = diamonds.find(
    (d) => d.id.toString() === targetId || d.id === parseInt(targetId)
  );

  if (!diamond) {
    return {
      title: "Diamond Not Found | AURELIA Jewelry",
    };
  }

  return {
    title: `${diamond.name} | IGI Certified Diamond | AURELIA Jewelry`,
    description: `IGI Certified ${diamond.name}. Specs: Cut: ${diamond.cut}, Clarity: ${diamond.clarity}, Color: ${diamond.color}, Carat: ${diamond.carat} ct. Certified conflict-free.`,
  };
}

export default async function DiamondDetailPage({ params }) {
  const resolvedParams = await params;
  const { diamonds } = await getProductsData();
  const content = await getContentData();
  const whatsappNumber = content?.settings?.whatsappNumber || "919427059390";
  const targetId = resolvedParams.id;
  const diamond = diamonds.find(
    (d) => d.id.toString() === targetId || d.id === parseInt(targetId)
  );

  if (!diamond) {
    return (
      <div className="container" style={{ padding: "8rem 1.5rem", textAlign: "center" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Diamond Not Found</h2>
        <p style={{ marginBottom: "2rem" }}>The diamond you are looking for does not exist in our catalog database.</p>
        <Link href="/diamonds" className="btn btn-primary">
          Back to Diamond Catalog
        </Link>
      </div>
    );
  }

  // Get 3 other diamonds of same shape, or fallback to others
  let relatedDiamonds = diamonds.filter(
    (d) => d.id !== diamond.id && d.shape === diamond.shape
  );
  if (relatedDiamonds.length < 3) {
    const fallbacks = diamonds.filter(
      (d) => d.id !== diamond.id && d.shape !== diamond.shape
    );
    relatedDiamonds = [...relatedDiamonds, ...fallbacks].slice(0, 3);
  } else {
    relatedDiamonds = relatedDiamonds.slice(0, 3);
  }

  return (
    <div>
      {/* Page Hero breadcrumbs */}
      <section className="page-hero" id="diamondDetailsHero">
        <div className="container">
          <span className="subtitle">Gemological Profile</span>
          <h1>Diamond Specs</h1>
          <div className="breadcrumbs">
            <Link href="/">Home</Link> &nbsp;/&nbsp; 
            <Link href="/diamonds">Diamonds</Link> &nbsp;/&nbsp; 
            <span>{diamond.name}</span>
          </div>
        </div>
      </section>

      {/* Main diamond specs catalog */}
      <section className="catalog-section">
        <div className="container">
          <DiamondDetailClient diamond={diamond} relatedDiamonds={relatedDiamonds} whatsappNumber={whatsappNumber} />
        </div>
      </section>
    </div>
  );
}
