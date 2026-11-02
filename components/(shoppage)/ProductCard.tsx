// components/(shop)/ProductCard.tsx
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CATEGORY_LABEL, compact, discountPct, inr, type Product } from "@/data/ShopData";
import { useShop } from "./ShopProvider";

const manrope = "font-[family-name:var(--font-manrope)]";
const instrument = "font-[family-name:var(--font-instrument)]";

export function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9Z" />
    </svg>
  );
}

function Chevron({ dir }: { dir: "l" | "r" }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === "l" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} />
    </svg>
  );
}

/** Swipe on phones, arrows + dots on desktop. Missing images fall back to a soft placeholder. */
export function Gallery({ p }: { p: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [broken, setBroken] = useState<Record<number, boolean>>({});
  const n = p.images.length;

  const go = (to: number) => {
    const el = ref.current;
    if (!el) return;
    const t = (to + n) % n;
    el.scrollTo({ left: t * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative overflow-hidden bg-[#E5E7EA]">
      <div
        ref={ref}
        onScroll={(e) => {
          const el = e.currentTarget;
          setI(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {p.images.map((src, k) => (
          <div key={src} className="relative aspect-[4/5] w-full shrink-0 snap-center">
            <div className={`absolute inset-0 flex items-center justify-center ${instrument} text-6xl text-[#1F2326]/10`}>
              {p.name.charAt(0)}
            </div>
            {!broken[k] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={k === 0 ? p.name : `${p.name}, view ${k + 1}`}
                loading={k === 0 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                onError={() => setBroken((b) => ({ ...b, [k]: true }))}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {n > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous picture"
            onClick={() => go(i - 1)}
            className="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#F7F7F5]/95 text-[#1F2326] opacity-0 transition-opacity duration-300 hover:bg-[#F7F7F5] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7C9D6] group-hover:opacity-100 md:flex"
          >
            <Chevron dir="l" />
          </button>
          <button
            type="button"
            aria-label="Next picture"
            onClick={() => go(i + 1)}
            className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#F7F7F5]/95 text-[#1F2326] opacity-0 transition-opacity duration-300 hover:bg-[#F7F7F5] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7C9D6] group-hover:opacity-100 md:flex"
          >
            <Chevron dir="r" />
          </button>
          <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {p.images.map((_, k) => (
              <span key={k} className={`h-[5px] rounded-full transition-all duration-300 ${k === i ? "w-4 bg-[#F7F7F5]" : "w-[5px] bg-[#F7F7F5]/60"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function Price({ p, size = "md" }: { p: Product; size?: "md" | "lg" }) {
  return (
    <div className={`${manrope} flex flex-wrap items-baseline gap-x-2 gap-y-0.5`}>
      <span className={`${size === "lg" ? "text-[17px]" : "text-[15px]"} font-bold text-[#1F2326]`}>{inr(p.price)}</span>
      <span className="text-[13px] text-[#1F2326]/40 line-through">{inr(p.mrp)}</span>
      <span className="text-[12px] font-semibold text-[#1F2326]/70">{discountPct(p)}% off</span>
    </div>
  );
}

export default function ProductCard({ p }: { p: Product }) {
  const { isWished, toggleWish, addToCart } = useShop();
  const wished = isWished(p.id);
  const [size, setSize] = useState<string | null>(p.sizes.length === 1 ? p.sizes[0] : null);
  const [added, setAdded] = useState(false);
  const [needSize, setNeedSize] = useState(false);

  const handleAdd = () => {
    if (!size) {
      setNeedSize(true);
      window.setTimeout(() => setNeedSize(false), 1800);
      return;
    }
    addToCart(p.id, size);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="group flex flex-col">
      <div className="relative">
        <Gallery p={p} />

        {/* Badges */}
        <div className={`pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5 ${manrope}`}>
          {p.isNew && <span className="bg-[#F7F7F5] px-2.5 py-1 text-[11px] font-semibold text-[#1F2326]">New</span>}
          {p.isBest && <span className="bg-[#1F2326] px-2.5 py-1 text-[11px] font-semibold text-[#F7F7F5]">Best seller</span>}
        </div>

        {/* Rating chip (bottom-left, like Myntra) */}
        <div className={`pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 bg-[#F7F7F5]/95 px-2 py-1 text-[11px] font-semibold text-[#1F2326] ${manrope}`}>
          {p.rating.toFixed(1)}
          <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden fill="currentColor"><path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.200 6.300 20.300l1.100-6.300L2.800 9.500l6.400-.9L12 2.800Z" /></svg>
          <span className="h-3 w-px bg-[#1F2326]/20" />
          <span className="font-medium text-[#1F2326]/60">{compact(p.reviews)}</span>
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => toggleWish(p.id)}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F7F5] text-[#1F2326] transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7C9D6]"
        >
          <HeartIcon filled={wished} />
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <p className={`${manrope} text-[12px] text-[#1F2326]/45`}>{CATEGORY_LABEL[p.category]}</p>
        <h3 className={`${manrope} mt-0.5 text-[15px] font-semibold leading-snug text-[#1F2326]`}>{p.name}</h3>
        <p className={`${manrope} mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#1F2326]/55`}>{p.description}</p>
        <div className="mt-3">
          <Price p={p} />
        </div>

        <div className="mt-4">
          <p className={`${manrope} mb-2 text-[12px] ${needSize ? "font-semibold text-[#1F2326]" : "text-[#1F2326]/50"}`}>
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
                  size === s
                    ? "border-[#1F2326] bg-[#1F2326] text-[#F7F7F5]"
                    : needSize
                    ? "border-[#1F2326]/60 text-[#1F2326]"
                    : "border-[#1F2326]/15 text-[#1F2326]/80 hover:border-[#1F2326]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleAdd}
            className={`${manrope} group/btn relative inline-flex w-full items-center justify-center overflow-hidden bg-[#B7C9D6] px-6 py-3.5 text-[13px] font-bold tracking-wide text-[#1F2326] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F2326] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7F5]`}
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-[#1F2326] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover/btn:scale-y-100" />
            <span className="relative transition-colors duration-500 group-hover/btn:text-[#B7C9D6]">
              {added ? "Added to bag" : "Add to bag"}
            </span>
          </button>
          {added && (
            <Link href="/cart" className={`${manrope} text-center text-[12px] font-semibold text-[#1F2326] underline decoration-[#1F2326]/30 underline-offset-4 hover:decoration-[#1F2326]`}>
              Go to bag
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}