import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { Heart, Sun, Moon, Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PublicLayoutProps {
  children?: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [cookieConsent, setCookieConsent] = useState(() => {
    return localStorage.getItem('invitely_cookie_consent') || '';
  });

  const handleCookieChoice = (choice: 'accepted' | 'ignored') => {
    localStorage.setItem('invitely_cookie_consent', choice);
    setCookieConsent(choice);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Templates', path: '/dashboard/templates' },
    { name: 'Pricing', path: '/dashboard/pricing' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform duration-300">
                <Heart className="w-5 h-5 fill-current animate-pulse" />
              </div>
              <span className="text-2xl font-bold tracking-tight font-playfair bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                Invitely
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-rose-500 ${
                    isActive(link.path)
                      ? 'text-rose-500 dark:text-rose-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Controls */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
              </button>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-5 py-2.5 rounded-full text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-all duration-300 shadow-lg shadow-slate-900/10 dark:shadow-white/5 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-slate-500 hover:text-rose-500 dark:text-slate-400 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 transition-all duration-300 shadow-md shadow-rose-500/20"
                  >
                    Create Free Invitation
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-nav absolute top-16 left-0 w-full shadow-lg transition-transform duration-300 z-50">
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <hr className="border-slate-200 dark:border-slate-800 my-2" />

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center px-4 py-2.5 rounded-full text-base font-medium text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-center py-2.5 rounded-full text-base font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center w-full py-2 text-base font-medium text-slate-600 dark:text-slate-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center w-full py-2.5 px-4 rounded-full text-base font-medium text-white bg-gradient-to-r from-rose-500 to-amber-500"
                  >
                    Create Free Invitation
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 flex items-center justify-center text-white">
                  <Heart className="w-4 h-4 fill-current" />
                </div>
                <span className="text-xl font-bold font-playfair text-white">Invitely</span>
              </div>
              <p className="text-sm max-w-sm">
                Create elegant, dynamic, and interactive digital invitations for your weddings, anniversaries, and parties. Keep track of RSVPs and delight your guests.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/dashboard/templates" className="hover:text-white transition-colors">Templates</Link></li>
                <li><Link to="/dashboard/pricing" className="hover:text-white transition-colors">Pricing Plans</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Legal & Contact</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><a href="mailto:support@invitely.co" className="hover:text-white transition-colors">support@invitely.co</a></li>
              </ul>
            </div>
          </div>
          
          <hr className="border-slate-800 my-8" />
          
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs">
            <p>© {new Date().getFullYear()} Invitely Inc. All rights reserved.</p>
            <p className="mt-2 sm:mt-0 text-slate-500">
              Crafted by <a href="https://salahuddin.codes" target="_blank" rel="noreferrer" className="text-rose-400 hover:text-rose-350 transition-colors font-medium">Salah Uddin Kader</a> at <a href="https://nextorastudion.tech" target="_blank" rel="noreferrer" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">Nextora Studio</a> (<a href="https://github.com/salahuddingfx" target="_blank" rel="noreferrer" className="underline hover:text-slate-200 transition-colors">salahuddingfx</a>).
            </p>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {!cookieConsent && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl flex flex-col space-y-4 text-slate-900 dark:text-slate-100"
          >
            <div className="space-y-1.5 text-left">
              <h4 className="text-sm font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                We Respect Your Privacy
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Invitely uses essential cookies to verify account sessions and save draft builder states. 
                Read our <Link to="/cookie-policy" className="text-rose-500 hover:underline">Cookie Policy</Link> to learn more.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleCookieChoice('accepted')}
                className="flex-grow py-2 rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-950 text-white text-xs font-bold shadow-sm transition-transform hover:scale-[1.02]"
              >
                Accept Cookies
              </button>
              <button
                onClick={() => handleCookieChoice('ignored')}
                className="px-4 py-2 rounded-xl border border-slate-250 dark:border-slate-850 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
              >
                Ignore
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
