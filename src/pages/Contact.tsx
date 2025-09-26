// src/pages/Contact.tsx
import Header from "../components/Header";
import Footer from "../components/homepage/Footer";
import { Blob } from "../components/Decor";
import {
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  MapPin,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Check,
  Copy,
  Package,
  Truck,
  Images,
} from "lucide-react";
import { useMemo, useState } from "react";

const EMAIL = "cooperkelsey389@gmail.com";
const PHONE_DISPLAY = "(618) 214-0012";
const PHONE_TEL = "6182140012";
const AIRTABLE_URL =
  "https://airtable.com/embed/appGhCN6MAyc4qyjk/pag85KIg5Jq1DNDrq/form";

type TabKey = "form" | "quick";

export default function ContactPage() {
  const [tab, setTab] = useState<TabKey>("form");
  const [qnName, setQnName] = useState("");
  const [qnEmail, setQnEmail] = useState("");
  const [qnMsg, setQnMsg] = useState("");

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact Kelsey’s Crochet",
      description:
        "Start a custom crochet order or send a quick note. Friendly 24h replies. Handmade plushies, blankets, and wearables.",
      mainEntity: {
        "@type": "Organization",
        name: "Kelsey’s Crochet",
        areaServed: "US",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: EMAIL,
          telephone: `+1-${PHONE_TEL}`,
          availableLanguage: ["English"],
        },
      },
      url: typeof window !== "undefined" ? window.location.href : undefined,
    }),
    []
  );

  const quickNoteHref = useMemo(() => {
    const subject = encodeURIComponent("Custom Crochet Inquiry");
    const body = encodeURIComponent(
      `Name: ${qnName}\nEmail: ${qnEmail}\n\nMessage:\n${qnMsg}\n\n(From Kelsey's Crochet Corner contact page)`
    );
    return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  }, [qnName, qnEmail, qnMsg]);

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <>
      <Header />

      <main className="relative overflow-hidden bg-gradient-to-b from-petal-50 to-white">
        {/* Background accents */}
        <Blob className="-z-10 top-[7rem] left-[-14rem] opacity-30" />
        <Blob className="-z-10 bottom-[-12rem] right-[-16rem] opacity-20" />

        <div className="container-max py-16 md:py-20">
          {/* HERO */}
          <header className="text-center max-w-3xl mx-auto">
            <span className="pill bg-white/80">
              <Sparkles className="h-3.5 w-3.5" />
              contact • custom order • crochet
            </span>
            <h1 className="mt-4 font-display text-4xl md:text-5xl tracking-tight text-petal-900">
              Start a Custom Order
            </h1>
            <p className="mt-3 text-stone-700">
              Tell me your idea and I’ll reply quickly with timing, pricing, and yarn options.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Badge icon={<Clock className="h-4 w-4" />} text="Friendly 24h replies" />
              <Badge icon={<ShieldCheck className="h-4 w-4" />} text="Private — no spam" />
              <Badge icon={<MapPin className="h-4 w-4" />} text="Springfield, MO • U.S. shipping" />
            </div>
          </header>

          {/* CONTENT */}
          <section className="mt-12 grid lg:grid-cols-[1.05fr,0.95fr] gap-8 items-start">
            {/* LEFT: Tabs + Airtable + Quick Note */}
            <div className="space-y-6">
              <div className="card p-3 md:p-4">
                {/* Tabs */}
                <div className="flex gap-2">
                  <TabButton active={tab === "form"} onClick={() => setTab("form")}>
                    Custom Order Form
                  </TabButton>
                  <TabButton active={tab === "quick"} onClick={() => setTab("quick")}>
                    Quick Note (Email)
                  </TabButton>
                </div>

                {/* Panels */}
                <div className="mt-4">
                  {tab === "form" ? (
                    <div className="rounded-2xl overflow-hidden">
                      <iframe
                        className="airtable-embed"
                        src={AIRTABLE_URL}
                        title="Kelsey’s Crochet — Contact Form"
                        width="100%"
                        height="700"
                        frameBorder="0"
                        style={{
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.6)",
                        }}
                      />
                      <div className="flex items-center justify-end px-3 py-2">
                        <a
                          href={AIRTABLE_URL.replace("/embed", "")}
                          target="_blank"
                          rel="noreferrer"
                          className="nav-link text-sm inline-flex items-center gap-1"
                        >
                          Trouble seeing the form? Open in a new tab{" "}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="col-span-full">
                        <p className="text-sm text-stone-600">
                          Prefer your email app? Fill this in and click <strong>Open Email</strong>.
                        </p>
                      </div>
                      <Field label="Your Name">
                        <input
                          className="input"
                          value={qnName}
                          onChange={(e) => setQnName(e.target.value)}
                          placeholder="Jane Doe"
                        />
                      </Field>
                      <Field label="Your Email">
                        <input
                          className="input"
                          type="email"
                          value={qnEmail}
                          onChange={(e) => setQnEmail(e.target.value)}
                          placeholder="you@email.com"
                        />
                      </Field>
                      <div className="col-span-full">
                        <Field label="What would you like made?">
                          <textarea
                            className="input min-h-[160px]"
                            value={qnMsg}
                            onChange={(e) => setQnMsg(e.target.value)}
                            placeholder="Describe your idea, colors, size, any deadlines…"
                          />
                        </Field>
                      </div>
                      <div className="col-span-full flex items-center gap-3">
                        <a href={quickNoteHref} className="btn btn-primary">
                          Open Email
                        </a>
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => {
                            const text = `Name: ${qnName}\nEmail: ${qnEmail}\n\nMessage:\n${qnMsg}`;
                            navigator.clipboard.writeText(text);
                            alert("Copied to clipboard — paste into any app.");
                          }}
                        >
                          Copy Message
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Micro-trust: process strip */}
              <div className="grid md:grid-cols-3 gap-4">
                <Step
                  icon={<Images className="h-5 w-5" />}
                  title="Share idea"
                  text="Tell me item, colors, size, and any deadline."
                />
                <Step
                  icon={<Package className="h-5 w-5" />}
                  title="I craft it"
                  text="Photo check-ins; approvals before shipping."
                />
                <Step
                  icon={<Truck className="h-5 w-5" />}
                  title="Pickup or ship"
                  text="Local pickup in Springfield, MO or U.S. shipping."
                />
              </div>
            </div>

            {/* RIGHT: Quick contact, utilities, mini FAQ */}
            <aside className="space-y-6">
              <div className="card p-5">
                <h2 className="text-lg font-semibold text-stone-900">Quick Contact</h2>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 nav-link">
                      <Mail className="h-5 w-5" /> {EMAIL}
                    </a>
                    <div className="flex items-center gap-2">
                      <MiniBtn onClick={() => copy(EMAIL)} icon={<Copy className="h-4 w-4" />} />
                      <MiniBtn
                        onClick={() =>
                          window.open(`mailto:${EMAIL}?subject=Custom Crochet Inquiry`, "_self")
                        }
                        icon={<Check className="h-4 w-4" />}
                        title="Open email"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <a href={`tel:${PHONE_TEL}`} className="flex items-center gap-3 nav-link">
                      <Phone className="h-5 w-5" /> {PHONE_DISPLAY}
                    </a>
                    <div className="flex items-center gap-2">
                      <MiniBtn onClick={() => copy(PHONE_TEL)} icon={<Copy className="h-4 w-4" />} />
                      <MiniBtn
                        onClick={() => (window.location.href = `tel:${PHONE_TEL}`)}
                        icon={<Check className="h-4 w-4" />}
                        title="Call"
                      />
                    </div>
                  </div>
                </div>

                <div className="soft-divider mt-5" />

                <ul className="mt-5 space-y-2 text-sm text-stone-700">
                  <li className="flex gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-stone-500" />
                    Springfield, MO • ships U.S.-wide
                  </li>
                  <li className="flex gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-stone-500" />
                    Typical turnaround: small items ~3–5 days
                  </li>
                </ul>

                <div className="mt-5 flex flex-wrap gap-2">
                  <SoftPill>Gift-wrap available</SoftPill>
                  <SoftPill>Photo approvals</SoftPill>
                  <SoftPill>Hypoallergenic options</SoftPill>
                </div>
              </div>

              {/* Mini FAQ */}
              <div className="card p-5">
                <h3 className="text-stone-900 font-semibold">Quick questions</h3>
                <div className="mt-3 space-y-2">
                  {FAQ_MINI.map((f, i) => (
                    <details key={i} className="group">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <span className="text-stone-800">{f.q}</span>
                        <ChevronRight className="h-4 w-4 text-stone-600 transition-transform group-open:rotate-90" />
                      </summary>
                      <p className="mt-2 text-sm text-stone-700">{f.a}</p>
                    </details>
                  ))}
                </div>
                <a href="/care-guide" className="nav-link text-sm mt-3 inline-block">
                  See the full Care Guide →
                </a>
              </div>

              {/* Friendly note */}
              <div className="card p-5">
                <p className="text-sm text-stone-600">
                  Your details go straight to my studio Airtable. I’ll only use them to reply to
                  your request.
                </p>
              </div>
            </aside>
          </section>

          {/* CTA */}
          <div className="mt-12 text-center">
            <a href="/#gallery" className="btn btn-outline">
              Browse the Gallery
            </a>
          </div>
        </div>

        {/* SEO JSON-LD */}
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

