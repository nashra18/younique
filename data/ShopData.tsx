// data/ShopData.ts
// IMAGES: public/<category>/<category><number>.jpg
//   s1 -> /streetwear/streetwear1.jpg
//   r5 -> /recycled/recycled5.jpg
//   t8 -> /tailored/tailored8.jpg
// Different file name for any product? Add  files: ["my-photo.jpg"]  to that product.

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

const SIZES = ["S", "M", "L", "XL"];

type Seed = Omit<Product, "images" | "sizes"> & {
  sizes?: string[];
  files?: string[]; // optional: your own file names (only the name, not the folder)
};

const P = ({ files, ...s }: Seed): Product => {
  const num = s.id.slice(1); // "r5" -> "5"
  return {
    ...s,
    sizes: s.sizes ?? SIZES,
    images: files
      ? files.map((f) => `/${s.category}/${f}`)
      : [`/${s.category}/${s.category}${num}.jpg`],
  };
};

export const PRODUCTS: Product[] = [
  // ---------- Streetwear ----------
P({ id: "s1", category: "streetwear", name: "Relaxed Button-Up Shirt", description: "Minimal relaxed-fit shirt, styled with wide-leg denim for an effortless street look.", price: 1888, mrp: 2499, rating: 4.4, reviews: 1280, isBest: true }),

P({ id: "s2", category: "streetwear", name: "Oversized Washed Hoodie", description: "Relaxed oversized hoodie with a washed finish and an easy everyday silhouette.", price: 3488, mrp: 4499, rating: 4.3, reviews: 342, isNew: true }),

P({ id: "s3", category: "streetwear", name: "Toggle-Front Utility Jacket", description: "Statement jacket with traditional toggle closures, paired with relaxed wide-leg trousers.", price: 2888, mrp: 3999, rating: 4.5, reviews: 956, isBest: true }),

P({ id: "s4", category: "streetwear", name: "Graphic Leather Jacket", description: "Bold back-print leather jacket with a statement finish and oversized fit.", price: 2488, mrp: 3299, rating: 4.2, reviews: 214 }),

P({ id: "s5", category: "streetwear", name: "Oversized Graphic Sweatshirt", description: "Relaxed graphic sweatshirt paired with layered plaid styling for an expressive look.", price: 3888, mrp: 5499, rating: 4.4, reviews: 128, isNew: true }),

P({ id: "s6", category: "streetwear", name: "Wide-Leg Denim Jeans", description: "Statement wide-leg denim with a relaxed silhouette and contemporary street styling.", price: 2288, mrp: 2999, rating: 4.3, reviews: 487 }),

P({ id: "s7", category: "streetwear", name: "Varsity Bomber Jacket", description: "Classic varsity-inspired jacket with contrasting details and a relaxed streetwear fit.", price: 4888, mrp: 6999, rating: 4.6, reviews: 603, isBest: true }),

P({ id: "s8", category: "streetwear", name: "Distressed Denim Jacket", description: "Vintage-inspired oversized denim jacket with distressed detailing and layered styling.", price: 4288, mrp: 5999, rating: 4.1, reviews: 96, isNew: true }),

  // ---------- Recycled ----------
// ---------- Recycled ----------
  P({ id: "r1", category: "recycled", name: "Patchwork Halter Dress", description: "Reconstructed denim and fabric panels with an asymmetrical draped silhouette.", price: 5888, mrp: 7999, rating: 4.7, reviews: 312, isBest: true }),

  P({ id: "r2", category: "recycled", name: "Floral Layered Denim Skirt", description: "Vintage denim mini skirt with a sheer floral overlay and an experimental finish.", price: 2688, mrp: 3499, rating: 4.3, reviews: 88, isNew: true }),

  P({ id: "r3", category: "recycled", name: "Feather-Trim Denim Skirt", description: "Reworked denim with statement feather detailing and decorative metal accents.", price: 3688, mrp: 4999, rating: 4.4, reviews: 174 }),

  P({ id: "r4", category: "recycled", name: "Striped Halter Top", description: "Reconstructed striped fabric with a draped neckline and an open-back silhouette.", price: 1488, mrp: 1999, rating: 4.5, reviews: 1104, isBest: true }),

  P({ id: "r5", category: "recycled", name: "Patchwork Wide-Leg Jeans", description: "Reclaimed denim panels combined into relaxed, statement-making wide-leg jeans.", price: 3288, mrp: 4499, rating: 4.2, reviews: 67 }),

  P({ id: "r6", category: "recycled", name: "Reworked Plaid Corset Top", description: "Mixed plaid fabrics shaped into a structured corset with contrasting patchwork details.", price: 3888, mrp: 5499, rating: 4.6, reviews: 52, isNew: true }),

  P({ id: "r7", category: "recycled", name: "Patchwork Denim Corset Dress", description: "Reconstructed denim and contrasting fabric panels with lace-up detailing.", price: 3488, mrp: 4799, rating: 4.3, reviews: 141 }),

  P({ id: "r8", category: "recycled", name: "Panelled Upcycled Trousers", description: "Relaxed wide-leg trousers featuring contrasting reclaimed fabric panels.", price: 1288, mrp: 1799, rating: 4.4, reviews: 735, sizes: ["One size"], isBest: true }),

// ---------- Tailored ----------
  P({ id: "t1", category: "tailored", name: "Relaxed Wool Blazer", description: "Structured wool-blend blazer with a relaxed silhouette and minimal detailing.", price: 6888, mrp: 9999, rating: 4.6, reviews: 421, isBest: true }),

  P({ id: "t2", category: "tailored", name: "Tailored Blazer Dress", description: "Elegant double-breasted blazer dress with a fitted waist and sharp lapels.", price: 4488, mrp: 5999, rating: 4.4, reviews: 109, isNew: true }),

  P({ id: "t3", category: "tailored", name: "Embroidered Velvet Jacket", description: "Statement dark velvet jacket with intricate gold embroidery and ornate detailing.", price: 2888, mrp: 3799, rating: 4.3, reviews: 536 }),

  P({ id: "t4", category: "tailored", name: "Relaxed Wool Overcoat", description: "Classic tailored overcoat with a relaxed fit and wide-leg trousers.", price: 9888, mrp: 13999, rating: 4.7, reviews: 188, isBest: true }),

  P({ id: "t5", category: "tailored", name: "Slim-Fit Formal Suit", description: "Clean-cut formal suit crafted in stretch cotton twill for everyday sophistication.", price: 3188, mrp: 4299, rating: 4.2, reviews: 392 }),

  P({ id: "t6", category: "tailored", name: "Double-Breasted Waistcoat", description: "Structured double-breasted waistcoat with a sharp neckline and tailored fit.", price: 4188, mrp: 5699, rating: 4.3, reviews: 45, isNew: true }),

  P({ id: "t7", category: "tailored", name: "Leather Co-ord Set", description: "Coordinated leather-look jacket and wide-leg trousers with a contemporary finish.", price: 5888, mrp: 7999, rating: 4.5, reviews: 77, isNew: true }),

  P({ id: "t8", category: "tailored", name: "Puff-Sleeve Shirt Dress", description: "Elegant button-front silhouette with voluminous sleeves and a defined waist.", price: 2488, mrp: 3299, rating: 4.4, reviews: 668, isBest: true }),]
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