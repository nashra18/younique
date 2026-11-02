"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { PRODUCTS } from "@/data/ShopData";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Leading "/" zaroori hai. Files public/Brand-logo/ me honi chahiye.
const HERO_MOBILE = "/Brand-logo/youniquehero-phone.jpg"; // ~1080x1440
const HERO_DESKTOP = "/Brand-logo/youniquehero-desktop.jpg"; // ~2400x1300
const HERO_POSITION = "50% 30%";

// Shop ka page: app/shop/page.tsx
const SHOP_PATH = "/shop";

const countOf = (c: string) => PRODUCTS.filter((p) => p.category === c).length;

const CATS = [
  { name: "Streetwear", blurb: "Oversized cuts, everyday attitude.", count: countOf("streetwear"), category: "streetwear", href: `${SHOP_PATH}?category=streetwear#shop` },
  { name: "Recycled", blurb: "Reclaimed fabric, one of one.", count: countOf("recycled"), category: "recycled", href: `${SHOP_PATH}?category=recycled#shop` },
  { name: "Tailored", blurb: "Sharp fits, made to be worn in.", count: countOf("tailored"), category: "tailored", href: `${SHOP_PATH}?category=tailored#shop` },
];

const START = 1; // pehle kaunsa khula ho
const GROW = 3; // khule panel ki relative size (baaki = 1)
const AUTOPLAY = 5; // seconds

// Page change ke baad wapas aane par intro dobara chhota chale, 9 second ka khali gap na aaye
let heroSeen = false;

const imgCls = "absolute inset-0 h-full w-full object-cover";

function Pair({ label }: { label?: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO_MOBILE} alt={label ?? ""} aria-hidden={!label} loading="eager" decoding="async" style={{ objectPosition: HERO_POSITION }} className={`${imgCls} md:hidden`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO_DESKTOP} alt={label ?? ""} aria-hidden={!label} loading="eager" decoding="async" style={{ objectPosition: HERO_POSITION }} className={`${imgCls} hidden md:block`} />
    </>
  );
}

