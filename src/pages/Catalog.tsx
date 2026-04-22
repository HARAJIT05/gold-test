import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useGoldRate } from '../hooks/useGoldRate';
import { motion } from 'motion/react';
import { Filter, Loader2, Search, Eye, Zap } from 'lucide-react';
import { ProductModal } from '../components/ProductModal';

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
  isHidden: boolean;
  isOutofStock: boolean;
  stockQuantity: number;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { rate, loading: rateLoading } = useGoldRate();

  const [sortParam, setSortParam] = useState<'popular' | 'price_asc' | 'price_desc'>('popular');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('in_stock');

  // Product detail modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await supabase.from('products').select('*').eq('isHidden', false);
        if (data) setProducts(data as Product[]);
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Karat-aware price calculation — uses live rate from useGoldRate (real-time)
  const calculatePrice = (p: Product) => {
    const karat = p.goldKarat || '22K';
    const baseRate = rate.rate22k;
    const baseGoldPrice = p.weightInGrams * baseRate;
    const makingTotal =
      p.chargeType === 'flat' ? p.makingCharge : baseGoldPrice * (p.makingCharge / 100);
    return Math.round(baseGoldPrice + makingTotal);
  };

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredAndSorted = useMemo(() => {
    let result = [...products];
    if (categoryFilter !== 'All') result = result.filter((p) => p.category === categoryFilter);
    if (stockFilter === 'in_stock') result = result.filter((p) => !p.isOutofStock);
    else if (stockFilter === 'out_of_stock') result = result.filter((p) => p.isOutofStock);
    result.sort((a, b) => {
      if (sortParam === 'popular') return (b.popularityScore || 0) - (a.popularityScore || 0);
      const priceA = calculatePrice(a);
      const priceB = calculatePrice(b);
      return sortParam === 'price_asc' ? priceA - priceB : priceB - priceA;
    });
    return result;
  }, [products, categoryFilter, stockFilter, sortParam, rate.rate22k]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row justify-between mb-8 items-start md:items-center border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2">Our Catalog</h1>
          <p className="text-gray-400">
            Discover our masterpiece collection with live pricing.
            <span className="ml-2 text-[11px] text-gold-400 uppercase tracking-widest font-semibold">
              Click any item to view details
            </span>
          </p>
          {/* Live rate indicator */}
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Live Rates
            </span>
            {!rateLoading && rate.rate22k > 0 && (
              <>
                <span className="text-[10px] text-gray-500">22K: <span className="text-white font-semibold">₹{rate.rate22k.toLocaleString('en-IN')}/g</span></span>
              </>
            )}
            {rateLoading && <Loader2 className="w-3 h-3 animate-spin text-gray-500" />}
          </div>
        </div>

        <div className="mt-6 md:mt-0 flex flex-wrap gap-3 items-center">
          {/* Category Filter */}
          <div className="flex items-center gap-2 bg-navy-900 px-4 py-2.5 border border-white/10 rounded-lg">
            <Filter className="w-4 h-4 text-gold-400 shrink-0" />
            <select
              className="bg-navy-900 border-none outline-none text-sm font-medium text-white cursor-pointer [&>option]:bg-navy-900 [&>option]:text-white"
              style={{ colorScheme: 'dark' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c} style={{ background: '#0a1e35', color: 'white' }}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="flex items-center gap-2 bg-navy-900 px-4 py-2.5 border border-white/10 rounded-lg">
            <span className="text-gold-400 text-sm font-semibold">Stock</span>
            <span className="text-white/20">|</span>
            <select
              className="bg-navy-900 border-none outline-none text-sm font-medium text-white cursor-pointer [&>option]:bg-navy-900 [&>option]:text-white"
              style={{ colorScheme: 'dark' }}
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
            >
              <option value="in_stock" style={{ background: '#0a1e35', color: 'white' }}>In Stock Only</option>
              <option value="all" style={{ background: '#0a1e35', color: 'white' }}>All Products</option>
              <option value="out_of_stock" style={{ background: '#0a1e35', color: 'white' }}>Out of Stock</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2 bg-navy-900 px-4 py-2.5 border border-white/10 rounded-lg">
            <span className="text-gold-400 text-sm font-semibold">Sort</span>
            <span className="text-white/20">|</span>
            <select
              className="bg-navy-900 border-none outline-none text-sm font-medium text-white cursor-pointer [&>option]:bg-navy-900 [&>option]:text-white"
              style={{ colorScheme: 'dark' }}
              value={sortParam}
              onChange={(e) => setSortParam(e.target.value as any)}
            >
              <option value="popular" style={{ background: '#0a1e35', color: 'white' }}>Popularity</option>
              <option value="price_asc" style={{ background: '#0a1e35', color: 'white' }}>Price: Low → High</option>
              <option value="price_desc" style={{ background: '#0a1e35', color: 'white' }}>Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-white font-medium">No results found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSorted.map((product, idx) => {
            const price = calculatePrice(product);
            const karat = product.goldKarat || '22K';
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
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs uppercase tracking-widest">
                      No Image
                    </div>
                  )}

                  {/* Multiple images indicator */}
                  {product.images?.length > 1 && (
                    <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full font-bold tracking-wide">
                      +{product.images.length - 1} more
                    </div>
                  )}

                  {/* Karat badge */}
                  <div className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow bg-gold-400/20 border border-gold-400/50 text-gold-300">
                    {karat}
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </div>
                  </div>

                  {product.isOutofStock && (
                    <div className="absolute inset-0 bg-navy-900/60 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-black/90 text-white px-4 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-lg text-white group-hover:text-gold-400 transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                      <span className="text-[10px] border border-gold-400 text-gold-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                        {product.category}
                      </span>
                      <span className={`text-[10px] font-medium ${product.stockQuantity > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                        {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-4 flex-1">
                    {product.description}
                  </p>

                  <div className="border-t border-dashed border-gold-400/20 pt-4 mt-auto">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">
                          <Zap className="w-2.5 h-2.5 text-emerald-400" />
                          Live Est. · {karat}
                        </span>
                        {rate.rate22k > 0 ? (
                          <span className="font-serif text-xl font-bold text-gold-400">
                            ₹{price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                            Awaiting Rate
                          </span>
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
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          price={calculatePrice(selectedProduct)}
          rate22k={rate.rate22k}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
