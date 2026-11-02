// components/(shop)/WishlistPage.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORY_LABEL, getProduct, type Product } from "@/data/ShopData";
import { Gallery, Price } from "./ProductCard";
import { useShop } from "./ShopProvider";

const manrope = "font-[family-name:var(--font-manrope)]";
const instrument = "font-[family-name:var(--font-instrument)]";

function WishCard({ p }: { p: Product }) {
  const { toggleWish, addToCart } = useShop();
  const [size, setSize] = useState<string | null>(p.sizes.length === 1 ? p.sizes[0] : null);
  const [needSize, setNeedSize] = useState(false);

  const moveToBag = () => {
    if (!size) {
      setNeedSize(true);
      window.setTimeout(() => setNeedSize(false), 1800);
      return;
    }
    addToCart(p.id, size);
    toggleWish(p.id); // moved out of the wishlist
  };

  return (
    <article className="group flex flex-col">
      <div className="relative">
        <Gallery p={p} />
        <button
          type="button"
          onClick={() => toggleWish(p.id)}
          aria-label={`Remove ${p.name} from wishlist`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F7F5] text-[#1F2326] transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7C9D6]"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <p className={`${manrope} text-[12px] text-[#1F2326]/45`}>{CATEGORY_LABEL[p.category]}</p>
        <h3 className={`${manrope} mt-0.5 text-[15px] font-semibold leading-snug`}>{p.name}</h3>
        <div className="mt-3">
          <Price p={p} />
        </div>

        <p className={`${manrope} mb-2 mt-4 text-[12px] ${needSize ? "font-semibold" : "text-[#1F2326]/50"}`}>
          {needSize ? "Choose a size to continue" : size ? `Size: ${size}` : "Select size"}
        </p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`Size for ${p.name}`}>
          {p.sizes.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={size === s}
              onClick={() => setSize(s)}
              className={`${manrope} min-w-[40px] border px-3 py-2 text-[12px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7C9D6] ${
                size === s ? "border-[#1F2326] bg-[#1F2326] text-[#F7F7F5]" : "border-[#1F2326]/15 text-[#1F2326]/80 hover:border-[#1F2326]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={moveToBag}
          className={`${manrope} group/btn relative mt-5 inline-flex w-full items-center justify-center overflow-hidden bg-[#B7C9D6] px-6 py-3.5 text-[13px] font-bold tracking-wide text-[#1F2326] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F2326] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7F5]`}
        >
          <span className="absolute inset-0 origin-bottom scale-y-0 bg-[#1F2326] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover/btn:scale-y-100" />
          <span className="relative transition-colors duration-500 group-hover/btn:text-[#B7C9D6]">Move to bag</span>
        </button>
      </div>
    </article>
  );
}

export default function WishlistPage() {
  const { ready, wishlist } = useShop();
  const items = wishlist.map(getProduct).filter(Boolean) as Product[];

  return (
    <section className="min-h-[70svh] w-full bg-[#F7F7F5] px-4 pb-24 pt-12 text-[#1F2326] md:px-10 md:pt-16">
      <h1 className={`${instrument} text-[clamp(44px,7vw,104px)] leading-[0.95] tracking-[-0.03em]`}>Wishlist</h1>
      {ready && items.length > 0 && (
        <p className={`${manrope} mt-4 text-[14px] text-[#1F2326]/55`}>
          {items.length} saved {items.length === 1 ? "piece" : "pieces"}
        </p>
      )}

      {!ready ? null : items.length === 0 ? (
        <div className="mt-16 max-w-md">
          <p className={`${instrument} text-[clamp(28px,4vw,44px)] leading-tight`}>Nothing saved yet</p>
          <p className={`${manrope} mt-3 text-[15px] leading-relaxed text-[#1F2326]/60`}>
            Tap the heart on any piece to keep it here. You can move it to your bag later.
          </p>
          <Link
            href="/shop"
            className={`${manrope} group relative mt-8 inline-flex items-center overflow-hidden bg-[#B7C9D6] px-8 py-4 text-[13px] font-bold tracking-wide text-[#1F2326]`}
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-[#1F2326] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-y-100" />
            <span className="relative transition-colors duration-500 group-hover:text-[#B7C9D6]">Browse the shop</span>
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-14 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <WishCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}