// components/(shop)/ShopProvider.tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = { id: string; size: string; qty: number };

type Ctx = {
  ready: boolean; // false until saved data has loaded (avoids empty-state flash)
  wishlist: string[];
  cart: CartLine[];
  wishlistCount: number;
  cartCount: number;
  isWished: (id: string) => boolean;
  toggleWish: (id: string) => void;
  addToCart: (id: string, size: string) => void;
  setQty: (id: string, size: string, qty: number) => void;
  removeFromCart: (id: string, size: string) => void;
};

const ShopCtx = createContext<Ctx | null>(null);
const KEY = "younique-shop-v1";
const MAX_QTY = 10;

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  // load once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (Array.isArray(d.wishlist)) setWishlist(d.wishlist);
        if (Array.isArray(d.cart)) setCart(d.cart);
      }
    } catch {}
    setReady(true);
  }, []);

  // save on change (after load)
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ wishlist, cart }));
    } catch {}
  }, [wishlist, cart, ready]);

  // keep tabs in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY || !e.newValue) return;
      try {
        const d = JSON.parse(e.newValue);
        setWishlist(d.wishlist ?? []);
        setCart(d.cart ?? []);
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleWish = useCallback((id: string) => {
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  }, []);

  const addToCart = useCallback((id: string, size: string) => {
    setCart((c) => {
      const i = c.findIndex((l) => l.id === id && l.size === size);
      if (i === -1) return [...c, { id, size, qty: 1 }];
      const next = [...c];
      next[i] = { ...next[i], qty: Math.min(MAX_QTY, next[i].qty + 1) };
      return next;
    });
  }, []);

  const setQty = useCallback((id: string, size: string, qty: number) => {
    setCart((c) =>
      c
        .map((l) => (l.id === id && l.size === size ? { ...l, qty: Math.min(MAX_QTY, qty) } : l))
        .filter((l) => l.qty > 0)
    );
  }, []);

  const removeFromCart = useCallback((id: string, size: string) => {
    setCart((c) => c.filter((l) => !(l.id === id && l.size === size)));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ready,
      wishlist,
      cart,
      wishlistCount: wishlist.length,
      cartCount: cart.reduce((s, l) => s + l.qty, 0),
      isWished: (id) => wishlist.includes(id),
      toggleWish,
      addToCart,
      setQty,
      removeFromCart,
    }),
    [ready, wishlist, cart, toggleWish, addToCart, setQty, removeFromCart]
  );

  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>;
}

export function useShop() {
  const c = useContext(ShopCtx);
  if (!c) throw new Error("useShop must be used inside <ShopProvider>");
  return c;
}