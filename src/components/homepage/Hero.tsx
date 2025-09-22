import { ChevronRight, Sparkles } from "lucide-react";
import { Blob, WaveDivider } from "../Decor";

export default function Hero() {
  return (
    <section id="home" className="section relative">
      {/* background blobs for depth */}
      <Blob className="-z-10 top-[-6rem] left-[-6rem]" />
      <Blob className="-z-10 top-[40rem] right-[-10rem] rotate-12" />

      <div className="container-max grid md:grid-cols-2 gap-12 items-center">
        {/* Text Column */}
        <div>
          <span className="pill">
            <Sparkles className="h-3.5 w-3.5" />
            handcrafted • pastel • cozy
          </span>

          <h1 className="mt-4 font-display text-5xl md:text-6xl leading-[1.05] tracking-tight text-petal-900">
            Soft Crochet,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-petal-700 to-sage-600">
              Made for You
            </span>
          </h1>

          <p className="mt-5 text-lg text-stone-600 max-w-prose">
            Bespoke beanies, throws, plushies, and keepsakes—designed around your
            colors, textures, and story. Bring your idea; I’ll crochet the rest.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="btn btn-primary shadow-glow">
              Start a Custom Order <ChevronRight className="ml-1 h-4 w-4" />
            </a>
            <a href="#gallery" className="btn btn-outline">
              See Gallery
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-6 text-sm">
            <div className="card p-5">
              <dt className="font-medium text-stone-800">Turnaround</dt>
              <dd className="text-stone-600">Small items in ~3–5 days</dd>
            </div>
            <div className="card p-5">
              <dt className="font-medium text-stone-800">Materials</dt>
              <dd className="text-stone-600">Premium yarn • hypoallergenic</dd>
            </div>
          </dl>
        </div>

        {/* Image Column */}
        <div className="relative">
          <div className="frame">
            <img
              src="/src/assets/hero_image.jpg"
              alt="Soft crochet textiles"
              className="w-full h-[420px] md:h-[520px] object-cover"
            />
          </div>

          <div className="absolute -bottom-6 -left-6">
            <div className="rounded-3xl bg-white/80 backdrop-blur-6 shadow-soft border border-white/60 px-5 py-4">
              <p className="text-sm">
                <span className="font-medium">Kelsey</span> • Springfield, MO
              </p>
              <p className="text-xs text-stone-500">Ships anywhere in the U.S.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <WaveDivider />
      </div>
    </section>
  );
}
