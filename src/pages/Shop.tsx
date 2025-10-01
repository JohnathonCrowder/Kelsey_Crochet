// src/pages/Shop.tsx
import { useEffect, useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/homepage/Footer";
import { Blob } from "../components/Decor";
import { PRODUCTS, Product } from "../data/products";
import {
  Sparkles,
  ShoppingBag,
  Shield,
  Truck,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";

/* ----------------------- Helpers ----------------------- */

function byKind(kind: Product["kind"]) {
  return (p: Product) => p.active && p.kind === kind;
}

function defaultCta(p: Product) {
  if (p.buttonText) return p.buttonText;
  return p.kind === "premade" ? "Buy Now" : "Preorder";
}

function availabilityForSchema(p: Product) {
  if (p.soldOut) return "https://schema.org/SoldOut";
  return p.kind === "premade" ? "https://schema.org/InStock" : "https://schema.org/PreOrder";
}

function priceNumber(priceLabel: string) {
  const n = priceLabel.replace(/[^0-9.]/g, "");
  return n ? Number(n) : undefined;
}

/* ----------------------- Page ----------------------- */

export default function Shop() {
  // Basic SEO
  useEffect(() => {
    document.title = "Shop • Kelsey’s Crochet";
    const ensureMeta = (name: string, content: string) => {
      const el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        const m = document.createElement("meta");
        m.setAttribute("name", name);
        m.setAttribute("content", content);
        document.head.appendChild(m);
      } else {
        el.setAttribute("content", content);
      }
    };
    ensureMeta("description", "Handmade crochet — ready to ship & made to order — secure Stripe checkout.");
  }, []);

  const premade = useMemo(() => PRODUCTS.filter(byKind("premade")), []);
  const preorder = useMemo(() => PRODUCTS.filter(byKind("preorder")), []);

  // Build Product JSON-LD array
  const productJsonLd = useMemo(() => {
    const all = [...premade, ...preorder];
    const items = all.map((p) => ({
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.title,
      image: [p.image],
      description:
        p.description ||
        (p.kind === "premade" ? "Ready to ship crochet item" : "Made to order crochet item"),
      brand: { "@type": "Brand", name: "Kelsey’s Crochet" },
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: priceNumber(p.priceLabel),
        availability: availabilityForSchema(p),
        url:
          (p.paymentLink && !p.soldOut ? p.paymentLink : undefined) ||
          undefined,
      },
    }));
    return JSON.stringify(items);
  }, [premade, preorder]);

  return (
    <>
      <Header />

      <main className="relative overflow-hidden bg-gradient-to-b from-petal-50/60 to-white">
        {/* Background accents */}
        <Blob className="-z-10 top-[6rem] left-[-12rem] opacity-30" />
        <Blob className="-z-10 bottom-[-10rem] right-[-16rem] opacity-20" />

        <div className="container-max py-16 md:py-20">
          {/* Intro */}
          <header className="text-center max-w-2xl mx-auto">
            <span className="pill bg-white/80">
              <Sparkles className="h-3.5 w-3.5" />
              ready to ship • made to order
            </span>
            <h1 className="mt-4 font-display text-4xl md:text-5xl tracking-tight text-petal-900">
              Shop
            </h1>
            <p className="mt-3 text-stone-700">
              Choose a one-of-a-kind piece or order something made just for you.
              Checkout is fast and secure via Stripe.
            </p>
          </header>

          {/* Benefits bar */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="card p-3 flex items-center justify-center gap-2">
              <ShoppingBag className="h-4 w-4" /> Apple / Google Pay supported
            </div>
            <div className="card p-3 flex items-center justify-center gap-2">
              <Truck className="h-4 w-4" /> Clear shipping & lead times
            </div>
            <div className="card p-3 flex items-center justify-center gap-2">
              <Shield className="h-4 w-4" /> Stripe-secured checkout
            </div>
          </div>

          {/* Ready to Ship */}
          {premade.length > 0 && (
            <section className="mt-12">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl tracking-tight text-petal-900">
                    Ready to Ship
                  </h2>
                  <p className="text-stone-600 text-sm mt-1">
                    Unique and small-batch items—ships in 1–2 days.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {premade.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            </section>
          )}

          {/* Made to Order */}
          {preorder.length > 0 && (
            <section className="mt-12">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl tracking-tight text-petal-900">
                    Made to Order
                  </h2>
                  <p className="text-stone-600 text-sm mt-1">
                    Pick a design—Kelsey crochets it to your specs.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {preorder.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            </section>
          )}

          {/* Custom CTA */}
          <p className="text-center text-sm text-stone-600 mt-10">
            Want something special?{" "}
            <a href="/#contact" className="underline">
              Contact Kelsey
            </a>{" "}
            for a custom commission.
          </p>
        </div>

        {/* SEO: Product JSON-LD */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: productJsonLd }}
        />
      </main>

      <Footer />
    </>
  );
}

/* ----------------------- Card ----------------------- */

function ProductCard({ p }: { p: Product }) {
  const isPremade = p.kind === "premade";
  const disabled = !!p.soldOut;
  const ctaText = defaultCta(p);

  return (
    <article className="card overflow-hidden group">
      {/* Image + badges */}
      <figure className="relative">
        <img
          src={p.image}
          alt={p.title}
          className="w-full h-64 object-cover group-hover:scale-[1.02] transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="pill bg-white/90">
            {isPremade ? "Ready to Ship" : "Made to Order"}
          </span>
          {p.unique && <span className="pill bg-white/90">Unique • 1 of 1</span>}
          {p.soldOut && <span className="pill bg-white/90">Sold</span>}
          {p.badges?.map((b) => (
            <span key={b} className="pill bg-white/90">
              {b}
            </span>
          ))}
        </div>
      </figure>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-stone-900">{p.title}</h3>
          {/* Optional “trusted” tick */}
          {!p.soldOut && (
            <span className="inline-flex items-center gap-1 text-xs text-stone-500">
              <BadgeCheck className="h-4 w-4" /> Secure
            </span>
          )}
        </div>

        <p className="text-stone-700 mt-1">{p.priceLabel}</p>

        {/* Timing note */}
        {isPremade && p.shipNote && (
          <p className="text-xs text-stone-500 mt-1">{p.shipNote}</p>
        )}
        {!isPremade && p.leadTime && (
          <p className="text-xs text-stone-500 mt-1">{p.leadTime}</p>
        )}

        {p.description && (
          <p className="text-sm text-stone-600 mt-3">{p.description}</p>
        )}

        {/* Purchase controls */}
        <div className="mt-4">
          {p.variants?.length ? (
            <div className="grid grid-cols-2 gap-2">
              {p.variants.map((v) => {
                const label = v.buttonText || v.name;
                return (
                  <a
                    key={v.name}
                    href={disabled ? undefined : v.paymentLink}
                    target="_blank"
                    rel="noreferrer"
                    className={`btn btn-primary text-sm flex items-center justify-center ${
                      disabled ? "pointer-events-none opacity-60" : ""
                    }`}
                    aria-disabled={disabled}
                    aria-label={`${label} — ${p.title}`}
                  >
                    {label} <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                );
              })}
            </div>
          ) : p.paymentLink ? (
            <a
              href={disabled ? undefined : p.paymentLink}
              target="_blank"
              rel="noreferrer"
              className={`btn btn-primary w-full ${
                disabled ? "pointer-events-none opacity-60" : ""
              }`}
              aria-disabled={disabled}
              aria-label={`${ctaText} — ${p.title}`}
            >
              {ctaText} <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          ) : (
            <div className="text-sm text-stone-500">Coming soon</div>
          )}
        </div>
      </div>
    </article>
  );
}
