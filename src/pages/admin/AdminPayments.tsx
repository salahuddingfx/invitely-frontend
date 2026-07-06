import React, { useEffect, useState } from 'react';
import { usePaymentStore } from '../../store/paymentStore';
import { useNotificationStore } from '../../store/notificationStore';
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Smartphone,
  Download,
  Image as ImageIcon,
  Loader2,
  X
} from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const { payments, isLoading, fetchAllPayments, approvePayment, rejectPayment } = usePaymentStore();
  const { addToast } = useNotificationStore();
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScreenshot, setShowScreenshot] = useState<string | null>(null);

  useEffect(() => {
    fetchAllPayments(statusFilter);
  }, [fetchAllPayments, statusFilter]);

  const handleApprove = async (paymentId: string) => {
    const success = await approvePayment(paymentId);
    if (success) {
      addToast('Payment approved! User plan upgraded.', 'success');
    } else {
      addToast('Failed to approve payment', 'error');
    }
  };

  const handleReject = async (paymentId: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    const success = await rejectPayment(paymentId, reason || undefined);
    if (success) {
      addToast('Payment rejected', 'success');
    } else {
      addToast('Failed to reject payment', 'error');
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const searchLower = searchQuery.toLowerCase();
    const userName = typeof payment.userId === 'object' ? payment.userId.name : '';
    const userEmail = typeof payment.userId === 'object' ? payment.userId.email : '';
    return (
      userName.toLowerCase().includes(searchLower) ||
      userEmail.toLowerCase().includes(searchLower) ||
      payment.transactionId.toLowerCase().includes(searchLower) ||
      payment.senderPhone.includes(searchQuery)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Approved</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  const pendingCount = payments.filter((p) => p.status === 'pending').length;
  const approvedCount = payments.filter((p) => p.status === 'approved').length;
  const rejectedCount = payments.filter((p) => p.status === 'rejected').length;
  const totalRevenue = payments.filter((p) => p.status === 'approved').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-playfair">Payment Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Review and manage bKash/Nagad payments</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/40">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending</p>
          <p className="text-2xl font-bold font-playfair text-amber-500">{pendingCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/40">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Approved</p>
          <p className="text-2xl font-bold font-playfair text-emerald-500">{approvedCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/40">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rejected</p>
          <p className="text-2xl font-bold font-playfair text-rose-500">{rejectedCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/40">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Revenue</p>
          <p className="text-2xl font-bold font-playfair">৳{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, transaction ID, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All Status</option>
        </select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        </div>
      )}

      {/* Payments List */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredPayments.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-12 text-center">
              <p className="text-slate-400 text-sm">No payments found</p>
            </div>
          ) : (
            filteredPayments.map((payment) => {
              const user = typeof payment.userId === 'object' ? payment.userId : null;
              return (
                <div
                  key={payment._id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-5 shadow-sm"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3 flex-grow">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold overflow-hidden">
                        {user?.avatar ? (
                          <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          user?.name?.charAt(0) || '?'
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{user?.name || 'Unknown User'}</p>
                        <p className="text-[10px] text-slate-400">{user?.email || ''}</p>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          payment.method === 'bkash' ? 'bg-pink-100 dark:bg-pink-900/30' : 'bg-orange-100 dark:bg-orange-900/30'
                        }`}>
                          <Smartphone className={`w-4 h-4 ${
                            payment.method === 'bkash' ? 'text-pink-500' : 'text-orange-500'
                          }`} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400">{payment.method === 'bkash' ? 'bKash' : 'Nagad'}</p>
                          <p className="text-xs font-mono font-semibold">{payment.transactionId}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-400">Phone</p>
                        <p className="text-xs font-semibold">{payment.senderPhone}</p>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-400">Amount</p>
                        <p className="text-sm font-bold">৳{payment.amount}</p>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-400">Plan</p>
                        <p className="text-xs font-semibold">{payment.planName}</p>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-400">Date</p>
                        <p className="text-xs">{new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      </div>

                      {getStatusBadge(payment.status)}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowScreenshot(payment.screenshotUrl)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                        title="View Screenshot"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      {payment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(payment._id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(payment._id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Screenshot Modal */}
      {showScreenshot && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[999] flex items-center justify-center p-4" onClick={() => setShowScreenshot(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold font-playfair">Payment Screenshot</h3>
              <button onClick={() => setShowScreenshot(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={showScreenshot} alt="Payment screenshot" className="w-full rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
};
