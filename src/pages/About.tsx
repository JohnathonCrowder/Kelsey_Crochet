import Header from "../components/Header";
import Footer from "../components/homepage/Footer";
import { Blob } from "../components/Decor";
import aboutImg from "../assets/about-photo.jpg"
import {
  Heart,
  Sparkles,
  Scissors,
  Smile,
  Gift,
  Star,
  Quote,
  Palette,
  BadgeCheck,
} from "lucide-react";

export default function About() {
  return (
    <>
      <Header />

      <main className="relative overflow-hidden bg-gradient-to-b from-petal-50/70 to-white">
        {/* Background accents */}
        <Blob className="-z-10 top-[6rem] left-[-12rem] opacity-30" />
        <Blob className="-z-10 bottom-[-10rem] right-[-16rem] opacity-20" />

        <div className="container-max py-16 md:py-20">
          {/* HERO */}
          <header className="grid md:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
            <div>
              <span className="pill bg-white/80">
                <Sparkles className="h-3.5 w-3.5" />
                handmade • cozy • one-of-a-kind
              </span>
              <h1 className="mt-4 font-display text-4xl md:text-5xl tracking-tight text-petal-900">
                Hi, I’m Kelsey — I crochet keepsakes that feel like hugs.
              </h1>
              <p className="mt-4 text-stone-700 text-lg leading-relaxed">
                What began as a weekend hobby turned into a full-on love story with yarn.
                I design plushies, wearables, and blankets that bring comfort, color, and
                a bit of whimsy into everyday life. Every stitch is intentional; every piece
                is made to be held, gifted, and cherished.
              </p>

              {/* Mini trust row */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
  <Badge icon={<BadgeCheck className="h-4 w-4" />} text="Crafted to last" />
  <Badge icon={<Palette className="h-4 w-4" />} text="Custom-friendly" />  {/* ✅ swapped */}
  <Badge icon={<Heart className="h-4 w-4" />} text="Made with love" />
</div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/#gallery" className="btn btn-primary shadow-glow">
                  See the Gallery
                </a>
                <a href="/#contact" className="btn btn-outline">
                  Start a Custom Order
                </a>
              </div>
            </div>

            {/* Portrait / workspace image */}
            <figure className="relative frame scallop-mask overflow-hidden group">
              <img
                src={aboutImg}
                alt="Kelsey crocheting at her workspace"
                className="w-full h-[420px] md:h-[520px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              {/* “Handmade with love” corner tag */}
              <div className="absolute top-4 left-4">
                <div className="rounded-full bg-white/85 backdrop-blur px-3.5 py-1.5 border border-white/60 shadow-soft text-xs font-medium flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5" />
                  Handmade with love
                </div>
              </div>
            </figure>
          </header>

          {/* DIVIDER */}
          <div className="mt-12 stitch-divider" />

          {/* VALUES */}
          <section className="mt-12">
            <h2 className="text-center font-display text-2xl md:text-3xl text-petal-900">
              What guides my work
            </h2>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ValueCard
                icon={<Heart className="h-6 w-6" />}
                title="Care over speed"
                text="I move at the pace of quality—selecting yarns, testing textures, and finishing edges with intention."
              />
              <ValueCard
                icon={<Scissors className="h-6 w-6" />}
                title="Detail-first"
                text="From invisible joins to tidy seam lines, the tiny decisions shape the final feel."
              />
              <ValueCard
                icon={<Smile className="h-6 w-6" />}
                title="Joyful design"
                text="I love playful shapes and soft palettes that feel warm, approachable, and giftable."
              />
              <ValueCard
                icon={<Gift className="h-6 w-6" />}
                title="Made to be given"
                text="Whether it’s a baby shower or a ‘just because,’ I design for meaningful moments."
              />
            </div>
          </section>

          {/* STORY / TIMELINE */}
          <section className="mt-16 grid md:grid-cols-2 gap-10 items-start">
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-stone-900">The short story</h3>
              <p className="mt-3 text-stone-700 leading-relaxed">
                I started crocheting during quiet evenings—hook in one hand, tea in the other.
                Friends asked for gifts, then friends of friends, and soon I was designing
                custom plushies, beanies, and heirloom throws. I still keep that same small-batch,
                hands-on approach, sharing updates and photos along the way.
              </p>
              <ul className="mt-4 space-y-2 text-stone-700">
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 mt-1 text-petal-700" />
                  Custom sketches → yarn picks → progress pics → final reveal
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 mt-1 text-petal-700" />
                  Local pickup in Springfield, MO or careful U.S. shipping
                </li>
              </ul>
            </div>

            <ol className="space-y-4">
              {TIMELINE.map((t, i) => (
                <li key={i} className="relative pl-6">
                  <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-petal-300 border border-white shadow" />
                  <div className="card p-5">
                    <p className="text-xs text-stone-500">{t.year}</p>
                    <h4 className="font-semibold text-stone-900">{t.title}</h4>
                    <p className="text-stone-700 mt-1">{t.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* MATERIALS / FAVORITES */}
          <section className="mt-16">
            <h2 className="text-center font-display text-2xl md:text-3xl text-petal-900">
              Favorite yarns & tools
            </h2>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {MATERIALS.map((m) => (
                <article key={m.title} className="card p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-stone-900">{m.title}</h3>
                    <span className="badge-soft">{m.badge}</span>
                  </div>
                  <p className="text-stone-700 mt-2">{m.text}</p>
                </article>
              ))}
            </div>
            <p className="text-center text-sm text-stone-500 mt-3">
              Preferences vary by piece—feel free to request specific fibers or colors!
            </p>
          </section>

          {/* TESTIMONIAL */}
          <section className="mt-16">
            <div className="card p-6 md:p-8">
              <div className="flex items-start gap-3">
                <Quote className="h-5 w-5 text-petal-700 mt-1" />
                <blockquote className="text-stone-800 leading-relaxed">
                  “Kelsey made the sweetest custom plush for my niece. The stitching is so
                  neat and the colors are perfect. She shared progress photos and shipped it
                  with the cutest packaging. Couldn’t be happier!”
                </blockquote>
              </div>
              <p className="mt-3 text-sm text-stone-500">— A happy gifter</p>
            </div>
          </section>

          {/* FAQ MINI (interactive but simple) */}
          <section className="mt-16">
            <h2 className="text-center font-display text-2xl md:text-3xl text-petal-900">
              Quick questions
            </h2>
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {FAQ_MINI.map((f, i) => (
                <details key={i} className="card p-4 group open:shadow-glow">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="font-medium text-stone-900">{f.q}</span>
                    <span className="text-stone-500 text-sm group-open:rotate-90 transition-transform">
                      →
                    </span>
                  </summary>
                  <p className="mt-3 text-stone-700">{f.a}</p>
                </details>
              ))}
            </div>
            <div className="text-center mt-6">
              <a href="/#faq" className="nav-link underline">
                See full FAQ
              </a>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-16 text-center">
            <a href="/#contact" className="btn btn-primary shadow-glow">
              Let’s make something special
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

/* ---------- helpers ---------- */

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-white/60 bg-white/80 shadow-soft text-sm">
      <span className="w-6 h-6 rounded-full bg-white/70 flex items-center justify-center">
        {icon}
      </span>
      <span className="font-medium text-stone-800">{text}</span>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="card p-6 text-left hover:shadow-glow transition-shadow">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-petal-100 text-petal-800">
        {icon}
      </div>
      <h3 className="font-semibold text-stone-900">{title}</h3>
      <p className="text-sm text-stone-700 mt-2">{text}</p>
    </div>
  );
}

/* ---------- data ---------- */

const TIMELINE = [
  {
    year: "2019",
    title: "First stitches",
    text: "Learned basics, made gifts for family, fell in love with texture.",
  },
  {
    year: "2021",
    title: "Custom requests",
    text: "Started designing plushies and wearables for friends-of-friends.",
  },
  {
    year: "2023",
    title: "Small-batch shop",
    text: "Opened commissions with simple timelines and photo updates.",
  },
  {
    year: "Today",
    title: "Made for keeps",
    text: "One-of-a-kind pieces crafted to be loved for years.",
  },
];

const MATERIALS = [
  {
    title: "Favorite plush yarns",
    badge: "soft & cuddly",
    text: "Cloud-soft acrylic blends that keep shape and color, perfect for plushies.",
  },
  {
    title: "Wearable picks",
    badge: "cozy",
    text: "Breathable, comfy staples chosen for drape, warmth, and everyday durability.",
  },
  {
    title: "Hooks & notions",
    badge: "precision",
    text: "Ergonomic hooks, stitch markers, and tidy finishing tools for clean seams.",
  },
  {
    title: "Packaging",
    badge: "gift-ready",
    text: "Wrapped with care so unboxing feels as special as the piece inside.",
  },
];

const FAQ_MINI = [
  {
    q: "Do you make custom orders?",
    a: "Yes! Share your idea, colors, timeline, and any reference photos. I’ll suggest yarns and confirm details before starting.",
  },
  {
    q: "How long does a project take?",
    a: "Small items can be ready in ~3–5 days. Larger pieces and custom plushies vary by complexity.",
  },
  {
    q: "Do you ship?",
    a: "Absolutely. Local pickup in Springfield, MO or tracked U.S. shipping with careful packaging.",
  },
  {
    q: "How do I care for my item?",
    a: "Hand wash cold, lay flat to dry, store folded away from direct sun. See the full Care Guide for more.",
  },
];
