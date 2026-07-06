import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { useNotificationStore } from '../store/notificationStore';
import { CloudinaryUploader } from '../components/CloudinaryUploader';
import { AlertCircle, Shield, Save, Camera } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address')
});

type ProfileFormInputs = z.infer<typeof profileSchema>;

export const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const { updateProfile } = useUserStore();
  const { addToast } = useNotificationStore();
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  });

  const onSubmit = async (data: ProfileFormInputs) => {
    try {
      const ok = await updateProfile(data.name, data.email, avatarUrl || undefined);
      if (!ok) {
        addToast('Failed to update profile.', 'error');
      }
    } catch {
      addToast('An error occurred during save.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-6 shadow-sm">
        {/* Avatar hero section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-850">
          <div className="relative group">
            <img
              src={avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=f43f5e&color=fff&size=150'}
              alt="Profile Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-md"
            />
            <div className="absolute -bottom-1.5 -right-1.5 bg-rose-500 text-white p-1.5 rounded-full shadow-md">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-2">
            <h3 className="text-xl font-bold font-playfair">{user?.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
            <div className="flex justify-center sm:justify-start">
              <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {user?.currentPlan === 'plan-free' ? 'Starter Account' : user?.currentPlan === 'plan-premium' ? 'Premium Package' : 'VIP Elite'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5 max-w-xl">
          {/* Profile Photo Upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Profile Photo
            </label>
            <CloudinaryUploader
              accept="image/*"
              onUploaded={(url) => {
                setAvatarUrl(url);
                addToast('Profile photo uploaded!', 'success');
              }}
              label="Upload Photo"
              hint="JPG, PNG or WebP recommended · max 10MB"
              currentUrl={avatarUrl}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Full Name / Couple Name
            </label>
            <input
              type="text"
              {...register('name')}
              className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all ${
                errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
              }`}
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Billing Email Address
            </label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all ${
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

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-all shadow-md flex items-center gap-2 hover:scale-105 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-6 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Security Settings</h4>
          <p className="text-xs text-slate-450 leading-relaxed font-light">
            Your login parameters are managed through secure credential databases. To change authentication keys or connect social credentials, contact developer support.
          </p>
        </div>
      </div>
    </div>
  );
};
