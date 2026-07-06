import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold font-playfair tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400">Last updated: July 5, 2026</p>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 bg-slate-50/20 dark:bg-slate-950/20 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex gap-2">
          <Shield className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-slate-850 dark:text-slate-200 mb-1">Data Security</p>
            <p>Your details and invitation databases are protected with premium SSL tokens.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Lock className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-slate-850 dark:text-slate-200 mb-1">Encrypted Signups</p>
            <p>All passwords are securely salted and hashed using bcrypt inside MongoDB.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Eye className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-slate-850 dark:text-slate-200 mb-1">No Tracking Sale</p>
            <p>We do not lease or sell user or guest contact details to advertisement clusters.</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-sans">
        <section className="space-y-2">
          <h2 className="text-xl font-bold font-playfair text-slate-900 dark:text-white">1. Information We Collect</h2>
          <p>
            When you create an account, we collect credentials (name, email, password) to construct your builder workspace. 
            When visitors RSVP to your published digital invitation, we collect guest names, food choices, party sizes, greeting wall comments, and phone numbers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-playfair text-slate-900 dark:text-white">2. How We Use Information</h2>
          <p>
            We process invitation parameters strictly to serve, custom style, and render your wedding portal live. 
            Guest RSVPs are securely delivered to your private dashboard coordinates and sent to your email inbox via Nodemailer notifications. 
            We do not index public guest phone numbers for unsolicited marketing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-playfair text-slate-900 dark:text-white">3. Third Party Providers</h2>
          <p>
            We upload visual avatars and banner photos to Cloudinary. By utilizing custom image paste links, you authorize secure retrieval of graphics to display in templates.
          </p>
        </section>
      </div>
    </div>
  );
};
