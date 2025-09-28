// src/pages/Gallery.tsx
import { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/homepage/Footer";
import { Blob } from "../components/Decor";
import Lightbox from "../components/Lightbox";
import { Sparkles, Filter } from "lucide-react";


// Load local images that follow your naming like: src/assets/crochet_project_1.jpg
// NOTE: using the new Vite syntax: { import: 'default' } so each module is a URL string.
const modules = import.meta.glob(
  "/src/assets/crochet_project_*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" }
) as Record<string, string>;

type Item = {
  url: string;
  title: string;
  tags: ("plushie" | "throw" | "wearable" | "accessory")[];
};

// Quick tag inference from filename (very lightweight)
function inferTags(path: string): Item["tags"] {
  const lower = path.toLowerCase();
  const tags: Item["tags"] = [];
  if (lower.includes("plush") || lower.includes("bunny") || lower.includes("bear")) tags.push("plushie");
  if (lower.includes("blanket") || lower.includes("throw")) tags.push("throw");
  if (lower.includes("beanie") || lower.includes("hat") || lower.includes("cardigan") || lower.includes("sweater")) tags.push("wearable");
  if (lower.includes("flower") || lower.includes("coaster") || lower.includes("granny")) tags.push("accessory");
  if (tags.length === 0) tags.push("accessory");
  return tags;
}

export default function GalleryPage() {
  const allItems: Item[] = useMemo(() => {
    // Keep natural order by path; if you number files, it's already sorted
    return Object.keys(modules)
      .sort()
      .map((k) => {
        const url = modules[k];
        const base = k.split("/").pop() ?? "crochet";
        const title = base.replace(/\.[a-z]+$/i, "").replace(/[_-]/g, " ");
        return { url, title, tags: inferTags(base) };
      });
  }, []);

  const TAGS = ["all", "plushie", "throw", "wearable", "accessory"] as const;
  type Tag = (typeof TAGS)[number];

  const [tag, setTag] = useState<Tag>("all");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const filtered = tag === "all" ? allItems : allItems.filter((i) => i.tags.includes(tag as any));
  const images = filtered.map((i) => i.url);

  return (
    <>
      <Header />

      <main className="relative overflow-hidden bg-gradient-to-b from-petal-50/70 to-white">
        <Blob className="-z-10 top-[6rem] left-[-12rem] opacity-30" />
        <Blob className="-z-10 bottom-[-10rem] right-[-16rem] opacity-20" />

        <div className="container-max py-16 md:py-20">
          {/* Hero */}
          <header className="text-center max-w-3xl mx-auto">
            <span className="pill bg-white/80">
              <Sparkles className="h-3.5 w-3.5" />
              crochet • gallery • handmade
            </span>
            <h1 className="mt-4 font-display text-4xl md:text-5xl tracking-tight text-petal-900">
              Selected Pieces
            </h1>
            <p className="mt-3 text-stone-700">
              A peek at custom plushies, throws, and wearables. Replace with your photos—frames and hover effects stay.
            </p>

            {/* Filters */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="pill bg-white/70 text-stone-600 mr-1">
                <Filter className="h-3.5 w-3.5" /> Filter
              </span>
              {TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all
                    ${tag === t
                      ? "bg-gradient-to-r from-petal-100 to-sage-100 border-white/70 shadow-soft text-stone-900"
                      : "bg-white/70 border-white/60 hover:shadow-glow text-stone-700"}`}
                >
                  {t === "all" ? "All" : t[0].toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </header>

          {/* Grid */}
          <section className="mt-10">
            {filtered.length === 0 ? (
              <p className="text-center text-stone-600">No items yet for this filter.</p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-12 gap-6">
                {filtered.map((it, i) => {
                  const spans = ["md:col-span-7", "md:col-span-5", "md:col-span-4", "md:col-span-4", "md:col-span-4"];
                  const span = spans[i % spans.length];
                  return (
                    <figure key={it.url} className={`frame group ${span}`}>
                      <button
                        type="button"
                        className="w-full h-[260px] md:h-[320px] block"
                        onClick={() => {
                          // Compute the absolute index in the full filtered set for the lightbox
                          setIndex(i);
                          setOpen(true);
                        }}
                        aria-label={`Open ${it.title}`}
                      >
                        <img
                          src={it.url}
                          alt={it.title}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          loading="lazy"
                        />
                      </button>
                    </figure>
                  );
                })}
              </div>
            )}
          </section>

          <div className="mt-12 text-center">
            <a href="/#contact" className="btn btn-primary shadow-glow">Start a Custom Order</a>
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
      </main>

      <Footer />
    </>
  );
}
