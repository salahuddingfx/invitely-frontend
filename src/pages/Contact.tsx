import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(4, 'Subject must be at least 4 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormInputs = z.infer<typeof contactSchema>;

export const Contact: React.FC = () => {
  const { addToast } = useNotificationStore();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormInputs) => {
    // Mock API call latency
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Contact inquiry received:', data);
    setSubmitted(true);
    addToast('Message sent! Our support team will contact you shortly.', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold font-playfair tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Contact Support
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Have questions or need assistance with your invitation builders? Write us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
        {/* Info list */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 shadow-sm space-y-6 bg-slate-50/30 dark:bg-slate-950/20">
            <h3 className="font-bold text-sm tracking-wider uppercase text-slate-900 dark:text-white">
              Get in Touch
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Email Address</p>
                  <p className="text-slate-500 dark:text-slate-400">support@invitely.co</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Studio HQ</p>
                  <p className="text-slate-500 dark:text-slate-400">Nextora Studio, Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4 animate-scale-in">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-playfair">Message Sent Successfully!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Thank you for reaching out. A Nextora support engineer will review your ticket and get back to you within 24 hours.
                </p>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  reset();
                }}
                className="px-5 py-2.5 rounded-full bg-slate-900 dark:bg-slate-100 dark:text-slate-950 text-white text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Alexander Green"
                    {...register('name')}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all ${
                      errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g., support@example.com"
                    {...register('email')}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-955 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all ${
                      errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g., Inquiring about Premium custom domains"
                  {...register('subject')}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all ${
                    errors.subject ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {errors.subject && (
                  <p className="mt-1 text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us what you need help with..."
                  {...register('message')}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-955 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all resize-none ${
                    errors.message ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.01] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Sending Message...' : 'Send Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
