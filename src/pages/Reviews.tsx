import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "motion/react";
import { Star, Loader2, MessageSquareQuote } from "lucide-react";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: number;
  isApproved: boolean;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });

  useEffect(() => {
    async function fetchReviews() {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('isApproved', true)
          .order('createdAt', { ascending: false });
        if (data) {
          setReviews(data);
        }
      } catch (err) {
        console.error("Error fetching reviews", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.comment) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert([{
        customerName: form.name,
        rating: form.rating,
        comment: form.comment,
        isApproved: false,
        createdAt: Date.now(),
      }]);
      if (error) throw error;
      setSuccessMsg("Thank you! Your review has been submitted and is pending approval.");
      setForm({ name: "", rating: 5, comment: "" });
    } catch (err) {
      console.error("Error adding review", err);
      alert("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <MessageSquareQuote className="w-12 h-12 text-gold-400 mx-auto mb-4 opacity-50" />
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Client Stories</h1>
        <p className="text-gray-400 text-lg">Hear what our cherished clients have to say about our craftsmanship and service.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Review Form */}
        <div className="lg:col-span-1">
          <div className="bg-navy-900 p-8 rounded-2xl border border-gold-400/20 shadow-[0_10px_30px_rgba(0,0,0,0.2)] sticky top-24">
             <h3 className="text-2xl font-serif font-bold text-white mb-6">Leave a Review</h3>
             {successMsg ? (
               <div className="bg-gold-400/10 border border-gold-400/20 text-gold-400 px-4 py-3 rounded text-sm mb-4">
                 {successMsg}
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-5">
                 <div>
                   <label className="block text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1">Your Name</label>
                   <input
                     type="text"
                     required
                     value={form.name}
                     onChange={e => setForm({...form, name: e.target.value})}
                     className="w-full border-b border-white/10 px-0 py-2 focus:ring-0 focus:border-gold-400 outline-none transition-colors bg-transparent rounded-none text-white placeholder-white/30"
                     placeholder="Name"
                   />
                 </div>
                 <div>
                   <label className="block text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1 mt-4">Rating</label>
                   <div className="flex gap-2">
                     {[1,2,3,4,5].map(star => (
                       <button
                         key={star}
                         type="button"
                         onClick={() => setForm({...form, rating: star})}
                         className="focus:outline-none"
                       >
                         <Star className={`w-5 h-5 ${star <= form.rating ? 'fill-gold-400 text-gold-400' : 'text-white/20'}`} />
                       </button>
                     ))}
                   </div>
                 </div>
                 <div>
                   <label className="block text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1 mt-4">Your Experience</label>
                   <textarea
                     required
                     rows={4}
                     value={form.comment}
                     onChange={e => setForm({...form, comment: e.target.value})}
                     className="w-full border border-white/10 rounded-md px-4 py-2 mt-1 focus:ring-0 focus:border-gold-400 outline-none transition-colors resize-none bg-navy-950 text-white placeholder-white/30"
                     placeholder="Tell us about the jewelry you received..."
                   ></textarea>
                 </div>
                 <button
                   type="submit"
                   disabled={submitting}
                   className="w-full bg-gold-400 text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
                 >
                   {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                   Submit Review
                 </button>
               </form>
             )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gold-500" /></div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 bg-navy-900 rounded-2xl border border-dashed border-gold-400/30">
              <p className="text-gray-400 font-serif">No reviews yet. Be the first to leave one!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {reviews.map((review, idx) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  key={review.id}
                  className="bg-navy-900 p-6 rounded-2xl border border-white/5 flex flex-col h-full shadow-sm"
                >
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-gold-400 text-gold-400' : 'text-white/20'}`} />
                    ))}
                  </div>
                  <p className="text-white/80 italic text-sm mb-4 flex-1">"{review.comment}"</p>
                  <div className="pt-4 mt-auto border-t border-white/5">
                    <p className="font-bold text-[10px] uppercase tracking-widest text-white/40">— {review.customerName}</p>
                    <p className="text-[10px] text-gray-500 mt-1">
                       {new Date(review.createdAt).toLocaleDateString("en-IN", {
                         year: 'numeric', month: 'short', day: 'numeric'
                       })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
