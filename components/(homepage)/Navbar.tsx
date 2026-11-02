// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Logo from "@/components/(homepage)/Logo";
import PromoBar from "@/components/(homepage)/Promobar";
import { useShop } from "@/components/(shoppage)/ShopProvider"; // adjust path if yours differs

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Streetwear / Recycled / Tailored are filters of the Shop page
const FILTERS = [
  { label: "Streetwear", href: "/shop?category=streetwear" },
  { label: "Recycled", href: "/shop?category=recycled" },
  { label: "Tailored", href: "/shop?category=tailored" },
];

const MENU_LINKS = [
  { label: "New in", href: "/shop?category=new" },
  { label: "Best sellers", href: "/shop?category=best" },
  { label: "Our story", href: "/#story" }, // change when you build a story page
];

const MENU_FOOTER = [
  { label: "Wishlist", href: "/wishlist" },
  { label: "Bag", href: "/cart" },
  { label: "Search", href: "/search" },
];

const POPULAR = ["Oversized tee", "Cargo", "Blazer", "Jacket"];

const iconBtn =
  "group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#1F2326] transition-colors duration-300 hover:bg-[#1F2326]/[0.06] focus-visible:bg-[#1F2326]/[0.06] focus-visible:outline-none";

function Tip({ label }: { label: string }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-1/2 top-full z-[60] mt-2 hidden -translate-x-1/2 translate-y-1 whitespace-nowrap bg-[#1F2326] px-3 py-2 text-[10px] font-bold uppercase leading-none tracking-[0.18em] text-[#F7F7F5] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 md:block"
    >
      {label}
    </span>
  );
}

