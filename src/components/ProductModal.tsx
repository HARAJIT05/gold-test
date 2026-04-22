import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, MessageCircle, Send, Loader2, Scale, Tag, Package } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  weightInGrams: number;
  makingCharge: number;
  chargeType: 'flat' | 'percentage';
  images: string[];
  popularityScore: number;
  category: string;
  isHidden: boolean;
  isOutofStock: boolean;
  stockQuantity: number;
}

interface Props {
  product: Product;
  price: number;
  rate22k: number;
  onClose: () => void;
}

const WHATSAPP_NUMBER = '916295517205';

export function ProductModal({ product, price, rate22k, onClose }: Props) {
  const [activeImg, setActiveImg] = useState(0);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const images = product.images?.length > 0 ? product.images : [];

  const scrollThumb = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'right' ? 80 : -80, behavior: 'smooth' });
  };

  const handleEnquire = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setSending(true);

    const text = encodeURIComponent(
      `Hello! I'm interested in this product from Gold Karigar.\n\n` +
      `*Product:* ${product.title}\n` +
      `*Category:* ${product.category}\n` +
      `*Weight:* ${product.weightInGrams}g\n` +
      `*Est. Price:* ₹${price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}\n\n` +
      `*My Name:* ${form.name}\n` +
      `*Phone:* ${form.phone}\n\n` +
      `Please get in touch with me. Thank you!`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    setSending(false);
    setShowEnquiry(false);
    setForm({ name: '', phone: '' });
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="relative w-full max-w-4xl max-h-[90vh] bg-navy-900 rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-navy-950/80 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-navy-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* ── LEFT: Image Gallery ── */}
            <div className="md:w-1/2 flex flex-col bg-navy-950">
              {/* Main image */}
              <div className="flex-1 relative min-h-[260px] md:min-h-0">
                {images.length > 0 ? (
                  <img
                    src={images[activeImg]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                    No Images Available
                  </div>
                )}

                {/* Prev / Next arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image counter pill */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full font-medium">
                    {activeImg + 1} / {images.length}
                  </div>
                )}

                {/* Out of stock overlay */}
                {product.isOutofStock && (
                  <div className="absolute inset-0 bg-navy-950/70 flex items-center justify-center">
                    <span className="bg-red-500/90 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail strip — horizontal scroll */}
              {images.length > 1 && (
                <div className="relative flex items-center bg-navy-950 px-2 py-2 border-t border-white/5">
                  <button
                    onClick={() => scrollThumb('left')}
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-navy-800 hover:bg-navy-700 flex items-center justify-center text-gray-400 mr-1"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>

                  <div
                    ref={scrollRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth flex-1"
                    style={{ scrollbarWidth: 'none' }}
                  >
                    {images.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImg(idx)}
                        className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === activeImg
                            ? 'border-gold-400 scale-105'
                            : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`View ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => scrollThumb('right')}
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-navy-800 hover:bg-navy-700 flex items-center justify-center text-gray-400 ml-1"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* ── RIGHT: Details ── */}
            <div className="md:w-1/2 flex flex-col overflow-y-auto">
              <div className="p-6 md:p-8 flex-1 flex flex-col gap-5">
                {/* Category badge */}
                <span className="text-[10px] px-3 py-1 rounded-full border border-gold-400 text-gold-400 uppercase tracking-widest font-bold w-fit">
                  {product.category}
                </span>

                {/* Title */}
                <h2 className="font-serif text-2xl md:text-3xl text-white leading-tight">
                  {product.title}
                </h2>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {product.description}
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-navy-950 rounded-xl p-3 flex flex-col items-center gap-1 border border-white/5">
                    <Scale className="w-4 h-4 text-gold-400" />
                    <span className="text-white font-bold text-sm">{product.weightInGrams}g</span>
                    <span className="text-gray-500 text-[10px] uppercase tracking-wide">Weight</span>
                  </div>
                  <div className="bg-navy-950 rounded-xl p-3 flex flex-col items-center gap-1 border border-white/5">
                    <Tag className="w-4 h-4 text-gold-400" />
                    <span className="text-white font-bold text-sm">
                      {product.chargeType === 'flat' ? `₹${product.makingCharge}` : `${product.makingCharge}%`}
                    </span>
                    <span className="text-gray-500 text-[10px] uppercase tracking-wide">Making</span>
                  </div>
                  <div className="bg-navy-950 rounded-xl p-3 flex flex-col items-center gap-1 border border-white/5">
                    <Package className="w-4 h-4 text-gold-400" />
                    <span className={`font-bold text-sm ${product.stockQuantity > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {product.stockQuantity > 0 ? product.stockQuantity : 'N/A'}
                    </span>
                    <span className="text-gray-500 text-[10px] uppercase tracking-wide">In Stock</span>
                  </div>
                </div>

                {/* Live Price */}
                <div className="bg-gradient-to-r from-gold-400/10 to-gold-500/5 border border-gold-400/20 rounded-2xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gold-400/70 font-bold mb-1">
                        Live Estimated Price
                      </p>
                      {rate22k > 0 ? (
                        <p className="font-serif text-3xl font-bold text-gold-400">
                          ₹{price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </p>
                      ) : (
                        <p className="text-amber-400 text-sm font-semibold">Rate unavailable</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">22K Rate</p>
                      <p className="text-white font-medium text-sm">₹{rate22k}/g</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">
                    * Price is calculated based on today's live 22K gold rate. Final price may vary.
                  </p>
                </div>

                {/* Enquiry form (inline reveal) */}
                <AnimatePresence>
                  {showEnquiry && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <form onSubmit={handleEnquire} className="bg-navy-950 rounded-2xl p-5 border border-white/5 space-y-4 mt-1">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-[#25D366]" />
                          Send Enquiry via WhatsApp
                        </h4>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1.5">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g. Priya Sharma"
                            className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-gold-400 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1.5">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            required
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="e.g. +91 98765 43210"
                            className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-gold-400 transition-colors"
                          />
                        </div>
                        <div className="flex gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowEnquiry(false)}
                            className="flex-1 py-2.5 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white border border-white/10 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={sending}
                            className="flex-1 py-2.5 bg-[#25D366] text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 hover:bg-[#1ebe5a] transition-colors disabled:opacity-70"
                          >
                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                            Send on WhatsApp
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer CTA */}
              {!showEnquiry && (
                <div className="p-6 md:px-8 pb-6 border-t border-white/5 bg-navy-950/50">
                  <button
                    onClick={() => setShowEnquiry(true)}
                    disabled={product.isOutofStock}
                    className="w-full flex items-center justify-center gap-3 py-3.5 bg-[#25D366] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#1ebe5a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#25D366]/20"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {product.isOutofStock ? 'Currently Out of Stock' : 'Enquire on WhatsApp'}
                  </button>
                  <p className="text-center text-[10px] text-gray-500 mt-3">
                    We'll reply within 1 hour during business hours
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
