import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import {
  Heart,
  Sun,
  Moon,
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Palette,
  CreditCard,
  User,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Bell,
  Shield
} from 'lucide-react';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Invitations', path: '/dashboard/events', icon: Calendar },
    { name: 'Create Invitation', path: '/dashboard/events/create', icon: PlusCircle },
    { name: 'Templates', path: '/dashboard/templates', icon: Palette },
    { name: 'Pricing Plans', path: '/dashboard/pricing', icon: CreditCard },
    { name: 'My Profile', path: '/dashboard/profile', icon: User },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    ...(user?.isAdmin ? [{ name: 'Admin Panel', path: '/admin', icon: Shield }] : [])
  ];

  const getPageTitle = () => {
    const current = menuItems.find((item) => item.path === location.pathname);
    if (current) return current.name;
    if (location.pathname.includes('/dashboard/events/edit')) return 'Edit Invitation';
    if (location.pathname.includes('/template-preview')) return 'Template Details';
    return 'Invitely';
  };

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname !== '/dashboard') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* Sidebar container - Desktop */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-200/60 dark:border-slate-800/40 bg-white dark:bg-slate-900 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/60 dark:border-slate-800/40">
          <Link to="/" className="flex items-center space-x-2 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
              <Heart className="w-4 h-4 fill-current animate-pulse" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-xl font-bold tracking-tight font-playfair bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                Invitely
              </span>
            )}
          </Link>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* User Info (Collapsed/Expanded) */}
        {!sidebarCollapsed && user && (
          <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/40 flex items-center space-x-3 bg-slate-50/50 dark:bg-slate-950/20 m-3 rounded-xl">
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 object-cover"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <span className="text-xs uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium tracking-wider">
                {user.currentPlan === 'plan-free' ? 'Starter' : user.currentPlan === 'plan-premium' ? 'Premium' : 'VIP'}
              </span>
            </div>
          </div>
        )}

        {/* Sidebar Menu */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/15'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? '' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/40">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-rose-500/10 hover:text-rose-500 dark:text-slate-400 dark:hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/40 z-50 transition-transform duration-300 md:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/60 dark:border-slate-800/40">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 flex items-center justify-center text-white">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <span className="text-lg font-bold font-playfair text-slate-950 dark:text-white">Invitely</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {user && (
          <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/40 flex items-center space-x-3 bg-slate-50/50 dark:bg-slate-950/20 m-3 rounded-xl">
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-800"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <span className="text-xs uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full font-medium tracking-wide">
                {user.currentPlan === 'plan-free' ? 'Starter' : user.currentPlan === 'plan-premium' ? 'Premium' : 'VIP'}
              </span>
            </div>
          </div>
        )}

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-rose-500 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200/60 dark:border-slate-800/40">
          <button
            onClick={() => {
              setMobileSidebarOpen(false);
              handleLogout();
            }}
            className="flex items-center space-x-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:bg-rose-500/10 hover:text-rose-500"
          >
            <LogOut className="w-5 h-5 text-slate-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800/40 sticky top-0 z-30 shadow-sm transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white font-playfair sm:text-2xl">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            {/* Notification Badge Mock */}
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            <hr className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

            {/* User Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={user.avatar}
                    alt="User"
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-800 hover:ring-2 hover:ring-rose-500/50 transition-all"
                  />
                </button>

                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2.5 w-56 rounded-xl border border-slate-200/70 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-xl z-50 p-1 divide-y divide-slate-100 dark:divide-slate-850 animate-scale-in">
                      <div className="px-4 py-3">
                        <p className="text-sm font-semibold truncate text-slate-800 dark:text-white">{user.name}</p>
                        <p className="text-xs truncate text-slate-500 dark:text-slate-400">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/dashboard/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/dashboard/settings"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Settings</span>
                        </Link>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center space-x-2.5 w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 rounded-lg font-medium"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Content container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
};
