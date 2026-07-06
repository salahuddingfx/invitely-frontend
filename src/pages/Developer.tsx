import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import {
  Globe,
  Mail,
  Terminal,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const Developer: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  const techStack = [
    { name: 'TypeScript / JavaScript', category: 'languages', level: 'Expert' },
    { name: 'React 19 / Next.js', category: 'frontend', level: 'Expert' },
    { name: 'Node.js / Express', category: 'backend', level: 'Advanced' },
    { name: 'Python / Django', category: 'backend', level: 'Advanced' },
    { name: 'PHP / Laravel', category: 'backend', level: 'Advanced' },
    { name: 'Shopify / Liquid', category: 'eCommerce', level: 'Expert' },
    { name: 'WordPress / PHP', category: 'CMS', level: 'Expert' },
    { name: 'React Native / Flutter', category: 'mobile', level: 'Advanced' },
    { name: 'Tailwind CSS / SCSS', category: 'styling', level: 'Expert' },
    { name: 'Material UI / shadcn/ui', category: 'styling', level: 'Expert' },
    { name: 'REST / GraphQL APIs', category: 'apis', level: 'Expert' },
    { name: 'Docker / AWS Deployment', category: 'devops', level: 'Intermediate' }
  ];

  return (
    <div className="min-h-screen py-16 px-4 bg-slate-900 text-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Decorative ambient backgrounds */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl w-full space-y-8 relative z-10"
      >
        
        {/* Profile Card */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
        >
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full blur-xl opacity-30" />
          
          {/* Avatar frame */}
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-lg relative group">
              <img
                src="/avatar-placeholder.svg"
                alt="Salah Uddin Kader"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider">
              Creator
            </span>
          </div>

          {/* Core Info */}
          <div className="space-y-4 text-center md:text-left flex-grow">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-playfair tracking-tight text-white">
                  Salah Uddin Kader
                </h1>
                <span className="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                  Lead Engineer
                </span>
              </div>
              <p className="text-sm text-slate-400 font-light">
                Founder of{' '}
                <a
                  href="https://nextorastudion.tech"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:underline font-semibold inline-flex items-center gap-0.5"
                >
                  Nextora Studio
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>

            <p className="text-xs text-slate-350 leading-relaxed font-light max-w-md">
              High-performance web architect crafting premium design layouts, full-stack digital invitation platforms, Shopify ecosystems, and mobile application portals.
            </p>

            {/* Social connections */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href="https://github.com/salahuddingfx"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all flex items-center gap-1.5 text-xs"
              >
                <Code2 className="w-4 h-4" />
                <span>salahuddingfx</span>
              </a>
              <a
                href="https://salahuddin.codes"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all flex items-center gap-1.5 text-xs"
              >
                <Globe className="w-4 h-4" />
                <span>salahuddin.codes</span>
              </a>
              <a
                href="mailto:contact@nextorastudion.tech"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/35 text-slate-400 hover:text-rose-400 transition-colors"
                title="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Studio Showcase */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-950/40 border border-slate-850 rounded-3xl p-6 sm:p-8 space-y-4"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-slate-850">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="text-lg font-bold font-playfair text-white">Nextora Studio Agency</h2>
          </div>
          <p className="text-xs text-slate-350 leading-relaxed font-light">
            Nextora Studio is a creative design and development agency specializing in pixel-perfect corporate layouts, interactive web experiences, and eCommerce integrations. We build custom applications that are completely responsive, fast, and optimized for maximum conversions.
          </p>
          <div className="pt-2">
            <a
              href="https://nextorastudion.tech"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-500 hover:underline"
            >
              Explore Nextora Portals
              <ExternalLink className="w-4.5 h-4.5" />
            </a>
          </div>
        </motion.div>

        {/* Tech Stack Grid */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-950/40 border border-slate-850 rounded-3xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold font-playfair text-white">Technologies Portfolio</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {techStack.map((tech, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl border border-slate-850 bg-slate-900/40 flex flex-col justify-between space-y-2 hover:border-slate-800 transition-colors"
              >
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  {tech.category}
                </span>
                <p className="text-xs font-semibold text-slate-200">{tech.name}</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] text-slate-400 font-semibold">{tech.level}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer links */}
        <motion.div variants={itemVariants} className="text-center pt-4">
          <Link
            to="/"
            className="text-xs font-semibold text-slate-500 hover:text-slate-350 transition-colors underline"
          >
            Back to Invitely Home
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
};
