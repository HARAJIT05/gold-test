import { motion } from "motion/react";

export default function About() {
  return (
    <div>
      <div className="py-24 text-center bg-navy-900 border-b border-white/5">
        <h1 className="text-4xl md:text-5xl font-serif text-white leading-[1.1] mb-4">Our Heritage</h1>
        <div className="w-16 h-[1px] bg-gold-400 mx-auto"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-none text-white"
        >
          <div className="border-l-2 border-gold-400 pl-8 py-2 mx-auto max-w-2xl mb-16">
            <p className="text-2xl leading-relaxed font-serif italic text-white/80">
              "Established in 1992 under the visionary leadership of Mr. Naba Kumar Shaw,
              NABA GOLD has grown into a distinguished name in gold manufacturing and wholesale.
              With over three decades of excellence, we have built a legacy defined by
              craftsmanship, precision, and trust."
            </p>
          </div>

          <div className="my-24 grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gold-400/10 rounded-2xl -rotate-3 transform origin-bottom-left"></div>
              <img
                src="/craftmen.jpeg"
                alt="Our Workshop"
                className="relative rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-[8px] border-navy-900 z-10 w-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="pl-0 md:pl-8">
              <h3 className="text-3xl font-serif text-white mb-6 leading-tight">Excellence in Craftsmanship</h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-400">
                At our state-of-the-art manufacturing facility, a team of 100+ skilled goldsmiths
                meticulously crafts 22K gold, ensuring exceptional quality, purity, and attention to
                detail in every creation.</p>
              <p className="text-sm leading-relaxed text-gray-400">
                In addition to our exclusive range of ready designs, we also offer bespoke gold
                manufacturing services tailored to meet our clients' unique requirements. Every
                order is executed with accuracy, aligning perfectly with the desired design and
                specifications.              </p>
            </div>
          </div>

          <div className="my-24 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 pr-0 md:pr-8">
              <h3 className="text-3xl font-serif text-white mb-6 leading-tight">Crafted with Purity</h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-400">
                Guided by our core values of trust, superior quality, and reliable service, we
                continue to stand as a dependable and long-term business partner in the world of
                fine gold craftsmanship.              </p>
              <p className="text-sm leading-relaxed text-gray-400">
              </p>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="absolute inset-0 bg-gold-400/10 rounded-2xl rotate-3 transform origin-bottom-right"></div>
              <img
                src="/purity.jpeg"
                alt="Redlands EDX 3000 – Gold Purity Spectrometer"
                className="relative rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-[8px] border-navy-900 z-10 w-full object-contain bg-white"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Our Branches / Map Section ── */}
      <section className="py-24 px-6 lg:px-16 border-t border-white/5 bg-navy-900/30">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-[10px] px-3 py-1 rounded-full border border-gold-400 text-gold-400 uppercase tracking-widest mb-4 inline-block">
              Visit Us
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-bold mb-3">Our Branches</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Two conveniently located showrooms in Kalyan, Mumbai — ready to serve you.
            </p>
            <div className="w-20 h-[2px] bg-gold-400 mx-auto rounded mt-5" />
          </motion.div>

          {/* Branch cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* ── Branch 1: Kalyan East ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-3xl overflow-hidden border border-white/10 bg-navy-900 shadow-xl"
            >
              {/* Map */}
              <div className="relative h-64 md:h-72 bg-navy-800">
                <iframe
                  title="Naba Gold – Kalyan Branch"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1910221.2216378604!2d71.8260152!3d20.7548135!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be79500307049df%3A0x513619e07a148e3!2sRajguru%20niwas!5e0!3m2!1sen!2sin!4v1777052282068!5m2!1sen!2sin"
                  style={{ filter: 'grayscale(0.7) contrast(1.1) brightness(0.75)', display: 'block' }}
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                {/* Gradient fade at bottom */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-navy-900 via-transparent to-transparent" />
                {/* Branch badge */}
                <div className="absolute top-4 left-4 bg-navy-950/80 backdrop-blur-sm border border-gold-400/30 text-gold-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                  Branch 01
                </div>
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <h3 className="font-serif text-xl text-white font-bold mb-1">Kalyan Branch</h3>
                  <p className="text-[10px] uppercase tracking-widest text-gold-400 font-bold">Main Branch</p>
                </div>
                <div className="h-[1px] bg-white/5" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Address</p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Rajguru Niwas, Room No 4,<br />
                      Jijamata Colony, Narayanwadi,<br />
                      Kalyan (West), Pin – 421301
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Contact</p>
                    <a href="tel:+919892242785" className="text-gold-400 text-xs font-bold hover:text-gold-300 transition-colors block">
                      +91 98922 42785
                    </a>
                    <a href="tel:+919932281366" className="text-gold-400 text-xs font-bold hover:text-gold-300 transition-colors block">
                      +91 99322 81366
                    </a>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1 mt-3">Hours</p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      10:00 am – 3:00 pm<br />
                      4:00 pm – 10:00 pm<br />
                      <span className="text-white/30">Tuesday: 10:00 am – 3:00 pm only</span>
                    </p>
                  </div>
                </div>
                <a
                  href="https://maps.app.goo.gl/1K3iToLCCEd5mMD16"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-navy-950 bg-gold-400 hover:bg-gold-500 transition-colors px-5 py-2.5 rounded-full w-fit"
                >
                  Get Directions →
                </a>
              </div>
            </motion.div>

            {/* ── Branch 2: Kalyan West ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl overflow-hidden border border-white/10 bg-navy-900 shadow-xl"
            >
              {/* Map */}
              <div className="relative h-64 md:h-72 bg-navy-800">
                <iframe
                  title="Naba Gold – Mumbai Branch"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src="https://maps.google.com/maps?width=100%&height=400&hl=en&q=307+OM+Golden+Building+Shaikh+Memon+Street+Kalbadevi+Mumbai+400002&ie=UTF8&t=&z=16&iwloc=B&output=embed"
                  style={{ filter: 'grayscale(0.7) contrast(1.1) brightness(0.75)', display: 'block' }}
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-navy-900 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 bg-navy-950/80 backdrop-blur-sm border border-gold-400/30 text-gold-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                  Branch 02
                </div>
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <h3 className="font-serif text-xl text-white font-bold mb-1">Mumbai Branch </h3>
                  <p className="text-[10px] uppercase tracking-widest text-gold-400 font-bold">Second Branch</p>
                </div>
                <div className="h-[1px] bg-white/5" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Address</p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      307, OM Golden Building,<br />
                      Shaikh Memon Street,<br />
                      Kalbadevi, Mumbai – 400002
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Contact</p>
                    <a href="tel:+919892242785" className="text-gold-400 text-xs font-bold hover:text-gold-300 transition-colors block">
                      +91 98922 42785
                    </a>
                    <a href="tel:+919932281366" className="text-gold-400 text-xs font-bold hover:text-gold-300 transition-colors block">
                      +91 99322 81366
                    </a>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1 mt-3">Hours</p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      10:00 am – 3:00 pm<br />
                      4:00 pm – 10:00 pm<br />
                      <span className="text-white/30">Tuesday: 10:00 am – 3:00 pm only</span>
                    </p>
                  </div>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=307+OM+Golden+Building+Shaikh+Memon+Street+Kalbadevi+Mumbai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-navy-950 bg-gold-400 hover:bg-gold-500 transition-colors px-5 py-2.5 rounded-full w-fit"
                >
                  Get Directions →
                </a>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
