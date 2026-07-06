import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../store/authStore';
import { Heart, Key, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type ForgotFormInputs = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { forgotPassword, isLoading } = useAuthStore();
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotFormInputs>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotFormInputs) => {
    try {
      const ok = await forgotPassword(data.email);
      if (ok) {
        setSubmittedEmail(data.email);
        setSuccess(true);
      }
    } catch {
      // handled inside notification store
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 shadow-xl relative overflow-hidden">
        
        {success ? (
          <div className="text-center py-4 space-y-6">
            <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-playfair">Email Dispatched</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                We sent standard password reset guidelines to <strong className="text-slate-800 dark:text-slate-200">{submittedEmail}</strong>.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-700">
                <Key className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-extrabold font-playfair tracking-tight">Recover Password</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Enter your email address to retrieve password link details
              </p>
            </div>

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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-250 transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Link...
                    </>
                  ) : (
                    'Request Recovery Link'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-500"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
