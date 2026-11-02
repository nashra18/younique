// lib/shop-data.ts
// IMAGES: put files in public/products/<id>/1.jpg, 2.jpg, 3.jpg  (e.g. public/products/s1/1.jpg)
// Recommended size 1000x1250 (4:5). Change IMAGE_COUNT if you have more or fewer per product.

export type Category = "streetwear" | "recycled" | "tailored";
export type Filter = "all" | Category | "new" | "best";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number; // selling price (INR) – kept in the 888 pattern
  mrp: number; // struck-through price
  rating: number;
  reviews: number;
  category: Category;
  sizes: string[];
  images: string[];
  isNew?: boolean;
  isBest?: boolean;
};

export const IMAGE_COUNT = 3;
const imgs = (id: string) => Array.from({ length: IMAGE_COUNT }, (_, i) => `/products/${id}/${i + 1}.jpg`);
const SIZES = ["S", "M", "L", "XL"];

type Seed = Omit<Product, "images" | "sizes"> & { sizes?: string[] };
const P = (s: Seed): Product => ({ ...s, sizes: s.sizes ?? SIZES, images: imgs(s.id) });

export const PRODUCTS: Product[] = [
  // ---------- Streetwear ----------
  P({ id: "s1", category: "streetwear", name: "Oversized Heavy Tee", description: "240 GSM cotton, dropped shoulder, boxy fit.", price: 1888, mrp: 2499, rating: 4.4, reviews: 1280, isBest: true }),
  P({ id: "s2", category: "streetwear", name: "Washed Boxy Hoodie", description: "Garment-washed fleece with a soft, lived-in feel.", price: 3488, mrp: 4499, rating: 4.3, reviews: 342, isNew: true }),
  P({ id: "s3", category: "streetwear", name: "Wide-Leg Cargo Pants", description: "Relaxed leg, six pockets, adjustable hem.", price: 2888, mrp: 3999, rating: 4.5, reviews: 956, isBest: true }),
  P({ id: "s4", category: "streetwear", name: "Graphic Crewneck", description: "Brushed inside, puff-print chest graphic.", price: 2488, mrp: 3299, rating: 4.2, reviews: 214 }),
  P({ id: "s5", category: "streetwear", name: "Nylon Track Jacket", description: "Lightweight shell, mesh lining, zip pockets.", price: 3888, mrp: 5499, rating: 4.4, reviews: 128, isNew: true }),
  P({ id: "s6", category: "streetwear", name: "Heavy Fleece Joggers", description: "Tapered fit, elastic cuffs, deep side pockets.", price: 2288, mrp: 2999, rating: 4.3, reviews: 487 }),
  P({ id: "s7", category: "streetwear", name: "Varsity Bomber", description: "Wool-blend body, ribbed trims, snap front.", price: 4888, mrp: 6999, rating: 4.6, reviews: 603, isBest: true }),
  P({ id: "s8", category: "streetwear", name: "Distressed Denim Jacket", description: "Rigid denim, frayed hem, oversized body.", price: 4288, mrp: 5999, rating: 4.1, reviews: 96, isNew: true }),

  // ---------- Recycled ----------
  P({ id: "r1", category: "recycled", name: "Patchwork Denim Jacket", description: "Reclaimed denim panels. One of one, never repeated.", price: 5888, mrp: 7999, rating: 4.7, reviews: 312, isBest: true }),
  P({ id: "r2", category: "recycled", name: "Reworked Cotton Shirt", description: "Deadstock cotton, hand-finished seams.", price: 2688, mrp: 3499, rating: 4.3, reviews: 88, isNew: true }),
  P({ id: "r3", category: "recycled", name: "Upcycled Cargo Trousers", description: "Rebuilt from army surplus fabric, washed soft.", price: 3688, mrp: 4999, rating: 4.4, reviews: 174 }),
  P({ id: "r4", category: "recycled", name: "Recycled Cotton Tee", description: "70% recycled yarn, naturally slubby texture.", price: 1488, mrp: 1999, rating: 4.5, reviews: 1104, isBest: true }),
  P({ id: "r5", category: "recycled", name: "Quilted Liner Vest", description: "Recycled-fibre padding, sleeveless, layerable.", price: 3288, mrp: 4499, rating: 4.2, reviews: 67 }),
  P({ id: "r6", category: "recycled", name: "Salvaged Knit Sweater", description: "Unravelled and re-knit from vintage wool.", price: 3888, mrp: 5499, rating: 4.6, reviews: 52, isNew: true }),
  P({ id: "r7", category: "recycled", name: "Reclaimed Utility Overshirt", description: "Workwear fabric, second life, double chest pockets.", price: 3488, mrp: 4799, rating: 4.3, reviews: 141 }),
  P({ id: "r8", category: "recycled", name: "Scrap Fabric Tote", description: "Cut-offs stitched into a sturdy everyday carry.", price: 1288, mrp: 1799, rating: 4.4, reviews: 735, sizes: ["One size"], isBest: true }),

  // ---------- Tailored ----------
  P({ id: "t1", category: "tailored", name: "Single-Breasted Blazer", description: "Structured shoulder, half-canvas, soft wool blend.", price: 6888, mrp: 9999, rating: 4.6, reviews: 421, isBest: true }),
  P({ id: "t2", category: "tailored", name: "Pleated Wide Trousers", description: "High rise, double pleat, falls clean to the shoe.", price: 4488, mrp: 5999, rating: 4.4, reviews: 109, isNew: true }),
  P({ id: "t3", category: "tailored", name: "Oxford Cotton Shirt", description: "Crisp collar, pearl buttons, regular fit.", price: 2888, mrp: 3799, rating: 4.3, reviews: 536 }),
  P({ id: "t4", category: "tailored", name: "Wool Overcoat", description: "Knee length, notch lapel, fully lined for winter.", price: 9888, mrp: 13999, rating: 4.7, reviews: 188, isBest: true }),
  P({ id: "t5", category: "tailored", name: "Slim Chino", description: "Stretch cotton twill, tapered, easy to dress up or down.", price: 3188, mrp: 4299, rating: 4.2, reviews: 392 }),
  P({ id: "t6", category: "tailored", name: "Double-Breasted Waistcoat", description: "Six-button front with an adjustable back strap.", price: 4188, mrp: 5699, rating: 4.3, reviews: 45, isNew: true }),
  P({ id: "t7", category: "tailored", name: "Linen Co-ord Set", description: "Breathable linen shirt and trouser, sold together.", price: 5888, mrp: 7999, rating: 4.5, reviews: 77, isNew: true }),
  P({ id: "t8", category: "tailored", name: "Mandarin Collar Shirt", description: "Fine cotton, clean placket, tailored through the waist.", price: 2488, mrp: 3299, rating: 4.4, reviews: 668, isBest: true }),
];

export const CATEGORY_LABEL: Record<Category, string> = {
  streetwear: "Streetwear",
  recycled: "Recycled",
  tailored: "Tailored",
};

export const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "streetwear", label: "Streetwear" },
  { key: "recycled", label: "Recycled" },
  { key: "tailored", label: "Tailored" },
  { key: "new", label: "New arrivals" },
  { key: "best", label: "Best sellers" },
];

// Delivery rules (change freely)
export const FREE_DELIVERY_AT = 2888;
export const DELIVERY_FEE = 88;

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const discountPct = (p: Product) => Math.round((1 - p.price / p.mrp) * 100);
export const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(".0", "")}k` : `${n}`);
export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);