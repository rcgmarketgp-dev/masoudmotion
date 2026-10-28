import React, { useState } from 'react';
import { CatalogBlock } from '../../types/catalog';
import { soundEffects } from '../../utils/soundEffects';
import { motion, AnimatePresence } from 'motion/react';
import {
  ZoomIn,
  ZoomOut,
  Trash2,
  Copy,
  Layers,
  ArrowUp,
  ArrowDown,
  X,
  CheckSquare,
  Sparkles,
  Maximize2,
  ChevronDown,
  AlignLeft,
  AlignCenterHorizontal,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  LayoutGrid,
} from 'lucide-react';

interface SelectionFloatingToolbarProps {
  selectedBlockIds: string[];
  blocks: CatalogBlock[];
  onResizeDelta: (delta: number) => void;
  onSetScale: (scale: number) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onChangeLayer: (action: 'front' | 'back' | 'forward' | 'backward') => void;
  onAlign?: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onDistribute?: (direction: 'horizontal' | 'vertical') => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export const SelectionFloatingToolbar: React.FC<SelectionFloatingToolbarProps> = ({
  selectedBlockIds,
  blocks,
  onResizeDelta,
  onSetScale,
  onDelete,
  onDuplicate,
  onChangeLayer,
  onAlign,
  onDistribute,
  onSelectAll,
  onClearSelection,
}) => {
  const [showScalePresets, setShowScalePresets] = useState(false);
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const count = selectedBlockIds.length;
  if (count === 0) return null;

  // Determine average or primary scale
  const selectedBlocks = blocks.filter((b) => selectedBlockIds.includes(b.id));
  const primaryBlock = selectedBlocks[0];
  const currentScale = primaryBlock?.scale ?? 1;
  const scalePercent = Math.round(currentScale * 100);

  const SCALE_PRESETS = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 flex flex-wrap items-center gap-1.5 p-2 rounded-2xl bg-slate-900/95 border border-orange-500/40 text-slate-100 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 select-none text-xs max-w-[95vw]"
      >
        {/* Count Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-500/20 text-orange-400 font-extrabold text-[11px] border border-orange-500/30">
          <Sparkles className="w-3.5 h-3.5 flex-none" />
          <span>
            {count === 1 ? '۱ عنصر انتخاب شده' : `${count} عنصر انتخابی (دسته‌جمعی)`}
          </span>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-white/20 mx-0.5 hidden sm:block" />

        {/* Resize Controls Cluster */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 relative">
          <button
            onClick={() => {
              soundEffects.playPop();
              onResizeDelta(-0.1);
            }}
            className="p-1.5 rounded-lg hover:bg-white/15 text-slate-200 hover:text-white transition-all cursor-pointer"
            title="کوچک‌تر کردن سایز (۱۰- درصد)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              soundEffects.playPop();
              setShowScalePresets(!showScalePresets);
            }}
            className="px-2 py-1 rounded-lg hover:bg-white/15 font-mono text-[11px] font-bold text-orange-400 flex items-center gap-1 cursor-pointer"
            title="انتخاب درصد مقیاس"
          >
            <span>{scalePercent}%</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          <button
            onClick={() => {
              soundEffects.playPop();
              onResizeDelta(0.1);
            }}
            className="p-1.5 rounded-lg hover:bg-white/15 text-slate-200 hover:text-white transition-all cursor-pointer"
            title="بزرگ‌تر کردن سایز (۱۰+ درصد)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Scale Presets Popover */}
          <AnimatePresence>
            {showScalePresets && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowScalePresets(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: -8 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute bottom-full left-0 mb-1 flex items-center gap-1 p-1.5 rounded-xl bg-slate-900 border border-slate-700 shadow-xl z-20 backdrop-blur-xl"
                >
                  {SCALE_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        soundEffects.playPop();
                        onSetScale(preset);
                        setShowScalePresets(false);
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all ${
                        Math.abs(currentScale - preset) < 0.05
                          ? 'bg-orange-500 text-white'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      {Math.round(preset * 100)}%
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Alignment & Distribution Cluster */}
        {onAlign && (
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 relative">
            <button
              onClick={() => {
                soundEffects.playPop();
                setShowAlignMenu(!showAlignMenu);
              }}
              className={`px-2 py-1 rounded-lg flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-all ${
                showAlignMenu
                  ? 'bg-orange-500 text-white'
                  : 'hover:bg-white/15 text-slate-200 hover:text-white'
              }`}
              title="ابزارهای تراز و توزیع خودکار فواصل"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">تراز و توزیع</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {/* Quick Horizontal Align Buttons on Desktop */}
            <div className="hidden xl:flex items-center gap-0.5 border-r border-white/15 pr-1 mr-0.5">
              <button
                onClick={() => {
                  soundEffects.playPop();
                  onAlign('right');
                }}
                className="p-1.5 rounded-lg hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="تراز راست"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  soundEffects.playPop();
                  onAlign('center');
                }}
                className="p-1.5 rounded-lg hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="تراز وسط افقی"
              >
                <AlignCenterHorizontal className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  soundEffects.playPop();
                  onAlign('left');
                }}
                className="p-1.5 rounded-lg hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="تراز چپ"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Alignment & Distribution Popover Menu */}
            <AnimatePresence>
              {showAlignMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowAlignMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: -10, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 p-3 rounded-2xl bg-slate-950/95 border border-slate-700 shadow-2xl z-30 backdrop-blur-2xl flex flex-col gap-2.5 w-64 text-right"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[11px] font-bold text-orange-400">
                      <span className="flex items-center gap-1.5">
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>تراز و توزیع خودکار</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {count} عنصر
                      </span>
                    </div>

                    {/* Horizontal Align */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 font-medium">
                        تراز افقی:
                      </span>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => {
                            soundEffects.playPop();
                            onAlign('right');
                            setShowAlignMenu(false);
                          }}
                          className="p-1.5 rounded-xl bg-white/5 hover:bg-orange-500 hover:text-white flex flex-col items-center gap-1 text-[10px] font-semibold transition-all cursor-pointer"
                          title="تراز راست"
                        >
                          <AlignRight className="w-4 h-4" />
                          <span>راست</span>
                        </button>
                        <button
                          onClick={() => {
                            soundEffects.playPop();
                            onAlign('center');
                            setShowAlignMenu(false);
                          }}
                          className="p-1.5 rounded-xl bg-white/5 hover:bg-orange-500 hover:text-white flex flex-col items-center gap-1 text-[10px] font-semibold transition-all cursor-pointer"
                          title="تراز وسط افقی"
                        >
                          <AlignCenterHorizontal className="w-4 h-4" />
                          <span>مرکز</span>
                        </button>
                        <button
                          onClick={() => {
                            soundEffects.playPop();
                            onAlign('left');
                            setShowAlignMenu(false);
                          }}
                          className="p-1.5 rounded-xl bg-white/5 hover:bg-orange-500 hover:text-white flex flex-col items-center gap-1 text-[10px] font-semibold transition-all cursor-pointer"
                          title="تراز چپ"
                        >
                          <AlignLeft className="w-4 h-4" />
                          <span>چپ</span>
                        </button>
                      </div>
                    </div>

                    {/* Vertical Align */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 font-medium">
                        تراز عمودی:
                      </span>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => {
                            soundEffects.playPop();
                            onAlign('top');
                            setShowAlignMenu(false);
                          }}
                          className="p-1.5 rounded-xl bg-white/5 hover:bg-orange-500 hover:text-white flex flex-col items-center gap-1 text-[10px] font-semibold transition-all cursor-pointer"
                          title="تراز بالا"
                        >
                          <AlignStartVertical className="w-4 h-4" />
                          <span>بالا</span>
                        </button>
                        <button
                          onClick={() => {
                            soundEffects.playPop();
                            onAlign('middle');
                            setShowAlignMenu(false);
                          }}
                          className="p-1.5 rounded-xl bg-white/5 hover:bg-orange-500 hover:text-white flex flex-col items-center gap-1 text-[10px] font-semibold transition-all cursor-pointer"
                          title="تراز وسط عمودی"
                        >
                          <AlignCenterVertical className="w-4 h-4" />
                          <span>وسط</span>
                        </button>
                        <button
                          onClick={() => {
                            soundEffects.playPop();
                            onAlign('bottom');
                            setShowAlignMenu(false);
                          }}
                          className="p-1.5 rounded-xl bg-white/5 hover:bg-orange-500 hover:text-white flex flex-col items-center gap-1 text-[10px] font-semibold transition-all cursor-pointer"
                          title="تراز پایین"
                        >
                          <AlignEndVertical className="w-4 h-4" />
                          <span>پایین</span>
                        </button>
                      </div>
                    </div>

                    {/* Distribute Evenly */}
                    {onDistribute && (
                      <div className="flex flex-col gap-1 pt-1 border-t border-white/10">
                        <span className="text-[10px] text-slate-400 font-medium">
                          توزیع یکنواخت فواصل:
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => {
                              soundEffects.playPop();
                              onDistribute('vertical');
                              setShowAlignMenu(false);
                            }}
                            className="p-1.5 rounded-xl bg-white/5 hover:bg-orange-500 hover:text-white flex items-center justify-center gap-1.5 text-[10px] font-semibold transition-all cursor-pointer"
                            title="توزیع مساوی فواصل در راستای عمودی"
                          >
                            <AlignVerticalDistributeCenter className="w-3.5 h-3.5 text-cyan-400" />
                            <span>توزیع عمودی</span>
                          </button>
                          <button
                            onClick={() => {
                              soundEffects.playPop();
                              onDistribute('horizontal');
                              setShowAlignMenu(false);
                            }}
                            className="p-1.5 rounded-xl bg-white/5 hover:bg-orange-500 hover:text-white flex items-center justify-center gap-1.5 text-[10px] font-semibold transition-all cursor-pointer"
                            title="توزیع مساوی فواصل در راستای افقی"
                          >
                            <AlignHorizontalDistributeCenter className="w-3.5 h-3.5 text-emerald-400" />
                            <span>توزیع افقی</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Layer Controls Cluster */}
        <div className="flex items-center gap-0.5 bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => {
              soundEffects.playPop();
              onChangeLayer('front');
            }}
            className="px-2 py-1 rounded-lg hover:bg-white/15 text-[11px] font-semibold text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1"
            title="آوردن به بالاترین لایه (روی همه عناصر)"
          >
            <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">روترین لایه</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playPop();
              onChangeLayer('back');
            }}
            className="px-2 py-1 rounded-lg hover:bg-white/15 text-[11px] font-semibold text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1"
            title="بردن به پایین‌ترین لایه (زیرین)"
          >
            <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">زیرین لایه</span>
          </button>
        </div>

        {/* Duplicate Button (if supported) */}
        {onDuplicate && count === 1 && (
          <button
            onClick={() => {
              soundEffects.playAdd();
              onDuplicate();
            }}
            className="p-1.5 rounded-xl hover:bg-white/15 text-slate-200 hover:text-white transition-all cursor-pointer hidden sm:flex"
            title="تکثیر این لایه"
          >
            <Copy className="w-4 h-4" />
          </button>
        )}

        {/* Select All on Page */}
        <button
          onClick={() => {
            soundEffects.playPop();
            onSelectAll();
          }}
          className="px-2 py-1 rounded-xl hover:bg-white/15 text-slate-300 hover:text-white text-[10px] font-bold transition-all cursor-pointer hidden lg:flex items-center gap-1"
          title="انتخاب تمام عناصر موجود در این صفحه"
        >
          <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
          <span>انتخاب همه</span>
        </button>

        {/* DELETE BUTTON (Single or Batch) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundEffects.playPop();
            onDelete();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs shadow-md shadow-red-500/30 transition-all cursor-pointer"
          title={count > 1 ? `حذف دسته‌جمعی (${count} مورد)` : 'حذف این عنصر'}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{count > 1 ? `حذف دسته‌جمعی (${count})` : 'حذف'}</span>
        </motion.button>

        {/* Clear Selection X */}
        <button
          onClick={() => {
            soundEffects.playPop();
            onClearSelection();
          }}
          className="p-1.5 rounded-xl hover:bg-white/15 text-slate-400 hover:text-white transition-all cursor-pointer ml-0.5"
          title="لغو انتخاب"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
