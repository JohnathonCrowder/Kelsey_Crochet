import { useMemo, useState } from "react";
import { Blob } from "../Decor";
import { Mail, Phone, Sparkles, MapPin, Package, Timer, Heart } from "lucide-react";

type ContactProps = {
  airtableUrl: string;
  email: string;
  phone: string;
  location?: string;
  brand?: string;
};

export default function Contact({
  airtableUrl,
  email,
  phone,
  location = "Springfield, MO",
  brand = "Kelsey’s Crochet",
}: ContactProps) {
  const [loaded, setLoaded] = useState(false);

  // SEO
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: `${brand} — Start a Custom Order`,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      about: "Custom crochet orders, plushies, throws, and gifts.",
      mainEntity: {
        "@type": "Organization",
        name: brand,
        email,
        telephone: phone,
        address: { "@type": "PostalAddress", addressLocality: location, addressCountry: "US" },
      },
    }),
    [brand, email, phone, location]
  );

  const openDirect = airtableUrl.replace("/embed/", "/");

  return (
    <section
      id="contact"
      className="section relative overflow-hidden bg-gradient-to-br from-petal-50/70 via-white to-sage-50/70"
    >
      <Blob className="-z-10 top-[8rem] left-[-14rem] opacity-30" />
      <Blob className="-z-10 bottom-[-10rem] right-[-16rem] opacity-20" />

      <div className="container-max">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill bg-white/80">
            <Sparkles className="h-3.5 w-3.5" />
            contact • custom order • crochet
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl tracking-tight text-petal-900">
            Start a Custom Order
          </h2>
          <p className="mt-3 text-stone-600">
            Tell me your idea—colors, size, and any deadline. I’ll reply fast with timing, pricing, and yarn options.
          </p>
        </div>

        {/* Balanced two columns */}
        <div className="mt-10 grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Info (6/12) */}
          <aside className="lg:col-span-6">
            <div className="card p-6">
              <div className="inline-flex items-center gap-2 pill mb-4 bg-white/90">
                <Heart className="h-3.5 w-3.5 text-petal-700" />
                Handmade by Kelsey
              </div>

              <h3 className="text-lg font-semibold text-stone-900">Reach Me Directly</h3>
              <p className="mt-2 text-stone-600">
                You can always contact me by email or phone—I love chatting about ideas before you place an order.
              </p>

              <div className="mt-5 space-y-3">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-stone-700 hover:text-petal-700 transition"
                >
                  <Mail className="h-5 w-5 text-petal-700" />
                  <span className="text-base font-medium">{email}</span>
                </a>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 text-stone-700 hover:text-petal-700 transition"
                >
                  <Phone className="h-5 w-5 text-petal-700" />
                  <span className="text-base font-medium">{formatPhone(phone)}</span>
                </a>
              </div>

              <div className="stitch-divider my-6" />

              {/* trust badges */}
              <div className="flex flex-wrap gap-3">
                <Badge tone="sage" icon={<MapPin className="h-4 w-4" />} label={`${location} • Ships U.S.-wide`} />
                <Badge tone="amber" icon={<Timer className="h-4 w-4" />} label="Friendly 24h replies" />
                <Badge tone="petal" icon={<Package className="h-4 w-4" />} label="Careful, tracked shipping" />
              </div>
            </div>
          </aside>

          {/* RIGHT: Airtable form (6/12) */}
          <div className="lg:col-span-6">
            <div className="frame overflow-hidden">
              {!loaded && (
                <div className="h-[760px] md:h-[820px] bg-white/60 animate-pulse flex items-center justify-center">
                  <div className="text-stone-400 text-sm">Loading form…</div>
                </div>
              )}
              <iframe
                className={`airtable-embed w-full h-[760px] md:h-[820px] ${
                  loaded ? "opacity-100" : "opacity-0"
                } transition-opacity duration-500`}
                src={airtableUrl}
                title="Custom Order Form"
                loading="lazy"
                frameBorder={0}
                onLoad={() => setLoaded(true)}
                style={{ background: "transparent" }}
              />
            </div>

            <p className="mt-3 text-center text-sm text-stone-500">
              Trouble seeing the form?{" "}
              <a href={openDirect} target="_blank" rel="noreferrer" className="nav-link underline">
                Open it in a new tab
              </a>.
            </p>
          </div>
        </div>
      </div>

      {/* SEO */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}

/* helper: formats phone to (XXX) XXX-XXXX */
function formatPhone(num: string) {
  const cleaned = ("" + num).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;
  return num;
}

/* pastel badge */
function Badge({
  icon,
  label,
  tone = "petal",
}: {
  icon: React.ReactNode;
  label: string;
  tone?: "petal" | "sage" | "amber";
}) {
  const tones: Record<string, string> = {
    petal: "from-petal-50 to-petal-100 border-petal-200 text-petal-900 bg-gradient-to-r",
    sage: "from-sage-50  to-sage-100  border-sage-200  text-sage-900  bg-gradient-to-r",
    amber: "from-amber-50 to-amber-100 border-amber-200 text-amber-900 bg-gradient-to-r",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-soft ${tones[tone]}`}
    >
      <span className="w-6 h-6 rounded-full bg-white/60 flex items-center justify-center">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </span>
  );
}
