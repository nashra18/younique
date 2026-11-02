// components/(homepage)/AboutSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/Brand";
import { FREE_DELIVERY_AT, PRODUCTS, inr } from "@/data/ShopData";

const manrope = "font-[family-name:var(--font-manrope)]";
const instrument = "font-[family-name:var(--font-instrument)]";

// public folder ki photos (leading "/" zaroori, "public" path me nahi likhte)
//   public/recycled/recycled1.jpg      ->  /recycled/recycled1.jpg
//   public/streetwear/streetwear8.jpg  ->  /streetwear/streetwear8.jpg
const IMG_A = "/recycled/recycled1.jpg";
const IMG_B = "/streetwear/streetwear8.jpg";

const STORY_HREF = "/our-story";

const STATEMENT = `${BRAND.name} is a label for people who would rather stand out than fit in. Oversized streetwear, reclaimed fabric given a second life, and sharp tailoring, all cut to be worn your way.`;
const WORDS = STATEMENT.split(" ");

const countOf = (c: string) => PRODUCTS.filter((p) => p.category === c).length;

const PILLARS = [
  { n: "01", name: "Streetwear", blurb: "Oversized cuts, everyday attitude.", count: countOf("streetwear"), href: "/shop?category=streetwear#shop" },
  { n: "02", name: "Recycled", blurb: "Reclaimed fabric, one of one.", count: countOf("recycled"), href: "/shop?category=recycled#shop" },
  { n: "03", name: "Tailored", blurb: "Sharp fits, made to be worn in.", count: countOf("tailored"), href: "/shop?category=tailored#shop" },
];

const STATS = [
  { v: String(PRODUCTS.length), l: "Pieces in the shop" },
  { v: "3", l: "Collections" },
  { v: inr(FREE_DELIVERY_AT), l: "Free delivery above" },
];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** true ho jata hai jab element pehli baar view me aaye */
function useSeen<T extends HTMLElement>(threshold = 0.15) {
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
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, seen] as const;
}

/** Image: neeche se wipe-reveal, andar slow zoom-out, scroll par halka parallax */
function ImageFrame({
  src,
  alt,
  aspect,
  speed = 0.06,
  caption,
  className = "",
}: {
  src: string;
  alt: string;
  aspect: string;
  speed?: number;
  caption: string;
  className?: string;
}) {
  // FIX: observer unclipped <figure> par, clipped box par nahi
  const [figRef, seen] = useSeen<HTMLElement>(0.2);
  const boxRef = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [broken, setBroken] = useState(false);

  // Agar image hydration se pehle hi fail ho chuki ho
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      console.error("Image failed to load:", src);
      setBroken(true);
    }
  }, [src]);

  // Parallax
  useEffect(() => {
    const box = boxRef.current;
    const el = inner.current;
    if (!box || !el || prefersReduced()) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = box.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -120 || r.top > vh + 120) return;
      const centre = r.top + r.height / 2 - vh / 2;
      const lim = r.height * 0.09;
      const y = clamp(-centre * speed, -lim, lim);
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <figure ref={figRef} className={className}>
      <div
        ref={boxRef}
        className={`relative w-full overflow-hidden bg-[#E5E7EA] ${aspect} transition-[clip-path] duration-[1400ms] ease-[cubic-bezier(.7,0,.2,1)] motion-reduce:transition-none`}
        style={{ clipPath: seen ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
      >
        {/* Placeholder letter (image fail ho ya load ho raha ho) */}
        <div
          className={`absolute inset-0 flex items-center justify-center ${instrument} text-7xl text-[#1F2326]/10`}
        >
          {BRAND.name.charAt(0)}
        </div>

        <div ref={inner} className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform">
          {!broken && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              decoding="async"
              draggable={false}
              onError={() => {
                console.error("Image failed to load:", src);
                setBroken(true);
              }}
              className="h-full w-full object-cover transition-transform duration-[2200ms] ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none"
              style={{ transform: seen ? "scale(1)" : "scale(1.25)" }}
            />
          )}
        </div>
      </div>

      <figcaption
        className={`${manrope} mt-3 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.18em] text-[#1F2326]/55 transition-opacity duration-700 delay-700 motion-reduce:transition-none`}
        style={{ opacity: seen ? 1 : 0 }}
      >
        <span>{caption}</span>
        <span aria-hidden>↗</span>
      </figcaption>
    </figure>
  );
}

