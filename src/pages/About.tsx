import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Code2, Globe, Cpu, Users } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      {/* Header section */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg"
        >
          <Heart className="w-6 h-6 fill-current animate-pulse" />
        </motion.div>
        <h1 className="text-4xl font-extrabold font-playfair tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          About Invitely
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Crafting premium, dynamic, and immersive digital event invitation portals.
        </p>
      </div>

      {/* Core Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-playfair">Our Story & Mission</h2>
          <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed">
            Invitely was created to transform the way we invite loved ones to life's most precious events. 
            Traditional paper invites are static and easily lost. Invitely replaces them with premium, interactive, 
            and responsive web cards complete with double-door reveals, live RSVP dashboards, custom theme selectors, 
            and dynamic music options.
          </p>
          <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed">
            Whether it's a royal wedding, Nikkah ceremony, anniversary, or a joyful birthday gala, Invitely lets hosts 
            build stunning event portals that reflect their unique style and sync with their guest lists in real time.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 shadow-sm space-y-4 relative overflow-hidden bg-slate-50/50 dark:bg-slate-950/20">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-rose-500/5 blur-xl pointer-events-none" />
          <h3 className="font-bold text-sm tracking-wider uppercase text-rose-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Why Invitely?
          </h3>
          <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
              <span><strong>Interactive Experiences</strong>: Wax seal envelope reveals, curtain animations, and dynamic counters.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
              <span><strong>Custom Audio Layouts</strong>: Beautiful theme waltzes and Arabic Oud presets tailored to your event type.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
              <span><strong>Instant Guest Tracker</strong>: Collect guest names, diet requirements, and phone numbers instantly.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Developer Attribution Card */}
      <div className="border-t border-slate-100 dark:border-slate-850 pt-10">
        <div className="glass-card p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 shadow-md flex flex-col md:flex-row items-center gap-6 relative overflow-hidden bg-gradient-to-r from-slate-50 to-white dark:from-slate-950/30 dark:to-slate-900/10">
          <div className="w-24 h-24 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-150 flex-shrink-0">
            <img
              src="https://github.com/salahuddingfx.png"
              alt="Salah Uddin Kader"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback avatar
                (e.target as HTMLImageElement).src = '';
              }}
            />
          </div>

          <div className="space-y-3 flex-grow text-center md:text-left">
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-playfair">Designed & Developed by Salah Uddin Kader</h3>
              <p className="text-xs text-rose-500 font-semibold tracking-wide">Lead Architect at Nextora Studio</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
              Salah Uddin Kader is a seasoned full-stack engineer and digital creator specializing in immersive user experiences. 
              Under his digital agency, <strong>Nextora Studio</strong>, he crafts luxury event products and enterprise web solutions using high-grade stack models: React, TypeScript, Tailwind, Zustand, Framer Motion, GSAP, Node, and MongoDB.
            </p>
            
            <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4 text-xs">
              <a
                href="https://salahuddin.codes"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>salahuddin.codes</span>
              </a>
              <a
                href="https://nextorastudion.tech"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>nextorastudion.tech</span>
              </a>
              <a
                href="https://github.com/salahuddingfx"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              >
                <Code2 className="w-4 h-4" />
                <span>github/salahuddingfx</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
