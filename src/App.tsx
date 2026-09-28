/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { FoodieHubProvider, useFoodieHub } from './context/FoodieHubContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { OffersSection } from './components/OffersSection';
import { RestaurantSection } from './components/RestaurantSection';
import { RestaurantDetailView } from './components/RestaurantDetailView';
import { AllDishesView } from './components/AllDishesView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { UserProfileView } from './components/UserProfileView';
import { OffersView } from './components/OffersView';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentView } = useFoodieHub();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900 selection:bg-orange-500 selection:text-white">
      {/* Universal Top Navigation */}
      <Navbar />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroBanner />
            <OffersSection />
            <RestaurantSection />
          </>
        )}

        {currentView === 'restaurants' && (
          <div className="py-6">
            <RestaurantSection />
          </div>
        )}

        {currentView === 'restaurant_detail' && <RestaurantDetailView />}

        {currentView === 'menu' && <AllDishesView />}

        {currentView === 'checkout' && <CheckoutView />}

        {currentView === 'confirmation' && <OrderConfirmationView />}

        {currentView === 'tracking' && <OrderTrackingView />}

        {currentView === 'orders' && <OrderTrackingView />}

        {currentView === 'offers' && <OffersView />}

        {currentView === 'profile' && <UserProfileView />}
      </main>

      {/* Universal Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Universal Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <FoodieHubProvider>
      <AppContent />
    </FoodieHubProvider>
  );
}
