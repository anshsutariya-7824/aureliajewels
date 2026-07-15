import { getProductsData } from "@/lib/db";
import DiamondsCatalogClient from "./DiamondsCatalogClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Loose Certified Diamonds | AURELIA Jewelry",
  description: "Browse GIA certified loose diamonds sorted by carat, color, shape, cut, and clarity.",
};

export default async function DiamondsPage() {
  const { diamonds } = await getProductsData();

  return (
    <div>
      {/* Page Hero Banner */}
      <section className="page-hero" id="diamondsHero">
        <div className="container">
          <span className="subtitle">GIA Assured & Conflict-Free</span>
          <h1>Every diamond, graded before it ships.</h1>
          <p>
            Filter our loose diamond inventory by shape, carat, cut, clarity, and color. Order a stone on its own, or have it set into any piece in our collections.
          </p>
          <div className="breadcrumbs">
            <Link href="/">Home</Link> &nbsp;/&nbsp; <span>Diamonds</span>
          </div>
        </div>
      </section>

      {/* Interactive Diamond Search Catalog Section */}
      <section className="catalog-section" id="diamondCatalog">
        <div className="container">
          <DiamondsCatalogClient initialDiamonds={diamonds} />
        </div>
      </section>
    </div>
  );
}
