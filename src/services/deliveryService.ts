import { 
  collection, 
  getDocs, 
  query, 
  where, 
  serverTimestamp, 
  orderBy,
  updateDoc,
  doc,
  addDoc
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '@/lib/firebase';
import { Delivery } from '@/types';

const DELIVERIES_COLLECTION = 'deliveries';

export const deliveryService = {
  // Fetch unassigned jobs
  async getAvailableJobs() {
    try {
      const q = query(
        collection(db, DELIVERIES_COLLECTION),
        where('status', '==', 'available'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Delivery[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, DELIVERIES_COLLECTION);
      return [];
    }
  },

  // Courier accepts a job
  async acceptJob(deliveryId: string) {
    if (!auth.currentUser) throw new Error('Auth required');
    
    try {
      const deliveryRef = doc(db, DELIVERIES_COLLECTION, deliveryId);
      await updateDoc(deliveryRef, {
        status: 'picked_up',
        courierId: auth.currentUser.uid,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${DELIVERIES_COLLECTION}/${deliveryId}`);
    }
  },

  // Fetch jobs I am involved in (as courier, buyer, or seller)
  async getMyActiveDeliveries() {
    if (!auth.currentUser) return [];
    
    try {
      // For demo, we check where user is the courier or the owner of the mock delivery
      const q = query(
        collection(db, DELIVERIES_COLLECTION),
        where('courierId', '==', auth.currentUser.uid),
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Delivery[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, DELIVERIES_COLLECTION);
      return [];
    }
  },

  // Update delivery status
  async updateStatus(deliveryId: string, status: Delivery['status']) {
    try {
      const deliveryRef = doc(db, DELIVERIES_COLLECTION, deliveryId);
      await updateDoc(deliveryRef, {
        status: status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${DELIVERIES_COLLECTION}/${deliveryId}`);
    }
  },

  // Helper to create a job (for demo/testing)
  async createMockJob(item: string) {
     try {
       const fee = Math.floor(Math.random() * 20) + 5;
       const commissionRate = 0.15; // 15% commission for logistics
       const commission = fee * commissionRate;
       const netPayout = fee - commission;

       await addDoc(collection(db, DELIVERIES_COLLECTION), {
         orderId: 'MOCK-' + Math.random().toString(36).substr(2, 5),
         trackingNumber: 'HT-' + Math.random().toString(36).toUpperCase().substr(2, 8),
         itemName: item,
         status: 'available',
         pickupAddress: '123 Seller St',
         deliveryAddress: '456 Buyer Ave',
         fee: fee,
         commission: parseFloat(commission.toFixed(2)),
         netPayout: parseFloat(netPayout.toFixed(2)),
         createdAt: serverTimestamp(),
         updatedAt: serverTimestamp(),
         history: [
            { status: 'order_placed', time: new Date().toISOString(), label: 'Order Placed' }
         ],
         estimatedArrival: '2-3 Hours'
       });
     } catch (err) {
       console.error(err);
     }
  }
};
