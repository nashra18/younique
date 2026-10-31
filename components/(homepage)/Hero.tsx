"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Do alag images: phone (portrait) aur desktop (landscape). Paths apne hisaab se badlo.
const HERO_MOBILE = "Brand-logo/youniquehero-phone.jpg"; // ~1080x1440, portrait
const HERO_DESKTOP = "Brand-logo/youniquehero-desktop.jpg"; // ~2400x1500, landscape

const DULL = "grayscale(1) brightness(0.82) contrast(0.88)";
const FULL = "grayscale(0) brightness(1) contrast(1)";

const HEADLINE = ["Be", "uniquely", "you."];
const SUB = ["Streetwear.", "Recycled.", "Tailored."];

function Word({
  text,
  italic = false,
}: {
  text: string;
  italic?: boolean;
}) {
  // overflow-hidden mask + pb/-mb: descender (y, q) clip na ho
  return (
    <span className="inline-block overflow-hidden pb-[0.2em] -mb-[0.2em] align-bottom">
      {text.split("").map((c, i) => (
        <span
          key={i}
          data-letter
          className={`inline-block will-change-transform ${italic ? "italic" : ""}`}
        >
          {c}
        </span>
      ))}
    </span>
  );
}

export default function Hero({ waitForPreloader = true }: { waitForPreloader?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const frame = q("[data-frame]");
      const img = q("[data-img]");
      const letters = q("[data-letter]");
      const sub = q("[data-sub]");
      const fade = q("[data-fade]");
      const cta = q("[data-cta]");
      const line = q("[data-line]");

      if (reduce) {
        gsap.set([frame, img, letters, sub, fade, cta, line], { clearProps: "all" });
        gsap.set([frame, fade, cta, sub, letters], { autoAlpha: 1 });
        gsap.set(img, { filter: FULL });
        return;
      }

      // ---- initial state
      gsap.set(frame, { clipPath: "inset(100% 0% 0% 0%)", autoAlpha: 1 });
      gsap.set(img, { scale: 1.25, filter: DULL, transformOrigin: "50% 60%" });
      gsap.set(letters, { yPercent: 120, rotate: 6, transformOrigin: "0% 100%" });
      gsap.set(sub, { yPercent: 110, autoAlpha: 1 });
      gsap.set(fade, { y: 12, autoAlpha: 0 });
      gsap.set(cta, { y: 18, autoAlpha: 0 });
      gsap.set(line, { scaleX: 0, transformOrigin: "0% 50%" });

      const tl = gsap.timeline({ paused: true });

      // 1. Image window upar uthti hai
      tl.to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" }, 0)
        // settle: 1.25 -> 1 (pehla zoom-out), phir neeche slow zoom-in alag se chalta hai
        .to(img, { scale: 1.02, duration: 2.2, ease: "expo.out" }, 0)

        // 2. Headline letters
        .to(
          letters,
          { yPercent: 0, rotate: 0, duration: 1.3, ease: "expo.out", stagger: 0.045 },
          0.7
        )

        // 3. Tagline neeche: "Streetwear. Recycled. Tailored."
        .to(line, { scaleX: 1, duration: 1.2, ease: "expo.inOut" }, 1.4)
        .to(sub, { yPercent: 0, duration: 1.0, ease: "power4.out", stagger: 0.14 }, 1.6)

        // 4. UI details + CTA
        .to(fade, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.1 }, 1.9)
        .to(cta, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.12 }, 2.2);

      // ---- bahut dheere colour reveal + zoom-in (alag timeline, 14s)
      const slow = gsap.timeline({ paused: true });
      slow
        .to(img, { filter: FULL, duration: 14, ease: "power2.inOut" }, 0)
        .to(img, { scale: 1.16, duration: 20, ease: "sine.inOut" }, 0);

      const start = () => {
        tl.play();
        slow.play();
      };

      let started = false;
      const go = () => {
        if (started) return;
        started = true;
        start();
      };

      if (waitForPreloader) {
        window.addEventListener("preloader:reveal", go, { once: true });
        // safety: agar preloader page par hai hi nahi
        const t = window.setTimeout(go, 9000);
        return () => {
          window.removeEventListener("preloader:reveal", go);
          window.clearTimeout(t);
        };
      }
      go();
    }, el);

    return () => ctx.revert();
  }, [waitForPreloader]);

  return (
    <section
      ref={root}
      className="relative h-svh min-h-[640px] w-full overflow-hidden bg-[#F7F7F5] text-[#1F2326]"
    >
      {/* Image window: mobile par almost full, desktop par right-side editorial frame */}
      <div
        data-frame
        className="invisible absolute inset-x-4 top-20 bottom-4 overflow-hidden bg-[#E5E7EA] md:inset-x-auto md:right-10 md:top-24 md:bottom-10 md:w-[58%]"
      >
        <picture>
          <source media="(min-width: 768px)" srcSet={HERO_DESKTOP} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-img
            src={HERO_MOBILE}
            alt="Model wearing recycled tailored streetwear"
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-cover will-change-transform"
          />
        </picture>
      </div>

      {/* Top meta row */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-6 pt-6 font-[family-name:var(--font-manrope)] text-[11px] font-medium uppercase tracking-[0.18em] md:px-10 md:pt-8">
        <span data-fade className="invisible opacity-70">
          Collection 01
        </span>
        <span data-fade className="invisible opacity-70">
          Made from what already exists
        </span>
      </div>

      {/* Headline: off-white + mix-blend-difference => bg par charcoal, photo par invert hoke readable */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[22%] z-10 px-6 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:px-10">
        <h1
          aria-label="Be uniquely you."
          className="font-[family-name:var(--font-instrument)] text-[clamp(64px,15vw,260px)] leading-[0.88] tracking-[-0.035em] text-[#F7F7F5] mix-blend-difference"
        >
          <span aria-hidden className="block">
            <Word text={HEADLINE[0]} /> <Word text={HEADLINE[1]} italic />
          </span>
          <span aria-hidden className="block md:pl-[0.9em]">
            <Word text={HEADLINE[2]} />
          </span>
        </h1>
      </div>

      {/* Sub-tagline + CTA */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-8 md:px-10 md:pb-12">
        <div
          data-line
          className="mb-4 h-px w-full max-w-[420px] bg-[#1F2326]/30 mix-blend-difference md:bg-[#1F2326]/25"
        />
        <p className="flex flex-wrap gap-x-4 font-[family-name:var(--font-manrope)] text-[12px] font-semibold uppercase tracking-[0.22em] text-[#F7F7F5] mix-blend-difference md:text-[13px]">
          {SUB.map((s) => (
            <span key={s} className="inline-block overflow-hidden">
              <span data-sub className="inline-block">
                {s}
              </span>
            </span>
          ))}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-5 font-[family-name:var(--font-manrope)]">
          <a
            data-cta
            href="#shop"
            className="group invisible relative inline-flex items-center gap-3 overflow-hidden bg-[#B7C9D6] px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#1F2326] transition-colors"
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-[#1F2326] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-y-100" />
            <span className="relative transition-colors duration-500 group-hover:text-[#B7C9D6]">
              Shop the drop
            </span>
            <span className="relative transition-all duration-500 group-hover:translate-x-1 group-hover:text-[#B7C9D6]">
              →
            </span>
          </a>
          <a
            data-cta
            href="#story"
            className="invisible text-[12px] font-medium uppercase tracking-[0.18em] text-[#1F2326]/60 underline decoration-[#1F2326]/20 underline-offset-8 transition-colors hover:text-[#1F2326] hover:decoration-[#1F2326]"
          >
            Our story
          </a>
        </div>
      </div>

      {/* Scroll hint (desktop) */}
      <div
        data-fade
        className="invisible absolute bottom-12 left-1/2 z-20 hidden -translate-x-1/2 font-[family-name:var(--font-manrope)] text-[10px] font-medium uppercase tracking-[0.3em] opacity-60 md:block"
      >
        Scroll
      </div>
    </section>
  );
}