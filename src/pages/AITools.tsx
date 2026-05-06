import React, { useEffect, useState } from 'react';
import { Cpu, Zap, BarChart3, ShieldCheck, Mail, ArrowRight, Bot, Sparkles, Loader2, Trophy, Star, Crown, Gift, Users, Target, Rocket, TrendingUp, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '@/services/geminiService';
import { leaderboardService } from '@/services/leaderboardService';
import { Leader } from '@/types';
import { cn } from '@/lib/utils';
import { GROWTH_PHASES } from '@/constants';

export default function AITools() {
  const [insights, setInsights] = useState<string[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [leaderFilter, setLeaderFilter] = useState<'all' | 'seller' | 'buyer'>('all');
  const [loading, setLoading] = useState(true);
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', text: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [insightsData, leadersData] = await Promise.all([
          geminiService.getHustleInsights(),
          leaderboardService.getYearlyLeaders(2026)
        ]);
        setInsights(insightsData);
        setLeaders(leadersData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim() || chatLoading) return;

    const userMessage = chatQuery.trim();
    setChatQuery('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatLoading(true);

    try {
      const response = await geminiService.askAssistant(userMessage);
      setChatHistory(prev => [...prev, { role: 'assistant', text: response || '' }]);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-32">
      <div className="space-y-4 px-2">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-brand-orange text-[10px] font-black uppercase tracking-widest"
        >
           <TrendingUp className="w-3 h-3" /> Growth Center
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-display font-black tracking-tighter uppercase italic"
        >
          Business <span className="text-brand-orange">Helper</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 max-w-sm font-medium"
        >
          Grow your shop with automated tools for pricing, trends, and smart customer support.
        </motion.p>
      </div>

      {/* Growth Phases Timeline */}
      <section className="space-y-6 px-2">
        <div className="flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] mb-1">Success Path</p>
              <h2 className="text-2xl font-display font-black tracking-tighter uppercase italic text-skew">Shop <span className="text-brand-orange">Growth</span></h2>
           </div>
           <div className="p-2 rounded-xl bg-orange-50 border border-orange-100">
              <Layers className="w-4 h-4 text-brand-orange" />
           </div>
        </div>

        <div className="flex flex-col gap-4">
          {GROWTH_PHASES.map((phase, idx) => (
            <motion.div
              key={phase.level}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "group relative p-6 rounded-2xl border transition-all overflow-hidden bg-white",
                idx === 1 ? "border-brand-orange/40 shadow-xl shadow-brand-orange/5" : "border-gray-100 opacity-60"
              )}
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                 {phase.level === 5 ? <Crown className="w-16 h-16 text-brand-orange" /> : <TrendingUp className="w-16 h-16 text-brand-orange" />}
              </div>
              
              <div className="flex items-center gap-6 relative z-10">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black text-xl italic",
                  idx === 1 ? "bg-brand-orange text-white" : "bg-gray-100 text-gray-400"
                )}>
                  {phase.level}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg text-brand-dark">{phase.name}</h3>
                    {idx === 1 && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-orange text-white text-[10px] font-black uppercase tracking-tighter">Current</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-md">{phase.description}</p>
                </div>
              </div>

              {idx === 1 && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-400">Next level progress</span>
                    <span className="text-brand-orange font-black">85%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-brand-orange shadow-sm"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
        {/* Main Tools */}
        {[
          { icon: Zap, title: 'Price Helper', desc: 'Find the best price to sell your items faster.', color: 'text-orange-500', bg: 'bg-orange-100' },
          { icon: BarChart3, title: 'Trend Finder', desc: 'See what items are going viral right now.', color: 'text-blue-500', bg: 'bg-blue-100' },
          { icon: Mail, title: 'Shop Assistant', desc: 'Auto-reply to customer questions instantly.', color: 'text-green-500', bg: 'bg-green-100' },
          { icon: ShieldCheck, title: 'Safe Trade', desc: 'Check if a buyer is trusted and safe to trade with.', color: 'text-brand-orange', bg: 'bg-orange-50' },
        ].map((tool, idx) => (
          <motion.div 
            key={tool.title} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="marketplace-card p-6 flex flex-col justify-between group hover:border-brand-orange/30 cursor-pointer active:scale-95"
          >
             <div className="space-y-4">
                <div className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center ${tool.color}`}>
                   <tool.icon className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-brand-dark">{tool.title}</h3>
                   <p className="text-xs text-gray-500 font-medium leading-relaxed">{tool.desc}</p>
                </div>
             </div>
             <button className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-brand-orange transition-colors">
                Open Setting <ArrowRight className="w-3 h-3" />
             </button>
          </motion.div>
        ))}
      </div>

      {/* Yearly Hall of Fame */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-2">
           <div>
              <p className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] mb-1">Top Sellers</p>
              <h2 className="text-3xl font-display font-black tracking-tighter uppercase italic text-skew">Market <span className="text-brand-orange">Leaders</span></h2>
           </div>
           
           <div className="flex flex-wrap gap-2">
              <div className="flex p-1 bg-white rounded-xl border border-gray-100 shadow-sm">
                 {(['all', 'seller', 'buyer'] as const).map((type) => (
                    <button
                       key={type}
                       onClick={() => setLeaderFilter(type)}
                       className={cn(
                          "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                          leaderFilter === type 
                             ? "bg-brand-orange text-white shadow-md shadow-brand-orange/20" 
                             : "text-gray-400 hover:text-brand-dark"
                       )}
                    >
                       {type}s
                    </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {leaders
              .filter(l => leaderFilter === 'all' || l.type === leaderFilter)
              .map((leader, i) => (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}
                className="relative bg-white p-8 rounded-3xl border border-gray-100 overflow-hidden group shadow-sm hover:shadow-md transition-all"
              >
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-orange-50 rounded-full blur-3xl group-hover:bg-orange-100 transition-all" />
                
                <div className="flex flex-col h-full gap-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                           <img src={leader.avatar} className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 object-cover" alt={leader.name} />
                           <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-brand-orange flex items-center justify-center text-white shadow-lg border-4 border-white">
                              {i === 0 ? <Crown className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                           </div>
                        </div>
                        <div>
                           <h3 className="text-xl font-display font-black tracking-tight text-brand-dark">{leader.name}</h3>
                           <p className="text-[10px] font-black uppercase text-brand-orange tracking-widest flex items-center gap-1">
                              <Star className="w-2 h-2 fill-current" /> Ranked #1
                           </p>
                        </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Sales</p>
                        <p className="text-xl font-display font-black text-brand-dark">{leader.score.toLocaleString()}+</p>
                     </div>
                     <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                        <p className="text-[10px] font-bold text-brand-orange uppercase tracking-widest mb-1">Badge</p>
                        <p className="text-xl font-display font-black text-brand-orange italic">TRUSTED</p>
                     </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-brand-orange">
                        <Gift className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth Gift</p>
                        <p className="text-sm font-bold text-brand-dark">{leader.prize}</p>
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Neural Assistant Chat */}
      <section className="px-2">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-focus-within:opacity-10 transition-all">
            <Bot className="w-32 h-32 text-brand-orange" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange flex items-center justify-center text-white shadow-lg shadow-brand-orange/20">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-black tracking-tighter uppercase italic text-skew">Shop <span className="text-brand-orange">Assistant</span> 🤖</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Your personal business help</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-hide pr-2">
              {chatHistory.length === 0 ? (
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center space-y-3">
                  <p className="text-gray-500 font-medium text-sm italic">"How can I help you grow today?"</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['How to sell faster', 'Track a package', 'Best selling items'].map(hint => (
                      <button 
                        key={hint}
                        onClick={() => setChatQuery(hint)}
                        className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[9px] font-black uppercase text-gray-500 hover:text-brand-orange hover:border-brand-orange/30 transition-all shadow-sm"
                      >
                        {hint}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "p-4 rounded-2xl text-sm max-w-[85%] shadow-sm",
                      msg.role === 'user' 
                        ? "bg-brand-orange text-white ml-auto" 
                        : "bg-gray-100 border border-gray-200 text-brand-dark"
                    )}
                  >
                    <p className="font-medium leading-relaxed">{msg.text}</p>
                  </motion.div>
                ))
              )}
              {chatLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-orange-50 border border-orange-100 w-max"
                >
                  <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange animate-pulse">Thinking...</span>
                </motion.div>
              )}
            </div>

            <form onSubmit={handleChat} className="relative group">
              <input 
                type="text"
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                placeholder="Ask your assistant anything..."
                className="w-full h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl pl-6 pr-16 text-sm font-medium focus:border-brand-orange focus:bg-white focus:ring-0 transition-all placeholder:text-gray-400"
              />
              <button 
                type="submit"
                disabled={!chatQuery.trim() || chatLoading}
                className="absolute right-3 top-3 w-10 h-10 rounded-xl bg-brand-orange text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* AI Insights Board */}
      <section className="bg-white p-8 rounded-3xl border border-gray-100 relative overflow-hidden shadow-sm">
         <div className="absolute top-0 right-0 p-8">
            <Sparkles className="w-24 h-24 text-brand-orange/5" />
         </div>
         
         <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-brand-orange">
                  <Sparkles className="w-5 h-5" />
               </div>
               <div>
                  <h2 className="font-display font-black text-xl uppercase tracking-tighter text-brand-dark italic">Weekly <span className="text-brand-orange">Tips</span></h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Business Intelligence Report</p>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {loading ? (
                [1,2,3,4].map(i => (
                  <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />
                ))
               ) : (
                insights.map((insight, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-brand-orange/30 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-black text-brand-orange flex-shrink-0 shadow-sm">
                      {i + 1}
                    </div>
                    <p className="text-xs font-semibold text-gray-600 leading-relaxed">{insight}</p>
                  </motion.div>
                ))
               )}
            </div>
         </div>
      </section>
    </div>
  );
}

