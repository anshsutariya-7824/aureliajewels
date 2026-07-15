import { getProductsData } from "@/lib/db";
import CollectionsCatalog from "./CollectionsCatalog";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const { products } = await getProductsData();

  return (
    <div>
      {/* Page Hero Banner */}
      <section className="page-hero" id="collectionsHero">
        <div className="container">
          <span className="subtitle">The Full Catalog</span>
          <h1>Collections</h1>
          <p>Every piece is made to order — as a single custom item or a full wholesale run. Filter by category below.</p>
          <div className="breadcrumbs">
            <Link href="/">Home</Link> &nbsp;/&nbsp; <span>Collections</span>
          </div>
        </div>
      </section>

      {/* Interactive Catalog Section */}
      <section className="catalog-section" id="catalog">
        <div className="container">
          <Suspense fallback={<div style={{ textAlign: "center", padding: "4rem 0" }}>Loading catalog...</div>}>
            <CollectionsCatalog initialProducts={products} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
