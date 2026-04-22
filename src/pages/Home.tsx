import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ChevronLeft, ChevronRight, Award, Shield, Gem } from "lucide-react";
import { useGoldRate } from "../hooks/useGoldRate";
import { supabase } from "../lib/supabase";

/* ── Skeleton shimmer ── */
const Sk = ({ className = "" }: { className?: string; key?: number | string }) => (
  <div className={`relative overflow-hidden rounded bg-navy-800 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent ${className}`} />
);


/* ── Types ── */
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

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: number;
}

/* ── Component ── */
export default function Home() {
  const { rate } = useGoldRate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Carousel state
  const slides = rate.homeConfig?.heroSlides ?? [];
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  // Hero full-screen: use the first slide's image
  const heroSlide = slides[0];

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setDirection(1);
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    if (activeSlide >= slides.length && slides.length > 0) setActiveSlide(0);
  }, [slides.length, activeSlide]);

  const goToSlide = (index: number) => { setDirection(index > activeSlide ? 1 : -1); setActiveSlide(index); };
  const prevSlide = () => { setDirection(-1); setActiveSlide(prev => (prev - 1 + slides.length) % slides.length); };
  const nextSlide = () => { setDirection(1); setActiveSlide(prev => (prev + 1) % slides.length); };

  useEffect(() => {
    supabase
      .from("products")
      .select("id,title,category,images,weightInGrams,makingCharge,chargeType,goldKarat,popularityScore,isHidden,isOutofStock")
      .eq("isHidden", false)
      .order("popularityScore", { ascending: false })
      .order("createdAt", { ascending: false })
      .limit(3)
      .then(({ data }) => { if (data) setFeaturedProducts(data as Product[]); setLoadingFeatured(false); });
  }, []);

  useEffect(() => {
    supabase
      .from("reviews")
      .select("id,customerName,rating,comment,createdAt")
      .eq("isApproved", true)
      .order("createdAt", { ascending: false })
      .limit(3)
      .then(({ data }) => { if (data) setReviews(data as Review[]); setLoadingReviews(false); });
  }, []);

  const calcPrice = (p: Product) => {
    const baseRate = p.goldKarat === "24K" ? rate.rate24k : rate.rate22k;
    const base = p.weightInGrams * baseRate;
    return Math.round(base + (p.chargeType === "flat" ? p.makingCharge : (base * p.makingCharge) / 100));
  };

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
  };

  const activeSlideData = slides[activeSlide];

  return (
    <div className="bg-navy-950">

      {/* ═══════════════════════════════════════════════════
          1. FULL-SCREEN HERO
      ═══════════════════════════════════════════════════ */}
      <section className="relative w-full md:h-dvh md:min-h-[500px] md:max-h-[1000px] overflow-hidden bg-navy-950">
        {heroSlide?.image ? (
          <>
            <img
              src={heroSlide.image}
              alt=""
              className="w-full h-auto md:h-full md:object-cover md:object-center"
              referrerPolicy="no-referrer"
            />
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-navy-950 to-transparent" />
          </>
        ) : (
          <div className="w-full h-[60vw] md:h-full bg-navy-900 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
          </div>

        )}
      </section>




      {/* ═══════════════════════════════════════════════════
          2. SHORT ABOUT US
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left — quote */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <span className="text-[10px] px-3 py-1 rounded-full border border-gold-400 text-gold-400 uppercase tracking-widest mb-6 inline-block">
                Est. 1992 · Kalyan, Mumbai
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-white leading-snug mb-6">
                Third-generation masters of 22K filigree and temple jewelry.
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-md">
                Since 1992, NABA has been a cornerstone of trust, purity, and unparalleled craftsmanship. Every piece tells a story of dedication — sculpted by hand, priced with total transparency.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-xs font-bold uppercase tracking-widest transition-colors group"
              >
                Discover Our Heritage <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Right — stat cards */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <Award className="w-5 h-5 text-gold-400" />, num: "30+", label: "Years of Craft" },
                { icon: <Gem className="w-5 h-5 text-gold-400" />, num: "500+", label: "Unique Designs" },
                { icon: <Shield className="w-5 h-5 text-gold-400" />, num: "100%", label: "Hallmarked Purity" },
              ].map(({ icon, num, label }) => (
                <div key={label} className="bg-navy-900 border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center gap-3 hover:border-gold-400/20 transition-colors">
                  {icon}
                  <span className="font-serif text-3xl font-bold text-white">{num}</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. CAROUSEL
      ═══════════════════════════════════════════════════ */}
      {slides.length > 0 && (
        <section className="relative overflow-hidden min-h-[480px] md:min-h-[560px] border-t border-white/5">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={activeSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="relative w-full min-h-[480px] md:min-h-[560px]"
            >
              {/* Mobile background image */}
              <div className="md:hidden absolute inset-0 z-0">
                {activeSlideData?.image
                  ? <img src={activeSlideData.image} alt={activeSlideData.heading} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  : <div className="w-full h-full bg-navy-900" />
                }
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/20" />
              </div>

              {/* Desktop image — right bleed */}
              {activeSlideData?.image && (
                <div className="hidden md:block absolute inset-y-0 right-0 w-[55%] z-0 pointer-events-none">
                  <img src={activeSlideData.image} alt={activeSlideData.heading} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-navy-950/30 via-transparent to-navy-950/30" />
                </div>
              )}

              {/* Text content */}
              <div className="relative z-10 px-6 lg:px-16 grid grid-cols-1 md:grid-cols-12 items-center min-h-[480px] md:min-h-[560px] py-20 md:py-0">
                <div className="col-span-1 md:col-span-6 flex flex-col gap-5 mt-auto md:mt-0">
                  {activeSlideData?.badge && (
                    <span className="text-[10px] px-3 py-1 rounded-full border border-gold-400 text-gold-400 uppercase tracking-widest w-fit">
                      {activeSlideData.badge}
                    </span>
                  )}
                  <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] text-white drop-shadow-md">
                    {activeSlideData?.heading}
                  </h2>
                  <p className="text-sm text-gray-300 md:text-gray-400 leading-relaxed max-w-sm drop-shadow">
                    {activeSlideData?.subheading}
                  </p>
                  {activeSlideData?.ctaText && (
                    <Link to={activeSlideData.ctaLink || "/catalog"} className="inline-flex items-center gap-2 bg-gold-400 text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold-500 transition-colors w-fit shadow-lg">
                      {activeSlideData.ctaText} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          {slides.length > 1 && (
            <>
              <button onClick={prevSlide} className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-navy-900/80 border border-white/10 flex items-center justify-center text-white hover:border-gold-400/40 transition-all z-20 backdrop-blur-sm" aria-label="Previous slide">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={nextSlide} className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-navy-900/80 border border-white/10 flex items-center justify-center text-white hover:border-gold-400/40 transition-all z-20 backdrop-blur-sm" aria-label="Next slide">
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Dots */}
          {slides.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {slides.map((_, idx) => (
                <button key={idx} onClick={() => goToSlide(idx)} aria-label={`Slide ${idx + 1}`}
                  className={`rounded-full transition-all duration-300 ${idx === activeSlide ? "bg-gold-400 w-6 h-2" : "bg-white/30 w-2 h-2 hover:bg-white/60"}`}
                />
              ))}
            </div>
          )}
          {slides.length > 1 && (
            <div className="absolute bottom-5 right-5 text-[10px] font-bold text-white/25 z-20 hidden md:block">
              {activeSlide + 1} / {slides.length}
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          4. FEATURED COLLECTION
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] px-3 py-1 rounded-full border border-gold-400 text-gold-400 uppercase tracking-widest mb-4 inline-block">Live Pricing</span>
            <h2 className="text-3xl md:text-4xl font-serif text-white font-bold mb-3">Featured Collection</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">Our most sought-after pieces, priced at today's live gold rate.</p>
            <div className="w-20 h-[2px] bg-gold-400 mx-auto rounded mt-5" />
          </div>

          {/* Loading skeletons */}
          {loadingFeatured && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[0, 1, 2].map(i => (
                <div key={i} className="bg-navy-900 rounded-2xl overflow-hidden border border-white/5">
                  <Sk className="aspect-square w-full rounded-none" />
                  <div className="p-6 space-y-3">
                    <Sk className="h-5 w-3/4" />
                    <Sk className="h-3 w-1/2" />
                    <div className="flex justify-between pt-2">
                      <Sk className="h-6 w-1/3" />
                      <Sk className="h-4 w-12" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loadingFeatured && featuredProducts.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
              <p className="text-gray-500 text-sm">No products yet — check back soon.</p>
            </div>
          )}

          {!loadingFeatured && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product, idx) => {
                const imageUrl = product.images?.[0];
                const price = rate.rate22k > 0 ? calcPrice(product) : null;
                return (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.12 }}>
                    <Link to="/catalog" state={{ openProductId: product.id }} className="block bg-navy-900 rounded-2xl overflow-hidden group border border-white/5 hover:border-gold-400/30 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
                      <div className="aspect-square bg-navy-800 relative overflow-hidden">
                        {imageUrl ? (
                          <img src={imageUrl} alt={product.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                        ) : (
                          /* Skeleton placeholder when no image uploaded */
                          <div className="w-full h-full bg-navy-800 relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
                            <span className="text-white/10 text-xs font-bold uppercase tracking-widest">No Image</span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4 flex gap-2">
                          {product.popularityScore > 0 && (
                            <span className="bg-gold-400 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                              <Star className="w-3 h-3 fill-white" /> Popular
                            </span>
                          )}
                          {product.isOutofStock && <span className="bg-white/90 text-amber-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Out of Stock</span>}
                        </div>
                        <div className="absolute bottom-4 right-4 bg-navy-950/80 backdrop-blur-sm text-white/70 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                          {product.category}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-serif text-lg text-white mb-1 group-hover:text-gold-400 transition-colors">{product.title}</h3>
                        <p className="text-xs text-gray-500 mb-4">{product.weightInGrams}g · {product.goldKarat || "22K"} Gold</p>
                        <div className="flex items-center justify-between">
                          {price ? <span className="text-gold-400 font-bold text-lg font-serif">₹{price.toLocaleString("en-IN")}</span> : <span className="text-gray-500 text-xs">Rate loading…</span>}
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold-400 group-hover:gap-2 transition-all">View <ArrowRight className="w-3 h-3" /></span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="mt-14 text-center">
            <Link to="/catalog" className="inline-flex items-center gap-2 px-8 py-3.5 bg-navy-900 border border-white/10 text-white font-medium rounded-full hover:bg-navy-800 hover:border-gold-400/30 transition-all text-sm">
              View Full Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          5. TESTIMONIALS
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/5 bg-navy-900/40">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[10px] px-3 py-1 rounded-full border border-gold-400 text-gold-400 uppercase tracking-widest mb-4 inline-block">Client Stories</span>
            <h2 className="text-3xl md:text-4xl font-serif text-white font-bold mb-3">What Our Clients Say</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">Hear from the people who wear our craftsmanship every day.</p>
            <div className="w-20 h-[2px] bg-gold-400 mx-auto rounded mt-5" />
          </div>

          {/* Loading skeletons */}
          {loadingReviews && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[0, 1, 2].map(i => (
                <div key={i} className="bg-navy-900 p-7 rounded-2xl border border-white/5 flex flex-col gap-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => <Sk key={j} className="w-3.5 h-3.5 rounded-full" />)}
                  </div>
                  <Sk className="h-3 w-full" />
                  <Sk className="h-3 w-5/6" />
                  <Sk className="h-3 w-4/6" />
                  <div className="mt-auto pt-4 border-t border-white/5 flex justify-between">
                    <Sk className="h-3 w-24" />
                    <Sk className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loadingReviews && reviews.length === 0 && (
            <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl mb-10">
              <p className="text-gray-500 text-sm">No reviews yet.</p>
              <Link to="/reviews" className="text-gold-400 text-xs font-bold uppercase tracking-widest mt-3 inline-block hover:text-gold-300">Be the first →</Link>
            </div>
          )}

          {!loadingReviews && reviews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {reviews.map((review, idx) => (
                <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="bg-navy-900 p-7 rounded-2xl border border-white/5 flex flex-col hover:border-gold-400/15 transition-colors">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-gold-400 text-gold-400" : "text-white/15"}`} />
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-white/75 italic text-sm leading-relaxed flex-1 mb-5">"{review.comment}"</p>
                  {/* Author */}
                  <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                    <p className="font-bold text-[10px] uppercase tracking-widest text-white/40">— {review.customerName}</p>
                    <p className="text-[10px] text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short" })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* CTA to full reviews page */}
          <div className="text-center">
            <Link to="/reviews" className="inline-flex items-center gap-2 px-8 py-3.5 bg-navy-900 border border-white/10 text-white font-medium rounded-full hover:bg-navy-800 hover:border-gold-400/30 transition-all text-sm group">
              Read All Reviews & Leave Yours <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
