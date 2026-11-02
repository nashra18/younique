// components/(shop)/CartPage.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { DELIVERY_FEE, FREE_DELIVERY_AT, getProduct, inr, type Product } from "@/data/ShopData";
import { useShop } from "./ShopProvider";

const manrope = "font-[family-name:var(--font-manrope)]";
const instrument = "font-[family-name:var(--font-instrument)]";

function Thumb({ p }: { p: Product }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-[#E5E7EA] md:w-32">
      <div className={`absolute inset-0 flex items-center justify-center ${instrument} text-4xl text-[#1F2326]/10`}>{p.name.charAt(0)}</div>
      {!broken && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.images[0]} alt={p.name} onError={() => setBroken(true)} className="absolute inset-0 h-full w-full object-cover" />
      )}
    </div>
  );
}

export default function CartPage() {
  const { ready, cart, setQty, removeFromCart, toggleWish, isWished } = useShop();

  const lines = cart
    .map((l) => ({ ...l, p: getProduct(l.id) }))
    .filter((l): l is typeof l & { p: Product } => !!l.p);

  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const mrpTotal = lines.reduce((s, l) => s + l.p.mrp * l.qty, 0);
  const saved = mrpTotal - subtotal;
  const free = subtotal >= FREE_DELIVERY_AT;
  const delivery = lines.length === 0 || free ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_AT) * 100);

  return (
    <section className="min-h-[70svh] w-full bg-[#F7F7F5] px-4 pb-24 pt-12 text-[#1F2326] md:px-10 md:pt-16">
      <h1 className={`${instrument} text-[clamp(44px,7vw,104px)] leading-[0.95] tracking-[-0.03em]`}>Your bag</h1>

      {!ready ? null : lines.length === 0 ? (
        <div className="mt-16 max-w-md">
          <p className={`${instrument} text-[clamp(28px,4vw,44px)] leading-tight`}>Your bag is empty</p>
          <p className={`${manrope} mt-3 text-[15px] leading-relaxed text-[#1F2326]/60`}>
            Add a piece from the shop and it will wait for you here.
          </p>
          <Link
            href="/shop"
            className={`${manrope} group relative mt-8 inline-flex items-center overflow-hidden bg-[#B7C9D6] px-8 py-4 text-[13px] font-bold tracking-wide text-[#1F2326]`}
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-[#1F2326] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-y-100" />
            <span className="relative transition-colors duration-500 group-hover:text-[#B7C9D6]">Start shopping</span>
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
          {/* Items */}
          <div>
            {/* Free delivery progress */}
            <div className={`${manrope} mb-8 border border-[#1F2326]/10 p-5`}>
              <p className="text-[14px] font-medium">
                {free ? "You have free delivery on this order." : `Add ${inr(FREE_DELIVERY_AT - subtotal)} more for free delivery.`}
              </p>
              <div className="mt-3 h-[3px] w-full bg-[#E5E7EA]">
                <div className="h-full bg-[#1F2326] transition-[width] duration-700 ease-out" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="divide-y divide-[#1F2326]/10 border-y border-[#1F2326]/10">
              {lines.map(({ p, size, qty }) => (
                <li key={`${p.id}-${size}`} className="flex gap-4 py-6 md:gap-6">
                  <Link href={`/shop?category=${p.category}`} aria-label={p.name}>
                    <Thumb p={p} />
                  </Link>

                  <div className={`${manrope} flex min-w-0 flex-1 flex-col`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-semibold leading-snug">{p.name}</h3>
                        <p className="mt-1 text-[13px] text-[#1F2326]/55">Size: {size}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[15px] font-bold">{inr(p.price * qty)}</p>
                        <p className="text-[12px] text-[#1F2326]/40 line-through">{inr(p.mrp * qty)}</p>
                      </div>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-4">
                      {/* Quantity */}
                      <div className="flex items-center border border-[#1F2326]/15" role="group" aria-label={`Quantity for ${p.name}`}>
                        <button type="button" aria-label="Decrease quantity" onClick={() => setQty(p.id, size, qty - 1)} className="flex h-10 w-10 items-center justify-center text-[16px] transition-colors hover:bg-[#E5E7EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7C9D6]">
                          −
                        </button>
                        <span className="w-8 text-center text-[13px] font-semibold" aria-live="polite">{qty}</span>
                        <button type="button" aria-label="Increase quantity" onClick={() => setQty(p.id, size, qty + 1)} className="flex h-10 w-10 items-center justify-center text-[16px] transition-colors hover:bg-[#E5E7EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7C9D6]">
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-5 text-[12px] font-semibold">
                        {!isWished(p.id) && (
                          <button
                            type="button"
                            onClick={() => {
                              toggleWish(p.id);
                              removeFromCart(p.id, size);
                            }}
                            className="text-[#1F2326]/60 underline decoration-[#1F2326]/20 underline-offset-4 transition-colors hover:text-[#1F2326] hover:decoration-[#1F2326]"
                          >
                            Save for later
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFromCart(p.id, size)}
                          className="text-[#1F2326]/60 underline decoration-[#1F2326]/20 underline-offset-4 transition-colors hover:text-[#1F2326] hover:decoration-[#1F2326]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <Link href="/shop" className={`${manrope} mt-6 inline-block text-[13px] font-semibold underline decoration-[#1F2326]/30 underline-offset-4 hover:decoration-[#1F2326]`}>
              Continue shopping
            </Link>
          </div>

          {/* Summary */}
          <aside className={`${manrope} h-fit border border-[#1F2326]/10 p-6 md:p-8 lg:sticky lg:top-28`}>
            <h2 className={`${instrument} text-[32px] leading-none tracking-[-0.02em]`}>Order summary</h2>

            <dl className="mt-6 space-y-3 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-[#1F2326]/60">Total MRP</dt>
                <dd>{inr(mrpTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#1F2326]/60">Discount</dt>
                <dd>− {inr(saved)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#1F2326]/60">Delivery</dt>
                <dd>{delivery === 0 ? "Free" : inr(delivery)}</dd>
              </div>
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t border-[#1F2326]/10 pt-5">
              <span className="text-[14px] font-semibold">Total</span>
              <span className="text-[22px] font-bold">{inr(total)}</span>
            </div>
            <p className="mt-2 text-[12px] text-[#1F2326]/55">You save {inr(saved)} on this order.</p>

            <Link
              href="/checkout"
              className="group relative mt-6 flex w-full items-center justify-center overflow-hidden bg-[#B7C9D6] px-6 py-4 text-[13px] font-bold tracking-wide text-[#1F2326] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F2326] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7F5]"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-[#1F2326] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-y-100" />
              <span className="relative transition-colors duration-500 group-hover:text-[#B7C9D6]">Proceed to checkout</span>
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}