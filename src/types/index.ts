export type FoodCategory =
  | 'All'
  | 'Pizza'
  | 'Burgers'
  | 'Biryani'
  | 'Chinese'
  | 'South Indian'
  | 'Desserts'
  | 'Beverages';

export interface CategoryInfo {
  id: FoodCategory;
  name: string;
  emoji: string;
  description: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  rating: number;
  ratingCount: number;
  category: FoodCategory;
  image: string;
  isBestSeller?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string[];
  rating: number;
  ratingCount: number;
  deliveryTimeMins: string;
  minOrder: number;
  priceForTwo: number;
  isPopular?: boolean;
  isPureVeg?: boolean;
  image: string;
  address: string;
  distanceKm: number;
  featuredDish: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface DeliveryAddress {
  id: string;
  name: string;
  phone: string;
  flatHouse: string;
  street: string;
  landmark: string;
  pincode: string;
  type: 'Home' | 'Work' | 'Other';
  isDefault?: boolean;
}

export type PaymentMethod = 'upi' | 'card' | 'cod';

export type OrderStatus = 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';

export interface DeliveryPartner {
  name: string;
  phone: string;
  vehicleNo: string;
  rating: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  taxes: number;
  total: number;
  address: DeliveryAddress;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  placedAt: string;
  estimatedDeliveryMins: number;
  deliveryPartner: DeliveryPartner;
  couponCode?: string;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'flat' | 'percentage' | 'free_delivery';
  value: number;
  minOrder: number;
  maxDiscount?: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  addresses: DeliveryAddress[];
  favorites: string[];
}
