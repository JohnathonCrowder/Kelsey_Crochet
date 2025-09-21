import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "#home", label: "Home" },
  { href: "#gallery", label: "Gallery" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-white/60">
      <div className="container-max flex items-center justify-between h-16">
        {/* Logo / Brand */}
        <a
          href="#home"
          className="font-display text-xl font-semibold tracking-tight"
        >
          <span className="text-petal-800">Kelsey’s</span> Crochet
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link hover:text-petal-700 transition"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="btn btn-primary text-sm shadow-ring"
          >
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
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 nav-link"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
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
