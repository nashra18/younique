"use client";

import { useRef, type ReactNode } from "react";
import { TransitionRouter } from "next-transition-router";
import gsap from "gsap";
import { BRAND } from "@/lib/Brand";
import Preloader from "@/components/(homepage)/PreLoader";

const DOME_VH = 14;
const travel = () => window.innerHeight * (1 + DOME_VH / 100 + 0.02);

// Routes that never show the curtain (going to them OR leaving them)
const NO_TRANSITION = ["/wishlist", "/cart"];

const skip = (from?: string, to?: string) => {
  const hit = (p?: string) => {
    const path = (p ?? "").split("?")[0].split("#")[0];
    return NO_TRANSITION.some((r) => path === r || path.startsWith(`${r}/`));
  };
  return hit(from) || hit(to);
};

export default function TransitionProvider({ children }: { children: ReactNode }) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const letters = () =>
    nameRef.current ? Array.from(nameRef.current.querySelectorAll("[data-l]")) : [];

  return (
    <>
      <Preloader />

      <TransitionRouter
        auto
        leave={(next, from, to) => {
          // wishlist / bag: go straight there, no curtain
          if (skip(from, to)) {
            next();
            return;
          }

          const curtain = curtainRef.current!;
          const line = lineRef.current!;
          const l = letters();

          const tl = gsap.timeline({ onComplete: next });

          tl.set(curtain, { autoAlpha: 1, y: travel() })
            .set(l, { yPercent: 115, rotate: 6 })
            .set(line, { scaleX: 0 })
            .to(curtain, { y: 0, duration: 1, ease: "expo.inOut" }, 0)
            .to(
              l,
              { yPercent: 0, rotate: 0, duration: 0.9, ease: "expo.out", stagger: 0.04 },
              0.5
            )
            .to(line, { scaleX: 1, duration: 0.8, ease: "expo.out" }, 0.6);

          return () => tl.kill();
        }}
        enter={(next, from, to) => {
          // must match leave(): if the curtain was skipped, skip the reveal too
          if (skip(from, to)) {
            next();
            return;
          }

          const curtain = curtainRef.current!;
          const line = lineRef.current!;
          const l = letters();

          const tl = gsap.timeline({
            onComplete: () => {
              gsap.set(curtain, { autoAlpha: 0 });
              next();
            },
          });

          tl.to(l, { yPercent: -115, rotate: -5, duration: 0.6, ease: "expo.in", stagger: 0.025 }, 0.1)
            .to(line, { scaleX: 0, transformOrigin: "100% 50%", duration: 0.5, ease: "expo.in" }, 0.1)
            .to(curtain, { y: -travel(), duration: 1, ease: "expo.inOut" }, 0.45);

          return () => tl.kill();
        }}
      >
        <div
          ref={curtainRef}
          aria-hidden
          className="invisible pointer-events-none fixed inset-0 z-[90] bg-[#B7C9D6] text-[#1F2326] will-change-transform"
        >
          {/* curved top edge */}
          <div
            className="absolute left-0 w-full bg-[#B7C9D6]"
            style={{
              bottom: "100%",
              height: `${DOME_VH}vh`,
              borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            }}
          />
          {/* curved bottom edge */}
          <div
            className="absolute left-0 w-full bg-[#B7C9D6]"
            style={{
              top: "100%",
              height: `${DOME_VH}vh`,
              borderRadius: "0 0 50% 50% / 0 0 100% 100%",
            }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
            <span className="block overflow-hidden pb-[0.22em] -mb-[0.22em]">
              <span
                ref={nameRef}
                className="block font-[family-name:var(--font-instrument)] text-[clamp(52px,11vw,160px)] leading-none tracking-[-0.04em]"
              >
                {BRAND.name.split("").map((c, i) => (
                  <span key={i} data-l className="inline-block will-change-transform">
                    {c}
                  </span>
                ))}
              </span>
            </span>
            <div
              ref={lineRef}
              className="h-px w-[min(240px,40vw)] origin-left bg-[#1F2326]/60"
            />
          </div>
        </div>

        {children}
      </TransitionRouter>
    </>
  );
}