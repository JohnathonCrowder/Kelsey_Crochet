// src/components/homepage/Gallery.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { ShoppingBag, ZoomIn } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import Lightbox from "../Lightbox";

type Props = {
  shopUrl?: string; // optional external shop link
  title?: string;
  subtitle?: string;
  brand?: string;
};

// ---------- Image Discovery ----------
const imageModules = import.meta.glob(
  "/src/assets/crochet_project_*.{jpg,jpeg,png,webp}",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

const galleryImages: string[] = Object.keys(imageModules)
  .sort()
  .map((k) => imageModules[k]);

// ---------- Helpers ----------
function classNames(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "140px 0px", threshold: 0.05, ...options }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [options]);

  return { ref, inView };
}

function YarnIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="28" cy="28" r="20" stroke="currentColor" strokeWidth="2" />
      <path
        d="M14 24c7-6 21-6 28 0M12 30c8 6 24 6 32 0M18 38c6 4 14 4 20 0"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M46 42c6 2 9 6 12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShopCTA({ shopUrl }: { shopUrl?: string }) {
  const isExternal = !!shopUrl && /^https?:\/\//i.test(shopUrl);
  const baseClasses =
    "inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold shadow-sm ring-1 ring-black/5 " +
    "bg-rose-50 text-rose-800 hover:bg-rose-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400";

  if (isExternal) {
    return (
      <a className={baseClasses} href={shopUrl} target="_blank" rel="noreferrer">
        Visit Shop <ShoppingBag className="h-4 w-4" />
      </a>
    );
  }

  return (
    <Link to="/shop" className={baseClasses}>
      Visit Shop <ShoppingBag className="h-4 w-4" />
    </Link>
  );
}

function ProgressiveImage({ src, alt, onClick }: { src: string; alt: string; onClick?: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const [decoded, setDecoded] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();

  useEffect(() => {
    if (!inView) return;
    const img = new Image();
    img.src = src;
    img.decoding = "async" as any;
    img.onload = async () => {
      try {
        if (img.decode) await img.decode();
      } catch {}
      setDecoded(true);
      setLoaded(true);
    };
    img.onerror = () => setLoaded(true);
  }, [src, inView]);

  const knitSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M0 6c2-2 4-2 6 0s4 2 6 0' stroke='%23e6e2dc' stroke-width='1' fill='none'/></svg>`;
  const knitPattern = `url("data:image/svg+xml;utf8,${encodeURIComponent(knitSvg)}")`;

  return (
    <div
      ref={ref}
      className="relative inline-block w-full rounded-3xl overflow-hidden isolate"
      style={{
        backgroundImage: knitPattern,
        backgroundColor: "#f7f4ef",
        backgroundSize: "12px 12px",
        contain: "paint",
        willChange: "transform, opacity",
        transform: "translateZ(0)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[1.35rem]"
        style={{
          boxShadow:
            "inset 0 0 0 2px rgba(214,191,167,0.9), inset 0 0 0 6px rgba(255,255,255,0.65)",
        }}
      />

      <div
        className={classNames(
          "absolute inset-0 rounded-3xl",
          "bg-[rgba(247,244,239,0.95)]",
          "[background-image:var(--knit)]"
        )}
        style={{ ['--knit' as any]: knitPattern }}
        aria-hidden
      />

      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        draggable={false}
        sizes="(min-width:1536px)30vw,(min-width:1280px)33vw,(min-width:768px)48vw,(min-width:640px)90vw,100vw"
        className="block w-full h-auto select-none [image-rendering:auto]"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.01, filter: "blur(14px)" }}
        animate={
          decoded && inView
            ? {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                transition: {
                  opacity: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                  filter: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                },
              }
            : undefined
        }
        style={{ backgroundColor: "#f7f4ef" }}
      />

      <button
        type="button"
        onClick={onClick}
        aria-label={alt}
        className="absolute inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/0 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full backdrop-blur-sm px-3 py-1.5 bg-white/90 text-stone-900 shadow-md ring-1 ring-black/5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <ZoomIn className="h-4 w-4" />
          <span className="text-xs font-semibold">Zoom</span>
        </div>
      </button>
    </div>
  );
}

export default function Gallery({
  shopUrl,
  title = "Handmade Crochet Gallery",
  subtitle = "Cozy textures, soft palettes, and knot-by-knot craftsmanship — tap any photo to zoom.",
  brand = "Kelsey’s Crochet Corner",
}: Props) {
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const items = useMemo(() => galleryImages.map((url, i) => ({ url, i })), []);

  return (
    <section id="gallery" className="relative section">
      {/* Soft pastel backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(1200px_400px_at_0%_0%,rgba(245,234,220,0.9),transparent),radial-gradient(1200px_500px_at_100%_15%,rgba(220,236,245,0.7),transparent),radial-gradient(900px_380px_at_50%_100%,rgba(243,224,235,0.5),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-8 bg-[radial-gradient(circle_at_12px_-6px,_#fff_10px,transparent_11px)] [background-size:24px_16px] [mask-image:linear-gradient(to_bottom,_black,transparent_85%)] opacity-60" />
      </div>

      <div className="container-max">
        {/* Header */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-petal-900/80">
              <YarnIcon className="h-8 w-8" />
            </span>
            <div>
              <div className="text-[13px] font-semibold tracking-[0.12em] uppercase text-stone-500 flex items-center gap-2">
                <span className="inline-block h-[1px] w-6 bg-stone-300" />
                {brand}
                <span className="inline-block h-[1px] w-6 bg-stone-300" />
              </div>
              <h2 className="font-display text-4xl md:text-5xl tracking-tight text-petal-900 mt-2">
                {title}
              </h2>
              <p className="text-stone-600 mt-2 max-w-prose">{subtitle}</p>
            </div>
          </div>

          <ShopCTA shopUrl={shopUrl} />
        </div>

        {/* Masonry */}
        <div
          className={classNames(
            "columns-1 sm:columns-1 md:columns-2 xl:columns-3 gap-8",
            "[column-fill:_balance]"
          )}
        >
          {items.map(({ url, i }) => (
            <motion.figure
              key={url}
              className="group inline-block w-full mb-8 break-inside-avoid will-change-transform"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "140px 0px 140px 0px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, rotate: -0.25 }}
            >
              <ProgressiveImage
                src={url}
                alt={`Crochet project ${i + 1}`}
                onClick={() => {
                  setLbIndex(i);
                  setLbOpen(true);
                }}
              />
            </motion.figure>
          ))}
        </div>
      </div>

      {lbOpen && (
        <Lightbox
          images={galleryImages}
          startIndex={lbIndex}
          onClose={() => setLbOpen(false)}
        />
      )}
    </section>
  );
}
