import React, { useState } from 'react';
import { CatalogState } from '../types/catalog';
import { generateStandaloneCatalogHtml } from '../utils/htmlExporter';
import { soundEffects } from '../utils/soundEffects';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code2,
  Copy,
  Check,
  Download,
  X,
  FileCode,
  Globe,
  Share2,
  Sparkles,
} from 'lucide-react';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: CatalogState;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  isOpen,
  onClose,
  state,
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'iframe' | 'json'>('html');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const htmlContent = generateStandaloneCatalogHtml(state);
  const jsonContent = JSON.stringify(state, null, 2);
  const iframeSnippet = `<!-- کد امبد کاتالوگ هوشمند در وبسایت و وردپرس -->
<iframe 
  src="${state.title || 'smart-catalog'}.html" 
  width="100%" 
  height="820px" 
  style="border:none;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.15);"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;"
  loading="lazy">
</iframe>`;

  const getCurrentText = () => {
    if (activeTab === 'html') return htmlContent;
    if (activeTab === 'iframe') return iframeSnippet;
    return jsonContent;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentText());
      soundEffects.playPop();
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      alert('خطا در کپی به کلیپ‌بورد.');
    }
  };

  const handleDownload = () => {
    soundEffects.playChime();
    const isJson = activeTab === 'json';
    const content = isJson ? jsonContent : htmlContent;
    const mime = isJson ? 'application/json' : 'text/html;charset=utf-8';
    const ext = isJson ? 'json' : 'html';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.title || 'smart-catalog'}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-5 md:p-6 text-slate-100 flex flex-col gap-4 z-10 text-right overflow-hidden max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shadow-md shadow-orange-500/20">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base md:text-lg text-white">
                    سورس کد HTML، جاوااسکریپت و فایل قابل دانلود کاتالوگ
                  </h3>
                  <span className="text-[11px] bg-orange-500/20 text-orange-400 px-2.5 py-0.5 rounded-full font-bold">
                    آماده انتشار
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  دریافت فایل اجرایی مستقل بدون وابستگی یا کپی کدهای امبد
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector & Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 flex-none">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-800/80 border border-slate-700/80 w-full sm:w-auto">
              <button
                onClick={() => {
                  soundEffects.playPop();
                  setActiveTab('html');
                }}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'html'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span>سورس کامل HTML & JS</span>
              </button>
              <button
                onClick={() => {
                  soundEffects.playPop();
                  setActiveTab('iframe');
                }}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'iframe'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>کد آی‌فریم و امبد</span>
              </button>
              <button
                onClick={() => {
                  soundEffects.playPop();
                  setActiveTab('json');
                }}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'json'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>دیتای JSON</span>
              </button>
            </div>

            {/* Copy & Download Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopy}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>کپی کد</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/25 transition-all cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>دانلود فایل ({activeTab === 'json' ? 'JSON' : 'HTML'})</span>
              </button>
            </div>
          </div>

          {/* Code Viewer Area */}
          <div className="flex-1 min-h-[300px] bg-slate-950 rounded-2xl border border-slate-800 p-4 overflow-hidden flex flex-col relative group">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400 font-mono flex-none" dir="ltr">
              <span>{activeTab === 'html' ? 'index.html (HTML5 + CSS3 + Vanilla JS)' : activeTab === 'iframe' ? 'embed-snippet.html' : 'project.json'}</span>
              <span>{getCurrentText().length.toLocaleString()} bytes</span>
            </div>
            <textarea
              readOnly
              value={getCurrentText()}
              className="w-full flex-1 bg-transparent text-emerald-400 font-mono text-xs leading-relaxed outline-none resize-none no-scrollbar"
              dir="ltr"
            />
          </div>

          {/* Footer note */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400 flex-none">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>فایل HTML خروجی کاملاً خودکفا بوده و حتی به صورت آفلاین بدون نیاز به اینترنت در تمامی مرورگرها اجرا می‌شود.</span>
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
            >
              بستن
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
