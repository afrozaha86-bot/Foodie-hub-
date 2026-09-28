import React, { useState } from 'react';
import { useFoodieHub } from '../context/FoodieHubContext';
import { MENU_ITEMS } from '../data/mockData';
import { DeliveryAddress } from '../types';
import {
  User,
  MapPin,
  Clock,
  Heart,
  Settings,
  Plus,
  Trash2,
  Edit2,
  ShoppingBag,
  CheckCircle2,
  Bike,
  ShieldCheck,
  Bell,
  Home,
  Briefcase,
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const {
    user,
    updateUser,
    addAddress,
    deleteAddress,
    orders,
    setActiveTrackingOrder,
    setCurrentView,
    addToCart,
    setCartDrawerOpen,
    toggleFavorite,
  } = useFoodieHub();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'favorites'>('profile');

  // Edit profile form state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  // Add Address Form State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrName, setNewAddrName] = useState(user.name);
  const [newAddrPhone, setNewAddrPhone] = useState(user.phone);
  const [newFlat, setNewFlat] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newPincode, setNewPincode] = useState('560038');
  const [newType, setNewType] = useState<'Home' | 'Work' | 'Other'>('Home');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email, phone });
    setProfileSuccessMsg(true);
    setTimeout(() => setProfileSuccessMsg(false), 3000);
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newPincode.trim()) return;

    addAddress({
      name: newAddrName,
      phone: newAddrPhone,
      flatHouse: newFlat || 'House',
      street: newStreet,
      landmark: newLandmark,
      pincode: newPincode,
      type: newType,
    });

    setIsAddingAddress(false);
    setNewFlat('');
    setNewStreet('');
    setNewLandmark('');
  };

  const handleReorder = (orderItems: typeof orders[0]['items']) => {
    orderItems.forEach(({ item, quantity }) => {
      addToCart(item, quantity);
    });
    setCartDrawerOpen(true);
  };

  // Favorite items mapped
  const favoriteItems = MENU_ITEMS.filter((item) => user.favorites.includes(item.id));

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Profile Summary Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-orange-500/25">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-stone-900">
              {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">{user.email}</p>
            <p className="text-xs text-stone-400 mt-0.5">{user.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-center">
            <span className="text-[11px] text-stone-400 block font-medium">Orders Placed</span>
            <span className="text-base font-extrabold text-stone-900">{orders.length}</span>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-center">
            <span className="text-[11px] text-stone-400 block font-medium">Saved Places</span>
            <span className="text-base font-extrabold text-stone-900">{user.addresses.length}</span>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-center">
            <span className="text-[11px] text-stone-400 block font-medium">Favorites</span>
            <span className="text-base font-extrabold text-stone-900">{user.favorites.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'profile', label: 'Account Details', icon: <User className="w-4 h-4" /> },
          { id: 'addresses', label: 'Saved Addresses', icon: <MapPin className="w-4 h-4" /> },
          { id: 'orders', label: 'Previous Orders', icon: <Clock className="w-4 h-4" /> },
          { id: 'favorites', label: 'Favorite Foods', icon: <Heart className="w-4 h-4" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-orange-600 text-white shadow-xs shadow-orange-600/25'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile Details & Settings */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-stone-900 mb-4">Edit Personal Information</h3>

            {profileSuccessMsg && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Your profile details have been saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-stone-900">Notification Preferences</h4>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-stone-700">SMS Order Updates</span>
                  <input type="checkbox" defaultChecked className="accent-orange-600 w-4 h-4" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-stone-700">WhatsApp Live Tracking</span>
                  <input type="checkbox" defaultChecked className="accent-orange-600 w-4 h-4" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-stone-700">Exclusive Promo Codes</span>
                  <input type="checkbox" defaultChecked className="accent-orange-600 w-4 h-4" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900">
              Manage Saved Addresses ({user.addresses.length})
            </h3>
            <button
              onClick={() => setIsAddingAddress(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Add Address Modal / Drawer Form */}
          {isAddingAddress && (
            <div className="bg-stone-50 border border-orange-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-stone-900">Add New Delivery Location</h4>
                <button
                  onClick={() => setIsAddingAddress(false)}
                  className="text-xs font-bold text-stone-500 hover:text-stone-800"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={newAddrName}
                      onChange={(e) => setNewAddrName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 rounded-lg bg-white border border-stone-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 rounded-lg bg-white border border-stone-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Flat / House No.</label>
                    <input
                      type="text"
                      value={newFlat}
                      onChange={(e) => setNewFlat(e.target.value)}
                      placeholder="e.g. Flat 204, Tower B"
                      className="w-full text-xs px-3.5 py-2 rounded-lg bg-white border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Street / Area *</label>
                    <input
                      type="text"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      placeholder="e.g. 100ft Road, Indiranagar"
                      className="w-full text-xs px-3.5 py-2 rounded-lg bg-white border border-stone-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Landmark</label>
                    <input
                      type="text"
                      value={newLandmark}
                      onChange={(e) => setNewLandmark(e.target.value)}
                      placeholder="e.g. Near Metro Station"
                      className="w-full text-xs px-3.5 py-2 rounded-lg bg-white border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 rounded-lg bg-white border border-stone-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Address Type</label>
                  <div className="flex gap-2">
                    {(['Home', 'Work', 'Other'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewType(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                          newType === t
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-white text-stone-700 border-stone-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700"
                >
                  Save Address
                </button>
              </form>
            </div>
          )}

          {/* Addresses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-bold">
                      {addr.type === 'Home' ? (
                        <Home className="w-3.5 h-3.5 text-orange-600" />
                      ) : (
                        <Briefcase className="w-3.5 h-3.5 text-stone-600" />
                      )}
                      <span>{addr.type}</span>
                    </span>

                    {user.addresses.length > 1 && (
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                        title="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-stone-900">{addr.name}</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {addr.flatHouse}, {addr.street}, {addr.landmark && `near ${addr.landmark}, `}
                    {addr.pincode}
                  </p>
                  <p className="text-xs text-stone-400 mt-2 font-mono">Mobile: {addr.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Previous Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-stone-900">
            Order History & Status ({orders.length})
          </h3>

          <div className="space-y-4">
            {orders.map((ord) => {
              const isDelivered = ord.status === 'delivered';
              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900 font-mono">
                          Order #{ord.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isDelivered
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-orange-100 text-orange-800 animate-pulse'
                          }`}
                        >
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400">
                        Placed on {new Date(ord.placedAt).toLocaleDateString()} at{' '}
                        {new Date(ord.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveTrackingOrder(ord);
                          setCurrentView('tracking');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Bike className="w-3.5 h-3.5" />
                        <span>Track Order</span>
                      </button>

                      <button
                        onClick={() => handleReorder(ord.items)}
                        className="px-3.5 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="divide-y divide-stone-50 text-xs">
                    {ord.items.map(({ item, quantity }) => (
                      <div key={item.id} className="py-1.5 flex items-center justify-between">
                        <span className="text-stone-700">
                          {quantity}x {item.name}
                        </span>
                        <span className="font-semibold text-stone-900">₹{item.price * quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total Amount & Destination */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500">
                      Delivered to {ord.address.street}
                    </span>
                    <span className="font-bold text-stone-900 text-sm">
                      Total: ₹{ord.total}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Favorite Foods */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-stone-900">
            Saved Favorite Foods ({favoriteItems.length})
          </h3>

          {favoriteItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteItems.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-white rounded-2xl border border-stone-200 p-4 flex items-center justify-between gap-4 shadow-xs"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-stone-900 truncate">{dish.name}</h4>
                    <p className="text-xs text-stone-500">{dish.restaurantName}</p>
                    <p className="text-xs font-bold text-stone-900 mt-1">₹{dish.price}</p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => addToCart(dish, 1)}
                      className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
                    >
                      + Add
                    </button>
                    <button
                      onClick={() => toggleFavorite(dish.id)}
                      className="text-[10px] text-stone-400 hover:text-red-500 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
              <Heart className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-700">No favorite dishes saved yet</p>
              <p className="text-xs text-stone-400 mt-1">
                Click the heart icon on any dish in the menu to quickly access it here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
