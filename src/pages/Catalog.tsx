import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useGoldRate } from '../hooks/useGoldRate';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Search, Eye, Zap, ChevronRight, Home, LayoutGrid } from 'lucide-react';
import { ProductModal } from '../components/ProductModal';
import { fetchCategories, fetchSubcategories, Category, Subcategory } from '../lib/categories';

interface Product {
  id: string;
  title: string;
  description: string;
  weightInGrams: number;
  makingCharge: number;
  chargeType: 'flat' | 'percentage';
  goldKarat: '22K';
  images: string[];
  popularityScore: number;
  category: string;
  subCategory: string;
  isHidden: boolean;
  isOutofStock: boolean;
  stockQuantity: number;
}

type View = 'subcategories' | 'products';

export default function Catalog() {
  const { rate, loading: rateLoading } = useGoldRate();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation state
  const [view, setView] = useState<View>('subcategories');
  const [activeCat, setActiveCat] = useState<Category | null>(null);
  const [activeSub, setActiveSub] = useState<Subcategory | null>(null);

  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProds, setLoadingProds] = useState(false);

  // Filters (only in products view)
  const [sortParam, setSortParam] = useState<'popular' | 'price_asc' | 'price_desc'>('popular');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock'>('in_stock');

  // Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ── Handle incoming direct product link ─────────────────────────────
  useEffect(() => {
    const openProductId = location.state?.openProductId;
    if (openProductId) {
      // Fetch this specific product and open the modal
      supabase
        .from('products')
        .select('*')
        .eq('id', openProductId)
        .single()
        .then(({ data }) => {
          if (data) {
            setSelectedProduct(data as Product);
          }
          // Clear the state so it doesn't re-open on refresh
          navigate(location.pathname, { replace: true, state: {} });
        });
    }
  }, [location.state, location.pathname, navigate]);

  // ── Load categories & subcategories on mount ───────────────────────────
  useEffect(() => {
    Promise.all([
      fetchCategories().then(setCategories),
      fetchSubcategories().then(setSubcategories)
    ]).finally(() => setLoadingCats(false));
  }, []);

  const visibleSubcategories = useMemo(() => {
    if (!activeCat) return subcategories;
    return subcategories.filter(s => s.category_id === activeCat.id);
  }, [subcategories, activeCat]);

  // ── Load products when entering product view ──────────
  useEffect(() => {
    if (view !== 'products' || !activeSub) return;
    setLoadingProds(true);
    async function load() {
      let query = supabase
        .from('products')
        .select('*')
        .eq('isHidden', false)
        .eq('subCategory', activeSub!.name);

      const parentCat = categories.find(c => c.id === activeSub!.category_id);
      if (parentCat) {
        query = query.eq('category', parentCat.name);
      }

      const { data } = await query;
      setProducts((data ?? []) as Product[]);
      setLoadingProds(false);
    }
    load();
  }, [view, activeSub, categories]);

  // ── Price calc ────────────────────────────────────────
  const calculatePrice = (p: Product) => {
    const base = p.weightInGrams * rate.rate22k;
    const making = p.chargeType === 'flat' ? p.makingCharge : base * (p.makingCharge / 100);
    return Math.round(base + making);
  };

  // ── Sort/filter products ──────────────────────────────
  const filtered = useMemo(() => {
    let r = [...products];
    if (stockFilter === 'in_stock') r = r.filter(p => !p.isOutofStock);
    r.sort((a, b) => {
      if (sortParam === 'popular') return (b.popularityScore || 0) - (a.popularityScore || 0);
      const pa = calculatePrice(a), pb = calculatePrice(b);
      return sortParam === 'price_asc' ? pa - pb : pb - pa;
    });
    return r;
  }, [products, stockFilter, sortParam, rate.rate22k]);

  // ── Navigation helpers ────────────────────────────────
  const goToSubcategory = (sub: Subcategory) => {
    setActiveSub(sub);
    setView('products');
  };

  // ─────────────────────────────────────────────────────
  //  SHARED: Breadcrumb
  // ─────────────────────────────────────────────────────
  const Breadcrumb = () => (
    <nav className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold mb-8 flex-wrap">
      <button onClick={() => { setView('subcategories'); setActiveSub(null); }}
        className="flex items-center gap-1 text-gray-500 hover:text-gold-400 transition-colors">
        <Home className="w-3 h-3" /> Catalog
      </button>
      {activeSub && (
        <>
          <ChevronRight className="w-3 h-3 text-gray-600" />
          <span className="text-white">{activeSub.name}</span>
        </>
      )}
    </nav>
  );

  // ─────────────────────────────────────────────────────
  //  VIEW: Subcategories (Main Catalog View)
  // ─────────────────────────────────────────────────────
  const SubcategoriesView = (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-white mb-2">Our Catalog</h1>
        <p className="text-gray-400">Choose a style to explore</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Live Rates
          </span>
          {!rateLoading && rate.rate22k > 0 && (
            <span className="text-[10px] text-gray-500">22K: <span className="text-white font-semibold">₹{rate.rate22k.toLocaleString('en-IN')}/g</span></span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-10">
        <button
          onClick={() => setActiveCat(null)}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
            activeCat === null 
              ? 'bg-gold-400 text-navy-950' 
              : 'bg-navy-900 text-gray-400 border border-white/10 hover:border-gold-400/50 hover:text-gold-400'
          }`}
        >
          All Items
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
              activeCat?.id === cat.id 
                ? 'bg-gold-400 text-navy-950' 
                : 'bg-navy-900 text-gray-400 border border-white/10 hover:border-gold-400/50 hover:text-gold-400'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loadingCats ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gold-400" /></div>
      ) : visibleSubcategories.length === 0 ? (
        <div className="text-center py-20 bg-navy-900/50 rounded-3xl border border-white/5">
          <LayoutGrid className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-white font-medium mb-2">No styles found</h3>
          <p className="text-gray-500 text-sm">Select a different category or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Subcategory tiles */}
          {visibleSubcategories.map((sub, i) => (
            <motion.button
              key={sub.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              onClick={() => goToSubcategory(sub)}
              className="group relative rounded-3xl overflow-hidden aspect-square bg-navy-900 border border-white/10 hover:border-gold-400/50 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_32px_rgba(253,179,82,0.1)] cursor-pointer text-left flex flex-col"
            >
              {sub.image ? (
                <img src={sub.image} alt={sub.name} referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LayoutGrid className="w-10 h-10 text-white/10" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-serif font-bold text-white text-base leading-tight">{sub.name}</p>
                {/* Find category name for display */}
                <span className="text-[9px] uppercase tracking-widest text-gold-400 font-bold block mt-1">
                  {categories.find(c => c.id === sub.category_id)?.name}
                </span>
                <div className="flex items-center gap-1 mt-2 text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] uppercase tracking-widest font-bold">Browse</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────
  //  VIEW: Products
  // ─────────────────────────────────────────────────────
  const ProductsView = (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumb />

      {/* Header + filters */}
      <div className="flex flex-col md:flex-row justify-between mb-8 items-start md:items-center border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-1">
            {activeSub?.name}
          </h1>
          <p className="text-gray-400 text-sm">
            {filtered.length} item{filtered.length !== 1 ? 's' : ''} · live pricing
          </p>
        </div>

        <div className="mt-6 md:mt-0 flex flex-wrap gap-3">
          {/* Stock */}
          <div className="flex items-center gap-2 bg-navy-900 px-4 py-2.5 border border-white/10 rounded-lg">
            <span className="text-gold-400 text-sm font-semibold">Stock</span>
            <span className="text-white/20">|</span>
            <select
              className="bg-navy-900 border-none outline-none text-sm font-medium text-white cursor-pointer"
              style={{ colorScheme: 'dark' }}
              value={stockFilter}
              onChange={e => setStockFilter(e.target.value as any)}
            >
              <option value="in_stock" style={{ background: '#0a1e35' }}>In Stock</option>
              <option value="all" style={{ background: '#0a1e35' }}>All</option>
            </select>
          </div>
          {/* Sort */}
          <div className="flex items-center gap-2 bg-navy-900 px-4 py-2.5 border border-white/10 rounded-lg">
            <span className="text-gold-400 text-sm font-semibold">Sort</span>
            <span className="text-white/20">|</span>
            <select
              className="bg-navy-900 border-none outline-none text-sm font-medium text-white cursor-pointer"
              style={{ colorScheme: 'dark' }}
              value={sortParam}
              onChange={e => setSortParam(e.target.value as any)}
            >
              <option value="popular" style={{ background: '#0a1e35' }}>Popularity</option>
              <option value="price_asc" style={{ background: '#0a1e35' }}>Price: Low → High</option>
              <option value="price_desc" style={{ background: '#0a1e35' }}>Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products grid */}
      {loadingProds ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gold-400" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-white font-medium">No products found</h3>
          <p className="text-gray-500 mt-2">Try a different filter or check back later.</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product, idx) => {
              const price = calculatePrice(product);
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-navy-900 group rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gold-400/20 flex flex-col cursor-pointer hover:border-gold-400/50 hover:shadow-[0_10px_40px_rgba(253,179,82,0.08)] transition-all duration-300"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] bg-navy-800 overflow-hidden relative border-b border-white/5">
                    {product.images?.length > 0 ? (
                      <img src={product.images[0]} alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs uppercase tracking-widest">No Image</div>
                    )}
                    {product.images?.length > 1 && (
                      <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full font-bold">
                        +{product.images.length - 1} more
                      </div>
                    )}
                    <div className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow bg-gold-400/20 border border-gold-400/50 text-gold-300">
                      {product.goldKarat}
                    </div>
                    <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </div>
                    </div>
                    {product.isOutofStock && (
                      <div className="absolute inset-0 bg-navy-900/60 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-black/90 text-white px-4 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-lg">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-lg text-white group-hover:text-gold-400 transition-colors">{product.title}</h3>
                      <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                        <span className="text-[10px] border border-gold-400 text-gold-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">{product.category}</span>
                        {product.subCategory && (
                          <span className="text-[10px] text-gray-500 px-2 py-0.5">{product.subCategory}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-4 flex-1">{product.description}</p>
                    <div className="border-t border-dashed border-gold-400/20 pt-4 mt-auto">
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">
                            <Zap className="w-2.5 h-2.5 text-emerald-400" /> Live Est.
                          </span>
                          {rate.rate22k > 0 ? (
                            <span className="font-serif text-xl font-bold text-gold-400">₹{price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Awaiting Rate</span>
                          )}
                        </div>
                        <div className="text-right flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Weight</span>
                          <span className="text-sm font-medium text-white">{product.weightInGrams}g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}

    </div>
  );

  // ─────────────────────────────────────────────────────
  //  SINGLE RETURN — modal is always mounted at root level
  //  so it can open regardless of which view is active
  // ─────────────────────────────────────────────────────
  return (
    <>
      {view === 'subcategories' ? SubcategoriesView : ProductsView}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          price={calculatePrice(selectedProduct)}
          rate22k={rate.rate22k}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
