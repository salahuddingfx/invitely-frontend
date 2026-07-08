import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBuilderStore } from '../store/builderStore';
import { useEventStore } from '../store/eventStore';
import { useTemplateStore } from '../store/templateStore';
import { useNotificationStore } from '../store/notificationStore';
import { InvitationScreenContent } from '../components/invitation/InvitationScreenContent';
import { AUDIO_PRESETS } from '../components/invitation/InvitationScreenContent';
import { getAudioUrl } from '../components/invitation/InvitationScreenContent';
import { CloudinaryUploader } from '../components/CloudinaryUploader';
import { mockGalleryImages } from '../mock/gallery';
import Slider from '@mui/material/Slider';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Smartphone,
  Eye,
  Trash2,
  Plus,
  Compass,
  CheckCircle2,
  Calendar,
  Music,
  Palette,
  MapPin,
  Users,
  X,
  Volume2,
  VolumeX,
  Play,
  Pause
} from 'lucide-react';

const MusicPreviewPlayer: React.FC<{ musicUrl: string }> = ({ musicUrl }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const resolvedUrl = getAudioUrl(musicUrl);

  useEffect(() => {
    if (!resolvedUrl) return;
    const audio = new Audio(resolvedUrl);
    audioRef.current = audio;
    audio.addEventListener('timeupdate', () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    });
    audio.addEventListener('ended', () => setPlaying(false));
    return () => { audio.pause(); audioRef.current = null; };
  }, [resolvedUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!resolvedUrl) return null;

  const presetName = AUDIO_PRESETS.find(p => p.id === musicUrl)?.name || 'Custom Audio';

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-950/20 dark:to-amber-950/20 border border-rose-200/50 dark:border-rose-900/30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform flex-shrink-0"
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-slate-500 truncate">{presetName}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] text-slate-400 font-mono">{formatTime(progress)}</span>
            <div
              onClick={seek}
              className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full cursor-pointer overflow-hidden"
            >
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all"
                style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }}
              />
            </div>
            <span className="text-[9px] text-slate-400 font-mono">{formatTime(duration)}</span>
          </div>
        </div>
        <Volume2 className="w-4 h-4 text-rose-400 flex-shrink-0" />
      </div>
    </div>
  );
};

