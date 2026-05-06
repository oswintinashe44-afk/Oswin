import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, ArrowRight, Zap, TrendingUp, Star, Loader2, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { marketplaceService } from '@/services/marketplaceService';
import { Product } from '@/types';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Electronics', icon: '💻', count: '1.2k' },
  { name: 'Fashion', icon: '👕', count: '850' },
  { name: 'Home', icon: '🏠', count: '420' },
  { name: 'Automotive', icon: '🚗', count: '210' },
];

import MarketDepthChart from '@/components/MarketDepthChart';

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await marketplaceService.getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleBuy = async (product: Product) => {
    setBuyingId(product.id);
    try {
      await marketplaceService.createOrder(product);
      alert('Order placed successfully! Check your chat for updates.');
    } catch (err) {
      console.error(err);
      alert('Transaction failed. Check if you are logged in.');
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Hero Section */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
          <div className="flex-1 space-y-5">
             <div className="inline-flex px-3 py-1 bg-orange-100 text-brand-orange text-[10px] font-black uppercase rounded-full">
                Global Wholesale Platform
             </div>
             <h1 className="text-4xl font-display font-black leading-tight text-brand-dark">
                Trade with <br /> 
                <span className="text-brand-orange">verified agents.</span>
             </h1>
             <div className="relative group max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-orange transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search products or suppliers..." 
                  className="w-full h-16 bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 outline-none focus:border-brand-orange focus:bg-white transition-all shadow-sm"
                />
             </div>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={() => navigate('/sell')}
               className="px-6 py-3 bg-brand-orange text-white rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-brand-orange/20"
             >
               Start Selling
             </button>
             <button 
               onClick={() => navigate('/scan')}
               className="px-6 py-3 bg-white border border-gray-200 text-brand-dark rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 active:scale-95 transition-all shadow-sm flex items-center gap-2"
             >
               AI Scan
             </button>
          </div>
          <div className="hidden md:flex w-64 h-64 bg-orange-50 rounded-3xl items-center justify-center">
             <ShoppingBag className="w-24 h-24 text-brand-orange/10" />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-orange/5 to-transparent pointer-events-none" />
      </section>

      {/* Main Grid: Categories + Product Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <aside className="lg:col-span-1 hidden lg:block space-y-4">
           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-4">Industries</h3>
              <div className="space-y-4">
                 {CATEGORIES.map(cat => (
                   <button key={cat.name} className="w-full flex items-center justify-between group">
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-600 group-hover:text-brand-orange transition-colors">
                         <span className="text-xl">{cat.icon}</span>
                         <span>{cat.name}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-orange group-hover:translate-x-1 transition-all" />
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-orange" />
                <h3 className="font-bold text-sm text-brand-dark uppercase tracking-widest">Seller Hub</h3>
              </div>
              <p className="text-[10px] text-gray-500 font-medium">Use AI to automate your sales and reach buyers globally.</p>
              <button 
                onClick={() => navigate('/sell')}
                className="w-full py-3 bg-brand-dark text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-orange transition-colors"
              >
                List a Product
              </button>
           </div>
           
           <div className="bg-brand-orange rounded-2xl p-6 text-white space-y-3 shadow-lg shadow-brand-orange/20">
              <h4 className="font-bold">Trade Assurance</h4>
              <p className="text-[10px] leading-relaxed opacity-90">100% Protection for your orders and peace of mind.</p>
              <button className="text-[10px] font-black uppercase tracking-widest border border-white/30 px-3 py-1.5 rounded-lg">Learn More</button>
           </div>
        </aside>

        {/* Product Feed */}
        <div className="lg:col-span-3 space-y-6">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-display font-black text-brand-dark uppercase tracking-tight italic">Weekly <span className="text-brand-orange">Selection</span></h2>
              <div className="flex gap-2">
                 <button className="p-2 bg-white rounded-xl border border-gray-100"><SlidersHorizontal className="w-4 h-4" /></button>
              </div>
           </div>

           {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-72 bg-white animate-pulse rounded-2xl border border-gray-100" />
                ))}
             </div>
           ) : (
             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ y: -6 }}
                    className="marketplace-card flex flex-col group overflow-hidden"
                  >
                    <div className="aspect-[4/5] relative overflow-hidden bg-gray-50 border-b border-gray-50">
                      <img 
                        src={product.image || 'https://images.unsplash.com/photo-1512446733611-9099a758e89c?auto=format&fit=crop&q=80&w=400'} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[9px] font-bold text-gray-500 uppercase">
                         {product.category}
                      </div>
                    </div>
                    <div className="p-5 space-y-3 flex-1 flex flex-col">
                       <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem] group-hover:text-brand-orange transition-colors">
                         {product.name}
                       </h3>
                       <div className="mt-auto">
                          <div className="flex items-baseline gap-1">
                             <span className="text-xs text-gray-400 font-bold">$</span>
                             <span className="text-xl font-bold text-brand-dark">{product.price}</span>
                             <span className="text-[10px] text-gray-400 font-medium italic">/ unit</span>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">Min. order: 1 piece</p>
                          
                          <button 
                            onClick={() => handleBuy(product)}
                            disabled={buyingId === product.id}
                            className="w-full h-11 mt-4 bg-brand-orange text-white rounded-xl font-bold text-xs shadow-lg shadow-brand-orange/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                             {buyingId === product.id ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Inquiry Now'}
                          </button>
                       </div>
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
