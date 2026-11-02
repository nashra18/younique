// components/(shop)/ShowcaseRails.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CATEGORY_LABEL, PRODUCTS, type Product } from "@/data/ShopData";
import { HeartIcon, Price } from "../(shoppage)/ProductCard";
import { useShop } from "../(shoppage)/ShopProvider";

const manrope = "font-[family-name:var(--font-manrope)]";
const instrument = "font-[family-name:var(--font-instrument)]";

const SHOP = "/shop";

const NEW_ITEMS = PRODUCTS.filter((p) => p.isNew);
const BEST_ITEMS = PRODUCTS.filter((p) => p.isBest).sort((a, b) => b.reviews - a.reviews);

const CARD_W = "w-[68vw] sm:w-[42vw] md:w-[30vw] lg:w-[23vw] xl:w-[19vw]";

/** Ek baar view mein aaye to true ho jata hai (reveal animation ke liye). */
function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

function Arrow({ dir }: { dir: "l" | "r" }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === "l" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} />
    </svg>
  );
}

function Card({ p, href, index, show }: { p: Product; href: string; index: number; show: boolean }) {
  const { isWished, toggleWish, addToCart } = useShop();
  const [broken, setBroken] = useState(false);
  const wished = isWished(p.id);

  // Add to bag
  const [size, setSize] = useState<string | null>(p.sizes.length === 1 ? p.sizes[0] : null);
  const [added, setAdded] = useState(false);
  const [needSize, setNeedSize] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((id) => window.clearTimeout(id));
  }, []);

  const handleAdd = () => {
    if (!size) {
      setNeedSize(true);
      timers.current.push(window.setTimeout(() => setNeedSize(false), 1800));
      return;
    }
    addToCart(p.id, size);
    setAdded(true);
    timers.current.push(window.setTimeout(() => setAdded(false), 1800));
  };

  return (
    <article
      className={`group/card ${CARD_W} shrink-0 snap-start transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none`}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "none" : "translateY(26px)",
        transitionDelay: show ? `${Math.min(index, 6) * 70}ms` : "0ms",
      }}
    >
      <div className="relative overflow-hidden bg-[#E5E7EA]">
        <Link href={href} aria-label={`${p.name}, view in shop`} className="block">
          <div className="relative aspect-[4/5] w-full">
            <div className={`absolute inset-0 flex items-center justify-center ${instrument} text-6xl text-[#1F2326]/10`}>
              {p.name.charAt(0)}
            </div>
            {!broken && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.images[0]}
                alt={p.name}
                loading="lazy"
                decoding="async"
                draggable={false}
                onError={() => setBroken(true)}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover/card:scale-[1.05] motion-reduce:transition-none"
              />
            )}
          </div>
        </Link>

        {/* Badges */}
        <div className={`pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5 ${manrope}`}>
          {p.isNew && <span className="bg-[#F7F7F5] px-2.5 py-1 text-[11px] font-semibold text-[#1F2326]">New</span>}
          {p.isBest && <span className="bg-[#1F2326] px-2.5 py-1 text-[11px] font-semibold text-[#F7F7F5]">Best seller</span>}
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

      <Link href={href} className="mt-4 block focus-visible:outline-none">
        <p className={`${manrope} text-[12px] text-[#1F2326]/45`}>{CATEGORY_LABEL[p.category]}</p>
        <h3 className={`${manrope} mt-0.5 text-[15px] font-semibold leading-snug text-[#1F2326]`}>{p.name}</h3>
        <div className="mt-2">
          <Price p={p} />
        </div>
      </Link>

      {/* Size */}
      <div className="mt-4">
        <p className={`${manrope} mb-2 text-[12px] ${needSize ? "font-semibold text-[#1F2326]" : "text-[#1F2326]/50"}`} aria-live="polite">
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
              className={`${manrope} min-w-[38px] border px-2.5 py-1.5 text-[12px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7C9D6] ${
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

      {/* Add to bag */}
      <div className="mt-4 flex flex-col gap-2">
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
    </article>
  );
}

function Rail({
  eyebrow,
  title,
  blurb,
  items,
  viewAllHref,
}: {
  eyebrow: string;
  title: string;
  blurb: string;
  items: Product[];
  viewAllHref: string;
}) {
  const [wrapRef, show] = useInViewOnce<HTMLElement>();
  const scroller = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const arrowCls = `flex h-11 w-11 items-center justify-center border border-[#1F2326]/15 text-[#1F2326] transition-colors duration-300 hover:border-[#1F2326] hover:bg-[#1F2326] hover:text-[#F7F7F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7C9D6] disabled:pointer-events-none disabled:opacity-30`;

  return (
    <section ref={wrapRef} className="w-full bg-[#F7F7F5] px-4 py-14 text-[#1F2326] md:px-10 md:py-20">
      {/* Header */}
      <div
        className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none"
        style={{ opacity: show ? 1 : 0, transform: show ? "none" : "translateY(20px)" }}
      >
        <div>
          <p className={`${manrope} text-[12px] font-semibold uppercase tracking-[0.22em] text-[#1F2326]/50`}>{eyebrow}</p>
          <h2 className={`${instrument} mt-3 text-[clamp(40px,6vw,88px)] leading-[0.95] tracking-[-0.03em]`}>{title}</h2>
          <p className={`${manrope} mt-4 max-w-md text-[15px] leading-relaxed text-[#1F2326]/60`}>{blurb}</p>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href={viewAllHref}
            className={`${manrope} text-[12px] font-bold uppercase tracking-[0.18em] underline decoration-[#1F2326]/25 underline-offset-8 transition-colors hover:decoration-[#1F2326]`}
          >
            View all →
          </Link>
          <div className="hidden gap-2 md:flex">
            <button type="button" aria-label={`Previous ${title}`} onClick={() => scrollBy(-1)} disabled={!canPrev} className={arrowCls}>
              <Arrow dir="l" />
            </button>
            <button type="button" aria-label={`Next ${title}`} onClick={() => scrollBy(1)} disabled={!canNext} className={arrowCls}>
              <Arrow dir="r" />
            </button>
          </div>
        </div>
      </div>

      {/* Rail */}
      <div
        ref={scroller}
        onScroll={measure}
        className="-mx-4 mt-8 flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-10 md:mt-10 md:scroll-pl-10 md:gap-5 md:px-10"
      >
        {items.map((p, i) => (
          <Card key={p.id} p={p} href={`${SHOP}?category=${p.category}#shop`} index={i} show={show} />
        ))}

        {/* Last tile: View all */}
        <Link
          href={viewAllHref}
          className={`group/all ${CARD_W} relative flex shrink-0 snap-start flex-col justify-between self-start border border-[#1F2326]/15 p-6 transition-[opacity,transform,border-color] duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] hover:border-[#1F2326] motion-reduce:transition-none`}
          style={{
            aspectRatio: "4 / 5",
            opacity: show ? 1 : 0,
            transform: show ? "none" : "translateY(26px)",
            transitionDelay: show ? `${Math.min(items.length, 6) * 70}ms` : "0ms",
          }}
        >
          <span className={`${manrope} text-[12px] font-semibold uppercase tracking-[0.2em] text-[#1F2326]/50`}>{items.length} pieces</span>
          <span className={`${instrument} text-[clamp(32px,3.2vw,52px)] leading-[1] tracking-[-0.02em]`}>
            See the full
            <br />
            {title.toLowerCase()}
          </span>
          <span className={`${manrope} inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] transition-all duration-500 group-hover/all:gap-5`}>
            View all <span>→</span>
          </span>
        </Link>
      </div>
    </section>
  );
}

export default function New_aarivalsNBestSeller() {
  return (
    <>
      <Rail
        eyebrow="Just landed"
        title="New arrivals"
        blurb="Fresh pieces from this drop. Swipe through, save your favourites, or open the full shop."
        items={NEW_ITEMS}
        viewAllHref={`${SHOP}?category=new#shop`}
      />
      <Rail
        eyebrow="Most loved"
        title="Best sellers"
        blurb="The pieces everyone keeps coming back to, ranked by how many people rated them."
        items={BEST_ITEMS}
        viewAllHref={`${SHOP}?category=best#shop`}
      />
    </>
  );
}