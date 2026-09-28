import React, { useEffect, useState } from 'react';
import { useFoodieHub } from '../context/FoodieHubContext';
import { OrderStatus } from '../types';
import {
  CheckCircle2,
  ChefHat,
  Bike,
  PartyPopper,
  Clock,
  Phone,
  MapPin,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Navigation,
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const {
    activeTrackingOrder,
    advanceOrderStatus,
    orders,
    setActiveTrackingOrder,
    setCurrentView,
  } = useFoodieHub();

  const [simulatedMinutesLeft, setSimulatedMinutesLeft] = useState(24);
  const [mapProgressPercent, setMapProgressPercent] = useState(40);

  const order = activeTrackingOrder || orders[0];

  useEffect(() => {
    if (!order) return;
    if (order.status === 'confirmed') {
      setSimulatedMinutesLeft(32);
      setMapProgressPercent(15);
    } else if (order.status === 'preparing') {
      setSimulatedMinutesLeft(22);
      setMapProgressPercent(35);
    } else if (order.status === 'out_for_delivery') {
      setSimulatedMinutesLeft(11);
      setMapProgressPercent(75);
    } else if (order.status === 'delivered') {
      setSimulatedMinutesLeft(0);
      setMapProgressPercent(100);
    }
  }, [order?.status]);

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="text-4xl">🛵</div>
        <h2 className="text-xl font-bold text-stone-900">No active orders to track</h2>
        <p className="text-xs text-stone-500">
          Once you place an order, you can follow its live preparation and delivery status here.
        </p>
        <button
          onClick={() => setCurrentView('restaurants')}
          className="px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold"
        >
          Explore Restaurants
        </button>
      </div>
    );
  }

  const steps: {
    status: OrderStatus;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
  }[] = [
    {
      status: 'confirmed',
      title: 'Order Confirmed',
      subtitle: 'Restaurant accepted your order',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      status: 'preparing',
      title: 'Food Being Prepared',
      subtitle: 'Chef is cooking your fresh meal',
      icon: <ChefHat className="w-5 h-5" />,
    },
    {
      status: 'out_for_delivery',
      title: 'Out for Delivery',
      subtitle: 'Rider is on the way with your food',
      icon: <Bike className="w-5 h-5" />,
    },
    {
      status: 'delivered',
      title: 'Delivered',
      subtitle: 'Food delivered safely at doorstep',
      icon: <PartyPopper className="w-5 h-5" />,
    },
  ];

  const statusOrder: OrderStatus[] = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];
  const currentStepIndex = statusOrder.indexOf(order.status);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header and Orders Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">
            Live Order Tracking
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900">
            Tracking Order #{order.id}
          </h1>
        </div>

        {/* Demo Advance Button */}
        <div className="flex items-center gap-3">
          {order.status !== 'delivered' && (
            <button
              onClick={() => advanceOrderStatus(order.id)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer animate-pulse-glow"
              title="Simulate the next order stage for testing"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simulate Next Stage ({statusOrder[currentStepIndex + 1]?.replace(/_/g, ' ')})</span>
            </button>
          )}

          {orders.length > 1 && (
            <select
              value={order.id}
              onChange={(e) => {
                const found = orders.find((o) => o.id === e.target.value);
                if (found) setActiveTrackingOrder(found);
              }}
              className="text-xs bg-white border border-stone-300 rounded-xl px-3 py-2 font-semibold text-stone-800 focus:outline-hidden"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  Order #{o.id} ({o.status})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Progress Stepper & Live Map */}
        <div className="lg:col-span-8 space-y-6">
          {/* Estimated Arrival Banner */}
          <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-orange-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider block mb-1">
                  {order.status === 'delivered' ? 'Completed Order' : 'Estimated Arrival'}
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-display">
                  {order.status === 'delivered' ? (
                    <span className="text-emerald-400">Delivered Safely!</span>
                  ) : (
                    <span>{simulatedMinutesLeft} Minutes</span>
                  )}
                </div>
                <p className="text-xs text-stone-300 mt-1">
                  {order.status === 'confirmed' && 'Restaurant is verifying and packing your items.'}
                  {order.status === 'preparing' && 'Fresh ingredients are simmering in the kitchen.'}
                  {order.status === 'out_for_delivery' && 'Delivery partner is riding towards your address.'}
                  {order.status === 'delivered' && 'Enjoy your delicious feast! Bon appétit.'}
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-orange-400 shrink-0">
                {order.status === 'delivered' ? (
                  <PartyPopper className="w-7 h-7 text-emerald-400" />
                ) : (
                  <Clock className="w-7 h-7" />
                )}
              </div>
            </div>
          </div>

          {/* 4-Step Tracking Stepper (Required) */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 mb-6">Delivery Milestones</h3>

            <div className="relative">
              {/* Stepper Vertical Track */}
              <div className="absolute top-6 left-6 bottom-6 w-0.5 bg-stone-200 -z-0" />

              <div className="space-y-8 relative z-10">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step.status} className="flex items-start gap-4">
                      {/* Step Bubble */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all shrink-0 ${
                          isCurrent
                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 ring-4 ring-orange-100 scale-105'
                            : isCompleted
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-stone-100 text-stone-400 border border-stone-200'
                        }`}
                      >
                        {step.icon}
                      </div>

                      {/* Step Text Info */}
                      <div className="flex-1 pt-1.5">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm sm:text-base font-bold ${
                              isCompleted ? 'text-stone-900' : 'text-stone-400'
                            }`}
                          >
                            {step.title}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 animate-pulse">
                              In Progress
                            </span>
                          )}
                          {isCompleted && !isCurrent && (
                            <span className="text-[10px] font-bold text-emerald-700">✓ Done</span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">{step.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Delivery Route Map Visualization */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-orange-600" />
                <h4 className="text-sm font-bold text-stone-900">Live Delivery Route</h4>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live GPS Active
              </span>
            </div>

            {/* Stylized Vector Map representation */}
            <div className="relative h-64 bg-stone-100 p-6 flex flex-col justify-between overflow-hidden">
              {/* Map background grid lines */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    'radial-gradient(#d97706 1px, transparent 1px), radial-gradient(#d97706 1px, #f5f5f4 1px)',
                  backgroundSize: '24px 24px',
                  backgroundPosition: '0 0, 12px 12px',
                }}
              />

              {/* Road line representation */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <path
                  d="M 50,200 C 150,180 200,80 350,110 S 550,140 700,50"
                  fill="none"
                  stroke="#fb923c"
                  strokeWidth="6"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              </svg>

              {/* Restaurant Pin Left */}
              <div className="relative z-10 flex items-center gap-2 self-start bg-white/90 backdrop-blur-xs p-2 rounded-xl shadow-md border border-stone-200">
                <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
                  🍳
                </div>
                <div className="text-left text-xs">
                  <span className="font-bold text-stone-900 block truncate max-w-[120px]">
                    {order.items[0]?.item.restaurantName || 'Kitchen'}
                  </span>
                  <span className="text-[10px] text-stone-400">Order Picked Up</span>
                </div>
              </div>

              {/* Animated Rider icon along path */}
              <div
                className="relative z-10 self-center transition-all duration-700 bg-stone-900 text-white px-3 py-1.5 rounded-xl shadow-xl border border-orange-500/50 flex items-center gap-2"
                style={{
                  transform: `translateX(${(mapProgressPercent - 50) * 4}px)`,
                }}
              >
                <Bike className="w-5 h-5 text-orange-400 animate-bounce" />
                <div className="text-left">
                  <div className="text-[11px] font-bold">{order.deliveryPartner.name}</div>
                  <div className="text-[9px] text-stone-300">{order.deliveryPartner.vehicleNo}</div>
                </div>
              </div>

              {/* Home Destination Pin Right */}
              <div className="relative z-10 flex items-center gap-2 self-end bg-white/90 backdrop-blur-xs p-2 rounded-xl shadow-md border border-stone-200">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  🏠
                </div>
                <div className="text-left text-xs">
                  <span className="font-bold text-stone-900 block truncate max-w-[120px]">
                    {order.address.name}'s Home
                  </span>
                  <span className="text-[10px] text-stone-400">{order.address.flatHouse}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Delivery Partner & Order Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Delivery Partner Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-4">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
              Delivery Executive
            </span>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-base shadow-xs">
                {order.deliveryPartner.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">{order.deliveryPartner.name}</h4>
                <div className="text-xs text-stone-500">
                  {order.deliveryPartner.vehicleNo} · ★ {order.deliveryPartner.rating}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
              <a
                href={`tel:${order.deliveryPartner.phone}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Rider</span>
              </a>

              <div className="p-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-medium">
                Vaccinated & Masked
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
              Delivery Destination
            </span>
            <div className="flex items-start gap-2.5 text-xs text-stone-700 pt-1">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block">{order.address.name} ({order.address.type})</strong>
                <p className="text-stone-600 mt-0.5">
                  {order.address.flatHouse}, {order.address.street}
                </p>
                {order.address.landmark && (
                  <p className="text-stone-400 text-[11px]">Near {order.address.landmark}</p>
                )}
                <p className="text-stone-500 mt-1 font-mono">Pincode: {order.address.pincode}</p>
              </div>
            </div>
          </div>

          {/* Order Receipt Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-3 text-xs">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
              Receipt Details
            </span>

            <div className="divide-y divide-stone-100">
              {order.items.map(({ item, quantity }) => (
                <div key={item.id} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-800">{quantity}x</span>
                    <span className="text-stone-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-stone-900">₹{item.price * quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100 space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxes & GST</span>
                <span>₹{order.taxes}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-extrabold text-stone-900 text-sm">
                <span>Total Paid</span>
                <span className="text-orange-600 font-display">₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