function Word({ text, italic = false }: { text: string; italic?: boolean }) {
  return (
    <span className="relative inline-block align-bottom">
      {/* mask: italic overhang aur descender (y, q) crop na ho */}
      <span className="inline-block overflow-hidden px-[0.1em] pb-[0.28em] pt-[0.08em] -mx-[0.1em] -mb-[0.28em] -mt-[0.08em] align-bottom">
        {text.split("").map((c, i) => (
          <span
            key={i}
            data-letter
            className={`invisible inline-block will-change-transform ${italic ? "italic" : ""}`}
          >
            {c}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function Hero6({ waitForPreloader = true }: { waitForPreloader?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Shop button / panels: agar #shop isi page par hai to scroll, warna /shop page par jao
  const goShop = (e: React.MouseEvent, category: string) => {
    if (e.defaultPrevented) return; // phone par pehla tap sirf panel kholta hai
    e.preventDefault();
    const qs = category === "all" ? "" : `?category=${category}`;
    const here = document.getElementById("shop");
    if (here) {
      router.replace(`${pathname}${qs}`, { scroll: false });
      here.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`${SHOP_PATH}${qs}#shop`);
    }
  };

  // Shop page pehle se load kar lo, click par turant khule
  useEffect(() => {
    router.prefetch(SHOP_PATH);
  }, [router]);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(hover: none)").matches;
    const mqV = window.matchMedia("(max-width: 767px)"); // mobile = vertical rows
    // desktop (mouse) par autoplay nahi: sirf hover se badle. Touch/phone par autoplay rahega.
    const autoplayOn = !window.matchMedia("(hover: hover) and (min-width: 768px)").matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const box = q("[data-box]")[0] as HTMLElement;
      const frame = q("[data-frame]");
      const colour = q("[data-colour]")[0] as HTMLElement;
      const zooms = q("[data-zoom]");
      const slats = q("[data-slat]") as HTMLElement[];
      const opens = q("[data-open]");
      const closeds = q("[data-closed]");
      const divs = q("[data-div]");
      const progs = q("[data-prog]");
      const letters = q("[data-letter]");
      const subs = q("[data-sub]");
      const rule = q("[data-rule]");
      const fade = q("[data-fade]");
      const cta = q("[data-cta]");
      const onames = slats.map((s) => s.querySelector("[data-oname]") as HTMLElement);
      const ometas = slats.map((s) => Array.from(s.querySelectorAll<HTMLElement>("[data-ometa]")));

      // ---- ek hi state se layout + colour window chalta hai
      const A = { a0: 0, a1: 0, a2: 0 };
      const R = { r: 0 }; // colour bloom (intro)
      (A as Record<string, number>)[`a${START}`] = 1;
      const keys = ["a0", "a1", "a2"] as const;

      const render = () => {
        const vertical = mqV.matches;
        const a = keys.map((k) => A[k]);
        const w = a.map((x) => 1 + (GROW - 1) * x);
        const tot = w.reduce((s, x) => s + x, 0);

        let acc = 0;
        const starts: number[] = [];
        const sizes: number[] = [];
        w.forEach((x, k) => {
          starts[k] = (acc / tot) * 100;
          sizes[k] = (x / tot) * 100;
          acc += x;
        });

        slats.forEach((s, k) => {
          const st = s.style;
          if (vertical) {
            st.left = "0";
            st.width = "100%";
            st.top = `${starts[k]}%`;
            st.height = `${sizes[k]}%`;
          } else {
            st.top = "0";
            st.height = "100%";
            st.left = `${starts[k]}%`;
            st.width = `${sizes[k]}%`;
          }
        });

        // colour window active panel ke saath smoothly slide karti hai
        let L = 0;
        let E = 0;
        a.forEach((x, k) => {
          L += x * starts[k];
          E += x * (starts[k] + sizes[k]);
        });
        const shrink = ((E - L) * (1 - R.r)) / 2;
        const l = L + shrink;
        const rgt = 100 - (E - shrink);
        colour.style.clipPath = vertical
          ? `inset(${l}% 0% ${rgt}% 0%)`
          : `inset(0% ${rgt}% 0% ${l}%)`;
      };

      let cur = START;
      render();

      // ---- panel content in/out
      const showOpen = (k: number) => {
        gsap.killTweensOf([opens[k], onames[k], ...ometas[k]]);
        gsap.set(opens[k], { autoAlpha: 1 });
        gsap.fromTo(onames[k], { yPercent: 115 }, { yPercent: 0, duration: 1.1, ease: "power4.out", delay: 0.4 });
        gsap.fromTo(
          ometas[k],
          { y: 12, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", delay: 0.55, stagger: 0.1 }
        );
        gsap.to(closeds[k], { autoAlpha: 0, duration: 0.25, overwrite: true });
      };
      const hideOpen = (k: number) => {
        gsap.killTweensOf([opens[k], onames[k], ...ometas[k]]);
        gsap.to(opens[k], {
          autoAlpha: 0,
          duration: 0.25,
          onComplete: () => {
            gsap.set(onames[k], { yPercent: 115 });
          },
        });
        gsap.to(closeds[k], { autoAlpha: 1, duration: 0.5, delay: 0.3, overwrite: true });
      };

      // ---- autoplay (progress line ke saath)
      let progTw: gsap.core.Tween | null = null;
      let hold = false;
      let inView = true;
      let live = false;
      const syncPause = () => {
        if (!progTw) return;
        if (hold || !inView) progTw.pause();
        else progTw.resume();
      };
      const runProg = () => {
        progTw?.kill();
        gsap.set(progs, { scaleX: 0 });
        if (!live || reduce || !autoplayOn) return;
        progTw = gsap.fromTo(
          progs[cur],
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: AUTOPLAY,
            ease: "none",
            onComplete: () => activate((cur + 1) % CATS.length),
          }
        );
        syncPause();
      };

      const activate = (i: number) => {
        if (i === cur) return;
        hideOpen(cur);
        cur = i;
        showOpen(i);
        gsap.to(A, {
          a0: i === 0 ? 1 : 0,
          a1: i === 1 ? 1 : 0,
          a2: i === 2 ? 1 : 0,
          duration: reduce ? 0.01 : 1.4,
          ease: "power3.inOut",
          overwrite: "auto",
          onUpdate: render,
        });
        runProg();
      };

      // ---- interactions
      const cleanups: Array<() => void> = [];
      slats.forEach((s, k) => {
        let t = 0;
        const enter = (e: PointerEvent) => {
          if (e.pointerType === "touch") return;
          window.clearTimeout(t);
          t = window.setTimeout(() => activate(k), cur === k ? 0 : 120); // sweep karte waqt achanak switch nahi
        };
        const leave = () => window.clearTimeout(t);
        const focus = () => activate(k);
        const click = (e: MouseEvent) => {
          if (coarse && cur !== k) {
            e.preventDefault(); // pehle tap par khulta hai, doosre par jaata hai
            activate(k);
          }
        };
        s.addEventListener("pointerenter", enter);
        s.addEventListener("pointerleave", leave);
        s.addEventListener("focus", focus);
        s.addEventListener("click", click);
        cleanups.push(() => {
          window.clearTimeout(t);
          s.removeEventListener("pointerenter", enter);
          s.removeEventListener("pointerleave", leave);
          s.removeEventListener("focus", focus);
          s.removeEventListener("click", click);
        });
      });

      const hoverIn = (e: PointerEvent) => {
        if (e.pointerType !== "touch") {
          hold = true;
          syncPause();
        }
      };
      const hoverOut = (e: PointerEvent) => {
        if (e.pointerType !== "touch") {
          hold = false;
          syncPause();
        }
      };
      let touchResume: gsap.core.Tween | null = null;
      const touchStart = () => {
        hold = true;
        syncPause();
        touchResume?.kill();
        touchResume = gsap.delayedCall(4, () => {
          hold = false;
          syncPause();
        });
      };
      box.addEventListener("pointerenter", hoverIn);
      box.addEventListener("pointerleave", hoverOut);
      box.addEventListener("touchstart", touchStart, { passive: true });
      mqV.addEventListener("change", render);

      const io = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          syncPause();
        },
        { threshold: 0.2 }
      );
      io.observe(el);

      const teardown = () => {
        progTw?.kill();
        touchResume?.kill();
        box.removeEventListener("pointerenter", hoverIn);
        box.removeEventListener("pointerleave", hoverOut);
        box.removeEventListener("touchstart", touchStart);
        mqV.removeEventListener("change", render);
        io.disconnect();
        cleanups.forEach((fn) => fn());
      };

      // ---- reduced motion: sab seedha dikhao
      if (reduce) {
        R.r = 1;
        render();
        gsap.set([frame, letters, subs, fade, cta, divs, closeds], { autoAlpha: 1, clipPath: "none", yPercent: 0 });
        gsap.set(rule, { autoAlpha: 1, scaleX: 1 });
        closeds.forEach((c, k) => gsap.set(c, { autoAlpha: k === cur ? 0 : 1 }));
        showOpen(cur);
        return teardown;
      }

      // ---- initial state (intro se pehle)
      gsap.set(frame, { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(zooms, { scale: 1.2 });
      gsap.set(divs, { autoAlpha: 0 });
      gsap.set(opens, { autoAlpha: 0 });
      gsap.set(onames, { yPercent: 115 });
      gsap.set(ometas.flat(), { autoAlpha: 0 });
      gsap.set(closeds, { autoAlpha: 0 });
      gsap.set(progs, { scaleX: 0 });
      gsap.set(letters, { yPercent: 118, rotate: 7, skewX: -8, autoAlpha: 1, transformOrigin: "0% 100%" });
      gsap.set(subs, { yPercent: 118, autoAlpha: 1 });
      gsap.set(rule, { autoAlpha: 1, scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(fade, { y: 10, autoAlpha: 0 });
      gsap.set(cta, { y: 18, autoAlpha: 0 });

      const tl = gsap.timeline({ paused: true });
      tl
        // 1) image pehle: neeche se upar wipe + settle zoom, phir slow zoom
        .to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.9, ease: "expo.inOut" }, 0)
        .to(zooms, { scale: 1, duration: 2.8, ease: "power3.out" }, 0)
        .to(zooms, { scale: 1.06, duration: 26, ease: "sine.inOut" }, 2.8)
        // 2) headline: letters ek soft wave me
        .to(
          letters,
          {
            yPercent: 0,
            rotate: 0,
            skewX: 0,
            duration: 1.8,
            ease: "power4.out",
            stagger: { amount: 0.9, from: "start", ease: "power1.inOut" },
          },
          0.9
        )
        .to(rule, { scaleX: 1, duration: 1.6, ease: "power3.inOut" }, 1.5)
        .to(subs, { yPercent: 0, duration: 1.3, ease: "power4.out", stagger: 0.14 }, 1.7)
        .to(fade, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out", stagger: 0.08 }, 1.9)
        .to(cta, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out", stagger: 0.12 }, 2.1)
        // 3) dividers, phir colour active panel ke beech se dheere khilta hai
        .to(divs, { autoAlpha: 1, duration: 0.8, ease: "power2.out" }, 2.2)
        .to(R, { r: 1, duration: 1.9, ease: "power2.inOut", onUpdate: render }, 2.5)
        .add(() => {
          showOpen(cur);
          closeds.forEach((c, k) => {
            if (k !== cur) gsap.to(c, { autoAlpha: 1, duration: 0.9 });
          });
        }, 3.1)
        .add(() => {
          live = true;
          heroSeen = true;
          runProg();
        }, 4.2);

      // Wapas aane par (ya preloader pehle ho chuka ho) intro ka wait nahi
      const revisit = heroSeen;
      const preloaderDone =
        (window as unknown as { __preloaderDone?: boolean }).__preloaderDone === true;
      const skipWait = revisit || preloaderDone || !waitForPreloader;
      if (revisit) tl.timeScale(1.6);

      let started = false;
      const go = () => {
        if (started) return;
        started = true;
        tl.play();
      };

      if (!skipWait) {
        window.addEventListener("preloader:reveal", go, { once: true });
        const t = window.setTimeout(go, 9000);
        cleanups.push(() => {
          window.removeEventListener("preloader:reveal", go);
          window.clearTimeout(t);
        });
      } else {
        go();
      }

      return teardown;
    }, el);

    return () => ctx.revert();
  }, [waitForPreloader]);

  return (
    <section
      ref={root}
      className="relative flex min-h-svh w-full flex-col bg-[#F7F7F5] px-4 pb-4 pt-4 text-[#1F2326] md:h-svh md:min-h-[700px] md:px-10 md:pb-8 md:pt-6"
    >
      {/* Text zone */}
      <div className="-mt-1 grid items-end gap-5 md:-mt-3 md:grid-cols-[1fr_auto] md:gap-12">
        <h1
          aria-label="Be uniquely you."
          className="font-[family-name:var(--font-instrument)] text-[clamp(58px,17vw,96px)] leading-[0.95] tracking-[-0.035em] md:pb-[0.24em] md:text-[clamp(60px,7.8vw,180px)] md:leading-[0.9]"
        >
          <span aria-hidden>
            <Word text="Be" /> <Word text="uniquely" italic /> <Word text="you." />
          </span>
        </h1>

        <div className="flex flex-col gap-4 md:items-end md:gap-5 md:pb-4">
          <div data-rule className="invisible h-px w-full bg-[#1F2326]/20 md:hidden" />
          <p className="flex flex-wrap items-center gap-x-3 font-[family-name:var(--font-manrope)] text-[12px] font-semibold uppercase tracking-[0.22em] md:text-[13px]">
            {["Streetwear", "Recycled", "Tailored"].map((s, i) => (
              <span key={s} className="flex items-center gap-x-3">
                <span className="inline-block overflow-hidden py-[2px]">
                  <span data-sub className="invisible inline-block">{s}.</span>
                </span>
                {i < 2 && <span aria-hidden className="h-1 w-1 rounded-full bg-[#1F2326]/30" />}
              </span>
            ))}
          </p>
          <div className="flex items-center gap-6 font-[family-name:var(--font-manrope)]">
            {/* Blue sirf CTA me: New arrivals ke saath shop page kholta hai */}
            <a
              data-cta
              href={`${SHOP_PATH}?category=new#shop`}
              onClick={(e) => goShop(e, "new")}
              className="group invisible relative inline-flex items-center gap-3 overflow-hidden bg-[#B7C9D6] px-7 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-[#1F2326]"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-[#1F2326] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-y-100" />
              <span className="relative transition-colors duration-500 group-hover:text-[#B7C9D6]">Shop the drop</span>
              <span className="relative transition-all duration-500 group-hover:translate-x-1 group-hover:text-[#B7C9D6]">→</span>
            </a>
            <Link
              data-cta
              href="/"
              className="invisible text-[12px] font-medium uppercase tracking-[0.18em] text-[#1F2326]/55 underline decoration-[#1F2326]/20 underline-offset-8 transition-colors hover:text-[#1F2326] hover:decoration-[#1F2326]"
            >
              Our story
            </Link>
          </div>
        </div>
      </div>

      {/* Image: ek hi photo, teen categories */}
      <div
        data-box
        className="relative mt-5 h-[66svh] min-h-0 md:mt-3 md:h-auto md:flex-1"
      >
        {/* Images kabhi move nahi karti, sirf upar ka colour window slide hota hai */}
        <div data-frame className="invisible absolute inset-0 overflow-hidden bg-[#E5E7EA]">
          {/* Dull base */}
          <div className="absolute inset-0 grayscale brightness-[0.78] contrast-[0.88]">
            <div data-zoom className="absolute inset-0 will-change-transform">
              <Pair />
            </div>
          </div>
          {/* Colour: sirf active panel ke andar */}
          <div data-colour className="absolute inset-0 will-change-[clip-path]" style={{ clipPath: "inset(0% 50% 0% 50%)" }}>
            <div data-zoom className="absolute inset-0 will-change-transform">
              <Pair label="Model wearing recycled tailored streetwear" />
            </div>
          </div>
          {/* Readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1F2326]/70 via-[#1F2326]/10 to-transparent" />
        </div>

        {/* Panels (clickable): har ek shop ko apne filter ke saath kholta hai */}
        {CATS.map((c, i) => (
          <a
            key={c.name}
            data-slat
            href={c.href}
            onClick={(e) => goShop(e, c.category)}
            aria-label={`${c.name}, ${c.count} pieces`}
            className="group absolute block outline-none will-change-[left,top,width,height] focus-visible:ring-2 focus-visible:ring-[#B7C9D6]"
          >
            {/* divider (page bg ka rang) */}
            {i > 0 && (
              <span
                data-div
                className="pointer-events-none absolute inset-x-0 -top-[1.5px] z-10 h-[3px] bg-[#F7F7F5] md:inset-x-auto md:inset-y-0 md:left-[-1.5px] md:h-auto md:w-[3px]"
              />
            )}

            <div className="absolute inset-0 overflow-hidden">
              {/* Closed: chhota label */}
              <span
                data-closed
                className="invisible absolute bottom-3 left-3 whitespace-nowrap font-[family-name:var(--font-manrope)] text-[12px] font-semibold uppercase tracking-[0.2em] text-[#F7F7F5] md:bottom-4 md:left-4 md:[writing-mode:vertical-rl] md:[transform:rotate(180deg)]"
              >
                {c.name}
              </span>

              {/* Open: full detail */}
              <div data-open className="invisible absolute inset-x-0 bottom-0 flex flex-col gap-2 whitespace-nowrap p-4 md:p-6">
                <span data-ometa className="invisible font-[family-name:var(--font-manrope)] text-[11px] font-medium uppercase tracking-[0.2em] text-[#F7F7F5]/75">
                  {c.count} pieces · New in
                </span>
                <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
                  <span
                    data-oname
                    className="block font-[family-name:var(--font-instrument)] text-[clamp(40px,5vw,84px)] leading-[1] tracking-[-0.025em] text-[#F7F7F5]"
                  >
                    {c.name}
                  </span>
                </span>
                <span data-ometa className="invisible font-[family-name:var(--font-manrope)] text-[14px] text-[#F7F7F5]/80">
                  {c.blurb}
                </span>
                <span
                  data-ometa
                  className="invisible mt-1 inline-flex w-fit items-center gap-2 border-b border-[#F7F7F5]/50 pb-1 font-[family-name:var(--font-manrope)] text-[12px] font-semibold uppercase tracking-[0.18em] text-[#F7F7F5] transition-all duration-500 group-hover:gap-4 group-hover:border-[#F7F7F5]"
                >
                  Shop {c.name} <span>→</span>
                </span>
              </div>

              {/* Autoplay progress */}
              <span data-prog className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[#F7F7F5]/70" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}