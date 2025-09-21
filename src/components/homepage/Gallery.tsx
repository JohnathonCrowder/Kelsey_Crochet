// src/components/homepage/Gallery.tsx
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import Lightbox from "../Lightbox";

type Props = {
  /** Optional external shop/linktree URL shown in the header */
  shopUrl?: string;
};

// Auto-import local gallery images (Vite 5+ syntax)
const imageModules = import.meta.glob(
  "/src/assets/crochet_project_*.{jpg,jpeg,png,webp}",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

const galleryImages: string[] = Object.keys(imageModules)
  .sort() // keeps 1..2..3 order if filenames are numbered
  .map((k) => imageModules[k]);

export default function Gallery({ shopUrl = "https://your-shop-url.com" }: Props) {
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  return (
    <section id="gallery" className="section bg-white/60">
      <div className="container-max">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight text-petal-900">
              Selected Pieces
            </h2>
            <p className="text-stone-600 mt-2">
              Replace with your photos—frames and hover effects stay.
            </p>
          </div>

          {shopUrl && (
            <a
              className="hidden md:inline-flex items-center text-sm font-medium nav-link"
              href={shopUrl}
              target="_blank"
              rel="noreferrer"
            >
              Visit Shop <ShoppingBag className="ml-2 h-4 w-4" />
            </a>
          )}
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-12 gap-6">
          {galleryImages.map((url, i) => {
            // editorial-style spans to keep the layout varied
            const spans = ["md:col-span-7", "md:col-span-5", "md:col-span-4", "md:col-span-4", "md:col-span-4"];
            const span = spans[i % spans.length];

            return (
              <figure key={url} className={`frame group ${span}`}>
                <button
                  type="button"
                  className="w-full h-[260px] md:h-[320px] block"
                  onClick={() => {
                    setLbIndex(i);
                    setLbOpen(true);
                  }}
                  aria-label={`Open image ${i + 1}`}
                >
                  <img
                    src={url}
                    alt={`Crochet project ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    draggable={false}
                  />
                </button>
              </figure>
            );
          })}
        </div>

        {shopUrl && (
          <a
            className="mt-8 inline-flex md:hidden items-center text-sm font-medium nav-link"
            href={shopUrl}
            target="_blank"
            rel="noreferrer"
          >
            Visit Shop <ShoppingBag className="ml-2 h-4 w-4" />
          </a>
        )}
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
