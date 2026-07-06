import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useBuilderStore } from '../store/builderStore';
import { useEventStore } from '../store/eventStore';
import { useTemplateStore } from '../store/templateStore';
import { useNotificationStore } from '../store/notificationStore';
import { InvitationScreenContent } from '../components/invitation/InvitationScreenContent';
import { AUDIO_PRESETS } from '../components/invitation/InvitationScreenContent';
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
  X
} from 'lucide-react';

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

export const EditInvitation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    activeStep,
    setStep,
    nextStep,
    prevStep,
    invitationData,
    updateInvitationData,
    updateBrideDetails,
    updateGroomDetails,
    isMobilePreviewOpen,
    setMobilePreview,
    loadInvitation,
    resetBuilder
  } = useBuilderStore();

  const { getInvitationById, updateInvitation } = useEventStore();
  const { templates, categories } = useTemplateStore();
  const { addToast } = useNotificationStore();

  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [customGalleryUrl, setCustomGalleryUrl] = useState('');

  // Load existing invitation details
  useEffect(() => {
    if (id) {
      const existing = getInvitationById(id);
      if (existing) {
        loadInvitation(id, existing);
      } else {
        addToast('Invitation not found.', 'error');
        navigate('/dashboard/events');
      }
    }
  }, [id, getInvitationById, loadInvitation, navigate, addToast]);

  const handleUpdate = async () => {
    if (id) {
      const ok = await updateInvitation(id, invitationData);
      if (ok) {
        resetBuilder();
        navigate('/dashboard/events');
      }
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
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-[70vh]">
        
        {/* Left Column: Form panel */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            
            {/* Step progress header */}
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

            {/* Forms body */}
            <div className="space-y-5">
              
              {/* Step 0: Theme details */}
              {activeStep === 0 && (
                <div className="space-y-5 animate-scale-in">
                  <h3 className="text-base font-bold font-playfair">Select Template Theme</h3>
                  
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

              {/* Step 1: Bride & Groom */}
              {activeStep === 1 && (
                <div className="space-y-6 animate-scale-in">
                  <h3 className="text-base font-bold font-playfair">Describe the Couple</h3>
                  
                  {/* Bride info */}
                  <div className="space-y-4 p-4 border border-slate-100 dark:border-slate-850 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                    <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest">Bride (She)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-450 mb-1">Bride's Full Name</label>
                        <input
                          type="text"
                          value={invitationData.bride.name}
                          onChange={(e) => updateBrideDetails({ name: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-455 mb-1">Parent's Info (Optional)</label>
                        <input
                          type="text"
                          placeholder="Daughter of Mr. & Mrs..."
                          value={invitationData.bride.parentGroomBride || ''}
                          onChange={(e) => updateBrideDetails({ parentGroomBride: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-sm focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-450 mb-1">Short Biography</label>
                      <textarea
                        rows={2}
                        value={invitationData.bride.bio}
                        onChange={(e) => updateBrideDetails({ bio: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-sm focus:outline-none resize-none"
                      />
                    </div>
                    
                    {/* Portrait presets */}
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

                  {/* Groom info */}
                  <div className="space-y-4 p-4 border border-slate-100 dark:border-slate-855 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                    <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Groom (He)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-450 mb-1">Groom's Full Name</label>
                        <input
                          type="text"
                          value={invitationData.groom.name}
                          onChange={(e) => updateGroomDetails({ name: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-455 mb-1">Parent's Info (Optional)</label>
                        <input
                          type="text"
                          placeholder="Son of Mr. & Mrs..."
                          value={invitationData.groom.parentGroomBride || ''}
                          onChange={(e) => updateGroomDetails({ parentGroomBride: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-sm focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-450 mb-1">Short Biography</label>
                      <textarea
                        rows={2}
                        value={invitationData.groom.bio}
                        onChange={(e) => updateGroomDetails({ bio: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-sm focus:outline-none resize-none"
                      />
                    </div>
                    
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
                </div>
              )}

              {/* Step 2: Date */}
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
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-sm focus:outline-none"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Location Address */}
              {activeStep === 3 && (
                <div className="space-y-5 animate-scale-in">
                  <h3 className="text-base font-bold font-playfair">Venue Details</h3>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      value={invitationData.locationName}
                      onChange={(e) => updateInvitationData({ locationName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={invitationData.locationAddress}
                      onChange={(e) => updateInvitationData({ locationAddress: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Google Maps Link
                    </label>
                    <input
                      type="text"
                      value={invitationData.locationMapsUrl}
                      onChange={(e) => updateInvitationData({ locationMapsUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Album presets */}
              {activeStep === 4 && (
                <div className="space-y-5 animate-scale-in">
                  <h3 className="text-base font-bold font-playfair">Couple's Photo Album</h3>

                  {/* Cover Photo */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Cover Photo
                    </label>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      This image appears as the main background on your invitation. If empty, the first gallery photo is used.
                    </p>
                    {invitationData.coverPhoto && (
                      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 mt-2">
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
                    <div className="mt-2">
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
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Select Preset Gallery Images
                    </label>
                    <div className="grid grid-cols-4 gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-850">
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
                        className="flex-grow px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-xs focus:outline-none"
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

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Active Gallery Images ({invitationData.gallery.length})
                    </label>
                    <div className="grid grid-cols-2 gap-3.5">
                      {invitationData.gallery.map((url, i) => (
                        <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden relative group border dark:border-slate-855">
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

              {/* Step 5: Colors */}
              {activeStep === 5 && (
                <div className="space-y-6 animate-scale-in">
                  <h3 className="text-base font-bold font-playfair">Review, Style, and Publish</h3>
                  
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

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      calligraphy typography font
                    </label>
                    <select
                      value={invitationData.fontFamily}
                      onChange={(e) => updateInvitationData({ fontFamily: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-sm focus:outline-none"
                    >
                      <option value="playfair">Playfair Serif (Royal)</option>
                      <option value="cormorant">Cormorant Garamond (Elegant)</option>
                      <option value="greatvibes">Great Vibes (Calligraphy)</option>
                      <option value="amiri">Amiri (Arabic / Islamic)</option>
                      <option value="sans">Inter Sans-Serif (Minimalist)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Background Music Track
                    </label>
                    <select
                      value={invitationData.musicUrl}
                      onChange={(e) => updateInvitationData({ musicUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-sm focus:outline-none"
                    >
                      {AUDIO_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                      <option value="none">No Audio Theme</option>
                      {invitationData.musicUrl.startsWith('http') && (
                        <option value={invitationData.musicUrl}>Custom Uploaded Audio</option>
                      )}
                    </select>
                  </div>

                  {/* Upload Custom Sound */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Or Upload Your Own Background Music
                    </label>
                    <CloudinaryUploader
                      accept="audio/*"
                      label="Upload MP3 / Audio"
                      hint="MP3, OGG, WAV · max 10MB · stored on Cloudinary"
                      onUploaded={(url) => {
                        updateInvitationData({ musicUrl: url });
                        addToast('Custom audio uploaded & selected!', 'success');
                      }}
                    />
                    {invitationData.musicUrl.startsWith('http') && (
                      <p className="mt-1.5 text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Custom audio selected
                      </p>
                    )}
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
                onClick={handleUpdate}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-rose-500/10 flex items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                Commit Updates
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 text-white font-semibold text-xs flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Preview Panel */}
        <div className="lg:col-span-5 hidden lg:flex flex-col items-center justify-start sticky top-24 self-start">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Live Envelope Preview</span>
          </div>

          <div className="relative w-[320px] h-[640px] rounded-[38px] border-[10px] border-slate-800 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden flex flex-col">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-32 bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-950" />
            </div>

            <div className="flex-1 overflow-y-auto relative bg-slate-50 text-slate-900 scrollbar-none">
              <InvitationScreenContent
                invitation={{
                  id: id || 'preview',
                  rsvps: [],
                  ...invitationData
                }}
                isPreviewMode={true}
              />
            </div>
          </div>
        </div>

      </div>

      <button
        onClick={() => setMobilePreview(true)}
        className="fixed bottom-6 right-6 z-40 lg:hidden px-5 py-3 rounded-full bg-rose-500 text-white font-bold text-xs shadow-xl shadow-rose-500/20 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
      >
        <Eye className="w-4 h-4" />
        Preview Phone
      </button>

      {/* Mobile Preview Modal */}
      {isMobilePreviewOpen && (
        <div className="fixed inset-0 bg-slate-955/70 z-[99] lg:hidden flex items-center justify-center p-4">
          <div className="relative w-[340px] h-[660px] rounded-[40px] border-[10px] border-slate-800 shadow-2xl bg-white dark:bg-slate-950 overflow-hidden flex flex-col animate-scale-in">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4.5 w-32 bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center" />
            
            <button
              onClick={() => setMobilePreview(false)}
              className="absolute top-4 right-4 z-[60] bg-black/60 text-white rounded-full p-2 hover:bg-rose-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex-1 overflow-y-auto relative bg-slate-50 text-slate-900 scrollbar-none">
              <InvitationScreenContent
                invitation={{
                  id: id || 'preview',
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
