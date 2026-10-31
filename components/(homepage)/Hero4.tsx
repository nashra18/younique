"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Phone = portrait, desktop = landscape. Paths apne hisaab se badlo.
// Do alag images: phone (portrait) aur desktop (landscape). Paths apne hisaab se badlo.
const HERO_MOBILE = "Brand-logo/youniquehero-phone.jpg"; // ~1080x1440, portrait
const HERO_DESKTOP = "Brand-logo/youniquehero-desktop.jpg"; // ~// ~2560x1440

const DULL = "grayscale(1) brightness(0.78) contrast(0.85)";
const FULL = "grayscale(0) brightness(1) contrast(1)";
const COLOR_SECONDS = 1.6; // colour reveal speed
const ZOOM_SECONDS = 24; // slow zoom-in

// Photo ka kaunsa hissa hamesha dikhe (x% y%). Subject upar ho to y kam karo.
const HERO_POSITION = "50% 30%";

const SUB = ["Streetwear", "Recycled", "Tailored"];

// Mask padding: italic overhang aur descender (y, q) crop na ho
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

export default function Hero4({ waitForPreloader = true }: { waitForPreloader?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover) and (min-width: 768px)").matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const frame = q("[data-frame]");
      const bg = q("[data-bg]");
      const imgs = q("[data-img]");
      const letters = q("[data-letter]");
      const sub = q("[data-sub]");
      const rule = q("[data-rule]");
      const fade = q("[data-fade]");
      const cta = q("[data-cta]");
      const content = q("[data-content]");
      const scrollLine = q("[data-scrollline]");

      if (reduce) {
        gsap.set([frame, letters, sub, fade, cta], { autoAlpha: 1 });
        gsap.set(imgs, { filter: FULL });
        return;
      }

      // ---- initial
      gsap.set(frame, { clipPath: "inset(0% 50% 0% 50%)", autoAlpha: 1 });
      gsap.set(imgs, { scale: 1.1, filter: DULL });
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
      gsap.set(scrollLine, { scaleY: 0, transformOrigin: "50% 0%" });

      const tl = gsap.timeline({ paused: true });
      tl
        // Image beech se dono taraf khulti hai (off-white bg andar se phat-ta hua)
        .to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.9, ease: "expo.inOut" }, 0)
        .to(imgs, { scale: 1, duration: 2.6, ease: "expo.out" }, 0)
        // Colour jaldi aata hai
        .to(imgs, { filter: FULL, duration: COLOR_SECONDS, ease: "power2.inOut" }, 1.1)
        // Headline: letters tilt hoke uthte hain, left se right wave
        .to(
          letters,
          {
            yPercent: 0,
            rotate: 0,
            skewX: 0,
            autoAlpha: 1,
            duration: 1.6,
            ease: "expo.out",
            stagger: { each: 0.045, from: "start" },
          },
          0.9
        )
        .to(rule, { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 1.5)
        .to(sub, { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.12 }, 1.7)
        .to(cta, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.1 }, 2)
        .to(fade, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 2)
        .to(scrollLine, { scaleY: 1, duration: 1.2, ease: "expo.inOut" }, 2.3);

      // Slow zoom-in chalta rehta hai
      const zoom = gsap.timeline({ paused: true });
      zoom.to(imgs, { scale: 1.05, duration: ZOOM_SECONDS, ease: "sine.inOut" }, 0);

      // ---- scroll: image dheere sarakti hai, text upar jaake fade hota hai
      gsap.to(bg, {
        scale: 1.06,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(content, {
        y: -90,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "70% top", scrub: true },
      });

      const cleanups: Array<() => void> = [];

      // ---- desktop: mouse par image halki si move karti hai (depth feel)
      if (canHover) {
        const bx = gsap.quickTo(bg, "x", { duration: 1.4, ease: "power3.out" });
        const by = gsap.quickTo(bg, "y", { duration: 1.4, ease: "power3.out" });
        const move = (e: MouseEvent) => {
          bx((e.clientX / window.innerWidth - 0.5) * -10);
          by((e.clientY / window.innerHeight - 0.5) * -6);
        };
        window.addEventListener("mousemove", move);
        cleanups.push(() => window.removeEventListener("mousemove", move));

        // Magnetic CTA
        const primary = cta[0] as HTMLElement | undefined;
        if (primary) {
          const mx = gsap.quickTo(primary, "x", { duration: 0.5, ease: "power3.out" });
          const my = gsap.quickTo(primary, "y", { duration: 0.5, ease: "power3.out" });
          const pm = (e: MouseEvent) => {
            const r = primary.getBoundingClientRect();
            mx((e.clientX - (r.left + r.width / 2)) * 0.25);
            my((e.clientY - (r.top + r.height / 2)) * 0.35);
          };
          const pl = () => {
            mx(0);
            my(0);
          };
          primary.addEventListener("mousemove", pm);
          primary.addEventListener("mouseleave", pl);
          cleanups.push(() => {
            primary.removeEventListener("mousemove", pm);
            primary.removeEventListener("mouseleave", pl);
          });
        }
      }

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
        cleanups.push(() => {
          window.removeEventListener("preloader:reveal", go);
          window.clearTimeout(t);
        });
      } else {
        go();
      }
      return () => cleanups.forEach((fn) => fn());
    }, el);

    return () => ctx.revert();
  }, [waitForPreloader]);

  return (
    <section
      ref={root}
      className="relative h-svh min-h-[620px] w-full overflow-hidden bg-[#F7F7F5] text-[#F7F7F5]"
    >
      {/* Full-bleed image */}
      <div data-frame className="invisible absolute inset-0 overflow-hidden bg-[#E5E7EA]">
        <div data-bg className="absolute inset-[-1%] will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-img
            src={HERO_MOBILE}
            alt="Model wearing recycled tailored streetwear"
            loading="eager"
            decoding="async"
            style={{ objectPosition: HERO_POSITION }}
            className="absolute inset-0 block h-full w-full object-cover will-change-transform md:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-img
            src={HERO_DESKTOP}
            alt="Model wearing recycled tailored streetwear"
            loading="eager"
            decoding="async"
            style={{ objectPosition: HERO_POSITION }}
            className="absolute inset-0 hidden h-full w-full object-cover will-change-transform md:block"
          />
        </div>
        {/* Readability scrims: sirf top aur bottom, beech ki photo saaf rehti hai */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[14%] bg-gradient-to-b from-[#1F2326]/30 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#1F2326]/65 via-[#1F2326]/20 to-transparent" />
      </div>

      {/* Content */}
      <div data-content className="absolute inset-0 z-10 flex flex-col justify-between px-5 pb-6 pt-6 md:px-10 md:pb-9 md:pt-8">
        {/* Top meta: sabse halka */}
        <div className="flex items-center justify-between font-[family-name:var(--font-manrope)] text-[11px] font-medium uppercase tracking-[0.2em] text-[#F7F7F5]/70">
          <span data-fade className="invisible">Collection 01</span>
          <span data-fade className="invisible">FW / 26</span>
        </div>

        {/* Bottom block */}
        <div>
          {/* Sub-tagline + CTA row */}
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="md:w-[46%]">
              <div data-rule className="mb-4 h-px w-full bg-[#F7F7F5]/35" />
              <p className="flex flex-wrap items-center gap-x-3 font-[family-name:var(--font-manrope)] text-[12px] font-semibold uppercase tracking-[0.24em] text-[#F7F7F5] md:text-[13px]">
                {SUB.map((s, i) => (
                  <span key={s} className="flex items-center gap-x-3">
                    <span className="inline-block overflow-hidden py-[2px]">
                      <span data-sub className="inline-block">{s}.</span>
                    </span>
                    {i < SUB.length - 1 && (
                      <span aria-hidden className="h-1 w-1 rounded-full bg-[#F7F7F5]/50" />
                    )}
                  </span>
                ))}
              </p>
            </div>

            <div className="flex items-center gap-6 font-[family-name:var(--font-manrope)]">
              <a
                data-cta
                href="#shop"
                className="group invisible relative inline-flex items-center gap-3 overflow-hidden bg-[#B7C9D6] px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-[#1F2326] will-change-transform"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-[#F7F7F5] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-y-100" />
                <span className="relative">Shop the drop</span>
                <span className="relative transition-transform duration-500 group-hover:translate-x-1">→</span>
              </a>
              <a
                data-cta
                href="#story"
                className="invisible text-[12px] font-medium uppercase tracking-[0.18em] text-[#F7F7F5]/70 underline decoration-[#F7F7F5]/30 underline-offset-8 transition-colors hover:text-[#F7F7F5] hover:decoration-[#F7F7F5]"
              >
                Our story
              </a>
            </div>
          </div>

          {/* Giant headline */}
          <h1
            aria-label="Be uniquely you."
            className="mt-6 font-[family-name:var(--font-instrument)] text-[clamp(58px,19vw,110px)] leading-[0.92] tracking-[-0.035em] text-[#F7F7F5] md:mt-8 md:text-[clamp(110px,13.2vw,280px)] md:leading-[0.88]"
          >
            <span aria-hidden>
              <Word text="Be" /> <Word text="uniquely" italic /> <Word text="you." />
            </span>
          </h1>
        </div>
      </div>

      {/* Scroll line (desktop, right edge) */}
      <div
        data-fade
        className="invisible pointer-events-none absolute right-10 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 font-[family-name:var(--font-manrope)] text-[10px] font-medium uppercase tracking-[0.3em] text-[#F7F7F5]/60 md:flex"
      >
        <span style={{ writingMode: "vertical-rl" }}>Scroll</span>
        <span data-scrollline className="block h-14 w-px bg-[#F7F7F5]/50" />
      </div>
    </section>
  );
}