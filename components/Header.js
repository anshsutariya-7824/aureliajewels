"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Collections", href: "/collections" },
    { name: "Diamonds", href: "/diamonds" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header id="siteHeader" className={isSticky ? "sticky" : ""}>
      <div className="nav-container">
        <Link href="/" className="logo" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg className="logo-svg" viewBox="0 0 100 100" width="28" height="28" style={{ color: "var(--gold)", fill: "none", stroke: "currentColor", strokeWidth: "5", strokeLinejoin: "round", strokeLinecap: "round", flexShrink: 0 }}>
            <path d="M20 75 L10 35 L38 50 L50 20 L62 50 L90 35 L80 75 Z" />
            <path d="M20 75 L50 95 L80 75" />
            <path d="M38 50 L50 75 L62 50" />
            <path d="M50 20 L50 75" />
          </svg>
          <span style={{ fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "1.25rem", display: "inline-flex", alignItems: "center" }}>
            Crown<span style={{ color: "var(--gold)" }}>Carat</span>
          </span>
        </Link>

        <nav className={`nav-links ${isMenuOpen ? "active" : ""}`} aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={isActive ? "active" : ""}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <button
          className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
