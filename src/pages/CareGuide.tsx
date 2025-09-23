import Header from "../components/Header";
import Footer from "../components/homepage/Footer";
import { Blob } from "../components/Decor";
import {
  Sparkles,
  Droplets,
  Ban,
  Wind,
  Leaf,
  Scissors,
  ShieldCheck,
  ChevronRight,
  Heart,
  Share2, // ⬅️ replaced Printer with Share2
} from "lucide-react";
import { useMemo, useState } from "react";

// PDF asset (Vite will bundle & hash it)
import carePdf from "../assets/Kelseys_Crochet_Care_Guide.pdf";

type RoutineKey = "plushies" | "blankets" | "wearables";

export default function CareGuide() {
  const [tab, setTab] = useState<RoutineKey>("plushies");

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to care for crochet items",
      description:
        "Gentle steps to wash, dry, store, and repair handmade crochet plushies, blankets, and wearables.",
      step: [
        {
          "@type": "HowToStep",
          name: "Wash",
          text:
            "Hand wash in cold water with mild soap. Swish gently for 5–10 minutes, then rinse. Avoid wringing.",
        },
        {
          "@type": "HowToStep",
          name: "Dry",
          text:
            "Press water out in a towel. Reshape and lay flat on a dry towel. No heat or direct sun.",
        },
        {
          "@type": "HowToStep",
          name: "Store",
          text:
            "Store folded in a cool, dry place out of sunlight. Use breathable bags for long-term storage.",
        },
        {
          "@type": "HowToStep",
          name: "Repair",
          text:
            "Tuck snags back with a hook or needle. Weave in loose ends—avoid knots. Ask the maker if unsure.",
        },
      ],
    }),
    []
  );

  // 🔗 Share button handler (Web Share API with copy-link fallback)
  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: "Kelsey's Crochet — Care Guide",
      text: "Handmade crochet care tips for plushies, blankets, and wearables.",
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert("Link copied! You can paste it anywhere to share.");
      }
    } catch {
      /* user canceled or unsupported — no-op */
    }
  };

  return (
    <>
      <Header />

      <main className="relative overflow-hidden bg-gradient-to-b from-petal-50 to-white">
        {/* Background accents */}
        <Blob className="-z-10 top-[8rem] left-[-14rem] opacity-30" />
        <Blob className="-z-10 bottom-[-10rem] right-[-16rem] opacity-20" />

        <div className="container-max py-16 md:py-20">
          {/* Hero */}
          <header className="text-center max-w-3xl mx-auto">
            <span className="pill bg-white/80">
              <Sparkles className="h-3.5 w-3.5" />
              care • washing • storage
            </span>
            <h1 className="mt-4 font-display text-4xl md:text-5xl tracking-tight text-petal-900">
              Crochet Care Guide
            </h1>
            <p className="mt-4 text-lg text-stone-700">
              Every piece is handmade to last. Follow these gentle steps to keep your
              plushies, blankets, and wearables looking cozy for years. 💕
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Tip icon={<Droplets className="h-4 w-4" />} label="Hand wash cold" />
              <Tip icon={<Wind className="h-4 w-4" />} label="Lay flat to dry" />
              <Tip icon={<Ban className="h-4 w-4" />} label="No bleach or heat" />
              <Tip icon={<Leaf className="h-4 w-4" />} label="Store folded, out of sun" />
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              {/* 🔁 NEW: Share button (replaces Print) */}
              <button
                onClick={handleShare}
                className="btn btn-outline text-sm"
                aria-label="Share this care guide"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>

              {/* Download the imported PDF */}
              <a
                href={carePdf}
                download="Kelseys_Crochet_Care_Guide.pdf"
                className="btn btn-primary text-sm shadow-glow"
                aria-label="Download the crochet care guide as a PDF"
              >
                📄 Download PDF
              </a>
            </div>
          </header>

          {/* Interactive selector */}
          <section className="mt-12">
            <div className="max-w-4xl mx-auto card p-3 md:p-4">
              <div className="flex flex-wrap gap-2 md:gap-3">
                <TabButton active={tab === "plushies"} onClick={() => setTab("plushies")}>
                  Plushies
                </TabButton>
                <TabButton active={tab === "blankets"} onClick={() => setTab("blankets")}>
                  Blankets & Throws
                </TabButton>
                <TabButton active={tab === "wearables"} onClick={() => setTab("wearables")}>
                  Wearables
                </TabButton>
              </div>

              <div className="mt-4 md:mt-6 grid md:grid-cols-2 gap-6">
                {tab === "plushies" && (
                  <>
                    <CareCard title="Wash (Spot Clean)">
                      Use a damp cloth with a drop of mild soap. Dab gently at the
                      surface; avoid soaking the stuffing. Rinse cloth and dab again to
                      remove soap.
                    </CareCard>
                    <CareCard title="Dry">
                      Pat with a towel, then air dry. Keep plushie upright to maintain
                      shape. No heat or direct sun.
                    </CareCard>
                    <CareCard title="Refresh">
                      A soft brush or clean toothbrush helps fluff up fibers after
                      drying.
                    </CareCard>
                    <CareCard title="Storage">
                      Display away from strong sun. If storing, keep in a breathable
                      cotton bag—no plastic bins.
                    </CareCard>
                  </>
                )}

                {tab === "blankets" && (
                  <>
                    <CareCard title="Wash">
                      Hand wash in cold water with mild soap. Swish gently 5–10 minutes.
                      Optionally machine-wash on <strong>gentle, cold</strong> in a
                      large mesh bag.
                    </CareCard>
                    <CareCard title="Rinse & Press">
                      Rinse in cold water. Press (don’t wring) to remove excess. Roll in
                      a towel and press again.
                    </CareCard>
                    <CareCard title="Dry & Reshape">
                      Lay flat on a dry towel; gently square corners. Flip once mid-dry.
                      Never tumble dry.
                    </CareCard>
                    <CareCard title="Storage">
                      Fold and store on a shelf out of direct sun to prevent fading and
                      stretching.
                    </CareCard>
                  </>
                )}

                {tab === "wearables" && (
                  <>
                    <CareCard title="Wash">
                      Hand wash preferred. If machine-washing, use a mesh bag on gentle,
                      cold. Zip zippers and turn inside-out first.
                    </CareCard>
                    <CareCard title="Dry">
                      Lay flat on a towel; reshape edges, cuffs, and neckline while
                      damp. No hang-drying (prevents stretching).
                    </CareCard>
                    <CareCard title="De-pill">
                      If tiny fuzzies appear, use a sweater stone or fabric shaver—go
                      slowly and gently.
                    </CareCard>
                    <CareCard title="Storage">
                      Fold in a drawer; avoid hangers. Cedar blocks or lavender sachets
                      keep things fresh.
                    </CareCard>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Do / Don't */}
          <section className="mt-12">
            <h2 className="font-display text-2xl md:text-3xl text-petal-900 text-center">
              Do’s & Don’ts
            </h2>
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <article className="card p-6">
                <h3 className="font-semibold text-stone-900 mb-3">Do</h3>
                <ul className="space-y-2 text-stone-700 list-disc list-inside">
                  <li>Use cool or cold water and a mild, color-safe soap.</li>
                  <li>Reshape while damp and lay flat to dry.</li>
                  <li>Store folded in a cool, dry place.</li>
                  <li>Fix snags promptly by tucking them inside with a blunt needle.</li>
                </ul>
              </article>
              <article className="card p-6">
                <h3 className="font-semibold text-stone-900 mb-3">Don’t</h3>
                <ul className="space-y-2 text-stone-700 list-disc list-inside">
                  <li>Don’t wring, twist, or hang dry—this stretches stitches.</li>
                  <li>Don’t use bleach or high heat (dryer/iron).</li>
                  <li>Don’t store in plastic for long periods—fibers need to breathe.</li>
                  <li>Don’t cut snags; pull them through instead.</li>
                </ul>
              </article>
            </div>
          </section>

          {/* Stain quick-fix accordion */}
          <section className="mt-12">
            <h2 className="font-display text-2xl md:text-3xl text-petal-900 text-center">
              Stain Quick-Fix Guide
            </h2>
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {STAINS.map((s, i) => (
                <details key={i} className="card p-4 group open:shadow-glow">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="font-medium text-stone-900">{s.name}</span>
                    <ChevronRight className="h-4 w-4 text-stone-600 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-stone-700">{s.steps}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Yarn type tips */}
          <section className="mt-12">
            <h2 className="font-display text-2xl md:text-3xl text-petal-900 text-center">
              Caring by Yarn Type
            </h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm bg-white/70 border border-white/60 rounded-2xl shadow-soft">
                <thead className="text-stone-600">
                  <tr className="[&>th]:px-4 [&>th]:py-3">
                    <th>Yarn</th>
                    <th>Good For</th>
                    <th>Wash</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/70 text-stone-800">
                  <Row
                    yarn="Cotton"
                    goodFor="Dishcloths, summer wear"
                    wash="Hand wash cold or gentle cycle; lay flat"
                    notes="Can feel heavier when wet; reshape edges"
                  />
                  <Row
                    yarn="Acrylic"
                    goodFor="Plushies, throws"
                    wash="Hand wash cold; some allow gentle machine wash"
                    notes="Holds color well; avoid high heat"
                  />
                  <Row
                    yarn="Wool"
                    goodFor="Warm wearables"
                    wash="Hand wash only; cold water"
                    notes="May felt with heat or agitation; handle extra gently"
                  />
                </tbody>
              </table>
            </div>
          </section>

          {/* Repairs & Extras */}
          <section className="mt-12 grid md:grid-cols-2 gap-6">
            <article className="card p-6">
              <h3 className="text-xl font-semibold text-petal-800 mb-3 flex items-center gap-2">
                <Scissors className="h-5 w-5" /> Small Repairs
              </h3>
              <ul className="list-disc list-inside text-stone-700 space-y-2">
                <li>Use a blunt needle to tuck snags inside—don’t cut.</li>
                <li>Weave loose ends back through stitches for 1–2″.</li>
                <li>For large issues, message me a photo—I’m happy to help.</li>
              </ul>
              <p className="mt-3 text-sm text-stone-500 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Gentle care preserves color, shape, and softness.
              </p>
            </article>

            <article className="card p-6">
              <h3 className="text-xl font-semibold text-petal-800 mb-3 flex items-center gap-2">
                <Heart className="h-5 w-5" /> Long-Term Storage
              </h3>
              <ul className="list-disc list-inside text-stone-700 space-y-2">
                <li>Fold and store flat; avoid hangers to prevent stretching.</li>
                <li>Use breathable cotton bags. Add cedar blocks or lavender sachets.</li>
                <li>Keep out of direct sun to reduce fading.</li>
              </ul>
            </article>
          </section>

          {/* CTA */}
          <div className="mt-12 text-center">
            <a href="/#contact" className="btn btn-primary shadow-glow">
              Have a care question? Contact me
            </a>
          </div>
        </div>

        {/* SEO: HowTo structured data */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </main>

      <Footer />
    </>
  );
}

/* ------------ Small presentational helpers ---------------- */

function Tip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/60 bg-white/80 shadow-soft">
      <span className="w-7 h-7 rounded-full bg-white/70 flex items-center justify-center">
        {icon}
      </span>
      <span className="text-sm font-medium text-stone-800">{label}</span>
    </div>
  );
}

function TabButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
        active
          ? "bg-gradient-to-r from-petal-100 to-sage-100 border-white/70 shadow-soft text-stone-900"
          : "bg-white/70 border-white/60 hover:shadow-glow text-stone-700"
      }`}
    >
      {children}
    </button>
  );
}

function CareCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="card p-5">
      <h3 className="font-semibold text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-700">{children}</p>
    </article>
  );
}

function Row({
  yarn,
  goodFor,
  wash,
  notes,
}: {
  yarn: string;
  goodFor: string;
  wash: string;
  notes: string;
}) {
  return (
    <tr className="[&>td]:px-4 [&>td]:py-3">
      <td className="font-medium">{yarn}</td>
      <td className="text-stone-700">{goodFor}</td>
      <td className="text-stone-700">{wash}</td>
      <td className="text-stone-700">{notes}</td>
    </tr>
  );
}

/* -------------------- Data -------------------- */

const STAINS = [
  {
    name: "Coffee / Tea",
    steps:
      "Blot right away with cold water. Mix a drop of mild soap in water and dab from the outside in. Rinse and lay flat.",
  },
  {
    name: "Makeup",
    steps:
      "Use a tiny amount of dish soap on a damp cloth; dab gently. Avoid rubbing pigments deeper. Rinse and air dry.",
  },
  {
    name: "Mud / Dirt",
    steps:
      "Let it dry fully, then shake or brush off debris. Spot clean with mild soap and cold water.",
  },
  {
    name: "Food Oils",
    steps:
      "Sprinkle a little cornstarch or baking soda; let sit 15 minutes to absorb. Brush off, then spot clean.",
  },
];
