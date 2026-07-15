"use client";

import { useState } from "react";
import Link from "next/link";

export default function DiamondsCatalogClient({ initialDiamonds }) {
  const [activeShapes, setActiveShapes] = useState([]);
  const [caratMin, setCaratMin] = useState(0);
  const [caratMax, setCaratMax] = useState(30);
  const [activeCuts, setActiveCuts] = useState([]);
  const [activeClarities, setActiveClarities] = useState([]);
  const [activeColors, setActiveColors] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  // Toggle shape selection
  const toggleShape = (shape) => {
    setActiveShapes((prev) =>
      prev.includes(shape) ? prev.filter((s) => s !== shape) : [...prev, shape]
    );
  };

  // Toggle checkbox helper
  const toggleCheckbox = (value, list, setList) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // Filter logic
  let filtered = initialDiamonds.filter((d) => {
    if (activeShapes.length > 0 && !activeShapes.includes(d.shape)) return false;
    if (d.carat < caratMin || d.carat > caratMax) return false;
    if (activeCuts.length > 0 && !activeCuts.includes(d.cut)) return false;
    if (activeClarities.length > 0 && !activeClarities.includes(d.clarity)) return false;
    if (activeColors.length > 0 && !activeColors.includes(d.color)) return false;
    return true;
  });

  // Sorting logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "newest") {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return b.id - a.id;
    } else if (sortBy === "carat-desc") {
      return b.carat - a.carat;
    } else if (sortBy === "carat-asc") {
      return a.carat - b.carat;
    }
    return 0;
  });

  const shapesList = [
    { name: "Round", value: "round" },
    { name: "Princess", value: "princess" },
    { name: "Emerald", value: "emerald" },
    { name: "Oval", value: "oval" },
    { name: "Cushion", value: "cushion" },
    { name: "Pear", value: "pear" },
    { name: "Marquise", value: "marquise" },
    { name: "Radiant", value: "radiant" },
    { name: "Asscher", value: "asscher" },
    { name: "Heart", value: "heart" },
  ];

  const cutsList = ["Excellent", "Very Good", "Good", "Fair"];
  const claritiesList = [
    { label: "FL (Flawless)", value: "FL" },
    { label: "IF (Internally Flawless)", value: "IF" },
    { label: "VVS1", value: "VVS1" },
    { label: "VVS2", value: "VVS2" },
    { label: "VS1", value: "VS1" },
    { label: "VS2", value: "VS2" },
    { label: "SI1", value: "SI1" },
    { label: "SI2", value: "SI2" },
  ];
  const colorsList = [
    { label: "D (Colorless)", value: "D" },
    { label: "E (Colorless)", value: "E" },
    { label: "F (Colorless)", value: "F" },
    { label: "G (Near Colorless)", value: "G" },
    { label: "H (Near Colorless)", value: "H" },
    { label: "I (Near Colorless)", value: "I" },
    { label: "J (Near Colorless)", value: "J" },
  ];

  return (
    <div className="diamond-catalog-layout">
      {/* Filter Sidebar */}
      <aside className="filter-sidebar" aria-label="Filter panel">
        {/* Shape Filter */}
        <div className="filter-section">
          <h4>Shape</h4>
          <div className="shape-grid">
            {shapesList.map((shape) => (
              <button
                key={shape.value}
                className={`shape-btn ${activeShapes.includes(shape.value) ? "active" : ""}`}
                onClick={() => toggleShape(shape.value)}
              >
                {shape.name}
              </button>
            ))}
          </div>
        </div>

        {/* Carat Weight Filter */}
        <div className="filter-section">
          <h4>Carat Weight</h4>
          <div className="range-inputs">
            <input
              type="number"
              min="0"
              max="30"
              step="0.01"
              value={caratMin}
              onChange={(e) => setCaratMin(parseFloat(e.target.value) || 0)}
              aria-label="Minimum carat weight"
              placeholder="0"
            />
            <span>to</span>
            <input
              type="number"
              min="0"
              max="30"
              step="0.01"
              value={caratMax}
              onChange={(e) => setCaratMax(parseFloat(e.target.value) || 30)}
              aria-label="Maximum carat weight"
              placeholder="30"
            />
          </div>
        </div>

        {/* Cut Grade Filter */}
        <div className="filter-section">
          <h4>Cut Grade</h4>
          {cutsList.map((cut) => (
            <label key={cut} className="checkbox-item">
              <input
                type="checkbox"
                checked={activeCuts.includes(cut)}
                onChange={() => toggleCheckbox(cut, activeCuts, setActiveCuts)}
              />
              <span>{cut}</span>
            </label>
          ))}
        </div>

        {/* Clarity Filter */}
        <div className="filter-section">
          <h4>Clarity</h4>
          {claritiesList.map((clarity) => (
            <label key={clarity.value} className="checkbox-item">
              <input
                type="checkbox"
                checked={activeClarities.includes(clarity.value)}
                onChange={() => toggleCheckbox(clarity.value, activeClarities, setActiveClarities)}
              />
              <span>{clarity.label}</span>
            </label>
          ))}
        </div>

        {/* Color Filter */}
        <div className="filter-section">
          <h4>Color</h4>
          {colorsList.map((color) => (
            <label key={color.value} className="checkbox-item">
              <input
                type="checkbox"
                checked={activeColors.includes(color.value)}
                onChange={() => toggleCheckbox(color.value, activeColors, setActiveColors)}
              />
              <span>{color.label}</span>
            </label>
          ))}
        </div>
      </aside>

      {/* Main Catalog Results Content */}
      <main className="catalog-main" aria-label="Diamond search results">
        <div className="catalog-header">
          <h2>Our Diamonds</h2>
          <div className="catalog-meta">
            <span id="resultsCount">{sorted.length} diamonds found</span>
            <div className="sort-wrapper">
              <select
                id="sortSelect"
                aria-label="Sort options"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="carat-desc">Carat: High to Low</option>
                <option value="carat-asc">Carat: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Diamonds Grid */}
        <div className="diamonds-grid reveal active" id="diamondsGrid" style={{ opacity: 1 }}>
          {sorted.length === 0 ? (
            <div className="no-diamonds-match" style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem 0" }}>
              <i className="fa-regular fa-gem" style={{ fontSize: "3rem", color: "var(--color-gold)", marginBottom: "1.5rem", display: "block" }}></i>
              <h3>No Diamonds Found</h3>
              <p>Try adjusting your search criteria or toggling different specifications.</p>
            </div>
          ) : (
            sorted.map((d) => {
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
                      <img src={d.image} alt={`${d.name} loose diamond showcase`} />
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
            })
          )}
        </div>
      </main>
    </div>
  );
}
