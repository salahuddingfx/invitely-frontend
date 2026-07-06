import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { useNotificationStore } from '../../store/notificationStore';
import {
  Search,
  Mail,
  Trash2,
  Crown,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { users, usersPagination, isLoading, fetchUsers, updateUserPlan, deleteUser } = useAdminStore();
  const { addToast } = useNotificationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers({ search: searchQuery, plan: planFilter, page: currentPage });
  }, [fetchUsers, searchQuery, planFilter, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers({ search: searchQuery, plan: planFilter, page: 1 });
  };

  const handlePlanChange = async (userId: string, newPlan: string) => {
    const success = await updateUserPlan(userId, newPlan);
    if (success) {
      addToast('User plan updated!', 'success');
    } else {
      addToast('Failed to update plan', 'error');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (confirm(`Delete ${userName}? This will also delete all their invitations.`)) {
      const success = await deleteUser(userId);
      if (success) {
        addToast('User deleted', 'success');
      } else {
        addToast('Failed to delete user', 'error');
      }
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'plan-premium':
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">Premium</span>;
      case 'plan-vip':
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">VIP</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">Free</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-playfair">User Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{usersPagination.total} total users</p>
        </div>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30"
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => {
            setPlanFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none"
        >
          <option value="all">All Plans</option>
          <option value="plan-free">Free</option>
          <option value="plan-premium">Premium</option>
          <option value="plan-vip">VIP</option>
        </select>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold"
        >
          Search
        </button>
      </form>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        </div>
      )}

      {/* Users Table */}
      {!isLoading && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">User</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Plan</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Invitations</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Joined</th>
                  <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                            {user.avatar ? (
                              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              user.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{user.name}</p>
                            <p className="text-[10px] text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.currentPlan}
                          onChange={(e) => handlePlanChange(user._id, e.target.value)}
                          className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[10px] font-semibold focus:outline-none cursor-pointer"
                        >
                          <option value="plan-free">Free</option>
                          <option value="plan-premium">Premium</option>
                          <option value="plan-vip">VIP</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm">{user.invitationCount}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors" title="Send Email">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {usersPagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500">
                Page {usersPagination.page} of {usersPagination.pages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-950"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(usersPagination.pages, currentPage + 1))}
                  disabled={currentPage === usersPagination.pages}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-950"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
