import Hero from "./Hero";
import Gallery from "./Gallery";
import Process from "./Process";
import Contact from "./Contact";
import Footer from "./Footer";
import About from "./About";

export default function Homepage() {
  return (
    <div className="relative">
      {/* Each section is its own component */}
      <Hero />
      <About />
      <Gallery />
      <Process />
      <Contact />
      <Footer />
    </div>
  );
}
