export default function Footer() {
  return (
    <footer className="py-10 border-t border-white/60 bg-white/50 backdrop-blur">
      <div className="container-max flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <p className="text-sm text-stone-500">
          © {new Date().getFullYear()} Kelsey’s Crochet. All rights reserved.
        </p>

        {/* Footer links */}
        <div className="flex items-center gap-6 text-sm text-stone-500">
          <a href="#home" className="nav-link hover:text-petal-700 transition">
            Back to top
          </a>
          <a
            href="#contact"
            className="nav-link hover:text-petal-700 transition"
          >
            Contact
          </a>
          <a
            href="https://instagram.com/your-handle"
            target="_blank"
            rel="noreferrer"
            className="nav-link hover:text-petal-700 transition"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
