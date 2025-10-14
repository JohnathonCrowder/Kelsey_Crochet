// src/pages/Product.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/homepage/Footer";
import { Blob } from "../components/Decor";
import { PRODUCTS as STATIC_PRODUCTS, Product } from "../data/products";
import {
  loadProductsFromCsv,
  availabilityForSchema,
  priceNumber,
  defaultCta,
  discoverFolderImages,
} from "../lib/products";
import { ExternalLink, ChevronLeft, BadgeCheck } from "lucide-react";

/* ----------------------- tiny helpers ----------------------- */
const DEBUG =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("debug") === "1";

/* ----------------------- data loading ----------------------- */

function useAllProducts(): Product[] {
  const [all, setAll] = useState<Product[]>(STATIC_PRODUCTS);

  useEffect(() => {
    const url = import.meta.env.VITE_PRODUCTS_CSV_URL as string | undefined;
    if (!url) return;
    (async () => {
      try {
        const live = await loadProductsFromCsv(url);
        if (live?.length) {
          setAll(live);
          if (DEBUG) console.log("[product] loaded live CSV:", live.length);
        }
      } catch (e) {
        console.warn("[product] CSV load failed, using static:", e);
      }
    })();
  }, []);

  return all;
}

function findByIdOrSlug(all: Product[], idOrSlug?: string) {
  if (!idOrSlug) return undefined;
  return all.find((p) => p.slug === idOrSlug) || all.find((p) => p.id === idOrSlug);
}

/* ----------------------- page ----------------------- */

export default function ProductPage() {
  const { id: idOrSlug } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const all = useAllProducts();

  const product = useMemo(() => findByIdOrSlug(all, idOrSlug), [all, idOrSlug]);

  // Gallery state: supports explicit images[] or folder discovery
  const [gallery, setGallery] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!product) return;

      // Prefer folder discovery if provided
      if (product.imagesFolder) {
        try {
          const found = await discoverFolderImages(product.imagesFolder);
          if (!cancelled) {
            setGallery(found.length ? found : [product.image]);
          }
        } catch {
          if (!cancelled) setGallery([product.image]);
        }
      } else if (product.images?.length) {
        setGallery(product.images);
      } else {
        setGallery([product.image]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product]);

  // Basic SEO
  useEffect(() => {
    if (!product) return;
    document.title = `${product.title} • Kelsey’s Crochet`;
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
      product.description ??
        (product.kind === "premade"
          ? "Ready to ship crochet item"
          : "Made to order crochet item")
    );
  }, [product]);

  if (!product) {
    return (
      <>
        <Header />
        <main className="relative min-h-[40vh]">
          <div className="container-max py-16">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-stone-700 hover:underline"
            >
              <ChevronLeft className="h-5 w-5" /> Back
            </button>
            <h1 className="mt-6 text-2xl font-semibold">Product not found</h1>
            <p className="mt-2 text-stone-600">
              The item you’re looking for may be unavailable.{" "}
              <Link to="/shop" className="underline">
                Browse the shop
              </Link>
              .
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!gallery) {
    return (
      <>
        <Header />
        <main className="relative min-h-[40vh]">
          <div className="container-max py-16">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-stone-700 hover:underline"
            >
              <ChevronLeft className="h-5 w-5" /> Back
            </button>
            <h1 className="mt-6 text-2xl font-semibold">Loading images…</h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const firstImage = gallery[0];

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: gallery,
    description:
      product.description ??
      (product.kind === "premade"
        ? "Ready to ship crochet item"
        : "Made to order crochet item"),
    brand: { "@type": "Brand", name: "Kelsey’s Crochet" },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: priceNumber(product.priceLabel),
      availability: availabilityForSchema(product),
      url:
        (!product.soldOut &&
          (product.paymentLink || product.variants?.[0]?.paymentLink)) ||
        undefined,
    },
  });

  const isPremade = product.kind === "premade";
  const disabled = !!product.soldOut;

  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-gradient-to-b from-petal-50/60 to-white">
        <Blob className="-z-10 top-[6rem] left-[-12rem] opacity-30" />
        <Blob className="-z-10 bottom-[-10rem] right-[-16rem] opacity-20" />

        <div className="container-max py-10 md:py-14">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-stone-700 hover:underline"
          >
            <ChevronLeft className="h-5 w-5" /> Back
          </button>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* -------- Gallery -------- */}
            <section aria-label="Product images" className="card overflow-hidden">
              <div className="aspect-[4/3] bg-white/60">
                <img
                  src={firstImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>

              {gallery.length > 1 && (
                <div className="p-4 grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {gallery.map((src, i) => (
                    <button
                      key={i}
                      className="relative aspect-square overflow-hidden rounded-lg ring-1 ring-stone-200 hover:ring-petal-300"
                      onClick={() => {
                        // Move clicked image to front
                        const reordered = [src, ...gallery.filter((_, j) => j !== i)];
                        setGallery(reordered);
                      }}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img
                        src={src}
                        alt={`${product.title} image ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* -------- Info / Buy -------- */}
            <section>
              <h1 className="font-display text-3xl md:text-4xl tracking-tight text-petal-900">
                {product.title}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xl font-semibold text-stone-900">
                  {product.priceLabel}
                </span>
                <span className="pill bg-emerald-50 text-emerald-900">
                  {isPremade ? "Ready to Ship" : "Made to Order"}
                </span>
                {product.unique && <span className="pill">Unique • 1 of 1</span>}
                {product.soldOut && <span className="pill">Sold</span>}
                {product.badges?.map((b) => (
                  <span key={b} className="pill">
                    {b}
                  </span>
                ))}
              </div>

              {isPremade && product.shipNote && (
                <p className="mt-3 text-sm text-stone-600">{product.shipNote}</p>
              )}
              {!isPremade && product.leadTime && (
                <p className="mt-3 text-sm text-stone-600">{product.leadTime}</p>
              )}

              {product.description && (
                <p className="mt-5 text-stone-700 leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="mt-6">
                {!product.soldOut ? (
                  product.variants?.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.variants.map((v) => {
                        const label = v.buttonText || v.name;
                        return (
                          <a
                            key={v.name}
                            href={v.paymentLink}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-primary inline-flex items-center justify-center"
                            aria-label={`${label} — ${product.title}`}
                          >
                            {label} <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        );
                      })}
                    </div>
                  ) : product.paymentLink ? (
                    <a
                      href={product.paymentLink}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary inline-flex items-center justify-center"
                      aria-label={`${defaultCta(product)} — ${product.title}`}
                    >
                      {defaultCta(product)} <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  ) : (
                    <div className="text-sm text-stone-500">
                      Checkout link coming soon.
                    </div>
                  )
                ) : (
                  <div className="text-stone-500">This item has been sold.</div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-stone-500">
                {!product.soldOut && <BadgeCheck className="h-4 w-4" />} Secure checkout with Stripe
              </div>

              <div className="mt-8 text-sm text-stone-600">
                Prefer local pickup in Springfield, MO? Leave a note at checkout and we’ll coordinate a time.
              </div>

              <div className="mt-10">
                <Link to="/shop" className="underline">
                  ← Back to Shop
                </Link>
              </div>
            </section>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      </main>
      <Footer />
    </>
  );
}
