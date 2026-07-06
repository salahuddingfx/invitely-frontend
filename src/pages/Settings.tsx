import React from 'react';
import { useUserStore } from '../store/userStore';
import { Mail, Shield, Bell, Disc, ToggleLeft } from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useUserStore();

  const handleToggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm divide-y divide-slate-100 dark:divide-slate-850">
        
        {/* Email Alerts toggle */}
        <div className="p-6 flex items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bell className="w-5 h-5" />
            </div>
            <div className="space-y-1 max-w-lg">
              <h4 className="text-sm font-semibold">Email Notifications</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-light">
                Receive notifications when guests submit new RSVP responses or leave greeting wall notes.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('emailNotifications')}
            className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-300 focus:outline-none flex items-center ${
              settings.emailNotifications ? 'bg-rose-500 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'
            }`}
          >
            <span className="w-4.5 h-4.5 rounded-full bg-white shadow-md block" />
          </button>
        </div>

        {/* Auto-save toggle */}
        <div className="p-6 flex items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Disc className="w-5 h-5" />
            </div>
            <div className="space-y-1 max-w-lg">
              <h4 className="text-sm font-semibold">Auto-save in Builder</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-light">
                Automatically backup drafts as you configure couple information, upload photos, and pick template fonts.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('autoSaveBuilder')}
            className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-300 focus:outline-none flex items-center ${
              settings.autoSaveBuilder ? 'bg-rose-500 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'
            }`}
          >
            <span className="w-4.5 h-4.5 rounded-full bg-white shadow-md block" />
          </button>
        </div>

        {/* Marketing emails toggle */}
        <div className="p-6 flex items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1 max-w-lg">
              <h4 className="text-sm font-semibold">Marketing Newsletter</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-light">
                Receive emails about design updates, seasonal template additions, and wedding preparation guides.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('marketingEmails')}
            className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-300 focus:outline-none flex items-center ${
              settings.marketingEmails ? 'bg-rose-500 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'
            }`}
          >
            <span className="w-4.5 h-4.5 rounded-full bg-white shadow-md block" />
          </button>
        </div>

        {/* Two Factor toggle */}
        <div className="p-6 flex items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield className="w-5 h-5" />
            </div>
            <div className="space-y-1 max-w-lg">
              <h4 className="text-sm font-semibold">Two-Factor Authentication</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-light">
                Secure your event credentials dashboard with simulated verification codes on sign-in.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('twoFactorEnabled')}
            className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-300 focus:outline-none flex items-center ${
              settings.twoFactorEnabled ? 'bg-rose-500 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'
            }`}
          >
            <span className="w-4.5 h-4.5 rounded-full bg-white shadow-md block" />
          </button>
        </div>

      </div>
    </div>
  );
};
