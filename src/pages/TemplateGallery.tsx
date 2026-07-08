import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplateStore } from '../store/templateStore';
import { useNotificationStore } from '../store/notificationStore';
import { InvitationScreenContent } from '../components/invitation/InvitationScreenContent';
import { Template, mockTemplates } from '../mock/templates';
import { Invitation } from '../mock/invitation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Filter,
  CheckCircle2,
  Search,
  Star,
  X,
  Share2,
  ChevronDown,
  LayoutGrid,
  Eye,
  Play
} from 'lucide-react';

// Dynamic tags resolver based on description details and template attributes
const getTemplateTags = (tpl: Template): string[] => {
  const tags: string[] = [];
  const text = (tpl.name + ' ' + tpl.description + ' ' + tpl.id).toLowerCase();
  
  if (tpl.isPremium) tags.push('premium');
  else tags.push('free');
  
  if (text.includes('gold') || text.includes('luxury') || text.includes('diamond') || text.includes('elite') || text.includes('royal')) {
    tags.push('luxury');
  }
  if (text.includes('minimal') || text.includes('clean') || text.includes('simple') || text.includes('vintage') || text.includes('classic')) {
    tags.push('minimal');
  }
  if (text.includes('flower') || text.includes('floral') || text.includes('rose') || text.includes('blossom') || text.includes('butterfly') || text.includes('garden')) {
    tags.push('floral');
  }
  if (text.includes('royal') || text.includes('gold') || text.includes('tassel') || text.includes('persian')) {
    tags.push('royal');
  }
  if (text.includes('nikkah') || text.includes('islamic') || text.includes('arabic') || text.includes('aqiqah')) {
    tags.push('islamic');
  }
  if (text.includes('modern') || text.includes('neon') || text.includes('disco') || text.includes('tech') || text.includes('gala') || text.includes('corporate')) {
    tags.push('modern');
  }
  
  if (tpl.isPremium || text.includes('royal') || text.includes('butterfly') || text.includes('nikkah')) {
    tags.push('trending');
  } else {
    tags.push('newest');
  }
  
  return tags;
};

// Generates dynamic sample mock metadata for previewing template look-and-feel live
const mockPreviewInvitation = (tpl: Template): Invitation => ({
  id: 'preview',
  title: tpl.name + ' Invitation',
  slug: 'preview-slug',
  templateId: tpl.id,
  categoryId: tpl.categoryId,
  status: 'published',
  locationMapsUrl: 'https://maps.google.com',
  rsvps: [],
  bride: {
    name: 'Sophia Bennett',
    parentGroomBride: 'Daughter of Robert Bennett',
    bio: 'A lover of art, nature, and classic literature.',
    avatar: '/avatar-placeholder.svg'
  },
  groom: {
    name: 'Alexander Sterling',
    parentGroomBride: 'Son of William Sterling',
    bio: 'Enthusiastic designer and travel enthusiast.',
    avatar: '/avatar-placeholder.svg'
  },
  eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
  eventTime: '06:00 PM',
  locationName: 'The Grand Sterling Estate',
  locationAddress: '742 Platinum Plaza, Manhattan, NY',
  musicUrl: 'romantic-acoustic-wedding-waltz',
  themeColor: {
    primary: tpl.theme.primaryColor,
    secondary: tpl.theme.secondaryColor,
    background: tpl.theme.backgroundColor,
    text: tpl.theme.textColor
  },
  fontFamily: tpl.theme.fontFamily,
  coverPhoto: '/placeholder-couple.svg',
  gallery: [
    '/placeholder-couple.svg',
    '/placeholder-couple.svg',
    '/placeholder-couple.svg'
  ]
});

