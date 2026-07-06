import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEventStore } from '../store/eventStore';
import { useNotificationStore } from '../store/notificationStore';
import { useTemplateStore } from '../store/templateStore';
import {
  Calendar,
  Copy,
  Edit2,
  Trash2,
  ExternalLink,
  Users,
  PlusCircle,
  Clock,
  Sparkles,
  Inbox
} from 'lucide-react';

export const MyInvitations: React.FC = () => {
  const { events, deleteInvitation, fetchUserInvitations } = useEventStore();
  const { getTemplateById } = useTemplateStore();
  const { addToast } = useNotificationStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchUserInvitations();
  }, [fetchUserInvitations]);

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/invitation/${slug}`;
    navigator.clipboard.writeText(url);
    addToast('Invitation link copied to clipboard!', 'success');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this digital invitation? This action cannot be undone.')) {
      deleteInvitation(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header action */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200/50 dark:border-slate-800/40 pb-5">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Manage and track responses</p>
        </div>
        <Link
          to="/dashboard/events/create"
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-semibold shadow-lg shadow-rose-500/10 transition-transform hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Invitation
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-350 dark:border-slate-800 rounded-3xl space-y-4">
          <Inbox className="w-16 h-16 text-slate-300 mx-auto" />
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold font-playfair">No digital invitations created</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
              Draft your first elegant invitation event details, preview in a mock phone, and share.
            </p>
          </div>
          <Link
            to="/dashboard/events/create"
            className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white text-xs font-semibold inline-flex items-center gap-1"
          >
            Create First Invitation
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const template = getTemplateById(event.templateId);
            const attendingCount = event.rsvps.filter((r) => r.status === 'attending').reduce((acc, r) => acc + r.guestsCount, 0);
            
            return (
              <div
                key={event.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-850 transition-all flex flex-col justify-between"
              >
                {/* Visual Cover card preview */}
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-950">
                  {/* Show actual invitation photos if available, else template preview */}
                  {(event.bride?.avatar || event.groom?.avatar || event.gallery?.[0]) ? (
                    <div className="w-full h-full flex">
                      {event.bride?.avatar && (
                        <img
                          src={event.bride.avatar}
                          alt={event.bride.name || 'Bride'}
                          className="w-1/2 h-full object-cover"
                        />
                      )}
                      {event.groom?.avatar && (
                        <img
                          src={event.groom.avatar}
                          alt={event.groom.name || 'Groom'}
                          className="w-1/2 h-full object-cover"
                        />
                      )}
                      {!event.bride?.avatar && event.groom?.avatar && (
                        <img
                          src={event.groom.avatar}
                          alt={event.groom.name || 'Groom'}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {!event.groom?.avatar && event.bride?.avatar && (
                        <img
                          src={event.bride.avatar}
                          alt={event.bride.name || 'Bride'}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ) : (
                    <img
                      src={template?.previewImage || ''}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  
                  {/* Status Badges overlay */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase ${
                        event.status === 'published'
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>

                  {/* Slug / Title text overlays */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-bold font-playfair truncate text-base leading-tight">
                      {event.title}
                    </h4>
                    <p className="text-[10px] text-slate-300 truncate">
                      invitely.co/invitation/{event.slug}
                    </p>
                  </div>
                </div>

                {/* Event core info */}
                <div className="p-5 space-y-4 flex-grow">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>
                        {new Date(event.eventDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>{event.rsvps.length} RSVPs ({attendingCount} attending)</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    📍 {event.locationName} - {event.locationAddress}
                  </div>
                </div>

                {/* Operations links */}
                <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-950/20">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLink(event.slug)}
                      className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                      title="Copy invitation link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {event.status === 'published' && (
                      <Link
                        to={`/invitation/${event.slug}`}
                        className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                        title="View Published Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => navigate(`/dashboard/events/edit/${event.id}`)}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDelete(event.id, e)}
                      className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete Invitation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
