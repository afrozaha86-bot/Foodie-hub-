import React, { useMemo, useState } from 'react';
import { useFoodieHub } from '../context/FoodieHubContext';
import { MENU_ITEMS } from '../data/mockData';
import { FoodItemCard } from './FoodItemCard';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  ShieldCheck,
  Search,
  ShoppingBag,
  IndianRupee,
} from 'lucide-react';

export const RestaurantDetailView: React.FC = () => {
  const {
    selectedRestaurant,
    setCurrentView,
    cart,
    setCartDrawerOpen,
    total,
  } = useFoodieHub();

  const [menuSearch, setMenuSearch] = useState('');
  const [vegOnlyFilter, setVegOnlyFilter] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('All');

  if (!selectedRestaurant) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <p className="text-stone-600 mb-4">No restaurant selected.</p>
        <button
          onClick={() => setCurrentView('restaurants')}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold"
        >
          Back to Restaurants
        </button>
      </div>
    );
  }

  // Get items for this restaurant
  const restaurantItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => item.restaurantId === selectedRestaurant.id);
  }, [selectedRestaurant.id]);

  // Unique categories in this restaurant's menu
  const menuCategories = useMemo(() => {
    const cats = Array.from(new Set(restaurantItems.map((i) => i.category)));
    return ['All', ...cats];
  }, [restaurantItems]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return restaurantItems.filter((item) => {
      if (vegOnlyFilter && !item.isVeg) return false;
      if (activeCategoryTab !== 'All' && item.category !== activeCategoryTab) return false;
      if (menuSearch.trim()) {
        const q = menuSearch.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [restaurantItems, vegOnlyFilter, activeCategoryTab, menuSearch]);

  const totalCartCount = cart.reduce((acc, c) => acc + c.quantity, 0);

  return (
    <div className="pb-24 pt-4 sm:pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb / Back button */}
        <button
          onClick={() => setCurrentView('restaurants')}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-orange-600 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-stone-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Restaurants</span>
        </button>

        {/* Restaurant Header Banner Card */}
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
          {/* Top Banner Image */}
          <div className="relative h-48 sm:h-64 w-full bg-stone-900">
            <img
              src={selectedRestaurant.image}
              alt={selectedRestaurant.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            {/* Overlaid Restaurant Info */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  {selectedRestaurant.isPureVeg && (
                    <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                      PURE VEG
                    </span>
                  )}
                  <span className="text-xs text-amber-300 font-semibold">
                    {selectedRestaurant.cuisine.join(' · ')}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold font-display">
                  {selectedRestaurant.name}
                </h1>
                <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-xl">
                  {selectedRestaurant.tagline}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-stone-300 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>{selectedRestaurant.address}</span>
                </div>
              </div>

              {/* Rating & Delivery Badge */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center min-w-[80px]">
                  <div className="flex items-center justify-center gap-1 text-sm font-extrabold text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{selectedRestaurant.rating}</span>
                  </div>
                  <div className="text-[10px] text-stone-300 mt-0.5">
                    {selectedRestaurant.ratingCount}+ ratings
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center min-w-[80px]">
                  <div className="flex items-center justify-center gap-1 text-sm font-extrabold text-white">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span>{selectedRestaurant.deliveryTimeMins}m</span>
                  </div>
                  <div className="text-[10px] text-stone-300 mt-0.5">Delivery Time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice Bar */}
          <div className="bg-stone-50 px-6 py-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 font-semibold text-stone-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Hygiene Assured
              </span>
              <span>·</span>
              <span>Min order: ₹{selectedRestaurant.minOrder}</span>
              <span>·</span>
              <span>₹{selectedRestaurant.priceForTwo} for two</span>
            </div>

            <div className="text-orange-600 font-bold">
              🔥 Free delivery on orders over ₹499
            </div>
          </div>
        </div>

        {/* Menu Filtering & Search Header */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-20 z-20 shadow-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {menuCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryTab(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategoryTab === cat
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Controls: Veg Filter & Search Inside Menu */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Pure Veg Toggle */}
            <button
              onClick={() => setVegOnlyFilter(!vegOnlyFilter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                vegOnlyFilter
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-stone-700 border-stone-300 hover:border-emerald-500'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${vegOnlyFilter ? 'bg-white' : 'bg-emerald-600'}`} />
              <span>Veg Only</span>
            </button>

            {/* Menu Search */}
            <div className="relative w-44 sm:w-56">
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search dish in menu..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-orange-500"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Menu Items List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-display text-stone-900">
              Recommended Menu Items ({filteredItems.length})
            </h2>
            <span className="text-xs text-stone-500">Prices are inclusive of standard GST</span>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <FoodItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
              <div className="text-3xl">🍲</div>
              <h3 className="text-base font-bold text-stone-800">No dishes match your selection</h3>
              <p className="text-xs text-stone-500">
                Try clearing the Veg filter or adjusting your dish search term.
              </p>
              <button
                onClick={() => {
                  setVegOnlyFilter(false);
                  setActiveCategoryTab('All');
                  setMenuSearch('');
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors"
              >
                Show All Dishes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Cart Bar (if items in cart) */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto">
          <div className="bg-stone-900 text-white rounded-2xl p-3.5 shadow-2xl flex items-center justify-between border border-stone-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-sm">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-300">
                  {totalCartCount} item{totalCartCount === 1 ? '' : 's'} added
                </div>
                <div className="text-base font-extrabold text-white">
                  ₹{total} <span className="text-[11px] font-normal text-stone-400">plus taxes</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCartDrawerOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer"
            >
              View Cart →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
