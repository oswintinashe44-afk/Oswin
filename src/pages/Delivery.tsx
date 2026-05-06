import React, { useEffect, useState } from 'react';
import { Truck, MapPin, Package, CheckCircle2, Loader2, Plus, ShieldAlert, Rocket, ArrowRight, X, Clock, Navigation, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { deliveryService } from '@/services/deliveryService';
import { Delivery as DeliveryType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Delivery() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'network' | 'tracking'>('network');
  const [jobs, setJobs] = useState<DeliveryType[]>([]);
  const [myDeliveries, setMyDeliveries] = useState<DeliveryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [trackingDelivery, setTrackingDelivery] = useState<DeliveryType | null>(null);

  const isCourier = profile?.role === 'courier';

  const loadData = async () => {
    setLoading(true);
    try {
      const [available, active] = await Promise.all([
        deliveryService.getAvailableJobs(),
        deliveryService.getMyActiveDeliveries()
      ]);
      setJobs(available);
      setMyDeliveries(active);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAccept = async (id: string) => {
    if (!isCourier) return;
    setAcceptingId(id);
    try {
      await deliveryService.acceptJob(id);
      setStatusMsg({ type: 'success', text: 'Job accepted! Opening tracking...' });
      setTimeout(() => setStatusMsg(null), 3000);
      await loadData();
      setActiveTab('tracking');
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: 'Failed to accept job.' });
      setTimeout(() => setStatusMsg(null), 3000);
    } finally {
      setAcceptingId(null);
    }
  };

  const handleUpdateStatus = async (id: string, nextStatus: DeliveryType['status']) => {
    try {
      await deliveryService.updateStatus(id, nextStatus);
      setStatusMsg({ type: 'success', text: `Status updated to ${nextStatus}` });
      setTimeout(() => setStatusMsg(null), 3000);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateMock = async () => {
    await deliveryService.createMockJob('New Hustle Package');
    loadData();
  };

  if (!isCourier) {
    return (
      <div className="space-y-8 flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 rounded-3xl bg-orange-50 flex items-center justify-center border border-orange-100 shadow-sm"
        >
          <Truck className="w-12 h-12 text-brand-orange" />
        </motion.div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-display font-black tracking-tighter uppercase italic text-skew">
            Logistics <span className="text-brand-orange">Network</span>
          </h1>
          <p className="text-gray-500 max-w-sm font-medium">Join our shipping network to deliver packages locally and earn competitive fees on every trip.</p>
        </div>

        <button 
          onClick={() => navigate('/profile')}
          className="h-14 px-8 rounded-2xl bg-brand-orange text-white font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-orange/20"
        >
          Join as Courier <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-8">
          Free activation • flexible hours
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {statusMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "fixed top-20 left-4 right-4 z-50 p-4 rounded-2xl border shadow-xl backdrop-blur-xl text-center font-black uppercase tracking-widest text-[10px]",
            statusMsg.type === 'success' ? "bg-white border-brand-orange/40 text-brand-orange" : "bg-red-50 border-red-200 text-red-500"
          )}
        >
          {statusMsg.text}
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-black uppercase italic tracking-tighter text-skew">Ship <span className="text-brand-orange">Center</span> 📦</h1>
        <div className="flex items-center gap-2">
           <button 
            onClick={handleCreateMock}
            className="p-2 bg-white border border-gray-100 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex p-1 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <button
          onClick={() => setActiveTab('network')}
          className={cn(
            "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            activeTab === 'network' ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/20" : "text-gray-400 hover:text-brand-dark"
          )}
        >
          Work Opportunities
        </button>
        <button
          onClick={() => setActiveTab('tracking')}
          className={cn(
            "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative",
            activeTab === 'tracking' ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/20" : "text-gray-400 hover:text-brand-dark"
          )}
        >
          Track Shipments 📍
          {myDeliveries.length > 0 && (
            <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-brand-orange animate-pulse border-2 border-white" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'network' ? (
          <motion.div 
            key="network"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="marketplace-card p-6 space-y-2">
                <Truck className="w-8 h-8 text-brand-orange mb-2" />
                <p className="text-2xl font-bold font-display text-brand-dark">{jobs.length}</p>
                <p className="text-xs text-gray-400 font-bold uppercase leading-none">Open Orders</p>
              </div>
              <div className="marketplace-card p-6 space-y-2 border-orange-100">
                <Star className="w-8 h-8 text-yellow-500 mb-2 fill-current" />
                <p className="text-2xl font-bold font-display text-brand-dark">{profile?.rating?.toFixed(1) || '0.0'}</p>
                <p className="text-xs text-gray-400 font-bold uppercase leading-none">Your Reputation</p>
              </div>
            </div>

            <div className="space-y-4">
               <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Available Deliveries</h2>
               
               {loading ? (
                <div className="flex justify-center py-12">
                   <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                </div>
              ) : jobs.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl text-center border-dashed border-2 border-gray-100">
                   <p className="text-gray-400 font-medium text-sm">Waiting for new shipping requests...</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <motion.div 
                    key={job.id}
                    whileHover={{ y: -2 }}
                    className="marketplace-card p-6 flex items-center justify-between group cursor-pointer hover:border-brand-orange/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-xl">
                         📦
                      </div>
                      <div>
                         <p className="font-bold text-lg text-brand-dark">{(job as any).itemName || 'Parcel'}</p>
                         <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-brand-orange" /> {job.pickupAddress}</span>
                         </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-display font-black text-brand-dark">${job.fee}</p>
                       <button 
                        onClick={() => handleAccept(job.id)}
                        disabled={acceptingId === job.id}
                        className="text-[10px] font-black uppercase tracking-tighter text-brand-orange hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                       >
                         {acceptingId === job.id ? 'Claiming...' : 'Take Job'}
                       </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="tracking"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-6"
          >
            {myDeliveries.length === 0 ? (
              <div className="bg-white p-16 rounded-[2.5rem] text-center space-y-4 border border-gray-100 shadow-sm">
                <div className="w-20 h-20 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto">
                   <Package className="w-8 h-8 text-gray-300" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-black uppercase tracking-tighter italic text-skew">No Active <span className="text-brand-orange">Tasks</span></p>
                  <p className="text-xs text-gray-400 font-medium font-sans">Accept jobs to start earning delivery fees.</p>
                </div>
              </div>
            ) : (
              myDeliveries.map((delivery) => (
                <div key={delivery.id} className="marketplace-card overflow-hidden border-orange-100">
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-brand-orange font-display font-black">
                            {delivery.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest leading-none mb-1">Status: {delivery.status}</p>
                            <h3 className="text-lg font-black italic uppercase tracking-tighter text-brand-dark">{(delivery as any).itemName}</h3>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Track ID</p>
                         <p className="text-xs font-mono font-bold text-brand-dark">{(delivery as any).trackingNumber || 'ALB-XXXXX'}</p>
                      </div>
                    </div>

                    {/* Timeline Visual */}
                    <div className="relative pt-4 pb-8 px-2">
                       <div className="absolute top-6 left-2 right-2 h-0.5 bg-gray-100" />
                       <div className="relative flex justify-between">
                          {[
                            { id: 'available', icon: Plus, label: 'Start' },
                            { id: 'picked_up', icon: Package, label: 'Packed' },
                            { id: 'delivering', icon: Truck, label: 'On Way' },
                            { id: 'completed', icon: CheckCircle2, label: 'Arrived' }
                          ].map((step, idx, arr) => {
                            const statuses = arr.map(s => s.id);
                            const currentIndex = statuses.indexOf(delivery.status);
                            const isActive = idx <= currentIndex;
                            
                            return (
                              <div key={step.id} className="flex flex-col items-center gap-3 relative z-10">
                                 <div className={cn(
                                   "w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500",
                                   isActive ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/30" : "bg-white border border-gray-200 text-gray-300"
                                 )}>
                                    <step.icon className="w-3 h-3" />
                                 </div>
                                 <span className={cn(
                                   "text-[9px] font-black uppercase tracking-tighter transition-colors",
                                   isActive ? "text-brand-dark" : "text-gray-300"
                                 )}>{step.label}</span>
                              </div>
                            );
                          })}
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Efficiency</p>
                          <p className="text-xs font-bold text-brand-dark">{(delivery as any).estimatedArrival || 'On Time'}</p>
                       </div>
                       <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 space-y-1">
                          <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest">Earned</p>
                          <p className="text-xs font-bold text-brand-orange">+${delivery.netPayout}</p>
                       </div>
                    </div>

                    {/* Quick Actions for Courier */}
                    {delivery.status !== 'completed' && (
                      <div className="pt-2 flex gap-3">
                         {delivery.status === 'picked_up' && (
                           <button 
                            onClick={() => handleUpdateStatus(delivery.id, 'delivering')}
                            className="flex-1 h-12 rounded-xl bg-brand-dark text-white font-black uppercase tracking-widest text-[10px] hover:bg-brand-orange transition-colors shadow-sm"
                           >
                              Dispatch Now
                           </button>
                         )}
                         {delivery.status === 'delivering' && (
                           <button 
                            onClick={() => handleUpdateStatus(delivery.id, 'completed')}
                            className="flex-1 h-12 rounded-xl bg-brand-orange text-white font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-lg shadow-brand-orange/20"
                           >
                              Confirm Arrival
                           </button>
                         )}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-4 flex items-center justify-between border-t border-gray-100">
                     <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-orange-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Destination: {delivery.deliveryAddress}</span>
                     </div>
                     <button 
                       onClick={() => setTrackingDelivery(delivery)}
                       className="px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[9px] font-black uppercase text-brand-orange hover:bg-orange-50 transition-colors shadow-sm flex items-center gap-1"
                     >
                       Track Package <Navigation className="w-2.5 h-2.5" />
                     </button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tracking Modal */}
      <AnimatePresence>
        {trackingDelivery && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTrackingDelivery(null)}
              className="absolute inset-0 bg-brand-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest mb-1">Live Tracking Active</p>
                    <h2 className="text-2xl font-display font-black tracking-tighter uppercase italic text-brand-dark">
                      {(trackingDelivery as any).itemName}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setTrackingDelivery(null)}
                    className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-brand-dark transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tracking Number</p>
                    <p className="text-sm font-mono font-bold text-brand-dark">{(trackingDelivery as any).trackingNumber || 'ALB-9921-X'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 space-y-1">
                    <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest">Est. Arrival</p>
                    <p className="text-sm font-bold text-brand-orange">{(trackingDelivery as any).estimatedArrival || '35 mins'}</p>
                  </div>
                </div>

                {/* Progress Visual */}
                <div className="space-y-6">
                  <div className="relative pt-2">
                    <div className="absolute top-[1.125rem] left-0 right-0 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${(['available', 'picked_up', 'delivering', 'completed'].indexOf(trackingDelivery.status) / 3) * 100}%` 
                        }}
                        className="h-full bg-brand-orange shadow-[0_0_10px_rgba(255,106,0,0.5)]"
                      />
                    </div>
                    <div className="relative flex justify-between">
                      {[
                        { id: 'available', icon: Plus, label: 'Order' },
                        { id: 'picked_up', icon: Package, label: 'Packed' },
                        { id: 'delivering', icon: Truck, label: 'Way' },
                        { id: 'completed', icon: CheckCircle2, label: 'Arrived' }
                      ].map((step, idx, arr) => {
                        const currentIndex = arr.map(s => s.id).indexOf(trackingDelivery.status);
                        const isActive = idx <= currentIndex;
                        return (
                          <div key={step.id} className="flex flex-col items-center gap-3">
                            <div className={cn(
                              "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 z-10",
                              isActive 
                                ? "bg-brand-orange text-white shadow-xl shadow-brand-orange/30 rotate-0" 
                                : "bg-white border border-gray-200 text-gray-300 rotate-12"
                            )}>
                              <step.icon className="w-5 h-5" />
                            </div>
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-tighter",
                              isActive ? "text-brand-dark" : "text-gray-300"
                            )}>{step.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-100 shadow-sm flex-shrink-0">
                         <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Origin</p>
                         <p className="text-sm font-bold text-brand-dark truncate">{trackingDelivery.pickupAddress}</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center shadow-lg shadow-brand-orange/20 flex-shrink-0">
                         <Navigation className="w-4 h-4 text-white" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Destination</p>
                         <p className="text-sm font-bold text-brand-dark truncate">{trackingDelivery.deliveryAddress}</p>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => setTrackingDelivery(null)}
                  className="w-full h-16 rounded-3xl bg-brand-dark text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-orange transition-all shadow-xl active:scale-95"
                >
                  Confirm Awareness <Rocket className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
