import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp, 
  orderBy,
  doc,
  getDoc
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '@/lib/firebase';
import { Product, Order } from '@/types';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';

export const marketplaceService = {
  // Fetch all products for the marketplace
  async getProducts() {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
      return [];
    }
  },

  // Add a new product (Seller action)
  async addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'sellerId'>) {
    if (!auth.currentUser) throw new Error('Must be logged in to sell');
    
    try {
      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
        ...productData,
        sellerId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, PRODUCTS_COLLECTION);
    }
  },

  // Create an order (Buyer action)
  async createOrder(product: Product) {
    if (!auth.currentUser) throw new Error('Must be logged in to buy');
    
    try {
      const commissionRate = 0.10; // 10% commission
      const commission = product.price * commissionRate;
      const netPayout = product.price - commission;

      const orderData = {
        productId: product.id,
        productName: product.name,
        buyerId: auth.currentUser.uid,
        sellerId: product.sellerId,
        status: 'pending',
        amount: product.price,
        commission: parseFloat(commission.toFixed(2)),
        netPayout: parseFloat(netPayout.toFixed(2)),
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, ORDERS_COLLECTION);
    }
  },

  // Fetch user's orders (Buyer action)
  async getUserOrders() {
    if (!auth.currentUser) return [];
    
    try {
      const q = query(
        collection(db, ORDERS_COLLECTION),
        where('buyerId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (Order & { productName: string })[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
      return [];
    }
  }
};
