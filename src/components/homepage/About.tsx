import { useEffect, useRef, useState } from "react";
import { Blob } from "../Decor";
import { Heart, Gift, Package, Sparkles } from "lucide-react";
import kelseyPortrait from "../../assets/kelsey_portrait.jpg";


/* ------------------ hooks ------------------ */
function useInView(threshold = 0.25) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useTilt() {
  const ref = useRef<HTMLDivElement | null>(null);
  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    const rotX = (py * 5).toFixed(2);
    const rotY = (-px * 5).toFixed(2);
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }
  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(900px) rotateX(0) rotateY(0)`;
  }
  return { ref, onMove, onLeave };
}

/* ------------------ badge ------------------ */
function Badge({
  tone = "petal",
  icon,
  children,
  onClick,
  delay = 0,
}: {
  tone?: "petal" | "sage" | "amber";
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  delay?: number;
}) {
  const tones: Record<string, string> = {
    petal:
      "from-petal-50 to-petal-100 border-petal-200 text-petal-900 bg-gradient-to-r",
    sage:
      "from-sage-50 to-sage-100 border-sage-200 text-sage-900 bg-gradient-to-r",
    amber:
      "from-amber-50 to-amber-100 border-amber-200 text-amber-900 bg-gradient-to-r",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ transitionDelay: `${delay}ms` }}
      className={`interactive-badge badge-wobble inline-flex items-center gap-2 px-5 py-2.5 rounded-full border shadow-soft ${tones[tone]} hover:shadow-glow transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-petal-200 reveal-init`}
    >
      <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white/60">
        {icon}
      </span>
      <span className="text-sm font-medium">{children}</span>
      <Sparkles className="sparkle h-3.5 w-3.5" aria-hidden />
    </button>
  );
}

/* ------------------ main section ------------------ */
export default function About() {
  const { ref: revealImg, visible: imgIn } = useInView(0.2);
  const { ref: revealTxt, visible: txtIn } = useInView(0.2);
  const tilt = useTilt();

  const [swatch, setSwatch] = useState<"petal" | "sage" | "cream">("petal");

  // more dramatic background washes
  const bgClass =
    swatch === "sage"
      ? "from-sage-200 via-sage-100 to-white"
      : swatch === "cream"
      ? "from-amber-200 via-amber-50 to-white"
      : "from-petal-200 via-petal-100 to-white";

  return (
    <section
      id="about"
      className={`section relative overflow-hidden bg-gradient-to-br ${bgClass} transition-all duration-700`}
    >
      {/* background blobs */}
      <Blob className="-z-10 top-[6rem] left-[-12rem] opacity-40" />
      <Blob className="-z-10 bottom-[-6rem] right-[-14rem] opacity-30" />

      <div className="container-max grid md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div
          ref={revealImg}
          className={`transition-all duration-700 ${
            imgIn ? "reveal-in" : "reveal-init"
          }`}
        >
          <div
            ref={tilt.ref}
            onMouseMove={tilt.onMove}
            onMouseLeave={tilt.onLeave}
            className="will-change-transform"
          >
            <div className="crochet-frame rounded-[2rem]">
              <div className="frame overflow-hidden scallop-mask rounded-[2rem]">
                <img
  src={kelseyPortrait}
  alt="Kelsey crocheting a pastel piece"
  className="w-full h-[520px] md:h-[620px] object-cover"
  draggable={false}
/>
              </div>
            </div>
          </div>

          {/* Handmade with love badge */}
          <div className="mt-4 inline-flex items-center gap-2 bg-white/85 backdrop-blur shadow-soft border border-white/60 rounded-2xl px-4 py-2 badge-primary">
            <Heart className="h-4 w-4 text-petal-600" />
            <span className="text-sm font-medium text-stone-700">
              Handmade with love
            </span>
          </div>
        </div>

        {/* Text */}
        <div
          ref={revealTxt}
          className={`transition-all duration-700 delay-100 ${
            txtIn ? "reveal-in" : "reveal-init translate-y-4"
          }`}
        >
          <span className="pill bg-white/80">
            <Sparkles className="h-3.5 w-3.5" />
            crochet • cozy • custom
          </span>

          <h2 className="mt-4 font-display text-4xl md:text-5xl tracking-tight text-petal-900">
            Meet Kelsey
          </h2>

          <p className="mt-4 text-lg text-stone-700 leading-relaxed">
            Hi, I’m Kelsey! Crochet is my happy place — where soft yarn, cozy
            colors, and creativity come together. I love turning ideas into
            keepsakes, from squishy plushies to pastel throws that make a room
            feel warm and loved.
          </p>

          <p className="mt-4 text-stone-600 leading-relaxed">
            Every order is stitched by hand here in Springfield, MO with premium
            yarn and lots of care. Whether it’s a thoughtful gift or a treat for
            yourself, I’m here to make it special.
          </p>

          {/* badges */}
          <div className="mt-6 flex flex-wrap gap-4">
            <Badge
              delay={50}
              tone="petal"
              icon={<Heart className="h-4 w-4" />}
              onClick={() =>
                document
                  .getElementById("gallery")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Handmade with Love
            </Badge>

            <Badge
              delay={120}
              tone="sage"
              icon={<Gift className="h-4 w-4" />}
              onClick={() =>
                document
                  .getElementById("process")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Custom Gifts
            </Badge>

            <Badge
              delay={190}
              tone="amber"
              icon={<Package className="h-4 w-4" />}
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Ships U.S.-wide
            </Badge>
          </div>

          {/* yarn swatches */}
          <div className="mt-6 flex items-center gap-3 text-sm text-stone-600">
            <span>Favorite yarn shades:</span>
            <button
              type="button"
              onClick={() => setSwatch("petal")}
              className={`yarn-dot bg-petal-300 ${
                swatch === "petal"
                  ? "ring-2 ring-petal-400"
                  : "ring-2 ring-white/70"
              }`}
              aria-label="Petal pink"
            />
            <button
              type="button"
              onClick={() => setSwatch("sage")}
              className={`yarn-dot bg-sage-300 ${
                swatch === "sage"
                  ? "ring-2 ring-sage-400"
                  : "ring-2 ring-white/70"
              }`}
              aria-label="Sage green"
            />
            <button
              type="button"
              onClick={() => setSwatch("cream")}
              className={`yarn-dot bg-amber-200 ${
                swatch === "cream"
                  ? "ring-2 ring-amber-400"
                  : "ring-2 ring-white/70"
              }`}
              aria-label="Warm cream"
            />
            <span className="ml-1 capitalize">{swatch}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
