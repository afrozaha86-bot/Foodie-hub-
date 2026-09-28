import React, { useState } from 'react';
import { MenuItem } from '../types';
import { useFoodieHub } from '../context/FoodieHubContext';
import { Star, Plus, Minus, Heart, Utensils } from 'lucide-react';

interface FoodItemCardProps {
  item: MenuItem;
  showRestaurantName?: boolean;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({ item, showRestaurantName = false }) => {
  const { cart, addToCart, updateQuantity, user, toggleFavorite } = useFoodieHub();
  const [imageError, setImageError] = useState(false);

  const cartEntry = cart.find((c) => c.item.id === item.id);
  const quantity = cartEntry ? cartEntry.quantity : 0;
  const isFavorite = user.favorites.includes(item.id);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-4 hover:shadow-lg transition-all duration-300 relative group">
      {/* Left Details */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Top Row: Veg Indicator + Rating */}
          <div className="flex items-center gap-2 mb-1.5">
            {/* Authentic FSSAI Veg / Non-Veg Indicator */}
            {item.isVeg ? (
              <span
                className="w-4 h-4 rounded-xs border-2 border-emerald-600 flex items-center justify-center p-0.5 shrink-0"
                title="Pure Vegetarian"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
              </span>
            ) : (
              <span
                className="w-4 h-4 rounded-xs border-2 border-red-600 flex items-center justify-center p-0.5 shrink-0"
                title="Non-Vegetarian"
              >
                <span className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-red-600" />
              </span>
            )}

            {item.isBestSeller && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                ★ BESTSELLER
              </span>
            )}

            <div className="flex items-center gap-1 text-xs font-bold text-amber-700 ml-auto sm:ml-0">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{item.rating}</span>
              <span className="text-[10px] text-stone-400 font-normal">({item.ratingCount})</span>
            </div>
          </div>

          {/* Food Title */}
          <h4 className="text-base font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
            {item.name}
          </h4>

          {showRestaurantName && (
            <p className="text-xs text-orange-600 font-semibold mt-0.5">
              by {item.restaurantName}
            </p>
          )}

          {/* Price */}
          <div className="text-sm font-extrabold text-stone-900 mt-1">
            ₹{item.price}
          </div>

          {/* Description */}
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Favorite button (Quiet affordance) */}
        <div className="pt-2">
          <button
            onClick={() => toggleFavorite(item.id)}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              isFavorite
                ? 'text-red-500 hover:text-red-600'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            <span className="text-[11px]">{isFavorite ? 'Saved to Favorites' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Right Image & Add to Cart Container */}
      <div className="sm:w-36 shrink-0 flex flex-col items-center justify-center relative">
        <div className="w-full h-32 sm:h-28 rounded-xl overflow-hidden bg-stone-100 relative">
          {!imageError ? (
            <img
              src={item.image}
              alt={item.name}
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-orange-50 flex items-center justify-center text-orange-400">
              <Utensils className="w-8 h-8 opacity-40" />
            </div>
          )}
        </div>

        {/* Floating Add to Cart or Stepper Button */}
        <div className="-mt-4 relative z-10 w-28 sm:w-24">
          {quantity === 0 ? (
            <button
              onClick={() => addToCart(item, 1)}
              className="w-full py-1.5 px-3 rounded-lg bg-white border border-stone-300 text-orange-600 hover:bg-orange-600 hover:text-white hover:border-orange-600 font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1 uppercase tracking-wider"
            >
              <span>ADD</span>
              <Plus className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="w-full py-1 px-2 rounded-lg bg-orange-600 text-white font-extrabold text-xs shadow-md flex items-center justify-between border border-orange-700">
              <button
                onClick={() => updateQuantity(item.id, -1)}
                className="p-1 hover:bg-orange-700 rounded-xs transition-colors cursor-pointer"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-1 text-sm">{quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="p-1 hover:bg-orange-700 rounded-xs transition-colors cursor-pointer"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
