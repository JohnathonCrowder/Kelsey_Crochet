// src/components/homepage/Homepage.tsx
import Hero from "./Hero";
import About from "./About";
import Gallery from "./Gallery";
import Process from "./Process";
import FAQ from "./FAQ";
import Contact from "./Contact";
import Footer from "./Footer";

export default function Homepage() {
  return (
    <div className="relative">
      {/* Sections */}
      <Hero />
      <About />
      <Gallery />
      <Process />
      <FAQ />
      <Contact
        airtableUrl="https://airtable.com/embed/appGhCN6MAyc4qyjk/pag85KIg5Jq1DNDrq/form"
        email="kelsey@example.com"
        phone="(555) 123-4567"
        instagram="https://instagram.com/your-handle"
      />
      <Footer />
    </div>
  );
}
