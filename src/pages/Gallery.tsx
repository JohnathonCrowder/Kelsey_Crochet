import { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/homepage/Footer";
import { Blob } from "../components/Decor";
import Lightbox from "../components/Lightbox";
import { Sparkles, Image as ImageIcon } from "lucide-react";

/* ───────────── Load gallery images ───────────── */
const modules = import.meta.glob(
  "/src/assets/crochet_project_*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" }
) as Record<string, string>;

type Item = {
  url: string;
  title: string;
};

export default function GalleryPage() {
  const allItems: Item[] = useMemo(() => {
    return Object.keys(modules)
      .sort()
      .map((path) => {
        const url = modules[path];
        const base = path.split("/").pop() ?? "crochet";
        const title = base.replace(/\.[a-z]+$/i, "").replace(/[_-]/g, " ").trim();
        return { url, title };
      });
  }, []);

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const images = allItems.map((i) => i.url);

  // ✅ SEO metadata for gallery
  const jsonLd = useMemo(() => {
    const items = allItems.slice(0, 50).map((i, idx) => ({
      "@type": "ImageObject",
      name: i.title,
      contentUrl: i.url,
      position: idx + 1,
    }));
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Kelsey’s Crochet — Gallery",
      hasPart: items,
    };
  }, [allItems]);

  return (
    <>
      <Header />

      <main className="relative overflow-hidden bg-gradient-to-b from-petal-50/70 to-white">
        <Blob className="-z-10 top-[6rem] left-[-12rem] opacity-30" />
        <Blob className="-z-10 bottom-[-10rem] right-[-16rem] opacity-20" />

        <div className="container-max py-16 md:py-20">
          {/* Hero Section */}
          <header className="text-center max-w-3xl mx-auto">
            <span className="pill bg-white/80">
              <Sparkles className="h-3.5 w-3.5" />
              crochet • handmade • gallery
            </span>
            <h1 className="mt-4 font-display text-4xl md:text-5xl tracking-tight text-petal-900">
              Crochet Creations Gallery
            </h1>
            <p className="mt-4 text-lg text-stone-700">
              A cozy collection of handmade plushies, blankets, and wearables.
              Tap a photo to see every stitch up close 💕
            </p>
          </header>

          {/* Gallery Grid */}
          <section className="mt-12" aria-live="polite">
            {allItems.length === 0 ? (
              <div className="card p-8 text-center">
                <ImageIcon className="h-8 w-8 mx-auto text-stone-400" />
                <p className="mt-3 text-stone-600">
                  No photos yet — check back soon for new crochet creations!
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-12 gap-6">
                {allItems.map((it, i) => {
                  const spans = [
                    "md:col-span-7",
                    "md:col-span-5",
                    "md:col-span-4",
                    "md:col-span-4",
                    "md:col-span-4",
                  ];
                  const span = spans[i % spans.length];

                  return (
                    <figure key={it.url} className={`frame group ${span}`}>
                      <button
                        type="button"
                        className="relative w-full h-[260px] md:h-[320px] block"
                        onClick={() => {
                          setIndex(i);
                          setOpen(true);
                        }}
                        aria-label={`View ${it.title}`}
                      >
                        <img
                          src={it.url}
                          alt={it.title}
                          className="w-full h-full object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
                          loading="lazy"
                        />
                        <figcaption className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <span className="m-3 text-white/95 text-sm font-medium backdrop-blur-[2px] px-2 py-1 rounded-lg bg-black/20">
                            {it.title}
                          </span>
                        </figcaption>
                      </button>
                    </figure>
                  );
                })}
              </div>
            )}
          </section>

          {/* CTA */}
          <div className="mt-12 text-center">
            <a href="/#contact" className="btn btn-primary shadow-glow">
              Start a Custom Order
            </a>
          </div>
        </div>

        {/* Lightbox */}
        {open && (
          <Lightbox
            images={images}
            startIndex={index}
            onClose={() => setOpen(false)}
          />
        )}

        {/* SEO JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </main>

      <Footer />
    </>
  );
}
