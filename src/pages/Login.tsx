import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../store/authStore';
import { Heart, Sparkles, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setAuthError(null);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setAuthError('Invalid credentials. Try using any email and password.');
      }
    } catch {
      setAuthError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 shadow-xl relative overflow-hidden">
        {/* Decorative backdrop */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-rose-500/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />

        <div className="text-center relative z-10">
          <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md mb-4">
            <Heart className="h-6 w-6 fill-current animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold font-playfair tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to manage your digital invitations
          </p>
        </div>

        {authError && (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 p-4 rounded-xl flex items-start gap-2.5 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g., alexander@example.com"
              {...formRegister('email')}
              className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all ${
                errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
              }`}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-rose-500 hover:text-rose-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...formRegister('password')}
                className={`w-full pl-4 pr-12 py-3 rounded-xl border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all ${
                  errors.password ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:text-slate-650 text-slate-400 dark:hover:text-slate-350 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 transition-all duration-300 shadow-md shadow-rose-500/10 flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          <span>Don't have an account? </span>
          <Link
            to="/register"
            className="font-semibold text-rose-500 hover:text-rose-600 hover:underline inline-flex items-center gap-0.5"
          >
            Create an Account
            <Sparkles className="w-3 h-3 text-amber-500" />
          </Link>
        </div>
      </div>
    </div>
  );
};
