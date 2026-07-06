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
  LayoutGrid
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
            return (
              <motion.div
                layout
                key={tpl.id}
                className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-350 flex flex-col justify-between"
              >
                {/* Photo Thumbnail with overlays */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-950">
                  <img
                    src={tpl.previewImage}
                    alt={tpl.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  
                  {/* Category chip left */}
                  <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md uppercase">
                    {categories.find((c) => c.id === tpl.categoryId)?.name || 'General'}
                  </span>

                  {/* Favorite and share top actions */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
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

                  {tpl.isPremium && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-md flex items-center gap-1">
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
                  
                  <div className="space-y-4 pt-3 border-t border-slate-150/40 dark:border-slate-850/60">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/events/create?templateId=${tpl.id}`)}
                        className="flex-1 py-2 px-3 text-center rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                      >
                        Use Style
                      </button>
                      <button
                        onClick={() => setPreviewTemplate(tpl)}
                        className="py-2 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold text-center cursor-pointer transition-all"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Fullscreen Interactive Template Preview Modal Overlay */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-2xl relative"
            >
              
              {/* Close Button top corner */}
              <button
                onClick={() => setPreviewTemplate(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:opacity-85 text-slate-700 dark:text-slate-200 cursor-pointer shadow-sm transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>

              {/* LEFT COLUMN: Embedded Interactive Invitation mockup screen */}
              <div className="w-full md:w-[48%] h-[50%] md:h-full bg-slate-950 p-4 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-150/40 dark:border-slate-800/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient from-rose-500/5 to-transparent pointer-events-none" />
                
                {/* Simulated mobile phone preview container */}
                <div className="w-[280px] h-[92%] rounded-[36px] border-8 border-slate-800 bg-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-b-xl z-50" />
                  
                  {/* Scrolling preview container */}
                  <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none relative pt-4">
                    <InvitationScreenContent 
                      invitation={mockPreviewInvitation(previewTemplate)} 
                      isPreviewMode={true} 
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Template details parameters and actions */}
              <div className="w-full md:w-[52%] h-[50%] md:h-full p-6 md:p-10 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-6">
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-100 dark:bg-rose-950/40 text-rose-600 text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded uppercase">
                        {categories.find((c) => c.id === previewTemplate.categoryId)?.name || 'General Design'}
                      </span>
                      {previewTemplate.isPremium && (
                        <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-600 text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded uppercase flex items-center gap-1">
                          <Sparkles className="w-3 h-3 fill-current" />
                          Premium
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold font-playfair text-slate-900 dark:text-white leading-tight">
                      {previewTemplate.name} Theme
                    </h2>
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    {previewTemplate.description}
                  </p>

                  {/* Fonts and theme swatch dots */}
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-850">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Design Swatch Details</span>
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full border border-slate-200/50 shadow-sm" style={{ backgroundColor: previewTemplate.theme.primaryColor }} title="Primary Theme Color" />
                        <div className="w-5 h-5 rounded-full border border-slate-200/50 shadow-sm" style={{ backgroundColor: previewTemplate.theme.backgroundColor }} title="Background Shade" />
                        <div className="w-5 h-5 rounded-full border border-slate-200/50 shadow-sm" style={{ backgroundColor: previewTemplate.theme.textColor }} title="Text Shade" />
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Font: <span className="font-bold uppercase tracking-wider text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-200">{previewTemplate.theme.fontFamily}</span>
                      </div>
                    </div>
                  </div>

                  {/* Styles tags preview chips */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Associated Style Tags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {getTemplateTags(previewTemplate).map((tag) => (
                        <span key={tag} className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Actions footer */}
                <div className="flex items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-850 mt-6">
                  <button
                    onClick={() => {
                      setPreviewTemplate(null);
                      navigate(`/dashboard/events/create?templateId=${previewTemplate.id}`);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Select & Customize
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => toggleFavorite(previewTemplate.id, e)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors"
                    title="Toggle Favorite"
                  >
                    <Star className={`w-4 h-4 ${favorites.includes(previewTemplate.id) ? 'fill-current text-rose-500' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => shareTemplate(previewTemplate.slug, e)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors"
                    title="Share Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
