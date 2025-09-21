import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  startIndex: number;
  onClose: () => void;
};

export default function Lightbox({ images, startIndex, onClose }: Props) {
  const [i, setI] = useState(startIndex);

  // lock scroll + keyboard controls
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((v) => (v + 1) % images.length);
      if (e.key === "ArrowLeft") setI((v) => (v - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [images.length, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/75 backdrop-blur flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Controls */}
      <button
        aria-label="Close"
        className="absolute top-4 right-4 rounded-full bg-white/90 p-2 hover:bg-white shadow"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >
        <X />
      </button>

      <button
        aria-label="Previous image"
        className="absolute left-3 md:left-6 rounded-full bg-white/80 p-2 hover:bg-white shadow"
        onClick={(e) => { e.stopPropagation(); setI((v) => (v - 1 + images.length) % images.length); }}
      >
        <ChevronLeft />
      </button>

      <button
        aria-label="Next image"
        className="absolute right-3 md:right-6 rounded-full bg-white/80 p-2 hover:bg-white shadow"
        onClick={(e) => { e.stopPropagation(); setI((v) => (v + 1) % images.length); }}
      >
        <ChevronRight />
      </button>

      {/* Image */}
      <div
        className="max-w-[95vw] max-h-[85vh] rounded-2xl overflow-hidden shadow-lg bg-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[i]}
          alt={`Gallery image ${i + 1}`}
          className="block max-h-[85vh] max-w-[95vw] object-contain"
          draggable={false}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/90 text-sm">
        {i + 1} / {images.length}
      </div>
    </div>
  );
}
