import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { Loader2, Plus, Edit, Trash2, EyeOff, X, AlertCircle, Image as ImageIcon, UploadCloud } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../hooks/useAuth";
import { logAdminAction } from "../../lib/audit";
import { fetchCategories, fetchSubcategories, Category, Subcategory } from "../../lib/categories";

export default function AdminCatalog() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals/Forms
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Upload State
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category/Subcategory from DB
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [dbSubcategories, setDbSubcategories] = useState<Subcategory[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories().then(setDbCategories);
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').order('createdAt', { ascending: false });
      if (data) {
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (p: any) => {
    setCurrentProduct(p);
    setFormErrors({});
    setIsEditing(true);
    // Load subcategories for existing product's category
    if (p.category) {
      const cat = dbCategories.find(c => c.name === p.category);
      if (cat) fetchSubcategories(cat.id).then(setDbSubcategories);
      else setDbSubcategories([]);
    }
  };

  const handleAdd = () => {
    setCurrentProduct({
      title: "",
      description: "",
      weightInGrams: "",
      makingCharge: "",
      chargeType: "flat",
      goldKarat: "22K",
      images: [],
      popularityScore: 0,
      category: dbCategories[0]?.name ?? "",
      subCategory: "",
      isHidden: false,
      isOutofStock: false,
      stockQuantity: 0
    });
    setDbSubcategories([]);
    setFormErrors({});
    setIsEditing(true);
  };

  const handleDelete = async (id: string, productTitle: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
      
      if (user?.email) {
         logAdminAction(user.email, 'DELETE_PRODUCT', `Deleted product: "${productTitle}"`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete.");
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!currentProduct.title?.trim()) errors.title = "Title is required";
    if (!currentProduct.description?.trim()) errors.description = "Description is required";
    if (!currentProduct.weightInGrams || currentProduct.weightInGrams <= 0) errors.weightInGrams = "Valid weight is required";
    if (currentProduct.makingCharge === "" || currentProduct.makingCharge < 0) errors.makingCharge = "Valid making charge is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSaving(true);
    try {
      const payload = { ...currentProduct };
      payload.weightInGrams = Number(payload.weightInGrams);
      payload.makingCharge = Number(payload.makingCharge);
      payload.stockQuantity = Number(payload.stockQuantity) || 0;
      
      if (!payload.createdAt) { payload.createdAt = Date.now(); }
      payload.updatedAt = Date.now();

      if (payload.id) {
        const id = payload.id;
        delete payload.id; // don't save ID in doc
        const { error } = await supabase.from('products').update(payload).eq('id', id);
        if (error) throw error;
        
        if (user?.email) logAdminAction(user.email, 'UPDATE_PRODUCT', `Updated product: "${payload.title}"`);
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
        
        if (user?.email) logAdminAction(user.email, 'CREATE_PRODUCT', `Created new product: "${payload.title}"`);
      }
      setIsEditing(false);
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      alert("Failed to save: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    
    setUploadingImages(true);
    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        
        const fileExt = file.name.split('.').pop();
        const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('assets')
          .upload(filePath, file);

        if (uploadError) {
          if (uploadError.message.includes("Bucket not found")) {
            throw new Error("The 'assets' bucket does not exist in Supabase storage.");
          }
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('assets')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setCurrentProduct((prev: any) => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls]
      }));
      
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err.message || "Failed to upload images.");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleImageUpload(e.dataTransfer.files);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setCurrentProduct((prev: any) => ({
      ...prev,
      images: prev.images.filter((_: string, index: number) => index !== indexToRemove)
    }));
  };

  const inputClass = (err: boolean) =>
    `w-full border-b ${err ? 'border-red-400' : 'border-black/10'} px-0 py-2 bg-transparent focus:ring-0 focus:border-gold-400 outline-none transition-colors rounded-none text-white`;

  // Selects need an explicit dark background so dropdown options are readable
  const selectClass = (err = false) =>
    `w-full border-b ${err ? 'border-red-400' : 'border-black/10'} px-0 py-2 bg-navy-900 focus:ring-0 focus:border-gold-400 outline-none transition-colors rounded-none text-white [&>option]:bg-navy-900 [&>option]:text-white`;

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-white">Catalog Manager</h1>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-navy-900 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold-500 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="bg-navy-900 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-black/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-navy-800 border-b border-gray-100/50 uppercase text-[10px] text-gray-400 font-bold tracking-widest">
              <th className="p-5">Item</th>
              <th className="p-5">Category</th>
              <th className="p-5">Weight (g)</th>
              <th className="p-5">Making Charge</th>
              <th className="p-5">Stock</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/50">
            {loading ? (
               <tr><td colSpan={6} className="p-20 text-center"><Loader2 className="w-6 h-6 animate-spin text-gold-400 mx-auto" /></td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="p-12 text-center text-gray-400 font-serif">No items in the catalog.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-navy-800/50 transition-colors group">
                  <td className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-black/5">
                      {p.images && p.images[0] ? (
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-gray-300 mx-auto mt-3" />
                      )}
                    </div>
                    <span className="font-serif font-medium text-white group-hover:text-gold-500 transition-colors">{p.title}</span>
                  </td>
                  <td className="p-5 text-sm text-gray-500">{p.category}</td>
                  <td className="p-5 text-sm font-medium text-white">{p.weightInGrams}g</td>
                  <td className="p-5 text-sm text-gray-500">
                    {p.chargeType === 'flat' ? `₹${p.makingCharge}` : `${p.makingCharge}%`}
                  </td>
                  <td className="p-5 text-sm font-medium text-white">{p.stockQuantity || 0}</td>
                  <td className="p-5">
                    <div className="flex gap-2">
                       {p.isHidden && <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-full"><EyeOff className="w-3 h-3"/> Hidden</span>}
                       {p.isOutofStock && <span className="inline-flex text-[10px] uppercase tracking-widest font-bold bg-amber-50 border border-amber-200/50 text-amber-700 px-2 py-1 rounded-full">Out of Stock</span>}
                       {!p.isHidden && !p.isOutofStock && <span className="inline-flex text-[10px] uppercase tracking-widest font-bold bg-emerald-50 border border-emerald-200/50 text-emerald-700 px-2 py-1 rounded-full">Active</span>}
                    </div>
                  </td>
                  <td className="p-5 text-right space-x-1 whitespace-nowrap">
                     <button onClick={() => handleEdit(p)} className="inline-flex items-center gap-1.5 p-2 px-3 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors font-medium text-xs">
                        <Edit className="w-4 h-4" /> Edit
                     </button>
                     <button onClick={() => handleDelete(p.id, p.title)} className="inline-flex items-center gap-1.5 p-2 px-3 text-rose-500 hover:bg-rose-50 rounded-full transition-colors font-medium text-xs">
                        <Trash2 className="w-4 h-4" /> Delete
                     </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex justify-center p-4 sm:p-6 md:p-12 items-start md:items-center overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSaving && setIsEditing(false)}
              className="fixed inset-0 bg-navy-950/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-navy-900 w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-full border border-gold-400/20"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-8 py-6 border-b border-black/5 bg-navy-800/50 shrink-0">
                <h2 className="text-2xl font-serif font-bold text-white">
                  {currentProduct.id ? "Edit Masterpiece" : "Add Masterpiece"}
                </h2>
                <button 
                  onClick={() => !isSaving && setIsEditing(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-navy-900 rounded-full transition-colors shadow-sm bg-navy-800 border border-black/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <div className="overflow-y-auto p-8 flex-1 custom-scrollbar">
                <form id="productForm" onSubmit={saveProduct} className="space-y-10 focus:outline-none">
                  
                  {/* Basic Details */}
                  <fieldset>
                    <legend className="text-lg font-serif font-bold text-white border-b border-black/10 w-full mb-6 pb-2">Basic Details</legend>
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="sm:col-span-2">
                         <label className="block text-[10px] uppercase font-bold tracking-widest text-white/60 mb-2">Title</label>
                         <input 
                           type="text" 
                           value={currentProduct.title} 
                           onChange={e => setCurrentProduct({...currentProduct, title: e.target.value})} 
                           className={inputClass(!!formErrors.title)} 
                           placeholder="e.g. 22K Gold Filigree Bangle"
                         />
                         {formErrors.title && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{formErrors.title}</p>}
                      </div>

                      <div>
                         <label className="block text-[10px] uppercase font-bold tracking-widest text-white/60 mb-2">Category</label>
                         <select
                           value={currentProduct.category}
                           onChange={async e => {
                             const catName = e.target.value;
                             setCurrentProduct({...currentProduct, category: catName, subCategory: ''});
                             const cat = dbCategories.find(c => c.name === catName);
                             if (cat) {
                               const subs = await fetchSubcategories(cat.id);
                               setDbSubcategories(subs);
                             } else {
                               setDbSubcategories([]);
                             }
                           }}
                           className={selectClass()}
                         >
                           {dbCategories.length === 0 && (
                             <option value="">No categories — add in Category Manager</option>
                           )}
                           {dbCategories.map(c => (
                             <option key={c.id} value={c.name}>{c.name}</option>
                           ))}
                         </select>
                      </div>

                      <div>
                         <label className="block text-[10px] uppercase font-bold tracking-widest text-white/60 mb-2">Subcategory</label>
                         <select
                           value={currentProduct.subCategory || ''}
                           onChange={e => setCurrentProduct({...currentProduct, subCategory: e.target.value})}
                           className={selectClass()}
                           disabled={dbSubcategories.length === 0}
                         >
                           <option value="">— None / All —</option>
                           {dbSubcategories.map(s => (
                             <option key={s.id} value={s.name}>{s.name}</option>
                           ))}
                         </select>
                         {dbSubcategories.length === 0 && currentProduct.category && (
                           <p className="text-[10px] text-gray-500 mt-1">No subcategories for this category yet.</p>
                         )}
                      </div>

                      <div>
                         <label className="block text-[10px] uppercase font-bold tracking-widest text-white/60 mb-2">Gold Karat</label>
                         <select
                           value={currentProduct.goldKarat || '22K'}
                           onChange={e => setCurrentProduct({...currentProduct, goldKarat: e.target.value})}
                           className={selectClass()}
                         >
                           <option value="22K">22 Karat (22K)</option>
                         </select>
                      </div>

                      <div className="sm:col-span-2">
                         <label className="block text-[10px] uppercase font-bold tracking-widest text-white/60 mb-2">Description</label>
                         <textarea 
                           value={currentProduct.description} 
                           onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} 
                           rows={3}
                           className="w-full border border-black/10 rounded-xl px-4 py-3 bg-transparent focus:ring-0 focus:border-gold-400 outline-none transition-colors text-white resize-none mt-1" 
                           placeholder="Describe the styling and details..."
                         />
                         {formErrors.description && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{formErrors.description}</p>}
                      </div>
                    </div>
                  </fieldset>

                  {/* Pricing & Structure */}
                  <fieldset>
                    <legend className="text-lg font-serif font-bold text-white border-b border-black/10 w-full mb-6 pb-2">Metrics & Commercials</legend>
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                      <div>
                         <label className="block text-[10px] uppercase font-bold tracking-widest text-white/60 mb-2">Weight (Grams)</label>
                         <input 
                           type="number" 
                           step="0.01" 
                           value={currentProduct.weightInGrams} 
                           onChange={e => setCurrentProduct({...currentProduct, weightInGrams: e.target.value})} 
                           className={inputClass(!!formErrors.weightInGrams)} 
                           placeholder="0.00"
                         />
                         {formErrors.weightInGrams && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{formErrors.weightInGrams}</p>}
                      </div>

                      <div>
                         <label className="block text-[10px] uppercase font-bold tracking-widest text-white/60 mb-2">Making Charge Type</label>
                         <select 
                           value={currentProduct.chargeType} 
                           onChange={e => setCurrentProduct({...currentProduct, chargeType: e.target.value})} 
                           className={selectClass()}
                         >
                           <option value="flat">Flat Amount (₹)</option>
                           <option value="percentage">Percentage (%)</option>
                         </select>
                      </div>

                      <div className="sm:col-span-2">
                         <label className="block text-[10px] uppercase font-bold tracking-widest text-white/60 mb-2">
                           Making Charge Value {currentProduct.chargeType === 'percentage' ? '(%)' : '(₹)'}
                         </label>
                         <input 
                           type="number" 
                           value={currentProduct.makingCharge} 
                           onChange={e => setCurrentProduct({...currentProduct, makingCharge: e.target.value})} 
                           className={inputClass(!!formErrors.makingCharge)} 
                           placeholder="0"
                         />
                         {formErrors.makingCharge && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{formErrors.makingCharge}</p>}
                      </div>

                      <div className="sm:col-span-2">
                         <label className="block text-[10px] uppercase font-bold tracking-widest text-white/60 mb-2">
                           Stock Quantity
                         </label>
                         <input 
                           type="number" 
                           value={currentProduct.stockQuantity || 0} 
                           onChange={e => setCurrentProduct({...currentProduct, stockQuantity: e.target.value})} 
                           className={inputClass(false)} 
                           placeholder="0"
                         />
                      </div>
                    </div>
                  </fieldset>

                  {/* Media */}
                  <fieldset>
                    <legend className="text-lg font-serif font-bold text-white border-b border-black/10 w-full mb-6 pb-2">Media Gallery</legend>
                    <div className="space-y-4">
                      <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDragActive ? 'border-gold-500 bg-gold-50' : 'border-gray-300 bg-navy-800 hover:bg-gray-100 hover:border-gray-400'} ${uploadingImages ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                         <input 
                           type="file"
                           multiple
                           accept="image/*"
                           className="hidden"
                           ref={fileInputRef}
                           onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                         />
                         
                         {uploadingImages ? (
                           <>
                             <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-3" />
                             <p className="text-sm font-bold text-white">Uploading securely...</p>
                           </>
                         ) : (
                           <>
                             <div className="w-12 h-12 bg-navy-900 rounded-full shadow-sm flex items-center justify-center mb-3">
                               <UploadCloud className="w-6 h-6 text-gray-400" />
                             </div>
                             <p className="text-sm font-bold text-white mb-1">Click to upload or drag & drop</p>
                             <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
                           </>
                         )}
                      </div>

                      {/* Image Grid */}
                      {currentProduct.images && currentProduct.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                           {currentProduct.images.map((url: string, index: number) => (
                             <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-black/10 group bg-gray-100">
                               <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                               <button 
                                 type="button"
                                 onClick={() => removeImage(index)}
                                 className="absolute top-2 right-2 p-1.5 bg-navy-900/90 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                               >
                                 <X className="w-4 h-4" />
                               </button>
                             </div>
                           ))}
                        </div>
                      )}
                    </div>
                  </fieldset>

                  {/* Operational Status */}
                  <fieldset>
                    <legend className="text-lg font-serif font-bold text-white border-b border-black/10 w-full mb-6 pb-2">Operational Status</legend>
                    <div className="flex flex-col sm:flex-row gap-6">
                      <label className="flex items-center gap-3 cursor-pointer group">
                         <button
                           type="button"
                           onClick={() => setCurrentProduct({...currentProduct, isHidden: !currentProduct.isHidden})}
                           className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 ${currentProduct.isHidden ? 'bg-gold-500' : 'bg-gray-200'}`}
                         >
                           <span className={`inline-block h-4 w-4 transform rounded-full bg-navy-900 transition-transform ${currentProduct.isHidden ? 'translate-x-6' : 'translate-x-1'}`} />
                         </button>
                         <div className="flex flex-col">
                           <span className="text-sm font-medium text-white group-hover:text-gold-500 transition-colors">Hide from Catalog</span>
                           <span className="text-[10px] text-gray-400">Archived items are invisible to public users</span>
                         </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer group">
                         <button
                           type="button"
                           onClick={() => setCurrentProduct({...currentProduct, isOutofStock: !currentProduct.isOutofStock})}
                           className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${currentProduct.isOutofStock ? 'bg-amber-500' : 'bg-gray-200'}`}
                         >
                           <span className={`inline-block h-4 w-4 transform rounded-full bg-navy-900 transition-transform ${currentProduct.isOutofStock ? 'translate-x-6' : 'translate-x-1'}`} />
                         </button>
                         <div className="flex flex-col">
                           <span className="text-sm font-medium text-white group-hover:text-amber-600 transition-colors">Mark Out of Stock</span>
                           <span className="text-[10px] text-gray-400">Displays 'Out of Stock' badge on items</span>
                         </div>
                      </label>
                    </div>
                  </fieldset>
                </form>
              </div>

              {/* Actions Footer */}
              <div className="px-8 py-5 border-t border-black/5 bg-navy-800/50 flex justify-end gap-4 shrink-0">
                 <button 
                   type="button" 
                   onClick={() => setIsEditing(false)} 
                   disabled={isSaving || uploadingImages}
                   className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-white hover:bg-black/5 transition-colors"
                 >
                   Discard
                 </button>
                 <button 
                   type="submit" 
                   form="productForm" 
                   disabled={isSaving || uploadingImages} 
                   className="px-8 py-2.5 bg-navy-900 text-gold-400 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-navy-800 transition-colors flex items-center gap-2 shadow-xl shadow-navy-900/20 disabled:opacity-70 disabled:shadow-none"
                 >
                   {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-gold-400" /> : "Save Masterpiece"}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
