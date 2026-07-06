import React from 'react';
import { ShieldCheck, Info, Cpu } from 'lucide-react';

export const CookiePolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold font-playfair tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Cookie Policy
        </h1>
        <p className="text-xs text-slate-400">Last updated: July 5, 2026</p>
      </div>

      <div className="space-y-6 text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-sans">
        <section className="space-y-2">
          <h2 className="text-xl font-bold font-playfair text-slate-900 dark:text-white">1. What are Cookies?</h2>
          <p>
            Cookies are small text records stored on your computer or phone browser. They are commonly used by modern apps to verify account identities, remember preferences, and coordinate visual page states.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-playfair text-slate-900 dark:text-white">2. Cookies We Deploy</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <strong>Essential Cookies</strong>: Used by the Zustand store wrapper to persist your logged-in session, auth tokens, draft visual card settings, and toast notification queue status.
            </li>
            <li>
              <strong>Preference Cookies</strong>: Keeps track of whether you accepted or ignored our cookie policy banner, so you are not prompted repeatedly.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-playfair text-slate-900 dark:text-white">3. Deleting or Controlling Cookies</h2>
          <p>
            You can modify your browser configurations to clear cookies at any time. However, disabling essential cookies will sign you out of your Invitely builder dashboard and clear your local visual draft backups.
          </p>
        </section>
      </div>
    </div>
  );
};
