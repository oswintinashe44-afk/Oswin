import React from 'react';
import Navigation from './Navigation';
import { User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark selection:bg-brand-orange/20">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-6 h-full flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-lg bg-brand-orange flex items-center justify-center shadow-sm">
              <span className="font-display font-black text-xl text-white">H</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:inline">
              HustleHub <span className="text-brand-orange">Market</span>
            </span>
          </motion.div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-1.5 text-xs gap-2">
                <span className="text-gray-500 font-bold uppercase">Ship to: International</span>
             </div>
             
             <motion.button 
               whileTap={{ scale: 0.95 }}
               className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-colors hover:bg-gray-200"
             >
                <User className="w-5 h-5 text-gray-600" />
             </motion.button>
          </div>
        </div>
      </header>
      
      {/* Main Content with Route Transitions */}
      <main className="max-w-screen-xl mx-auto pt-24 pb-32 px-4 sm:px-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Navigation */}
      <Navigation />
    </div>
  );
}
