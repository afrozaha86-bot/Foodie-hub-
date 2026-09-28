import React, { useState } from 'react';
import { useFoodieHub } from '../context/FoodieHubContext';
import {
  ShoppingBag,
  MapPin,
  Search,
  User,
  Menu as MenuIcon,
  X,
  UtensilsCrossed,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cart,
    setCartDrawerOpen,
    user,
    searchQuery,
    setSearchQuery,
    activeLocation,
    setActiveLocation,
  } = useFoodieHub();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'menu', label: 'Menu' },
    { id: 'offers', label: 'Offers' },
    { id: 'orders', label: 'Orders' },
  ];

  const popularLocations = [
    'Indiranagar, Bengaluru',
    'Koramangala 5th Block, Bengaluru',
    'HSR Layout Sector 4, Bengaluru',
    'Church Street, Central Bengaluru',
    'Whitefield ITPL, Bengaluru',
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs transition-all">
        {/* Top announcement bar */}
        <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4 text-center font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-stone-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Use coupon <strong className="text-amber-400">FIRST50</strong> for ₹50 off on your first meal!
            </span>
            <span className="sm:hidden mx-auto text-amber-400">
              Use code FIRST50 for ₹50 off!
            </span>
            <div className="hidden sm:flex items-center gap-4 text-stone-400 text-xs">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Avg delivery: 28 mins
              </span>
              <span>·</span>
              <button
                onClick={() => setCurrentView('offers')}
                className="hover:text-amber-300 transition-colors cursor-pointer"
              >
                View all coupons
              </button>
            </div>
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-6">
            {/* Brand Logo & Location */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                onClick={() => setCurrentView('home')}
                className="flex items-center gap-2 group text-left cursor-pointer focus:outline-hidden"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
                  <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-bold font-display tracking-tight text-stone-900 group-hover:text-orange-600 transition-colors">
                    Foodie<span className="text-orange-500">Hub</span>
                  </span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-400 -mt-1 hidden sm:block">
                    Order Food Online
                  </span>
                </div>
              </button>

              {/* Delivery Location Pill */}
              <button
                onClick={() => setShowLocationModal(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/80 text-xs font-medium text-stone-700 transition-colors border border-stone-200 cursor-pointer max-w-[210px]"
                title="Change delivery location"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span className="truncate">{activeLocation}</span>
                <span className="text-stone-400 text-[10px]">▼</span>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = currentView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setCurrentView(link.id as any)}
                    className={`text-sm font-semibold transition-all relative py-1 cursor-pointer ${
                      isActive
                        ? 'text-orange-600'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Icons & Controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Quick Search Trigger (on desktop) */}
              <div className="relative hidden md:block w-48 xl:w-60">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentView !== 'menu' && currentView !== 'restaurants') {
                      setCurrentView('menu');
                    }
                  }}
                  placeholder="Search food, dishes..."
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-lg bg-stone-100 border border-stone-200/80 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-hidden transition-all placeholder:text-stone-400"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* User Profile / Login */}
              <button
                onClick={() => setCurrentView('profile')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                  currentView === 'profile'
                    ? 'bg-orange-50 border-orange-300 text-orange-700'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
                title="User Profile & Settings"
              >
                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm shadow-orange-600/30 transition-all cursor-pointer hover:shadow-md"
                title="View Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartTotalItems > 0 && (
                  <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] font-bold flex items-center justify-center -ml-0.5">
                    {cartTotalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 cursor-pointer"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-3">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'menu' && currentView !== 'restaurants') {
                    setCurrentView('menu');
                  }
                }}
                placeholder="Search food or restaurants..."
                className="w-full text-sm pl-9 pr-4 py-2.5 rounded-lg bg-stone-100 border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Mobile Nav Links */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentView(link.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
                    currentView === link.id
                      ? 'bg-orange-50 text-orange-600 font-bold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Mobile Location Selector */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                <span className="truncate">{activeLocation}</span>
              </div>
              <button
                onClick={() => {
                  setShowLocationModal(true);
                  setMobileMenuOpen(false);
                }}
                className="text-orange-600 font-bold hover:underline shrink-0"
              >
                Change
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Location Selector Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-stone-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold text-stone-900">Select Delivery Location</h3>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Choose your address or neighborhood to see restaurants delivering near you.
            </p>

            <div className="space-y-2 mb-4">
              {popularLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setActiveLocation(loc);
                    setShowLocationModal(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-sm flex items-center justify-between transition-colors cursor-pointer ${
                    activeLocation === loc
                      ? 'border-orange-500 bg-orange-50 text-orange-900 font-medium'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-stone-400">📍</span>
                    {loc}
                  </span>
                  {activeLocation === loc && (
                    <span className="text-orange-600 font-bold text-xs">Active</span>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setShowLocationModal(false)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
