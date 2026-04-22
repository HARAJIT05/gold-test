import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { useGoldRate } from "../hooks/useGoldRate";

export default function Home() {
  const { rate } = useGoldRate();

  return (
    <div>
      {/* Hero Section */}
      <section className="px-6 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center min-h-[540px] py-12 md:py-0">
        
        {/* Left Content */}
        <div className="col-span-1 md:col-span-5 flex flex-col gap-6">
          <span className="text-[10px] px-3 py-1 rounded-[100px] border border-gold-400 text-gold-400 uppercase tracking-[1px] w-fit">
            Artisanal Manufacturing
          </span>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-5xl md:text-6xl leading-[1.1] mb-2 text-white">
              Heritage Craft, <br/><span className="italic font-light opacity-80">Modern Precision.</span>
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm mb-4">
              Bespoke gold jewelry direct from the Karigar. Our dynamic pricing engine ensures you pay the true market value based on daily rates.
            </p>
            <div className="flex items-center gap-6 mt-4">
              <Link to="/catalog" className="inline-flex items-center justify-center bg-gold-400 text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold-500 transition-colors">
                Browse Catalog
              </Link>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase opacity-50 font-bold tracking-tighter text-white">Starting from</span>
                <span className="font-serif text-xl text-white">₹24,500</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center / Image Area */}
        <div className="col-span-1 md:col-span-4 relative flex justify-center">
           <div className="w-full h-[500px] bg-navy-800 overflow-hidden border-[12px] border-navy-900 shadow-[0_10px_30px_rgba(0,0,0,0.05)] rounded-[400px_400px_0_0] relative flex items-center justify-center">
              <img src={rate.homeConfig?.heroImage || "https://picsum.photos/seed/goldbangle/800/800"} alt="Collection" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="relative z-10 text-center px-12 bg-black/10 inset-0 absolute flex flex-col items-center justify-center">
                <div className="text-6xl mb-4 text-white opacity-40">✧</div>
                <p className="font-serif italic text-lg text-white opacity-90 px-4 text-center shadow-sm drop-shadow-md">Handcrafted Filigree Bangle Collection</p>
              </div>
           </div>

           {/* Price Card widget */}
           <div className="absolute -bottom-6 -right-4 md:-right-10 bg-navy-900 border border-gold-400/20 shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-6 rounded-2xl w-64 z-10 hidden sm:block">
              <div className="flex justify-between items-start mb-4">
                <span className="font-bold text-xs uppercase tracking-tighter text-white">Price Calculator</span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <div className="space-y-2 text-xs text-white">
                <div className="flex justify-between"><span className="opacity-60">Weight (12g)</span><span>₹77,100</span></div>
                <div className="flex justify-between"><span className="opacity-60">Making (15%)</span><span>₹11,565</span></div>
                <div className="border-t border-dashed border-gray-200 mt-2 pt-2 flex justify-between font-bold text-sm">
                  <span className="text-gold-400">Final Quote</span>
                  <span className="text-gold-400">₹88,665</span>
                </div>
              </div>
           </div>
        </div>

        {/* Right Info List Area */}
        <div className="col-span-1 md:col-span-3 space-y-6 md:pl-8 mt-12 md:mt-0">
          <div className="border-l-2 border-gold-400 pl-6 py-2">
            <h3 className="font-serif text-xl italic mb-1 text-white">The Karigar Legacy</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Third-generation masters in 22k filigree and temple jewelry work.
            </p>
          </div>
          <div className="bg-navy-900/50 p-5 rounded-xl border border-black/5 shadow-sm">
            <div className="flex gap-1 text-xs text-yellow-500 mb-2">★★★★★</div>
            <p className="text-xs italic leading-snug text-white opacity-80">
              "The finish on the bridal set was impeccable. The live pricing transparency is unmatched in the market."
            </p>
            <div className="mt-3 text-[10px] font-bold opacity-40 uppercase text-white">
              — Priya Sharma, Mumbai
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold tracking-widest opacity-80 uppercase pt-4 text-white">
            <div className="w-10 h-[1px] bg-black"></div> Scroll For Portfolio
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-transparent mt-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-white font-bold mb-4">Featured Collections</h2>
            <div className="w-24 h-1 bg-gold-400 mx-auto rounded"></div>
          </div>
          
          {/* Featured items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => {
               const featuredKey = `featuredImage${i}` as keyof typeof rate.homeConfig;
               const imageUrl = rate.homeConfig?.[featuredKey] || `https://picsum.photos/seed/jewelry${i}/600/600`;
               
               return (
                <div key={i} className="bg-navy-900 rounded-lg shadow-md overflow-hidden group cursor-pointer border border-gray-100">
                  <div className="aspect-square bg-navy-800 relative overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt="Featured Collection" 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-gold-100 text-gold-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      Popular
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-serif text-xl text-white mb-2">Exquisite Bangle</h3>
                    <Link to="/catalog" className="text-gold-500 font-medium hover:text-gold-600 transition-colors inline-block mt-2">
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-16 text-center">
             <Link to="/catalog" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-navy-900 text-gold-100 font-medium rounded hover:bg-navy-800 transition-colors">
               View Full Collection
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
