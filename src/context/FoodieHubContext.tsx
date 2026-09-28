import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  CartItem,
  Coupon,
  DeliveryAddress,
  FoodCategory,
  MenuItem,
  Order,
  OrderStatus,
  PaymentMethod,
  Restaurant,
  UserProfile,
} from '../types';
import {
  COUPONS,
  INITIAL_SAMPLE_ORDERS,
  INITIAL_USER,
  RESTAURANTS,
  MENU_ITEMS,
} from '../data/mockData';

export type AppView =
  | 'home'
  | 'restaurants'
  | 'menu'
  | 'orders'
  | 'cart'
  | 'checkout'
  | 'confirmation'
  | 'tracking'
  | 'offers'
  | 'profile'
  | 'restaurant_detail';

interface FoodieHubContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  cart: CartItem[];
  addToCart: (item: MenuItem, qty?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  taxes: number;
  total: number;
  orders: Order[];
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;
  latestPlacedOrder: Order | null;
  placeOrder: (address: DeliveryAddress, paymentMethod: PaymentMethod) => Order;
  advanceOrderStatus: (orderId: string) => void;
  user: UserProfile;
  updateUser: (data: Partial<UserProfile>) => void;
  addAddress: (address: Omit<DeliveryAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  toggleFavorite: (itemId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: FoodCategory;
  setSelectedCategory: (cat: FoodCategory) => void;
  onlyVeg: boolean;
  setOnlyVeg: (val: boolean) => void;
  minRating: number;
  setMinRating: (val: number) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (val: boolean) => void;
  activeLocation: string;
  setActiveLocation: (loc: string) => void;
}

const FoodieHubContext = createContext<FoodieHubContextType | undefined>(undefined);

export const FoodieHubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [activeLocation, setActiveLocation] = useState<string>('Indiranagar, Bengaluru');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('All');
  const [onlyVeg, setOnlyVeg] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('foodiehub_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('foodiehub_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('foodiehub_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('foodiehub_orders');
      return saved ? JSON.parse(saved) : INITIAL_SAMPLE_ORDERS;
    } catch {
      return INITIAL_SAMPLE_ORDERS;
    }
  });

  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(() => {
    return orders.length > 0 ? orders[0] : null;
  });

  const [latestPlacedOrder, setLatestPlacedOrder] = useState<Order | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('foodiehub_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('foodiehub_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('foodiehub_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('foodiehub_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('foodiehub_coupon');
      }
    } catch {
      // ignore
    }
  }, [appliedCoupon]);

  // Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    if (appliedCoupon?.discountType === 'free_delivery') return 0;
    if (subtotal >= 499) return 0; // Free delivery on orders >= 499
    return 40;
  }, [cart.length, appliedCoupon, subtotal]);

  const discount = useMemo(() => {
    if (!appliedCoupon || cart.length === 0) return 0;
    if (subtotal < appliedCoupon.minOrder) return 0;

    if (appliedCoupon.discountType === 'flat') {
      return Math.min(appliedCoupon.value, subtotal);
    }
    if (appliedCoupon.discountType === 'percentage') {
      const calculated = (subtotal * appliedCoupon.value) / 100;
      return appliedCoupon.maxDiscount ? Math.min(calculated, appliedCoupon.maxDiscount) : calculated;
    }
    if (appliedCoupon.discountType === 'free_delivery') {
      return 40;
    }
    return 0;
  }, [appliedCoupon, subtotal, cart.length]);

  const taxes = useMemo(() => {
    if (cart.length === 0) return 0;
    return Math.round(subtotal * 0.05); // 5% restaurant GST
  }, [subtotal, cart.length]);

  const total = useMemo(() => {
    if (cart.length === 0) return 0;
    const finalVal = subtotal + deliveryFee + taxes - discount;
    return Math.max(0, Math.round(finalVal));
  }, [subtotal, deliveryFee, taxes, discount, cart.length]);

  // Cart Handlers
  const addToCart = (item: MenuItem, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + qty } : ci
        );
      }
      return [...prev, { item, quantity: qty }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((ci) => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = COUPONS.find((c) => c.code.toUpperCase() === cleanCode);

    if (!found) {
      return { success: false, message: 'Invalid coupon code. Try FIRST50, FOOD20 or FREEDELIVERY.' };
    }

    if (subtotal < found.minOrder) {
      return {
        success: false,
        message: `Min order amount of ₹${found.minOrder} required for ${found.code}. Add ₹${found.minOrder - subtotal} more!`,
      };
    }

    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied! You save ₹${found.value}${found.discountType === 'percentage' ? '%' : ''}.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Place Order
  const placeOrder = (address: DeliveryAddress, paymentMethod: PaymentMethod): Order => {
    const newOrderId = `FH-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: newOrderId,
      items: [...cart],
      subtotal,
      deliveryFee,
      discount,
      taxes,
      total,
      address,
      paymentMethod,
      status: 'confirmed',
      placedAt: new Date().toISOString(),
      estimatedDeliveryMins: 28,
      deliveryPartner: {
        name: 'Ramesh Kumar',
        phone: '+91 98123 45678',
        vehicleNo: 'KA 03 EX 4821',
        rating: 4.9,
      },
      couponCode: appliedCoupon?.code,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLatestPlacedOrder(newOrder);
    setActiveTrackingOrder(newOrder);
    clearCart();
    setCurrentView('confirmation');
    return newOrder;
  };

  // Order tracking status progression
  const advanceOrderStatus = (orderId: string) => {
    const sequence: OrderStatus[] = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const currentIndex = sequence.indexOf(ord.status);
          const nextIndex = Math.min(currentIndex + 1, sequence.length - 1);
          const nextStatus = sequence[nextIndex];
          const updated: Order = {
            ...ord,
            status: nextStatus,
            estimatedDeliveryMins: nextStatus === 'delivered' ? 0 : Math.max(5, ord.estimatedDeliveryMins - 10),
          };
          if (activeTrackingOrder?.id === orderId) {
            setActiveTrackingOrder(updated);
          }
          return updated;
        }
        return ord;
      })
    );
  };

  // User Actions
  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  const addAddress = (newAddr: Omit<DeliveryAddress, 'id'>) => {
    const fullAddr: DeliveryAddress = {
      ...newAddr,
      id: `addr-${Date.now()}`,
    };
    setUser((prev) => ({
      ...prev,
      addresses: [...prev.addresses, fullAddr],
    }));
  };

  const deleteAddress = (id: string) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((a) => a.id !== id),
    }));
  };

  const toggleFavorite = (itemId: string) => {
    setUser((prev) => {
      const exists = prev.favorites.includes(itemId);
      return {
        ...prev,
        favorites: exists ? prev.favorites.filter((f) => f !== itemId) : [...prev.favorites, itemId],
      };
    });
  };

  return (
    <FoodieHubContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedRestaurant,
        setSelectedRestaurant,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        deliveryFee,
        discount,
        taxes,
        total,
        orders,
        activeTrackingOrder,
        setActiveTrackingOrder,
        latestPlacedOrder,
        placeOrder,
        advanceOrderStatus,
        user,
        updateUser,
        addAddress,
        deleteAddress,
        toggleFavorite,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        onlyVeg,
        setOnlyVeg,
        minRating,
        setMinRating,
        cartDrawerOpen,
        setCartDrawerOpen,
        activeLocation,
        setActiveLocation,
      }}
    >
      {children}
    </FoodieHubContext.Provider>
  );
};

export const useFoodieHub = () => {
  const context = useContext(FoodieHubContext);
  if (!context) {
    throw new Error('useFoodieHub must be used within FoodieHubProvider');
  }
  return context;
};
