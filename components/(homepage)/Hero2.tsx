"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Phone = portrait, desktop = landscape. Paths apne hisaab se badlo.
const HERO_MOBILE = "Brand-logo/youniquehero-phone.jpg"; // ~1080x1440
const HERO_DESKTOP = "Brand-logo/youniquehero-desktop.jpg"; // ~2400x1300

const DULL = "grayscale(1) brightness(0.85) contrast(0.85)";
const FULL = "grayscale(0) brightness(1) contrast(1)";

const SUB = ["Streetwear", "Recycled", "Tailored"];

function Word({ text, italic = false }: { text: string; italic?: boolean }) {
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

export default function Hero2({ waitForPreloader = true }: { waitForPreloader?: boolean }) {
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
      const rule = q("[data-rule]");
      const fade = q("[data-fade]");
      const cta = q("[data-cta]");
      const chip = q("[data-chip]")[0];
      const badge = q("[data-badge]");

      if (reduce) {
        gsap.set([frame, letters, sub, fade, cta, badge], { autoAlpha: 1 });
        gsap.set(img, { filter: FULL });
        if (chip) chip.textContent = "100";
        return;
      }

      // ---- initial
      gsap.set(frame, { autoAlpha: 1, clipPath: "inset(0% 50% 0% 50%)" });
      gsap.set(img, { scale: 1.3, filter: DULL });
      gsap.set(letters, { yPercent: 120, rotate: 6, transformOrigin: "0% 100%" });
      gsap.set(sub, { yPercent: 110 });
      gsap.set(rule, { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(fade, { y: 10, autoAlpha: 0 });
      gsap.set(cta, { y: 16, autoAlpha: 0 });
      gsap.set(badge, { scale: 0, rotate: -90, autoAlpha: 1 });

      const tl = gsap.timeline({ paused: true });
      tl.to(letters, { yPercent: 0, rotate: 0, duration: 1.3, ease: "expo.out", stagger: 0.045 }, 0)
        .to(rule, { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 0.5)
        .to(sub, { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.12 }, 0.8)
        .to(cta, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.1 }, 1.1)
        .to(fade, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 1.2)
        // image panel centre se dono taraf khulta hai
        .to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "expo.inOut" }, 0.6)
        .to(img, { scale: 1.03, duration: 2.4, ease: "expo.out" }, 0.6)
        .to(badge, { scale: 1, rotate: 0, duration: 1.2, ease: "back.out(1.6)" }, 2);

      // ---- bahut dheere colour reveal + zoom-in; chip me live % dikhta hai
      const slow = gsap.timeline({ paused: true });
      const prog = { v: 0 };
      slow
        .to(img, { filter: FULL, duration: 14, ease: "power2.inOut" }, 0)
        .to(img, { scale: 1.16, duration: 22, ease: "sine.inOut" }, 0)
        .to(
          prog,
          {
            v: 100,
            duration: 14,
            ease: "power2.inOut",
            onUpdate: () => {
              if (chip) chip.textContent = String(Math.round(prog.v)).padStart(2, "0");
            },
          },
          0
        );

      let started = false;
      const go = () => {
        if (started) return;
        started = true;
        tl.play();
        slow.play();
      };

      if (waitForPreloader) {
        window.addEventListener("preloader:reveal", go, { once: true });
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
      className="relative flex min-h-svh w-full flex-col bg-[#F7F7F5] px-4 pb-4 pt-5 text-[#1F2326] md:px-10 md:pb-8 md:pt-7"
    >
      {/* Meta row: tertiary info, sabse halki */}
      <div className="flex items-center justify-between font-[family-name:var(--font-manrope)] text-[11px] font-medium uppercase tracking-[0.18em] text-[#1F2326]/50">
        <span data-fade className="invisible">Collection 01</span>
        <span data-fade className="invisible hidden md:inline">Made from what already exists</span>
        <span data-fade className="invisible">FW / 26</span>
      </div>

      {/* Text zone: solid bg par, poori readability */}
      <div className="mt-6 md:mt-8">
        <h1
          aria-label="Be uniquely you."
          className="font-[family-name:var(--font-instrument)] text-[clamp(60px,15.5vw,250px)] leading-[0.9] tracking-[-0.035em] text-[#1F2326]"
        >
          <span aria-hidden>
            <Word text="Be" /> <Word text="uniquely" italic /> <Word text="you." />
          </span>
        </h1>

        {/* Sub-tagline + CTA row */}
        <div className="mt-6 flex flex-col gap-6 md:mt-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[520px] flex-1">
            <div data-rule className="mb-4 h-px w-full bg-[#1F2326]/20" />
            <p className="flex flex-wrap items-center gap-x-3 font-[family-name:var(--font-manrope)] text-[12px] font-semibold uppercase tracking-[0.22em] text-[#1F2326] md:text-[13px]">
              {SUB.map((s, i) => (
                <span key={s} className="flex items-center gap-x-3">
                  <span className="inline-block overflow-hidden">
                    <span data-sub className="inline-block">{s}.</span>
                  </span>
                  {i < SUB.length - 1 && (
                    <span aria-hidden className="h-1 w-1 rounded-full bg-[#1F2326]/30" />
                  )}
                </span>
              ))}
            </p>
            <p
              data-fade
              className="invisible mt-3 max-w-[340px] font-[family-name:var(--font-manrope)] text-[14px] leading-relaxed text-[#1F2326]/60"
            >
              Pieces cut from reclaimed fabric, finished by hand. One of one, never repeated.
            </p>
          </div>

          <div className="flex items-center gap-6 font-[family-name:var(--font-manrope)]">
            {/* Blue sirf yahan */}
            <a
              data-cta
              href="#shop"
              className="group invisible relative inline-flex items-center gap-3 overflow-hidden bg-[#B7C9D6] px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-[#1F2326]"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-[#1F2326] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-y-100" />
              <span className="relative transition-colors duration-500 group-hover:text-[#B7C9D6]">Shop the drop</span>
              <span className="relative transition-all duration-500 group-hover:translate-x-1 group-hover:text-[#B7C9D6]">→</span>
            </a>
            <a
              data-cta
              href="#story"
              className="invisible text-[12px] font-medium uppercase tracking-[0.18em] text-[#1F2326]/55 underline decoration-[#1F2326]/20 underline-offset-8 transition-colors hover:text-[#1F2326] hover:decoration-[#1F2326]"
            >
              Our story
            </a>
          </div>
        </div>
      </div>

      {/* Image panel */}
      <div
        data-frame
        className="invisible relative mt-6 min-h-[48svh] flex-1 overflow-hidden bg-[#E5E7EA] md:mt-8 md:min-h-[360px]"
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
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
          />
        </picture>

        {/* Live colour chip: solid bg, hamesha readable */}
        <div className="absolute left-3 top-3 flex items-center gap-3 bg-[#F7F7F5] px-3 py-2 font-[family-name:var(--font-manrope)] text-[10px] font-semibold uppercase tracking-[0.2em] md:left-5 md:top-5">
          <span className="text-[#1F2326]/50">Colour</span>
          <span className="tabular-nums">
            <span data-chip>00</span>
            <span className="text-[#1F2326]/50">%</span>
          </span>
        </div>

        {/* Rotating badge */}
        <div
          data-badge
          className="invisible absolute bottom-3 right-3 h-[104px] w-[104px] md:bottom-5 md:right-5 md:h-[132px] md:w-[132px]"
        >
          <div className="absolute inset-0 rounded-full bg-[#F7F7F5]" />
          <svg
            viewBox="0 0 120 120"
            className="absolute inset-0 animate-[spin_22s_linear_infinite] motion-reduce:animate-none"
            aria-hidden
          >
            <defs>
              <path id="hero-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
            </defs>
            <text
              fill="#1F2326"
              fontSize="9.5"
              fontWeight="600"
              letterSpacing="2.6"
              style={{ fontFamily: "var(--font-manrope)", textTransform: "uppercase" }}
            >
              <textPath href="#hero-circle">Streetwear · Recycled · Tailored ·</textPath>
            </text>
          </svg>
          <span className="absolute inset-0 grid place-items-center font-[family-name:var(--font-instrument)] text-[34px] leading-none">
            ↓
          </span>
        </div>
      </div>
    </section>
  );
}