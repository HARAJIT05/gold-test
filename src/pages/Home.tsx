import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ChevronLeft, ChevronRight, Award, Shield, Gem, Users, TrendingUp } from "lucide-react";
import { useGoldRate, DEFAULT_GOLD_SLIDE_CONFIG } from "../hooks/useGoldRate";
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
  goldKarat: "22K";
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
  const heroSlides = rate.homeConfig?.heroSlides ?? [];
  const goldConfig = { ...DEFAULT_GOLD_SLIDE_CONFIG, ...(rate.homeConfig?.goldRateSlides ?? {}) };

  // Gold rate slides always appear FIRST; admin image slides follow
  type SlideType = { type: 'image'; data: typeof heroSlides[0] } | { type: 'rate22k' } | { type: 'rate24k' };
  const allSlides: SlideType[] = [
    ...(goldConfig.show22k ? [{ type: 'rate22k' as const }] : []),
    ...(goldConfig.show24k ? [{ type: 'rate24k' as const }] : []),
    ...heroSlides.map(s => ({ type: 'image' as const, data: s })),
  ];

  // Hero section uses its OWN dedicated image — independent from carousel slides
  const heroImageUrl = rate.homeConfig?.heroImage ?? '';

  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (allSlides.length <= 1) return;
    const id = setInterval(() => {
      setDirection(1);
      setActiveSlide(prev => (prev + 1) % allSlides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [allSlides.length]);

  useEffect(() => {
    if (activeSlide >= allSlides.length && allSlides.length > 0) setActiveSlide(0);
  }, [allSlides.length, activeSlide]);

  const goToSlide = (index: number) => { setDirection(index > activeSlide ? 1 : -1); setActiveSlide(index); };
  const prevSlide = () => { setDirection(-1); setActiveSlide(prev => (prev - 1 + allSlides.length) % allSlides.length); };
  const nextSlide = () => { setDirection(1); setActiveSlide(prev => (prev + 1) % allSlides.length); };

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
    const baseRate = rate.rate22k;
    const base = p.weightInGrams * baseRate;
    return Math.round(base + (p.chargeType === "flat" ? p.makingCharge : (base * p.makingCharge) / 100));
  };

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
  };

  const activeSlideData = allSlides[activeSlide];

  return (
    <div className="bg-navy-950">

      {/* ═══════════════════════════════════════════════════
          1. FULL-SCREEN HERO
      ═══════════════════════════════════════════════════ */}
      <section className="relative w-full bg-navy-950 flex items-center justify-center">
        {heroImageUrl ? (
          <div className="relative w-full">
            <img
              src={heroImageUrl}
              alt=""
              className="w-full h-auto max-h-[60vh] md:max-h-[70vh] lg:max-h-[85vh] xl:max-h-[90vh] object-contain md:object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-t from-navy-950 to-transparent" />
          </div>
        ) : (
          <div className="w-full h-[50vh] md:h-[60vh] lg:h-[70vh] bg-navy-900 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
          </div>
        )}
      </section>




      {/* ═══════════════════════════════════════════════════
          2. SHORT ABOUT US
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — quote */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <span className="text-[10px] px-3 py-1 rounded-full border border-gold-400 text-gold-400 uppercase tracking-widest mb-6 inline-block">
                Est. 1992 · Kalyan, Mumbai
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-white leading-snug mb-6">
                A Trusted Gold Manufacturing & Wholesale Brand.
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-md">
                NABA is a trusted gold manufacturing and wholesale brand with over 30 years of experience. With its own manufacturing unit and skilled goldsmiths, it crafts 22K gold with precision and purity. Along with ready-made products, it also specializes in custom-designed gold as per client requirements, making it a reliable and long-term business partner.              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-xs font-bold uppercase tracking-widest transition-colors group"
              >
                Discover Our Heritage <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Right — stat cards */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="grid grid-cols-2 gap-4">
              {[
                { icon: <Award className="w-5 h-5 text-gold-400" />, num: "30+", label: "Years of Craft" },
                { icon: <Users className="w-5 h-5 text-gold-400" />, num: "100+", label: "Gold Smiths" },
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
      {allSlides.length > 0 && (
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
              {/* ── RATE SLIDES — PREMIUM REDESIGN ── */}
              {(activeSlideData.type === 'rate22k' || activeSlideData.type === 'rate24k') && (() => {
                const is22k = activeSlideData.type === 'rate22k';
                const karat = is22k ? '22K' : '24K';
                const purity = is22k ? '91.6%' : '99.9%';
                const rate_val = is22k ? rate.rate22k : rate.rate24k;
                const isOverride = is22k ? rate.adminRate22k > 0 : rate.adminRate24k > 0;
                const badge = is22k ? goldConfig.badge22k : goldConfig.badge24k;
                const sub = is22k ? goldConfig.sub22k : goldConfig.sub24k;
                // 22K = warm gold palette, 24K = cooler champagne/bright gold
                const accentA = is22k ? 'rgba(212,160,23,0.12)' : 'rgba(255,215,100,0.10)';
                const accentB = is22k ? 'rgba(180,130,10,0.06)' : 'rgba(240,200,80,0.07)';

                // Determine the correct updated time
                let displayDate: Date | null = null;
                if (isOverride && rate.adminLastUpdated) {
                  displayDate = new Date(rate.adminLastUpdated);
                } else if (!isOverride && rate.liveRateInfo?.fetchedAt) {
                  displayDate = rate.liveRateInfo.fetchedAt;
                }
                const displayDateStr = displayDate ? displayDate.toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : '';

                return (
                  <>
                    {/* ── Background ── */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      {/* Base */}
                      <div className="absolute inset-0 bg-navy-950" />

                      {/* Diagonal accent stripe */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(118deg, transparent 52%, ${accentA} 52%, ${accentA} 100%)`,
                        }}
                      />

                      {/* Second diagonal for depth */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(118deg, transparent 58%, ${accentB} 58%, ${accentB} 100%)`,
                        }}
                      />

                      {/* Fine dot-grid texture — only right half */}
                      <div
                        className="absolute right-0 inset-y-0 w-[55%] opacity-20"
                        style={{
                          backgroundImage: `radial-gradient(circle, rgba(212,172,40,0.35) 1px, transparent 1px)`,
                          backgroundSize: '28px 28px',
                        }}
                      />

                      {/* Radial glow */}
                      <div
                        className="absolute right-[15%] top-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full"
                        style={{ background: `radial-gradient(circle, ${accentA} 0%, transparent 70%)` }}
                      />

                      {/* Top-left subtle line accent */}
                      <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-gold-400/20 to-transparent" />
                      <div className="absolute top-8 left-0 w-24 h-[1px] bg-gradient-to-r from-gold-400/30 to-transparent" />
                      <div className="absolute bottom-8 left-0 w-16 h-[1px] bg-gradient-to-r from-gold-400/20 to-transparent" />
                    </div>

                    {/* ── Content ── */}
                    <div className="relative z-10 min-h-[480px] md:min-h-[560px] flex items-center">
                      <div className="w-full px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 py-16 lg:py-0 items-center">

                        {/* LEFT — Typography block */}
                        <div className="flex flex-col gap-5">
                          {/* Top row: badge + live pill */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[9px] px-3 py-1 rounded-full border border-gold-400/60 text-gold-400 uppercase tracking-[3px] font-bold">
                              {badge}
                            </span>
                            {isOverride ? (
                              <span className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                <span className="text-[9px] font-bold uppercase tracking-[2px] text-amber-400">Override</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[9px] font-bold uppercase tracking-[2px] text-emerald-400">Live Market</span>
                              </span>
                            )}
                          </div>

                          {/* Karat type label */}
                          <div className="flex items-baseline gap-3">
                            <span className="font-serif text-6xl md:text-8xl font-bold text-gold-400 leading-none">{karat}</span>
                            <span className="text-xs uppercase tracking-[4px] text-white/40 font-bold self-end pb-2">Gold</span>
                          </div>

                          {/* Rate number — giant */}
                          <div>
                            <div className="flex items-start gap-2">
                              <span className="text-white/30 font-serif text-3xl md:text-4xl pt-3 font-bold">₹</span>
                              <span className="font-serif font-bold text-white leading-none" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>
                                {rate_val > 0 ? rate_val.toLocaleString('en-IN') : (
                                  <span className="text-white/15 text-4xl">—</span>
                                )}
                              </span>
                            </div>
                            <p className="text-xs text-white/30 uppercase tracking-widest mt-1.5 pl-1 flex items-center flex-wrap gap-2">
                              <span>per gram · Indian Rupee</span>
                              {displayDateStr && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
                                  <span className="text-white/40 font-mono tracking-normal normal-case">
                                    Updated: {displayDateStr}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>

                          {/* Gold divider */}
                          <div className="flex items-center gap-3">
                            <div className="h-[1px] w-10 bg-gold-400/50" />
                            <span className="text-[10px] uppercase tracking-[3px] text-gold-400/50 font-bold">Purity {purity}</span>
                            <div className="h-[1px] flex-1 bg-white/5" />
                          </div>

                          {/* Purity visual bar */}
                          <div className="flex flex-col gap-1.5 max-w-xs">
                            <div className="h-[3px] w-full rounded-full bg-white/8 overflow-hidden">
                              <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                                style={{ originX: 0, width: is22k ? '91.6%' : '100%' }}
                                className="h-full rounded-full bg-gradient-to-r from-gold-400 to-amber-300"
                              />
                            </div>
                          </div>

                          {/* Subheading */}
                          <p className="text-sm text-gray-500 leading-relaxed max-w-sm">{sub}</p>

                          {/* CTA */}
                          <div className="flex items-center gap-4 pt-1">
                            <Link
                              to="/catalog"
                              className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-950 px-7 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 shadow-[0_8px_30px_rgba(212,160,23,0.25)] hover:shadow-[0_8px_40px_rgba(212,160,23,0.4)] hover:-translate-y-0.5 w-fit"
                            >
                              Browse Catalog <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>

                        {/* RIGHT — Glassmorphism info panel */}
                        <div className="hidden lg:flex items-center justify-center lg:justify-end pr-4">
                          <div className="relative w-[280px]">
                            {/* Main glass card */}
                            <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl p-7 backdrop-blur-sm overflow-hidden">
                              {/* Shimmer overlay */}
                              <div className="absolute inset-0 bg-gradient-to-br from-gold-400/[0.06] via-transparent to-transparent pointer-events-none rounded-3xl" />

                              {/* Karat badge — large */}
                              <div className="flex items-center justify-between mb-6">
                                <div>
                                  <p className="text-[9px] uppercase tracking-[3px] text-white/30 font-bold mb-0.5">Karat</p>
                                  <p className="font-serif text-5xl font-bold text-gold-400">{karat}</p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center">
                                  <TrendingUp className="w-6 h-6 text-gold-400" />
                                </div>
                              </div>

                              {/* Divider */}
                              <div className="h-[1px] bg-white/8 mb-5" />

                              {/* Stats grid */}
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] uppercase tracking-widest text-white/30">Purity</span>
                                  <span className="text-sm font-bold text-white font-mono">{purity}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] uppercase tracking-widest text-white/30">Rate / gram</span>
                                  <span className="text-sm font-bold text-gold-400 font-mono">
                                    {rate_val > 0 ? `₹${rate_val.toLocaleString('en-IN')}` : '—'}
                                  </span>
                                </div>

                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] uppercase tracking-widest text-white/30">Standard</span>
                                  <span className="text-[10px] font-bold text-white/50">BIS Hallmarked</span>
                                </div>

                                {displayDateStr && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] uppercase tracking-widest text-white/30">Updated</span>
                                    <span className="text-[10px] font-bold text-white/50 font-mono">
                                      {displayDateStr}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Bottom accent bar */}
                              <div className="mt-6 h-[2px] rounded-full bg-gradient-to-r from-gold-400/60 via-amber-300/40 to-transparent" />
                            </div>

                            {/* Floating accent dot top-right */}
                            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-gold-400/20 border border-gold-400/30 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-gold-400/60" />
                            </div>
                            {/* Floating accent dot bottom-left */}
                            <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-gold-400/15 border border-gold-400/20" />
                          </div>
                        </div>

                      </div>
                    </div>
                  </>
                );
              })()}


              {/* ── IMAGE SLIDES ── */}
              {activeSlideData.type === 'image' && (() => {
                const s = activeSlideData.data;
                return (
                  <>
                    {/* Mobile background image */}
                    <div className="lg:hidden absolute inset-0 z-0">
                      {s?.image
                        ? <img src={s.image} alt={s.heading} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        : <div className="w-full h-full bg-navy-900" />
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/20" />
                    </div>

                    {/* Desktop image — right bleed */}
                    {s?.image && (
                      <div className="hidden lg:block absolute inset-y-0 right-0 w-[55%] z-0 pointer-events-none">
                        <img src={s.image} alt={s.heading} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/30 via-transparent to-navy-950/30" />
                      </div>
                    )}

                    {/* Text content */}
                    <div className="relative z-10 px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-12 items-center min-h-[480px] lg:min-h-[560px] py-20 lg:py-0">
                      <div className="col-span-1 lg:col-span-6 flex flex-col gap-5 mt-auto lg:mt-0">
                        {s?.badge && (
                          <span className="text-[10px] px-3 py-1 rounded-full border border-gold-400 text-gold-400 uppercase tracking-widest w-fit">
                            {s.badge}
                          </span>
                        )}
                        <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] text-white drop-shadow-md">
                          {s?.heading}
                        </h2>
                        <p className="text-sm text-gray-300 md:text-gray-400 leading-relaxed max-w-sm drop-shadow">
                          {s?.subheading}
                        </p>
                        {s?.ctaText && (
                          <Link to={s.ctaLink || "/catalog"} className="inline-flex items-center gap-2 bg-gold-400 text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold-500 transition-colors w-fit shadow-lg">
                            {s.ctaText} <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          {allSlides.length > 1 && (
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
          {allSlides.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {allSlides.map((slide, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  title={slide.type === 'rate22k' ? '22K Gold Rate' : slide.type === 'rate24k' ? '24K Gold Rate' : undefined}
                  className={`rounded-full transition-all duration-300 ${idx === activeSlide
                      ? (slide.type !== 'image' ? 'bg-gold-400 w-6 h-2' : 'bg-gold-400 w-6 h-2')
                      : 'bg-white/30 w-2 h-2 hover:bg-white/60'
                    }`}
                />
              ))}
            </div>
          )}
          {allSlides.length > 1 && (
            <div className="absolute bottom-5 right-5 text-[10px] font-bold text-white/25 z-20 hidden md:block">
              {activeSlide + 1} / {allSlides.length}
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
          5. TRUSTED CLIENTS
      ═══════════════════════════════════════════════════ */}
      {(rate.homeConfig?.trustedClients ?? []).length > 0 && (
        <section className="py-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <span className="text-[10px] px-3 py-1 rounded-full border border-gold-400 text-gold-400 uppercase tracking-widest mb-4 inline-block">Trusted By</span>
              <h2 className="text-3xl md:text-4xl font-serif text-white font-bold mb-3">Our Trusted Clients</h2>
              <div className="w-16 h-[2px] bg-gold-400 mx-auto rounded mt-4" />
            </div>
            <div className="flex flex-wrap justify-center items-center gap-10">
              {(rate.homeConfig?.trustedClients ?? []).map((client, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className="flex flex-col items-center gap-3 group"
                  title={client.name}
                >
                  <div className="w-36 h-36 rounded-3xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center group-hover:border-gold-400/50 group-hover:bg-white/8 transition-all duration-300 p-3 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                    {client.image ? (
                      <img
                        src={client.image}
                        alt={client.name}
                        className="w-full h-full object-contain opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-xs text-white/30 font-bold uppercase text-center leading-tight px-2">
                        {client.name}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] uppercase tracking-[2px] text-white/30 group-hover:text-gold-400/70 transition-colors font-bold">
                    {client.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          6. TESTIMONIALS
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
