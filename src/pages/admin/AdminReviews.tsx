import { useState, useEffect, FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import { Loader2, CheckCircle, XCircle, Trash2, Star, Plus, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../hooks/useAuth";
import { logAdminAction } from "../../lib/audit";

export default function AdminReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newReview, setNewReview] = useState({ customerName: "", rating: 5, comment: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('reviews').select('*').order('createdAt', { ascending: false });
      if (data) {
        setReviews(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string, customerName: string) => {
    if (!confirm("Delete this review permanently?")) return;
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      setReviews(reviews.filter(r => r.id !== id));
      
      if (user?.email) logAdminAction(user.email, 'DELETE_REVIEW', `Deleted review by ${customerName}`);
    } catch (err) {
      console.error(err);
      alert("Failed to delete.");
    }
  };

  const handleToggleApproval = async (r: any) => {
    try {
      const { error } = await supabase.from('reviews').update({
        isApproved: !r.isApproved,
        updatedAt: Date.now()
      }).eq('id', r.id);
      if (error) throw error;
      setReviews(reviews.map(item => item.id === r.id ? { ...item, isApproved: !r.isApproved } : item));
      
      if (user?.email) logAdminAction(user.email, 'UPDATE_REVIEW', `${!r.isApproved ? 'Approved' : 'Rejected'} review from ${r.customerName}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  const handleAddClick = () => {
    setNewReview({ customerName: "", rating: 5, comment: "" });
    setFormErrors({});
    setIsAdding(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!newReview.customerName.trim()) errors.customerName = "Name is required";
    if (!newReview.comment.trim()) errors.comment = "Comment is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSaving(true);
    try {
      const payload = {
        ...newReview,
        isApproved: true, // Auto-approve manual admin reviews
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const { error } = await supabase.from('reviews').insert([payload]);
      if (error) throw error;

      if (user?.email) logAdminAction(user.email, 'ADD_MANUAL_REVIEW', `Added manual review from ${payload.customerName}`);

      setIsAdding(false);
      fetchReviews();
    } catch (err: any) {
      console.error(err);
      alert("Failed to save: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = (err: boolean) => 
    `w-full border-b ${err ? 'border-red-400' : 'border-white/10'} px-0 py-2 bg-transparent focus:ring-0 focus:border-gold-400 outline-none transition-colors rounded-none text-white placeholder-white/30`;

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-white">Review Moderation</h1>
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-navy-900 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold-500 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      <div className="bg-navy-900 rounded-xl shadow-sm border border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-navy-800 border-b border-white/5 uppercase text-xs text-gray-400 font-semibold tracking-wider">
              <th className="p-4">Customer</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Comment</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
               <tr><td colSpan={5} className="p-20 text-center"><Loader2 className="w-6 h-6 animate-spin text-gold-500 mx-auto" /></td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">No reviews found.</td></tr>
            ) : (
              reviews.map((r) => (
                <tr key={r.id} className="hover:bg-navy-800/50 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-white">{r.customerName}</p>
                    <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 text-gold-500">
                      {r.rating} <Star className="w-4 h-4 fill-current" />
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 max-w-md">
                     <p className="line-clamp-2">{r.comment}</p>
                  </td>
                  <td className="p-4">
                    {r.isApproved ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded"><CheckCircle className="w-3 h-3"/> Approved</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded"><Loader2 className="w-3 h-3"/> Pending</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                     <button title={r.isApproved ? "Revoke Approval" : "Approve"} onClick={() => handleToggleApproval(r)} className={`inline-flex items-center gap-1.5 p-2 px-3 rounded-full transition-colors font-medium text-xs ${r.isApproved ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}>
                        {r.isApproved ? <><XCircle className="w-4 h-4" /> Revoke</> : <><CheckCircle className="w-4 h-4" /> Approve</>}
                     </button>
                     <button onClick={() => handleDelete(r.id, r.customerName)} className="inline-flex items-center gap-1.5 p-2 px-3 text-red-600 hover:bg-red-50 rounded-full transition-colors font-medium text-xs"><Trash2 className="w-4 h-4" /> Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex justify-center p-4 sm:p-6 md:p-12 items-start md:items-center overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSaving && setIsAdding(false)}
              className="fixed inset-0 bg-navy-950/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-navy-900 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-full border border-gold-400/20"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-8 py-6 border-b border-white/5 bg-navy-800/50 shrink-0">
                <h2 className="text-2xl font-serif font-bold text-white">
                  Add Manual Review
                </h2>
                <button 
                  onClick={() => !isSaving && setIsAdding(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-navy-900 rounded-full transition-colors shadow-sm bg-navy-800 border border-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <div className="overflow-y-auto p-8 flex-1 custom-scrollbar">
                <form id="reviewForm" onSubmit={saveReview} className="space-y-8 focus:outline-none">
                  
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-white/40 mb-2">Customer Name</label>
                    <input 
                      type="text" 
                      value={newReview.customerName} 
                      onChange={e => setNewReview({...newReview, customerName: e.target.value})} 
                      className={inputClass(!!formErrors.customerName)} 
                      placeholder="e.g. Anjali Sharma"
                    />
                    {formErrors.customerName && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{formErrors.customerName}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-white/40 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className={`p-2 transition-colors ${newReview.rating >= star ? 'text-gold-500' : 'text-gray-200 hover:text-gold-300'}`}
                        >
                          <Star className={`w-8 h-8 ${newReview.rating >= star ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-navy-900/60 mb-2">Review Comment</label>
                    <textarea 
                      value={newReview.comment} 
                      onChange={e => setNewReview({...newReview, comment: e.target.value})} 
                      rows={4}
                      className="w-full border border-black/10 rounded-xl px-4 py-3 bg-transparent focus:ring-0 focus:border-gold-400 outline-none transition-colors text-navy-900 resize-none mt-1" 
                      placeholder="Enter the customer's review or testimonial..."
                    />
                    {formErrors.comment && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{formErrors.comment}</p>}
                  </div>
                </form>
              </div>

              {/* Actions Footer */}
              <div className="px-8 py-5 border-t border-white/5 bg-navy-800/50 flex justify-end gap-4 shrink-0">
                 <button 
                   type="button" 
                   onClick={() => setIsAdding(false)} 
                   disabled={isSaving}
                   className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-white hover:bg-white/5 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   form="reviewForm" 
                   disabled={isSaving} 
                   className="px-8 py-2.5 bg-navy-900 text-gold-400 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-navy-800 transition-colors flex items-center gap-2 shadow-xl shadow-navy-900/20 disabled:opacity-70 disabled:shadow-none"
                 >
                   {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-gold-400" /> : "Publish Review"}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
