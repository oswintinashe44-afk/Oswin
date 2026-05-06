import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, ArrowRight, Bot } from 'lucide-react';

export default function Login() {
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError('Failed to sign in. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-brand-orange flex items-center justify-center shadow-xl shadow-brand-orange/20 rotate-3">
            <span className="font-display font-black text-4xl text-brand-dark italic">H</span>
          </div>
          <h1 className="text-4xl font-display font-black tracking-tighter uppercase italic">
            HustleHub <span className="text-brand-orange">AI</span>
          </h1>
          <p className="text-gray-500 font-medium">The world's smartest AI marketplace & delivery network.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="w-full h-14 bg-white border border-gray-200 text-brand-dark rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:bg-gray-50 active:scale-95 shadow-sm"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>
          
          <div className="flex items-center gap-2 justify-center text-[10px] uppercase font-bold tracking-[0.2em] text-gray-600">
             <div className="h-px bg-white/5 flex-1" />
             Secured by HustleShield
             <div className="h-px bg-white/5 flex-1" />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

        <div className="grid grid-cols-2 gap-3 pt-4">
          <div className="bg-white p-4 rounded-2xl text-left border border-gray-100 shadow-sm flex flex-col gap-2">
             <Zap className="w-5 h-5 text-brand-orange" />
             <p className="text-[10px] font-black uppercase text-gray-500">Fast Sales</p>
          </div>
          <div className="bg-white p-4 rounded-2xl text-left border border-gray-100 shadow-sm flex flex-col gap-2">
             <Bot className="w-5 h-5 text-brand-orange" />
             <p className="text-[10px] font-black uppercase text-gray-500">AI Managed</p>
          </div>
        </div>

        <p className="text-[10px] text-gray-600 leading-relaxed max-w-[280px] mx-auto">
          By continuing, you agree to our <span className="text-gray-400 underline">Terms of Service</span> and acknowledge you are starting your hustle journey.
        </p>
      </motion.div>
    </div>
  );
}
