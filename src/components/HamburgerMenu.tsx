import React, { useState, useRef } from 'react';
import { CatalogState, EditorUiTheme, ProjectSnapshot } from '../types/catalog';
import { soundEffects } from '../utils/soundEffects';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  Save,
  Clock,
  RotateCcw,
  Download,
  Upload,
  FilePlus,
  FolderArchive,
  UploadCloud,
  Code2,
  Printer,
  Smartphone,
  Eye,
  Sparkles,
  Palette,
  Volume2,
  VolumeX,
  Keyboard,
  CheckCircle2,
  Layers,
  ChevronLeft,
  Trash2,
  FileJson,
} from 'lucide-react';

interface HamburgerMenuProps {
  state: CatalogState;
  editorTheme: EditorUiTheme;
  snapshots: ProjectSnapshot[];
  lastSavedTime: number | null;
  onSaveToMemory: () => void;
  onRestoreSnapshot: (snapshot: ProjectSnapshot) => void;
  onDeleteSnapshot: (id: string) => void;
  onExportProjectJson: () => void;
  onImportProjectJson: (file: File) => void;
  onNewCatalog: () => void;
  onOpenArchiveModal: () => void;
  onOpenUploadModal: () => void;
  onOpenCodeModal: () => void;
  onOpenDualPreview: () => void;
  onOpenFullscreen: () => void;
  onOpenIconModal: () => void;
  onOpenThemeModal: () => void;
  onPrint: () => void;
  onDownloadHtml: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  state,
  editorTheme,
  snapshots,
  lastSavedTime,
  onSaveToMemory,
  onRestoreSnapshot,
  onDeleteSnapshot,
  onExportProjectJson,
  onImportProjectJson,
  onNewCatalog,
  onOpenArchiveModal,
  onOpenUploadModal,
  onOpenCodeModal,
  onOpenDualPreview,
  onOpenFullscreen,
  onOpenIconModal,
  onOpenThemeModal,
  onPrint,
  onDownloadHtml,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [savedSuccessFeedback, setSavedSuccessFeedback] = useState(false);
  const [soundActive, setSoundActive] = useState(soundEffects.enabled);
  const [showSnapshotsList, setShowSnapshotsList] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleMenu = () => {
    soundEffects.playPop();
    setIsOpen(!isOpen);
  };

  const handleManualSave = () => {
    soundEffects.playChime();
    onSaveToMemory();
    setSavedSuccessFeedback(true);
    setTimeout(() => {
      setSavedSuccessFeedback(false);
    }, 2500);
  };

  const handleToggleSound = () => {
    const nextState = soundEffects.toggleSound();
    setSoundActive(nextState);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportProjectJson(file);
      e.target.value = '';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    try {
      return new Intl.DateTimeFormat('fa-IR', {
        dateStyle: 'short',
        timeStyle: 'medium',
      }).format(new Date(timestamp));
    } catch (e) {
      return new Date(timestamp).toLocaleTimeString();
    }
  };

