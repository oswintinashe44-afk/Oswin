import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DollarSign, TrendingUp, ArrowUpRight, Wallet, PieChart, Info, Percent, X, Building, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function Commissioning() {
  const { profile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState(1);
  const [amount, setAmount] = useState('');
  
  const stats = [
    { label: 'Total Revenue', value: '$1,240.50', icon: DollarSign, color: 'text-brand-orange' },
    { label: 'Net Earnings', value: '$1,054.43', icon: Wallet, color: 'text-blue-500' },
    { label: 'Project Fees', value: '$186.07', icon: Percent, color: 'text-brand-blue' },
  ];

  const transactions = [
    { id: '1', type: 'Delivery Commission', amount: '+$12.40', date: '2 hours ago', status: 'Settled' },
    { id: '2', type: 'Marketplace Sale', amount: '+$45.00', date: '5 hours ago', status: 'Pending' },
    { id: '3', type: 'Network Sustain Fee', amount: '-$1.20', date: 'Yesterday', status: 'Settled' },
  ];

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsWithdrawing(true);
    // Simmons network latency for "Secure Settlement"
    await new Promise(resolve => setTimeout(resolve, 2000));
    setWithdrawStep(3);
    setIsWithdrawing(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setWithdrawStep(1);
      setAmount('');
    }, 500);
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-start justify-between px-2">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-brand-orange text-[10px] font-black uppercase tracking-widest">
             <PieChart className="w-3 h-3" /> Financial Sector
          </div>
          <h1 className="text-4xl font-display font-black tracking-tighter uppercase italic">
            Commission <span className="text-brand-orange">Ledger</span>
          </h1>
          <p className="text-gray-500 font-medium text-xs">Real-time breakdown of your project earnings and network contributions.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-4 px-4 py-3 rounded-2xl bg-brand-orange text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-orange/20"
        >
          Withdraw <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-brand-black/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white p-8 rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden"
            >
              {/* Progress Bar for Steps */}
              {withdrawStep < 3 && (
                <div className="absolute top-0 left-0 right-0 h-1 flex bg-gray-50">
                  <div className={cn("h-full transition-all duration-500 bg-brand-orange", withdrawStep === 1 ? 'w-1/2' : 'w-full')} />
                </div>
              )}

              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {withdrawStep === 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-display font-black tracking-tighter uppercase italic text-brand-dark">Phase 1: <span className="text-brand-orange">Limit</span></h3>
                    <p className="text-xs text-gray-400 font-medium">Select amount to transfer from net earnings.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-display font-black text-brand-orange">$</div>
                      <input 
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-3xl py-8 pl-12 pr-6 text-3xl font-display font-black focus:border-brand-orange/50 focus:bg-white focus:ring-0 transition-all text-brand-dark"
                        autoFocus
                      />
                    </div>
                    <div className="flex justify-between px-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <span>Available: $1,054.43</span>
                      <button 
                        onClick={() => setAmount('1054.43')}
                        className="text-brand-orange hover:underline font-bold"
                      >
                        Max Amount
                      </button>
                    </div>
                  </div>

                  <button 
                    disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > 1054.43}
                    onClick={() => setWithdrawStep(2)}
                    className="w-full h-16 rounded-2xl bg-brand-dark text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-orange transition-colors group"
                  >
                    Confirm Amount <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {withdrawStep === 2 && (
                <motion.form 
                  onSubmit={handleWithdraw}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-display font-black tracking-tighter uppercase italic text-brand-dark">Phase 2: <span className="text-brand-orange">Target</span></h3>
                    <p className="text-xs text-gray-400 font-medium">Enter your secure banking coordinates.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="group relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange transition-colors">
                        <Building className="w-4 h-4" />
                      </div>
                      <input 
                        required
                        type="text"
                        placeholder="Bank Name"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:border-brand-orange/50 focus:bg-white transition-all text-brand-dark"
                      />
                    </div>
                    
                    <div className="group relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange transition-colors">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <input 
                        required
                        type="text"
                        placeholder="Account Number (Last 4: 8821)"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:border-brand-orange/50 focus:bg-white transition-all text-brand-dark"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-gray-400">Total Withdrawal</span>
                       <span className="text-brand-orange font-bold">${amount}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-gray-400">Transfer Fee (0%)</span>
                       <span className="text-gray-400">$0.00</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setWithdrawStep(1)}
                      className="flex-1 h-14 rounded-2xl border border-white/10 font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all"
                    >
                      Go Back
                    </button>
                    <button 
                      type="submit"
                      disabled={isWithdrawing}
                      className="flex-[2] h-14 rounded-2xl bg-brand-orange text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-brand-orange/20"
                    >
                      {isWithdrawing ? (
                        <>Processing... <Loader2 className="w-4 h-4 animate-spin" /></>
                      ) : (
                        <>Finalize Transfer <ArrowUpRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}

              {withdrawStep === 3 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 py-8"
                >
                  <div className="w-20 h-20 rounded-[2rem] bg-orange-50 flex items-center justify-center mx-auto mb-4 border border-orange-100 animate-bounce">
                    <ArrowUpRight className="w-10 h-10 text-brand-orange" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-display font-black tracking-tighter uppercase italic text-brand-orange">Success</h3>
                    <p className="text-xs text-gray-400 font-medium px-4">Transfer of <span className="text-brand-dark font-bold">${amount}</span> has been broadcast to the banking network.</p>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="w-full h-14 rounded-2xl bg-white/10 border border-white/10 font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all"
                  >
                    Return to Ledger
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-2xl bg-white/5", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{stat.label}</p>
                <p className="text-2xl font-display font-black tracking-tight">{stat.value}</p>
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
               <ArrowUpRight className="w-5 h-5 text-gray-500" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Commission Breakdown Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-display font-black uppercase tracking-tighter italic px-2">Project <span className="text-brand-orange">Sustenance</span></h2>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <p className="text-sm font-bold text-brand-dark">Standard Network Fee</p>
                 <p className="text-[10px] text-gray-400 font-medium font-sans">Project sustenance contribution</p>
              </div>
              <div className="text-2xl font-display font-black text-brand-orange">15%</div>
           </div>
           
           <div className="h-px w-full bg-gray-50" />

           <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <p className="text-sm font-bold text-brand-dark">Hustler Revenue Share</p>
                 <p className="text-[10px] text-gray-400 font-medium font-sans">Your take-home from every success</p>
              </div>
              <div className="text-2xl font-display font-black text-green-500">85%</div>
           </div>
           
           <div className="h-px w-full bg-gray-50" />
           
           <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-blue">
                 <Info className="w-3 h-3" /> Where does the fee go?
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">AI compute</p>
                    <p className="text-xs font-black text-brand-dark">45%</p>
                 </div>
                 <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Insurance</p>
                    <p className="text-xs font-black text-brand-dark">30%</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Transaction History */}
      <section className="space-y-4">
        <h2 className="text-xl font-display font-black uppercase tracking-tighter italic px-2">Recent <span className="text-brand-orange">Settlements</span></h2>
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                <div>
                  <p className="text-xs font-bold text-brand-dark">{tx.type}</p>
                  <p className="text-[10px] text-gray-400 font-medium font-sans">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn("text-xs font-black", tx.amount.startsWith('+') ? 'text-brand-orange' : 'text-red-500')}>
                  {tx.amount}
                </p>
                <p className="text-[10px] text-gray-400 uppercase font-black">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
