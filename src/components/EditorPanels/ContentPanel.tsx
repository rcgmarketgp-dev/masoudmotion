import React, { useRef, useState } from 'react';
import {
  BlockType,
  CatalogBlock,
  CatalogState,
  HeadingBlock,
  TextBlock,
  ImageBlock,
  ProductCardBlock,
  ButtonBlock,
  ListBlock,
  BoxBlock,
  IconBlock,
  LogoBlock,
} from '../../types/catalog';
import { createBlock, SAMPLE_IMAGES } from '../../constants/presets';
import { AnimatedToolDock } from '../AnimatedToolDock';
import { processCatalogMediaFile } from '../../utils/fileUploadHelper';
import { soundEffects } from '../../utils/soundEffects';
import {
  Upload,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MousePointer,
  Layers,
  FileCheck,
  CheckSquare,
  Square,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  X,
} from 'lucide-react';

interface ContentPanelProps {
  state: CatalogState;
  currentPageIndex: number;
  selectedBlockId?: string;
  selectedBlockIds?: string[];
  onSelectBlock: (blockId: string, isMulti?: boolean) => void;
  onUpdateState: (updater: (prev: CatalogState) => CatalogState) => void;
  onOpenIconModal?: () => void;
  onPageChange?: (index: number) => void;
  onSelectAllBlocks?: () => void;
  onClearSelection?: () => void;
  onBatchDelete?: () => void;
  onBatchResizeDelta?: (delta: number) => void;
  onBatchSetScale?: (scale: number) => void;
  onBatchChangeLayer?: (action: 'front' | 'back' | 'forward' | 'backward') => void;
  onBatchSetWidth?: (width: number) => void;
}

