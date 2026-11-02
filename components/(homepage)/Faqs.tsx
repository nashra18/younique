// components/(homepage)/FaqSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FREE_DELIVERY_AT, inr } from "@/data/ShopData";

const manrope = "font-[family-name:var(--font-manrope)]";
const instrument = "font-[family-name:var(--font-instrument)]";

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Most orders ship within 1 to 2 working days and arrive in 3 to 7 working days, depending on your city.",
  },
  {
    q: "Is delivery free?",
    a: `Yes, delivery is free on orders above ${inr(FREE_DELIVERY_AT)}. Below that, a small flat shipping fee is added at checkout.`,
  },
  {
    q: "Can I return or exchange a piece?",
    a: "Yes. Unworn items with tags can be returned or exchanged within 7 days of delivery. Recycled pieces are one of one, so exchanges depend on stock.",
  },
  {
    q: "How do your sizes fit?",
    a: "Streetwear is cut oversized, so size down if you want a regular fit. Tailored pieces run true to size. Each product page has a size chart.",
  },
  {
    q: "Why is every recycled piece different?",
    a: "Each one is made from reclaimed fabric, so patterns and washes vary. What you see in the photos is exactly the piece you receive.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "UPI, cards, net banking and cash on delivery on selected pin codes.",
  },
];

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

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const [headRef, headSeen] = useSeen<HTMLDivElement>(0.2);
  const [listRef, listSeen] = useSeen<HTMLDivElement>(0.1);

  const reveal = (on: boolean, delay = 0) => ({
    opacity: on ? 1 : 0,
    transform: on ? "none" : "translateY(24px)",
    transitionDelay: on ? `${delay}ms` : "0ms",
  });
  const revealCls =
    "transition-[opacity,transform] duration-[1000ms] ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none";

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative w-full scroll-mt-20 bg-[#F7F7F5] px-4 py-20 text-[#1F2326] md:scroll-mt-24 md:px-10 md:py-32"
    >
      <div className="grid gap-12 md:grid-cols-12 md:gap-x-10">
        <div ref={headRef} className={`md:col-span-5 ${revealCls}`} style={reveal(headSeen)}>
          <p className={`${manrope} text-[12px] font-semibold uppercase tracking-[0.22em]`}>(FAQs)</p>
          <h2
            id="faq-title"
            className={`${instrument} mt-6 text-[clamp(40px,5vw,76px)] leading-[1] tracking-[-0.03em]`}
          >
            Questions, <span className="italic">answered.</span>
          </h2>
          <p className={`${manrope} mt-6 max-w-sm text-[15px] leading-relaxed text-[#1F2326]/65`}>
            Cannot find what you are looking for? Reach out and we will get back to you quickly.
          </p>
          <Link
            href="/contact"
            className={`${manrope} mt-8 inline-flex items-center gap-3 border border-[#1F2326] px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-[#1F2326] hover:text-[#F7F7F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7C9D6]`}
          >
            Contact us <span aria-hidden>→</span>
          </Link>
        </div>

        <div
          ref={listRef}
          className={`md:col-span-7 lg:col-span-6 lg:col-start-7 ${revealCls}`}
          style={reveal(listSeen, 150)}
        >
          <ul className="border-t border-[#1F2326]/15">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q} className="border-b border-[#1F2326]/15">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-btn-${i}`}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7C9D6]"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className={`${manrope} text-[11px] font-semibold tracking-[0.18em] text-[#1F2326]/40`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className={`${instrument} text-[clamp(20px,2vw,28px)] leading-tight tracking-[-0.01em]`}>
                          {f.q}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={`${manrope} text-2xl leading-none transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`}
                      >
                        +
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-btn-${i}`}
                    className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className={`${manrope} max-w-xl pb-6 pl-9 text-[15px] leading-relaxed text-[#1F2326]/65`}>
                        {f.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}