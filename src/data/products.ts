/**
 * products.ts — Central product data for the shop.
 *
 * Each product supports both PREMADE (one-of-a-kind / ready to ship)
 * and PREORDER (made to order). Fields like `soldOut`, `unique`, `badges`,
 * and `variants` are optional so your Shop page can render gracefully
 * even when you don’t use them.
 *
 * Tip: keep this file as the single source of truth; you can house
 * Stripe Payment Links here and your UI just reads them.
 */

export type ProductKind = "premade" | "preorder";

export type ProductVariant = {
  /** Visible option label, e.g. "Small", "Lavender", or "12in" */
  label: string;
  /** Optional price label override for the variant (else fall back to product priceLabel) */
  priceLabel?: string;
  /** Stripe Payment Link for this specific variant */
  paymentLink: string;
  /** Optional variant id if you like to track */
  id?: string;

  /** Optional CTA override for the variant button (compat with Shop.tsx) */
  buttonText?: string;

  /** Legacy compat: some code used v.name — map it to label or keep both */
  name?: string; // <- keep if Shop.tsx still references v.name
};


export type Product = {
  /** Unique id for internal use / keys */
  id: string;
  /** Display title */
  title: string;
  /** Main price label shown on cards (e.g. "$24.99") */
  priceLabel: string;
  /** Hero image path (public/ or imported asset URL) */
  image: string;
  /** Small line under price describing turnaround */
  leadTime: string;
  /** Toggle visibility of this product in the grid */
  active: boolean;

  /** PREMADE (ready to ship) or PREORDER (made to order) */
  kind: ProductKind;

  /** Default Stripe Payment Link (used if no variants provided) */
  paymentLink?: string;

  /** One-sentence marketing blurb */
  description: string;

  /** If true, shows a “1 of 1 / Unique” style badge in UI */
  unique?: boolean;

  /** If true, disables buy buttons and marks as Sold */
  soldOut?: boolean;

  /** Small shipping note shown on premade items (e.g. "Ships next business day") */
  shipNote?: string;

  /** Optional CTA override for the buy button (else Shop computes text automatically) */
  buttonText?: string;

  /** Small badges (“Limited”, “Pastel”, etc.) rendered as pills on the card */
  badges?: string[];

  /** Variants (size/color). If present, Shop will render buttons for each variant */
  variants?: ProductVariant[];
};

/**
 * Exported list the Shop imports.
 * Safe to be empty: the page will render a friendly “no items yet” state.
 */
export const PRODUCTS: Product[] = [];

/* ---------------------------------------------------------
Example product templates (copy, paste, and customize):

export const PRODUCTS: Product[] = [
  // PREORDER example (made to order)
  {
    id: "plushie-bunny",
    title: "Bunny Plush (Pastel)",
    priceLabel: "$29.99",
    image: "/shop/bunny_plush.jpg",
    leadTime: "Made to order • 5–7 days",
    active: true,
    kind: "preorder",
    paymentLink: "https://buy.stripe.com/test_abc123",
    description: "Soft, cuddly, and perfect for gifting.",
    badges: ["Pastel", "Hypoallergenic"],
    // Optional variant set (overrides default paymentLink)
    variants: [
      { label: "Lavender", paymentLink: "https://buy.stripe.com/test_varLav" },
      { label: "Mint",     paymentLink: "https://buy.stripe.com/test_varMint" },
    ],
  },

  // PREMADE example (ready to ship, single unique piece)
  {
    id: "throw-rosegarden-1of1",
    title: "Rose Garden Throw (1 of 1)",
    priceLabel: "$140.00",
    image: "/shop/rosegarden_throw.jpg",
    leadTime: "Ready to ship • 1–2 days",
    active: true,
    kind: "premade",
    paymentLink: "https://buy.stripe.com/test_xyz789",
    description: "One-of-a-kind heirloom throw in soft pastels.",
    unique: true,
    shipNote: "Ships next business day from Springfield, MO",
    badges: ["Unique", "Cozy"],
  },
];
--------------------------------------------------------- */
