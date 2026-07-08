import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import {
  Heart,
  Sparkles,
  ArrowRight,
  Palette,
  CheckCircle,
  Share2,
  Music,
  Users,
  Compass,
  MapPin
} from 'lucide-react';
import { mockTemplates } from '../mock/templates';
import { useSettingsStore } from '../store/settingsStore';

export const Home: React.FC = () => {
  const { plans: settingsPlans, fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const pricingPlans = Object.values(settingsPlans);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-20 bg-gold-luxury px-4 overflow-hidden border-b border-amber-100 dark:border-slate-900">
        {/* Floating circles decor */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-rose-300/10 dark:bg-rose-500/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-amber-200/20 dark:bg-gold-500/5 blur-3xl" />

        <div className="max-w-7xl mx-auto w-full text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-amber-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-400 uppercase mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Premium Digital Invitations
          </motion.div>

          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight font-playfair leading-[1.1] mb-6 max-w-5xl mx-auto"
          >
            Seal Your Love In A{' '}
            <span className="text-gold-gradient bg-clip-text font-greatvibes font-normal text-5xl sm:text-7xl md:text-8xl lowercase block sm:inline">
              beautiful
            </span>{' '}
            Digital Envelope
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-350 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            Create elegant web-based invitations for weddings, parties, and milestones. Customize fonts, themes, galleries, and background music.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 transition-all duration-300 shadow-xl shadow-rose-500/20 text-center flex items-center justify-center gap-2 hover:scale-105"
            >
              Start Customizing
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#templates"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold border border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40 backdrop-blur hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors text-center"
            >
              View Templates
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-950 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-semibold tracking-wider text-rose-500 uppercase mb-3">Loaded with Premium Features</h2>
            <p className="text-3xl sm:text-4xl font-bold font-playfair text-slate-900 dark:text-white leading-tight">
              Crafted to provide the ultimate experience for you and your guests
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="p-8 rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Visual Customizer</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Change fonts, primary themes, backdrop images, and layouts in real-time with our live visual builder canvas.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="p-8 rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Live RSVP Tracker</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Guests submit attendance, meal choices, and personal messages that update instantly in your management hub.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="p-8 rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Aesthetic Background Music</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Add standard audio tracks that play seamlessly when guests tap to open their digital invitation envelope.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="p-8 rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-6">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Sharing</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Send your unique web invitation slug directly through chat applications, SMS, or QR codes.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="p-8 rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Interactive Photo Gallery</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Display pre-wedding photoshoots in responsive grid lightboxes for guests to view and zoom.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="p-8 rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Location Maps Integration</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Give guests clear directions with direct links to Google Maps venues and add-to-calendar reminders.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-24 bg-slate-50 dark:bg-slate-900 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-rose-500 uppercase mb-3">Design Gallery</h2>
              <h3 className="text-3xl sm:text-4xl font-bold font-playfair text-slate-900 dark:text-white">
                Choose a Premium Theme
              </h3>
            </div>
            <Link
              to="/dashboard/templates"
              className="mt-4 md:mt-0 flex items-center gap-1 text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors"
            >
              See all templates
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockTemplates.slice(0, 3).map((tpl) => (
              <div
                key={tpl.id}
                className="group bg-white dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all duration-350"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={tpl.previewImage}
                    alt={tpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {tpl.isPremium && (
                    <span className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-current" />
                      Premium
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold font-playfair mb-2">{tpl.name}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
                    {tpl.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
                      {tpl.theme.fontFamily} Font style
                    </span>
                    <Link
                      to={`/template-preview/${tpl.id}`}
                      className="px-4 py-2 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    >
                      Preview Theme
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white dark:bg-slate-950 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-sm font-semibold tracking-wider text-rose-500 uppercase mb-3">Transparent Plans</h2>
            <p className="text-3xl sm:text-4xl font-bold font-playfair text-slate-900 dark:text-white leading-tight">
              One-Time Fees. No Subscriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 border flex flex-col justify-between ${
                  plan.isPopular
                    ? 'border-rose-500 bg-slate-50/50 dark:bg-slate-900/30 shadow-xl'
                    : 'border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950'
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-[10px] tracking-wider px-3.5 py-1 rounded-full uppercase shadow-md shadow-rose-500/20">
                    Most Popular
                  </span>
                )}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                    {plan.name}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1.5 mb-6">
                    <span className="text-4xl sm:text-5xl font-extrabold font-playfair tracking-tight text-slate-950 dark:text-white">
                      {plan.priceBDT === 0 ? '$0' : plan.price}
                    </span>
                    <span className="text-slate-400 text-xs font-semibold tracking-wide">
                      / {plan.period}
                    </span>
                  </div>
                  
                  <hr className="border-slate-100 dark:border-slate-900 mb-6" />

                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-350 leading-5">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to="/register"
                  className={`w-full py-3 rounded-xl text-center text-xs font-semibold transition-all duration-300 shadow-md ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-rose-500/10'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white text-center relative px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.1)_0,transparent_100%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <Heart className="w-12 h-12 text-rose-500 mx-auto fill-current animate-pulse mb-2" />
          <h2 className="text-3xl sm:text-5xl font-bold font-playfair tracking-tight">Ready to invite your guests?</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Get started in minutes. Pick your perfect template, add event coordinates, upload your photos, and publish.
          </p>
          <div className="pt-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-full text-base font-semibold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 transition-all duration-300 shadow-lg shadow-rose-500/20 inline-flex items-center gap-2 hover:scale-105"
            >
              Create Free Invitation
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
