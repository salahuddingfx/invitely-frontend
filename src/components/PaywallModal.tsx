import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Diamond, Lock, Smartphone, CheckCircle2, Zap, Star } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredPlan: 'plan-premium' | 'plan-vip';
  templateName?: string;
}

const PLAN_FEATURES = {
  'plan-premium': {
    label: 'Premium',
    price: '৳299',
    color: 'from-amber-500 to-yellow-400',
    textColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    features: [
      'Access to all Premium templates',
      'Unlimited invitations',
      'Custom music & gallery',
      'Full Love Story timeline editor',
      'Priority support',
    ],
  },
  'plan-vip': {
    label: 'VIP Elite',
    price: '৳599',
    color: 'from-purple-600 to-indigo-500',
    textColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    features: [
      'Access to ALL templates including VIP exclusives',
      'Unlimited invitations',
      'Priority admin support',
      'Custom domain (coming soon)',
      'White-label option (coming soon)',
      'Lifetime access to new templates',
    ],
  },
};

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  requiredPlan,
  templateName,
}) => {
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const plan = PLAN_FEATURES[requiredPlan];

  const handleClose = () => {
    setStep('info');
    onClose();
  };

  const PlanIcon = requiredPlan === 'plan-vip' ? Diamond : Crown;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden"
          >
            <div className={`h-1.5 w-full bg-gradient-to-r ${plan.color}`} />

            <div className="p-6 space-y-5">
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>

              {step === 'info' ? (
                <>
                  <div className="space-y-2 text-center">
                    <div className={`w-12 h-12 rounded-2xl ${plan.bgColor} border ${plan.borderColor} flex items-center justify-center mx-auto ${plan.textColor}`}>
                      <PlanIcon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">Template Locked</span>
                    </div>
                    <h2 className="text-xl font-extrabold font-playfair text-slate-900 dark:text-slate-100">
                      {templateName && <span className="text-rose-500">"{templateName}" </span>}
                      requires {plan.label}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Upgrade your plan to access this exclusive template and more.
                    </p>
                  </div>

                  <div className={`${plan.bgColor} border ${plan.borderColor} rounded-2xl p-4 text-center`}>
                    <div className={`text-3xl font-extrabold ${plan.textColor}`}>{plan.price}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">one-time payment · lifetime access</div>
                  </div>

                  <div className="space-y-2">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.textColor}`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep('payment')}
                    className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm bg-gradient-to-r ${plan.color} shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2`}
                  >
                    <Zap className="w-4 h-4" />
                    Upgrade to {plan.label} — {plan.price}
                  </button>
                  <button onClick={handleClose} className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    Maybe later
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-2 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                      <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-extrabold font-playfair text-slate-900 dark:text-slate-100">Pay via bKash / Nagad</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Send {plan.price} to the number below, then email your Transaction ID to activate.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500">bKash Number</span>
                      <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">+880 1XXXXXXXXX</span>
                    </div>
                    <hr className="border-slate-200 dark:border-slate-800" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500">Nagad Number</span>
                      <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">+880 1XXXXXXXXX</span>
                    </div>
                    <hr className="border-slate-200 dark:border-slate-800" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500">Amount to Send</span>
                      <span className={`text-sm font-extrabold ${plan.textColor}`}>{plan.price}</span>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400">
                    <Star className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>
                      After payment, email your <strong>Transaction ID</strong> + <strong>account email</strong> to{' '}
                      <a href="mailto:support@invitely.co" className="underline font-semibold">support@invitely.co</a>.
                      Your plan will be upgraded within 24 hours.
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep('info')} className="flex-1 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      ← Back
                    </button>
                    <button onClick={handleClose} className={`flex-1 py-2.5 rounded-2xl text-white font-bold text-xs bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity`}>
                      Done — I've paid!
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
