import React, { useState } from 'react';
import { Restaurant } from '../types';
import { useFoodieHub } from '../context/FoodieHubContext';
import { Star, Clock, Utensils, MapPin, IndianRupee } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { setSelectedRestaurant, setCurrentView } = useFoodieHub();
  const [imageError, setImageError] = useState(false);

  const handleViewMenu = () => {
    setSelectedRestaurant(restaurant);
    setCurrentView('restaurant_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Top Image Frame */}
      <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
        {!imageError ? (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-orange-600">
            <Utensils className="w-12 h-12 opacity-40" />
          </div>
        )}

        {/* Gradient Scrim for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {restaurant.isPureVeg ? (
            <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px] tracking-wide shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              PURE VEG
            </span>
          ) : restaurant.isPopular ? (
            <span className="px-2.5 py-1 rounded-full bg-orange-600 text-white font-bold text-[10px] tracking-wide shadow-sm">
              ★ POPULAR
            </span>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xs text-stone-900 px-2 py-0.5 rounded-lg text-xs font-bold shadow-xs">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{restaurant.rating}</span>
            <span className="text-[10px] text-stone-400 font-normal">({restaurant.ratingCount})</span>
          </div>
        </div>

        {/* Bottom overlay inside image: Featured Dish */}
        <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs">
          <div className="text-[10px] text-amber-300 font-medium">Must Try:</div>
          <div className="font-semibold truncate">{restaurant.featuredDish}</div>
        </div>
      </div>

      {/* Restaurant Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
          </div>

          <p className="text-xs text-stone-500 mt-1 line-clamp-1">
            {restaurant.cuisine.join(' · ')}
          </p>

          <p className="text-xs text-stone-400 mt-1 flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{restaurant.address}</span>
          </p>
        </div>

        {/* Meta Stats Row (Delivery Time, Min Order, Price For Two) */}
        <div className="pt-3 border-t border-stone-100 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-stone-50 py-1.5 px-2 rounded-lg">
            <span className="text-[10px] text-stone-400 block font-medium">Delivery</span>
            <span className="font-bold text-stone-800 flex items-center justify-center gap-0.5">
              <Clock className="w-3 h-3 text-orange-500" />
              {restaurant.deliveryTimeMins}m
            </span>
          </div>

          <div className="bg-stone-50 py-1.5 px-2 rounded-lg">
            <span className="text-[10px] text-stone-400 block font-medium">Min Order</span>
            <span className="font-bold text-stone-800">₹{restaurant.minOrder}</span>
          </div>

          <div className="bg-stone-50 py-1.5 px-2 rounded-lg">
            <span className="text-[10px] text-stone-400 block font-medium">For Two</span>
            <span className="font-bold text-stone-800">₹{restaurant.priceForTwo}</span>
          </div>
        </div>

        {/* Action Button: View Menu */}
        <button
          onClick={handleViewMenu}
          className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-2 group-hover:bg-orange-600"
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>View Menu</span>
        </button>
      </div>
    </div>
  );
};
