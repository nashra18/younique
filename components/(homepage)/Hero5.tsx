"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Phone = portrait, desktop = landscape. Paths apne hisaab se badlo.
const HERO_MOBILE = "Brand-logo/youniquehero-phone.jpg"; // ~1080x1440
const HERO_DESKTOP = "Brand-logo/youniquehero-desktop.jpg"; // ~2400x1300
const HERO_POSITION = "50% 30%"; // subject ka crop point

const LENS_DESKTOP = 0.26; // lens radius (min(w,h) ka fraction)
const LENS_MOBILE = 0.34;
const ZOOM_SECONDS = 26;

const MARQUEE = ["Streetwear.", "Recycled.", "Tailored."];

const MASK =
  "radial-gradient(circle at var(--x) var(--y), #000 0, #000 calc(var(--r) * 0.55), transparent var(--r))";

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

export default function Hero5({ waitForPreloader = true }: { waitForPreloader?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(hover: none)").matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const frame = q("[data-frame]");
      const lens = q("[data-lens]")[0] as HTMLElement;
      const imgs = q("[data-img]");
      const letters = q("[data-letter]") as HTMLElement[];
      const fade = q("[data-fade]");
      const cta = q("[data-cta]");
      const content = q("[data-content]");
      const ring = q("[data-ring]")[0];
      const track = q("[data-track]")[0];
      const hint = q("[data-hint]")[0];

      if (hint) hint.textContent = coarse ? "Touch & drag to reveal colour" : "Move to reveal colour · Hold to flood";

      // ---- lens state
      const st = {
        w: 0,
        h: 0,
        tx: 0,
        ty: 0,
        x: 0,
        y: 0,
        r: 0,
        base: 0, // intro me 0 -> baseR
        baseR: 0,
        maxR: 0,
        flood: false,
        lastMove: -99999,
        ready: false, // intro complete
      };

      const size = () => {
        st.w = el.clientWidth;
        st.h = el.clientHeight;
        st.maxR = Math.hypot(st.w, st.h);
        st.baseR = Math.min(st.w, st.h) * (coarse ? LENS_MOBILE : LENS_DESKTOP);
        if (!st.x && !st.y) {
          st.x = st.tx = st.w * 0.5;
          st.y = st.ty = st.h * 0.45;
        }
      };
      size();

      const setLens = () => {
        lens.style.setProperty("--x", `${st.x}px`);
        lens.style.setProperty("--y", `${st.y}px`);
        lens.style.setProperty("--r", `${Math.max(st.r, 0.01)}px`);
        if (ring) gsap.set(ring, { x: st.x - 50, y: st.y - 50, scale: st.r / 50, autoAlpha: st.flood ? 0 : 1 });
      };

      if (reduce) {
        // simple: poori image full colour, koi motion nahi
        st.r = st.maxR;
        setLens();
        gsap.set([frame, letters, fade, cta], { autoAlpha: 1, clipPath: "none" });
        return;
      }

      // ---- letter proximity data
      let L: { el: HTMLElement; cx: number; cy: number; skew: (v: number) => void; rot: (v: number) => void }[] = [];
      const measure = () => {
        const sr = el.getBoundingClientRect();
        L = letters.map((l) => {
          const r = l.getBoundingClientRect();
          return {
            el: l,
            cx: r.left - sr.left + r.width / 2,
            cy: r.top - sr.top + r.height / 2,
            skew: gsap.quickSetter(l, "skewX", "deg") as (v: number) => void,
            rot: gsap.quickSetter(l, "rotate", "deg") as (v: number) => void,
          };
        });
      };

      // ---- pointer
      const toLocal = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        st.tx = e.clientX - r.left;
        st.ty = e.clientY - r.top;
        st.lastMove = performance.now();
      };
      const onMove = (e: PointerEvent) => toLocal(e);
      const onDown = (e: PointerEvent) => {
        if ((e.target as HTMLElement).closest("a")) return;
        toLocal(e);
        st.flood = true;
      };
      const onUp = () => (st.flood = false);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      el.addEventListener("pointerleave", onUp);

      const onResize = () => {
        size();
        if (st.ready) measure();
      };
      window.addEventListener("resize", onResize);

      // ---- ticker: lens lerp + drift + letter reaction + marquee skew
      let lastScroll = window.scrollY;
      let mqSkew = 0;
      const tick = (time: number, dt: number) => {
        if (window.scrollY > st.h * 1.2) return;
        const k = 1 - Math.pow(1 - 0.1, dt / 16.67);

        // idle hone par lens khud ghoomta hai
        const now = performance.now();
        if (!st.flood && now - st.lastMove > 2200) {
          st.tx = st.w * (0.5 + 0.3 * Math.sin(now / 1700));
          st.ty = st.h * (0.45 + 0.2 * Math.cos(now / 2300));
        }
        st.x += (st.tx - st.x) * k;
        st.y += (st.ty - st.y) * k;
        const targetR = st.flood ? st.maxR : st.base;
        st.r += (targetR - st.r) * (st.flood ? k * 0.7 : k);
        setLens();

        // letters lens ke paas aate hi tilt hote hain
        if (st.ready && window.scrollY < 40 && !st.flood) {
          const reach = Math.max(st.r * 1.15, 1);
          for (const l of L) {
            const d = Math.hypot(l.cx - st.x, l.cy - st.y);
            const inf = Math.max(0, 1 - d / reach);
            const e = inf * inf * (3 - 2 * inf); // smoothstep
            l.skew(-e * 16);
            l.rot(-e * 4);
          }
        }

        // marquee scroll-velocity se skew hota hai
        const vel = window.scrollY - lastScroll;
        lastScroll = window.scrollY;
        const target = gsap.utils.clamp(-10, 10, -vel * 0.9);
        mqSkew += (target - mqSkew) * 0.12;
        if (track) gsap.set(track, { skewX: mqSkew });
      };
      gsap.ticker.add(tick);

      // ---- initial
      gsap.set(frame, { clipPath: "circle(0% at 50% 55%)", autoAlpha: 1 });
      gsap.set(imgs, { scale: 1.18 });
      gsap.set(letters, { yPercent: 125, rotate: 10, skewX: -14, autoAlpha: 0, transformOrigin: "0% 100%" });
      gsap.set(fade, { y: 10, autoAlpha: 0 });
      gsap.set(cta, { y: 18, autoAlpha: 0 });
      st.r = 0;
      setLens();

      // ---- marquee loop
      const mq = gsap.to(track, { xPercent: -50, duration: 24, ease: "none", repeat: -1 });

      const tl = gsap.timeline({ paused: true });
      tl
        // iris: image beech se gol khulti hai
        .to(frame, { clipPath: "circle(85% at 50% 55%)", duration: 2, ease: "expo.inOut" }, 0)
        .to(imgs, { scale: 1, duration: 2.6, ease: "expo.out" }, 0)
        // colour lens khulta hai
        .to(st, { base: st.baseR, duration: 1.8, ease: "expo.out" }, 1.1)
        .to(
          letters,
          { yPercent: 0, rotate: 0, skewX: 0, autoAlpha: 1, duration: 1.6, ease: "expo.out", stagger: { each: 0.045, from: "start" } },
          0.9
        )
        .to(cta, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.1 }, 1.9)
        .to(fade, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 1.9)
        .add(() => {
          gsap.set(frame, { clipPath: "none" });
          measure();
          st.ready = true;
        }, 2.8);

      const zoom = gsap.timeline({ paused: true });
      zoom.to(imgs, { scale: 1.06, duration: ZOOM_SECONDS, ease: "sine.inOut" }, 0);

      // scroll: text upar jaake fade
      gsap.to(content, {
        y: -90,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "70% top", scrub: true },
      });

      // magnetic CTA
      const cleanups: Array<() => void> = [];
      const primary = cta[0] as HTMLElement | undefined;
      if (primary && !coarse) {
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
      } else go();

      return () => {
        gsap.ticker.remove(tick);
        mq.kill();
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        el.removeEventListener("pointerleave", onUp);
        window.removeEventListener("resize", onResize);
        cleanups.forEach((fn) => fn());
      };
    }, el);

    return () => ctx.revert();
  }, [waitForPreloader]);

  const imgClass = "absolute inset-0 h-full w-full object-cover will-change-transform";

  return (
    <section
      ref={root}
      className="relative h-svh min-h-[620px] w-full select-none overflow-hidden bg-[#F7F7F5] text-[#F7F7F5]"
      style={{ touchAction: "pan-y" }}
    >
      {/* Image: dull base + colour lens */}
      <div data-frame className="invisible absolute inset-0 overflow-hidden bg-[#E5E7EA]">
        {/* Base: dull grayscale */}
        <div className="absolute inset-0 grayscale brightness-[0.78] contrast-[0.88]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-img src={HERO_MOBILE} alt="" aria-hidden loading="eager" decoding="async" style={{ objectPosition: HERO_POSITION }} className={`${imgClass} md:hidden`} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-img src={HERO_DESKTOP} alt="" aria-hidden loading="eager" decoding="async" style={{ objectPosition: HERO_POSITION }} className={`${imgClass} hidden md:block`} />
        </div>

        {/* Colour: sirf lens ke andar dikhta hai */}
        <div
          data-lens
          className="absolute inset-0"
          style={{ WebkitMaskImage: MASK, maskImage: MASK, ["--x" as string]: "50%", ["--y" as string]: "50%", ["--r" as string]: "0px" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-img src={HERO_MOBILE} alt="Model wearing recycled tailored streetwear" loading="eager" decoding="async" style={{ objectPosition: HERO_POSITION }} className={`${imgClass} md:hidden`} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-img src={HERO_DESKTOP} alt="Model wearing recycled tailored streetwear" loading="eager" decoding="async" style={{ objectPosition: HERO_POSITION }} className={`${imgClass} hidden md:block`} />
        </div>

        {/* Lens ring */}
        <svg data-ring viewBox="0 0 100 100" className="pointer-events-none absolute left-0 top-0 h-[100px] w-[100px] opacity-0" aria-hidden>
          <circle cx="50" cy="50" r="49.5" fill="none" stroke="#F7F7F5" strokeOpacity="0.55" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Readability scrims */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[14%] bg-gradient-to-b from-[#1F2326]/35 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#1F2326]/70 via-[#1F2326]/25 to-transparent" />
      </div>

      {/* Content */}
      <div
        data-content
        className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between px-5 pb-[76px] pt-6 md:px-10 md:pb-[84px] md:pt-8"
      >
        <div className="flex items-center justify-between font-[family-name:var(--font-manrope)] text-[11px] font-medium uppercase tracking-[0.2em] text-[#F7F7F5]/70">
          <span data-fade className="invisible">Collection 01</span>
          <span data-fade data-hint className="invisible hidden md:inline" />
          <span data-fade className="invisible">FW / 26</span>
        </div>

        <div>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <p
              data-fade
              className="invisible max-w-[300px] font-[family-name:var(--font-manrope)] text-[14px] leading-relaxed text-[#F7F7F5]/80"
            >
              Reclaimed fabric, finished by hand. One of one, never repeated.
            </p>
            <div className="pointer-events-auto flex items-center gap-6 font-[family-name:var(--font-manrope)]">
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

          <h1
            aria-label="Be uniquely you."
            className="mt-5 font-[family-name:var(--font-instrument)] text-[clamp(58px,19vw,110px)] leading-[0.92] tracking-[-0.035em] md:mt-6 md:text-[clamp(110px,13.2vw,280px)] md:leading-[0.88]"
          >
            <span aria-hidden>
              <Word text="Be" /> <Word text="uniquely" italic /> <Word text="you." />
            </span>
          </h1>
        </div>
      </div>

      {/* Marquee strip: solid, scroll-velocity se skew */}
      <div className="absolute inset-x-0 bottom-0 z-20 overflow-hidden bg-[#F7F7F5] py-3 text-[#1F2326] md:py-4">
        <div data-track className="flex w-max whitespace-nowrap will-change-transform">
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0 items-center" aria-hidden={n === 1}>
              {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((w, i) => (
                <span key={`${n}-${i}`} className="flex items-center">
                  <span className="px-5 font-[family-name:var(--font-instrument)] text-[26px] leading-none md:px-8 md:text-[34px]">
                    {i % 2 ? <em>{w}</em> : w}
                  </span>
                  <span className="font-[family-name:var(--font-manrope)] text-[12px] text-[#1F2326]/40">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}