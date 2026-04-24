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
              NABA has grown into a distinguished name in gold manufacturing and wholesale.
              With over three decades of excellence, we have built a legacy defined by
              craftsmanship, precision, and trust."
            </p>
          </div>

          <div className="my-24 grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gold-400/10 rounded-2xl -rotate-3 transform origin-bottom-left"></div>
              <img
                src="https://picsum.photos/seed/workshop/800/600"
                alt="Our Workshop"
                className="relative rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-[8px] border-navy-900 z-10 w-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="pl-0 md:pl-8">
              <h3 className="text-3xl font-serif text-white mb-6 leading-tight">The Karigar's Mark</h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-400">
                At our state-of-the-art manufacturing facility, a team of 100+ skilled goldsmiths
                meticulously crafts 22K gold, ensuring exceptional quality, purity, and attention to
                detail in every creation.              </p>
              <p className="text-sm leading-relaxed text-gray-400">
                In addition to our exclusive range of ready designs, we also offer bespoke gold
                manufacturing services tailored to meet our clients’ unique requirements. Every
                order is executed with accuracy, aligning perfectly with the desired design and
                specifications.              </p>
            </div>
          </div>

          <div className="my-24 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 pr-0 md:pr-8">
              <h3 className="text-3xl font-serif text-white mb-6 leading-tight">Purity Guarantee</h3>
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
                src="https://picsum.photos/seed/purity/800/600"
                alt="Purity Testing"
                className="relative rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-[8px] border-navy-900 z-10 w-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
