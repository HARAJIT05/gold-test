import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useGoldRate } from "../hooks/useGoldRate";
import { supabase } from "../lib/supabase";

interface Product {
  id: string;
  title: string;
  category: string;
  images: string[];
  weightInGrams: number;
  makingCharge: number;
  chargeType: "flat" | "percentage";
  goldKarat: "22K" | "24K";
  popularityScore: number;
  isHidden: boolean;
  isOutofStock: boolean;
}

export default function Home() {
  const { rate } = useGoldRate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const slides = rate.homeConfig?.heroSlides ?? [];

  // Auto-play timer — only runs when there are multiple slides
  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setDirection(1);
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  // Reset to first slide if slides list shrinks
  useEffect(() => {
    if (activeSlide >= slides.length && slides.length > 0) {
      setActiveSlide(0);
    }
  }, [slides.length, activeSlide]);

  const goToSlide = (index: number) => {
    setDirection(index > activeSlide ? 1 : -1);
    setActiveSlide(index);
  };

  const prevSlide = () => {
    setDirection(-1);
    setActiveSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setDirection(1);
    setActiveSlide(prev => (prev + 1) % slides.length);
  };

  useEffect(() => {
    async function fetchFeatured() {
      setLoadingFeatured(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, title, category, images, weightInGrams, makingCharge, chargeType, goldKarat, popularityScore, isHidden, isOutofStock")
          .eq("isHidden", false)
          .order("popularityScore", { ascending: false })
          .order("createdAt", { ascending: false })
          .limit(3);

        if (data) setFeaturedProducts(data as Product[]);
        if (error) console.warn("Failed to load featured products:", error);
      } finally {
        setLoadingFeatured(false);
      }
    }
    fetchFeatured();
  }, []);

  // Karat-aware price
  const calcPrice = (p: Product) => {
    const karat = p.goldKarat || "22K";
    const baseRate = karat === "24K" ? rate.rate24k : rate.rate22k;
    const base = p.weightInGrams * baseRate;
    const making = p.chargeType === "flat" ? p.makingCharge : (base * p.makingCharge) / 100;
    return Math.round(base + making);
  };

  // Slide animation variants
  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
  };

  const activeSlideData = slides[activeSlide];

  return (
    <div>
      {/* ── Hero Carousel ───────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[480px] md:min-h-[580px]">

        {slides.length === 0 ? (
          /* Fallback when no slides configured */
          <div className="px-6 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center min-h-[480px] md:min-h-[580px] py-16 md:py-0">
            <div className="col-span-1 md:col-span-5 flex flex-col gap-6">
              <span className="text-[10px] px-3 py-1 rounded-full border border-gold-400 text-gold-400 uppercase tracking-widest w-fit">
                Artisanal Manufacturing
              </span>
              <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] text-white">
                Heritage Craft,{" "}
                <span className="italic font-light opacity-80">Modern Precision.</span>
              </h1>
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                Bespoke gold jewelry direct from the Karigar. Live pricing, pure craftsmanship.
              </p>
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center bg-gold-400 text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold-500 transition-colors w-fit"
              >
                Browse Catalog
              </Link>
            </div>
            <div className="col-span-1 md:col-span-5 hidden md:block">
              <div className="w-full h-[500px] bg-navy-800 rounded-[400px_400px_0_0] overflow-hidden">
                <img
                  src="https://picsum.photos/seed/goldbangle/800/800"
                  alt="Gold Jewelry"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={activeSlide}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="relative w-full min-h-[480px] md:min-h-[580px]"
              >
                {/* ── MOBILE: full-bleed background image with overlay ── */}
                <div className="md:hidden absolute inset-0 z-0">
                  {activeSlideData?.image ? (
                    <img
                      src={activeSlideData.image}
                      alt={activeSlideData?.heading}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <img
                      src="https://picsum.photos/seed/goldbangle/800/800"
                      alt="Gold Jewelry"
                      className="w-full h-full object-cover opacity-40"
                    />
                  )}
                  {/* Dark gradient overlay so text is readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/20" />
                </div>

                {/* ── Shared content grid ── */}
                <div className="relative z-10 px-6 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center min-h-[480px] md:min-h-[580px] py-20 md:py-0">

                  {/* Left / bottom text */}
                  <div className="col-span-1 md:col-span-5 flex flex-col gap-5 mt-auto md:mt-0">
                    {(activeSlideData?.badge) && (
                      <span className="text-[10px] px-3 py-1 rounded-full border border-gold-400 text-gold-400 uppercase tracking-widest w-fit">
                        {activeSlideData.badge}
                      </span>
                    )}
                    <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] text-white drop-shadow-md">
                      {activeSlideData?.heading || "Heritage Craft, Modern Precision."}
                    </h1>
                    <p className="text-sm text-gray-300 md:text-gray-400 leading-relaxed max-w-sm drop-shadow">
                      {activeSlideData?.subheading || "Bespoke gold jewelry direct from the Karigar."}
                    </p>
                    {activeSlideData?.ctaText && (
                      <Link
                        to={activeSlideData.ctaLink || "/catalog"}
                        className="inline-flex items-center justify-center bg-gold-400 text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold-500 transition-colors w-fit shadow-lg"
                      >
                        {activeSlideData.ctaText}
                      </Link>
                    )}
                  </div>

                  {/* Right image — desktop only */}
                  <div className="col-span-1 md:col-span-5 col-start-1 md:col-start-7 hidden md:block">
                    <div className="w-full h-[500px] bg-navy-800 overflow-hidden border-[12px] border-navy-900 shadow-[0_10px_60px_rgba(0,0,0,0.3)] rounded-[400px_400px_0_0] relative">
                      {activeSlideData?.image ? (
                        <img
                          src={activeSlideData.image}
                          alt={activeSlideData.heading}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-navy-800">
                          <img
                            src="https://picsum.photos/seed/goldbangle/800/800"
                            alt="Gold Jewelry"
                            className="w-full h-full object-cover opacity-40"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-white/30 text-sm font-serif italic">No image set</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Nav Arrows */}
            {slides.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-navy-900/80 border border-white/10 flex items-center justify-center text-white hover:bg-navy-800 hover:border-gold-400/40 transition-all z-20 backdrop-blur-sm"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-navy-900/80 border border-white/10 flex items-center justify-center text-white hover:bg-navy-800 hover:border-gold-400/40 transition-all z-20 backdrop-blur-sm"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </>
            )}

            {/* Dot indicators */}
            {slides.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      idx === activeSlide
                        ? "bg-gold-400 w-6 h-2"
                        : "bg-white/30 w-2 h-2 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Slide counter */}
            {slides.length > 1 && (
              <div className="absolute bottom-5 right-5 text-[10px] font-bold uppercase tracking-widest text-white/30 z-20 hidden md:block">
                {activeSlide + 1} / {slides.length}
              </div>
            )}
          </>
        )}
      </section>

      {/* ── Featured Collections ─────────────────────────── */}
      <section className="py-24 bg-transparent mt-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-white font-bold mb-4">Featured Collections</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Our most sought-after pieces, priced live at today's gold rate.
            </p>
            <div className="w-24 h-1 bg-gold-400 mx-auto rounded mt-4"></div>
          </div>

          {loadingFeatured && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
            </div>
          )}

          {!loadingFeatured && featuredProducts.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
              <p className="text-gray-500 text-sm">No products in the catalog yet.</p>
              <p className="text-gray-600 text-xs mt-1">Add items via the Admin Panel and they'll appear here automatically.</p>
            </div>
          )}

          {!loadingFeatured && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product, idx) => {
                const imageUrl = product.images?.[0] || `https://picsum.photos/seed/${product.id}/600/600`;
                const price = rate.rate22k > 0 ? calcPrice(product) : null;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.12 }}
                  >
                    <Link
                      to="/catalog"
                      state={{ openProductId: product.id }}
                      className="block bg-navy-900 rounded-2xl shadow-md overflow-hidden group cursor-pointer border border-white/5 hover:border-gold-400/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
                    >
                      <div className="aspect-square bg-navy-800 relative overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {product.popularityScore > 0 && (
                            <span className="bg-gold-400 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow flex items-center gap-1">
                              <Star className="w-3 h-3 fill-white" /> Popular
                            </span>
                          )}
                          {product.isOutofStock && (
                            <span className="bg-white/90 text-amber-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-4 right-4 bg-navy-950/80 backdrop-blur-sm text-white/70 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          {product.category}
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="font-serif text-lg text-white mb-1 group-hover:text-gold-400 transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-4">
                          {product.weightInGrams}g · {product.goldKarat || "22K"} Gold
                        </p>
                        <div className="flex items-center justify-between">
                          {price ? (
                            <span className="text-gold-400 font-bold text-lg font-serif">
                              ₹{price.toLocaleString("en-IN")}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-xs">Price loading…</span>
                          )}
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold-400 group-hover:gap-2 transition-all">
                            View <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="mt-16 text-center">
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-navy-900 border border-white/10 text-gold-100 font-medium rounded-full hover:bg-navy-800 hover:border-gold-400/30 transition-all"
            >
              View Full Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
