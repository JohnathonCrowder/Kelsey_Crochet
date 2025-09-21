import { useState } from "react";
import { Mail, Phone, Instagram } from "lucide-react";

type ContactProps = {
  name?: string;
  email: string;
  phone: string;
  instagram: string;
};

export default function Contact({
  name = "Kelsey",
  email,
  phone,
  instagram,
}: ContactProps) {
  return (
    <section id="contact" className="section bg-white/60">
      <div className="container-max">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left: Contact Info */}
          <div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight text-petal-900">
              Start a Custom Order
            </h2>
            <p className="text-stone-600 mt-3 max-w-prose">
              Prefer Instagram or a quick call? Use whatever’s easiest.
            </p>

            <div className="mt-6 space-y-3">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 nav-link"
              >
                <Mail className="h-5 w-5" /> {email}
              </a>
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-3 nav-link"
              >
                <Phone className="h-5 w-5" /> {phone}
              </a>
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 nav-link"
              >
                <Instagram className="h-5 w-5" /> Instagram
              </a>
            </div>

            <div className="soft-divider mt-8" />
            <p className="mt-6 text-sm text-stone-500">
              100% frontend site—no server needed. The form opens your email app
              with details pre-filled.
            </p>
          </div>

          {/* Right: Contact Form */}
          <ContactForm defaultTo={email} />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- */
/* Contact Form Component            */
/* --------------------------------- */
type ContactFormProps = { defaultTo: string };

function ContactForm({ defaultTo }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend = name.trim() && email.includes("@") && message.trim();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!canSend) {
      setError("Please fill out name, a valid email, and your message.");
      return;
    }
    const subject = encodeURIComponent(`Crochet Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    const href = `mailto:${defaultTo}?subject=${subject}&body=${body}`;
    window.location.href = href;
    setSent(true);
  }

  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold">Send a Message</h3>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div>
          <label className="label" htmlFor="name">
            Your Name
          </label>
          <input
            id="name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Your Email
          </label>
          <input
            id="email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label className="label" htmlFor="message">
            What would you like made?
          </label>
          <textarea
            id="message"
            className="input min-h-[140px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your idea, colors, size, and any deadlines..."
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <button type="submit" className="btn btn-primary">
            Open Email App
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              const text = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
              navigator.clipboard.writeText(text);
              alert("Copied message to clipboard. You can paste it into any app.");
            }}
          >
            Copy Message
          </button>
        </div>

        {sent && (
          <p className="text-sm text-emerald-700">
            Your email app should be open with a pre-filled message. If not, use
            “Copy Message” and send manually.
          </p>
        )}
      </form>

      {/* Optional integration guidance */}
      <details className="mt-6">
        <summary className="cursor-pointer text-sm text-stone-600">
          Optional: Use Formspree or EmailJS (no server)
        </summary>
        <div className="mt-3 text-sm text-stone-600 space-y-2">
          <p>
            <strong>Formspree:</strong> Replace the onSubmit with a{" "}
            <code>fetch("https://formspree.io/f/yourid")</code> POST using JSON
            or FormData.
          </p>
          <p>
            <strong>EmailJS:</strong> Install <code>emailjs-com</code>, add your
            public key, and call <code>emailjs.send(...)</code> in onSubmit.
          </p>
        </div>
      </details>
    </div>
  );
}
