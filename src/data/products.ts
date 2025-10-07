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
 * title       → Display name of the product
 * priceLabel  → Display price (string, e.g. "$19.99" or "from $120")
 * image       → Path to product image (recommend serving from /public/shop/)
 * description → (optional) Short description shown on product card
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
 * variants    → (optional) Array of { name, paymentLink, buttonText? }
 * buttonText  → (optional) Override the button text (default is "Buy Now" for premade, "Preorder" for preorder)
 *
 * -------------------------------
 * 💡 Usage Tips
 * -------------------------------
 *
 * • Premade items:
 *   - Use kind: "premade"
 *   - Add shipNote (e.g. "Ships in 1–2 days")
 *   - If unique, set unique: true and toggle soldOut: true after it sells
 *
 * • Preorder items:
 *   - Use kind: "preorder"
 *   - Add leadTime (e.g. "Made to order • 5–7 days")
 *   - Stripe Payment Links can handle multiple orders automatically
 *
 * • Variants:
 *   - Use when sizes/colors are different Stripe links
 *   - Example: Small, Medium, Large
 *
 * • Button text:
 *   - Defaults automatically to "Buy Now" (premade) or "Preorder" (preorder)
 *   - Override with `buttonText` if needed ("Buy Pillow", "Preorder Medium")
 *
 * • Sold Out flow:
 *   - Keep the product visible (unique piece with soldOut: true)
 *   - Customers see "Sold" badge and disabled button
 *   - Safe to also deactivate the Stripe Payment Link in dashboard
 *
 * -------------------------------
 * ✨ Example
 * -------------------------------
 *
 * {
 *   id: "crochet-pillow-rose-001",
 *   title: "Crochet Pillow — Rose #001",
 *   priceLabel: "$19.99",
 *   image: "/shop/crochet_pillow.jpg",
 *   description: "One-of-a-kind rose motif pillow.",
 *   shipNote: "Ready to ship • 1–2 days",
 *   badges: ["Unique"],
 *   kind: "premade",
 *   unique: true,
 *   soldOut: false,
 *   active: true,
 *   paymentLink: "https://buy.stripe.com/your_unique_link",
 *   buttonText: "Buy Now"
 * }
 */



export type Variant = {
  name: string;
  paymentLink: string;     // Stripe Payment Link URL
  buttonText?: string;     // Optional override (e.g., "Buy Adult", "Buy Large")
};

export type Product = {
  id: string;
  title: string;
  priceLabel: string;      // "$19.99" or "from $120"
  image: string;           // serve from /public/shop/* for simplicity
  description?: string;
  leadTime?: string;       // e.g., "Made to order • 5–7 days" (for preorders)
  shipNote?: string;       // e.g., "Ships in 1–2 days" (for premade)
  badges?: string[];
  active: boolean;

  /** NEW — differentiate product type */
  kind: "premade" | "preorder";

  /** For premade uniques */
  unique?: boolean;        // 1-of-1 piece
  soldOut?: boolean;       // manually mark when sold (disables button)

  /** Purchase controls */
  paymentLink?: string;    // Use this OR variants
  variants?: Variant[];
  buttonText?: string;     // Optional override, e.g. "Buy Now", "Preorder This"
};

export const PRODUCTS: Product[] = [
  // PREMADE (ready-to-ship)
  {
    id: "rainbow-pumpkin-001",
    title: "Rainbow Crochet Pumpkin",
    priceLabel: "$14.99",
    image: "/shop/Rainbow_Pumpkin.jpg",
    description: "Hand-crocheted rainbow pumpkin adds a cozy, colorful touch to your fall décor. One-of-a-kind piece handmade with love.",
    shipNote: "Ready to ship • 1–2 days",
    badges: ["Unique"],
    kind: "premade",
    unique: true,
    soldOut: false,
    active: true,
    paymentLink: "https://buy.stripe.com/test_eVqfZg32UgUPcDE3fn2Ry01",
    buttonText: "Buy Now",
  },

  // PREORDER (made-to-order)
  

  // PREORDER with variants
  {
    id: "custom-crochet-trex",
    title: "Custom Crochet T-Rex Plushie",
    priceLabel: "$29.99",
    image: "/shop/Crochet_Trex.jpg",
    description: "Adorable hand-crocheted T-Rex plushie made to order! Choose from classic colors or a rainbow version. Each dino is about 4–5” tall and crafted with love.",
    leadTime: "Made to order • 5–7 days",
    badges: ["Giftable"],
    kind: "preorder",
    active: true,
    paymentLink: "https://buy.stripe.com/test_3cI9AS0UM8oj7jkeY52Ry02",
    buttonText: "Preorder Now",
  },
  
];
