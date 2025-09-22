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
      <Hero />
      <About />
      <Gallery />
      <Process />
      <FAQ />
      <Contact
        airtableUrl="https://airtable.com/embed/appGhCN6MAyc4qyjk/pag85KIg5Jq1DNDrq/form"
        email="cooperkelsey389@gmail.com"
        phone="6182140012"
      />
      <Footer />
    </div>
  );
}
