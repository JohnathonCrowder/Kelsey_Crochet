import { useMemo } from "react";
import { Blob } from "../Decor";
import { ChevronRight } from "lucide-react";

type QA = { q: string; a: string };

const QAS: QA[] = [
  {
    q: "How do custom orders work?",
    a: "Send a message with what you’d like—item, colors, size, and any deadline. I’ll confirm timing and materials, then we’ll align on details before I start. You’ll get quick photo updates along the way.",
  },
  {
    q: "What’s the typical turnaround?",
    a: "Beanies are ~3–5 days, plushies ~5–7 days, and throws ~7–14 days. Timing depends on size and complexity—rush requests are welcome and I’ll confirm a date before you pay.",
  },
  {
    q: "Which yarn do you use?",
    a: "I use soft, premium yarns chosen for color and feel. Hypoallergenic options are available on request. If you have a palette or inspiration photo, I can color-match.",
  },
  {
    q: "Do you ship? Where from?",
    a: "Yes! I crochet in Springfield, MO and ship anywhere in the U.S. with careful packaging and tracking. Local pickup is also available.",
  },
  {
    q: "How do payments work?",
    a: "For most items I take payment when the piece is ready to ship. For large throws or very custom pieces, I may request a small deposit after we finalize the design.",
  },
  {
    q: "Can I request revisions?",
    a: "Absolutely—I share progress photos so you can request small tweaks (e.g., color balance, eye placement on plushies) before shipping.",
  },
];

export default function FAQ() {
  // Build FAQPage JSON-LD for SEO
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: QAS.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    }),
    []
  );

  return (
    <section id="faq" className="section relative bg-white/60 overflow-hidden">
      {/* soft background accents */}
      <Blob className="-z-10 top-[8rem] left-[-14rem] opacity-30" />
      <Blob className="-z-10 bottom-[-10rem] right-[-16rem] opacity-20" />

      <div className="container-max">
        {/* Header */}
        <header className="text-center max-w-2xl mx-auto">
          <span className="pill bg-white/80">questions • yarn • shipping</span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl tracking-tight text-petal-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-stone-600">
            Everything you need to know about custom crochet orders, timing, and shipping.
          </p>
        </header>

        {/* Accordion (native <details> for a11y + simplicity) */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {QAS.map((item, i) => (
            <details
              key={i}
              className="group card p-5 open:shadow-glow transition-shadow"
            >
              <summary
                className="flex items-start justify-between cursor-pointer list-none"
                aria-controls={`faq-panel-${i}`}
              >
                <h3 className="pr-6 text-stone-900 font-semibold">
                  {item.q}
                </h3>
                <div
                  className="ml-3 shrink-0 rounded-full border border-white/60 bg-white/80 p-1.5 transition-transform duration-300 group-open:rotate-90"
                  aria-hidden
                >
                  <ChevronRight className="h-4 w-4 text-stone-700" />
                </div>
              </summary>

              <div
                id={`faq-panel-${i}`}
                className="mt-3 text-stone-600 leading-relaxed"
              >
                {item.a}
              </div>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a href="#contact" className="btn btn-primary shadow-glow">
            Still have a question? Contact me
          </a>
        </div>
      </div>

      {/* JSON-LD for FAQ SEO */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
