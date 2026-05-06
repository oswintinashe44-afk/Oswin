import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  doc,
  getDocs,
  where
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '@/lib/firebase';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  type: 'text' | 'system';
  createdAt: any;
}

export const chatService = {
  // Listen to messages for a specific order
  subscribeToMessages(orderId: string, callback: (messages: Message[]) => void) {
    const messagesRef = collection(db, 'orders', orderId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      callback(messages);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `orders/${orderId}/messages`);
    });
  },

  // Send a message
  async sendMessage(orderId: string, text: string) {
    if (!auth.currentUser) throw new Error('Must be logged in');

    try {
      const messagesRef = collection(db, 'orders', orderId, 'messages');
      await addDoc(messagesRef, {
        senderId: auth.currentUser.uid,
        text,
        type: 'text',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${orderId}/messages`);
    }
  },

  // Get user's active orders with chats
  async getMyChats() {
    if (!auth.currentUser) return [];
    try {
      const userId = auth.currentUser.uid;
      // Get orders where user is either buyer or seller
      const qBuyer = query(collection(db, 'orders'), where('buyerId', '==', userId));
      const qSeller = query(collection(db, 'orders'), where('sellerId', '==', userId));
      
      const [buyerSnap, sellerSnap] = await Promise.all([
        getDocs(qBuyer),
        getDocs(qSeller)
      ]);

      const orders = [...buyerSnap.docs, ...sellerSnap.docs].map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return orders;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
};