export default function Navbar({
  waitForPreloader = true,
}: {
  waitForPreloader?: boolean;
}) {
  // counts now come from the shared shop state (wishlist + bag)
  const { cartCount, wishlistCount } = useShop();

  const router = useRouter();
  const root = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const lockRef = useRef(false);

  useEffect(() => {
    lockRef.current = open || searching;
  }, [open, searching]);

  // ---- entrance (same trigger as the hero)
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-nav-in]", el);
      if (reduce) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.set(items, { autoAlpha: 0, y: -12 });
      const tl = gsap.timeline({ paused: true });
      tl.to(items, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out", stagger: 0.06 }, 0);

      let started = false;
      const go = () => {
        if (started) return;
        started = true;
        tl.play();
      };
      if (waitForPreloader) {
        window.addEventListener("preloader:reveal", go, { once: true });
        const t = window.setTimeout(go, 9000);
        return () => {
          window.removeEventListener("preloader:reveal", go);
          window.clearTimeout(t);
        };
      } else go();
    }, el);

    return () => ctx.revert();
  }, [waitForPreloader]);

  // ---- hide on scroll down, show on scroll up (navbar only)
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let last = window.scrollY;
    let hidden = false;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      const goingDown = y > last && y > 160;
      if (!lockRef.current && goingDown && !hidden) {
        hidden = true;
        gsap.to(el, { yPercent: -100, duration: 0.5, ease: "power3.out", overwrite: "auto" });
      } else if ((y < last || y <= 160 || lockRef.current) && hidden) {
        hidden = false;
        gsap.to(el, { yPercent: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
      }
      last = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ---- full-screen menu open / close (all screen sizes)
  useEffect(() => {
    const m = menu.current;
    if (!m) return;
    const items = m.querySelectorAll("[data-menu-in]");
    document.body.style.overflow = open ? "hidden" : "";

    if (open) {
      gsap.killTweensOf([m, items]);
      gsap.set(m, { pointerEvents: "auto" });
      gsap.to(m, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" });
      gsap.fromTo(
        items,
        { yPercent: 110 },
        { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.07, delay: 0.3 }
      );
    } else {
      gsap.killTweensOf([m, items]);
      gsap.to(m, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.6,
        ease: "expo.inOut",
        onComplete: () => {
          gsap.set(m, { pointerEvents: "none" });
        },
      });
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearching(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeAll = () => {
    setOpen(false);
    setSearching(false);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearching(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* Promo: normal bar, scrolls away with the page (not part of the sticky header) */}
      <PromoBar />

      <header
        ref={root}
        className={`sticky top-0 z-50 w-full border-b bg-[#F7F7F5] font-[family-name:var(--font-manrope)] text-[#1F2326] transition-[border-color] duration-300 ${
          scrolled && !open ? "border-[#1F2326]/10" : "border-transparent"
        }`}
      >
        <nav
          aria-label="Main"
          className="relative z-50 flex h-16 items-center justify-between gap-3 px-4 md:h-20 md:px-10"
        >
          {/* Left: logo */}
          <Link
            data-nav-in
            href="/"
            aria-label="Younique home"
            onClick={closeAll}
            className="invisible min-w-0 shrink text-[#1F2326]"
          >
            <Logo className="text-[22px] md:text-[28px]" />
          </Link>

          {/* Right: search, wishlist, bag, menu */}
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              data-nav-in
              type="button"
              aria-label="Search"
              aria-expanded={searching}
              onClick={() => {
                setOpen(false);
                setSearching((v) => !v);
              }}
              className={`${iconBtn} invisible`}
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <Tip label="Search" />
            </button>

            <Link
              data-nav-in
              href="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} items`}
              onClick={closeAll}
              className={`${iconBtn} invisible`}
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9Z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#1F2326] px-1 text-[10px] font-bold leading-none text-[#F7F7F5]">
                  {wishlistCount}
                </span>
              )}
              <Tip label="Wishlist" />
            </Link>

            <Link
              data-nav-in
              href="/cart"
              aria-label={`Bag, ${cartCount} items`}
              onClick={closeAll}
              className={`${iconBtn} invisible`}
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 8h14l-1 12H6L5 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#1F2326] px-1 text-[10px] font-bold leading-none text-[#F7F7F5]">
                  {cartCount}
                </span>
              )}
              <Tip label={`Bag${cartCount > 0 ? ` (${cartCount})` : ""}`} />
            </Link>

            <button
              data-nav-in
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => {
                setSearching(false);
                setOpen((v) => !v);
              }}
              className={`${iconBtn} invisible`}
            >
              <span className="relative block h-[10px] w-6">
                <span
                  className={`absolute right-0 h-px bg-current transition-all duration-500 ${
                    open ? "top-[5px] w-6 -rotate-45" : "top-0 w-6"
                  }`}
                />
                <span
                  className={`absolute right-0 h-px bg-current transition-all duration-500 ${
                    open ? "top-[5px] w-6 rotate-45" : "top-[10px] w-4"
                  }`}
                />
              </span>
              <Tip label={open ? "Close" : "Menu"} />
            </button>
          </div>
        </nav>

        {/* Search drawer */}
        <div
          className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.7,0,.2,1)] ${
            searching ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-[#1F2326]/10 px-4 py-4 md:px-10 md:py-6">
              <form role="search" onSubmit={submitSearch} className="flex items-center gap-4">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search streetwear, recycled, tailored…"
                  tabIndex={searching ? 0 : -1}
                  className="w-full bg-transparent text-[16px] outline-none placeholder:text-[#1F2326]/40 md:text-[22px]"
                />
                <button
                  type="submit"
                  tabIndex={searching ? 0 : -1}
                  className="shrink-0 bg-[#B7C9D6] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors hover:bg-[#1F2326] hover:text-[#B7C9D6]"
                >
                  Search
                </button>
              </form>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]">
                <span className="mr-2 text-[#1F2326]/40">Popular</span>
                {POPULAR.map((p) => (
                  <Link
                    key={p}
                    href={`/search?q=${encodeURIComponent(p)}`}
                    tabIndex={searching ? 0 : -1}
                    onClick={closeAll}
                    className="border border-[#1F2326]/15 px-3 py-2 transition-colors hover:border-[#1F2326] hover:bg-[#1F2326] hover:text-[#F7F7F5]"
                  >
                    {p}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen menu */}
      <div
        ref={menu}
        aria-hidden={!open}
        className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between bg-[#F7F7F5] px-4 pb-8 pt-[96px] text-[#1F2326] md:px-10 md:pb-10 md:pt-[120px]"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <ul className="flex flex-col gap-2">
          {/* Shop (main) + its filters */}
          <li className="overflow-hidden pb-[0.14em]">
            <div data-menu-in>
              <Link
                href="/shop"
                onClick={closeAll}
                tabIndex={open ? 0 : -1}
                className="block font-[family-name:var(--font-instrument)] text-[clamp(52px,13vw,110px)] leading-[1.05] tracking-[-0.03em]"
              >
                Shop
              </Link>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#1F2326]/60">
                {FILTERS.map((f) => (
                  <Link
                    key={f.label}
                    href={f.href}
                    onClick={closeAll}
                    tabIndex={open ? 0 : -1}
                    className="transition-colors hover:text-[#1F2326]"
                  >
                    {f.label}
                  </Link>
                ))}
              </div>
            </div>
          </li>

          {MENU_LINKS.map((l) => (
            <li key={l.label} className="overflow-hidden pb-[0.14em]">
              <Link
                data-menu-in
                href={l.href}
                onClick={closeAll}
                tabIndex={open ? 0 : -1}
                className="block font-[family-name:var(--font-instrument)] text-[clamp(44px,11vw,84px)] leading-[1.05] tracking-[-0.03em]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-[#1F2326]/15 pt-5 text-[12px] font-semibold uppercase tracking-[0.18em] md:justify-start md:gap-10">
          {MENU_FOOTER.map((l) => (
            <Link key={l.label} href={l.href} onClick={closeAll} tabIndex={open ? 0 : -1}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}