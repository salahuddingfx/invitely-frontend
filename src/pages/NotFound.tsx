import React from 'react';
import { Link } from 'react-router-dom';
import { HeartOff, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 blur-2xl bg-rose-500/20 rounded-full animate-pulse-slow" />
        <div className="w-24 h-24 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center relative">
          <HeartOff className="w-10 h-10 text-rose-500" />
        </div>
      </div>
      <h1 className="text-8xl font-extrabold font-playfair text-white tracking-tight">404</h1>
      <h2 className="text-2xl font-bold text-slate-200 mt-4">Invitation Not Found</h2>
      <p className="text-slate-400 mt-2 max-w-md">
        This link might have expired, been deleted, or the secret wedding envelope hasn't been sealed yet.
      </p>
      <Link
        to="/"
        className="mt-8 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-medium shadow-lg shadow-rose-500/20 flex items-center gap-2 transition-transform hover:scale-105"
      >
        <Home className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
};
