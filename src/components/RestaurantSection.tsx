import React, { useMemo, useState } from 'react';
import { useFoodieHub } from '../context/FoodieHubContext';
import { RESTAURANTS } from '../data/mockData';
import { RestaurantCard } from './RestaurantCard';
import { SlidersHorizontal, Star, Flame, Sparkles, X } from 'lucide-react';

export const RestaurantSection: React.FC = () => {
  const {
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    onlyVeg,
    setOnlyVeg,
    minRating,
    setMinRating,
  } = useFoodieHub();

  const [sortBy, setSortBy] = useState<'rating' | 'delivery' | 'minOrder'>('rating');
  const [fastDeliveryOnly, setFastDeliveryOnly] = useState<boolean>(false);

  // Filter restaurants
  const filteredRestaurants = useMemo(() => {
    return RESTAURANTS.filter((r) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(query);
        const matchesCuisine = r.cuisine.some((c) => c.toLowerCase().includes(query));
        const matchesDish = r.featuredDish.toLowerCase().includes(query);
        if (!matchesName && !matchesCuisine && !matchesDish) return false;
      }

      // Veg only
      if (onlyVeg && !r.isPureVeg) return false;

      // Min rating
      if (minRating > 0 && r.rating < minRating) return false;

      // Fast delivery (< 25 min)
      if (fastDeliveryOnly) {
        const minMins = parseInt(r.deliveryTimeMins.split('-')[0], 10);
        if (minMins > 20) return false;
      }

      // Category matching
      if (selectedCategory !== 'All') {
        const catLower = selectedCategory.toLowerCase();
        const matchesCategory =
          r.cuisine.some((c) => c.toLowerCase().includes(catLower)) ||
          r.name.toLowerCase().includes(catLower);
        if (!matchesCategory) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'delivery') {
        const aMin = parseInt(a.deliveryTimeMins.split('-')[0], 10);
        const bMin = parseInt(b.deliveryTimeMins.split('-')[0], 10);
        return aMin - bMin;
      }
      if (sortBy === 'minOrder') return a.minOrder - b.minOrder;
      return 0;
    });
  }, [searchQuery, onlyVeg, minRating, fastDeliveryOnly, selectedCategory, sortBy]);

  const hasActiveFilters =
    onlyVeg || minRating > 0 || fastDeliveryOnly || selectedCategory !== 'All' || searchQuery.trim().length > 0;

  const resetAllFilters = () => {
    setOnlyVeg(false);
    setMinRating(0);
    setFastDeliveryOnly(false);
    setSelectedCategory('All');
  };

  return (
    <section id="browse-section" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span>Handpicked Quality</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
            Popular Restaurants Near You
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Explore curated kitchens with verified safety ratings and high customer satisfaction
          </p>
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pure Veg Toggle */}
          <button
            onClick={() => setOnlyVeg(!onlyVeg)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
              onlyVeg
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${onlyVeg ? 'bg-white' : 'bg-emerald-600'}`}
            />
            <span>Pure Veg</span>
          </button>

          {/* Rating 4.5+ Filter */}
          <button
            onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer ${
              minRating === 4.5
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${minRating === 4.5 ? 'fill-white' : 'fill-amber-400 text-amber-400'}`} />
            <span>4.5+ Rating</span>
          </button>

          {/* Fast Delivery (<25m) */}
          <button
            onClick={() => setFastDeliveryOnly(!fastDeliveryOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer ${
              fastDeliveryOnly
                ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                : 'bg-white text-stone-700 border-stone-200 hover:border-orange-400'
            }`}
          >
            <span>⚡ Fast (≤25m)</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1 text-xs bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 font-medium text-stone-700">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-stone-900 focus:outline-hidden cursor-pointer"
            >
              <option value="rating">Top Rated</option>
              <option value="delivery">Fastest Delivery</option>
              <option value="minOrder">Lowest Min Order</option>
            </select>
          </div>

          {/* Reset Filters button if active */}
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-stone-500 hover:text-stone-900 hover:bg-stone-100 flex items-center gap-1 cursor-pointer"
              title="Reset all filters"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Indicators */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mb-6 text-xs text-stone-500 flex-wrap">
          <span className="font-semibold text-stone-700">Active filters:</span>
          {selectedCategory !== 'All' && (
            <span className="px-2.5 py-1 rounded-md bg-orange-100 text-orange-800 font-medium">
              Category: {selectedCategory}
            </span>
          )}
          {onlyVeg && (
            <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-medium">
              Pure Veg Only
            </span>
          )}
          {minRating > 0 && (
            <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 font-medium">
              Rating ≥ {minRating}
            </span>
          )}
          {fastDeliveryOnly && (
            <span className="px-2.5 py-1 rounded-md bg-orange-100 text-orange-800 font-medium">
              Fast Delivery
            </span>
          )}
          {searchQuery && (
            <span className="px-2.5 py-1 rounded-md bg-stone-200 text-stone-800 font-medium">
              Search: "{searchQuery}"
            </span>
          )}
          <span className="ml-auto font-bold text-stone-700">
            {filteredRestaurants.length} restaurant{filteredRestaurants.length === 1 ? '' : 's'} available
          </span>
        </div>
      )}

      {/* Restaurants Grid */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto space-y-4 my-8">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-2xl font-bold">
            🍽️
          </div>
          <h3 className="text-lg font-bold text-stone-900">No restaurants match your filters</h3>
          <p className="text-xs text-stone-500">
            Try adjusting your cuisine filters, minimum rating, or search term to discover more delicious kitchens.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
