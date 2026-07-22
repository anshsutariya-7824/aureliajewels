"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatImagePath } from "@/lib/utils";

export default function HeroSlider({ banners }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    
    // Rotation interval of 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <section className="hero-slider" id="homeHero">
      {banners.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id || index}
            className={`hero-slide ${isActive ? "active" : ""}`}
          >
            {/* Slide Background Image */}
            <div className="hero-slide-bg">
              <img
                src={formatImagePath(slide.image)}
                alt={slide.title || "AURELIA fine jewelry"}
              />
            </div>
            
            {/* Slide Overlay for Readability */}
            <div className="hero-slide-overlay"></div>
            
            {/* Slide Content */}
            <div className="container">
              <div className="hero-content">
                {slide.subtitle && (
                  <span className="subtitle">{slide.subtitle}</span>
                )}
                {slide.title && <h1>{slide.title}</h1>}
                {slide.description && <p>{slide.description}</p>}
                <div className="hero-btns">
                  <Link
                    href="/collections"
                    className="btn btn-secondary"
                    id={`heroExploreBtn-${index}`}
                  >
                    View Collections
                  </Link>
                  <Link
                    href="/contact"
                    className="btn btn-primary"
                    id={`heroBookBtn-${index}`}
                  >
                    Request a Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Slide Navigation Controls */}
      {banners.length > 1 && (
        <>
          {/* Dots Indicator Controls */}
          <div className="hero-slider-nav">
            {banners.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`hero-slider-dot ${index === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Decorative Signature Certificate Card Overlay (kept static across slides) */}
      <div className="hero-cert-card cert-frame">
        <div className="cert-label">Grading Report No. AU-30581</div>
        <div className="cert-row">
          <span>Cut</span>
          <b>Excellent</b>
        </div>
        <div className="cert-row">
          <span>Color</span>
          <b>E</b>
        </div>
        <div className="cert-row">
          <span>Clarity</span>
          <b>VVS1</b>
        </div>
        <div className="cert-row">
          <span>Carat</span>
          <b>2.10</b>
        </div>
      </div>
    </section>
  );
}
