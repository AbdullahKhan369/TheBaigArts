import PublicLayout from '../../components/layout/PublicLayout'
import SEO from '../../components/layout/SEO'

export default function About() {
  return (
    <PublicLayout>
      <SEO
        title="About"
        description="The story behind The Baigarts — a Pakistan-based artist creating original, handmade paintings."
        path="/about"
      />

      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <p className="wall-label text-brass">The Artist</p>
        <h1 className="mt-4 font-display text-3xl text-ivory sm:text-4xl">About The Baigarts & The Artist </h1>

        <div className="mt-8 space-y-5 leading-relaxed text-ivory-dim">

          <p>
            Hi, I’m Imran Baig.

            I’m not a professional artist by profession, but I’ve loved drawing ever since my school days. During the COVID-19 lockdown, when everyone was staying at home, I found myself looking for something creative to do. That’s when I decided to turn my passion for drawing into painting.

            What started as a way to spend my time gradually became a passion. With practice and dedication, my skills and creativity have improved day by day. 
            <br></br>
            <br></br>

            I often find paintings online for inspiration and challenge myself to recreate them by hand, adding my own effort and creativity to every piece. I mainly work with crayon colors and acrylic paints, creating artwork on both canvas and paper.

            For me, every painting is more than just colors on a surface — it is a reflection of passion, patience, and the joy of creating something with my own hands.
          </p>
          <p>
            THE BAIGARTS is the work of a single artist, painting by hand, one canvas at a
            time. There is no studio team, no production line — every piece you see in the
            gallery came from the same set of hands, start to finish.
          </p>
          <p>
            The focus stays narrow on purpose: original paintings, made once, sold once. When
            a piece is gone, it stays gone — no reprints, no editions, no copies.
          </p>

        </div>
      </section>
    </PublicLayout>
  )
}
