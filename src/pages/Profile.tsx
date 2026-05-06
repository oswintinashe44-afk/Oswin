import React, { useState } from 'react';
import { MessageSquare, Heart, Shield, Settings, LogOut, ChevronRight, Truck, Bike, Car, Loader2, Sparkles, CheckCircle2, PieChart, Package, Star, X } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/userService';
import { marketplaceService } from '@/services/marketplaceService';
import { motion, AnimatePresence } from 'motion/react';
import { GROWTH_PHASES } from '@/constants';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Order, Rating } from '@/types';

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [joining, setJoining] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await marketplaceService.getUserOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    }
    fetchOrders();
  }, []);

  const currentPhase = GROWTH_PHASES[1]; // Mocking Sprout Phase
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Failed to sign out', err);
    }
  };

  const handleJoinLogistics = async (vehicle: string) => {
    if (!user) return;
    setSubmitting(true);
    try {
      await userService.becomeCourier(user.uid, { vehicle });
      await refreshProfile();
      setJoining(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !ratingOrder) return;
    setRatingSubmitting(true);
    try {
      // Determine target ID and type (this is a simplified logic)
      // If we had the delivery object, we could get the courierId.
      // For now, we rate the seller as a primary transaction feedback.
      await userService.rateUser({
        fromUserId: user.uid,
        toUserId: ratingOrder.sellerId,
        value: ratingValue,
        comment: ratingComment,
        type: 'seller',
        orderId: ratingOrder.id
      });
      setRatingOrder(null);
      setRatingComment('');
      setRatingValue(5);
      refreshProfile(); // Refresh to see updated profile rating if self-rating (unlikely but good for state)
    } catch (err) {
      console.error(err);
    } finally {
      setRatingSubmitting(false);
    }
  };

  const menuItems = [
    { icon: Heart, label: 'Wishlist', sub: '12 Items saved' },
    { icon: Package, label: 'My Listings', sub: 'Manage your products', onClick: () => navigate('/profile') }, // For now, could be a specific page later
    { icon: PieChart, label: 'Commissioning', sub: 'Earnings & Statistics', onClick: () => navigate('/commissions') },
    { icon: Shield, label: 'Security', sub: 'Verification active' },
    { icon: Settings, label: 'Preferences', sub: 'Dark mode, Notifications' },
    { icon: LogOut, label: 'Sign Out', sub: 'Exit HustleHub', dangerous: true, onClick: handleSignOut },
  ];

  const isCourier = profile?.role === 'courier';

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-6 p-4">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-display font-black text-white bg-brand-orange shadow-lg shadow-brand-orange/20 overflow-hidden">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
          ) : (
            user?.displayName?.[0] || 'T'
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold">
              {user?.displayName || 'Hustler'}
            </h1>
            {isCourier && (
              <div className="bg-orange-50 p-1 rounded-full border border-orange-100">
                <CheckCircle2 className="w-3 h-3 text-brand-orange" />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
            {profile?.role || 'Hustler Plus Member'} • {user?.email || ''}
          </p>
          <div className="flex items-center gap-4 pt-1">
             <div className="text-center">
                <p className="text-sm font-bold">128</p>
                <p className="text-[10px] text-gray-500 uppercase">Sales</p>
             </div>
             <div className="text-center">
                <p className="text-sm font-bold">{profile?.rating?.toFixed(1) || '0.0'}</p>
                <div className="flex items-center gap-0.5">
                   <Star className="w-2 h-2 text-brand-yellow fill-current" />
                   <p className="text-[10px] text-gray-500 uppercase">Rating ({profile?.ratingCount || 0})</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Growth Phase Status */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mx-4 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Truck className="w-16 h-16 text-brand-orange" />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black text-xl italic",
            currentPhase.bg, currentPhase.color
          )}>
            {currentPhase.level}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange">{currentPhase.name}</span>
              <div className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Success Path</span>
            </div>
            <h3 className="text-xl font-display font-black tracking-tighter uppercase italic text-brand-dark">
              Shop <span className="text-brand-orange">Growth</span>
            </h3>
          </div>
        </div>
        <div className="mt-6 space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-gray-400">Next level unlock</span>
              <span className="text-brand-orange font-black">85%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-brand-orange shadow-sm"
              />
            </div>
          </div>
      </motion.div>

      <AnimatePresence>
        {!isCourier && !joining && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 glass-panel rounded-[2.5rem] relative overflow-hidden bg-brand-blue/5 border-brand-blue/20"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10">
               <Truck className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-4">
               <div>
                  <h3 className="text-xl font-display font-black tracking-tight flex items-center gap-2">
                    Start <span className="text-brand-blue">Delivering</span> <Sparkles className="w-4 h-4 text-brand-orange" />
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-1">Join the logistics network and earn up to $25/hr delivering local packages.</p>
               </div>
               <button 
                onClick={() => setJoining(true)}
                className="w-full h-12 rounded-2xl bg-brand-blue text-white font-black uppercase tracking-widest shadow-lg shadow-brand-blue/20 active:scale-95 transition-all"
               >
                 Join Logistics Hub
               </button>
            </div>
          </motion.div>
        )}

        {joining && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 glass-panel rounded-[2.5rem] space-y-6 border-brand-blue/30"
          >
            <div className="flex items-center justify-between">
               <h3 className="font-display font-black text-xl uppercase tracking-tighter">Courier Registration</h3>
               <button onClick={() => setJoining(false)} className="text-gray-500 hover:text-white transition-colors">Cancel</button>
            </div>
            <p className="text-xs text-gray-500 font-medium">Choose your primary delivery method to get started.</p>
            <div className="grid grid-cols-3 gap-3">
               {[
                 { id: 'bike', icon: Bike, label: 'Bike' },
                 { id: 'car', icon: Car, label: 'Car' },
                 { id: 'truck', icon: Truck, label: 'Van' },
               ].map((v) => (
                 <button
                   key={v.id}
                   disabled={submitting}
                   onClick={() => handleJoinLogistics(v.id)}
                   className="p-4 glass-panel rounded-2xl flex flex-col items-center gap-2 hover:bg-brand-blue/10 hover:border-brand-blue/30 transition-all group disabled:opacity-50"
                 >
                    <v.icon className="w-6 h-6 text-brand-blue group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{v.label}</span>
                 </button>
               ))}
            </div>
            {submitting && (
              <div className="flex items-center justify-center gap-2 text-brand-blue text-[10px] font-black uppercase tracking-widest">
                <Loader2 className="w-4 h-4 animate-spin" /> Finalizing Profile...
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-4">
          <div className="marketplace-card p-6 border-orange-50 bg-orange-50/30">
          <p className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-1">Total Earnings</p>
          <p className="text-2xl font-black font-display">$0.00</p>
          <p className="text-[10px] text-gray-500 font-bold mt-1">Pending payout</p>
        </div>
          <div className="marketplace-card p-6 border-blue-50 bg-blue-50/30">
          <p className="text-xs font-bold text-brand-blue uppercase tracking-widest mb-1">Platform Fees</p>
          <p className="text-2xl font-black font-display">$0.00</p>
          <p className="text-[10px] text-gray-500 font-bold mt-1">10% standard rate</p>
        </div>
      </div>

      {/* Order History Section */}
      <section className="space-y-4 px-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-display font-black uppercase tracking-tighter italic">Order <span className="text-brand-orange">History</span></h2>
          <button onClick={() => navigate('/chat')} className="text-[10px] font-black uppercase text-gray-400 hover:text-brand-orange">View All</button>
        </div>
        
        <div className="space-y-3">
          {loadingOrders ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-xs text-gray-500 font-medium">No purchases yet. Time to start your journey!</p>
            </div>
          ) : (
            orders.slice(0, 3).map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-brand-orange/30 transition-all cursor-pointer"
                onClick={() => navigate('/chat')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-xl">
                    📦
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-dark line-clamp-1">{order.productName || `Order #${order.id.slice(-6)}`}</p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {order.createdAt?.seconds 
                        ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
                        : 'Processing...'}
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="text-sm font-black text-brand-dark">${(order.amount || 0).toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    {order.status === 'delivered' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setRatingOrder(order);
                        }}
                        className="text-[9px] font-black uppercase text-brand-orange hover:opacity-80 flex items-center gap-0.5"
                      >
                        Rate Seller <Star className="w-2.5 h-2.5" />
                      </button>
                    )}
                    <span className={cn(
                      "text-[8px] font-black uppercase px-2 py-0.5 rounded-full inline-block",
                      order.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-brand-orange'
                    )}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Rating Modal */}
      <AnimatePresence>
        {ratingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRatingOrder(null)}
              className="absolute inset-0 bg-brand-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl"
            >
              <button 
                onClick={() => setRatingOrder(null)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-brand-dark"
              >
                <X className="w-5 h-5" />
              </button>
              
              <form onSubmit={handleRate} className="space-y-6 text-center">
                <div className="space-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto text-brand-orange">
                    <Star className="w-8 h-8 fill-current" />
                  </div>
                  <h3 className="text-2xl font-display font-black tracking-tighter uppercase italic">Rate <span className="text-brand-orange">Transaction</span></h3>
                  <p className="text-xs text-gray-400 font-medium">How was your experience with this seller?</p>
                </div>

                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRatingValue(val)}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        ratingValue >= val ? "bg-brand-orange text-white" : "bg-gray-50 text-gray-300"
                      )}
                    >
                      <Star className={cn("w-5 h-5", ratingValue >= val && "fill-current")} />
                    </button>
                  ))}
                </div>

                <textarea
                  placeholder="Share a short comment (optional)..."
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs font-medium focus:border-brand-orange/50 outline-none resize-none"
                  rows={3}
                />

                <button
                  type="submit"
                  disabled={ratingSubmitting}
                  className="w-full h-14 rounded-2xl bg-brand-orange text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20"
                >
                  {ratingSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Feedback"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {menuItems.map((item) => (
          <button 
            key={item.label}
            onClick={item.onClick}
            className="w-full marketplace-card p-5 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  <item.icon className={item.dangerous ? 'text-red-500' : 'text-brand-orange'} />
               </div>
               <div className="text-left">
                  <p className="font-bold">{item.label}</p>
                  <p className="text-xs text-gray-500 font-medium">{item.sub}</p>
               </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-orange transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