export const ContentPanel: React.FC<ContentPanelProps> = ({
  state,
  currentPageIndex,
  selectedBlockId,
  selectedBlockIds = [],
  onSelectBlock,
  onUpdateState,
  onOpenIconModal,
  onPageChange,
  onSelectAllBlocks,
  onClearSelection,
  onBatchDelete,
  onBatchResizeDelta,
  onBatchSetScale,
  onBatchChangeLayer,
  onBatchSetWidth,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const prodImgInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);

  const currentPage = state.pg[currentPageIndex] || state.pg[0];
  const effectiveSelectedIds =
    selectedBlockIds && selectedBlockIds.length > 0
      ? selectedBlockIds
      : selectedBlockId
      ? [selectedBlockId]
      : [];
  const selectedCount = effectiveSelectedIds.length;
  const primarySelectedBlock = currentPage.bl.find((b) => effectiveSelectedIds.includes(b.id));
  const primaryScale = primarySelectedBlock?.scale ?? 1;
  const currentScalePercent = Math.round(primaryScale * 100);
  const selectedBlock =
    currentPage.bl.find((b) => b.id === selectedBlockId) || primarySelectedBlock;

  const handleAddBlock = (type: BlockType) => {
    const newBlock = createBlock(type);
    onUpdateState((prev) => {
      const nextPages = [...prev.pg];
      nextPages[currentPageIndex] = {
        ...nextPages[currentPageIndex],
        bl: [...nextPages[currentPageIndex].bl, newBlock],
      };
      return { ...prev, pg: nextPages };
    });
    onSelectBlock(newBlock.id);
  };

  const handleUpdateBlock = (blockId: string, updates: Partial<CatalogBlock>) => {
    onUpdateState((prev) => {
      const nextPages = [...prev.pg];
      const curBl = nextPages[currentPageIndex].bl.map((b) =>
        b.id === blockId ? ({ ...b, ...updates } as CatalogBlock) : b
      );
      nextPages[currentPageIndex] = {
        ...nextPages[currentPageIndex],
        bl: curBl,
      };
      return { ...prev, pg: nextPages };
    });
  };

  const handleDeleteBlock = (blockId: string) => {
    soundEffects.playPop();
    onUpdateState((prev) => {
      const nextPages = [...prev.pg];
      nextPages[currentPageIndex] = {
        ...nextPages[currentPageIndex],
        bl: nextPages[currentPageIndex].bl.filter((b) => b.id !== blockId),
      };
      return { ...prev, pg: nextPages };
    });
  };

  const handleDuplicateBlock = (blockId: string) => {
    soundEffects.playPop();
    const idx = currentPage.bl.findIndex((b) => b.id === blockId);
    if (idx === -1) return;
    const blockToDup = currentPage.bl[idx];
    const duplicated: CatalogBlock = {
      ...JSON.parse(JSON.stringify(blockToDup)),
      id: 'b_' + Math.random().toString(36).substring(2, 9),
    };
    onUpdateState((prev) => {
      const nextPages = [...prev.pg];
      const nextBl = [...nextPages[currentPageIndex].bl];
      nextBl.splice(idx + 1, 0, duplicated);
      nextPages[currentPageIndex] = {
        ...nextPages[currentPageIndex],
        bl: nextBl,
      };
      return { ...prev, pg: nextPages };
    });
    onSelectBlock(duplicated.id);
  };

  const handleMoveBlock = (blockId: string, delta: number) => {
    const idx = currentPage.bl.findIndex((b) => b.id === blockId);
    if (idx === -1) return;
    const targetIdx = idx + delta;
    if (targetIdx < 0 || targetIdx >= currentPage.bl.length) return;
    onUpdateState((prev) => {
      const nextPages = [...prev.pg];
      const nextBl = [...nextPages[currentPageIndex].bl];
      const temp = nextBl[idx];
      nextBl[idx] = nextBl[targetIdx];
      nextBl[targetIdx] = temp;
      nextPages[currentPageIndex] = {
        ...nextPages[currentPageIndex],
        bl: nextBl,
      };
      return { ...prev, pg: nextPages };
    });
  };

  // Multi-format file uploader (PDF, PNG, JPG, JPEG, WEBP, SVG)
  const handleUniversalMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    blockId: string,
    field: 'src' | 'customSrc'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessingMedia(true);
    try {
      const { dataUrl } = await processCatalogMediaFile(file, 1200);
      handleUpdateBlock(blockId, { [field]: dataUrl });
      soundEffects.playChime();
    } catch (err) {
      console.error(err);
      alert('خطا در بارگذاری فایل. لطفاً فرمت PNG، JPG یا PDF معتبر انتخاب کنید.');
    } finally {
      setIsProcessingMedia(false);
      e.target.value = '';
    }
  };

  // Apply logo or image to ALL pages of the catalog
  const handleApplyMediaToAllPages = (mediaUrl: string, type: 'logo' | 'img') => {
    if (!mediaUrl) return;
    soundEffects.playChime();
    onUpdateState((prev) => {
      // 1. If it's a logo, enable global branding for all pages
      if (type === 'logo') {
        return {
          ...prev,
          branding: {
            ...prev.branding,
            logoUrl: mediaUrl,
            logoEnabled: true,
            logoPosition: prev.branding?.logoPosition || 'top-right',
            logoWidth: prev.branding?.logoWidth || 120,
            logoOpacity: prev.branding?.logoOpacity || 1,
          },
        };
      }

      // 2. If it's an image block, duplicate this block to all pages (if not already there)
      const nextPages = prev.pg.map((page, idx) => {
        if (idx === currentPageIndex) return page;
        const newBlock: ImageBlock = {
          id: 'b_' + Math.random().toString(36).substring(2, 9),
          t: 'img',
          src: mediaUrl,
          ht: 180,
          fit: 'cover',
          caption: 'تصویر سراسری کاتالوگ',
        };
        return {
          ...page,
          bl: [newBlock, ...page.bl],
        };
      });

      return {
        ...prev,
        pg: nextPages,
      };
    });
    alert(
      type === 'logo'
        ? 'این لوگو با موفقیت به سربرگ تمامی صفحات کاتالوگ اضافه شد.'
        : 'این تصویر به سربرگ تمامی صفحات کاتالوگ اضافه شد.'
    );
  };

  return (
    <div className="flex flex-col gap-6 p-4 text-right">
      {/* Page Layout Mode Switcher */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/15 text-xs shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <Move className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-right">
            <span className="font-bold text-xs">حالت چیدمان این صفحه:</span>
            <span className="text-[10px] opacity-65">
              {currentPage.layoutMode === 'free'
                ? 'آزاد و شناور ۲ بعدی (جابجایی دستی با ماوس)'
                : 'ستونی و روان (استاندارد کاتالوگ)'}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            soundEffects.playPop();
            const cur = currentPage.layoutMode || 'flow';
            const next = cur === 'flow' ? 'free' : 'flow';
            onUpdateState((prev) => {
              const nextP = [...prev.pg];
              nextP[currentPageIndex] = { ...nextP[currentPageIndex], layoutMode: next };
              return { ...prev, pg: nextP };
            });
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            currentPage.layoutMode === 'free'
              ? 'border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'border-current/20 bg-black/5 dark:bg-white/5 hover:border-orange-400'
          }`}
        >
          {currentPage.layoutMode === 'free' ? 'حالت آزاد (فعال)' : 'تغییر به آزاد'}
        </button>
      </div>

      {/* 1. Add New Blocks Palette with Animated Colorful Tool Buttons */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-orange-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>ابزارهای ساخت و عناصر کاتالوگ</span>
          </span>
          <span className="text-[10px] opacity-60">کلیک برای افزودن</span>
        </div>
        <AnimatedToolDock onAddBlock={handleAddBlock} onOpenIconModal={onOpenIconModal} />
      </section>

      {/* 2. Batch / Multi-selection & Layer & Resize Controller */}
      {selectedCount > 0 && (
        <section className="flex flex-col gap-3.5 p-4 rounded-2xl border-2 border-orange-500/60 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-slate-900/40 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-current/15 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse shadow-sm" />
              <b className="text-xs font-black text-orange-400">
                {selectedCount === 1
                  ? 'مدیریت لایه و اندازه (۱ عنصر انتخاب شده)'
                  : `مدیریت دسته‌جمعی (${selectedCount} عنصر انتخاب شده)`}
              </b>
            </div>

            <div className="flex items-center gap-1.5 text-[10px]">
              {onSelectAllBlocks && (
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    onSelectAllBlocks();
                  }}
                  className="px-2 py-1 rounded-lg bg-black/15 dark:bg-white/10 hover:bg-orange-500 hover:text-white font-bold transition-all cursor-pointer"
                  title="انتخاب همه عناصر این صفحه"
                >
                  انتخاب همه
                </button>
              )}
              {onClearSelection && (
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    onClearSelection();
                  }}
                  className="p-1 rounded-lg hover:bg-black/15 dark:hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                  title="لغو انتخاب"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Resize Controls (تغییر سایز دسته‌جمعی یا تکی) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-slate-300">
                <ZoomIn className="w-3.5 h-3.5 text-orange-400" />
                <span>تغییر سایز و مقیاس (تکی و دسته‌جمعی):</span>
              </span>
              <span className="font-mono text-xs font-bold text-orange-400">
                {currentScalePercent}%
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  soundEffects.playPop();
                  onBatchResizeDelta && onBatchResizeDelta(-0.1);
                }}
                className="flex-1 py-1.5 rounded-xl border border-current/15 bg-black/10 dark:bg-white/10 hover:bg-orange-500/20 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
                title="کوچک‌تر کردن ۱۰٪"
              >
                <ZoomOut className="w-3.5 h-3.5" />
                <span>کوچک‌تر (-10%)</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playPop();
                  onBatchResizeDelta && onBatchResizeDelta(0.1);
                }}
                className="flex-1 py-1.5 rounded-xl border border-current/15 bg-black/10 dark:bg-white/10 hover:bg-orange-500/20 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
                title="بزرگ‌تر کردن ۱۰٪"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>بزرگ‌تر (+10%)</span>
              </button>
            </div>

            {/* Scale Presets */}
            <div className="grid grid-cols-5 gap-1 pt-1">
              {[0.5, 0.75, 1, 1.25, 1.5].map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    soundEffects.playPop();
                    onBatchSetScale && onBatchSetScale(preset);
                  }}
                  className={`py-1 rounded-lg border text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    Math.abs(primaryScale - preset) < 0.05
                      ? 'border-orange-500 bg-orange-500 text-white shadow-sm'
                      : 'border-current/15 bg-black/5 dark:bg-white/5 hover:border-orange-500/40'
                  }`}
                >
                  {Math.round(preset * 100)}%
                </button>
              ))}
            </div>

            {/* Scale Slider */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] opacity-60">۴۰٪</span>
              <input
                type="range"
                min="0.4"
                max="2.5"
                step="0.05"
                value={primaryScale}
                onChange={(e) => {
                  onBatchSetScale && onBatchSetScale(parseFloat(e.target.value));
                }}
                className="flex-1 accent-orange-500 cursor-pointer"
              />
              <span className="text-[10px] opacity-60">۲۵۰٪</span>
            </div>

            {/* Width Presets (۲۵٪، ۵۰٪، ۷۵٪، ۱۰۰٪) */}
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="font-bold opacity-75">تنظیم عرض روی بوم:</span>
              <div className="flex items-center gap-1">
                {[25, 50, 75, 100].map((w) => (
                  <button
                    key={w}
                    onClick={() => {
                      soundEffects.playPop();
                      onBatchSetWidth && onBatchSetWidth(w);
                    }}
                    className="px-2 py-0.5 rounded-lg border border-current/15 bg-black/10 dark:bg-white/10 hover:bg-orange-500 hover:text-white font-mono text-[10px] font-bold transition-all cursor-pointer"
                  >
                    {w}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Layer Controls (مدیریت لایه‌ها و تک لایه) */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-current/15 text-xs">
            <span className="font-bold flex items-center gap-1.5 text-slate-300">
              <Layers className="w-3.5 h-3.5 text-orange-400" />
              <span>ترتیب لایه (تک لایه یا دسته‌جمعی):</span>
            </span>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  soundEffects.playPop();
                  onBatchChangeLayer && onBatchChangeLayer('front');
                }}
                className="py-1.5 px-2 rounded-xl border border-current/15 bg-black/10 dark:bg-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/40 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                title="آوردن به روترین لایه (بالاترین سطح)"
              >
                <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>انتقال به روترین لایه</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playPop();
                  onBatchChangeLayer && onBatchChangeLayer('back');
                }}
                className="py-1.5 px-2 rounded-xl border border-current/15 bg-black/10 dark:bg-white/10 hover:bg-amber-500/20 hover:border-amber-500/40 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                title="بردن به زیرترین لایه (پایین‌ترین سطح)"
              >
                <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
                <span>انتقال به زیرترین لایه</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playPop();
                  onBatchChangeLayer && onBatchChangeLayer('forward');
                }}
                className="py-1.5 px-2 rounded-xl border border-current/15 bg-black/10 dark:bg-white/10 hover:bg-white/15 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                title="یک لایه بالاتر"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>یک لایه بالاتر</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playPop();
                  onBatchChangeLayer && onBatchChangeLayer('backward');
                }}
                className="py-1.5 px-2 rounded-xl border border-current/15 bg-black/10 dark:bg-white/10 hover:bg-white/15 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                title="یک لایه پایین‌تر"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                <span>یک لایه پایین‌تر</span>
              </button>
            </div>
          </div>

          {/* Delete Selected Button (حذف تکی یا دسته‌جمعی) */}
          <div className="pt-2 border-t border-current/15">
            <button
              onClick={() => {
                soundEffects.playPop();
                onBatchDelete && onBatchDelete();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs shadow-md shadow-red-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>
                {selectedCount > 1
                  ? `حذف دسته‌جمعی (${selectedCount} عنصر انتخاب شده)`
                  : 'حذف عنصر انتخاب شده'}
              </span>
            </button>
          </div>
        </section>
      )}

      {/* 3. Selected Block Live Editor Form */}
      {selectedBlock && (
        <section className="flex flex-col gap-3.5 p-4 rounded-2xl border-2 border-orange-500/50 bg-orange-500/5 shadow-md">
          <div className="flex items-center justify-between border-b border-current/15 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm" />
              <b className="text-xs font-black text-orange-400">
                ویرایش جزئیات بلوک: {selectedBlock.t.toUpperCase()}
              </b>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleDuplicateBlock(selectedBlock.id)}
                className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-xs cursor-pointer"
                title="تکثیر این بلوک"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDeleteBlock(selectedBlock.id)}
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 text-xs cursor-pointer"
                title="حذف این بلوک"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Form Fields: Logo Block */}
          {selectedBlock.t === 'logo' && (
            <div className="flex flex-col gap-3 text-xs">
              <span className="font-bold opacity-75">آپلود و تنظیم لوگوی شرکت:</span>
              <input
                ref={logoInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.svg,.pdf,application/pdf,image/*"
                onChange={(e) =>
                  handleUniversalMediaUpload(e, selectedBlock.id, 'customSrc')
                }
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                disabled={isProcessingMedia}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-orange-500/60 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 font-bold transition-all cursor-pointer shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>
                  {isProcessingMedia
                    ? 'در حال پردازش...'
                    : 'آپلود فایل لوگو (PNG, JPG, SVG, PDF)'}
                </span>
              </button>

              {(selectedBlock as LogoBlock).customSrc && (
                <div className="p-3 rounded-xl bg-black/10 dark:bg-white/5 border border-current/15 flex items-center justify-between gap-3">
                  <div className="w-16 h-12 bg-white/10 rounded-lg flex items-center justify-center p-1 overflow-hidden">
                    <img
                      src={(selectedBlock as LogoBlock).customSrc}
                      alt="Logo preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyMediaToAllPages(
                        (selectedBlock as LogoBlock).customSrc!,
                        'logo'
                      )
                    }
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[11px] shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>اعمال این لوگو روی تمام صفحات</span>
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <span className="opacity-75 font-semibold">عرض نمایش لوگو:</span>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={(selectedBlock as LogoBlock).w}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, {
                      w: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Form Fields: Image Block */}
          {selectedBlock.t === 'img' && (
            <div className="flex flex-col gap-3 text-xs">
              <span className="font-bold opacity-75">
                آپلود تصویر (پشتیبانی از PDF, PNG, JPG, SVG, WEBP):
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.svg,.pdf,application/pdf,image/*"
                onChange={(e) =>
                  handleUniversalMediaUpload(e, selectedBlock.id, 'src')
                }
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingMedia}
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 border-dashed border-orange-500/60 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 font-bold transition-all cursor-pointer shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>
                  {isProcessingMedia
                    ? 'در حال تبدیل و خواندن فایل...'
                    : 'انتخاب فایل عکس یا صفحه PDF'}
                </span>
              </button>

              {(selectedBlock as ImageBlock).src && (
                <button
                  type="button"
                  onClick={() =>
                    handleApplyMediaToAllPages(
                      (selectedBlock as ImageBlock).src,
                      'img'
                    )
                  }
                  className="w-full py-2.5 px-3 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-bold border border-orange-500/40 text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <Layers className="w-4 h-4" />
                  <span>تکرار و اضافه کردن این تصویر در تمامی صفحات</span>
                </button>
              )}

              <label className="flex flex-col gap-1">
                <span className="opacity-75 font-semibold">یا آدرس مستقیم اینترنتی (URL):</span>
                <input
                  type="text"
                  value={
                    (selectedBlock as ImageBlock).src.startsWith('data:')
                      ? ''
                      : (selectedBlock as ImageBlock).src
                  }
                  placeholder="https://..."
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { src: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-current/20 bg-black/10 dark:bg-white/5 font-mono text-[11px] text-left"
                  dir="ltr"
                />
              </label>

              {/* Quick sample pick */}
              <div className="flex flex-col gap-1">
                <span className="opacity-75 font-semibold">عکس‌های باکیفیت آماده:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {SAMPLE_IMAGES.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        soundEffects.playPop();
                        handleUpdateBlock(selectedBlock.id, { src: s.url });
                      }}
                      className="relative h-14 rounded-xl overflow-hidden border border-current/20 group cursor-pointer"
                    >
                      <img
                        src={s.url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-[9px] text-white font-bold p-1 text-center">
                        {s.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Height slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-medium">
                  <span className="opacity-75">ارتفاع نمایش:</span>
                  <span className="font-mono text-orange-500 font-bold">
                    {(selectedBlock as ImageBlock).ht}px
                  </span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="450"
                  value={(selectedBlock as ImageBlock).ht}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, {
                      ht: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              {/* Caption */}
              <label className="flex flex-col gap-1">
                <span className="opacity-75 font-semibold">توضیح زیر تصویر (کپشن):</span>
                <input
                  type="text"
                  value={(selectedBlock as ImageBlock).caption || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { caption: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-current/20 bg-black/10 dark:bg-white/5"
                />
              </label>
            </div>
          )}

          {/* Form Fields: Product Card Block */}
          {selectedBlock.t === 'prod' && (
            <div className="flex flex-col gap-3 text-xs">
              <label className="flex flex-col gap-1">
                <span className="opacity-75 font-semibold">نام محصول:</span>
                <input
                  type="text"
                  value={(selectedBlock as ProductCardBlock).x}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { x: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-current/20 bg-black/10 dark:bg-white/5 font-bold"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="opacity-75 font-semibold">توضیحات و مشخصات فنی:</span>
                <textarea
                  rows={2}
                  value={(selectedBlock as ProductCardBlock).d}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { d: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-current/20 bg-black/10 dark:bg-white/5 leading-relaxed"
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1">
                  <span className="opacity-75 font-semibold">قیمت / وضعیت:</span>
                  <input
                    type="text"
                    value={(selectedBlock as ProductCardBlock).pr}
                    onChange={(e) =>
                      handleUpdateBlock(selectedBlock.id, { pr: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-current/20 bg-black/10 dark:bg-white/5 font-bold text-orange-500"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="opacity-75 font-semibold">برچسب (Badge):</span>
                  <input
                    type="text"
                    value={(selectedBlock as ProductCardBlock).badge || ''}
                    placeholder="مثال: پرفروش"
                    onChange={(e) =>
                      handleUpdateBlock(selectedBlock.id, { badge: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-current/20 bg-black/10 dark:bg-white/5"
                  />
                </label>
              </div>

              {/* Product Photo Upload supporting PDF/PNG/JPG */}
              <div className="flex flex-col gap-1.5">
                <span className="opacity-75 font-semibold">تصویر محصول (عکس یا صفحه کاتالوگ PDF):</span>
                <input
                  ref={prodImgInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.svg,.pdf,application/pdf,image/*"
                  onChange={(e) =>
                    handleUniversalMediaUpload(e, selectedBlock.id, 'src')
                  }
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => prodImgInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-orange-500/50 bg-orange-500/10 text-orange-400 font-bold hover:bg-orange-500/20 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>آپلود عکس محصول (PNG/JPG/PDF)</span>
                </button>
              </div>
            </div>
          )}

          {/* Form Fields: Heading */}
          {selectedBlock.t === 'h' && (
            <div className="flex flex-col gap-3 text-xs">
              <label className="flex flex-col gap-1">
                <span className="opacity-75 font-semibold">متن تیتر:</span>
                <input
                  type="text"
                  value={(selectedBlock as HeadingBlock).x}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { x: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-current/20 bg-black/10 dark:bg-white/5 font-bold focus:outline-none focus:border-orange-500"
                />
              </label>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-medium">
                  <span className="opacity-75">اندازه قلم:</span>
                  <span className="font-mono text-orange-500 font-bold">
                    {(selectedBlock as HeadingBlock).sz}px
                  </span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="48"
                  value={(selectedBlock as HeadingBlock).sz}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, {
                      sz: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Form Fields: Text Block */}
          {selectedBlock.t === 'p' && (
            <div className="flex flex-col gap-3 text-xs">
              <label className="flex flex-col gap-1">
                <span className="opacity-75 font-semibold">متن پاراگراف:</span>
                <textarea
                  rows={4}
                  value={(selectedBlock as TextBlock).x}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { x: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-current/20 bg-black/10 dark:bg-white/5 leading-relaxed focus:outline-none focus:border-orange-500"
                />
              </label>
            </div>
          )}

          {/* Form Fields: Button */}
          {selectedBlock.t === 'btn' && (
            <div className="flex flex-col gap-3 text-xs">
              <label className="flex flex-col gap-1">
                <span className="opacity-75 font-semibold">متن روی دکمه:</span>
                <input
                  type="text"
                  value={(selectedBlock as ButtonBlock).x}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { x: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-current/20 bg-black/10 dark:bg-white/5 font-bold"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="opacity-75 font-semibold">مقصد لینک یا شماره صفحه:</span>
                <input
                  type="text"
                  value={(selectedBlock as ButtonBlock).u}
                  placeholder="https://... یا #3 برای پرش به صفحه ۳"
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { u: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-current/20 bg-black/10 dark:bg-white/5 font-mono text-left"
                  dir="ltr"
                />
              </label>
            </div>
          )}

          {/* Universal Section A: Manual Free Positioning & Coordinates */}
          <div className="flex flex-col gap-3 pt-3 mt-2 border-t border-current/15 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-orange-400">
                <Move className="w-3.5 h-3.5" />
                <span>موقعیت مکانی در صفحه:</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  handleUpdateBlock(selectedBlock.id, {
                    isFree: !selectedBlock.isFree,
                    posX: selectedBlock.posX ?? 50,
                    posY: selectedBlock.posY ?? 50,
                  });
                }}
                className={`px-3 py-1 rounded-xl font-bold border text-[11px] transition-all cursor-pointer ${
                  selectedBlock.isFree || currentPage.layoutMode === 'free'
                    ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                    : 'border-current/20 bg-black/5 dark:bg-white/5 opacity-80'
                }`}
              >
                {selectedBlock.isFree || currentPage.layoutMode === 'free'
                  ? 'مختصات آزاد (فعال)'
                  : 'شناور کردن بلوک'}
              </button>
            </div>

            {(selectedBlock.isFree || currentPage.layoutMode === 'free') && (
              <div className="flex flex-col gap-2.5 p-3 rounded-2xl bg-black/10 dark:bg-white/5 border border-current/15">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="opacity-75">موقعیت افقی (X):</span>
                  <span className="font-mono font-bold text-orange-400">
                    {selectedBlock.posX ?? 50}%
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="97"
                  value={selectedBlock.posX ?? 50}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, {
                      posX: parseInt(e.target.value, 10),
                      isFree: true,
                    })
                  }
                  className="w-full accent-orange-500 cursor-pointer"
                />

                <div className="flex justify-between items-center text-[11px]">
                  <span className="opacity-75">موقعیت عمودی (Y):</span>
                  <span className="font-mono font-bold text-orange-400">
                    {selectedBlock.posY ?? 50}%
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="97"
                  value={selectedBlock.posY ?? 50}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, {
                      posY: parseInt(e.target.value, 10),
                      isFree: true,
                    })
                  }
                  className="w-full accent-orange-500 cursor-pointer"
                />

                {/* Precision Nudge */}
                <div className="flex items-center justify-between pt-1 border-t border-current/10">
                  <span className="text-[10px] opacity-70">تنظیم میلی‌متری:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateBlock(selectedBlock.id, {
                          posX: Math.min(98, (selectedBlock.posX ?? 50) + 1),
                          isFree: true,
                        })
                      }
                      className="p-1 rounded bg-black/10 dark:bg-white/10 hover:bg-orange-500 hover:text-white"
                      title="راست"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateBlock(selectedBlock.id, {
                          posY: Math.max(2, (selectedBlock.posY ?? 50) - 1),
                          isFree: true,
                        })
                      }
                      className="p-1 rounded bg-black/10 dark:bg-white/10 hover:bg-orange-500 hover:text-white"
                      title="بالا"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateBlock(selectedBlock.id, {
                          posY: Math.min(98, (selectedBlock.posY ?? 50) + 1),
                          isFree: true,
                        })
                      }
                      className="p-1 rounded bg-black/10 dark:bg-white/10 hover:bg-orange-500 hover:text-white"
                      title="پایین"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateBlock(selectedBlock.id, {
                          posX: Math.max(2, (selectedBlock.posX ?? 50) - 1),
                          isFree: true,
                        })
                      }
                      className="p-1 rounded bg-black/10 dark:bg-white/10 hover:bg-orange-500 hover:text-white"
                      title="چپ"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Universal Section B: Action on Click */}
          <div className="flex flex-col gap-3 pt-3 border-t border-current/15 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-orange-400">
                <MousePointer className="w-3.5 h-3.5" />
                <span>عملکرد لمس / کلیک (Action):</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[
                { id: 'none', label: 'بدون اکشن' },
                { id: 'page', label: 'پرش به صفحه' },
                { id: 'link', label: 'لینک وب' },
                { id: 'tel', label: 'شماره تماس' },
              ].map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    handleUpdateBlock(selectedBlock.id, {
                      actionType: act.id as any,
                    });
                  }}
                  className={`py-1.5 px-1 rounded-xl border text-[10px] font-bold text-center transition-all cursor-pointer ${
                    (selectedBlock.actionType || 'none') === act.id
                      ? 'border-orange-500 bg-orange-500 text-white shadow-sm'
                      : 'border-current/15 bg-black/5 dark:bg-white/5 opacity-80 hover:opacity-100'
                  }`}
                >
                  {act.label}
                </button>
              ))}
            </div>

            {selectedBlock.actionType === 'page' && (
              <label className="flex flex-col gap-1 p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30">
                <span className="font-bold text-[11px] text-orange-400">
                  انتخاب صفحه مقصد:
                </span>
                <select
                  value={selectedBlock.actionPage ?? 0}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, {
                      actionPage: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-current/20 bg-slate-900 text-white font-semibold cursor-pointer"
                >
                  {state.pg.map((p, pIdx) => (
                    <option key={p.id} value={pIdx}>
                      صفحه {pIdx + 1}: {p.t}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {selectedBlock.actionType === 'link' && (
              <label className="flex flex-col gap-1 p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30">
                <span className="font-bold text-[11px] text-orange-400">
                  آدرس وبسایت یا شبکه اجتماعی:
                </span>
                <input
                  type="text"
                  value={selectedBlock.actionUrl || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, {
                      actionUrl: e.target.value,
                    })
                  }
                  placeholder="https://rcg-industry.ir"
                  className="w-full px-3 py-2 rounded-xl border border-current/20 bg-black/10 dark:bg-white/10 font-mono text-[11px] text-left"
                  dir="ltr"
                />
              </label>
            )}

            {selectedBlock.actionType === 'tel' && (
              <label className="flex flex-col gap-1 p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30">
                <span className="font-bold text-[11px] text-orange-400">
                  شماره جهت شماره‌گیری خودکار:
                </span>
                <input
                  type="text"
                  value={selectedBlock.actionTel || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, {
                      actionTel: e.target.value,
                    })
                  }
                  placeholder="0912... یا 021..."
                  className="w-full px-3 py-2 rounded-xl border border-current/20 bg-black/10 dark:bg-white/10 font-mono text-[11px] text-left"
                  dir="ltr"
                />
              </label>
            )}
          </div>
        </section>
      )}

      {/* 4. Page Blocks List with Layer order & Selection Checkboxes */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold opacity-75">
              عناصر موجود در این صفحه ({currentPage.bl.length})
            </span>
            {selectedCount > 0 && (
              <span className="text-[10px] bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded-full">
                {selectedCount} انتخاب شده
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            {onSelectAllBlocks && (
              <button
                onClick={() => {
                  soundEffects.playPop();
                  onSelectAllBlocks();
                }}
                className="text-orange-400 hover:text-orange-300 font-bold cursor-pointer"
              >
                انتخاب همه
              </button>
            )}
            {selectedCount > 0 && onClearSelection && (
              <button
                onClick={() => {
                  soundEffects.playPop();
                  onClearSelection();
                }}
                className="opacity-60 hover:opacity-100 cursor-pointer"
              >
                لغو
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {currentPage.bl.map((b, idx) => {
            const isSelected = effectiveSelectedIds.includes(b.id);
            let previewText = '';
            if (b.t === 'h' || b.t === 'p' || b.t === 'btn' || b.t === 'box') {
              previewText = b.x;
            } else if (b.t === 'prod') {
              previewText = b.x;
            } else if (b.t === 'img') {
              previewText = b.caption || 'عکس کاتالوگ';
            }

            return (
              <div
                key={b.id}
                onClick={() => {
                  soundEffects.playPop();
                  onSelectBlock(b.id, false);
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500/15 shadow-sm ring-1 ring-orange-500/40'
                    : 'border-current/15 hover:border-orange-500/30 bg-black/5 dark:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {/* Multi-select Checkbox */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEffects.playPop();
                      onSelectBlock(b.id, true);
                    }}
                    className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-orange-400 cursor-pointer"
                    title={isSelected ? 'خروج از انتخاب' : 'افزودن به انتخاب دسته‌جمعی'}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-orange-500" />
                    ) : (
                      <Square className="w-4 h-4 opacity-40 hover:opacity-80" />
                    )}
                  </div>

                  <span className="text-xs font-bold text-orange-500 flex-none font-mono">
                    {idx + 1}.
                  </span>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold">{b.t.toUpperCase()}</span>
                      {b.scale && b.scale !== 1 && (
                        <span className="text-[9px] font-mono px-1 rounded bg-orange-500/20 text-orange-400 font-bold">
                          {Math.round(b.scale * 100)}%
                        </span>
                      )}
                      {b.posZ && (
                        <span className="text-[9px] opacity-50 font-mono">
                          Z:{b.posZ}
                        </span>
                      )}
                    </div>
                    {previewText && (
                      <span className="text-[10px] opacity-65 truncate max-w-[170px]">
                        {previewText}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Item Actions: Scale -/+, Move Up/Down, Delete */}
                <div
                  className="flex items-center gap-1 flex-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Quick Scale - */}
                  <button
                    onClick={() => {
                      soundEffects.playPop();
                      const cur = b.scale ?? 1;
                      const next = Math.max(0.4, Number((cur - 0.1).toFixed(2)));
                      handleUpdateBlock(b.id, { scale: next });
                    }}
                    className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                    title="کوچک‌تر کردن سایز این عنصر"
                  >
                    <ZoomOut className="w-3 h-3" />
                  </button>

                  {/* Quick Scale + */}
                  <button
                    onClick={() => {
                      soundEffects.playPop();
                      const cur = b.scale ?? 1;
                      const next = Math.min(2.5, Number((cur + 0.1).toFixed(2)));
                      handleUpdateBlock(b.id, { scale: next });
                    }}
                    className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                    title="بزرگ‌تر کردن سایز این عنصر"
                  >
                    <ZoomIn className="w-3 h-3" />
                  </button>

                  <div className="w-px h-3 bg-current/20 mx-0.5" />

                  {/* Move Up */}
                  <button
                    onClick={() => handleMoveBlock(b.id, -1)}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                    title="انتقال به بالا"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => handleMoveBlock(b.id, 1)}
                    disabled={idx === currentPage.bl.length - 1}
                    className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                    title="انتقال به پایین"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Block */}
                  <button
                    onClick={() => handleDeleteBlock(b.id)}
                    className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 cursor-pointer"
                    title="حذف این عنصر"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
