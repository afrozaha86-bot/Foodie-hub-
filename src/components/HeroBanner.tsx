import React, { useState } from 'react';
import { useFoodieHub } from '../context/FoodieHubContext';
import { CATEGORIES, HERO_IMAGE, MENU_ITEMS, RESTAURANTS } from '../data/mockData';
import { FoodCategory } from '../types';
import { Search, Sparkles, ArrowRight, ShieldCheck, Flame, Star } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setCurrentView,
    setSelectedRestaurant,
    addToCart,
  } = useFoodieHub();

  const [isFocused, setIsFocused] = useState(false);

  // Filtered preview for live search dropdown
  const matchingRestaurants = searchQuery.trim()
    ? RESTAURANTS.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.cuisine.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 3)
    : [];

  const matchingDishes = searchQuery.trim()
    ? MENU_ITEMS.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const handleCategoryClick = (cat: FoodCategory) => {
    setSelectedCategory(cat);
    // Smooth scroll down to restaurants/menu section
    const target = document.getElementById('browse-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent pt-6 pb-12 sm:pt-10 sm:pb-16">
      {/* Decorative subtle background accents */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-orange-300/20 via-amber-200/20 to-orange-200/20 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Search & Value Prop */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Tagline kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-900 text-xs font-bold shadow-xs">
              <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
              <span>Fastest Doorstep Delivery in 25–35 Mins</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.1] font-display">
              Delicious Food, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-red-600">
                Delivered to Your Door
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
              Order gourmet handcrafted meals, hot biryanis, authentic pizzas, and tempting desserts from the finest restaurants near you.
            </p>

            {/* Interactive Search Bar with Live Autocomplete */}
            <div className="relative max-w-xl">
              <div
                className={`relative flex items-center bg-white rounded-2xl p-2 shadow-lg border transition-all ${
                  isFocused
                    ? 'border-orange-500 ring-4 ring-orange-500/15 shadow-xl'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="pl-3 pr-2 text-stone-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 250)}
                  placeholder="Search for food or restaurants (e.g. Biryani, Pizza, Burger)..."
                  className="w-full py-2.5 px-2 text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 mr-1 text-stone-400 hover:text-stone-700 text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => {
                    setCurrentView('menu');
                    const target = document.getElementById('browse-section');
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/25 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4 hidden sm:inline" />
                </button>
              </div>

              {/* Autocomplete Dropdown */}
              {isFocused && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 overflow-hidden divide-y divide-stone-100 max-h-96 overflow-y-auto">
                  {matchingRestaurants.length > 0 && (
                    <div className="p-3">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2">
                        Restaurants
                      </span>
                      {matchingRestaurants.map((res) => (
                        <div
                          key={res.id}
                          onMouseDown={() => {
                            setSelectedRestaurant(res);
                            setCurrentView('restaurant_detail');
                          }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={res.image}
                              alt={res.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                            />
                            <div>
                              <div className="text-sm font-semibold text-stone-900">{res.name}</div>
                              <div className="text-xs text-stone-500">{res.cuisine.join(', ')}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>{res.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchingDishes.length > 0 && (
                    <div className="p-3">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2">
                        Food Items
                      </span>
                      {matchingDishes.map((dish) => (
                        <div
                          key={dish.id}
                          onMouseDown={() => {
                            addToCart(dish, 1);
                          }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                            />
                            <div>
                              <div className="text-sm font-semibold text-stone-900">{dish.name}</div>
                              <div className="text-xs text-stone-500">
                                {dish.restaurantName} · ₹{dish.price}
                              </div>
                            </div>
                          </div>
                          <button className="px-2.5 py-1 rounded-md bg-orange-50 text-orange-600 font-bold text-xs hover:bg-orange-100">
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchingRestaurants.length === 0 && matchingDishes.length === 0 && (
                    <div className="p-4 text-center text-sm text-stone-500">
                      No matching food or restaurants found for "{searchQuery}".
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Food Categories Quick Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Explore by Category
                </span>
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="text-xs font-semibold text-orange-600 hover:underline cursor-pointer"
                  >
                    Reset Filter (Showing {selectedCategory})
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/30 scale-105'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-orange-300 hover:bg-orange-50/50'
                      }`}
                    >
                      <span className="text-base">{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-stone-500 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Hygiene & Quality Certified</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Live GPS Rider Tracking</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>No Minimum Order</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Feast Photography Display */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative background glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-amber-300 rounded-3xl transform rotate-2 scale-102 opacity-30 blur-xl" />

              {/* Main Image Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-900 group aspect-4/3 sm:aspect-16/10 lg:aspect-4/3">
                <img
                  src={HERO_IMAGE}
                  alt="Delicious food feast spread at FoodieHub"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Floating Discount Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-lg border border-white/50 flex items-center gap-2">
                  <span className="text-lg">🎉</span>
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                      Welcome Offer
                    </div>
                    <div className="text-xs font-extrabold text-stone-900">
                      Up to <span className="text-orange-600">50% OFF</span> Today
                    </div>
                  </div>
                </div>

                {/* Floating Fast Delivery Card */}
                <div className="absolute bottom-4 right-4 bg-stone-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl shadow-lg border border-white/10 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-sm">
                    ⚡
                  </div>
                  <div>
                    <div className="text-xs font-bold">Lightning Express</div>
                    <div className="text-[11px] text-stone-300">Average 25 mins arrival</div>
                  </div>
                </div>

                {/* Bottom text inside frame */}
                <div className="absolute bottom-4 left-4 max-w-[200px] text-white">
                  <span className="text-xs font-semibold text-amber-300">Trending Now</span>
                  <p className="text-sm font-bold truncate">Woodfired Artisan Pizzas & Biryanis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
