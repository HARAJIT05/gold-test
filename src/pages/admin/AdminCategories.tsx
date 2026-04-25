import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import {
  fetchCategories, fetchSubcategories, slugify,
  Category, Subcategory
} from '../../lib/categories';
import {
  Plus, Edit, Trash2, X, Loader2, UploadCloud,
  ChevronRight, FolderOpen, Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Helpers ────────────────────────────────────────────
type ModalMode = 'category' | 'subcategory';
interface ModalState {
  open: boolean;
  mode: ModalMode;
  editing: Category | Subcategory | null;
  parentCategory: Category | null;
}

const EMPTY_MODAL: ModalState = { open: false, mode: 'category', editing: null, parentCategory: null };

const inputCls = 'w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors placeholder:text-white/20';

// ─── Component ─────────────────────────────────────────
export default function AdminCategories() {
  const [categories, setCategories]     = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCat, setSelectedCat]   = useState<Category | null>(null);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [uploading, setUploading]       = useState(false);
  const [modal, setModal]               = useState<ModalState>(EMPTY_MODAL);

  // Form state
  const [formName, setFormName]   = useState('');
  const [formImage, setFormImage] = useState('');
  const [formOrder, setFormOrder] = useState(0);

  // ── Fetch ──────────────────────────────────────────────
  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const cats = await fetchCategories();
      setCategories(cats);
      if (selectedCat) {
        const subs = await fetchSubcategories(selectedCat.id);
        setSubcategories(subs);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedCat]);

  useEffect(() => { loadCategories(); }, []);

  const loadSubs = useCallback(async (cat: Category) => {
    setSelectedCat(cat);
    const subs = await fetchSubcategories(cat.id);
    setSubcategories(subs);
  }, []);

  // ── Open Modal ─────────────────────────────────────────
  const openAdd = (mode: ModalMode, parent?: Category) => {
    setFormName(''); setFormImage(''); setFormOrder(0);
    setModal({ open: true, mode, editing: null, parentCategory: parent ?? null });
  };

  const openEdit = (mode: ModalMode, item: Category | Subcategory, parent?: Category) => {
    setFormName(item.name);
    setFormImage(item.image ?? '');
    setFormOrder(item.display_order ?? 0);
    setModal({ open: true, mode, editing: item, parentCategory: parent ?? null });
  };

  // ── Save ───────────────────────────────────────────────
  const handleSave = async () => {
    if (!formName.trim()) return alert('Name is required');
    setSaving(true);
    try {
      if (modal.mode === 'category') {
        const payload = {
          name: formName.trim(),
          slug: slugify(formName.trim()),
          image: formImage.trim(),
          display_order: formOrder,
          created_at: Date.now(),
        };
        if (modal.editing) {
          await supabase.from('categories').update(payload).eq('id', (modal.editing as Category).id);
        } else {
          await supabase.from('categories').insert([payload]);
        }
      } else {
        const payload = {
          name: formName.trim(),
          slug: slugify(formName.trim()),
          image: formImage.trim(),
          display_order: formOrder,
          category_id: modal.parentCategory!.id,
          created_at: Date.now(),
        };
        if (modal.editing) {
          await supabase.from('subcategories').update(payload).eq('id', (modal.editing as Subcategory).id);
        } else {
          await supabase.from('subcategories').insert([payload]);
        }
      }
      setModal(EMPTY_MODAL);
      // Refresh
      const cats = await fetchCategories();
      setCategories(cats);
      if (selectedCat) {
        const newSel = cats.find(c => c.id === selectedCat.id) ?? null;
        setSelectedCat(newSel);
        if (newSel) {
          const subs = await fetchSubcategories(newSel.id);
          setSubcategories(subs);
        }
      }
    } catch (err: any) {
      alert('Error: ' + (err.message ?? err));
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────
  const deleteCategory = async (cat: Category) => {
    if (!confirm(`Delete category "${cat.name}" and ALL its subcategories?`)) return;
    await supabase.from('categories').delete().eq('id', cat.id);
    if (selectedCat?.id === cat.id) { setSelectedCat(null); setSubcategories([]); }
    setCategories(c => c.filter(x => x.id !== cat.id));
  };

  const deleteSubcategory = async (sub: Subcategory) => {
    if (!confirm(`Delete subcategory "${sub.name}"?`)) return;
    await supabase.from('subcategories').delete().eq('id', sub.id);
    setSubcategories(s => s.filter(x => x.id !== sub.id));
  };

  // ── Upload ─────────────────────────────────────────────
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `cat-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('assets').upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(path);
      setFormImage(publicUrl);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Category Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Manage categories and subcategories for your catalog</p>
        </div>
        <button
          onClick={() => openAdd('category')}
          className="flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Left: Categories ── */}
        <div className="bg-navy-900 rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-gold-400" />
              <h2 className="font-bold text-white text-sm uppercase tracking-widest">Categories</h2>
            </div>
            <span className="text-xs text-gray-500">{categories.length} total</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gold-400" /></div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No categories yet.<br />Click "New Category" to start.</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {categories.map(cat => (
                <li
                  key={cat.id}
                  onClick={() => loadSubs(cat)}
                  className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors group ${selectedCat?.id === cat.id ? 'bg-gold-400/10 border-l-2 border-gold-400' : 'hover:bg-navy-800'}`}
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-xl bg-navy-800 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {cat.image
                      ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      : <FolderOpen className="w-5 h-5 text-white/20" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{cat.name}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{cat.slug}</p>
                  </div>
                  <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button onClick={() => openEdit('category', cat)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteCategory(cat)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-600 flex-shrink-0 transition-transform ${selectedCat?.id === cat.id ? 'text-gold-400 rotate-90' : ''}`} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Right: Subcategories ── */}
        <div className="bg-navy-900 rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-white/5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Tag className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <h2 className="font-bold text-white text-xs sm:text-sm uppercase tracking-widest truncate">
                {selectedCat ? `${selectedCat.name} → Subcategories` : 'Subcategories'}
              </h2>
            </div>
            {selectedCat && (
              <button
                onClick={() => openAdd('subcategory', selectedCat)}
                className="flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 font-bold uppercase tracking-widest"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            )}
          </div>

          {!selectedCat ? (
            <div className="text-center py-16 text-gray-600">
              <ChevronRight className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Select a category on the left<br />to manage its subcategories.</p>
            </div>
          ) : subcategories.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No subcategories yet.<br />Click "+ Add" above.</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {subcategories.map(sub => (
                <li key={sub.id} className="flex items-center gap-4 px-6 py-4 hover:bg-navy-800 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-navy-800 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {sub.image
                      ? <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      : <Tag className="w-5 h-5 text-white/20" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{sub.name}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{sub.slug}</p>
                  </div>
                  <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit('subcategory', sub, selectedCat)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteSubcategory(sub)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {modal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm"
              onClick={() => !saving && setModal(EMPTY_MODAL)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative bg-navy-900 border border-gold-400/20 rounded-3xl shadow-2xl w-full max-w-md p-8 z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl font-bold text-white">
                  {modal.editing ? 'Edit' : 'New'} {modal.mode === 'category' ? 'Category' : 'Subcategory'}
                  {modal.parentCategory && <span className="text-gold-400 text-base font-normal"> · {modal.parentCategory.name}</span>}
                </h3>
                <button onClick={() => setModal(EMPTY_MODAL)} className="p-2 rounded-full hover:bg-navy-800 text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-white/50 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className={inputCls}
                    placeholder={modal.mode === 'category' ? 'e.g. Mangalsutra' : 'e.g. Mangalsutra Pota Mina'}
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-white/50 mb-2">Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formImage}
                      onChange={e => setFormImage(e.target.value)}
                      className={inputCls}
                      placeholder="https://..."
                    />
                    <label className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-navy-800 border border-white/10 rounded-xl cursor-pointer hover:bg-navy-700 transition-colors text-gray-400 ${uploading ? 'opacity-50' : ''}`}>
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                      <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleUpload} />
                    </label>
                  </div>
                  {formImage && (
                    <div className="mt-3 w-20 h-20 rounded-xl border border-white/10 overflow-hidden bg-navy-800">
                      <img src={formImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-white/50 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={e => setFormOrder(Number(e.target.value))}
                    className={inputCls}
                    min={0}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setModal(EMPTY_MODAL)} disabled={saving} className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-2.5 bg-gold-400 hover:bg-gold-500 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {modal.editing ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
