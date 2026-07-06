import React from 'react';
import { Link } from 'react-router-dom';
import { useEventStore } from '../store/eventStore';
import { useAuthStore } from '../store/authStore';
import { useTemplateStore } from '../store/templateStore';
import {
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  FileText,
  UserCheck2,
  Inbox,
  Sparkles
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { events, fetchUserInvitations } = useEventStore();
  const { templates } = useTemplateStore();

  React.useEffect(() => {
    fetchUserInvitations();
  }, [fetchUserInvitations]);

  // Statistics calculation
  const totalInvitations = events.length;
  const publishedInvitations = events.filter((e) => e.status === 'published').length;
  
  // Aggregate RSVPs
  const allRSVPs = events.flatMap((e) => 
    e.rsvps.map((r) => ({ ...r, eventTitle: e.title, eventSlug: e.slug }))
  );
  
  const totalRSVPs = allRSVPs.length;
  const attendingRSVPs = allRSVPs.filter((r) => r.status === 'attending');
  const attendingGuestsCount = attendingRSVPs.reduce((sum, r) => sum + r.guestsCount, 0);

  // Sorting recent RSVPs
  const recentRSVPs = [...allRSVPs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: 'Invitations',
      value: totalInvitations,
      subtext: `${publishedInvitations} published, ${totalInvitations - publishedInvitations} draft`,
      icon: FileText,
      color: 'bg-indigo-500/10 text-indigo-500'
    },
    {
      label: 'RSVPs Submitted',
      value: totalRSVPs,
      subtext: `${attendingRSVPs.length} guests confirmed attending`,
      icon: Users,
      color: 'bg-rose-500/10 text-rose-500'
    },
    {
      label: 'Attending Guests',
      value: attendingGuestsCount,
      subtext: 'Sum of guest RSVP party sizes',
      icon: UserCheck2,
      color: 'bg-emerald-500/10 text-emerald-500'
    },
    {
      label: 'Views (Mocked)',
      value: totalInvitations * 142 + 48,
      subtext: 'Web page hits tracker',
      icon: TrendingUp,
      color: 'bg-amber-500/10 text-amber-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-slate-900 dark:to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(circle_at_bottom_right,rgba(244,63,94,0.15)_0,transparent_100%)] hidden sm:block" />
        <div className="relative z-10 space-y-3">
          <span className="text-[10px] font-bold tracking-widest uppercase text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
            Invitely Hub
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-playfair">Hello, {user?.name}!</h2>
          <p className="text-slate-300 text-sm max-w-xl font-light leading-relaxed">
            Welcome to your digital event command center. Create templates, verify live RSVP lists, and publish revisions.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/dashboard/events/create"
              className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-semibold shadow-lg shadow-rose-500/20 flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Create Invitation
            </Link>
            <Link
              to="/dashboard/templates"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              Browse Gallery
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex items-start gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-slate-400 text-xs font-semibold tracking-wide uppercase">{stat.label}</span>
                <p className="text-3xl font-bold font-playfair leading-none">{stat.value}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{stat.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent RSVPs + Event Quicklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent RSVPs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-6 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
            <h3 className="text-lg font-bold font-playfair">Recent RSVP Updates</h3>
            <Link
              to="/dashboard/events"
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-0.5"
            >
              Manage Invites
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentRSVPs.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">No RSVP responses received yet.</p>
              <p className="text-xs text-slate-400">Published pages display guest input forms.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-850">
              {recentRSVPs.map((rsvp) => (
                <div key={rsvp.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{rsvp.name}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        for {rsvp.eventTitle}
                      </span>
                    </div>
                    {rsvp.message && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-900 mt-1 max-w-lg">
                        "{rsvp.message}"
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                      <span>Food: <strong className="text-slate-600 dark:text-slate-350 capitalize">{rsvp.foodPreference}</strong></span>
                      <span>•</span>
                      <span>Party size: <strong>{rsvp.guestsCount}</strong></span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase flex items-center gap-1 flex-shrink-0 ${
                      rsvp.status === 'attending'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : rsvp.status === 'declined'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {rsvp.status === 'attending' ? 'Attending' : rsvp.status === 'declined' ? 'Declined' : 'Maybe'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Mini Event Check & Pricing Banner */}
        <div className="space-y-6">
          
          {/* Quick list check */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">Current Invitations</h3>
            <div className="space-y-3">
              {events.slice(0, 3).map((event) => (
                <Link
                  key={event.id}
                  to={`/dashboard/events/edit/${event.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 border border-transparent hover:border-slate-100 dark:hover:border-slate-900 transition-all group"
                >
                  <div className="overflow-hidden space-y-1">
                    <p className="text-sm font-semibold truncate group-hover:text-rose-500 transition-colors">
                      {event.title}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      event.status === 'published'
                        ? 'bg-emerald-500/15 text-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {event.status}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Premium CTA banner */}
          <div className="bg-gradient-to-br from-rose-500 to-amber-500 rounded-2xl p-6 text-white space-y-4 shadow-lg shadow-rose-500/10">
            <Sparkles className="w-8 h-8 fill-current text-amber-200" />
            <div className="space-y-1">
              <h4 className="font-bold text-lg font-playfair">Unlock Royal Templates</h4>
              <p className="text-xs text-rose-100 leading-relaxed font-light">
                Upgrade to Premium to get custom colors, custom calligraphy fonts, background music tracks, and Google Maps venue coordinates.
              </p>
            </div>
            <Link
              to="/dashboard/pricing"
              className="inline-block w-full py-2.5 text-center text-xs font-bold bg-white text-slate-950 hover:bg-rose-50 rounded-xl transition-all shadow-md"
            >
              Explore Upgrades
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
