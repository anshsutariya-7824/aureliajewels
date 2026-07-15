"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import InquireButton from "@/components/InquireButton";

export default function CollectionsCatalog({ initialProducts }) {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter") || "all";
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  useEffect(() => {
    const filter = searchParams.get("filter") || "all";
    setActiveFilter(filter);
  }, [searchParams]);

  const categories = [
    { name: "All Categories", value: "all" },
    { name: "Rings", value: "rings" },
    { name: "Necklaces", value: "necklaces" },
    { name: "Bracelets", value: "bracelets" },
    { name: "Earrings", value: "earrings" },
  ];

  const activeProducts = initialProducts.filter((p) => p.isActive !== false);

  const filteredProducts = activeFilter === "all"
    ? activeProducts
    : activeProducts.filter((p) => p.category === activeFilter);

  return (
    <>
      <div className="filter-tabs reveal active">
        {categories.map((cat) => (
          <button
            key={cat.value}
            className={`filter-btn ${activeFilter === cat.value ? "active" : ""}`}
            onClick={() => setActiveFilter(cat.value)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="products-grid reveal active" id="catalogProductsGrid">
        {filteredProducts.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem 0" }}>
            <i className="fa-regular fa-gem" style={{ fontSize: "3rem", color: "var(--color-gold)", marginBottom: "1.5rem", display: "block" }}></i>
            <h3>No Products Found</h3>
            <p>There are currently no products matching this category in our database.</p>
          </div>
        ) : (
          filteredProducts.map((item) => (
            <div key={item.id} className="product-card" data-category={item.category}>
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
                <InquireButton productName={item.name} />
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
