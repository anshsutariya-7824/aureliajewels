import { getProductsData, getContentData } from "@/lib/db";
import ProductDetailsClient from "./ProductDetailsClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { products } = await getProductsData();
  const product = products.find(p => p.id === resolvedParams.id);
  
  if (!product) {
    return {
      title: "Product Not Found | AURELIA Jewelry",
    };
  }

  return {
    title: `${product.name} | AURELIA Jewelry`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const { products } = await getProductsData();
  const content = await getContentData();
  const whatsappNumber = content?.settings?.whatsappNumber || "919427059390";
  const product = products.find(p => p.id === resolvedParams.id);

  if (!product) {
    return (
      <div className="container" style={{ padding: "8rem 1.5rem", textAlign: "center" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Product Not Found</h2>
        <p style={{ marginBottom: "2rem" }}>The product you are looking for does not exist in our catalog database.</p>
        <Link href="/collections" className="btn btn-primary">
          Back to Collections
        </Link>
      </div>
    );
  }

  // Get related products (up to 3 matching category, excluding current product and inactive products)
  let relatedProducts = products.filter(p => p.isActive !== false && p.id !== product.id && p.category === product.category);
  if (relatedProducts.length < 3) {
    const fallbacks = products.filter(p => p.isActive !== false && p.id !== product.id && p.category !== product.category);
    relatedProducts = [...relatedProducts, ...fallbacks].slice(0, 3);
  } else {
    relatedProducts = relatedProducts.slice(0, 3);
  }

  return (
    <div>
      {/* Page Hero breadcrumbs */}
      <section className="page-hero" id="productDetailsHero">
        <div className="container">
          <span className="subtitle">Specification Sheet</span>
          <h1>Product Specifications</h1>
          <div className="breadcrumbs">
            <Link href="/">Home</Link> &nbsp;/&nbsp; 
            <Link href="/collections">Collections</Link> &nbsp;/&nbsp; 
            <span>{product.name}</span>
          </div>
        </div>
      </section>

      {/* Main product profile */}
      <section className="catalog-section">
        <ProductDetailsClient product={product} relatedProducts={relatedProducts} whatsappNumber={whatsappNumber} />
      </section>
    </div>
  );
}
