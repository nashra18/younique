// components/(shoppage)/SearchResults.tsx
"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATEGORY_LABEL, PRODUCTS } from "@/data/ShopData";
import ProductCard from "./ProductCard";

const manrope = "font-[family-name:var(--font-manrope)]";
const instrument = "font-[family-name:var(--font-instrument)]";

const SUGGESTIONS = ["Oversized tee", "Cargo", "Blazer", "Jacket", "Denim", "Linen"];

function SearchContent() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();

  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    return PRODUCTS.filter((p) => {
      const hay = `${p.name} ${p.description} ${CATEGORY_LABEL[p.category]}`.toLowerCase();
      return words.every((w) => hay.includes(w)); // every word must match
    });
  }, [q]);

  return (
    <section className="min-h-[70svh] w-full bg-[#F7F7F5] px-4 pb-24 pt-12 text-[#1F2326] md:px-10 md:pt-16">
      <h1 className={`${instrument} text-[clamp(40px,6vw,88px)] leading-[0.95] tracking-[-0.03em]`}>
        {q ? `Results for “${q}”` : "Search"}
      </h1>

      {q && (
        <p className={`${manrope} mt-4 text-[14px] text-[#1F2326]/55`} aria-live="polite">
          {results.length} {results.length === 1 ? "piece" : "pieces"} found
        </p>
      )}

      {results.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-14 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <div className="mt-12 max-w-lg">
          <p className={`${instrument} text-[clamp(26px,3.6vw,40px)] leading-tight`}>
            {q ? "No pieces match that search" : "What are you looking for?"}
          </p>
          <p className={`${manrope} mt-3 text-[15px] leading-relaxed text-[#1F2326]/60`}>
            {q ? "Check the spelling or try a shorter word. These searches work well:" : "Use the search icon in the header, or try one of these:"}
          </p>
          <div className={`${manrope} mt-6 flex flex-wrap gap-2`}>
            {SUGGESTIONS.map((s) => (
              <Link
                key={s}
                href={`/search?q=${encodeURIComponent(s)}`}
                className="border border-[#1F2326]/15 px-4 py-2.5 text-[13px] font-medium transition-colors hover:border-[#1F2326] hover:bg-[#1F2326] hover:text-[#F7F7F5]"
              >
                {s}
              </Link>
            ))}
          </div>
          <Link
            href="/#shop"
            className={`${manrope} mt-8 inline-block text-[13px] font-semibold underline decoration-[#1F2326]/30 underline-offset-4 hover:decoration-[#1F2326]`}
          >
            Browse the whole shop
          </Link>
        </div>
      )}
    </section>
  );
}

// useSearchParams() needs <Suspense>
export default function SearchResults() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}