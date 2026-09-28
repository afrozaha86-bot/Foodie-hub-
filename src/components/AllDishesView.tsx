import React, { useMemo } from 'react';
import { useFoodieHub } from '../context/FoodieHubContext';
import { CATEGORIES, MENU_ITEMS } from '../data/mockData';
import { FoodItemCard } from './FoodItemCard';
import { FoodCategory } from '../types';
import { Search, Sparkles, Filter, X } from 'lucide-react';

export const AllDishesView: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    onlyVeg,
    setOnlyVeg,
    searchQuery,
    setSearchQuery,
  } = useFoodieHub();

  const filteredDishes = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Pure veg filter
      if (onlyVeg && !item.isVeg) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesRestaurant = item.restaurantName.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesRestaurant && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, onlyVeg, searchQuery]);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Culinary Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-stone-900">
            Explore All Food & Dishes
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Browse our complete selection of fresh pizzas, royal biryanis, smash burgers, and sweet treats.
          </p>
        </div>

        {/* Veg filter and search */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOnlyVeg(!onlyVeg)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              onlyVeg
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-stone-700 border-stone-300 hover:border-emerald-500'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlyVeg ? 'bg-white' : 'bg-emerald-600'}`} />
            <span>Pure Veg Only</span>
          </button>

          <div className="relative w-48 sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by dish or kitchen..."
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-white border border-stone-300 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Category selector row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/25 scale-105'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-orange-300 hover:bg-orange-50/50'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active filters pill display */}
      {(selectedCategory !== 'All' || onlyVeg || searchQuery) && (
        <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
          <span className="font-semibold text-stone-700">Filtering by:</span>
          {selectedCategory !== 'All' && (
            <span className="px-2.5 py-1 rounded-md bg-orange-100 text-orange-800 font-medium">
              {selectedCategory}
            </span>
          )}
          {onlyVeg && (
            <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-medium">
              Veg Only
            </span>
          )}
          {searchQuery && (
            <span className="px-2.5 py-1 rounded-md bg-stone-200 text-stone-800 font-medium">
              "{searchQuery}"
            </span>
          )}
          <button
            onClick={() => {
              setSelectedCategory('All');
              setOnlyVeg(false);
              setSearchQuery('');
            }}
            className="text-orange-600 font-bold hover:underline ml-2 cursor-pointer flex items-center gap-0.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        </div>
      )}

      {/* Dishes Grid */}
      {filteredDishes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredDishes.map((dish) => (
            <FoodItemCard key={dish.id} item={dish} showRestaurantName />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="text-lg font-bold text-stone-900">No dishes found</h3>
          <p className="text-xs text-stone-500">
            We couldn't find any dishes matching your search query or filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setOnlyVeg(false);
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-orange-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
