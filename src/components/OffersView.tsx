import React, { useState } from 'react';
import { useFoodieHub } from '../context/FoodieHubContext';
import { COUPONS } from '../data/mockData';
import { Tag, Check, Copy, Sparkles, Gift, ArrowRight, ShieldCheck, Percent } from 'lucide-react';

export const OffersView: React.FC = () => {
  const { appliedCoupon, applyCoupon, removeCoupon, cart, setCartDrawerOpen, setCurrentView } =
    useFoodieHub();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleApply = (code: string) => {
    if (cart.length === 0) {
      handleCopy(code);
      setStatusMsg({
        text: `Coupon ${code} copied! Add your favorite dishes to the cart first, then checkout.`,
        isError: false,
      });
      setTimeout(() => setStatusMsg(null), 4000);
      return;
    }

    const res = applyCoupon(code);
    setStatusMsg({
      text: res.message,
      isError: !res.success,
    });
    setTimeout(() => setStatusMsg(null), 4000);

    if (res.success) {
      setCartDrawerOpen(true);
    }
  };

  const bankOffers = [
    {
      bank: 'HDFC Bank Credit Cards',
      offer: 'Flat ₹150 off on minimum spend of ₹699 with code HDFC150',
      tag: 'Bank Offer',
    },
    {
      bank: 'ICICI PayLater & Cards',
      offer: 'Get 15% cashback up to ₹100 on weekend dinner orders',
      tag: 'Weekend Special',
    },
    {
      bank: 'Paytm UPI Instant Pay',
      offer: 'Assured ₹20 to ₹50 cashback directly into bank account',
      tag: 'UPI Exclusive',
    },
  ];

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-12 pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-amber-200">
            <Gift className="w-3.5 h-3.5" />
            <span>Daily Foodie Rewards</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight">
            Best Deals, Vouchers & Mega Discounts
          </h1>
          <p className="text-sm sm:text-base text-orange-100">
            Save big on every meal with verified promotional codes, complimentary delivery, and bank cashbacks.
          </p>
        </div>
      </div>

      {/* Notification Toast Banner */}
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-sm font-semibold flex items-center justify-between border ${
            statusMsg.isError
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="text-xs font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Primary Coupons Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-stone-900">
            Active Restaurant Coupons ({COUPONS.length})
          </h2>
          <span className="text-xs text-stone-500 font-medium">Click Apply to activate on current order</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COUPONS.map((cpn) => {
            const isApplied = appliedCoupon?.code === cpn.code;
            const isCopied = copiedCode === cpn.code;

            return (
              <div
                key={cpn.code}
                className={`bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all relative overflow-hidden shadow-xs hover:shadow-lg ${
                  isApplied
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30'
                    : 'border-stone-200'
                }`}
              >
                {/* Coupon left scalloped cutout visual */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm sm:text-base px-3 py-1 rounded-xl bg-orange-100 text-orange-900 border border-orange-200 flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-orange-600" />
                        {cpn.code}
                      </span>

                      {isApplied && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Applied
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-stone-900">{cpn.title}</h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {cpn.description}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xl shrink-0">
                    <Percent className="w-6 h-6" />
                  </div>
                </div>

                {/* Terms and Actions */}
                <div className="pt-4 mt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-stone-400 font-medium">
                    Valid on min order of ₹{cpn.minOrder}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(cpn.code)}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>

                    {isApplied ? (
                      <button
                        onClick={removeCoupon}
                        className="px-4 py-1.5 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApply(cpn.code)}
                        className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                      >
                        Apply Coupon
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Partner Bank & Payment Offers */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-stone-900">
          Payment Partner Offers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bankOffers.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-stone-200 p-5 space-y-2 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md inline-block">
                {item.tag}
              </span>
              <h4 className="text-sm font-bold text-stone-900">{item.bank}</h4>
              <p className="text-xs text-stone-500 leading-relaxed">{item.offer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Explore Menu Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="text-lg font-bold">Ready to satisfy your cravings?</h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Apply your favorite voucher now and enjoy warm, contactless doorstep delivery.
          </p>
        </div>
        <button
          onClick={() => setCurrentView('restaurants')}
          className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
        >
          Order Food Now →
        </button>
      </div>
    </div>
  );
};