/* ---------- UI helpers ---------- */

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-white/60 bg-white/80 shadow-soft">
      <span className="w-6 h-6 rounded-full bg-white/70 flex items-center justify-center">
        {icon}
      </span>
      <span className="text-sm font-medium text-stone-800">{text}</span>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
  id,
  panelId,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  id?: string;        // optional: for aria linking
  panelId?: string;   // optional: for aria linking
}) {
  return (
    <button
      type="button"
      id={id}
      role="tab"
      aria-selected={active}
      aria-controls={panelId}
      onClick={onClick}
      className={[
        "px-3.5 py-2 rounded-xl text-sm font-medium border transition",
        "focus:outline-none focus:ring-2 focus:ring-petal-300",
        active
          ? "bg-petal-600 text-white border-petal-600 shadow-soft"
          : "bg-white/80 text-stone-800 border-white/60 hover:bg-white"
      ].join(" ")}
    >
      {children}
    </button>
  );
}


function SoftPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium border border-white/60 bg-white/70 shadow-soft">
      {children}
    </span>
  );
}

function MiniBtn({
  icon,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  title?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex items-center justify-center h-8 w-8 rounded-xl border border-white/60 bg-white/70 hover:shadow-glow active:scale-95"
    >
      {icon}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

function Step({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-petal-100 flex items-center justify-center">
          {icon}
        </div>
        <h4 className="font-semibold text-stone-900">{title}</h4>
      </div>
      <p className="text-sm text-stone-700 mt-1">{text}</p>
    </div>
  );
}

/* ---------- data ---------- */

const FAQ_MINI = [
  {
    q: "How fast will I hear back?",
    a: "Usually within 24 hours. If you have a deadline, mention it and I’ll confirm feasibility right away.",
  },
  {
    q: "What should I include?",
    a: "Item type, colors, size, timeline, and any reference photos. If you’re unsure, I can suggest options.",
  },
  {
    q: "Do you ship?",
    a: "Yes—tracked U.S. shipping or local pickup in Springfield, MO.",
  },
  {
    q: "Can I approve before shipping?",
    a: "Absolutely. I’ll share quick photos so you can request tweaks before it goes out.",
  },
];
