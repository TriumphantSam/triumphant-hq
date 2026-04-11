"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { ForgeProduct } from "@/lib/digital-forge";

type ProductCatalogClientProps = {
  products: ForgeProduct[];
};

const CATEGORY_COLORS: Record<string, string> = {
  "AI Systems": "#0066FF",
  "Workflow Design": "#7c3aed",
  "Digital Products": "#00CCFF",
  "Social Media Growth & Monetization": "#f59e0b",
  "agentic AI solutions": "#10b981",
  "audiobooks and audio products": "#ec4899",
  "Creator Content Systems": "#f97316",
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "#0066FF";
}

export default function ProductCatalogClient({ products }: ProductCatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "price-asc" | "price-desc" | "a-z">("newest");

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ["All", ...Array.from(cats)].sort();
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter(p => p.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title?.toLowerCase().includes(lowerQuery) || 
        p.promise?.toLowerCase().includes(lowerQuery) ||
        p.category?.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === "newest" || sortBy === "oldest") {
        const dateA = a.publishing?.publishedAt ? new Date(a.publishing.publishedAt).getTime() : 0;
        const dateB = b.publishing?.publishedAt ? new Date(b.publishing.publishedAt).getTime() : 0;
        return sortBy === "newest" ? dateB - dateA : dateA - dateB;
      }
      if (sortBy === "price-asc" || sortBy === "price-desc") {
        const priceA = a.priceNgn || 0;
        const priceB = b.priceNgn || 0;
        return sortBy === "price-asc" ? priceA - priceB : priceB - priceA;
      }
      if (sortBy === "a-z") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return 0;
    });

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16 pb-24">
      {/* Bundle Includes Banner */}
      <div
        style={{
          background: "rgba(0,102,255,0.06)",
          border: "1px solid rgba(0,102,255,0.2)",
          borderRadius: "12px",
          padding: "1.25rem 1.75rem",
          marginBottom: "2.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1.25rem",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            color: "#00CCFF",
            fontWeight: 700,
            fontSize: "0.82rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Every Bundle Includes:
        </span>
        {[
          "📘 Core Ebook",
          "🤖 Prompt Pack",
          "✅ Implementation Checklist",
          "📋 Template Assets",
          "🎁 Bonus Stack",
        ].map((item) => (
          <span
            key={item}
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            {item}
          </span>
        ))}
      </div>

      {/* FILTER & SORT CONTROLS */}
      <div 
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          marginBottom: "3rem",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          padding: "1.5rem"
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* Search Input */}
          <div style={{ flex: "1 1 300px", position: "relative" }}>
            <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search products by name or promise..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "99px",
                padding: "0.8rem 1.2rem 0.8rem 2.5rem",
                color: "#fff",
                outline: "none",
                fontSize: "0.95rem",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#00CCFF"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
            />
          </div>

          {/* Filters & Sorting */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", zIndex: 20 }}>
            {/* Category Custom Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", position: "relative" }} ref={categoryRef}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", fontWeight: 600 }}>Category:</span>
              <button 
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                style={{
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  padding: "0.7rem 2.5rem 0.7rem 1rem",
                  color: activeCategory === "All" ? "#00CCFF" : getCategoryColor(activeCategory),
                  outline: "none",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minWidth: "200px",
                  position: "relative"
                }}
              >
                <span>{activeCategory.length > 30 ? activeCategory.substring(0, 30) + "..." : activeCategory}</span>
                <span style={{ position: "absolute", right: "1rem", color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", transform: isCategoryOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
              </button>

              {isCategoryOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: "100%",
                  minWidth: "240px",
                  background: "#090d19",
                  border: "1px solid rgba(0,204,255,0.2)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
                  zIndex: 50,
                  maxHeight: "350px",
                  overflowY: "auto"
                }}>
                  {categories.map(cat => {
                    const isActive = activeCategory === cat;
                    const catColor = cat === "All" ? "#00CCFF" : getCategoryColor(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => { setActiveCategory(cat); setIsCategoryOpen(false); }}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "0.8rem 1rem",
                          background: isActive ? "rgba(0,204,255,0.1)" : "transparent",
                          color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                          border: "none",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          fontWeight: isActive ? 700 : 500,
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,204,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? "rgba(0,204,255,0.1)" : "transparent"; e.currentTarget.style.color = isActive ? "#fff" : "rgba(255,255,255,0.7)"; }}
                      >
                        <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: catColor, marginRight: "8px" }} />
                        {cat}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Sort Custom Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", position: "relative" }} ref={sortRef}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", fontWeight: 600 }}>Sort by:</span>
              <button 
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                style={{
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  padding: "0.7rem 2.5rem 0.7rem 1rem",
                  color: "#fff",
                  outline: "none",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  minWidth: "180px",
                  position: "relative"
                }}
              >
                <span>
                  {sortBy === "newest" ? "Latest Published" : 
                   sortBy === "oldest" ? "Oldest First" : 
                   sortBy === "price-desc" ? "Price (High to Low)" : 
                   sortBy === "price-asc" ? "Price (Low to High)" : "Name (A-Z)"}
                </span>
                <span style={{ position: "absolute", right: "1rem", color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", transform: isSortOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
              </button>

              {isSortOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: "100%",
                  minWidth: "180px",
                  background: "#090d19",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
                  zIndex: 50
                }}>
                  {[
                    { val: "newest", label: "Latest Published" },
                    { val: "oldest", label: "Oldest First" },
                    { val: "price-desc", label: "Price (High to Low)" },
                    { val: "price-asc", label: "Price (Low to High)" },
                    { val: "a-z", label: "Name (A-Z)" }
                  ].map(opt => {
                    const isActive = sortBy === opt.val;
                    return (
                      <button
                        key={opt.val}
                        onClick={() => { setSortBy(opt.val as any); setIsSortOpen(false); }}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "0.8rem 1rem",
                          background: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                          color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                          border: "none",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          fontWeight: isActive ? 700 : 500,
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? "rgba(255,255,255,0.05)" : "transparent"; }}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div style={{ padding: "4rem 0", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.1rem" }}>
            No products match your current filters.
          </p>
          <button 
            onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
            style={{ marginTop: "1rem", color: "#00CCFF", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filteredAndSortedProducts.map((product, idx) => {
            const accentColor = getCategoryColor(product.category);
            const isFeatured = product.featured || (sortBy === "newest" && activeCategory === "All" && idx === 0);

            return (
              <Link
                key={product.slug}
                href={`/digital-forge/products/${product.slug}`}
                id={`product-card-${product.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    position: "relative",
                    background: "rgba(5, 8, 20, 0.8)",
                    border: `1px solid ${accentColor}30`,
                    borderTop: `3px solid ${accentColor}`,
                    borderRadius: "16px",
                    padding: "1.85rem",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.22s ease, box-shadow 0.22s ease",
                    cursor: "pointer",
                  }}
                  className="glass-hover"
                >
                  {isFeatured && (
                    <div
                      style={{
                        position: "absolute",
                        top: "1.1rem",
                        right: "1.1rem",
                        background: `${accentColor}22`,
                        border: `1px solid ${accentColor}55`,
                        borderRadius: "100px",
                        padding: "0.2rem 0.65rem",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        color: accentColor,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                      }}
                    >
                      Featured
                    </div>
                  )}

                  {/* Category */}
                  <p
                    style={{
                      color: accentColor,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      marginBottom: "0.9rem",
                    }}
                  >
                    {product.category}
                  </p>

                  {/* Title */}
                  <h2
                    style={{
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      lineHeight: 1.35,
                      marginBottom: "0.85rem",
                      flex: 1,
                    }}
                  >
                    {product.title}
                  </h2>

                  {/* Promise */}
                  <p
                    style={{
                      color: "rgba(255,255,255,0.58)",
                      fontSize: "0.88rem",
                      lineHeight: 1.75,
                      marginBottom: "1.4rem",
                    }}
                  >
                    {product.promise}
                  </p>

                  {/* Includes micro-list */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {product.includes.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "6px",
                          padding: "0.25rem 0.6rem",
                          fontSize: "0.7rem",
                          color: "rgba(255,255,255,0.55)",
                          fontWeight: 500,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* CTA Row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "auto",
                      paddingTop: "1.25rem",
                      borderTop: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      {product.format}
                    </span>
                    <span
                      style={{
                        color: accentColor,
                        fontWeight: 800,
                        fontSize: "0.8rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      Get Access →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
