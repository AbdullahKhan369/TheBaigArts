import PublicLayout from '../../components/layout/PublicLayout'
import SEO from '../../components/layout/SEO'

export default function Contact() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER

  return (
    <PublicLayout>
      <SEO
        title="Contact"
        description="Get in touch with The Baigarts about a painting, a commission, or a general question."
        path="/contact"
      />

      <section className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <p className="wall-label text-brass">Get In Touch</p>
        <h1 className="mt-4 font-display text-3xl text-ivory sm:text-4xl">Contact</h1>

        <p className="mt-6 leading-relaxed text-ivory-dim">
          The fastest way to reach us is WhatsApp — message directly about a painting,
          a commission idea, or anything else.
        </p>

        <div className="mt-8 space-y-4">
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-line px-6 py-3 text-sm text-ivory hover:border-brass"
            >
              Message on WhatsApp →
            </a>
          )}
        </div>

        <div className="mt-12 border-t border-line pt-8">
          <p className="wall-label mb-2">Based In</p>
          <p className="text-ivory-dim">Karachi, Pakistan</p>
        </div>
      </section>
    </PublicLayout>
  )
}
