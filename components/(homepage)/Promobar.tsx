// components/PromoBar.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const MESSAGES = [
  { text: "Free shipping over ₹999", cta: "Shop now", href: "/" },
  { text: "Easy 7-day returns", cta: "Details", href: "/" },
  { text: "New drop: FW / 26 is live", cta: "Explore", href: "/" },
];

const EVERY = 2; // seconds per message

export default function PromoBar() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-promo]", el);
      gsap.set(items, { yPercent: 100, autoAlpha: 0 });
      gsap.set(items[0], { yPercent: 0, autoAlpha: 1 });
      if (reduce) return;

      let cur = 0;
      const next = () => {
        const n = (cur + 1) % items.length;
        gsap.to(items[cur], { yPercent: -100, autoAlpha: 0, duration: 0.5, ease: "power3.inOut", overwrite: true });
        gsap.fromTo(
          items[n],
          { yPercent: 100, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power3.inOut", overwrite: true }
        );
        cur = n;
        timer.restart(true);
      };
      const timer = gsap.delayedCall(EVERY, next);

      const pause = () => timer.pause();
      const resume = () => timer.play();
      el.addEventListener("mouseenter", pause);
      el.addEventListener("mouseleave", resume);
      el.addEventListener("focusin", pause);
      el.addEventListener("focusout", resume);

      return () => {
        timer.kill();
        el.removeEventListener("mouseenter", pause);
        el.removeEventListener("mouseleave", resume);
        el.removeEventListener("focusin", pause);
        el.removeEventListener("focusout", resume);
      };
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      role="region"
      aria-label="Announcements"
      aria-live="off"
      className="relative m-0 h-8 w-full overflow-hidden bg-[#1F2326] font-[family-name:var(--font-manrope)] text-[#F7F7F5]"
    >
      {MESSAGES.map((m) => (
        <div
          key={m.text}
          data-promo
          className="absolute inset-0 flex items-center justify-center gap-3 whitespace-nowrap px-4 text-[10px] font-semibold uppercase tracking-[0.2em] md:text-[11px]"
        >
          <span className="truncate">{m.text}</span>
          <span aria-hidden className="h-[3px] w-[3px] shrink-0 rounded-full bg-[#B7C9D6]" />
          <Link
            href={m.href}
            className="shrink-0 text-[#B7C9D6] underline decoration-[#B7C9D6]/40 underline-offset-4 transition-colors hover:text-[#F7F7F5] hover:decoration-[#F7F7F5]"
          >
            {m.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}