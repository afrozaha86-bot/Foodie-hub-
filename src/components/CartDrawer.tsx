import React, { useState } from 'react';
import { useFoodieHub } from '../context/FoodieHubContext';
import { COUPONS } from '../data/mockData';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
  Percent,
  Check,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cartDrawerOpen,
    setCartDrawerOpen,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    taxes,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setCurrentView,
  } = useFoodieHub();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  const handleApplyCoupon = (code: string) => {
    setCouponError(null);
    setCouponSuccess(null);
    const res = applyCoupon(code);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleProceedToCheckout = () => {
    setCartDrawerOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddMoreItems = () => {
    setCartDrawerOpen(false);
    setCurrentView('menu');
  };

  if (!cartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FDFBF7] shadow-2xl flex flex-col justify-between border-l border-stone-200">
          {/* Header */}
          <div className="px-5 py-4 bg-white border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Your Food Basket</h3>
                <span className="text-[11px] text-stone-500 font-medium">
                  {cart.length} item{cart.length === 1 ? '' : 's'} added
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[11px] font-semibold text-stone-400 hover:text-red-600 px-2 py-1 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-3xl">
                  🛒
                </div>
                <h4 className="text-lg font-bold text-stone-900">Your basket is empty</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Good food is always just around the corner. Browse our popular restaurants and treat yourself!
                </p>
                <button
                  onClick={handleAddMoreItems}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer"
                >
                  Explore Food Items
                </button>
              </div>
            ) : (
              <>
                {/* Free Delivery Progress Bar */}
                <div className="bg-orange-50 border border-orange-200/80 rounded-xl p-3 text-xs">
                  {subtotal >= 499 ? (
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <span>🎉</span>
                      <span>Congratulations! You unlocked FREE Delivery on this order.</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between font-semibold text-stone-700 mb-1">
                        <span>Add ₹{499 - subtotal} more for Free Delivery</span>
                        <span>{Math.round((subtotal / 499) * 100)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-orange-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-600 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (subtotal / 499) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Food Items List */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Order Items ({cart.length})
                  </span>

                  {cart.map(({ item, quantity }) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-stone-200 p-3 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      {/* Left: Veg icon + Name + Price */}
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        {item.isVeg ? (
                          <span className="w-3.5 h-3.5 rounded-xs border-2 border-emerald-600 flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          </span>
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-xs border-2 border-red-600 flex items-center justify-center shrink-0">
                            <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-red-600" />
                          </span>
                        )}

                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-stone-900 truncate">
                            {item.name}
                          </h5>
                          <div className="text-[11px] text-stone-500">
                            ₹{item.price} each · <span className="font-semibold text-stone-800">₹{item.price * quantity}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quantity Stepper & Delete */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200 text-xs font-bold">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-stone-600 hover:text-stone-900 hover:bg-white rounded-xs transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-stone-600 hover:text-stone-900 hover:bg-white rounded-xs transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-stone-300 hover:text-red-500 rounded-md transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add More Items Link */}
                <div className="text-right">
                  <button
                    onClick={handleAddMoreItems}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>+ Add More Items</span>
                  </button>
                </div>

                {/* Coupon Application Box */}
                <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-orange-500" />
                      Apply Promo Coupon
                    </span>
                    {appliedCoupon && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> {appliedCoupon.code}
                      </span>
                    )}
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                      <div>
                        <div className="font-bold text-emerald-900">{appliedCoupon.code} Applied</div>
                        <div className="text-[11px] text-emerald-700">
                          You save ₹{discount} with this coupon!
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Enter coupon (e.g. FIRST50)"
                          className="flex-1 text-xs px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 font-mono uppercase focus:outline-hidden focus:border-orange-500"
                        />
                        <button
                          onClick={() => handleApplyCoupon(couponInput)}
                          disabled={!couponInput.trim()}
                          className="px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-orange-600 disabled:bg-stone-300 text-white font-bold text-xs transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>

                      {/* Quick Coupon Pill Suggestions */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {COUPONS.slice(0, 3).map((cpn) => (
                          <button
                            key={cpn.code}
                            onClick={() => handleApplyCoupon(cpn.code)}
                            className="text-[10px] font-mono font-bold px-2 py-1 rounded-md bg-stone-100 hover:bg-orange-100 text-stone-700 hover:text-orange-900 border border-stone-200 cursor-pointer transition-colors"
                          >
                            + {cpn.code}
                          </button>
                        ))}
                      </div>

                      {couponError && (
                        <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
                      )}
                      {couponSuccess && (
                        <p className="text-[11px] text-emerald-700 font-medium">{couponSuccess}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Detailed Bill Summary */}
                <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-2.5 shadow-2xs text-xs">
                  <span className="font-bold text-stone-900 block pb-1 border-b border-stone-100">
                    Bill Summary
                  </span>

                  <div className="flex justify-between text-stone-600">
                    <span>Item Total</span>
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
                      <span>Coupon Discount ({appliedCoupon?.code})</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span>Taxes & Restaurant GST (5%)</span>
                    <span className="font-medium text-stone-900">₹{taxes}</span>
                  </div>

                  <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm font-extrabold text-stone-900">
                    <span>Final Amount</span>
                    <span className="text-base text-orange-600 font-display">₹{total}</span>
                  </div>
                </div>

                {/* Safety Guarantee */}
                <div className="flex items-center gap-2 text-[11px] text-stone-500 bg-stone-100/70 p-2.5 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Contactless doorstep delivery with sanitized thermal packaging.</span>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 bg-white border-t border-stone-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span>To Pay: <strong className="text-sm font-extrabold text-stone-900">₹{total}</strong></span>
                <span className="text-[11px]">Avg arrival: 25-30 mins</span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-xl"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
