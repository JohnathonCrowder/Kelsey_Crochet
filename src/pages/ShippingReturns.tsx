// src/pages/ShippingReturns.tsx
import { useEffect, useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/homepage/Footer";
import { Blob } from "../components/Decor";
import {
  ShieldCheck,
  Truck,
  Package,
  RotateCcw,
  HelpCircle,
  Gift,
  Info,
  Ship,
  MapPin,
  AlertTriangle,
  Mail,
} from "lucide-react";

export default function ShippingReturns() {
  // Basic SEO
  useEffect(() => {
    document.title = "Shipping & Returns • Kelsey’s Crochet";
    const ensureMeta = (name: string, content: string) => {
      const el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        const m = document.createElement("meta");
        m.name = name;
        m.content = content;
        document.head.appendChild(m);
      } else {
        el.setAttribute("content", content);
      }
    };
    ensureMeta(
      "description",
      "Simple, friendly policies for handmade crochet. Shipping times, packaging, returns & exchanges, and quick FAQs."
    );
  }, []);

  // FAQ JSON-LD
  const faqJsonLd = useMemo(() => {
    const qa = [
      {
        q: "How long until my order ships?",
        a: "Ready-to-ship items leave in 1–2 business days. Made-to-order pieces follow the lead time listed on each product (usually 3–10 days).",
      },
      {
        q: "Do you accept returns?",
        a: "Premade items can be returned within 14 days in original, unused condition. Made-to-order pieces are returnable for workmanship issues—please contact me with photos.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes. International customers are responsible for any customs/VAT. Transit times vary by destination.",
      },
      {
        q: "My package is delayed or lost—what do I do?",
        a: "First, check the tracking link and your local carrier. If it’s stalled for 7+ days (domestic) or 21+ days (international), contact me and I’ll help file a trace.",
      },
      {
        q: "Can I add a gift note?",
        a: "Absolutely. Add it at checkout or message me after purchase and I’ll include a handwritten note at no extra cost.",
      },
    ];
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: qa.map((x) => ({
        "@type": "Question",
        name: x.q,
        acceptedAnswer: { "@type": "Answer", text: x.a },
      })),
    });
  }, []);

  return (
    <>
      <Header />

      <main className="relative overflow-hidden bg-gradient-to-b from-petal-50/60 to-white">
        {/* Background accents */}
        <Blob className="-z-10 top-[6rem] left-[-12rem] opacity-30" />
        <Blob className="-z-10 bottom-[-10rem] right-[-16rem] opacity-20" />

        <div className="container-max py-16 md:py-20">
          {/* Hero */}
          <header className="text-center max-w-3xl mx-auto">
            <span className="pill bg-white/80">
              <ShieldCheck className="h-3.5 w-3.5" />
              friendly policies • handmade care
            </span>
            <h1 className="mt-4 font-display text-4xl md:text-5xl tracking-tight text-petal-900">
              Shipping & Returns
            </h1>
            <p className="mt-3 text-stone-700">
              Clear, kind policies for handmade goods. If you need anything,
              <a className="underline ml-1" href="/#contact">send me a message</a>—I’m happy to help.
            </p>
          </header>

          {/* Policy Highlights */}
          <section className="mt-10 grid md:grid-cols-3 gap-6">
            <article className="card p-6">
              <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
                <Truck className="h-5 w-5" /> Processing & Shipping
              </h2>
              <ul className="mt-3 space-y-2 text-stone-700">
                <li>• <strong>Ready-to-ship:</strong> usually leaves in 1–2 business days.</li>
                <li>• <strong>Made-to-order:</strong> follow product lead time (typically 3–10 days).</li>
                <li>• Tracking on all shipments. Rush? <a className="underline" href="/#contact">Ask me</a>.</li>
              </ul>
            </article>

            <article className="card p-6">
              <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
                <Package className="h-5 w-5" /> Packaging & Gifts
              </h2>
              <ul className="mt-3 space-y-2 text-stone-700">
                <li>• Protected with tissue, kraft wrap, and a padded mailer or box.</li>
                <li>• <strong>Free gift note:</strong> add at checkout or message me after.</li>
                <li>• Minimal plastic where possible.</li>
              </ul>
            </article>

            <article className="card p-6">
              <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
                <RotateCcw className="h-5 w-5" /> Returns & Exchanges
              </h2>
              <ul className="mt-3 space-y-2 text-stone-700">
                <li>• <strong>Premade:</strong> return within 14 days (unused & original condition).</li>
                <li>• <strong>Made-to-order:</strong> returns accepted for workmanship issues—message me with photos.</li>
                <li>• Buyer pays return shipping unless I made an error.</li>
              </ul>
            </article>
          </section>

          {/* Details Grid */}
          <section className="mt-8 grid md:grid-cols-2 gap-6">
            <article className="card p-6">
              <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Domestic & International
              </h3>
              <p className="mt-3 text-stone-700">
                I ship from Springfield, MO (USA). International buyers are responsible for
                any customs/VAT; transit times vary by destination.
              </p>
              <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/60 bg-white/70 p-3">
                  <div className="font-medium">Domestic</div>
                  <div className="text-stone-600">USPS / UPS with tracking</div>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/70 p-3">
                  <div className="font-medium">International</div>
                  <div className="text-stone-600">Duties/taxes paid by recipient</div>
                </div>
              </div>
            </article>

            <article className="card p-6">
              <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Delays, Damage & Lost
              </h3>
              <ul className="mt-3 space-y-2 text-stone-700">
                <li>• Check tracking first; carriers may mark “delivered” early.</li>
                <li>• If stalled 7+ days (US) or 21+ days (intl), reach out—I'll help file a trace.</li>
                <li>• Damaged on arrival? Send photos of the box & item within 3 days.</li>
              </ul>
            </article>

            <article className="card p-6">
              <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
                <Info className="h-5 w-5" /> Changes & Cancellations
              </h3>
              <p className="mt-3 text-stone-700">
                Need to update your address or order details? Message me ASAP. If your order
                hasn’t shipped or production hasn’t started, I’ll gladly help.
              </p>
            </article>

            <article className="card p-6">
              <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
                <Gift className="h-5 w-5" /> Gift Orders
              </h3>
              <p className="mt-3 text-stone-700">
                I can ship directly to your recipient with a handwritten note and no pricing inside.
              </p>
            </article>
          </section>

          {/* Tiny FAQ */}
          <section className="mt-10">
            <h2 className="font-display text-2xl md:text-3xl tracking-tight text-petal-900 text-center">
              Quick FAQs
            </h2>
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {FAQS.map((item, i) => (
                <details key={i} className="card p-4 group open:shadow-glow">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="flex items-center gap-2 font-medium text-stone-900">
                      <HelpCircle className="h-4 w-4" /> {item.q}
                    </span>
                    <Ship className="h-4 w-4 text-stone-600 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-stone-700">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <a href="/#contact" className="btn btn-primary shadow-glow">
              Questions? Contact Kelsey
            </a>
            <p className="text-xs text-stone-500 mt-2 inline-flex items-center gap-2 justify-center">
              <Mail className="h-3.5 w-3.5" />
              Prefer email? <a className="underline" href="mailto:cooperkelsey389@gmail.com">cooperkelsey389@gmail.com</a>
            </p>
          </div>
        </div>

        {/* SEO: FAQ structured data */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: faqJsonLd }}
        />
      </main>

      <Footer />
    </>
  );
}

/* -------------------- Data -------------------- */

const FAQS = [
  {
    q: "How long until my order ships?",
    a: "Ready-to-ship items leave in 1–2 business days. Made-to-order pieces follow the lead time listed on each product (usually 3–10 days).",
  },
  {
    q: "Do you accept returns?",
    a: "Premade items can be returned within 14 days in original, unused condition. Made-to-order pieces are returnable for workmanship issues—please contact me with photos.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. International customers are responsible for any customs/VAT. Transit times vary by destination and carrier.",
  },
  {
    q: "What if I need a gift by a specific date?",
    a: "Message me—I can often recommend ready-to-ship items or confirm a rush timeline when possible.",
  },
];
