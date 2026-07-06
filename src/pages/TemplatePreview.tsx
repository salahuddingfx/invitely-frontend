import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTemplateStore } from '../store/templateStore';
import { mockInvitationSample } from '../mock/invitation';
import { InvitationScreenContent } from '../components/invitation/InvitationScreenContent';
import { ArrowLeft, Sparkles, Smartphone, Monitor } from 'lucide-react';

export const TemplatePreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTemplateById } = useTemplateStore();
  const template = id ? getTemplateById(id) : null;
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');

  if (!template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white space-y-4">
        <p className="text-lg">Template not found.</p>
        <Link to="/dashboard/templates" className="text-rose-500 hover:underline">
          Back to Gallery
        </Link>
      </div>
    );
  }

  // Create a mock invitation object based on the template's details
  const previewInvitation = {
    ...mockInvitationSample,
    templateId: template.id,
    themeColor: {
      primary: template.theme.primaryColor,
      secondary: template.theme.secondaryColor,
      background: template.theme.backgroundColor,
      text: template.theme.textColor
    },
    fontFamily: template.theme.fontFamily,
    title: `Preview: ${template.name}`
  };

  const handleUseTemplate = () => {
    navigate(`/dashboard/events/create?templateId=${template.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800 bg-slate-950 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/templates"
            className="p-2 rounded-lg hover:bg-slate-850 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-sm sm:text-base font-playfair">{template.name}</h1>
            <p className="text-[10px] text-slate-400 hidden sm:block">Theme preview sandbox</p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="hidden md:flex items-center border border-slate-800 bg-slate-900 p-1 rounded-xl">
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-2 rounded-lg transition-all ${
              deviceMode === 'mobile' ? 'bg-slate-800 text-rose-500' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile Preview"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-2 rounded-lg transition-all ${
              deviceMode === 'desktop' ? 'bg-slate-800 text-rose-500' : 'text-slate-400 hover:text-white'
            }`}
            title="Full Screen Preview"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>

        <div>
          <button
            onClick={handleUseTemplate}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-lg shadow-rose-500/20 flex items-center gap-1 hover:scale-105 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            Use Design
          </button>
        </div>
      </header>

      {/* Main Preview Container */}
      <div className="flex-grow flex items-center justify-center p-4 sm:p-8 bg-slate-950 overflow-y-auto">
        {deviceMode === 'mobile' ? (
          /* Realistic phone wrapper */
          <div className="relative mx-auto w-[360px] h-[720px] rounded-[40px] border-[12px] border-slate-800 shadow-2xl bg-white dark:bg-slate-950 overflow-hidden flex flex-col">
            {/* Camera notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-36 bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
            </div>
            
            {/* Screen Content */}
            <div className="flex-1 overflow-y-auto relative bg-slate-50 text-slate-900 scrollbar-none">
              <InvitationScreenContent invitation={previewInvitation} isPreviewMode={true} />
            </div>
          </div>
        ) : (
          /* Desktop layout sandbox */
          <div className="w-full max-w-5xl aspect-video bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-850 shadow-2xl flex flex-col">
            <div className="h-10 bg-slate-850 border-b border-slate-800 px-4 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="flex-1 overflow-y-auto relative bg-slate-50 text-slate-900">
              <InvitationScreenContent invitation={previewInvitation} isPreviewMode={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
