import { ArrowUp, Instagram, Mail, Phone, ShoppingBag, MapPin, Heart } from "lucide-react";
import { useMemo } from "react";

type FooterProps = {
  brand?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  instagram?: string | null; // hide if null
  shopUrl?: string;
  location?: string; // short city/state
  year?: number;
};

export default function Footer({
  brand = "Kelsey’s Crochet",
  tagline = "Handmade crochet keepsakes—soft, cozy, and custom.",
  email = "cooperkelsey389@gmail.com",
  phone = "(618) 214-0012",
  instagram = null, // hide until ready
  shopUrl = "/shop",
  location = "Springfield, MO",
  year = new Date().getFullYear(),
}: FooterProps) {
  // Are we on the homepage? Used to resolve #anchors vs /#anchors
  const onHome = typeof window !== "undefined" ? window.location.pathname === "/" : true;
  const resolveAnchor = (hash: string) => (onHome ? hash : `/${hash}`);

  // JSON-LD for basic SEO
  const jsonLd = useMemo(
    () =>
      ({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: brand,
        url: typeof window !== "undefined" ? window.location.origin : undefined,
        description: tagline,
        email,
        telephone: phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: location,
          addressCountry: "US",
        },
        sameAs: [instagram || undefined].filter(Boolean),
      } as const),
    [brand, tagline, email, phone, instagram, location]
  );

  return (
    <footer className="mt-20 border-t border-white/60 bg-white/55 backdrop-blur">
      {/* top */}
      <div className="container-max py-12 grid md:grid-cols-12 gap-10">
        {/* Brand blurb */}
        <div className="md:col-span-5">
          <a href="/" className="font-display text-xl font-semibold tracking-tight">
            <span className="text-petal-800">{brand.split(" ")[0]}</span>{" "}
            {brand.split(" ").slice(1).join(" ")}
          </a>
          <p className="mt-3 text-stone-600">{tagline}</p>

          <div className="mt-4 inline-flex items-center gap-2 pill">
            <Heart className="h-3.5 w-3.5 text-petal-700" />
            handmade • cozy • custom
          </div>
        </div>

        {/* Quick links */}
        <nav className="md:col-span-3">
          <p className="text-stone-800 font-semibold mb-3">Explore</p>
          <ul className="space-y-2">
            <li><a className="nav-link" href="/">Home</a></li>
            <li><a className="nav-link" href="/about">About</a></li>
            <li><a className="nav-link" href="/gallery">Gallery</a></li>
            <li><a className="nav-link" href="/shop">Shop</a></li>
            <li><a className="nav-link" href="/care-guide">Care Guide</a></li>
            <li><a className="nav-link" href="/shipping-returns">Shipping & Returns</a></li>
            <li><a className="nav-link" href="/terms">Terms & Conditions</a></li>
          </ul>
        </nav>

        {/* Contact */}
        <div className="md:col-span-4">
          <p className="text-stone-800 font-semibold mb-3">Contact</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a className="nav-link inline-flex items-center gap-2" href={`mailto:${email}`}>
                <Mail className="h-4 w-4" /> {email}
              </a>
            </li>
            <li>
              <a className="nav-link inline-flex items-center gap-2" href={`tel:${phone.replace(/\D/g, "")}`}>
                <Phone className="h-4 w-4" /> {phone}
              </a>
            </li>
            <li className="inline-flex items-center gap-2 text-stone-600">
              <MapPin className="h-4 w-4" /> {location} • Ships U.S.-wide
            </li>

            <li className="mt-3 flex items-center gap-3">
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline px-4 py-2"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </a>
              )}
              <a href={shopUrl} className="btn btn-primary px-4 py-2">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Visit Shop
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-white/60 bg-white/60">
        <div className="container-max py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-stone-500">© {year} {brand}. All rights reserved.</p>

          <div className="flex items-center gap-6 text-sm text-stone-500">
            <a className="nav-link" href={resolveAnchor("#contact")}>Start a Custom Order</a>
            <a className="nav-link" href={onHome ? "#home" : "/"}>
              Back to top <ArrowUp className="inline-block ml-1 h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </footer>
  );
}
