import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { usePaymentStore } from '../../store/paymentStore';
import {
  Users,
  CreditCard,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  DollarSign,
  Smartphone,
  Loader2
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { stats, isLoading, fetchStats } = useAdminStore();
  const { fetchAllPayments } = usePaymentStore();

  useEffect(() => {
    fetchStats();
    fetchAllPayments();
  }, [fetchStats, fetchAllPayments]);

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-500'
    },
    {
      label: 'Pending Payments',
      value: stats?.pendingPayments || 0,
      change: `৳${(stats?.pendingPayments || 0) * 1900} BDT`,
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-500'
    },
    {
      label: 'Total Revenue',
      value: `৳${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500/10 text-emerald-500'
    },
    {
      label: 'Active Invitations',
      value: stats?.publishedInvitations || 0,
      icon: FileText,
      color: 'bg-purple-500/10 text-purple-500'
    }
  ];

  const recentPayments = stats?.recentPayments || [];
  const pendingPayments = recentPayments.filter((p: any) => p.status === 'pending');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-playfair">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage users, payments, and platform settings</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:scale-[1.02] transition-transform"
          >
            <Users className="w-4 h-4" />
            Manage Users
          </Link>
          <Link
            to="/admin/payments"
            className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:scale-[1.02] transition-transform"
          >
            <CreditCard className="w-4 h-4" />
            Review Payments
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                {stat.change && (
                  <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold font-playfair">{stat.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Payments */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-playfair">Pending Payments</h3>
            <Link to="/admin/payments" className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-0.5">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {pendingPayments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No pending payments</p>
            ) : (
              pendingPayments.map((payment: any) => (
                <div key={payment._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      payment.method === 'bkash' ? 'bg-pink-100 dark:bg-pink-900/30' : 'bg-orange-100 dark:bg-orange-900/30'
                    }`}>
                      <Smartphone className={`w-4 h-4 ${
                        payment.method === 'bkash' ? 'text-pink-500' : 'text-orange-500'
                      }`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{payment.userId?.name || 'Unknown'}</p>
                      <p className="text-[10px] text-slate-400">{new Date(payment.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">৳{payment.amount}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-6 shadow-sm">
          <h3 className="font-bold font-playfair mb-4">Payment Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold">Pending Review</span>
              </div>
              <span className="text-lg font-bold text-amber-600">{stats?.pendingPayments || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold">Approved</span>
              </div>
              <span className="text-lg font-bold text-emerald-600">{stats?.approvedPayments || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-semibold">Rejected</span>
              </div>
              <span className="text-lg font-bold text-rose-600">{stats?.rejectedPayments || 0}</span>
            </div>
            {stats?.paymentMethods?.map((method: any) => (
              <div key={method._id} className={`flex items-center justify-between p-3 rounded-xl border ${
                method._id === 'bkash'
                  ? 'bg-pink-50 dark:bg-pink-950/20 border-pink-200/50 dark:border-pink-900/30'
                  : 'bg-orange-50 dark:bg-orange-950/20 border-orange-200/50 dark:border-orange-900/30'
              }`}>
                <div className="flex items-center gap-2">
                  <Smartphone className={`w-4 h-4 ${method._id === 'bkash' ? 'text-pink-500' : 'text-orange-500'}`} />
                  <span className="text-xs font-semibold">{method._id === 'bkash' ? 'bKash' : 'Nagad'}</span>
                </div>
                <span className="text-lg font-bold">{method.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
