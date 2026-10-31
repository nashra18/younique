"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Do alag images: phone (portrait) aur desktop (landscape). Paths apne hisaab se badlo.
const HERO_MOBILE = "Brand-logo/youniquehero-phone.jpg"; // ~1080x1440, portrait
const HERO_DESKTOP = "Brand-logo/youniquehero-desktop.jpg"; // ~2560x1440

const DULL = "grayscale(1) brightness(0.8) contrast(0.85)";
const FULL = "grayscale(0) brightness(1) contrast(1)";
const COLOR_SECONDS = 1.2; // colour kitni jaldi aaye
const ZOOM_SECONDS = 24; // slow zoom-in

const SUB = ["Streetwear", "Recycled", "Tailored"];

// Padding mask me: italic overhang aur descender (y, q) crop na ho
function Word({ text, italic = false }: { text: string; italic?: boolean }) {
  return (
    <span className="inline-block overflow-hidden px-[0.1em] pb-[0.28em] pt-[0.08em] -mx-[0.1em] -mb-[0.28em] -mt-[0.08em] align-bottom">
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
      const imgs = q("[data-img]");
      const scrim = q("[data-scrim]");
      const letters = q("[data-letter]");
      const sub = q("[data-sub]");
      const rule = q("[data-rule]");
      const fade = q("[data-fade]");
      const cta = q("[data-cta]");

      if (reduce) {
        gsap.set([letters, sub, fade, cta, scrim], { autoAlpha: 1 });
        gsap.set(imgs, { filter: FULL });
        return;
      }

      gsap.set(imgs, { scale: 1.3, filter: DULL });
      gsap.set(scrim, { autoAlpha: 0 });
      gsap.set(letters, {
        yPercent: 125,
        rotate: 10,
        skewX: -12,
        autoAlpha: 0,
        transformOrigin: "0% 100%",
      });
      gsap.set(sub, { yPercent: 115 });
      gsap.set(rule, { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(fade, { y: 10, autoAlpha: 0 });
      gsap.set(cta, { y: 18, autoAlpha: 0 });

      const tl = gsap.timeline({ paused: true });
      tl.to(imgs, { scale: 1.04, duration: 2.6, ease: "expo.out" }, 0)
        .to(scrim, { autoAlpha: 1, duration: 1.6, ease: "power2.out" }, 0)
        .to(imgs, { filter: FULL, duration: COLOR_SECONDS, ease: "power2.inOut" }, 0.6)
        .to(
          letters,
          {
            yPercent: 0,
            rotate: 0,
            skewX: 0,
            autoAlpha: 1,
            duration: 1.5,
            ease: "expo.out",
            stagger: { each: 0.04, from: "start" },
          },
          0.5
        )
        .to(rule, { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 1.1)
        .to(sub, { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.12 }, 1.3)
        .to(fade, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 1.4)
        .to(cta, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out" }, 1.6);

      // Slow zoom-in alag chalta rehta hai
      const zoom = gsap.timeline({ paused: true });
      zoom.to(imgs, { scale: 1.16, duration: ZOOM_SECONDS, ease: "sine.inOut" }, 0);

      let started = false;
      const go = () => {
        if (started) return;
        started = true;
        tl.play();
        zoom.play();
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
      className="relative h-svh min-h-[600px] w-full overflow-hidden bg-[#1F2326] text-[#F7F7F5]"
    >
      {/* Full-bleed image: mobile + desktop alag */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-img
        src={HERO_MOBILE}
        alt="Model wearing recycled tailored streetwear"
        loading="eager"
        decoding="async"
        className="absolute inset-0 block h-full w-full object-cover will-change-transform md:hidden"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-img
        src={HERO_DESKTOP}
        alt="Model wearing recycled tailored streetwear"
        loading="eager"
        decoding="async"
        className="absolute inset-0 hidden h-full w-full object-cover will-change-transform md:block"
      />

      {/* Scrim: sirf text ke piche, image ki colour kharab nahi hoti */}
      <div
        data-scrim
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(31,35,38,0.72)_0%,rgba(31,35,38,0.35)_35%,rgba(31,35,38,0)_65%),linear-gradient(to_bottom,rgba(31,35,38,0.35)_0%,rgba(31,35,38,0)_18%)]"
      />

      {/* Top: sirf do chhote labels */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-6 font-[family-name:var(--font-manrope)] text-[11px] font-medium uppercase tracking-[0.2em] text-[#F7F7F5]/70 md:px-12 md:pt-9">
        <span data-fade className="invisible">Collection 01</span>
        <span data-fade className="invisible">FW / 26</span>
      </div>

      {/* Bottom: headline + sub + CTA */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-8 md:px-12 md:pb-14">
        <h1
          aria-label="Be uniquely you."
          className="font-[family-name:var(--font-instrument)] text-[clamp(60px,18vw,110px)] leading-[0.95] tracking-[-0.03em] text-[#F7F7F5] md:text-[clamp(110px,12vw,210px)] md:leading-[0.9]"
        >
          <span aria-hidden>
            <Word text="Be" /> <Word text="uniquely" italic /> <Word text="you." />
          </span>
        </h1>

        <div className="mt-5 flex flex-col gap-6 md:mt-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[460px] flex-1">
            <div data-rule className="mb-4 h-px w-full bg-[#F7F7F5]/35" />
            <p className="flex flex-wrap items-center gap-x-3 font-[family-name:var(--font-manrope)] text-[12px] font-semibold uppercase tracking-[0.24em] text-[#F7F7F5]/90 md:text-[13px]">
              {SUB.map((s, i) => (
                <span key={s} className="flex items-center gap-x-3">
                  <span className="inline-block overflow-hidden py-[2px]">
                    <span data-sub className="inline-block">{s}.</span>
                  </span>
                  {i < SUB.length - 1 && (
                    <span aria-hidden className="h-1 w-1 rounded-full bg-[#F7F7F5]/45" />
                  )}
                </span>
              ))}
            </p>
          </div>

          {/* Blue sirf yahan */}
          <a
            data-cta
            href="#shop"
            className="group invisible relative inline-flex w-fit items-center gap-3 overflow-hidden bg-[#B7C9D6] px-8 py-4 font-[family-name:var(--font-manrope)] text-[12px] font-bold uppercase tracking-[0.18em] text-[#1F2326]"
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-[#F7F7F5] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-y-100" />
            <span className="relative">Shop the drop</span>
            <span className="relative transition-transform duration-500 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}