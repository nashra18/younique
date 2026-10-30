"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { BRAND, PRELOADER_IMAGES } from "@/lib/Brand";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const REST = [
  { rotate: -10, x: -46, y: 16 },
  { rotate: 7, x: 38, y: -14 },
  { rotate: -5, x: -20, y: 20 },
  { rotate: 9, x: 26, y: -10 },
  { rotate: -2, x: 0, y: 0 },
];

function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((c, i) => (
        <span key={i} data-letter className="inline-block will-change-transform">
          {c}
        </span>
      ))}
    </>
  );
}

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    // ---- scroll lock (scrollbar remove nahi karte, warna page jump karta hai)
    const stop = (e: Event) => e.preventDefault();
    const stopKeys = (e: KeyboardEvent) => {
      if ([" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(e.key))
        e.preventDefault();
    };
    window.scrollTo(0, 0);
    window.addEventListener("wheel", stop, { passive: false });
    window.addEventListener("touchmove", stop, { passive: false });
    window.addEventListener("keydown", stopKeys);
    const unlock = () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("keydown", stopKeys);
    };

    // ---- real loading progress: har image load + decode hone par % badhta hai
    const state = { ready: false, loaded: 0 };
    const total = PRELOADER_IMAGES.length;
    const load = (src: string) =>
      new Promise<void>((res) => {
        const img = new Image();
        img.src = src;
        const finish = () => {
          state.loaded += 1;
          res();
        };
        img.decode().then(finish, finish);
      });
    const imagesReady = Promise.race([
      Promise.all(PRELOADER_IMAGES.map(load)),
      new Promise<void>((res) => setTimeout(res, 3500)),
    ]).then(() => {
      state.ready = true;
    });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const cards = q("[data-card]");
      const imgs = q("[data-img]");
      const letters = q("[data-letter]");
      const title = q("[data-title]");
      const ui = q("[data-ui]");
      const meta = q("[data-meta]");
      const counter = q("[data-counter]")[0];
      const bar = q("[data-bar]");
      const last = cards[cards.length - 1];
      const others = cards.slice(0, -1);
      const count = { v: 0 };

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const ww = Math.min(vw, 0.75 * vh);
      const s0 = Math.min(0.5, (0.62 * vw) / ww);
      const windowClip = `inset(0px ${(vw - ww) / 2}px)`;

      const finish = () => {
        unlock();
        window.dispatchEvent(new Event("preloader:done"));
        setDone(true);
        onComplete?.();
      };

      // ---- reduced motion: simple fade, no heavy animation
      if (reduce) {
        gsap.set([title, ui], { autoAlpha: 1 });
        gsap.to(el, {
          autoAlpha: 0,
          duration: 0.6,
          delay: 0.6,
          onStart: () => window.dispatchEvent(new Event("preloader:reveal")),
          onComplete: finish,
        });
        return;
      }

      gsap.set([title, ui, meta], { autoAlpha: 1 });
      gsap.set(letters, { yPercent: 115, rotate: 7, transformOrigin: "0% 100%" });
      gsap.set(meta, { y: 14, autoAlpha: 0 });
      gsap.set(bar, { scaleX: 0 });
      gsap.set(cards, { autoAlpha: 1, scale: 0, clipPath: windowClip });
      gsap.set(imgs, { scale: 1.3 });

      const tl = gsap.timeline({ onComplete: finish });

      // 1. Brand name: letters neeche se mask ke andar se uthte hain
      tl.to(
        letters,
        { yPercent: 0, rotate: 0, duration: 1.3, ease: "expo.out", stagger: 0.07 },
        0.2
      ).to(meta, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.12 }, 0.7);

      // 2. Counter: image loading ke saath chalta hai, load na ho to 99 par ruka rehta hai
      tl.to(
        count,
        {
          v: 100,
          duration: 3.6,
          ease: "power2.inOut",
          onUpdate: () => {
            const cap = state.ready ? 100 : Math.min(99, 40 + (state.loaded / total) * 59);
            counter.textContent = String(Math.round(Math.min(count.v, cap)));
          },
        },
        0.2
      ).to(bar, { scaleX: 1, duration: 3.6, ease: "power2.inOut" }, 0.2);

      // 3. Photos ek point se khilte hain aur loose paper ki tarah settle hote hain
      cards.forEach((card, i) => {
        const r = REST[i % REST.length];
        const at = 0.6 + i * 0.5;
        tl.fromTo(
          card,
          { scale: 0, x: 0, y: 0, rotate: 0 },
          { scale: s0, x: r.x, y: r.y, rotate: r.rotate, duration: 1.3, ease: "expo.out" },
          at
        ).to(imgs[i], { scale: 1, duration: 1.6, ease: "expo.out" }, at);
      });

      // Jab tak images ready na ho, 100 par hold
      tl.add(() => {
        tl.pause();
        imagesReady.then(() => {
          counter.textContent = "100";
          tl.play();
        });
      }, ">0.1");

      // 4. Reveal
      tl.add("reveal", ">0.25")
        .to([ui, meta], { autoAlpha: 0, duration: 0.4, ease: "power2.out" }, "reveal")
        .to(
          letters,
          { yPercent: -115, rotate: -5, duration: 0.8, ease: "power4.in", stagger: 0.04 },
          "reveal"
        )
        .to(
          others,
          { scale: s0 * 0.8, autoAlpha: 0, duration: 0.9, ease: "power3.inOut" },
          "reveal+=0.4"
        )
        .to(
          last,
          {
            scale: 1,
            clipPath: "inset(0px 0px)",
            x: 0,
            y: 0,
            rotate: 0,
            duration: 1.4,
            ease: "expo.inOut",
          },
          "reveal+=0.4"
        )
        .to(imgs[imgs.length - 1], { scale: 1.06, duration: 1.4, ease: "expo.inOut" }, "reveal+=0.4")
        .call(() => window.dispatchEvent(new Event("preloader:reveal")), [], "reveal+=1.5")
        .to(el, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "reveal+=1.55");
    }, el);

    return () => {
      unlock();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="fixed inset-0 z-[100] overflow-hidden bg-[#B7C9D6] text-[#1F2326] will-change-transform"
    >
      {/* Paper stack */}
      {PRELOADER_IMAGES.map((src, i) => (
        <div
          key={src}
          data-card
          style={{ zIndex: i }}
          className="invisible absolute inset-0 overflow-hidden bg-[#E5E7EA]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-img
            src={src}
            alt=""
            decoding="sync"
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* Top meta row */}
      <div
        data-ui
        className="invisible pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-6 pt-6 font-[family-name:var(--font-manrope)] text-[11px] font-medium uppercase tracking-[0.18em] md:px-10 md:pt-8"
      >
        <span data-meta className="invisible opacity-70">{BRAND.tagline}</span>
        <span data-meta className="invisible opacity-70">{BRAND.meta}</span>
      </div>

      {/* Brand name: single word, mix-blend-difference se photos par bhi readable */}
      <h1
        data-title
        aria-label={BRAND.name}
        className="invisible pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-center font-[family-name:var(--font-instrument)] text-[clamp(64px,19vw,320px)] leading-none tracking-[-0.04em] text-[#98A6B0] mix-blend-difference"
      >
        {/* pb + negative mb: 'y' ka descender clip na ho, aur text center hi rahe */}
        <span className="block overflow-hidden pb-[0.22em] -mb-[0.22em]">
          <Letters text={BRAND.name} />
        </span>
      </h1>

      {/* Counter */}
      <div
        data-ui
        className="invisible absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-6 pb-6 md:px-10 md:pb-8"
      >
        <span className="font-[family-name:var(--font-manrope)] text-[11px] font-medium uppercase tracking-[0.18em] opacity-60">
          Loading the collection
        </span>
        <span className="font-[family-name:var(--font-instrument)] text-[clamp(56px,9vw,140px)] leading-[0.85] tabular-nums">
          <span data-counter>0</span>
          <span className="ml-1 align-top text-[0.3em] opacity-60">%</span>
        </span>
      </div>

      <div
        data-bar
        data-ui
        className="invisible absolute bottom-0 left-0 z-20 h-[3px] w-full origin-left bg-[#1F2326]"
      />
    </div>
  );
}