const getDefaultMusicForCategory = (catId: string): string => {
  if (catId === 'cat-2') return 'happy-birthday-party';
  if (catId === 'cat-3') return 'romantic-anniversary-violin';
  if (catId === 'cat-5') return 'baby-lullaby-aqiqah';
  if (catId === 'cat-6') return 'lively-jazz-party-beats';
  if (catId === 'cat-7') return 'romantic-anniversary-violin';
  return 'romantic-acoustic-wedding-waltz';
};

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const CreateInvitation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateIdParam = searchParams.get('templateId');

  const {
    activeStep,
    setStep,
    nextStep,
    prevStep,
    invitationData,
    updateInvitationData,
    updateBrideDetails,
    updateGroomDetails,
    addLoveStoryMilestone,
    updateLoveStoryMilestone,
    removeLoveStoryMilestone,
    isMobilePreviewOpen,
    setMobilePreview,
    resetBuilder
  } = useBuilderStore();

  const { createInvitation } = useEventStore();
  const { templates, categories } = useTemplateStore();
  const { addToast } = useNotificationStore();

  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [customGalleryUrl, setCustomGalleryUrl] = useState('');

  // Initial load
  useEffect(() => {
    resetBuilder();
    if (templateIdParam) {
      const template = templates.find((t) => t.id === templateIdParam);
      if (template) {
        updateInvitationData({
          templateId: template.id,
          themeColor: {
            primary: template.theme.primaryColor,
            secondary: template.theme.secondaryColor,
            background: template.theme.backgroundColor,
            text: template.theme.textColor
          },
          fontFamily: template.theme.fontFamily
        });
      }
    }
  }, [templateIdParam, templates, updateInvitationData, resetBuilder]);

  const handleSave = async () => {
    // Generate unique slug check
    const id = await createInvitation({
      ...invitationData,
      status: 'published' // Publish directly
    });
    if (id) {
      resetBuilder();
      navigate('/dashboard/events');
    }
  };

  const stepsList = [
    { label: 'Theme & Title', icon: Palette },
    { label: 'The Couple', icon: Heart },
    { label: 'Schedule', icon: Calendar },
    { label: 'Venue Address', icon: MapPin },
    { label: 'Love Gallery', icon: Compass },
    { label: 'Publish Envelope', icon: Sparkles }
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      
      {/* Builder Core layout splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-[70vh]">
        
        {/* Left Column: Form parameters (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            
            {/* Step badges progress bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100 dark:border-slate-850">
              {stepsList.map((step, idx) => {
                const Icon = step.icon;
                const isCurrent = activeStep === idx;
                const isCompleted = activeStep > idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setStep(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isCurrent
                        ? 'bg-rose-500 text-white shadow-md'
                        : isCompleted
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : 'bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 text-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Forms Switcher */}
            <div className="space-y-5">
              
              {/* Step 0: Theme, Template, and Title details */}
              {activeStep === 0 && (
                <div className="space-y-5 animate-scale-in">
                  <h3 className="text-base font-bold font-playfair">Select Template Theme</h3>
                  
                  {/* Category choice */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Event Category
                    </label>
                    <select
                      value={invitationData.categoryId}
                      onChange={(e) => {
                        const catId = e.target.value;
                        updateInvitationData({
                          categoryId: catId,
                          musicUrl: getDefaultMusicForCategory(catId)
                        });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Invitation Title
                      </label>
                      <input
                        type="text"
                        value={invitationData.title}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          const oldTitle = invitationData.title || '';
                          const currentSlug = invitationData.slug || '';
                          const oldAutoSlug = slugify(oldTitle);
                          const shouldSync = !currentSlug || currentSlug === oldAutoSlug;
                          updateInvitationData({
                            title: newTitle,
                            ...(shouldSync ? { slug: slugify(newTitle) } : {})
                          });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        URL Slug (invitely.co/invitation/...)
                      </label>
                      <input
                        type="text"
                        value={invitationData.slug}
                        onChange={(e) => {
                          const cleanSlug = e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, '');
                          updateInvitationData({ slug: cleanSlug });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Themes list selection grid */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Preset Template Styling
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {templates
                        .filter((tpl) => tpl.categoryId === invitationData.categoryId)
                        .map((tpl) => (
                          <button
                            key={tpl.id}
                            onClick={() =>
                              updateInvitationData({
                                templateId: tpl.id,
                                themeColor: {
                                  primary: tpl.theme.primaryColor,
                                  secondary: tpl.theme.secondaryColor,
                                  background: tpl.theme.backgroundColor,
                                  text: tpl.theme.textColor
                                },
                                fontFamily: tpl.theme.fontFamily
                              })
                            }
                            className={`p-3 rounded-2xl border text-left space-y-2 transition-all ${
                              invitationData.templateId === tpl.id
                                ? 'border-rose-500 bg-rose-500/5 ring-1 ring-rose-500'
                                : 'border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950'
                            }`}
                          >
                            <div className="h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950">
                              <img src={tpl.previewImage} alt="" className="w-full h-full object-cover" />
                            </div>
                            <p className="text-xs font-semibold truncate leading-none">{tpl.name}</p>
                            <span className="text-[9px] text-slate-450 uppercase">{tpl.theme.fontFamily} style</span>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Groom and Bride profile info */}
              {activeStep === 1 && (
                <div className="space-y-6 animate-scale-in">
                  <h3 className="text-base font-bold font-playfair">Describe the Couple</h3>
                  
                  {/* Bride inputs */}
                  <div className="space-y-4 p-4 border border-slate-100 dark:border-slate-850 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                    <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest">Bride (She)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-450 mb-1">Bride's Full Name</label>
                        <input
                          type="text"
                          value={invitationData.bride.name}
                          onChange={(e) => updateBrideDetails({ name: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-450 mb-1">Parent's Info (Optional)</label>
                        <input
                          type="text"
                          placeholder="Daughter of Mr. & Mrs..."
                          value={invitationData.bride.parentGroomBride || ''}
                          onChange={(e) => updateBrideDetails({ parentGroomBride: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-450 mb-1">Short Biography</label>
                      <textarea
                        rows={2}
                        value={invitationData.bride.bio}
                        onChange={(e) => updateBrideDetails({ bio: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none resize-none"
                      />
                    </div>
                    
                    {/* Avatar Preset Selector */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-2">Bride Photo Preset</label>
                      <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
                        {mockGalleryImages.filter((g) => g.category === 'portraits').map((img) => (
                          <button
                            key={img.id}
                            type="button"
                            onClick={() => updateBrideDetails({ avatar: img.url })}
                            className={`w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0 transition-transform hover:scale-105 ${
                              invitationData.bride.avatar === img.url ? 'border-rose-500' : 'border-transparent'
                            }`}
                          >
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Cloudinary Upload for Bride */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-2">Or Upload Bride's Real Photo</label>
                      <CloudinaryUploader
                        accept="image/*"
                        compact
                        label="Upload Photo"
                        currentUrl={invitationData.bride.avatar}
                        onUploaded={(url) => updateBrideDetails({ avatar: url })}
                      />
                    </div>
                  </div>

                  {/* Groom inputs */}
                  <div className="space-y-4 p-4 border border-slate-100 dark:border-slate-850 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                    <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Groom (He)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-450 mb-1">Groom's Full Name</label>
                        <input
                          type="text"
                          value={invitationData.groom.name}
                          onChange={(e) => updateGroomDetails({ name: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-450 mb-1">Parent's Info (Optional)</label>
                        <input
                          type="text"
                          placeholder="Son of Mr. & Mrs..."
                          value={invitationData.groom.parentGroomBride || ''}
                          onChange={(e) => updateGroomDetails({ parentGroomBride: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-450 mb-1">Short Biography</label>
                      <textarea
                        rows={2}
                        value={invitationData.groom.bio}
                        onChange={(e) => updateGroomDetails({ bio: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none resize-none"
                      />
                    </div>
                    
                    {/* Groom Photo Preset */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-2">Groom Photo Preset</label>
                      <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
                        {mockGalleryImages.filter((g) => g.category === 'portraits').map((img) => (
                          <button
                            key={img.id}
                            type="button"
                            onClick={() => updateGroomDetails({ avatar: img.url })}
                            className={`w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0 transition-transform hover:scale-105 ${
                              invitationData.groom.avatar === img.url ? 'border-rose-500' : 'border-transparent'
                            }`}
                          >
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Cloudinary Upload for Groom */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-2">Or Upload Groom's Real Photo</label>
                      <CloudinaryUploader
                        accept="image/*"
                        compact
                        label="Upload Photo"
                        currentUrl={invitationData.groom.avatar}
                        onUploaded={(url) => updateGroomDetails({ avatar: url })}
                      />
                    </div>
                  </div>

                  {/* Love Story Timeline Editor */}
                  <div className="space-y-4 p-4 border border-amber-500/20 rounded-2xl bg-amber-50/30 dark:bg-amber-900/5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                        <span>💛</span> Love Story Timeline
                      </h4>
                      <button
                        type="button"
                        onClick={addLoveStoryMilestone}
                        className="flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Add Milestone
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(invitationData.loveStory || []).map((milestone) => (
                        <div key={milestone.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/40 space-y-2 relative group">
                          <button
                            type="button"
                            onClick={() => removeLoveStoryMilestone(milestone.id)}
                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/20"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Icon / Emoji</label>
                              <input type="text" value={milestone.icon} onChange={(e) => updateLoveStoryMilestone(milestone.id, { icon: e.target.value })} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none" maxLength={4} />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Date / Year</label>
                              <input type="text" placeholder="e.g. Spring 2024" value={milestone.date} onChange={(e) => updateLoveStoryMilestone(milestone.id, { date: e.target.value })} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Title</label>
                            <input type="text" placeholder="e.g. How We Met" value={milestone.title} onChange={(e) => updateLoveStoryMilestone(milestone.id, { title: e.target.value })} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Description</label>
                            <textarea rows={2} placeholder="Describe this milestone..." value={milestone.description} onChange={(e) => updateLoveStoryMilestone(milestone.id, { description: e.target.value })} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none resize-none" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Schedule & date details */}
              {activeStep === 2 && (
                <div className="space-y-5 animate-scale-in">
                  <h3 className="text-base font-bold font-playfair">Event Date & Time</h3>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Event Date & Target Countdown
                    </label>
                    <input
                      type="datetime-local"
                      value={new Date(invitationData.eventDate).toISOString().slice(0, 16)}
                      onChange={(e) => updateInvitationData({ eventDate: new Date(e.target.value).toISOString() })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Display Time (e.g., 04:00 PM - 09:00 PM)
                    </label>
                    <input
                      type="text"
                      value={invitationData.eventTime}
                      onChange={(e) => updateInvitationData({ eventTime: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Location details */}
              {activeStep === 3 && (
                <div className="space-y-5 animate-scale-in">
                  <h3 className="text-base font-bold font-playfair">Venue Details</h3>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      placeholder="The Palace Garden"
                      value={invitationData.locationName}
                      onChange={(e) => updateInvitationData({ locationName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      placeholder="123 Wedding Way, Suite B"
                      value={invitationData.locationAddress}
                      onChange={(e) => updateInvitationData({ locationAddress: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Google Maps Link (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://maps.google.com/..."
                      value={invitationData.locationMapsUrl}
                      onChange={(e) => updateInvitationData({ locationMapsUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Photo Gallery uploads */}
              {activeStep === 4 && (
                <div className="space-y-5 animate-scale-in">
                  <h3 className="text-base font-bold font-playfair">Couple's Photo Album</h3>

                  {/* Cover Photo Upload */}
                  <div className="p-4 border border-rose-200 dark:border-rose-900/30 rounded-2xl bg-rose-50/30 dark:bg-rose-950/10 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-500" />
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                        Cover Photo (Hero Image)
                      </label>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      This image appears as the main background on your invitation. If empty, the first gallery photo is used.
                    </p>
                    {invitationData.coverPhoto && (
                      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                        <img src={invitationData.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => updateInvitationData({ coverPhoto: '' })}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <CloudinaryUploader
                      accept="image/*"
                      label="Upload Cover Photo"
                      hint="Recommended: 1200x800px landscape"
                      onUploaded={(url) => {
                        updateInvitationData({ coverPhoto: url });
                        addToast('Cover photo uploaded!', 'success');
                      }}
                    />
                  </div>
                  
                  {/* Photo Preset Selector */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Select Preset Gallery Images
                    </label>
                    <div className="grid grid-cols-4 gap-2.5 pb-4 border-b border-slate-105 dark:border-slate-850">
                      {mockGalleryImages.filter((g) => g.category === 'couple' || g.category === 'decor').map((img) => {
                        const isSelected = invitationData.gallery.includes(img.url);
                        return (
                          <button
                            key={img.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                updateInvitationData({
                                  gallery: invitationData.gallery.filter((url) => url !== img.url)
                                });
                              } else {
                                updateInvitationData({
                                  gallery: [...invitationData.gallery, img.url]
                                });
                              }
                            }}
                            className={`aspect-square rounded-xl overflow-hidden border-2 relative group flex-shrink-0 transition-transform ${
                              isSelected ? 'border-rose-500 scale-[0.98]' : 'border-transparent'
                            }`}
                          >
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-rose-500/25 flex items-center justify-center text-white">
                                <CheckCircle2 className="w-5 h-5 fill-rose-500" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cloudinary Photo Upload for Gallery */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Upload Photo from Device
                    </label>
                    <CloudinaryUploader
                      accept="image/*"
                      label="Upload Gallery Photo"
                      hint="Uploaded to Cloudinary · JPG, PNG, WebP"
                      onUploaded={(url) => {
                        updateInvitationData({ gallery: [...invitationData.gallery, url] });
                        addToast('Photo uploaded & added to gallery!', 'success');
                      }}
                    />
                  </div>

                  {/* Manual Paste */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Add Custom Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://example.com/photo.jpg"
                        value={customGalleryUrl}
                        onChange={(e) => setCustomGalleryUrl(e.target.value)}
                        className="flex-grow px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customGalleryUrl.trim()) {
                            updateInvitationData({ gallery: [...invitationData.gallery, customGalleryUrl] });
                            setCustomGalleryUrl('');
                            addToast('Photo added to gallery', 'success');
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 text-xs font-bold"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Active Gallery listing */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Active Gallery Images ({invitationData.gallery.length})
                    </label>
                    <div className="grid grid-cols-2 gap-3.5">
                      {invitationData.gallery.map((url, i) => (
                        <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden relative group border dark:border-slate-850">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() =>
                              updateInvitationData({
                                gallery: invitationData.gallery.filter((_, idx) => idx !== i)
                              })
                            }
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Advanced Styling and Music */}
              {activeStep === 5 && (
                <div className="space-y-6 animate-scale-in">
                  <h3 className="text-base font-bold font-playfair">Review, Style, and Publish</h3>
                  
                  {/* MUI Slider integration for colors */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450">
                      Customize Colors
                    </label>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1.5 font-semibold">
                          <span>Primary Theme Accent</span>
                          <span style={{ color: invitationData.themeColor.primary }}>{invitationData.themeColor.primary}</span>
                        </div>
                        {/* Preset color blocks */}
                        <div className="flex gap-2">
                          {['#d4af37', '#ec4899', '#166534', '#0f172a', '#a855f7', '#3b82f6'].map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() =>
                                updateInvitationData({
                                  themeColor: { ...invitationData.themeColor, primary: color }
                                })
                              }
                              className={`w-6 h-6 rounded-full border ${
                                invitationData.themeColor.primary === color ? 'ring-2 ring-rose-500' : ''
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fonts selector */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      calligraphy typography font
                    </label>
                    <select
                      value={invitationData.fontFamily}
                      onChange={(e) => updateInvitationData({ fontFamily: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none"
                    >
                      <option value="playfair">Playfair Serif (Royal)</option>
                      <option value="cormorant">Cormorant Garamond (Elegant)</option>
                      <option value="greatvibes">Great Vibes (Calligraphy)</option>
                      <option value="amiri">Amiri (Arabic / Islamic)</option>
                      <option value="sans">Inter Sans-Serif (Minimalist)</option>
                    </select>
                  </div>
                  {/* ── Background Music Section ─────────────────────────────── */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold font-playfair">Background Music</h4>
                      <p className="text-[10px] text-slate-400">Upload your own music or pick from presets</p>
                    </div>

                    {/* ── Upload Your Own Music (PRIMARY) ──────────────────────── */}
                    <div className={`p-5 rounded-2xl border-2 border-dashed transition-all ${
                      invitationData.musicUrl.startsWith('http')
                        ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/10'
                        : 'border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/10'
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          invitationData.musicUrl.startsWith('http')
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          <Music className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold block">Upload Your Own Music</span>
                          <span className="text-[9px] text-slate-400">MP3, OGG, WAV · Max 10MB · Stored on Cloudinary</span>
                        </div>
                      </div>
                      <CloudinaryUploader
                        accept="audio/*"
                        label="Drop your music file here"
                        hint="Click or drag to upload your custom song"
                        onUploaded={(url) => {
                          updateInvitationData({ musicUrl: url });
                          addToast('Custom audio uploaded & selected!', 'success');
                        }}
                      />
                      {invitationData.musicUrl.startsWith('http') && (
                        <div className="mt-3 flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-[10px] text-emerald-600 font-semibold">Custom audio selected & ready to play!</span>
                          <button
                            type="button"
                            onClick={() => updateInvitationData({ musicUrl: 'romantic-acoustic-wedding-waltz' })}
                            className="ml-auto text-[9px] font-bold text-rose-500 hover:text-rose-600 underline"
                          >
                            Remove & use preset
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ── Audio Preview Player ─────────────────────────────────── */}
                    {invitationData.musicUrl && invitationData.musicUrl !== 'none' && (
                      <MusicPreviewPlayer musicUrl={invitationData.musicUrl} />
                    )}

                    {/* ── Divider ─────────────────────────────────────────────── */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">or choose a preset</span>
                      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                    </div>

                    {/* ── Preset Music Grid ───────────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {AUDIO_PRESETS.map((preset) => {
                        const isSelected = invitationData.musicUrl === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => updateInvitationData({ musicUrl: preset.id })}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/20 shadow-sm'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}>
                              <Music className="w-3.5 h-3.5" />
                            </div>
                            <span className={`text-[11px] font-semibold truncate ${
                              isSelected ? 'text-rose-700 dark:text-rose-300' : 'text-slate-600 dark:text-slate-300'
                            }`}>
                              {preset.name}
                            </span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 ml-auto flex-shrink-0" />}
                          </button>
                        );
                      })}
                      {/* No Audio option */}
                      <button
                        type="button"
                        onClick={() => updateInvitationData({ musicUrl: 'none' })}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          invitationData.musicUrl === 'none'
                            ? 'border-slate-400 bg-slate-100 dark:bg-slate-800 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          invitationData.musicUrl === 'none' ? 'bg-slate-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}>
                          <VolumeX className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-[11px] font-semibold ${
                          invitationData.musicUrl === 'none' ? 'text-slate-700 dark:text-slate-200' : 'text-slate-600 dark:text-slate-300'
                        }`}>
                          No Audio (Silent)
                        </span>
                        {invitationData.musicUrl === 'none' && <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 ml-auto flex-shrink-0" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-5 mt-4">
            <button
              onClick={prevStep}
              disabled={activeStep === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {activeStep === 5 ? (
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-rose-500/10 flex items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                Publish Invitation
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 text-white font-semibold text-xs flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Live Preview Frame (lg:col-span-5) */}
        <div className="lg:col-span-5 hidden lg:flex flex-col items-center justify-start sticky top-24 self-start">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Live Envelope Preview</span>
          </div>

          {/* Phone chassis */}
          <div className="relative w-[320px] h-[640px] rounded-[38px] border-[10px] border-slate-800 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden flex flex-col">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-32 bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-950" />
            </div>

            {/* Content canvas rendering the live state */}
            <div className="flex-1 overflow-y-auto relative bg-slate-50 text-slate-900 scrollbar-none">
              <InvitationScreenContent
                invitation={{
                  id: 'preview',
                  rsvps: [],
                  ...invitationData
                }}
                isPreviewMode={true}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Floating Toggle button for mobile layouts to trigger mobile preview drawer */}
      <button
        onClick={() => setMobilePreview(true)}
        className="fixed bottom-6 right-6 z-40 lg:hidden px-5 py-3 rounded-full bg-rose-500 text-white font-bold text-xs shadow-xl shadow-rose-500/20 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
      >
        <Eye className="w-4 h-4" />
        Preview Phone
      </button>

      {/* Mobile Preview Backdrop Modal */}
      {isMobilePreviewOpen && (
        <div className="fixed inset-0 bg-slate-950/70 z-[99] lg:hidden flex items-center justify-center p-4">
          <div className="relative w-[340px] h-[660px] rounded-[40px] border-[10px] border-slate-800 shadow-2xl bg-white dark:bg-slate-950 overflow-hidden flex flex-col animate-scale-in">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4.5 w-32 bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center" />
            
            {/* Close trigger */}
            <button
              onClick={() => setMobilePreview(false)}
              className="absolute top-4 right-4 z-[60] bg-black/60 text-white rounded-full p-2 hover:bg-rose-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex-1 overflow-y-auto relative bg-slate-50 text-slate-900 scrollbar-none">
              <InvitationScreenContent
                invitation={{
                  id: 'preview',
                  rsvps: [],
                  ...invitationData
                }}
                isPreviewMode={true}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
