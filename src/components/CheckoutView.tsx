import React, { useState } from 'react';
import { useFoodieHub } from '../context/FoodieHubContext';
import { DeliveryAddress, PaymentMethod } from '../types';
import {
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Building,
  Home,
  Briefcase,
  Lock,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    subtotal,
    deliveryFee,
    discount,
    taxes,
    total,
    appliedCoupon,
    user,
    addAddress,
    placeOrder,
    setCurrentView,
  } = useFoodieHub();

  // If cart is empty, redirect
  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="text-4xl">🛒</div>
        <h2 className="text-xl font-bold text-stone-900">Your cart is currently empty</h2>
        <p className="text-xs text-stone-500">
          Please add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => setCurrentView('restaurants')}
          className="px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-orange-700 transition-colors"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  // Address Selection or Input
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user.addresses[0]?.id || 'new'
  );

  // Address Form State
  const [customerName, setCustomerName] = useState(user.name || '');
  const [mobileNumber, setMobileNumber] = useState(user.phone || '');
  const [flatHouse, setFlatHouse] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('560038');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiOption, setUpiOption] = useState<'gpay' | 'phonepe' | 'paytm' | 'id'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('742');

  const [isPlacing, setIsPlacing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    let finalAddress: DeliveryAddress;

    if (selectedAddressId !== 'new') {
      const found = user.addresses.find((a) => a.id === selectedAddressId);
      if (!found) {
        setErrorMessage('Please select a valid delivery address.');
        return;
      }
      finalAddress = found;
    } else {
      // Validate inputs
      if (!customerName.trim() || !mobileNumber.trim() || !streetAddress.trim() || !pincode.trim()) {
        setErrorMessage('Please fill in all mandatory address fields marked with *');
        return;
      }
      finalAddress = {
        id: `addr-${Date.now()}`,
        name: customerName,
        phone: mobileNumber,
        flatHouse: flatHouse || 'House / Flat',
        street: streetAddress,
        landmark: landmark || '',
        pincode,
        type: addressType,
      };
      // Save address for future orders
      addAddress(finalAddress);
    }

    setIsPlacing(true);

    setTimeout(() => {
      placeOrder(finalAddress, paymentMethod);
      setIsPlacing(false);
    }, 1200);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <button
        onClick={() => setCurrentView('restaurants')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-orange-600 mb-6 py-1 px-2 rounded-lg hover:bg-stone-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Continue Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Delivery Address & Payment Method */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            {/* Step 1: Delivery Address */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h2 className="text-lg font-bold text-stone-900">Delivery Address</h2>
                </div>
                <span className="text-xs text-stone-400">Step 1 of 2</span>
              </div>

              {/* Saved Addresses Selector */}
              {user.addresses.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                    Choose Saved Address
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50/70 shadow-xs ring-1 ring-orange-500'
                              : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-stone-900">
                              {addr.type === 'Home' ? (
                                <Home className="w-3.5 h-3.5 text-orange-600" />
                              ) : (
                                <Briefcase className="w-3.5 h-3.5 text-stone-600" />
                              )}
                              {addr.type}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-orange-600" />
                            )}
                          </div>
                          <p className="text-xs font-bold text-stone-800">{addr.name}</p>
                          <p className="text-xs text-stone-600 line-clamp-2 mt-0.5">
                            {addr.flatHouse}, {addr.street}, {addr.landmark && `${addr.landmark}, `}{addr.pincode}
                          </p>
                          <p className="text-[11px] text-stone-500 mt-1">{addr.phone}</p>
                        </div>
                      );
                    })}

                    {/* Add New Address Option */}
                    <div
                      onClick={() => setSelectedAddressId('new')}
                      className={`p-3.5 rounded-xl border border-dashed cursor-pointer transition-all flex flex-col items-center justify-center text-center ${
                        selectedAddressId === 'new'
                          ? 'border-orange-500 bg-orange-50/70 ring-1 ring-orange-500'
                          : 'border-stone-300 hover:border-orange-400 bg-white'
                      }`}
                    >
                      <MapPin className="w-5 h-5 text-orange-600 mb-1" />
                      <span className="text-xs font-bold text-stone-900">+ Add New Address</span>
                      <span className="text-[10px] text-stone-400">Deliver to a different place</span>
                    </div>
                  </div>
                </div>
              )}

              {/* New Address Fields (shown if 'new' is selected or no saved addresses) */}
              {(selectedAddressId === 'new' || user.addresses.length === 0) && (
                <div className="pt-3 border-t border-stone-100 space-y-4">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">
                    Enter New Delivery Details
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Customer Full Name *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        required
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      House / Flat / Building No.
                    </label>
                    <input
                      type="text"
                      value={flatHouse}
                      onChange={(e) => setFlatHouse(e.target.value)}
                      placeholder="e.g. Flat 302, Green Valley Apartments"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Complete Delivery Address *
                    </label>
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g. 100ft Road, 12th Main, Indiranagar"
                      required
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Landmark
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near Metro Station / Opposite Park"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="560038"
                        required
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Save Address As
                    </label>
                    <div className="flex gap-2">
                      {(['Home', 'Work', 'Other'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAddressType(type)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                            addressType === type
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Payment Options */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h2 className="text-lg font-bold text-stone-900">Payment Options</h2>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                  <Lock className="w-3 h-3" />
                  <span>256-bit Encrypted</span>
                </div>
              </div>

              {/* Payment Method Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'upi'
                      ? 'border-orange-500 bg-orange-50/70 ring-1 ring-orange-500'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Smartphone className="w-5 h-5 text-orange-600" />
                    {paymentMethod === 'upi' && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                  </div>
                  <span className="text-xs font-bold text-stone-900">UPI Instant Pay</span>
                  <span className="text-[10px] text-stone-500">Google Pay, PhonePe, Paytm</span>
                </div>

                {/* Card Option */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'card'
                      ? 'border-orange-500 bg-orange-50/70 ring-1 ring-orange-500'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="w-5 h-5 text-orange-600" />
                    {paymentMethod === 'card' && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                  </div>
                  <span className="text-xs font-bold text-stone-900">Credit / Debit Card</span>
                  <span className="text-[10px] text-stone-500">Visa, Mastercard, RuPay</span>
                </div>

                {/* Cash on Delivery Option */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'cod'
                      ? 'border-orange-500 bg-orange-50/70 ring-1 ring-orange-500'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Banknote className="w-5 h-5 text-orange-600" />
                    {paymentMethod === 'cod' && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                  </div>
                  <span className="text-xs font-bold text-stone-900">Cash on Delivery</span>
                  <span className="text-[10px] text-stone-500">Pay cash or scan on delivery</span>
                </div>
              </div>

              {/* Sub-inputs based on payment selection */}
              {paymentMethod === 'upi' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <span className="text-xs font-bold text-stone-700 block">Select UPI App:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'gpay', label: 'Google Pay 🟢' },
                      { id: 'phonepe', label: 'PhonePe 🟣' },
                      { id: 'paytm', label: 'Paytm 🔵' },
                      { id: 'id', label: 'Other UPI ID' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setUpiOption(app.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          upiOption === app.id
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        {app.label}
                      </button>
                    ))}
                  </div>

                  {upiOption === 'id' && (
                    <input
                      type="text"
                      value={customUpiId}
                      onChange={(e) => setCustomUpiId(e.target.value)}
                      placeholder="yourname@okaxis or @okhdfcbank"
                      className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-stone-300 focus:outline-hidden focus:border-orange-500"
                    />
                  )}
                  <p className="text-[11px] text-stone-500">
                    💡 A payment request will be sent to your UPI app once order is submitted.
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 •••• •••• 8921"
                      className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-stone-300 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-stone-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-stone-300 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                  <p className="font-semibold text-stone-900 mb-1">Cash on Delivery selected</p>
                  <p>
                    Please keep exact cash ₹{total} ready. You can also scan the delivery partner's QR code via any UPI app upon delivery.
                  </p>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPlacing}
                  className="w-full py-4 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-xl shadow-orange-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isPlacing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Your Order...
                    </span>
                  ) : (
                    <span>Place Order · ₹{total}</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4 sticky top-24">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              Order Summary ({cart.length} item{cart.length === 1 ? '' : 's'})
            </h3>

            {/* Items list preview */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {cart.map(({ item, quantity }) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="font-bold text-stone-700">{quantity}x</span>
                    <span className="text-stone-800 truncate">{item.name}</span>
                  </div>
                  <span className="font-semibold text-stone-900 shrink-0">
                    ₹{item.price * quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-700 font-bold">FREE</span>
                ) : (
                  <span className="font-medium text-stone-900">₹{deliveryFee}</span>
                )}
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Taxes & GST (5%)</span>
                <span className="font-medium text-stone-900">₹{taxes}</span>
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm font-extrabold text-stone-900">
                <span>Total Amount</span>
                <span className="text-lg text-orange-600 font-display">₹{total}</span>
              </div>
            </div>

            {/* Estimated time */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-center">
              <span className="text-[11px] text-stone-500 block">Estimated Arrival</span>
              <span className="text-sm font-bold text-stone-800">25–35 Minutes</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Safe & contactless delivery with Live GPS tracking.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
