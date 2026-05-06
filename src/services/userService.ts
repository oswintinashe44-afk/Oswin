import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  collection,
  addDoc,
  increment
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { UserProfile, Rating } from '@/types';

const USERS_COLLECTION = 'users';
const RATINGS_COLLECTION = 'ratings';

export const userService = {
  async rateUser(rating: Omit<Rating, 'id' | 'createdAt'>) {
    try {
      // Add rating document
      await addDoc(collection(db, RATINGS_COLLECTION), {
        ...rating,
        createdAt: serverTimestamp()
      });

      // Update user average rating
      const userRef = doc(db, USERS_COLLECTION, rating.toUserId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data() as UserProfile;
        const currentRating = userData.rating || 0;
        const currentCount = userData.ratingCount || 0;
        
        const newCount = currentCount + 1;
        const newRating = (currentRating * currentCount + rating.value) / newCount;
        
        await updateDoc(userRef, {
          rating: newRating,
          ratingCount: newCount,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, RATINGS_COLLECTION);
    }
  },
  async getProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, USERS_COLLECTION, uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${USERS_COLLECTION}/${uid}`);
      return null;
    }
  },

  async createProfile(uid: string, data: Partial<UserProfile>) {
    try {
      const docRef = doc(db, USERS_COLLECTION, uid);
      await setDoc(docRef, {
        uid,
        name: data.name || '',
        email: data.email || '',
        role: 'buyer',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...data
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${USERS_COLLECTION}/${uid}`);
    }
  },

  async becomeCourier(uid: string, info: { vehicle: string }) {
    try {
      const docRef = doc(db, USERS_COLLECTION, uid);
      await updateDoc(docRef, {
        role: 'courier',
        courierDetails: info,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${USERS_COLLECTION}/${uid}`);
    }
  }
};
