import React, { useEffect, useState } from 'react';
import { useSettingsStore, PlanSettings, PaymentNumberSettings } from '../../store/settingsStore';
import { useNotificationStore } from '../../store/notificationStore';
import {
  Save,
  Loader2,
  DollarSign,
  Smartphone,
  Plus,
  Trash2,
  RotateCcw
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { plans, paymentNumbers, isLoading, fetchSettings, updateAll } = useSettingsStore();
  const { addToast } = useNotificationStore();

  const [localPlans, setLocalPlans] = useState<Record<string, PlanSettings>>({});
  const [localNumbers, setLocalNumbers] = useState<{ bkash: PaymentNumberSettings; nagad: PaymentNumberSettings }>({
    bkash: { personal: '', merchant: '', instructions: '' },
    nagad: { personal: '', merchant: '', instructions: '' }
  });
  const [activeTab, setActiveTab] = useState<'plans' | 'payments'>('plans');

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (Object.keys(plans).length > 0) {
      setLocalPlans(JSON.parse(JSON.stringify(plans)));
    }
    setLocalNumbers(JSON.parse(JSON.stringify(paymentNumbers)));
  }, [plans, paymentNumbers]);

  const handleSave = async () => {
    const success = await updateAll({
      plans: localPlans,
      paymentNumbers: localNumbers
    });
    if (success) {
      addToast('Settings updated successfully!', 'success');
    } else {
      addToast('Failed to update settings', 'error');
    }
  };

  const handlePlanChange = (planId: string, field: keyof PlanSettings, value: any) => {
    setLocalPlans((prev) => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [field]: value
      }
    }));
  };

  const handlePlanFeatureChange = (planId: string, index: number, value: string) => {
    setLocalPlans((prev) => {
      const features = [...(prev[planId]?.features || [])];
      features[index] = value;
      return {
        ...prev,
        [planId]: {
          ...prev[planId],
          features
        }
      };
    });
  };

  const addPlanFeature = (planId: string) => {
    setLocalPlans((prev) => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        features: [...(prev[planId]?.features || []), '']
      }
    }));
  };

  const removePlanFeature = (planId: string, index: number) => {
    setLocalPlans((prev) => {
      const features = [...(prev[planId]?.features || [])];
      features.splice(index, 1);
      return {
        ...prev,
        [planId]: {
          ...prev[planId],
          features
        }
      };
    });
  };

  const handleNumberChange = (method: 'bkash' | 'nagad', field: keyof PaymentNumberSettings, value: string) => {
    setLocalNumbers((prev) => ({
      ...prev,
      [method]: {
        ...prev[method],
        [field]: value
      }
    }));
  };

  const planIds = ['plan-free', 'plan-premium', 'plan-vip'];
  const planColors: Record<string, string> = {
    'plan-free': 'border-slate-200 dark:border-slate-800',
    'plan-premium': 'border-rose-300 dark:border-rose-900/40',
    'plan-vip': 'border-amber-300 dark:border-amber-900/40'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-playfair">Platform Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configure plan pricing and payment numbers</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:scale-[1.02] transition-transform disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'plans'
              ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 inline mr-1" />
          Plan Pricing
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'payments'
              ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 inline mr-1" />
          Payment Numbers
        </button>
      </div>

      {/* Plan Pricing Tab */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {planIds.map((planId) => {
            const plan = localPlans[planId];
            if (!plan) return null;
            return (
              <div
                key={planId}
                className={`bg-white dark:bg-slate-900 rounded-2xl border-2 p-6 space-y-5 ${planColors[planId]}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold font-playfair text-lg">{plan.name}</h3>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={plan.isPopular}
                      onChange={(e) => handlePlanChange(planId, 'isPopular', e.target.checked)}
                      className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                    />
                    Popular
                  </label>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Plan Name</label>
                    <input
                      type="text"
                      value={plan.name}
                      onChange={(e) => handlePlanChange(planId, 'name', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Display Price</label>
                      <input
                        type="text"
                        value={plan.price}
                        onChange={(e) => handlePlanChange(planId, 'price', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                        placeholder="৳1,900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Price (BDT)</label>
                      <input
                        type="number"
                        value={plan.priceBDT}
                        onChange={(e) => handlePlanChange(planId, 'priceBDT', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Period</label>
                    <input
                      type="text"
                      value={plan.period}
                      onChange={(e) => handlePlanChange(planId, 'period', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={plan.description}
                      onChange={(e) => handlePlanChange(planId, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={plan.buttonText}
                      onChange={(e) => handlePlanChange(planId, 'buttonText', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Features</label>
                      <button
                        onClick={() => addPlanFeature(planId)}
                        className="text-[10px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {(plan.features || []).map((feature, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => handlePlanFeatureChange(planId, i, e.target.value)}
                            className="flex-grow px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[11px] focus:outline-none focus:ring-1 focus:ring-rose-500/30"
                          />
                          <button
                            onClick={() => removePlanFeature(planId, i)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Numbers Tab */}
      {activeTab === 'payments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* bKash */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-pink-200 dark:border-pink-900/40 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold font-playfair">bKash</h3>
                <p className="text-[10px] text-slate-400">Payment receiving numbers</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Personal Number</label>
                <input
                  type="text"
                  value={localNumbers.bkash.personal}
                  onChange={(e) => handleNumberChange('bkash', 'personal', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                  placeholder="01XXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Merchant Number</label>
                <input
                  type="text"
                  value={localNumbers.bkash.merchant}
                  onChange={(e) => handleNumberChange('bkash', 'merchant', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                  placeholder="01XXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Instructions</label>
                <input
                  type="text"
                  value={localNumbers.bkash.instructions}
                  onChange={(e) => handleNumberChange('bkash', 'instructions', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                />
              </div>
            </div>
          </div>

          {/* Nagad */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-orange-200 dark:border-orange-900/40 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold font-playfair">Nagad</h3>
                <p className="text-[10px] text-slate-400">Payment receiving numbers</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Personal Number</label>
                <input
                  type="text"
                  value={localNumbers.nagad.personal}
                  onChange={(e) => handleNumberChange('nagad', 'personal', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  placeholder="01XXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Merchant Number</label>
                <input
                  type="text"
                  value={localNumbers.nagad.merchant}
                  onChange={(e) => handleNumberChange('nagad', 'merchant', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  placeholder="01XXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Instructions</label>
                <input
                  type="text"
                  value={localNumbers.nagad.instructions}
                  onChange={(e) => handleNumberChange('nagad', 'instructions', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
