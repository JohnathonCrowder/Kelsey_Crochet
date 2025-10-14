// src/pages/Shop.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/homepage/Footer";
import { Blob } from "../components/Decor";
import { PRODUCTS as STATIC_PRODUCTS, Product } from "../data/products";
import {
  Sparkles,
  ShoppingBag,
  Shield,
  Truck,
  ExternalLink,
  BadgeCheck,
  MapPin,
} from "lucide-react";
import {
  loadProductsFromCsv,
  availabilityForSchema,
  priceNumber,
  defaultCta,
} from "../lib/products";

/* ----------------------- tiny helpers ----------------------- */
const DEBUG =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("debug") === "1";

/* ----------------------- filters ----------------------- */

function byKind(kind: Product["kind"]) {
  return (p: Product) => p.active && p.kind === kind;
}

/* ----------------------- Page ----------------------- */

export default function Shop() {
  const [allProducts, setAllProducts] = useState<Product[]>(STATIC_PRODUCTS);

  useEffect(() => {
    const url = import.meta.env.VITE_PRODUCTS_CSV_URL as string | undefined;
    if (!url) return;
    if (DEBUG) console.log("[products] env URL =", url);

    (async () => {
      try {
        const live = await loadProductsFromCsv(url);
        if (live && live.length) {
          setAllProducts(live);
          if (DEBUG) console.log("[products] using LIVE CSV products:", live.length);
        } else {
          console.warn(
            "[products] CSV parsed but produced 0 items — keeping fallback (STATIC_PRODUCTS)."
          );
        }
      } catch (e) {
        console.warn("[products] CSV load failed, using fallback:", e);
      }
    })();
  }, []);

  // Basic SEO
  useEffect(() => {
    document.title = "Shop • Kelsey’s Crochet";
    const ensureMeta = (name: string, content: string) => {
      const el = document.querySelector(`meta[name='${name}']`);
      if (!el) {
        const m = document.createElement("meta");
        m.setAttribute("name", name);
        m.setAttribute("content", content);
        document.head.appendChild(m);
      } else {
        el.setAttribute("content", content);
      }
    };
    ensureMeta(
      "description",
      "Handmade crochet — ready to ship & made to order — secure Stripe checkout."
    );
  }, []);

  const premade = useMemo(() => allProducts.filter(byKind("premade")), [allProducts]);
  const preorder = useMemo(() => allProducts.filter(byKind("preorder")), [allProducts]);

  const productJsonLd = useMemo(() => {
    const all = [...premade, ...preorder];
    const items = all.map((p) => ({
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.title,
      image: [p.image],
      description:
        p.description ||
        (p.kind === "premade"
          ? "Ready to ship crochet item"
          : "Made to order crochet item"),
      brand: { "@type": "Brand", name: "Kelsey’s Crochet" },
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: priceNumber(p.priceLabel),
        availability: availabilityForSchema(p),
        url:
          (!p.soldOut && (p.paymentLink || p.variants?.[0]?.paymentLink)) ||
          undefined,
      },
    }));
    return JSON.stringify(items);
  }, [premade, preorder]);

  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-gradient-to-b from-petal-50/60 to-white">
        <Blob className="-z-10 top-[6rem] left-[-12rem] opacity-30" />
        <Blob className="-z-10 bottom-[-10rem] right-[-16rem] opacity-20" />

        <div className="container-max py-16 md:py-20">
          <header className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/90 shadow-sm text-petal-900 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-petal-700" />
                Handmade • One-of-a-Kind • Made with Love
              </div>

              <h1 className="mt-5 font-display text-4xl md:text-5xl tracking-tight text-petal-900">
                Kelsey’s Crochet Shop
              </h1>

              <p className="mt-4 text-stone-700 text-base md:text-lg leading-relaxed max-w-2xl mx-auto text-center">
                Explore cozy, handmade creations — from ready-to-ship treasures
                to custom made-to-order designs. Checkout is fast, secure, and
                powered by Stripe.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FeaturedCarousel allProducts={allProducts} />
              </div>

              <div className="space-y-4">
                <div className="card bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 shadow-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-amber-700 mt-0.5" />
                    <div>
                      <p className="text-amber-900 font-semibold">
                        Free Local Pickup — Springfield, MO
                      </p>
                      <p className="text-amber-900/90 text-sm">
                        Skip shipping fees by choosing{" "}
                        <span className="font-semibold">Local Pickup</span> at
                        checkout (when available) or leave a note with your
                        order — we’ll coordinate a pickup time with you.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="card p-4 flex items-center gap-2 bg-white/90 shadow-sm">
                    <ShoppingBag className="h-4 w-4 text-petal-700" /> Apple Pay
                    & Google Pay supported
                  </div>
                  <div className="card p-4 flex items-center gap-2 bg-white/90 shadow-sm">
                    <Truck className="h-4 w-4 text-petal-700" /> Clear shipping
                    times & updates
                  </div>
                  <div className="card p-4 flex items-center gap-2 bg-white/90 shadow-sm sm:col-span-2">
                    <Shield className="h-4 w-4 text-petal-700" /> Secure
                    checkout with Stripe
                  </div>
                </div>
              </div>
            </div>
          </header>

          {premade.length > 0 && (
            <section className="mt-16">
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

          {preorder.length > 0 && (
            <section className="mt-16">
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

          <p className="text-center text-sm text-stone-600 mt-10">
            Want something special?{" "}
            <a href="/#contact" className="underline">
              Contact Kelsey
            </a>{" "}
            for a custom commission.
          </p>
        </div>

        <script
          type="application/ld+json"
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
  const detailHref = `/product/${encodeURIComponent(p.slug || p.id)}`;

  return (
    <article className="card overflow-hidden group">
      <figure className="relative">
        <Link to={detailHref} aria-label={`View ${p.title}`}>
          <img
            src={p.image}
            alt={p.title}
            className="w-full h-80 object-cover group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
        </Link>

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

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-stone-900">
            <Link to={detailHref} className="hover:underline">
              {p.title}
            </Link>
          </h3>
          {!p.soldOut && (
            <span className="inline-flex items-center gap-1 text-xs text-stone-500">
              <BadgeCheck className="h-4 w-4" /> Secure
            </span>
          )}
        </div>

        <p className="text-stone-700 mt-1">{p.priceLabel}</p>

        {isPremade && p.shipNote && (
          <p className="text-xs text-stone-500 mt-1">{p.shipNote}</p>
        )}
        {!isPremade && p.leadTime && (
          <p className="text-xs text-stone-500 mt-1">{p.leadTime}</p>
        )}

        {p.description && (
          <p className="text-sm text-stone-600 mt-3 line-clamp-3">{p.description}</p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          {/* View details */}
          <Link
            to={detailHref}
            className="btn w-full"
            aria-label={`View details — ${p.title}`}
          >
            Details
          </Link>

          {/* Primary Stripe CTA (or disabled if sold) */}
          {p.variants?.length ? (
            <a
              href={disabled ? undefined : p.variants[0]?.paymentLink}
              target="_blank"
              rel="noreferrer"
              className={`btn btn-primary w-full ${
                disabled ? "pointer-events-none opacity-60" : ""
              }`}
              aria-disabled={disabled}
              aria-label={`${p.variants[0]?.buttonText || p.variants[0]?.name} — ${p.title}`}
            >
              {p.variants[0]?.buttonText || p.variants[0]?.name}{" "}
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
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
            <div className="text-sm text-stone-500 flex items-center justify-center">
              Soon
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

/* ----------------------- Featured Carousel ----------------------- */

function useFeaturedProducts(all: Product[]) {
  const sorted = [...all].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "premade" ? -1 : 1;
    if (!!a.unique !== !!b.unique) return a.unique ? -1 : 1;
    return 0;
  });
  return sorted.slice(0, 6);
}

function FeaturedCarousel({ allProducts }: { allProducts: Product[] }) {
  const allActive = useMemo(() => allProducts.filter((p) => p.active), [allProducts]);
  const featured = useFeaturedProducts(allActive);

  const slides = featured.map((p) => ({
    id: p.id,
    title: p.title,
    subtitle:
      p.kind === "premade" ? "Ready to Ship" : p.leadTime ?? "Made to Order",
    price: p.priceLabel,
    image: p.image,
    href: !p.soldOut ? p.paymentLink ?? p.variants?.[0]?.paymentLink : undefined,
    cta: p.kind === "premade" ? p.buttonText ?? "Buy Now" : p.buttonText ?? "Preorder",
    soldOut: !!p.soldOut,
  }));

  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (slides.length <= 1) return;
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [slides.length]);

  const onMouseEnter = () => {
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };
  const onMouseLeave = () => {
    if (slides.length <= 1) return;
    if (!timer.current) {
      timer.current = window.setInterval(() => {
        setIndex((i) => (i + 1) % slides.length);
      }, 4000);
    }
  };

  if (slides.length === 0) {
    return (
      <div className="card overflow-hidden">
        <div className="aspect-[16/9] bg-white/60 flex items-center justify-center text-stone-500">
          No featured items yet.
        </div>
      </div>
    );
  }

  const go = (i: number) => setIndex((i + slides.length) % slides.length);
  const s = slides[index];

  return (
    <div
      className="relative card overflow-hidden group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured crochet items"
    >
      <div className="relative aspect-[16/9]">
        {s.href && !s.soldOut ? (
          <a href={s.href} target="_blank" rel="noreferrer" aria-label={`${s.cta} — ${s.title}`}>
            <img src={s.image} alt={s.title} className="w-full h-full object-cover" loading="eager" />
          </a>
        ) : (
          <img src={s.image} alt={s.title} className="w-full h-full object-cover" loading="eager" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute left-4 right-4 bottom-4 text-white">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="pill bg-white/90 text-stone-900">{s.subtitle}</span>
                {s.soldOut && <span className="pill bg-white/90 text-stone-900">Sold</span>}
              </div>
              <h3 className="mt-2 text-lg md:text-2xl font-semibold leading-tight line-clamp-1" aria-live="polite">
                {s.title}
              </h3>
              <p className="text-sm md:text-base opacity-90">{s.price}</p>
            </div>

            <div className="ml-auto">
              {s.href && !s.soldOut ? (
                <a href={s.href} target="_blank" rel="noreferrer" className="btn btn-primary inline-flex items-center">
                  {s.cta} <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              ) : (
                <span className="btn inline-flex items-center pointer-events-none opacity-70">
                  {s.soldOut ? "Sold" : "Coming Soon"}
                </span>
              )}
            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 -translate-y-1/2 hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
              onClick={() => go(index - 1)}
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
              onClick={() => go(index + 1)}
              aria-label="Next"
            >
              ›
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="absolute left-0 right-0 bottom-2 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`h-2.5 w-2.5 rounded-full transition ${i === index ? "bg-white" : "bg-white/50 hover:bg-white/80"}`}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1} of ${slides.length}`}
              aria-current={i === index ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