  return (
    <>
      {/* Fixed Hamburger Trigger Button on Top-Right */}
      <div className="fixed top-3 right-3 sm:right-4 z-40 flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleMenu}
          aria-label="منوی اصلی و تنظیمات"
          className={`flex items-center justify-center w-11 h-11 rounded-2xl border shadow-xl backdrop-blur-xl transition-all cursor-pointer relative ${
            isOpen
              ? 'bg-orange-500 text-white border-orange-400 ring-4 ring-orange-500/25'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-100 border-slate-700/80 hover:border-orange-500/50 shadow-slate-950/60'
          }`}
          title="منوی اصلی و امکانات هوشمند"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col gap-1 items-center justify-center"
              >
                <div className="w-5 h-0.5 bg-current rounded-full" />
                <div className="w-3.5 h-0.5 bg-current rounded-full mr-1.5" />
                <div className="w-5 h-0.5 bg-current rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Green pulse dot indicating auto-save or active state */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-slate-900"></span>
          </span>
        </motion.button>
      </div>

      {/* Slide-out Drawer & Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden text-right">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
            />

            {/* Slide-out Menu Panel from Right */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[420px] max-w-full bg-slate-900/98 border-l border-slate-700/80 shadow-2xl backdrop-blur-2xl flex flex-col z-10 text-slate-100 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex-none">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-rose-500 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-orange-500/30 ring-2 ring-white/20 select-none">
                    RCG
                  </div>
                  <div>
                    <h2 className="font-black text-sm sm:text-base text-white flex items-center gap-2">
                      <span>منوی کاتالوگ‌ساز هوشمند</span>
                      <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-bold">
                        V2.4
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                      {state.title || 'کاتالوگ جدید'}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMenu}
                  className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-slate-700"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Scrollable Menu Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 no-scrollbar">
                {/* 1. Memory Storage & Resume Card (Key Feature) */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-850 border border-orange-500/30 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400" />

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                        <Save className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-white">
                          ذخیره‌سازی و بازیابی در حافظه
                        </h3>
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>ذخیره خودکار در مرورگر فعال است</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {lastSavedTime ? (
                        formatTimestamp(lastSavedTime)
                      ) : (
                        'آماده ذخیره'
                      )}
                    </span>
                  </div>

                  {/* Manual Save Now Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleManualSave}
                    className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                      savedSuccessFeedback
                        ? 'bg-emerald-600 text-white shadow-emerald-500/25 ring-2 ring-emerald-400'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/30 hover:opacity-95'
                    }`}
                  >
                    {savedSuccessFeedback ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>تغییرات با موفقیت در حافظه ذخیره شد!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>ذخیره تغییرات فعلی در حافظه</span>
                      </>
                    )}
                  </motion.button>

                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    با زدن این دکمه، تمام صفحات، لوگوها، عکس‌ها و متن‌ها در حافظه مرورگر پایدار می‌مانند تا بتوانید زمان دیگر دوباره پروژه را بازخوانی و ویرایش را ادامه دهید.
                  </p>

                  {/* Snapshots Toggle / Quick Restore */}
                  <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        soundEffects.playPop();
                        setShowSnapshotsList(!showSnapshotsList);
                      }}
                      className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>
                        نسخه‌های ذخیره شده در حافظه ({snapshots.length})
                      </span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* Export Project JSON */}
                      <button
                        onClick={() => {
                          soundEffects.playPop();
                          onExportProjectJson();
                        }}
                        className="p-1.5 rounded-lg bg-slate-700/70 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="دانلود فایل پشتیبان پروژه (JSON)"
                      >
                        <FileJson className="w-3.5 h-3.5" />
                      </button>

                      {/* Import Project JSON */}
                      <button
                        onClick={() => {
                          soundEffects.playPop();
                          fileInputRef.current?.click();
                        }}
                        className="p-1.5 rounded-lg bg-slate-700/70 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="بارگذاری و بازخوانی فایل پروژه (JSON)"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  {/* Snapshots Drawer Sub-list */}
                  <AnimatePresence>
                    {showSnapshotsList && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2.5 space-y-1.5 max-h-48 overflow-y-auto pr-1 no-scrollbar"
                      >
                        {snapshots.length === 0 ? (
                          <div className="p-2.5 rounded-xl bg-slate-900/60 text-center text-[11px] text-slate-400">
                            هنوز نسخه دستی ذخیره نشده است. با زدن دکمه ذخیره، اولین نسخه را ثبت کنید.
                          </div>
                        ) : (
                          snapshots.map((snap) => (
                            <div
                              key={snap.id}
                              className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between gap-2 text-xs"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-slate-200 truncate text-[11px]">
                                  {snap.title}
                                </div>
                                <div className="text-[10px] text-slate-400 flex items-center gap-2">
                                  <span>{formatTimestamp(snap.savedAt)}</span>
                                  <span>•</span>
                                  <span>{snap.pagesCount} صفحه</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 flex-none">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    soundEffects.playAdd();
                                    onRestoreSnapshot(snap);
                                    setIsOpen(false);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-white font-bold text-[10px] transition-all cursor-pointer"
                                  title="بازخوانی این نسخه و ادامه کار"
                                >
                                  بازخوانی
                                </motion.button>
                                <button
                                  onClick={() => {
                                    soundEffects.playPop();
                                    onDeleteSnapshot(snap.id);
                                  }}
                                  className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                                  title="حذف این نسخه"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2. Catalog Core Operations */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black text-slate-400 px-1">
                    عملیات پروژه کاتالوگ
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    {/* New Blank Catalog */}
                    <button
                      onClick={() => {
                        soundEffects.playAdd();
                        onNewCatalog();
                        setIsOpen(false);
                      }}
                      className="p-3 rounded-2xl bg-slate-800/70 hover:bg-amber-500/15 border border-slate-700/70 hover:border-amber-500/40 text-right transition-all group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <FilePlus className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-xs text-white group-hover:text-amber-400">
                        کاتالوگ جدید
                      </div>
                      <div className="text-[10px] text-slate-400">
                        ریست و ساخت صفحه خام
                      </div>
                    </button>

                    {/* Archives Modal */}
                    <button
                      onClick={() => {
                        soundEffects.playPop();
                        onOpenArchiveModal();
                        setIsOpen(false);
                      }}
                      className="p-3 rounded-2xl bg-slate-800/70 hover:bg-purple-500/15 border border-slate-700/70 hover:border-purple-500/40 text-right transition-all group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <FolderArchive className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-xs text-white group-hover:text-purple-400">
                        بایگانی کاتالوگ‌ها
                      </div>
                      <div className="text-[10px] text-slate-400">
                        مدیریت کاتالوگ‌های قبلی
                      </div>
                    </button>

                    {/* Upload Catalog PDF / Images */}
                    <button
                      onClick={() => {
                        soundEffects.playPop();
                        onOpenUploadModal();
                        setIsOpen(false);
                      }}
                      className="p-3 rounded-2xl bg-slate-800/70 hover:bg-emerald-500/15 border border-slate-700/70 hover:border-emerald-500/40 text-right transition-all group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-xs text-white group-hover:text-emerald-400">
                        آپلود PDF / تصاویر
                      </div>
                      <div className="text-[10px] text-slate-400">
                        وارد کردن فایل‌های آماده
                      </div>
                    </button>

                    {/* Vector Animated Icons Library */}
                    <button
                      onClick={() => {
                        soundEffects.playPop();
                        onOpenIconModal();
                        setIsOpen(false);
                      }}
                      className="p-3 rounded-2xl bg-slate-800/70 hover:bg-fuchsia-500/15 border border-slate-700/70 hover:border-fuchsia-500/40 text-right transition-all group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-xs text-white group-hover:text-fuchsia-400">
                        آیکون‌های متحرک
                      </div>
                      <div className="text-[10px] text-slate-400">
                        کتابخانه وکتورهای SVG
                      </div>
                    </button>
                  </div>
                </div>

                {/* 3. Export & Download Actions */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black text-slate-400 px-1">
                    خروجی و اشتراک‌گذاری
                  </span>

                  <div className="space-y-2">
                    {/* Standalone HTML Download */}
                    <button
                      onClick={() => {
                        soundEffects.playChime();
                        onDownloadHtml();
                      }}
                      className="w-full p-3 rounded-2xl bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-rose-500/15 hover:from-orange-500/25 hover:to-amber-500/25 border border-orange-500/40 flex items-center justify-between text-right transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/30">
                          <Download className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-black text-xs text-orange-400">
                            دانلود کاتالوگ مستقل (HTML)
                          </div>
                          <div className="text-[10px] text-slate-400">
                            فایل یکپارچه بدون نیاز به سرور و آفلاین
                          </div>
                        </div>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-orange-400" />
                    </button>

                    {/* View Source Code & Embed iFrame */}
                    <button
                      onClick={() => {
                        soundEffects.playPop();
                        onOpenCodeModal();
                        setIsOpen(false);
                      }}
                      className="w-full p-2.5 rounded-2xl bg-slate-800/70 hover:bg-cyan-500/15 border border-slate-700/70 hover:border-cyan-500/40 flex items-center justify-between text-right transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                          <Code2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white">
                            کد HTML، جاوااسکریپت و آی‌فریم
                          </div>
                          <div className="text-[10px] text-slate-400">
                            مشاهده سورس کد و کدهای جای‌گذاری در سایت
                          </div>
                        </div>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-slate-400" />
                    </button>

                    {/* Print / Export to PDF */}
                    <button
                      onClick={() => {
                        soundEffects.playPop();
                        onPrint();
                        setIsOpen(false);
                      }}
                      className="w-full p-2.5 rounded-2xl bg-slate-800/70 hover:bg-slate-750 border border-slate-700/70 flex items-center justify-between text-right transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-700 text-slate-300 flex items-center justify-center">
                          <Printer className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white">
                            چاپ یا ذخیره PDF مرورگر
                          </div>
                          <div className="text-[10px] text-slate-400">
                            پرینت با کیفیت استاندارد صفحات
                          </div>
                        </div>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* 4. Preview Modes & Studio Theme */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black text-slate-400 px-1">
                    نمایش و ظاهر استودیو
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Dual Device Preview */}
                    <button
                      onClick={() => {
                        soundEffects.playPop();
                        onOpenDualPreview();
                        setIsOpen(false);
                      }}
                      className="p-2.5 rounded-2xl bg-slate-800/70 hover:bg-blue-500/15 border border-slate-700/70 hover:border-blue-500/40 text-right transition-all cursor-pointer flex items-center gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center flex-none">
                        <Smartphone className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[11px] text-white truncate">
                          نمایش دوگانه
                        </div>
                        <div className="text-[9px] text-slate-400 truncate">
                          موبایل و دسکتاپ
                        </div>
                      </div>
                    </button>

                    {/* Fullscreen Presentation */}
                    <button
                      onClick={() => {
                        soundEffects.playPop();
                        onOpenFullscreen();
                        setIsOpen(false);
                      }}
                      className="p-2.5 rounded-2xl bg-slate-800/70 hover:bg-purple-500/15 border border-slate-700/70 hover:border-purple-500/40 text-right transition-all cursor-pointer flex items-center gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center flex-none">
                        <Eye className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[11px] text-white truncate">
                          پرزنتیشن مشتری
                        </div>
                        <div className="text-[9px] text-slate-400 truncate">
                          حالت تمام صفحه
                        </div>
                      </div>
                    </button>

                    {/* Theme Modal */}
                    <button
                      onClick={() => {
                        soundEffects.playPop();
                        onOpenThemeModal();
                        setIsOpen(false);
                      }}
                      className="p-2.5 rounded-2xl bg-slate-800/70 hover:bg-emerald-500/15 border border-slate-700/70 hover:border-emerald-500/40 text-right transition-all cursor-pointer flex items-center gap-2.5 col-span-2"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-none">
                        <Palette className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-[11px] text-white">
                          تغییر تم محیط ویرایشگر
                        </div>
                        <div className="text-[9px] text-slate-400">
                          انتخاب از بین دارک آبسیدین، مینیمال عاجی، نئو گلس و خلاق
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 5. Audio & Shortcuts Guide */}
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5">
                      {soundActive ? <Volume2 className="w-3.5 h-3.5 text-orange-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                      <span>افکت‌های صوتی لمسی</span>
                    </span>
                    <button
                      onClick={handleToggleSound}
                      className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                        soundActive
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {soundActive ? 'روشن 🔊' : 'خاموش 🔇'}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Keyboard className="w-3.5 h-3.5 text-slate-500" />
                      <span>کلیدهای میانبر:</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Ctrl + Z</span>
                      <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Ctrl + Y</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-500 flex-none">
                <span>کاتالوگ‌ساز هوشمند • RCG Studio</span>
                <span>توسعه و بازخوانی در مرورگر</span>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