export const TemplateGallery: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useNotificationStore();
  const { categories, selectedCategoryId, setSelectedCategoryId } = useTemplateStore();

  // Search, price and tag filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'trending'>('trending');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Favorites state persisted locally
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorite_templates');
    return saved ? JSON.parse(saved) : [];
  });

  // Modal expander state
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('favorite_templates', JSON.stringify(updated));
    addToast(favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites!', 'success');
  };

  const shareTemplate = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = `${window.location.origin}/template-preview/${slug}`;
    navigator.clipboard.writeText(link);
    addToast('Template preview link copied to clipboard!', 'info');
  };

  // Perform multi-dimensional filter criteria calculation
  const getFilteredList = () => {
    return mockTemplates.filter((tpl) => {
      // 1. Category check
      if (selectedCategoryId && tpl.categoryId !== selectedCategoryId) return false;

      // 2. Search check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = tpl.name.toLowerCase().includes(query);
        const matchesDesc = tpl.description.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }

      // 3. Price check
      if (priceFilter === 'free' && tpl.isPremium) return false;
      if (priceFilter === 'premium' && !tpl.isPremium) return false;

      // 4. Style check
      if (selectedStyle) {
        const tags = getTemplateTags(tpl);
        if (!tags.includes(selectedStyle)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'trending') {
        const tagsA = getTemplateTags(a);
        const tagsB = getTemplateTags(b);
        const isTrendA = tagsA.includes('trending') ? 1 : 0;
        const isTrendB = tagsB.includes('trending') ? 1 : 0;
        return isTrendB - isTrendA;
      }
      return 0; // Default order
    });
  };

  const filteredTemplates = getFilteredList();

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto px-4 md:px-8 py-6 select-none relative">
      
      {/* Search and collapse filters toggler */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search premium invitation designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`px-4 py-2.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isFilterPanelOpen || selectedStyle || priceFilter !== 'all'
                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {(selectedStyle || priceFilter !== 'all') && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </button>

          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="trending">Sort: Trending</option>
            <option value="newest">Sort: Newest</option>
          </select>
        </div>
      </div>

      {/* Advanced filters sliding panel */}
      <AnimatePresence>
        {isFilterPanelOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-2xl p-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Style Tags selection */}
              <div className="space-y-2">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Layout Style Type</span>
                <div className="flex flex-wrap gap-1.5">
                  {['luxury', 'minimal', 'floral', 'royal', 'islamic', 'modern'].map((style) => {
                    const isSelected = selectedStyle === style;
                    return (
                      <button
                        key={style}
                        onClick={() => setSelectedStyle(isSelected ? null : style)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-655'
                        }`}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Type Filters */}
              <div className="space-y-2">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Access Pricing</span>
                <div className="flex gap-2">
                  {(['all', 'free', 'premium'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPriceFilter(mode)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        priceFilter === mode
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 border-transparent shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600'
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset trigger button */}
              <div className="flex items-end justify-start sm:justify-end">
                <button
                  onClick={() => {
                    setPriceFilter('all');
                    setSelectedStyle(null);
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-rose-500 hover:text-rose-600 cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Selection Tab Scrollbar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-nowrap border-b border-slate-100 dark:border-slate-850">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategoryId === null
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-md'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-850'
          }`}
        >
          All Designs
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategoryId === cat.id
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/10'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Templates dynamic grid layout */}
      {filteredTemplates.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <LayoutGrid className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-base text-slate-700 dark:text-slate-300">No matching templates found</h4>
          <p className="text-slate-400 text-xs max-w-xs mx-auto">Try resetting active filters or choosing another category.</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredTemplates.map((tpl) => {
            const isFav = favorites.includes(tpl.id);
            const isHovered = hoveredTemplate === tpl.id;
            return (
              <motion.div
                layout
                key={tpl.id}
                onMouseEnter={() => setHoveredTemplate(tpl.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                onClick={() => setPreviewTemplate(tpl)}
                className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-350 flex flex-col justify-between cursor-pointer"
              >
                {/* Photo Thumbnail with overlays */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-950">
                  {/* Static preview image */}
                  <img
                    src={tpl.previewImage}
                    alt={tpl.name}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      isHovered ? 'scale-110 brightness-75' : 'group-hover:scale-[1.03]'
                    }`}
                  />
                  
                  {/* Hover overlay - "Click to Preview" */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10"
                      >
                        <motion.div
                          initial={{ scale: 0.8, y: 10 }}
                          animate={{ scale: 1, y: 0 }}
                          transition={{ delay: 0.05, type: 'spring', stiffness: 300 }}
                          className="flex flex-col items-center gap-2"
                        >
                          <div className="w-14 h-14 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center shadow-xl">
                            <Eye className="w-7 h-7 text-rose-500" />
                          </div>
                          <span className="text-white text-xs font-bold drop-shadow-lg">Click to Preview</span>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Category chip left */}
                  <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md uppercase z-20">
                    {categories.find((c) => c.id === tpl.categoryId)?.name || 'General'}
                  </span>

                  {/* Favorite and share top actions */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                    <button
                      onClick={(e) => toggleFavorite(tpl.id, e)}
                      className={`p-2 rounded-full backdrop-blur-md border shadow-sm transition-all cursor-pointer ${
                        isFav 
                          ? 'bg-rose-50 border-rose-200 text-rose-500' 
                          : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/40 text-slate-500 hover:text-rose-500'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                    
                    <button
                      onClick={(e) => shareTemplate(tpl.slug, e)}
                      className="p-2 rounded-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/40 text-slate-500 hover:text-rose-500 shadow-sm transition-all cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {tpl.isVip ? (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-md flex items-center gap-1 z-20">
                      <span className="text-[10px]">💎</span>
                      VIP
                    </span>
                  ) : tpl.isPremium && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-md flex items-center gap-1 z-20">
                      <Sparkles className="w-3 h-3 fill-current animate-pulse" />
                      Premium
                    </span>
                  )}
                </div>

                {/* Details and selectors */}
                <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold font-playfair mb-1">{tpl.name}</h4>
                    <p className="text-slate-450 text-[11px] leading-relaxed line-clamp-2">
                      {tpl.description}
                    </p>
                  </div>
                  
                  <div className="space-y-3 pt-3 border-t border-slate-150/40 dark:border-slate-850/60">
                    {/* Live Preview Button (PRIMARY) */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreviewTemplate(tpl); }}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg hover:scale-[1.01]"
                    >
                      <Eye className="w-4 h-4" />
                      Live Preview
                    </button>
                    {/* Use Template Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/events/create?templateId=${tpl.id}`); }}
                      className="w-full py-2 px-3 text-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                    >
                      Use This Template →
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Fullscreen Interactive Template Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-lg flex items-end md:items-center justify-center"
          >
            {/* Mobile: full-screen sheet | Desktop: centered modal */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-white dark:bg-slate-900 w-full h-[95vh] md:h-[88vh] md:max-w-6xl md:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl flex flex-col relative"
            >
              
              {/* MOBILE HEADER - visible only on small screens */}
              <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/40 text-rose-600 uppercase shrink-0">
                    {categories.find((c) => c.id === previewTemplate.categoryId)?.name || 'General'}
                  </span>
                  <h3 className="text-sm font-bold font-playfair text-slate-900 dark:text-white truncate">{previewTemplate.name}</h3>
                </div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* DESKTOP HEADER - visible only on md+ */}
              <div className="hidden md:flex items-center justify-between px-8 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold tracking-widest px-3 py-1 rounded bg-rose-100 dark:bg-rose-950/40 text-rose-600 uppercase">
                    {categories.find((c) => c.id === previewTemplate.categoryId)?.name || 'General'}
                  </span>
                  {previewTemplate.isPremium && (
                    <span className="text-[10px] font-bold tracking-widest px-3 py-1 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-600 uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-current" /> Premium
                    </span>
                  )}
                  <h2 className="text-lg font-bold font-playfair text-slate-900 dark:text-white">{previewTemplate.name} Theme</h2>
                </div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:opacity-80 cursor-pointer transition-opacity"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* MAIN CONTENT - responsive layout */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                
                {/* LEFT: Phone Preview */}
                <div className="w-full md:w-[42%] lg:w-[40%] bg-gradient-to-br from-slate-900 via-slate-950 to-black flex items-center justify-center shrink-0
                  h-[45%] md:h-full border-b md:border-b-0 md:border-r border-slate-700/50 relative overflow-hidden">
                  {/* Subtle radial glow */}
                  <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at 50% 30%, ${previewTemplate.theme.primaryColor}15, transparent 70%)` }} />
                  
                  {/* Phone frame - responsive sizing */}
                  <div className="relative w-[min(260px,70vw)] md:w-[280px] lg:w-[300px] h-[90%] max-h-[600px] rounded-[36px] border-[6px] md:border-8 border-slate-800 bg-white dark:bg-slate-50 shadow-2xl overflow-hidden flex flex-col">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-28 h-4 md:h-5 bg-slate-800 rounded-b-2xl z-50" />
                    
                    {/* Scrollable invitation content */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none pt-3">
                      <InvitationScreenContent 
                        invitation={mockPreviewInvitation(previewTemplate)} 
                        isPreviewMode={true} 
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT: Details Panel */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Scrollable details */}
                  <div className="flex-1 overflow-y-auto px-5 md:px-8 lg:px-10 py-5 md:py-8 space-y-5">
                    
                    {/* Description */}
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                      {previewTemplate.description}
                    </p>

                    {/* Color Palette */}
                    <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Color Palette</span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {[
                            { color: previewTemplate.theme.primaryColor, label: 'Primary' },
                            { color: previewTemplate.theme.backgroundColor, label: 'Background' },
                            { color: previewTemplate.theme.textColor, label: 'Text' },
                          ].map((item) => (
                            <div key={item.label} className="flex flex-col items-center gap-1">
                              <div 
                                className="w-8 h-8 md:w-9 md:h-9 rounded-xl border-2 border-slate-200/60 dark:border-slate-700 shadow-sm" 
                                style={{ backgroundColor: item.color }} 
                                title={item.label}
                              />
                              <span className="text-[8px] md:text-[9px] text-slate-400 font-medium">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Font */}
                    <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Typography</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs md:text-sm font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                          {previewTemplate.theme.fontFamily}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Style Tags</span>
                      <div className="flex flex-wrap gap-1.5">
                        {getTemplateTags(previewTemplate).map((tag) => (
                          <span key={tag} className="text-[9px] md:text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sticky bottom actions */}
                  <div className="shrink-0 px-5 md:px-8 lg:px-10 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => {
                          setPreviewTemplate(null);
                          navigate(`/dashboard/events/create?templateId=${previewTemplate.id}`);
                        }}
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs md:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg"
                      >
                        Select & Customize
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => toggleFavorite(previewTemplate.id, e)}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors shrink-0"
                        title="Toggle Favorite"
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(previewTemplate.id) ? 'fill-current text-rose-500' : ''}`} />
                      </button>

                      <button
                        onClick={(e) => shareTemplate(previewTemplate.slug, e)}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors shrink-0"
                        title="Share Link"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
