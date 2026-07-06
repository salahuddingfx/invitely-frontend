import React from 'react';
import { FileCheck, BookOpen, AlertCircle } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold font-playfair tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-400">Last updated: July 5, 2026</p>
      </div>

      <div className="space-y-6 text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-sans">
        <section className="space-y-2">
          <h2 className="text-xl font-bold font-playfair text-slate-900 dark:text-white">1. User Agreement</h2>
          <p>
            By signing up on Invitely and building digital invitations, you agree to comply with event guidelines. 
            You are responsible for safeguarding your login credentials and maintaining the accuracy of your published wedding coordinates.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-playfair text-slate-900 dark:text-white">2. Content & Acceptable Use</h2>
          <p>
            Invitely provides templates for celebratory, wedding, Nikkah, birthday, and baby shower events. 
            Uploading malicious, abusive, or fraudulent invitation descriptions is strictly prohibited and will result in immediate page removal and account termination.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-playfair text-slate-900 dark:text-white">3. System Limits & Free Tiers</h2>
          <p>
            Starter accounts are limited in the number of active templates and invite drafts. 
            Upgrading plan tiers yields access to premium audio, high-resolution templates, custom subdomains, and whitelisted guest notifications.
          </p>
        </section>
      </div>
    </div>
  );
};
