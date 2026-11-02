// components/(shoppage)/ShopItems.tsx
"use client";

import { Suspense, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FILTERS, PRODUCTS, type Filter } from "@/data/ShopData";
import ProductCard from "./ProductCard";

const manrope = "font-[family-name:var(--font-manrope)]";
const instrument = "font-[family-name:var(--font-instrument)]";

type Sort = "featured" | "low" | "high" | "rating";
const VALID: Filter[] = ["all", "streetwear", "recycled", "tailored", "new", "best"];

function ShopContent() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // The URL is the source of truth: /?category=recycled#shop
  const raw = params.get("category") as Filter | null;
  const filter: Filter = raw && VALID.includes(raw) ? raw : "all";
  const sort = (params.get("sort") as Sort) || "featured";

  const update = (next: { category?: Filter; sort?: Sort }) => {
    const sp = new URLSearchParams(params.toString());
    if (next.category) next.category === "all" ? sp.delete("category") : sp.set("category", next.category);
    if (next.sort) next.sort === "featured" ? sp.delete("sort") : sp.set("sort", next.sort);
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}#shop` : `${pathname}#shop`, { scroll: false });
  };

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: PRODUCTS.length, streetwear: 0, recycled: 0, tailored: 0, new: 0, best: 0 };
    PRODUCTS.forEach((p) => {
      c[p.category]++;
      if (p.isNew) c.new++;
      if (p.isBest) c.best++;
    });
    return c;
  }, []);

  const visible = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (filter === "all") return true;
      if (filter === "new") return !!p.isNew;
      if (filter === "best") return !!p.isBest;
      return p.category === filter;
    });
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [filter, sort]);

  return (
    <section id="shop" className="w-full scroll-mt-4 bg-[#F7F7F5] px-4 pb-24 pt-16 text-[#1F2326] md:px-10 md:pt-24">
      <div>
        <h2 className={`${instrument} text-[clamp(44px,7vw,104px)] leading-[0.95] tracking-[-0.03em]`}>The shop</h2>
        <p className={`${manrope} mt-4 max-w-md text-[15px] leading-relaxed text-[#1F2326]/60`}>
          Streetwear, recycled and tailored pieces. Pick your size, add to your bag, and we will take it from there.
        </p>
      </div>

      {/* Filter bar */}
      <div className="sticky top-0 z-20 -mx-4 mt-10 border-y border-[#1F2326]/10 bg-[#F7F7F5]/95 px-4 py-4 backdrop-blur md:-mx-10 md:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Filter products">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => update({ category: f.key })}
                  className={`${manrope} shrink-0 border px-4 py-2.5 text-[13px] font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7C9D6] ${
                    active
                      ? "border-[#1F2326] bg-[#1F2326] text-[#F7F7F5]"
                      : "border-[#1F2326]/15 text-[#1F2326]/70 hover:border-[#1F2326] hover:text-[#1F2326]"
                  }`}
                >
                  {f.label}
                  <span className={`ml-2 text-[11px] ${active ? "text-[#F7F7F5]/60" : "text-[#1F2326]/35"}`}>{counts[f.key]}</span>
                </button>
              );
            })}
          </div>

          <label className={`${manrope} flex shrink-0 items-center gap-3 text-[13px] text-[#1F2326]/55`}>
            Sort by
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value as Sort })}
              className="border border-[#1F2326]/15 bg-[#F7F7F5] px-3 py-2.5 text-[13px] font-medium text-[#1F2326] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7C9D6]"
            >
              <option value="featured">Featured</option>
              <option value="rating">Top rated</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </label>
        </div>
      </div>

      <p className={`${manrope} mt-6 text-[13px] text-[#1F2326]/50`} aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "piece" : "pieces"}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-14 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}

// useSearchParams() must sit under a <Suspense> in Next 15.
// Import this default export anywhere (home page, /shop, ...) with no extra wrapping.
export default function ShopItems() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}