import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Leader } from '@/types';

const LEADERBOARD_COLLECTION = 'leaderboard';

export const leaderboardService = {
  async getYearlyLeaders(year: number) {
    try {
      const q = query(
        collection(db, LEADERBOARD_COLLECTION),
        where('year', '==', year),
        orderBy('rank', 'asc'),
        limit(10)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Leader[];
    } catch (error) {
      console.error('Leaderboard Fetch Error:', error);
      // Return mock data for the demo if direct query fails (e.g. no index yet)
      return [
        { 
          id: '1', 
          userId: 'u1', 
          name: 'Tinashe O.', 
          type: 'seller', 
          rank: 1, 
          score: 12500, 
          prize: 'Premium Seller Badge + $500 Bonus', 
          year: 2026,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tinashe'
        },
        { 
          id: '2', 
          userId: 'u2', 
          name: 'Sarah K.', 
          type: 'buyer', 
          rank: 1, 
          score: 840, 
          prize: 'VIP Buyer Status + 25% Fee Discount', 
          year: 2026,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
        }
      ] as Leader[];
    }
  }
};
