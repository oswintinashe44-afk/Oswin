export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  COURIER = 'courier'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sellerId: string;
  category: string;
  createdAt?: any;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  sellerId: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  amount: number;
  commission: number;
  netPayout: number;
  createdAt?: any;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'courier';
  avatar?: string;
  rating?: number;
  ratingCount?: number;
  courierDetails?: {
    vehicle: string;
    totalEarnings?: number;
  };
  createdAt?: any;
  updatedAt?: any;
}

export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  value: number;
  comment?: string;
  type: 'seller' | 'courier';
  orderId?: string;
  createdAt: any;
}

export interface Delivery {
  id: string;
  orderId: string;
  courierId?: string;
  status: 'available' | 'picked_up' | 'delivering' | 'completed';
  pickupAddress: string;
  deliveryAddress: string;
  fee: number;
  commission: number;
  netPayout: number;
  createdAt?: any;
}

export interface Leader {
  id: string;
  userId: string;
  name: string;
  type: 'seller' | 'buyer';
  rank: number;
  score: number;
  prize: string;
  year: number;
  avatar?: string;
}
