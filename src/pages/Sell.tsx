import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Package, DollarSign, Image as ImageIcon, Tag, Upload, ArrowLeft, Bot, Sparkles, Camera, Percent } from 'lucide-react';
import { motion } from 'motion/react';
import { marketplaceService } from '@/services/marketplaceService';
import { cn } from '@/lib/utils';

export default function Sell() {
  const navigate = useNavigate();
  const location = useLocation();
  const scannerData = location.state?.result;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    image: '',
  });

  useEffect(() => {
    if (scannerData) {
      setFormData(prev => ({
        ...prev,
        name: scannerData.title || '',
        category: scannerData.category || 'Electronics',
        description: scannerData.description || '',
        price: (scannerData.priceRange?.match(/\d+/)?.[0]) || '',
      }));
    }
  }, [scannerData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await marketplaceService.addProduct({
        ...formData,
        price: parseFloat(formData.price),
      });
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Failed to list product. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAICompose = () => {
    // Placeholder for AI feature integration
    setFormData(prev => ({
      ...prev,
      description: "AI-Generated: This premium product is designed for efficiency and style. Features top-tier build quality and smart integration capabilities. Perfect for professionals and enthusiasts alike."
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 shadow-sm">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <h1 className="text-3xl font-display font-black uppercase italic tracking-tighter text-skew">List a <span className="text-brand-orange">Product</span></h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-8 rounded-3xl space-y-6 border border-gray-100 shadow-sm">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400 tracking-widest pl-1">Product Name</label>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl h-14 pl-12 pr-4 outline-none focus:border-brand-orange/50 focus:bg-white transition-all text-brand-dark font-medium"
                placeholder="e.g. Vintage Camera"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase text-gray-400 tracking-widest pl-1">Price ($)</label>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                  <Percent className="w-3 h-3 text-brand-orange" /> 15% Fee
                </div>
              </div>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  required
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl h-14 pl-12 pr-4 outline-none focus:border-brand-orange/50 focus:bg-white transition-all font-mono text-brand-dark"
                  placeholder="0.00"
                />
              </div>
              {formData.price && (
                <div className="px-2 text-[10px] font-medium text-gray-400">
                  Payout: <span className="text-brand-orange font-bold">${(parseFloat(formData.price) * 0.85).toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400 tracking-widest pl-1">Category</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl h-14 pl-12 pr-4 outline-none focus:border-brand-orange/50 focus:bg-white appearance-none transition-all text-brand-dark font-medium cursor-pointer"
                >
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home</option>
                  <option>Services</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Description</label>
              <button 
                type="button" 
                onClick={handleAICompose}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase text-brand-orange hover:opacity-80 transition-opacity"
              >
                <Bot className="w-3 h-3" />
                AI Assist
              </button>
            </div>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:border-brand-orange/50 focus:bg-white transition-all resize-none text-brand-dark font-medium"
              placeholder="Tell your buyers about this item..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400 tracking-widest pl-1">Product Media</label>
            <div className="grid grid-cols-1 gap-4">
              {/* Image Preview / Upload Area */}
              <div 
                className={cn(
                  "relative aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden bg-gray-50",
                  formData.image ? "border-brand-orange/50" : "border-gray-200 hover:border-gray-300"
                )}
              >
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center border border-gray-200 text-red-500 shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4 rotate-45" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-500">No image selected</p>
                      <p className="text-xs text-gray-400">Add an image to stand out</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                {/* Hidden File Inputs */}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  id="camera-input"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, image: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  id="gallery-input"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, image: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />

                <div className="flex gap-2 flex-1">
                  <button
                    type="button"
                    onClick={() => document.getElementById('camera-input')?.click()}
                    className="flex-1 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <Camera className="w-5 h-5 text-brand-orange" />
                    Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('gallery-input')?.click()}
                    className="flex-1 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                    Gallery
                  </button>
                </div>

                <div className="flex-[1.5] relative mt-2 sm:mt-0">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[10px] uppercase tracking-tighter">URL</span>
                  <input
                    value={formData.image.startsWith('data:') ? '' : formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 outline-none focus:border-brand-orange/50 focus:bg-white text-sm text-brand-dark font-medium"
                    placeholder="or paste link..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-16 rounded-2xl bg-brand-orange hover:opacity-90 text-white font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg shadow-brand-orange/20 disabled:opacity-50"
        >
          {loading ? 'Listing...' : (
            <>
              <Upload className="w-6 h-6" />
              List Item Now
            </>
          )}
        </button>

        <div className="flex items-center gap-3 justify-center text-gray-400 font-medium">
           <Sparkles className="w-4 h-4 text-brand-orange" />
           <p className="text-xs">AI will optimize your listing for maximum reach.</p>
        </div>
      </form>
    </div>
  );
}
