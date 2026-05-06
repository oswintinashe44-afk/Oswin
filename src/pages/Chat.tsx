import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Info, Loader2, MessageSquare, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chatService, Message } from '@/services/chatService';
import { useAuth } from '@/contexts/AuthContext';

export default function Chat() {
  const { user } = useAuth();
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadOrders() {
      const myOrders = await chatService.getMyChats();
      setOrders(myOrders);
      setLoading(false);
    }
    loadOrders();
  }, []);

  useEffect(() => {
    if (!activeOrderId) return;
    const unsubscribe = chatService.subscribeToMessages(activeOrderId, (msgs) => {
      setMessages(msgs);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
    return () => unsubscribe();
  }, [activeOrderId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeOrderId) return;
    
    try {
      await chatService.sendMessage(activeOrderId, newMessage);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-center">Opening Secure Channels...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6 gap-4">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
           <MessageSquare className="w-8 h-8 text-gray-600" />
        </div>
        <h2 className="text-xl font-bold">No active chats</h2>
        <p className="text-sm text-gray-500">Order something from the marketplace to start a conversation.</p>
      </div>
    );
  }

  // List View
  if (!activeOrderId) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-black uppercase italic tracking-tighter text-skew">Your <span className="text-brand-orange">Chats</span></h1>
        <div className="space-y-3">
          {orders.map((order) => (
            <motion.button 
              key={order.id}
              onClick={() => setActiveOrderId(order.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full glass-panel p-5 rounded-3xl flex items-center gap-4 hover:bg-white/10 transition-all text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl">
                 📦
              </div>
              <div className="flex-1">
                 <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold">Order #{order.id.slice(-6)}</h3>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Active</span>
                 </div>
                 <p className="text-xs text-gray-400 font-medium line-clamp-1">
                    Click to view status updates and chat
                 </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Single Chat View
  const activeOrder = orders.find(o => o.id === activeOrderId);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="bg-white p-4 rounded-3xl mb-4 flex items-center justify-between border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveOrderId(null)} className="p-2 -ml-2 hover:bg-white/5 rounded-xl transition-colors">
             <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
             📦
          </div>
          <div>
            <h3 className="font-bold text-sm">Order #{activeOrder?.id?.slice(-6)}</h3>
            <p className="text-[10px] text-brand-orange font-bold uppercase tracking-tighter">Live Connection Active</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-gray-400 hover:text-white">
              <Phone className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 px-2 mb-4 scrollbar-hide">
        <div className="flex justify-center">
           <span className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-500 font-bold uppercase tracking-widest">
              Secured with End-to-End Encryption
           </span>
        </div>

        <AnimatePresence>
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.uid;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${
                  isMe 
                    ? 'bg-brand-orange text-white rounded-tr-none shadow-orange-100/50' 
                    : 'bg-white border border-gray-100 rounded-tl-none text-brand-dark'
                }`}>
                  <p className="font-medium leading-relaxed">{msg.text}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSend} className="relative">
        <input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full h-14 bg-white border border-gray-200 rounded-2xl pl-4 pr-16 outline-none focus:border-brand-orange/50 transition-all font-medium shadow-sm"
        />
        <button 
          type="submit"
          className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center text-white hover:bg-brand-orange transition-all shadow-md active:scale-90"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
