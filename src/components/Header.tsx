import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";

type NavItem = { href: string; label: string };

const BASE_NAV: NavItem[] = [
  { href: "#home", label: "Home" },
  { href: "/gallery", label: "Gallery" },       // 👉 standalone page now
  { href: "#process", label: "Process" },
  { href: "/contact", label: "Contact" },       // standalone
  { href: "/care-guide", label: "Care Guide" }, // standalone
  { href: "/about", label: "About" },           // standalone
];

export default function Header() {
  const [open, setOpen] = useState(false);

  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  const hash = typeof window !== "undefined" ? window.location.hash : "";

  // Consider any routed page as "standalone" (so anchors should point to "/#...")
  const onStandalone = useMemo(() => {
    return (
      pathname.startsWith("/care-guide") ||
      pathname.startsWith("/about") ||
      pathname.startsWith("/contact") ||
      pathname.startsWith("/gallery")
    );
  }, [pathname]);

  // Convert in-page anchors (#id) to homepage anchors (/#id) when not on "/"
  const resolveHref = (href: string) => {
    if (href.startsWith("#")) return onStandalone ? `/${href}` : href;
    return href;
  };

  // Build the final NAV with resolved anchor URLs
  const NAV = useMemo<NavItem[]>(
    () =>
      BASE_NAV.map((item) =>
        item.href.startsWith("#") ? { ...item, href: resolveHref(item.href) } : item
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onStandalone]
  );

  // Start-a-Project button always points to homepage contact anchor
  const contactHref = resolveHref("#contact");

  // Active state helper (for subtle highlight)
  const isActive = (href: string) => {
    if (href.startsWith("/")) {
      // exact route match
      return pathname === href;
    }
    if (href.startsWith("#") && !onStandalone) {
      // on homepage, highlight if hash matches (or treat #home as default)
      if (href === "#home") return hash === "" || hash === "#home";
      return hash === href;
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-white/60">
      <div className="container-max flex items-center justify-between h-16">
        {/* Logo / Brand */}
        <a href="/" className="font-display text-xl font-semibold tracking-tight">
          <span className="text-petal-800">Kelsey’s</span> Crochet Corner
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7" role="navigation" aria-label="Main">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <a
                key={item.href + item.label}
                href={item.href}
                className={`nav-link hover:text-petal-700 transition ${active ? "active-link" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </a>
            );
          })}
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
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <a
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`py-2 nav-link ${active ? "active-link" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </a>
              );
            })}
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
