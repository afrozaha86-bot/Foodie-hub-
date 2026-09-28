import React from 'react';
import { useFoodieHub } from '../context/FoodieHubContext';
import { UtensilsCrossed, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategory } = useFoodieHub();

  const handleCategoryClick = (cat: any) => {
    setSelectedCategory(cat);
    setCurrentView('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/30">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-display tracking-tight text-white">
                Foodie<span className="text-orange-500">Hub</span>
              </span>
            </div>

            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              FoodieHub is a modern, responsive online food ordering platform delivering hot, chef-crafted meals from top-rated restaurants straight to your doorstep.
            </p>

            <div className="flex items-center gap-2 text-xs text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Hygienic Food & Safe Contactless Delivery</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('restaurants');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Restaurants
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Dishes & Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('offers');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Offers & Coupons
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Order Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Cuisines */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Popular Cuisines
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => handleCategoryClick('Pizza')} className="hover:text-orange-400 transition-colors">
                  Neapolitan Pizza 🍕
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Biryani')} className="hover:text-orange-400 transition-colors">
                  Hyderabadi Biryani 🍛
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Burgers')} className="hover:text-orange-400 transition-colors">
                  Smash Burgers 🍔
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Chinese')} className="hover:text-orange-400 transition-colors">
                  Chinese & Dimsums 🍜
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('South Indian')} className="hover:text-orange-400 transition-colors">
                  South Indian Dosas 🥘
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Desserts')} className="hover:text-orange-400 transition-colors">
                  Cakes & Desserts 🍰
                </button>
              </li>
            </ul>
          </div>

          {/* Delivery Hubs */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Serving Locations
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Indiranagar, Bengaluru</li>
              <li>Koramangala 5th Block</li>
              <li>Church Street Central</li>
              <li>HSR Layout Sector 4</li>
              <li>Whitefield IT Corridor</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} FoodieHub Technologies Inc. All rights reserved.</p>

          <div className="flex items-center gap-1.5 text-stone-400">
            <span>Built for BTech CSE Project Showcase</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-orange-400">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
