// components/(homepage)/Footer.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/Brand";

const manrope = "font-[family-name:var(--font-manrope)]";
const instrument = "font-[family-name:var(--font-instrument)]";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All pieces", href: "/shop#shop" },
      { label: "Streetwear", href: "/shop?category=streetwear#shop" },
      { label: "Recycled", href: "/shop?category=recycled#shop" },
      { label: "Tailored", href: "/shop?category=tailored#shop" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our story", href: "/our-story" },
      { label: "FAQs", href: "/#faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Size guide", href: "/size-guide" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [year, setYear] = useState(2026); // fallback, effect me real year set hota hai

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    // TODO: yahan apni API / newsletter service call lagao
    setDone(true);
    setEmail("");
  };

  return (
    <footer className="relative w-full bg-[#1F2326] px-4 pb-8 pt-20 text-[#F7F7F5] md:px-10 md:pt-28">
      <div className="grid gap-14 md:grid-cols-12 md:gap-x-10">
        {/* Newsletter */}
        <div className="md:col-span-5">
          <p className={`${manrope} text-[12px] font-semibold uppercase tracking-[0.22em] text-[#F7F7F5]/50`}>
            (Newsletter)
          </p>
          <h2 className={`${instrument} mt-6 max-w-md text-[clamp(32px,3.6vw,52px)] leading-[1.02] tracking-[-0.02em]`}>
            Get first access to every <span className="italic">drop.</span>
          </h2>

          <form
            onSubmit={onSubmit}
            className="mt-8 flex max-w-md border-b border-[#F7F7F5]/30 focus-within:border-[#B7C9D6]"
          >
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setDone(false);
              }}
              placeholder="Your email"
              className={`${manrope} w-full bg-transparent py-4 text-[15px] text-[#F7F7F5] placeholder:text-[#F7F7F5]/40 focus:outline-none`}
            />
            <button
              type="submit"
              className={`${manrope} shrink-0 px-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[#B7C9D6] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7C9D6]`}
            >
              Join →
            </button>
          </form>
          <p aria-live="polite" className={`${manrope} mt-3 h-5 text-[13px] text-[#B7C9D6]`}>
            {done ? "Thanks, you are on the list." : ""}
          </p>
        </div>

        {/* Links */}
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7 lg:col-span-6 lg:col-start-7"
        >
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <p className={`${manrope} text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F7F7F5]/45`}>
                {c.title}
              </p>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className={`${manrope} text-[15px] text-[#F7F7F5]/85 transition-colors duration-300 hover:text-[#B7C9D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7C9D6]`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Big wordmark */}
      <p
        aria-hidden
        className={`${instrument} mt-20 select-none text-center text-[clamp(64px,19vw,300px)] leading-[0.85] tracking-[-0.04em] text-[#F7F7F5]/10 md:mt-28`}
      >
        {BRAND.name}
      </p>

      {/* Bottom bar */}
      <div
        className={`${manrope} mt-10 flex flex-col gap-4 border-t border-[#F7F7F5]/15 pt-6 text-[12px] text-[#F7F7F5]/50 sm:flex-row sm:items-center sm:justify-between`}
      >
        <p>
          © {year} {BRAND.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="transition-colors hover:text-[#B7C9D6]">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-[#B7C9D6]">
            Terms
          </Link>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-semibold uppercase tracking-[0.16em] transition-colors hover:text-[#B7C9D6]"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}