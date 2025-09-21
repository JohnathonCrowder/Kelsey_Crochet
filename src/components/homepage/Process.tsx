import { Blob } from "../Decor";

export default function Process() {
  return (
    <section id="process" className="section relative overflow-hidden">
      {/* subtle background accents */}
      <Blob className="-z-10 top-[10rem] left-[-14rem] opacity-40" />
      <Blob className="-z-10 top-[34rem] right-[-16rem] opacity-30" />

      <div className="container-max">
        {/* Header */}
        <header className="text-center max-w-2xl mx-auto">
          <span className="pill bg-white/70">custom • handmade • cozy</span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl tracking-tight text-petal-900">
            How a Custom Crochet Order Works
          </h2>
          <p className="mt-3 text-stone-600">
            Three easy steps—from idea to a gift-ready, handmade piece. Clear
            timelines, friendly updates.
          </p>
        </header>

        <div className="mt-12 grid md:grid-cols-2 gap-10 items-start">
          {/* Left: value copy & turnaround */}
          <div>
            <p className="text-stone-700 leading-relaxed">
              Beanies, plushies, or throws—every project is tailored to your
              colors and style. I’ll confirm timing and materials, then send
              progress photos for approval. Handmade in Springfield, MO, with
              U.S. shipping.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="pill">Hypoallergenic options</span>
              <span className="pill">Photo approvals</span>
              <span className="pill">Gift-wrap available</span>
              <span className="pill">Care guide included</span>
            </div>

            <div className="mt-8 rounded-2xl bg-gradient-to-tr from-white/80 to-petal-50 border border-white/60 shadow-soft p-5">
              <p className="badge-soft uppercase tracking-wide">
                Typical Turnaround
              </p>
              <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                {[
                  { label: "Beanie", time: "~3–5 days" },
                  { label: "Plushie", time: "~5–7 days" },
                  { label: "Throw", time: "~7–14 days" },
                ].map((x) => (
                  <div
                    key={x.label}
                    className="rounded-xl border border-white/60 bg-white p-3 text-center"
                  >
                    <p className="font-medium text-stone-800">{x.label}</p>
                    <p className="text-stone-600">{x.time}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-stone-500">
                Timing varies by size and complexity. Deadlines welcome—I’ll
                confirm an exact date.
              </p>
            </div>
          </div>

          {/* Right: stacked steps */}
          <ol className="space-y-6">
            {[
              {
                n: 1,
                emoji: "🧶",
                title: "Share your idea",
                line: "Tell me the item, colors, size, and any deadline.",
              },
              {
                n: 2,
                emoji: "🪡",
                title: "I crochet your piece",
                line: "Premium yarn, neat stitchwork, quick photo updates.",
              },
              {
                n: 3,
                emoji: "📦",
                title: "Pickup or shipping",
                line: "Local pickup or tracked shipping anywhere in the U.S.",
              },
            ].map((s) => (
              <li key={s.n}>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="w-full text-left rounded-2xl bg-white/80 border border-white/60 shadow-soft p-5
                             hover:shadow-glow hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-petal-200
                             motion-safe:transition motion-safe:duration-300 flex gap-4 items-start"
                  aria-label={`${s.title} — ${s.line}`}
                >
                  {/* number bubble */}
                  <span
                    className="shrink-0 rounded-full w-10 h-10 flex items-center justify-center
                               bg-gradient-to-tr from-petal-200 to-sage-200 text-stone-800
                               font-semibold shadow-soft"
                  >
                    {s.n}
                  </span>

                  {/* emoji + text */}
                  <span className="flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-xl" aria-hidden>
                        {s.emoji}
                      </span>
                      <span className="font-semibold text-stone-800">
                        {s.title}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-stone-600">
                      {s.line}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-petal-50 to-sage-50 border border-white/60 shadow-soft p-5">
          <p className="font-medium text-stone-800">
            Ready to start? I’ll reply with a quick quote and timeline.
          </p>
          <a href="#contact" className="btn btn-primary shadow-glow">
            Start a Custom Order
          </a>
        </div>
      </div>
    </section>
  );
}
