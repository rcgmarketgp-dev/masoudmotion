import React from 'react';
import { ArchivedCatalog, CatalogState } from '../types/catalog';
import { soundEffects } from '../utils/soundEffects';
import { generateStandaloneCatalogHtml } from '../utils/htmlExporter';
import { motion, AnimatePresence } from 'motion/react';
import {
  FolderArchive,
  Plus,
  Trash2,
  Copy,
  Download,
  X,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  archives: ArchivedCatalog[];
  onLoadCatalog: (catalog: ArchivedCatalog) => void;
  onDeleteArchive: (id: string) => void;
  onDuplicateArchive: (catalog: ArchivedCatalog) => void;
  onSaveCurrentToArchive: () => void;
  onNewBlankCatalog: () => void;
  currentCatalogTitle: string;
}

export const ArchiveModal: React.FC<ArchiveModalProps> = ({
  isOpen,
  onClose,
  archives,
  onLoadCatalog,
  onDeleteArchive,
  onDuplicateArchive,
  onSaveCurrentToArchive,
  onNewBlankCatalog,
  currentCatalogTitle,
}) => {
  if (!isOpen) return null;

  const handleDownloadSingle = (catalogState: CatalogState) => {
    soundEffects.playChime();
    const htmlContent = generateStandaloneCatalogHtml(catalogState);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${catalogState.title || 'smart-catalog'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (timestamp: number) => {
    try {
      return new Intl.DateTimeFormat('fa-IR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(timestamp));
    } catch (e) {
      return new Date(timestamp).toLocaleDateString();
    }
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
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-5 md:p-6 text-slate-100 flex flex-col gap-5 z-10 text-right overflow-hidden max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shadow-md shadow-orange-500/20">
                <FolderArchive className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base md:text-lg text-white">
                    بایگانی و مدیریت کاتالوگ‌های ساخته شده
                  </h3>
                  <span className="text-[11px] bg-orange-500/20 text-orange-400 px-2.5 py-0.5 rounded-full font-bold">
                    {archives.length} کاتالوگ
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  فهرست پروژه‌ها، نسخه‌های پشتیبان و امکان ساخت کاتالوگ جدید خام
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

          {/* Top Quick Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 text-xs flex-none">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-bold">کاتالوگ فعال فعلی:</span>
              <span className="font-extrabold text-orange-400 truncate max-w-xs">
                {currentCatalogTitle}
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Save current to archive */}
              <button
                onClick={() => {
                  soundEffects.playChime();
                  onSaveCurrentToArchive();
                }}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                <FolderArchive className="w-4 h-4 text-orange-400" />
                <span>ذخیره نسخه فعلی در بایگانی</span>
              </button>

              {/* Create New Blank Catalog */}
              <button
                onClick={() => {
                  soundEffects.playAdd();
                  onNewBlankCatalog();
                }}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-orange-500/25 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>ساخت کاتالوگ جدید (خام)</span>
              </button>
            </div>
          </div>

          {/* Archives Grid */}
          <div className="flex-1 overflow-y-auto pr-1 no-scrollbar flex flex-col gap-3 min-h-[220px]">
            {archives.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center gap-3 text-slate-400">
                <FolderArchive className="w-12 h-12 opacity-30 text-orange-400" />
                <b className="text-sm font-bold text-slate-300">
                  هنوز کاتالوگی در بایگانی ثبت نشده است.
                </b>
                <p className="text-xs max-w-sm text-slate-500">
                  با کلیک روی «ذخیره نسخه فعلی در بایگانی» یا ایجاد کاتالوگ جدید، پروژه‌های شما در حافظه مرورگر بایگانی و نگهداری می‌شوند.
                </p>
              </div>
            ) : (
              archives.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-700/80 bg-slate-800/40 hover:bg-slate-800/80 hover:border-orange-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  {/* Left: Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-12 h-14 rounded-xl flex flex-col items-center justify-center text-white font-black text-xs shadow-md flex-none border border-white/10"
                      style={{
                        backgroundColor: item.state.c.bg,
                        color: item.state.c.fg,
                      }}
                    >
                      <Layers className="w-4 h-4 opacity-70 mb-0.5" />
                      <span className="font-mono text-[10px]">
                        {item.pagesCount}p
                      </span>
                    </div>

                    <div className="flex flex-col min-w-0 text-right">
                      <b className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                        {item.title}
                      </b>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>{item.pagesCount} صفحه</span>
                        <span>•</span>
                        <span>{formatDate(item.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto flex-wrap">
                    {/* Load */}
                    <button
                      onClick={() => {
                        soundEffects.playChime();
                        onLoadCatalog(item);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
                      title="بارگذاری و ویرایش این کاتالوگ"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>بارگذاری</span>
                    </button>

                    {/* Download HTML */}
                    <button
                      onClick={() => handleDownloadSingle(item.state)}
                      className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                      title="دانلود فایل مستقل HTML این کاتالوگ"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    {/* Duplicate */}
                    <button
                      onClick={() => {
                        soundEffects.playPop();
                        onDuplicateArchive(item);
                      }}
                      className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                      title="کپی و تکثیر این کاتالوگ"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (confirm(`آیا از حذف "${item.title}" از بایگانی اطمینان دارید؟`)) {
                          soundEffects.playPop();
                          onDeleteArchive(item.id);
                        }
                      }}
                      className="p-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs transition-colors cursor-pointer"
                      title="حذف از بایگانی"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Notice */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400 flex-none">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>تمام کاتالوگ‌ها در حافظه اختصاصی مرورگر شما ذخیره و محافظت می‌شوند.</span>
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
            >
              بستن
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
