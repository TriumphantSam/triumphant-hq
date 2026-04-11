"use client";

import { useState, useMemo } from "react";
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* Search Input */}
          <div style={{ flex: "1 1 300px", position: "relative" }}>
            <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search playbooks, tools, or goals..." 
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

          {/* Sort Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", fontWeight: 600 }}>Sort by:</span>
            <div style={{ position: "relative" }}>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
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
                  appearance: "none",
                }}
              >
                <option value="newest">Latest Published</option>
                <option value="oldest">Oldest First</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="a-z">Name (A-Z)</option>
              </select>
              <div style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(255,255,255,0.5)", fontSize: "0.7rem" }}>▼</div>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            const accent = cat === "All" ? "#00CCFF" : getCategoryColor(cat);
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: isActive ? `${accent}22` : "transparent",
                  border: `1px solid ${isActive ? accent : "rgba(255,255,255,0.15)"}`,
                  color: isActive ? accent : "rgba(255,255,255,0.6)",
                  borderRadius: "99px",
                  padding: "0.4rem 1rem",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {cat}
              </button>
            );
          })}
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
