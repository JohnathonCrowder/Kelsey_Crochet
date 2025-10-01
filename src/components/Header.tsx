import { useMemo, useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";

type NavItem = { href: string; label: string };

const PRIMARY: NavItem[] = [
  { href: "/", label: "Home" },          // route
  { href: "/gallery", label: "Gallery" },// route
  { href: "/shop", label: "Shop" },      // route
  { href: "/contact", label: "Contact" } // route
];

const MORE: NavItem[] = [
  { href: "/care-guide", label: "Care Guide" },
  { href: "/about", label: "About" },
  { href: "/shipping-returns", label: "Shipping & Returns" },
  { href: "/terms", label: "Terms" },
];

export default function Header() {
  const [open, setOpen] = useState(false);          // mobile menu
  const [moreOpen, setMoreOpen] = useState(false);  // desktop dropdown
  const [moreMobileOpen, setMoreMobileOpen] = useState(false); // mobile accordion

  const { pathname, hash } = useLocation();
  const onHome = pathname === "/";

  // Convert in-page anchors to homepage anchors when not on "/"
  const resolveAnchor = (hashRef: string) => (onHome ? hashRef : `/${hashRef}`);

  // “Start a Project” always points to homepage contact anchor
  const contactHref = resolveAnchor("#contact");

  // Active link helper (routes only)
  const isActive = (href: string) => href === pathname;

  // Close the desktop dropdown if clicking outside
  const moreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!moreRef.current) return;
      if (!moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setMoreOpen(false);
    setOpen(false);
    setMoreMobileOpen(false);
  }, [pathname]);

  // Determine if any “More” page is active (for subtle highlight)
  const moreIsActive = useMemo(
    () => MORE.some((m) => isActive(m.href)),
    [pathname]
  );

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-white/60">
      <div className="container-max flex items-center justify-between h-16">
        {/* Brand */}
        <a href="/" className="font-display text-xl font-semibold tracking-tight">
          <span className="text-petal-800">Kelsey’s</span> Crochet Corner
        </a>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-6"
          role="navigation"
          aria-label="Main"
        >
          {PRIMARY.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-link hover:text-petal-700 transition ${
                isActive(item.href) ? "active-link" : ""
              }`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}

          {/* More dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              className={`nav-link inline-flex items-center gap-1 hover:text-petal-700 transition ${
                moreIsActive ? "active-link" : ""
              }`}
              aria-haspopup="true"
              aria-expanded={moreOpen}
              aria-controls="more-menu"
            >
              More <ChevronDown className="h-4 w-4" />
            </button>

            {moreOpen && (
              <div
                id="more-menu"
                role="menu"
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur shadow-soft border border-white/60 p-2"
              >
                {MORE.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className={`block px-3 py-2 rounded-xl nav-link hover:bg-white/70 ${
                      isActive(item.href) ? "active-link" : ""
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href={contactHref} className="btn btn-primary text-sm shadow-ring ml-2">
            Start a Project
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/60 bg-white/80 backdrop-blur">
          <div className="container-max py-3 flex flex-col gap-2">
            {PRIMARY.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`py-2 nav-link ${isActive(item.href) ? "active-link" : ""}`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}

            {/* Mobile “More” accordion */}
            <button
              type="button"
              onClick={() => setMoreMobileOpen((v) => !v)}
              className={`py-2 nav-link inline-flex items-center justify-between ${
                moreIsActive ? "active-link" : ""
              }`}
              aria-expanded={moreMobileOpen}
            >
              <span>More</span>
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  moreMobileOpen ? "rotate-90" : ""
                }`}
              />
            </button>

            {moreMobileOpen && (
              <div className="pl-3">
                {MORE.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block py-2 nav-link ${isActive(item.href) ? "active-link" : ""}`}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}

            <a
              href={contactHref}
              onClick={() => setOpen(false)}
              className="btn btn-primary w-full mt-2"
            >
              Start a Project
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
