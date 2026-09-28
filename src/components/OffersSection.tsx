import React, { useState } from 'react';
import { useFoodieHub } from '../context/FoodieHubContext';
import { COUPONS } from '../data/mockData';
import { Tag, Check, Copy, Sparkles, Percent, ArrowRight } from 'lucide-react';

export const OffersSection: React.FC = () => {
  const { appliedCoupon, applyCoupon, removeCoupon, cart, setCartDrawerOpen, setCurrentView } =
    useFoodieHub();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleApply = (code: string) => {
    if (cart.length === 0) {
      setFeedbackMsg({
        text: `Coupon copied! Add your favorite food to the cart first, then checkout with ${code}.`,
        isError: false,
      });
      handleCopy(code);
      setTimeout(() => setFeedbackMsg(null), 4000);
      return;
    }

    const res = applyCoupon(code);
    setFeedbackMsg({
      text: res.message,
      isError: !res.success,
    });
    setTimeout(() => setFeedbackMsg(null), 4000);

    if (res.success) {
      setCartDrawerOpen(true);
    }
  };

  return (
    <section className="py-8 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-amber-500/5 border-y border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Exclusive Savings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
              Best Offers & Coupons
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('offers')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
          >
            <span>View All Promo Codes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback message banner */}
        {feedbackMsg && (
          <div
            className={`mb-4 p-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
              feedbackMsg.isError
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            <span>{feedbackMsg.text}</span>
            <button
              onClick={() => setFeedbackMsg(null)}
              className="text-xs font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Coupon Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COUPONS.map((coupon) => {
            const isApplied = appliedCoupon?.code === coupon.code;
            const isCopied = copiedCode === coupon.code;

            return (
              <div
                key={coupon.code}
                className={`relative rounded-2xl p-4 transition-all border flex flex-col justify-between ${
                  isApplied
                    ? 'bg-emerald-50/80 border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white border-stone-200 hover:border-orange-300 hover:shadow-md'
                }`}
              >
                {/* Coupon Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-100 text-orange-800 font-mono font-bold text-xs tracking-wider">
                      <Tag className="w-3 h-3 text-orange-600" />
                      {coupon.code}
                    </span>
                    {isApplied ? (
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Applied
                      </span>
                    ) : (
                      <span className="text-[11px] text-stone-500 font-medium">
                        Min ₹{coupon.minOrder}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-stone-900 mb-1">{coupon.title}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
                    {coupon.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800 py-1.5 px-2 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Copy promo code"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  {isApplied ? (
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-bold text-red-600 hover:text-red-700 py-1.5 px-2.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply(coupon.code)}
                      className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-orange-600 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
