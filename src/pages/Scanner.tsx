import React, { useState, useRef } from 'react';
import { Camera, RefreshCw, Upload, Sparkles, CheckCircle2, Bot, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '@/services/geminiService';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Scanner() {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        handleAnalyze(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (imgData: string) => {
    setAnalyzing(true);
    setResult(null);
    try {
      const analysis = await geminiService.analyzeProductImage(imgData);
      setResult(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-display font-black tracking-tight italic">
          AI <span className="text-brand-orange">Visual</span> Scanner
        </h1>
        <p className="text-gray-500 font-medium">Point, scan, and list in 3 seconds.</p>
      </div>

      <div className="relative aspect-square sm:aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm group">
        {image ? (
          <img src={image} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center gap-6">
             <div className="w-24 h-24 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-brand-orange animate-pulse">
                <Camera className="w-10 h-10" />
             </div>
             <div>
                <p className="font-bold text-lg">Awaiting Input</p>
                <p className="text-xs text-gray-500 font-medium max-w-[200px]">Use your camera or upload a photo to start AI analysis.</p>
             </div>
          </div>
        )}
        
        {/* Scanning Animation Overlay */}
        <AnimatePresence>
          {analyzing && (
            <motion.div 
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-brand-orange shadow-[0_0_20px_#FF6A00] z-20"
            />
          )}
        </AnimatePresence>

        <div className="absolute bottom-10 left-0 right-0 px-10 flex gap-4">
           <input 
             type="file" 
             accept="image/*" 
             capture="environment" 
             className="hidden" 
             ref={fileInputRef}
             onChange={handleCapture}
           />
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="flex-1 h-16 rounded-3xl bg-white text-brand-dark font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
           >
              <Camera className="w-6 h-6" />
              Scan Now
           </button>
        </div>
      </div>

      {/* Analysis Results */}
      <AnimatePresence>
        {(analyzing || result) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-brand-orange" />
                <h2 className="font-bold uppercase text-xs tracking-widest text-gray-400">AI Listing Agent</h2>
              </div>
              {analyzing ? (
                <div className="flex items-center gap-2 text-brand-orange text-[10px] font-black uppercase">
                  <Loader2 className="w-3 h-3 animate-spin" /> Analyzing 
                </div>
              ) : (
                <CheckCircle2 className="w-5 h-5 text-brand-orange" />
              )}
            </div>

            {result && (
              <div className="space-y-4">
                <div>
                   <h3 className="text-xl font-display font-black text-brand-dark">{result.title}</h3>
                   <div className="flex gap-2 mt-2">
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                         {result.category}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[10px] font-bold text-brand-orange uppercase tracking-tighter">
                         Est. {result.priceRange}
                      </span>
                   </div>
                </div>
                
                <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
                  "{result.description}"
                </p>

                <button 
                  onClick={() => navigate('/sell', { state: { result } })}
                  className="w-full h-12 rounded-2xl bg-brand-orange text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all group"
                >
                  Create Listing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 glass-panel rounded-3xl space-y-2 border-white/5">
           <Sparkles className="w-6 h-6 text-brand-orange" />
           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Smart Vision</p>
           <p className="text-[10px] text-gray-600">Auto-identifies items with 98% accuracy.</p>
        </div>
        <div className="p-6 glass-panel rounded-3xl space-y-2 border-white/5">
           <Upload className="w-6 h-6 text-blue-400" />
           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Instant Upload</p>
           <p className="text-[10px] text-gray-600">Saves metadata directly to your drafts.</p>
        </div>
      </div>
    </div>
  );
}