export default function About() {
  const stmt = useRef<HTMLParagraphElement>(null);
  const [headRef, headSeen] = useSeen<HTMLDivElement>(0.2);
  const [colRef, colSeen] = useSeen<HTMLDivElement>(0.12);
  const [statsRef, statsSeen] = useSeen<HTMLDivElement>(0.3);

  // Statement: scroll karte hi shabd ek ek karke (dim se full) roshan hote hain
  useEffect(() => {
    const el = stmt.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
    const n = words.length;

    if (prefersReduced()) {
      words.forEach((w) => (w.style.opacity = "1"));
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 jab block 85% height par pahunche, 1 jab uska neecha 50% par ho
      const p = clamp((vh * 0.85 - r.top) / (vh * 0.35 + r.height));
      const t = p * 1.12;
      for (let i = 0; i < n; i++) {
        const start = (i / n) * 0.85;
        words[i].style.opacity = String(0.16 + 0.84 * clamp((t - start) / 0.14));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const reveal = (on: boolean, delay = 0) => ({
    opacity: on ? 1 : 0,
    transform: on ? "none" : "translateY(24px)",
    transitionDelay: on ? `${delay}ms` : "0ms",
  });
  const revealCls =
    "transition-[opacity,transform] duration-[1000ms] ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none";

  return (
    <section
      id="story"
      aria-labelledby="about-title"
      className="relative w-full scroll-mt-20 bg-[#F7F7F5] px-4 py-20 text-[#1F2326] md:scroll-mt-24 md:px-10 md:py-32"
    >
      {/* Top row */}
      <div
        ref={headRef}
        className={`${manrope} flex items-center justify-between text-[12px] font-semibold uppercase tracking-[0.22em] ${revealCls}`}
        style={reveal(headSeen)}
      >
        <span id="about-title">(About us)</span>
        <span className="text-[#1F2326]/50">Be uniquely you.</span>
      </div>

      {/* Statement */}
      <p
        ref={stmt}
        className={`${instrument} mt-8 max-w-[22ch] text-[clamp(32px,5.4vw,84px)] leading-[1.02] tracking-[-0.03em] md:mt-12 md:max-w-6xl`}
      >
        <span className="sr-only">{STATEMENT}</span>
        <span aria-hidden>
          {WORDS.map((w, i) => (
            <span
              key={i}
              data-w
              className={`mr-[0.22em] inline-block will-change-[opacity] ${i === 0 ? "italic" : ""}`}
              style={{ opacity: 0.16 }}
            >
              {w}
            </span>
          ))}
        </span>
      </p>

      {/* Images + copy */}
      <div className="mt-16 grid gap-y-16 md:mt-28 md:grid-cols-12 md:gap-x-10">
        {/* Image A */}
        <ImageFrame
          src={IMG_A}
          alt="Patchwork denim jacket from the Recycled collection"
          aspect="aspect-[4/5]"
          speed={0.07}
          caption="(01) Recycled, one of one"
          className="md:col-span-6 lg:col-span-5"
        />

        {/* Copy + Image B */}
        <div ref={colRef} className="flex flex-col md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          <p
            className={`${manrope} max-w-md text-[15px] leading-relaxed text-[#1F2326]/65 ${revealCls}`}
            style={reveal(colSeen)}
          >
            Every piece starts with a simple idea: clothes should feel like you, not like everyone else.
            That is why we mix relaxed street silhouettes with reworked fabric and clean tailoring, and
            keep each drop small enough to feel personal.
          </p>

          {/* Pillars */}
          <ul className={`mt-10 border-t border-[#1F2326]/15 ${revealCls}`} style={reveal(colSeen, 150)}>
            {PILLARS.map((p) => (
              <li key={p.n} className="border-b border-[#1F2326]/15">
                <Link
                  href={p.href}
                  className="group/row flex items-center justify-between gap-4 py-5 transition-[padding] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] hover:pl-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7C9D6]"
                >
                  <span className="flex items-baseline gap-4">
                    <span className={`${manrope} text-[11px] font-semibold tracking-[0.18em] text-[#1F2326]/40`}>
                      {p.n}
                    </span>
                    <span>
                      <span className={`${instrument} block text-[clamp(26px,2.6vw,38px)] leading-none tracking-[-0.02em]`}>
                        {p.name}
                      </span>
                      <span className={`${manrope} mt-1.5 block text-[13px] text-[#1F2326]/55`}>{p.blurb}</span>
                    </span>
                  </span>
                  <span
                    className={`${manrope} flex shrink-0 items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1F2326]/55`}
                  >
                    {p.count} pieces
                    <span className="transition-transform duration-500 group-hover/row:translate-x-1.5" aria-hidden>
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className={`mt-10 ${revealCls}`} style={reveal(colSeen, 300)}>
            <Link
          href={STORY_HREF}
              className={`${manrope} group relative inline-flex items-center gap-3 overflow-hidden bg-[#B7C9D6] px-7 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-[#1F2326] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F2326] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7F5]`}
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-[#1F2326] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-y-100" />
              <span className="relative transition-colors duration-500 group-hover:text-[#B7C9D6]">
                Discover our story
              </span>
              <span
                className="relative transition-all duration-500 group-hover:translate-x-1 group-hover:text-[#B7C9D6]"
                aria-hidden
              >
                →
              </span>
            </Link>
          </div>

          {/* Image B (offset) */}
          <ImageFrame
            src={IMG_B}
            alt="Distressed denim jacket from the Streetwear collection"
            aspect="aspect-[3/4]"
            speed={0.1}
            caption="(02) Streetwear, worn in"
            className="mt-16 w-[72%] self-end md:mt-24"
          />
        </div>
      </div>

      {/* Stats */}
      <div
        ref={statsRef}
        className={`mt-20 grid grid-cols-1 border-t border-[#1F2326]/15 sm:grid-cols-3 md:mt-32 ${revealCls}`}
        style={reveal(statsSeen)}
      >
        {STATS.map((s, i) => (
          <div
            key={s.l}
            className={`py-8 sm:py-10 ${i > 0 ? "border-t border-[#1F2326]/15 sm:border-l sm:border-t-0 sm:pl-8" : ""}`}
          >
            <p className={`${instrument} text-[clamp(44px,6vw,96px)] leading-[0.95] tracking-[-0.03em]`}>{s.v}</p>
            <p className={`${manrope} mt-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#1F2326]/55`}>
              {s.l}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}