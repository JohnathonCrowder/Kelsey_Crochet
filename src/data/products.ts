// src/data/products.ts

/**
 * 🧵 Kelsey’s Crochet — Product Catalog
 *
 * This file controls the products shown in the shop.
 * Products are grouped into "premade" (ready-to-ship) and "preorder" (made-to-order).
 * Stripe Payment Links handle all checkout.
 *
 * -------------------------------
 * 🔑 Product Schema
 * -------------------------------
 *
 * id          → Unique identifier (string, kebab-case recommended)
 * slug        → (optional) Pretty URL for /product/:slug (falls back to id)
 * title       → Display name of the product
 * priceLabel  → Display price (string, e.g. "$19.99" or "from $120")
 * image       → Path to primary product image (recommend serving from /public/shop/)
 * images      → (optional) Gallery list of image URLs
 * imagesFolder→ (optional) Public folder like "/products/pink-dino/" (auto-discovers images)
 * description → (optional) Short description shown on product card & detail page
 * leadTime    → (optional) Timeline for preorder items (e.g. "Made to order • 5–7 days")
 * shipNote    → (optional) Timeline for premade items (e.g. "Ships in 1–2 days")
 * badges      → (optional) Array of strings to highlight (e.g. ["Unique", "Giftable"])
 * active      → Boolean — set false to hide product
 *
 * kind        → "premade" | "preorder"
 * unique      → (optional) Boolean — if this is a one-of-a-kind piece
 * soldOut     → (optional) Boolean — set true after it sells (keeps it visible with a “Sold” badge)
 *
 * paymentLink → (optional) Stripe Payment Link URL (single product)
 * variants    → (optional) Array of { name, paymentLink?, buttonText? }
 * buttonText  → (optional) Override the button text (default is "Buy Now" for premade, "Preorder" for preorder)
 */

export type Variant = {
  name: string;
  paymentLink?: string;   // Optional to be lenient with CSV/static data
  buttonText?: string;    // Optional override (e.g., "Buy Adult", "Buy Large")
};

export type Product = {
  id: string;
  slug?: string;          // optional pretty URL
  title: string;
  priceLabel: string;     // "$19.99" or "from $120"
  image: string;          // serve from /public/* for simplicity
  images?: string[];      // optional explicit gallery list
  imagesFolder?: string;  // optional folder path like "/products/pink-dino/"
  description?: string;
  leadTime?: string;      // e.g., "Made to order • 5–7 days" (for preorders)
  shipNote?: string;      // e.g., "Ships in 1–2 days" (for premade)
  badges?: string[];
  active: boolean;

  /** differentiate product type */
  kind: "premade" | "preorder";

  /** For premade uniques */
  unique?: boolean;       // 1-of-1 piece
  soldOut?: boolean;      // manually mark when sold (disables button)

  /** Purchase controls */
  paymentLink?: string;   // Use this OR variants
  variants?: Variant[];
  buttonText?: string;    // Optional override, e.g. "Buy Now", "Preorder This"
};

export const PRODUCTS: Product[] = [
  // PREMADE (ready-to-ship)
  {
    id: "rainbow-pumpkin-001",
    title: "Rainbow Crochet Pumpkin",
    priceLabel: "$14.99",
    image: "/shop/Rainbow_Pumpkin.jpg",
    description:
      "Hand-crocheted rainbow pumpkin adds a cozy, colorful touch to your fall décor. One-of-a-kind piece handmade with love.",
    shipNote: "Ready to ship • 1–2 days",
    badges: [],
    kind: "premade",
    unique: true,
    soldOut: false,
    active: true,
    paymentLink: "https://buy.stripe.com/test_eVqfZg32UgUPcDE3fn2Ry01",
    buttonText: "Buy Now",
  },

  // PREORDER with single link
  {
    id: "custom-crochet-trex",
    title: "Custom Crochet T-Rex Plushie",
    priceLabel: "$29.99",
    image: "/shop/Crochet_Trex.jpg",
    description:
      "Adorable hand-crocheted T-Rex plushie made to order! Choose from classic colors or a rainbow version. Each dino is about 4–5” tall and crafted with love.",
    leadTime: "Made to order • 5–7 days",
    badges: ["Giftable"],
    kind: "preorder",
    active: true,
    paymentLink: "https://buy.stripe.com/test_3cI9AS0UM8oj7jkeY52Ry02",
    buttonText: "Preorder Now",
  },
];
