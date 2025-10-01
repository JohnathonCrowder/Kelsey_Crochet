// src/pages/Terms.tsx
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/homepage/Footer";
import { Blob } from "../components/Decor";
import { ShieldCheck, FileText, DollarSign, UserCheck, ShoppingBag, Truck, RefreshCcw } from "lucide-react";

export default function Terms() {
  useEffect(() => {
    document.title = "Terms & Conditions • Kelsey’s Crochet";
  }, []);

  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-gradient-to-b from-petal-50/60 to-white">
        {/* Background */}
        <Blob className="-z-10 top-[6rem] left-[-12rem] opacity-30" />
        <Blob className="-z-10 bottom-[-10rem] right-[-16rem] opacity-20" />

        <div className="container-max py-16 md:py-20">
          {/* Hero */}
          <header className="text-center max-w-3xl mx-auto">
            <span className="pill bg-white/80">
              <ShieldCheck className="h-3.5 w-3.5" />
              legal • policies • trust
            </span>
            <h1 className="mt-4 font-display text-4xl md:text-5xl tracking-tight text-petal-900">
              Terms & Conditions
            </h1>
            <p className="mt-3 text-stone-700">
              These Terms govern your use of this website and all purchases from
              Kelsey’s Crochet. By ordering, you agree to these simple, fair rules.
            </p>
          </header>

          {/* Sections */}
          <section className="mt-12 grid gap-6">
            <article className="card p-6">
              <h2 className="text-xl font-semibold text-stone-900 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" /> Orders & Products
              </h2>
              <p className="mt-3 text-stone-700">
                Each crochet piece is handmade and may have slight variations. Photos are
                representative but not always identical. Made-to-order items follow the
                lead times stated on product pages.
              </p>
            </article>

            <article className="card p-6">
              <h2 className="text-xl font-semibold text-stone-900 flex items-center gap-2">
                <DollarSign className="h-5 w-5" /> Payments
              </h2>
              <p className="mt-3 text-stone-700">
                Payments are securely processed through Stripe. We accept major credit and
                debit cards. Prices are in USD unless otherwise stated. Payment must clear
                before production or shipping begins.
              </p>
            </article>

            <article className="card p-6">
              <h2 className="text-xl font-semibold text-stone-900 flex items-center gap-2">
                <Truck className="h-5 w-5" /> Shipping
              </h2>
              <p className="mt-3 text-stone-700">
                Please see the{" "}
                <a href="/shipping-returns" className="underline">
                  Shipping & Returns
                </a>{" "}
                page for full details. Kelsey’s Crochet is not responsible for delays once
                an order is in the carrier’s hands.
              </p>
            </article>

            <article className="card p-6">
              <h2 className="text-xl font-semibold text-stone-900 flex items-center gap-2">
                <RefreshCcw className="h-5 w-5" /> Returns & Refunds
              </h2>
              <p className="mt-3 text-stone-700">
                Returns are accepted as outlined in the Shipping & Returns policy. Custom
                or personalized orders are non-refundable unless defective. Buyers are
                responsible for return shipping costs unless otherwise agreed.
              </p>
            </article>

            <article className="card p-6">
              <h2 className="text-xl font-semibold text-stone-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5" /> Customer Responsibilities
              </h2>
              <p className="mt-3 text-stone-700">
                Customers must provide accurate shipping and contact details. Failure to do
                so may cause delays or non-delivery. Please follow the{" "}
                <a href="/care-guide" className="underline">
                  Care Guide
                </a>{" "}
                to extend the life of your items.
              </p>
            </article>

            <article className="card p-6">
              <h2 className="text-xl font-semibold text-stone-900 flex items-center gap-2">
                <FileText className="h-5 w-5" /> Intellectual Property
              </h2>
              <p className="mt-3 text-stone-700">
                All website content, product designs, photos, and text are the property of
                Kelsey’s Crochet. They may not be copied, redistributed, or resold without
                permission.
              </p>
            </article>

            <article className="card p-6">
              <h2 className="text-xl font-semibold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" /> Limitation of Liability
              </h2>
              <p className="mt-3 text-stone-700">
                While every effort is made to provide high-quality handmade goods, Kelsey’s
                Crochet is not liable for incidental damages, misuse, or failure to follow
                care instructions.
              </p>
            </article>
          </section>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-stone-600 text-sm">
              Last updated: {new Date().getFullYear()}
            </p>
            <p className="text-stone-500 text-xs mt-2">
              Questions about these Terms?{" "}
              <a href="/#contact" className="underline">
                Contact me here
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
