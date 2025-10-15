// src/pages/Product.tsx
import { useEffect, useMemo, useRef, useState } from "react";
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

/* ----------------------- Lazy image component ----------------------- */
function LazyImg(props: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  fetchpriority?: "high" | "low" | "auto"; // NOTE: lowercase attribute name
  eager?: boolean; // true for hero
  width?: number;
  height?: number;
}) {
  const {
    src,
    alt,
    className,
    sizes,
    fetchpriority = "auto",
    eager = false,
    width,
    height,
  } = props;
  const ref = useRef<HTMLImageElement | null>(null);
  const [inView, setInView] = useState(eager);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (eager || inView) return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager, inView]);

  return (
    <img
      ref={ref}
      src={inView ? src : undefined}
      alt={alt}
      width={width}
      height={height}
      className={
        "transition-[filter,opacity] duration-300 ease-out " +
        (loaded ? "opacity-100 filter-none " : "opacity-80 blur-[2px] ") +
        (className ?? "")
      }
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      {...(fetchpriority ? ({ fetchpriority } as any) : {})}
      sizes={sizes}
      onLoad={() => setLoaded(true)}
    />
  );
}

/* ----------------------- Related picker ----------------------- */
function pickRelated(all: Product[], current: Product, limit = 6): Product[] {
  const pool = all.filter((p) => p.active && p.id !== current.id);
  const curBadges = new Set((current.badges ?? []).map((b) => b.toLowerCase()));
  const scored = pool
    .map((p) => {
      let score = 0;
      if (p.kind === current.kind) score += 2;
      if (p.unique) score += 1;
      const overlap = (p.badges ?? []).reduce(
        (acc, b) => (curBadges.has((b || "").toLowerCase()) ? acc + 1 : acc),
        0
      );
      score += Math.min(2, overlap);
      return { p, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.p);
}

/* ----------------------- Preload hero ----------------------- */
function PreloadImage({ href }: { href?: string }) {
  useEffect(() => {
    if (!href) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = href;
    document.head.appendChild(link);
    return () => {
      if (link.parentNode) document.head.removeChild(link);
    };
  }, [href]);
  return null;
}

/* ----------------------- data loading ----------------------- */
function useAllProducts(): { all: Product[]; loading: boolean } {
  const [all, setAll] = useState<Product[]>(STATIC_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const url = import.meta.env.VITE_PRODUCTS_CSV_URL as string | undefined;
    if (!url) return; // no live CSV; just use static
    setLoading(true);
    (async () => {
      try {
        const live = await loadProductsFromCsv(url);
        if (live?.length) {
          setAll(live);
          if (DEBUG) console.log("[product] loaded live CSV:", live.length);
        }
      } catch (e) {
        console.warn("[product] CSV load failed, using static:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { all, loading };
}

function findByIdOrSlug(all: Product[], idOrSlug?: string) {
  if (!idOrSlug) return undefined;
  return all.find((p) => p.slug === idOrSlug) || all.find((p) => p.id === idOrSlug);
}

/* ----------------------- page ----------------------- */
export default function ProductPage() {
  const { id: idOrSlug } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { all, loading: loadingProducts } = useAllProducts();

  // product & gallery state
  const product = useMemo(() => findByIdOrSlug(all, idOrSlug), [all, idOrSlug]);
  const [gallery, setGallery] = useState<string[] | null>(null);
  const [selected, setSelected] = useState(0);

  // keep hook order stable: define hooks BEFORE any early return
  const hero = useMemo(
    () => (gallery && gallery.length ? gallery[selected] ?? gallery[0] : undefined),
    [gallery, selected]
  );
  const related = useMemo(
    () => (product ? pickRelated(all, product, 6) : []),
    [all, product]
  );
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // reset selected when gallery changes
  useEffect(() => {
    setSelected(0);
  }, [gallery?.join("|")]);

  // load gallery (manifest folder or explicit images)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!product) {
        setGallery(null);
        return;
      }
      try {
        if (product.imagesFolder) {
          const found = await discoverFolderImages(product.imagesFolder);
          if (!cancelled) setGallery(found.length ? found : [product.image]);
        } else if (product.images?.length) {
          if (!cancelled) setGallery(product.images);
        } else {
          if (!cancelled) setGallery([product.image]);
        }
      } catch {
        if (!cancelled) setGallery([product.image]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product]);

  // SEO + canonical + preconnect
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

    const url = window.location.origin + window.location.pathname;
    const canon =
      (document.querySelector("link[rel='canonical']") as HTMLLinkElement) ||
      document.createElement("link");
    canon.rel = "canonical";
    canon.href = url;
    if (!canon.parentNode) document.head.appendChild(canon);

    const pre = document.createElement("link");
    pre.rel = "preconnect";
    pre.href = "https://buy.stripe.com";
    document.head.appendChild(pre);
    return () => {
      if (pre.parentNode) document.head.removeChild(pre);
    };
  }, [product]);

  // keyboard navigation for thumbs
  function onThumbKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!gallery?.length) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((i) => (i + 1) % gallery.length);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((i) => (i - 1 + gallery.length) % gallery.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setSelected(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setSelected(gallery.length - 1);
    }
  }

  const openLightbox = () => dialogRef.current?.showModal();
  const closeLightbox = () => dialogRef.current?.close();

  /* -------- RENDER -------- */

  // skeleton while products are loading
  if (loadingProducts) {
    return (
      <>
        <Header />
        <main className="relative overflow-hidden bg-gradient-to-b from-petal-50/60 to-white">
          <Blob className="-z-10 top-[6rem] left-[-12rem] opacity-30" />
          <Blob className="-z-10 bottom-[-10rem] right-[-16rem] opacity-20" />
          <div className="container-max py-10 md:py-14 animate-pulse">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-stone-700"
            >
              <ChevronLeft className="h-5 w-5" /> Back
            </button>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card overflow-hidden">
                <div className="aspect-[4/3] bg-stone-200/70" />
                <div className="p-4 grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-lg bg-stone-200/70" />
                  ))}
                </div>
              </div>
              <div>
                <div className="h-8 w-2/3 bg-stone-200/70 rounded" />
                <div className="mt-4 h-6 w-32 bg-stone-200/70 rounded" />
                <div className="mt-6 h-24 w-full bg-stone-200/70 rounded" />
                <div className="mt-6 h-10 w-48 bg-stone-200/70 rounded" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // only show not-found AFTER loading is done
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

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    url: window.location.origin + window.location.pathname,
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
              <PreloadImage href={hero} />
              <button onClick={() => dialogRef.current?.showModal()} className="block w-full">
                <div className="aspect-[4/3] bg-white/60">
                  <LazyImg
                    src={hero}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    eager
                    fetchpriority="high"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    width={1600}
                    height={1200}
                  />
                </div>
              </button>

              {gallery.length > 1 && (
                <div
                  className="p-4 grid grid-cols-4 sm:grid-cols-6 gap-3"
                  role="listbox"
                  aria-label="Product thumbnails"
                  tabIndex={0}
                  onKeyDown={onThumbKeyDown}
                >
                  {gallery.map((src, i) => {
                    const isActive = i === selected;
                    return (
                      <button
                        key={i}
                        role="option"
                        aria-selected={isActive}
                        className={`relative aspect-square overflow-hidden rounded-lg ring-1 transition
                          ${
                            isActive
                              ? "ring-petal-400"
                              : "ring-stone-200 hover:ring-petal-300"
                          }`}
                        onClick={() => setSelected(i)}
                      >
                        <LazyImg
                          src={src}
                          alt={`${product.title} image ${i + 1}`}
                          className="w-full h-full object-cover"
                          sizes="(max-width: 640px) 22vw, (max-width: 1024px) 12vw, 120px"
                          fetchpriority="low"
                          width={400}
                          height={400}
                        />
                        <span className="sr-only">
                          {isActive ? "Selected" : "Select"}
                        </span>
                      </button>
                    );
                  })}
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

          {/* -------- Lightbox -------- */}
          <dialog
            ref={dialogRef}
            className="backdrop:bg-black/70 p-0 rounded-lg max-w=[min(95vw,1200px)]"
          >
            <div className="relative">
              <button
                onClick={() => dialogRef.current?.close()}
                className="absolute top-2 right-2 z-10 rounded-full bg-white/90 px-3 py-1 text-sm shadow"
              >
                Close
              </button>
              <img
                src={hero}
                alt={product.title}
                className="max-h-[85vh] w-auto object-contain block"
                loading="eager"
                decoding="async"
              />
            </div>
          </dialog>

          {/* -------- Related products -------- */}
          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="font-display text-2xl md:text-3xl tracking-tight text-petal-900">
                You might also like
              </h2>
              <p className="text-stone-600 text-sm mt-1">
                More handmade pieces crafted with love.
              </p>

              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => {
                  const href = `/product/${p.slug || p.id}`;
                  const isPremadeRel = p.kind === "premade";
                  const disabled = !!p.soldOut;
                  const ctaText = defaultCta(p);
                  const primaryLink =
                    !p.soldOut && (p.paymentLink || p.variants?.[0]?.paymentLink);

                  return (
                    <article key={p.id} className="card overflow-hidden group">
                      <Link to={href} aria-label={p.title}>
                        <figure className="relative">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-56 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                            <span className="pill bg-white/90">
                              {isPremadeRel ? "Ready to Ship" : "Made to Order"}
                            </span>
                            {p.unique && (
                              <span className="pill bg-white/90">Unique • 1 of 1</span>
                            )}
                            {p.soldOut && <span className="pill bg-white/90">Sold</span>}
                            {p.badges?.map((b) => (
                              <span key={b} className="pill bg-white/90">
                                {b}
                              </span>
                            ))}
                          </div>
                        </figure>
                      </Link>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <Link to={href} className="font-semibold text-stone-900 line-clamp-1">
                            {p.title}
                          </Link>
                          {!p.soldOut && (
                            <span className="inline-flex items-center gap-1 text-xs text-stone-500">
                              <BadgeCheck className="h-4 w-4" /> Secure
                            </span>
                          )}
                        </div>

                        <p className="text-stone-700 mt-1">{p.priceLabel}</p>

                        {isPremadeRel && p.shipNote && (
                          <p className="text-xs text-stone-500 mt-1">{p.shipNote}</p>
                        )}
                        {!isPremadeRel && p.leadTime && (
                          <p className="text-xs text-stone-500 mt-1">{p.leadTime}</p>
                        )}

                        <div className="mt-4">
                          {p.variants?.length ? (
                            <div className="grid grid-cols-2 gap-2">
                              {p.variants.slice(0, 2).map((v) => {
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
                          ) : primaryLink ? (
                            <a
                              href={disabled ? undefined : primaryLink}
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
                })}
              </div>
            </section>
          )}
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
