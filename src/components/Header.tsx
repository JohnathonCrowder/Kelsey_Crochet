import { useState, useMemo } from "react";
import { Menu, X } from "lucide-react";

type NavItem = { href: string; label: string };

const BASE_NAV: NavItem[] = [
  { href: "#home", label: "Home" },
  { href: "#gallery", label: "Gallery" },
  { href: "#process", label: "Process" },
  { href: "/contact", label: "Contact" },      // 👉 standalone page
  { href: "/care-guide", label: "Care Guide" }, // standalone page
  { href: "/about", label: "About" },          // standalone page
];

export default function Header() {
  const [open, setOpen] = useState(false);

  // Consider any non-home page with its own route as "standalone"
  const onStandalone = useMemo(() => {
    if (typeof window === "undefined") return false;
    const p = window.location.pathname;
    return p.startsWith("/care-guide") || p.startsWith("/about") || p.startsWith("/contact");
  }, []);

  // Convert in-page anchors (#id) to homepage anchors (/#id) when not on /
  const resolveHref = (href: string) => {
    if (href.startsWith("#")) {
      return onStandalone ? `/${href}` : href;
    }
    return href;
  };

  // Transform only the anchor items; keep absolute routes as-is
  const NAV = useMemo<NavItem[]>(
    () =>
      BASE_NAV.map((item) =>
        item.href.startsWith("#") ? { ...item, href: resolveHref(item.href) } : item
      ),
    [onStandalone]
  );

  // “Start a Project” always scrolls to the homepage contact anchor
  const contactHref = resolveHref("#contact");

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-white/60">
      <div className="container-max flex items-center justify-between h-16">
        {/* Logo / Brand */}
        <a href="/" className="font-display text-xl font-semibold tracking-tight">
          <span className="text-petal-800">Kelsey’s</span> Crochet Corner
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((item) => (
            <a
              key={item.href + item.label}
              href={item.href}
              className="nav-link hover:text-petal-700 transition"
            >
              {item.label}
            </a>
          ))}
          <a href={contactHref} className="btn btn-primary text-sm shadow-ring">
            Start a Project
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden border-t border-white/60 bg-white/80 backdrop-blur">
          <div className="container-max py-3 flex flex-col gap-2">
            {NAV.map((item) => (
              <a
                key={item.href + item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 nav-link"
              >
                {item.label}
              </a>
            ))}
            <a
              href={contactHref}
              onClick={() => setOpen(false)}
              className="btn btn-primary w-full"
            >
              Start a Project
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
