import React, { useState, useRef } from 'react';
import { CatalogState, EditorUiTheme } from '../types/catalog';
import { EDITOR_UI_THEMES_INFO } from '../constants/presets';
import { soundEffects } from '../utils/soundEffects';
import {
  Download,
  Smartphone,
  Eye,
  Sparkles,
  UploadCloud,
  Volume2,
  VolumeX,
  Undo2,
  Redo2,
  History,
  FilePlus,
  FolderArchive,
  Code2,
  GripVertical,
  RotateCcw,
  Minimize2,
  Maximize2,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  state: CatalogState;
  editorTheme: EditorUiTheme;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  historyDescriptions: string[];
  historyIndex: number;
  onJumpHistory: (idx: number) => void;
  onOpenThemeModal: () => void;
  onOpenIconModal: () => void;
  onOpenUploadModal: () => void;
  onOpenDualPreview: () => void;
  onOpenFullscreen: () => void;
  onOpenArchiveModal: () => void;
  onOpenCodeModal: () => void;
  onNewCatalog: () => void;
  onDownloadHtml: () => void;
  onUpdateTitle: (title: string) => void;
  onSaveToMemory: () => void;
  lastSavedTime: number | null;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  editorTheme,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  historyDescriptions,
  historyIndex,
  onJumpHistory,
  onOpenThemeModal,
  onOpenIconModal,
  onOpenUploadModal,
  onOpenDualPreview,
  onOpenFullscreen,
  onOpenArchiveModal,
  onOpenCodeModal,
  onNewCatalog,
  onDownloadHtml,
  onUpdateTitle,
  onSaveToMemory,
  lastSavedTime,
}) => {
  const currentThemeInfo = EDITOR_UI_THEMES_INFO[editorTheme];
  const [soundActive, setSoundActive] = useState(soundEffects.enabled);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dragKey, setDragKey] = useState(0); // For resetting position

  const handleToggleSound = () => {
    const nextState = soundEffects.toggleSound();
    setSoundActive(nextState);
  };

  const handleSaveClick = () => {
    soundEffects.playChime();
    onSaveToMemory();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2200);
  };

  const resetPosition = () => {
    soundEffects.playPop();
    setDragKey((prev) => prev + 1);
  };

  const formatTime = (ts: number | null) => {
    if (!ts) return '';
    try {
      const d = new Date(ts);
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  return (
    <div className="relative w-full z-30 pointer-events-none select-none">
      {/* Draggable Floating Toolbar Container */}
      <motion.div
        key={dragKey}
        drag
        dragMomentum={false}
        dragElastic={0.08}
        className="pointer-events-auto mx-auto max-w-full inline-block"
        style={{ touchAction: 'none' }}
      >
        <div
          className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl md:rounded-3xl border border-slate-700/80 bg-slate-900/95 text-slate-100 shadow-2xl backdrop-blur-2xl transition-all duration-200 ring-1 ring-white/10 ${
            isMinimized ? 'px-3 py-2' : ''
          }`}
        >
          {/* Drag Handle with Tooltip */}
          <div
            className="flex items-center justify-center p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white cursor-grab active:cursor-grabbing transition-colors flex-none"
            title="منوی شناور را به هر کجای صفحه که می‌خواهید بکشید"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Brand Logo with Glow */}
          <motion.div
            whileHover={{ scale: 1.08, rotate: 6 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => soundEffects.playChime()}
            className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-rose-500 text-white flex items-center justify-center font-black text-xs shadow-md shadow-orange-500/35 ring-2 ring-white/20 cursor-pointer select-none flex-none"
            title="کاتالوگ‌ساز هوشمند RCG"
          >
            RCG
          </motion.div>

          {/* Editable Title */}
          <div className="relative flex items-center min-w-0">
            <input
              type="text"
              value={state.title}
              onChange={(e) => onUpdateTitle(e.target.value)}
              placeholder="عنوان کاتالوگ..."
              className="w-28 sm:w-40 md:w-52 px-2.5 py-1.5 rounded-xl border border-white/10 bg-black/30 font-bold text-xs text-white focus:outline-none focus:border-orange-500 transition-all truncate"
            />
          </div>

          {/* If Minimized: Show quick expand and save */}
          {isMinimized ? (
            <div className="flex items-center gap-1.5 mr-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveClick}
                className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 cursor-pointer"
                title="ذخیره در حافظه"
              >
                <Save className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMinimized(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 cursor-pointer"
                title="باز کردن نوار ابزار کامل"
              >
                <Maximize2 className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <>
              {/* Divider */}
              <div className="h-5 w-px bg-white/15 flex-none mx-0.5 hidden sm:block" />

              {/* SAVE TO MEMORY BUTTON (Prominent & Real-time) */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveClick}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition-all cursor-pointer shadow-sm flex-none ${
                  saveSuccess
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/30 ring-2 ring-emerald-400/50'
                    : 'bg-emerald-500/15 border-emerald-500/40 hover:bg-emerald-500/25 text-emerald-400 hover:text-emerald-300'
                }`}
                title="ذخیره پروژه در حافظه مرورگر برای بازخوانی در زمان دیگر"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 animate-bounce" />
                    <span>ذخیره شد ✓</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">ذخیره در حافظه</span>
                    {lastSavedTime && (
                      <span className="text-[10px] opacity-75 font-mono hidden md:inline">
                        ({formatTime(lastSavedTime)})
                      </span>
                    )}
                  </>
                )}
              </motion.button>

              {/* Undo / Redo & History Cluster */}
              <div className="flex items-center gap-0.5 flex-none bg-black/20 p-1 rounded-xl border border-white/10 relative">
                {/* Undo Button */}
                <motion.button
                  whileHover={canUndo ? { scale: 1.1 } : {}}
                  whileTap={canUndo ? { scale: 0.9 } : {}}
                  onClick={() => {
                    if (canUndo) {
                      soundEffects.playPop();
                      onUndo();
                    }
                  }}
                  disabled={!canUndo}
                  className="p-1.5 rounded-lg disabled:opacity-25 hover:bg-white/10 cursor-pointer text-slate-300 hover:text-white transition-all disabled:pointer-events-none"
                  title="برگشت به حرکت قبل (Ctrl + Z)"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </motion.button>

                {/* Redo Button */}
                <motion.button
                  whileHover={canRedo ? { scale: 1.1 } : {}}
                  whileTap={canRedo ? { scale: 0.9 } : {}}
                  onClick={() => {
                    if (canRedo) {
                      soundEffects.playPop();
                      onRedo();
                    }
                  }}
                  disabled={!canRedo}
                  className="p-1.5 rounded-lg disabled:opacity-25 hover:bg-white/10 cursor-pointer text-slate-300 hover:text-white transition-all disabled:pointer-events-none"
                  title="حرکت بعدی (Ctrl + Y)"
                >
                  <Redo2 className="w-3.5 h-3.5" />
                </motion.button>

                {/* History Dropdown Toggle */}
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    setShowHistoryDropdown(!showHistoryDropdown);
                  }}
                  className={`p-1.5 rounded-lg hover:bg-white/10 cursor-pointer text-xs flex items-center gap-1 transition-all ${
                    showHistoryDropdown
                      ? 'text-orange-400 bg-orange-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="تاریخچه ۱۰ حرکت اخیر"
                >
                  <History className="w-3.5 h-3.5" />
                  <span className="font-mono text-[10px] font-bold hidden sm:inline">
                    {historyIndex + 1}/{historyDescriptions.length}
                  </span>
                </button>

                {/* History Dropdown Popover */}
                <AnimatePresence>
                  {showHistoryDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowHistoryDropdown(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-11 right-0 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2.5 z-50 flex flex-col gap-1 text-right text-xs max-h-72 overflow-y-auto no-scrollbar"
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] font-bold text-orange-400">
                          <span>تاریخچه حرکات اخیر (Undo / Redo):</span>
                        </div>
                        {historyDescriptions.map((desc, idx) => {
                          const isCurrent = idx === historyIndex;
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                soundEffects.playPop();
                                onJumpHistory(idx);
                                setShowHistoryDropdown(false);
                              }}
                              className={`p-2 rounded-xl text-right transition-all flex items-center justify-between gap-2 cursor-pointer ${
                                isCurrent
                                  ? 'bg-orange-500 text-white font-bold shadow-sm'
                                  : 'hover:bg-slate-800 text-slate-300'
                              }`}
                            >
                              <span className="truncate">{desc}</span>
                              <span className="font-mono text-[10px] opacity-70">
                                #{idx + 1}
                              </span>
                            </button>
                          );
                        })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* New Blank Catalog Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  soundEffects.playAdd();
                  onNewCatalog();
                }}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold transition-all cursor-pointer shadow-sm flex-none"
                title="ساخت کاتالوگ جدید (ریست کردن صفحات پیش‌فرض و ایجاد کاتالوگ خام)"
              >
                <FilePlus className="w-3.5 h-3.5" />
                <span>کاتالوگ خام</span>
              </motion.button>

              {/* Archives Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  soundEffects.playPop();
                  onOpenArchiveModal();
                }}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-bold transition-all cursor-pointer shadow-sm flex-none"
                title="بایگانی کاتالوگ‌های ساخته شده"
              >
                <FolderArchive className="w-3.5 h-3.5" />
                <span>بایگانی</span>
              </motion.button>

              {/* Code & Embed Viewer Modal Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenCodeModal}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold transition-all cursor-pointer shadow-sm flex-none"
                title="مشاهده سورس کد HTML و JS و فایل قابل دانلود"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>کد و لینک</span>
              </motion.button>

              {/* Sound toggle button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleToggleSound}
                className={`p-1.5 rounded-xl border transition-all cursor-pointer flex-none ${
                  soundActive
                    ? 'border-orange-500/50 bg-orange-500/15 text-orange-400'
                    : 'border-white/10 text-slate-400 hover:text-slate-200'
                }`}
                title={
                  soundActive
                    ? 'صدای کلیک فعال است (کلیک برای قطع)'
                    : 'صدای کلیک غیرفعال است (کلیک برای فعال‌سازی)'
                }
              >
                {soundActive ? (
                  <Volume2 className="w-3.5 h-3.5" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
              </motion.button>

              {/* Download Standalone HTML Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.94 }}
                onClick={onDownloadHtml}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 text-white font-black text-xs shadow-md shadow-orange-500/30 cursor-pointer flex-none"
                title="دانلود فایل مستقل کاتالوگ (HTML)"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">دانلود HTML</span>
              </motion.button>

              {/* Reset Toolbar Position Button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={resetPosition}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer flex-none"
                title="بازنشانی موقعیت منوی شناور به مرکز"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </motion.button>

              {/* Minimize Toolbar Button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer flex-none"
                title="کوچک‌سازی منوی شناور"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
