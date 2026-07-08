import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { usePaymentStore, PaymentMethod } from '../store/paymentStore';
import { useSettingsStore } from '../store/settingsStore';
import { PricingPlan } from '../mock/pricing';
import { CloudinaryUploader } from '../components/CloudinaryUploader';
import {
  CheckCircle2,
  Sparkles,
  X,
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  Upload,
  ArrowLeft,
  Clock
} from 'lucide-react';

export const Pricing: React.FC = () => {
  const { user, updateUserPlan } = useAuthStore();
  const { addToast } = useNotificationStore();
  const { submitPayment, isLoading: isPaymentLoading } = usePaymentStore();
  const { plans: settingsPlans, paymentNumbers, fetchSettings } = useSettingsStore();

  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [step, setStep] = useState<'method' | 'payment' | 'confirm'>('method');
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Convert settings plans to array format for display
  const pricingPlans: PricingPlan[] = Object.values(settingsPlans);

  const handleOpenCheckout = (plan: PricingPlan) => {
    if (user?.currentPlan === plan.id) {
      addToast(`You are already on the ${plan.name} plan!`, 'info');
      return;
    }
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
    setStep('method');
    setSenderPhone('');
    setTransactionId('');
    setScreenshotUrl('');
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setSelectedPlan(null);
    setStep('method');
  };

  const handleCopyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopied(true);
    addToast('Number copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const getPlanPriceBDT = (plan: PricingPlan): number => {
    if (plan.price === '$0') return 0;
    if (plan.price === '$19') return 1900;
    if (plan.price === '$49') return 4900;
    return 0;
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !user) return;

    if (!senderPhone || !transactionId || !screenshotUrl) {
      addToast('Please fill all fields and upload screenshot', 'error');
      return;
    }

    const amount = getPlanPriceBDT(selectedPlan);
    
    const success = await submitPayment({
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      amount,
      method: paymentMethod,
      senderPhone,
      transactionId,
      screenshotUrl
    });

    if (success) {
      handleClose();
      addToast(
        `Payment submitted! We'll verify your ${paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} payment within 2-4 hours.`,
        'success'
      );
    } else {
      addToast('Failed to submit payment. Please try again.', 'error');
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Checkout Modal */}
      {isCheckoutOpen && selectedPlan && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-w-md w-full animate-scale-in relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Step 1: Select Payment Method */}
            {step === 'method' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold font-playfair">Select Payment Method</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upgrade to <strong className="text-slate-800 dark:text-slate-200">{selectedPlan.name}</strong> — ৳{getPlanPriceBDT(selectedPlan)} BDT
                  </p>
                </div>

                <div className="space-y-3">
                  {/* bKash */}
                  <button
                    onClick={() => {
                      setPaymentMethod('bkash');
                      setStep('payment');
                    }}
                    className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-pink-500 dark:hover:border-pink-500 transition-all flex items-center gap-4 group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
                      <Smartphone className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left flex-grow">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">bKash</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Send Money to Personal Account</p>
                    </div>
                    <span className="text-xs font-bold text-pink-500 group-hover:translate-x-1 transition-transform">→</span>
                  </button>

                  {/* Nagad */}
                  <button
                    onClick={() => {
                      setPaymentMethod('nagad');
                      setStep('payment');
                    }}
                    className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all flex items-center gap-4 group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                      <Smartphone className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left flex-grow">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Nagad</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Send Money to Personal Account</p>
                    </div>
                    <span className="text-xs font-bold text-orange-500 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Instructions */}
            {step === 'payment' && (
              <div className="space-y-5">
                <button
                  onClick={() => setStep('method')}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>

                <div className="text-center space-y-2">
                  <div className={`w-14 h-14 rounded-xl mx-auto flex items-center justify-center shadow-lg ${
                    paymentMethod === 'bkash'
                      ? 'bg-gradient-to-br from-pink-500 to-pink-600 shadow-pink-500/20'
                      : 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-500/20'
                  }`}>
                    <Smartphone className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold font-playfair">
                    Send via {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Send <strong className="text-slate-800 dark:text-slate-200">৳{getPlanPriceBDT(selectedPlan)} BDT</strong> to the number below
                  </p>
                </div>

                {/* Number to send */}
                <div className={`p-4 rounded-2xl border-2 ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-200 dark:border-pink-900/30 bg-pink-50/50 dark:bg-pink-950/10'
                    : 'border-orange-200 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-950/10'
                }`}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Send Money To
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                      {paymentMethod === 'bkash' ? PAYMENT_NUMBERS.bkash.personal : PAYMENT_NUMBERS.nagad.personal}
                    </span>
                    <button
                      onClick={() => handleCopyNumber(paymentMethod === 'bkash' ? PAYMENT_NUMBERS.bkash.personal : PAYMENT_NUMBERS.nagad.personal)}
                      className={`p-2 rounded-lg transition-colors ${
                        copied
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                    {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Personal Account
                  </p>
                </div>

                {/* Amount highlight */}
                <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Amount to Send</span>
                  <p className="text-2xl font-bold font-playfair text-slate-900 dark:text-white">৳{getPlanPriceBDT(selectedPlan)}</p>
                </div>

                {/* Steps */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">How to Pay</p>
                  <div className="space-y-2">
                    {[
                      `Open your ${paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} app`,
                      'Tap "Send Money"',
                      `Enter the number above`,
                      `Enter ৳${getPlanPriceBDT(selectedPlan)} as amount`,
                      'Tap "Send" to complete',
                      'Take a screenshot of the confirmation',
                      'Come back here and fill the form below'
                    ].map((instruction, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <span className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold ${
                          paymentMethod === 'bkash'
                            ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
                            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                        }`}>
                          {i + 1}
                        </span>
                        <span>{instruction}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep('confirm')}
                  className={`w-full py-3 rounded-xl text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'bkash'
                      ? 'bg-gradient-to-r from-pink-500 to-pink-600 shadow-pink-500/20'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-500/20'
                  }`}
                >
                  I've Sent the Money — Next
                </button>
              </div>
            )}

            {/* Step 3: Confirm Payment */}
            {step === 'confirm' && (
              <form onSubmit={handleSubmitPayment} className="space-y-5">
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>

                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-playfair">Confirm Payment</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter your {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} details and upload the screenshot
                  </p>
                </div>

                {/* Sender Phone */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Your {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all"
                  />
                </div>

                {/* Transaction ID */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 8A3B7K9L2M"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all"
                  />
                  <p className="text-[9px] text-slate-400 mt-1">
                    Find this in your {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} SMS or transaction history
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Amount Sent
                  </label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-bold text-slate-900 dark:text-white">
                    ৳{getPlanPriceBDT(selectedPlan)} BDT
                  </div>
                </div>

                {/* Screenshot Upload */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Payment Screenshot
                  </label>
                  {screenshotUrl ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                      <img src={screenshotUrl} alt="Payment screenshot" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setScreenshotUrl('')}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <CloudinaryUploader
                      accept="image/*"
                      label="Upload Payment Screenshot"
                      hint="Take a screenshot of the confirmation page and upload here"
                      onUploaded={(url) => {
                        setScreenshotUrl(url);
                        addToast('Screenshot uploaded!', 'success');
                      }}
                    />
                  )}
                </div>

                {/* Summary */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Plan</span>
                    <span className="font-semibold">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Amount</span>
                    <span className="font-semibold">৳{getPlanPriceBDT(selectedPlan)} BDT</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Method</span>
                    <span className="font-semibold">{paymentMethod === 'bkash' ? 'bKash' : 'Nagad'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Payment verified within 2-4 hours. You'll receive an email notification.</span>
                </div>

                <button
                  type="submit"
                  disabled={isPaymentLoading || !senderPhone || !transactionId || !screenshotUrl}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-rose-500/10 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPaymentLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting Payment...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Submit for Verification
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Subscription banner status */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base font-playfair">Subscription Plan Status</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You are currently using the{' '}
              <strong className="text-slate-700 dark:text-slate-300">
                {user?.currentPlan === 'plan-free' ? 'Starter' : user?.currentPlan === 'plan-premium' ? 'Premium' : 'VIP'} Plan
              </strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockPricingPlans.map((plan) => {
          const isCurrent = user?.currentPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 border flex flex-col justify-between ${
                plan.isPopular
                  ? 'border-rose-500 bg-slate-50/50 dark:bg-slate-900/20 shadow-lg'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              {isCurrent && (
                <span className="absolute -top-3.5 left-6 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-[9px] tracking-wider px-2.5 py-0.5 rounded-full uppercase shadow">
                  Current Plan
                </span>
              )}
              
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  {plan.name}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-bold font-playfair text-slate-950 dark:text-white">
                    {plan.price === '$0' ? '$0' : plan.price === '$19' ? '৳1,900' : '৳4,900'}
                  </span>
                  <span className="text-slate-400 text-[10px] font-semibold">/ {plan.period}</span>
                </div>

                <hr className="border-slate-100 dark:border-slate-850 mb-5" />

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleOpenCheckout(plan)}
                disabled={isCurrent}
                className={`w-full py-2.5 rounded-xl text-center text-xs font-semibold transition-all duration-300 shadow-md ${
                  isCurrent
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none border border-transparent'
                    : plan.isPopular
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:scale-[1.02]'
                    : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 hover:scale-[1.02]'
                }`}
              >
                {isCurrent ? 'Current Plan' : plan.buttonText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
