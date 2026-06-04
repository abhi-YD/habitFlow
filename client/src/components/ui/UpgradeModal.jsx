//created by Abhinav  on 26/05/24
import { useState }  from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Check, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import api   from '../../api/axios';
import usePlanStore from '../../store/planStore';

const PRO_FEATURES = [
  'Unlimited habits & goals',
  'AI Coach (suggestions, insights, daily coach)',
  'Full analytics + PDF export',
  'Email + push reminders',
  'Weekly email report',
  'Priority support',
];

export default function UpgradeModal() {
  const { showUpgradeModal, upgradeReason,
          closeUpgradeModal, setplan } = usePlanStore();
  const [billing,  setBilling]  = useState('monthly');
  const [loading,  setLoading]  = useState(false);

  const prices = {
    monthly: { amount: 199,  display: '₹199/month',  sub: 'Billed monthly'   },
    annual:  { amount: 1499, display: '₹1499/year',  sub: 'Save 37% · ₹125/month' },
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. create order
      const { data } = await api.post('/payments/create-order', { billing });

      // 2. open Razorpay
      const options = {
        key:         data.keyId,
        amount:      data.amount,
        currency:    data.currency,
        name:        'HabitFlow',
        description: `Pro Plan — ${billing}`,
        order_id:    data.orderId,
        prefill: {
          name:  data.user.name,
          email: data.user.email,
        },
        theme:    { color: '#7C3AED' },
        modal:    { confirm_close: true },
        handler: async (response) => {
          // 3. verify
          const verify = await api.post('/payments/verify', {
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
            billing,
          });

          if (verify.data.success) {
            setplan('pro');
            closeUpgradeModal();
            toast.success('Welcome to Pro! 🎉 All features unlocked!');
            // reload to update UI
            setTimeout(() => window.location.reload(), 1500);
          }
        },
      };

      // load Razorpay script
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      toast.error('Payment failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {showUpgradeModal && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            onClick={closeUpgradeModal}
            className="fixed inset-0 bg-black/70
                       backdrop-blur-sm z-50"
          />

          {/* modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-1/2 left-1/2
                       -translate-x-1/2 -translate-y-1/2
                       w-[90vw] max-w-md z-50
                       bg-[#111118] border border-[#1E1E2E]
                       rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* purple top bar */}
            <div className="bg-gradient-to-r from-violet-600
                            to-violet-800 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-xl
                                  flex items-center justify-center">
                    <Crown size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      Upgrade to Pro
                    </h3>
                    <p className="text-violet-200 text-xs">
                      {upgradeReason || 'Unlock all features'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeUpgradeModal}
                  className="text-white/60 hover:text-white
                             transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* billing toggle */}
              <div className="flex gap-2 mb-5 p-1
                              bg-[#0A0A0F] rounded-xl">
                {(['monthly', 'annual']).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBilling(b)}
                    className={`flex-1 py-2.5 rounded-lg text-sm
                                font-medium capitalize transition-all
                                flex items-center justify-center gap-2
                                ${billing === b
                                  ? 'bg-violet-600 text-white'
                                  : 'text-[#64748B] hover:text-white'}`}
                  >
                    {b}
                    {b === 'annual' && (
                      <span className="text-xs bg-[#06FFA5]/20
                                       text-[#06FFA5] px-1.5 py-0.5
                                       rounded-full">
                        -37%
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* price display */}
              <div className="text-center mb-5 py-4 bg-[#0A0A0F]
                              rounded-xl border border-[#1E1E2E]">
                <div className="text-4xl font-bold text-white
                                font-mono mb-1">
                  {prices[billing].display}
                </div>
                <div className="text-[#64748B] text-sm">
                  {prices[billing].sub}
                </div>
              </div>

              {/* features */}
              <div className="space-y-2.5 mb-5">
                {PRO_FEATURES.map((f) => (
                  <div key={f}
                    className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full
                                    bg-[#06FFA5]/20
                                    flex items-center justify-center
                                    flex-shrink-0">
                      <Check size={11} className="text-[#06FFA5]" />
                    </div>
                    <span className="text-[#94A3B8] text-sm">{f}</span>
                  </div>
                ))}
              </div>

              {/* pay button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-500
                           disabled:opacity-50 text-white font-bold
                           rounded-xl py-3.5 flex items-center
                           justify-center gap-2 transition-all
                           shadow-lg shadow-violet-600/30"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5"
                    fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12"
                      r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : <Zap size={18} />}
                {loading ? 'Processing...' : 'Upgrade Now'}
              </motion.button>

              <p className="text-center text-[#2E2E4E] text-xs mt-3">
                Secure payment via Razorpay · 7-day money back guarantee
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}