import React from 'react';
import { useFoodieHub } from '../context/FoodieHubContext';
import {
  CheckCircle2,
  Clock,
  MapPin,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Phone,
  Bike,
} from 'lucide-react';

export const OrderConfirmationView: React.FC = () => {
  const { latestPlacedOrder, setCurrentView, setActiveTrackingOrder } = useFoodieHub();

  if (!latestPlacedOrder) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">No recent order found</h2>
        <button
          onClick={() => setCurrentView('home')}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg text-xs font-bold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const handleTrackOrder = () => {
    setActiveTrackingOrder(latestPlacedOrder);
    setCurrentView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Success Celebration Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden p-6 sm:p-10 text-center space-y-6">
        {/* Animated Celebration Icon */}
        <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24">
          <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-25" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
            <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Order Confirmed & Sent to Kitchen
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
            🎉 Your Order Has Been Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Thank you for ordering with FoodieHub. The restaurant is preparing your food with supreme hygiene and care.
          </p>
        </div>

        {/* Highlighted Order ID & Estimated Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-left">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Order Reference ID
            </span>
            <span className="text-base font-extrabold text-stone-900 font-mono">
              #{latestPlacedOrder.id}
            </span>
          </div>

          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200 text-left">
            <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider block">
              Estimated Delivery Time
            </span>
            <span className="text-base font-extrabold text-orange-950 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-600" />
              {latestPlacedOrder.estimatedDeliveryMins} Minutes
            </span>
          </div>
        </div>

        {/* Ordered Items Summary */}
        <div className="bg-stone-50/70 rounded-2xl p-5 border border-stone-200 text-left space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-stone-500" />
              Ordered Items ({latestPlacedOrder.items.length})
            </span>
            <span className="text-xs font-bold text-stone-700">Price</span>
          </div>

          <div className="divide-y divide-stone-100">
            {latestPlacedOrder.items.map(({ item, quantity }) => (
              <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-stone-200 text-stone-800 font-bold flex items-center justify-center text-[10px]">
                    {quantity}x
                  </span>
                  <span className="font-semibold text-stone-900">{item.name}</span>
                </div>
                <span className="font-bold text-stone-800">₹{item.price * quantity}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm font-extrabold text-stone-900">
            <span>Total Amount Paid</span>
            <span className="text-base text-orange-600 font-display">₹{latestPlacedOrder.total}</span>
          </div>
        </div>

        {/* Delivery Address Details */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 text-left flex items-start gap-3">
          <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-stone-900 block">
              Delivering to: {latestPlacedOrder.address.name} ({latestPlacedOrder.address.type})
            </span>
            <p className="text-stone-600 mt-0.5">
              {latestPlacedOrder.address.flatHouse}, {latestPlacedOrder.address.street}
              {latestPlacedOrder.address.landmark && `, near ${latestPlacedOrder.address.landmark}`}
              {latestPlacedOrder.address.pincode && ` - ${latestPlacedOrder.address.pincode}`}
            </p>
            <p className="text-stone-400 mt-0.5">Phone: {latestPlacedOrder.address.phone}</p>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleTrackOrder}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-orange-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Bike className="w-4 h-4" />
            <span>Track Order Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentView('home')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Order More Food
          </button>
        </div>
      </div>
    </div>
  );
};
