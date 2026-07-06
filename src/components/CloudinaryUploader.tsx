import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '../services/upload';

interface CloudinaryUploaderProps {
  accept?: string;
  onUploaded: (url: string) => void;
  label?: string;
  hint?: string;
  compact?: boolean;
  currentUrl?: string;
}

export const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({
  accept = 'image/*',
  onUploaded,
  label = 'Upload File',
  hint,
  compact = false,
  currentUrl
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [dragging, setDragging] = useState(false);

  const isImage = accept.includes('image');
  const isAudio = accept.includes('audio');

  const handleFile = async (file: File) => {
    if (!file) return;
    setError(null);
    setUploaded(false);
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onUploaded(url);
      setUploaded(true);
      setTimeout(() => setUploaded(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all select-none cursor-pointer ${
            uploading
              ? 'border-amber-300 text-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
              : uploaded
              ? 'border-emerald-400 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20'
              : error
              ? 'border-rose-400 text-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:border-rose-400 hover:text-rose-500'
          }`}
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : uploaded ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          {uploading ? 'Uploading...' : uploaded ? 'Uploaded!' : label}
        </motion.button>
        {error && <p className="text-[10px] text-rose-500 font-medium">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        animate={{ borderColor: dragging ? '#f43f5e' : uploading ? '#f59e0b' : uploaded ? '#10b981' : '#e2e8f0' }}
        className={`relative w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none overflow-hidden ${
          compact ? 'p-3' : 'p-5'
        } flex flex-col items-center justify-center gap-2 text-center ${
          dragging
            ? 'bg-rose-50/60 dark:bg-rose-950/15'
            : 'bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-100/60 dark:hover:bg-slate-900/30'
        }`}
      >
        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div key="loading" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
              <p className="text-xs font-semibold text-amber-600">Uploading to Cloudinary...</p>
            </motion.div>
          ) : uploaded ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <p className="text-xs font-semibold text-emerald-600">Uploaded successfully!</p>
              {currentUrl && isImage && (
                <img src={currentUrl} alt="uploaded" className="w-16 h-16 rounded-xl object-cover border border-emerald-200" />
              )}
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-1.5">
              <AlertCircle className="w-6 h-6 text-rose-500" />
              <p className="text-xs font-semibold text-rose-500">{error}</p>
              <p className="text-[10px] text-slate-400">Click to try again</p>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
              {isImage && currentUrl ? (
                <img src={currentUrl} alt="current" className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 mb-1" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-slate-400" />
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {isImage ? 'Click or drag to upload image' : isAudio ? 'Click or drag to upload audio' : 'Click or drag to upload'}
                </p>
                {hint && <p className="text-[10px] text-slate-400 mt-0.5">{hint}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
