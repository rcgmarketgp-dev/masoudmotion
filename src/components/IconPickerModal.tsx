import React, { useState, useMemo } from 'react';
import {
  SVG_ICONS,
  ICON_CATEGORIES,
  generateSvgTag,
} from '../constants/icons';
import { CatalogState, IconBlock } from '../types/catalog';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Sparkles,
  X,
  Code2,
  Sliders,
  Plus,
  Compass,
} from 'lucide-react';

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: CatalogState;
  onAddIconBlock: (block: IconBlock) => void;
  onUpdateExistingIcon?: (updates: Partial<IconBlock>) => void;
  existingIconBlock?: IconBlock;
}

export const IconPickerModal: React.FC<IconPickerModalProps> = ({
  isOpen,
  onClose,
  state,
  onAddIconBlock,
  onUpdateExistingIcon,
  existingIconBlock,
}) => {
  const [selectedIconId, setSelectedIconId] = useState(
    existingIconBlock?.iconName || 'shield-check'
  );
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Icon customization parameters
  const [iconSize, setIconSize] = useState(existingIconBlock?.sz || 44);
  const [colorType, setColorType] = useState<'accent' | 'text' | 'custom'>(
    existingIconBlock?.colorType || 'accent'
  );
  const [customColor, setCustomColor] = useState(
    existingIconBlock?.customColor || state.c.ac
  );
  const [bgShape, setBgShape] = useState<'none' | 'circle' | 'rounded' | 'soft' | 'border' | 'gradient'>(
    existingIconBlock?.bgShape || 'circle'
  );
  const [animation, setAnimation] = useState<'none' | 'float' | 'pulse' | 'bounce' | 'wiggle'>(
    existingIconBlock?.animation || 'float'
  );
  const [caption, setCaption] = useState(existingIconBlock?.caption || '');
  const [captionPos, setCaptionPos] = useState<'bottom' | 'side'>(
    existingIconBlock?.captionPos || 'bottom'
  );
  const [align, setAlign] = useState<'right' | 'center' | 'left'>(
    existingIconBlock?.al || 'center'
  );

  // Custom SVG Tab
  const [isCustomSvgMode, setIsCustomSvgMode] = useState(false);
  const [customSvgPath, setCustomSvgPath] = useState(
    existingIconBlock?.customSvgPath || ''
  );

  // Filtered icons
  const filteredIcons = useMemo(() => {
    return SVG_ICONS.filter((item) => {
      const matchCat =
        activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCat;
      const matchSearch =
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  const effectiveColor =
    colorType === 'accent'
      ? state.c.ac
      : colorType === 'text'
      ? state.c.fg
      : customColor;

  const handleApply = () => {
    const blockData: IconBlock = {
      id: existingIconBlock?.id || 'b_' + Math.random().toString(36).substring(2, 9),
      t: 'icon',
      iconName: selectedIconId,
      sz: iconSize,
      colorType,
      customColor,
      bgShape,
      caption: caption.trim() || undefined,
      captionPos,
      al: align,
      animation,
      customSvgPath: isCustomSvgMode ? customSvgPath.trim() : undefined,
    };
    if (existingIconBlock && onUpdateExistingIcon) {
      onUpdateExistingIcon(blockData);
    } else {
      onAddIconBlock(blockData);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-5 md:p-6 text-slate-100 flex flex-col gap-4 z-10 text-right overflow-hidden max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shadow-md shadow-orange-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base md:text-lg text-white">
                    کتابخانه آیکون‌های وکتور متحرک و رنگی (SVG)
                  </h3>
                  <span className="text-[11px] bg-orange-500/20 text-orange-400 px-2.5 py-0.5 rounded-full font-bold">
                    انیمیشن‌های نرم
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  انتخاب، تنظیم رنگ، انیمیشن حرکتی و کادر آیکون با پیش‌نمایش آنی
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

          {/* Modal Main Body (2 Columns: Left Icon Grid + Right Live Inspector) */}
          <div className="flex-1 flex flex-col lg:flex-row gap-5 min-h-0 overflow-hidden">
            {/* Left Column: Search & Icon Grid */}
            <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">
              {/* Search Bar & Custom SVG Toggle */}
              <div className="flex items-center gap-2 flex-none">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجوی عنوان یا تگ آیکون..."
                    className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-semibold focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setIsCustomSvgMode(!isCustomSvgMode)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer flex-none ${
                    isCustomSvgMode
                      ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="کد دلخواه SVG"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">کد دلخواه SVG</span>
                </button>
              </div>

              {/* Categories Pills */}
              {!isCustomSvgMode && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 flex-none">
                  {ICON_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        activeCategory === cat.id
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 font-bold'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Icon Grid Area */}
              {!isCustomSvgMode ? (
                <div className="flex-1 overflow-y-auto pr-1 no-scrollbar grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 min-h-[220px]">
                  {filteredIcons.map((item) => {
                    const isSelected = selectedIconId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedIconId(item.id)}
                        className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group ${
                          isSelected
                            ? 'border-orange-500 bg-orange-500/15 shadow-md shadow-orange-500/10 ring-2 ring-orange-500/30'
                            : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${
                            isSelected
                              ? 'bg-orange-500 text-white'
                              : 'bg-slate-800 text-slate-200 group-hover:text-orange-400'
                          }`}
                          dangerouslySetInnerHTML={{
                            __html: generateSvgTag(
                              item.id,
                              22,
                              isSelected ? '#ffffff' : (item.color || 'currentColor')
                            ),
                          }}
                        />
                        <span className="text-[11px] font-bold text-slate-300 group-hover:text-white truncate max-w-full">
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                  {filteredIcons.length === 0 && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                      <Compass className="w-8 h-8 opacity-40" />
                      <span className="text-xs">
                        آیکونی با این مشخصات یافت نشد
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* Custom SVG Code Box */
                <div className="flex-1 flex flex-col gap-2 p-3 bg-slate-800/50 rounded-2xl border border-slate-700 text-xs">
                  <span className="font-bold text-orange-400">
                    مسیر وکتور دلخواه SVG (تگ‌های path یا polygon):
                  </span>
                  <textarea
                    rows={6}
                    value={customSvgPath}
                    onChange={(e) => setCustomSvgPath(e.target.value)}
                    placeholder='<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>'
                    className="w-full flex-1 p-3 rounded-xl border border-slate-700 bg-slate-900 font-mono text-[11px] leading-relaxed text-left focus:outline-none focus:border-orange-500"
                    dir="ltr"
                  />
                  <span className="text-[11px] text-slate-400">
                    مسیر بر مبنای ViewBox استاندارد ۲۴ در ۲۴ رسم خواهد شد.
                  </span>
                </div>
              )}
            </div>

            {/* Right Column: Customization Parameters & Live Preview */}
            <div className="w-full lg:w-80 flex-none flex flex-col justify-between gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-xs overflow-y-auto no-scrollbar">
              <div className="flex flex-col gap-3.5">
                <span className="font-extrabold text-sm text-white flex items-center gap-1.5 border-b border-slate-700 pb-2">
                  <Sliders className="w-4 h-4 text-orange-400" />
                  <span>شخصی‌سازی آیکون و انیمیشن</span>
                </span>

                {/* Live Preview Card */}
                <div
                  className="w-full h-36 rounded-2xl border flex flex-col items-center justify-center gap-2 p-4 transition-all shadow-inner relative overflow-hidden"
                  style={{
                    backgroundColor: state.c.bg,
                    borderColor: 'rgba(255,255,255,0.1)',
                  }}
                >
                  <div
                    className={`flex items-center justify-center transition-all ${
                      animation === 'float'
                        ? 'animate-float-slow'
                        : animation === 'pulse'
                        ? 'animate-pulse-glow'
                        : animation === 'wiggle'
                        ? 'animate-wiggle-soft'
                        : animation === 'bounce'
                        ? 'hover:animate-bounce'
                        : ''
                    } ${
                      bgShape === 'circle'
                        ? 'rounded-full'
                        : bgShape === 'rounded'
                        ? 'rounded-2xl'
                        : bgShape === 'border'
                        ? 'rounded-2xl border-2'
                        : bgShape === 'soft'
                        ? 'rounded-2xl backdrop-blur-md'
                        : bgShape === 'gradient'
                        ? 'rounded-2xl shadow-lg'
                        : ''
                    } ${
                      captionPos === 'side'
                        ? 'flex-row gap-3'
                        : 'flex-col gap-1.5'
                    }`}
                    style={{
                      padding: bgShape !== 'none' ? '12px' : '0',
                      backgroundColor:
                        bgShape === 'circle' || bgShape === 'rounded'
                          ? `color-mix(in srgb, ${effectiveColor} 18%, transparent)`
                          : bgShape === 'soft'
                          ? 'rgba(128,128,128,0.12)'
                          : bgShape === 'gradient'
                          ? `linear-gradient(135deg, color-mix(in srgb, ${effectiveColor} 30%, transparent), color-mix(in srgb, ${effectiveColor} 10%, transparent))`
                          : 'transparent',
                      borderColor:
                        bgShape === 'border' ? effectiveColor : 'transparent',
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateSvgTag(
                          selectedIconId,
                          iconSize,
                          effectiveColor,
                          isCustomSvgMode ? customSvgPath : undefined
                        ),
                      }}
                    />
                    {caption && (
                      <span
                        className="text-xs font-bold"
                        style={{ color: state.c.fg }}
                      >
                        {caption}
                      </span>
                    )}
                  </div>
                </div>

                {/* Animation Type */}
                <div className="flex flex-col gap-1">
                  <span className="text-slate-300 font-medium">نوع انیمیشن پویا:</span>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 'float', label: 'شناور نرم' },
                      { id: 'pulse', label: 'پالس نوری' },
                      { id: 'wiggle', label: 'چرخش آرام' },
                      { id: 'bounce', label: 'جهش با لمس' },
                      { id: 'none', label: 'ثابت' },
                    ].map((ani) => (
                      <button
                        key={ani.id}
                        onClick={() => setAnimation(ani.id as any)}
                        className={`py-1.5 rounded-xl border text-[10px] font-semibold text-center cursor-pointer transition-all ${
                          animation === ani.id
                            ? 'border-orange-500 bg-orange-500/20 text-orange-400 font-bold'
                            : 'border-slate-700 bg-slate-850 text-slate-300'
                        }`}
                      >
                        {ani.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300">اندازه آیکون:</span>
                    <span className="font-mono text-orange-400 font-bold">
                      {iconSize}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="24"
                    max="96"
                    value={iconSize}
                    onChange={(e) => setIconSize(parseInt(e.target.value, 10))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                </div>

                {/* Color Selector */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-300 font-medium">رنگ آیکون:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'accent', label: 'رنگ تأکیدی' },
                      { id: 'text', label: 'رنگ متن' },
                      { id: 'custom', label: 'رنگ دلخواه' },
                    ].map((cOpt) => (
                      <button
                        key={cOpt.id}
                        onClick={() => setColorType(cOpt.id as any)}
                        className={`py-1.5 rounded-xl border text-[11px] font-semibold text-center cursor-pointer ${
                          colorType === cOpt.id
                            ? 'border-orange-500 bg-orange-500/20 text-orange-400 font-bold'
                            : 'border-slate-700 bg-slate-850'
                        }`}
                      >
                        {cOpt.label}
                      </button>
                    ))}
                  </div>
                  {colorType === 'custom' && (
                    <label className="flex items-center justify-between p-2 rounded-xl border border-slate-700 bg-slate-900 mt-1 cursor-pointer">
                      <span className="text-[11px] text-slate-300">
                        انتخاب طیف رنگ:
                      </span>
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                      />
                    </label>
                  )}
                </div>

                {/* Background Frame Shape */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-300 font-medium">شکل کادر:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'circle', label: 'دایره' },
                      { id: 'rounded', label: 'مربع نرم' },
                      { id: 'gradient', label: 'گرادیان' },
                      { id: 'soft', label: 'شیشه‌ای' },
                      { id: 'border', label: 'حاشیه' },
                      { id: 'none', label: 'بدون کادر' },
                    ].map((sh) => (
                      <button
                        key={sh.id}
                        onClick={() => setBgShape(sh.id as any)}
                        className={`p-1.5 rounded-xl border text-[10px] font-semibold text-center cursor-pointer ${
                          bgShape === sh.id
                            ? 'border-orange-500 bg-orange-500/20 text-orange-400 font-bold'
                            : 'border-slate-700 bg-slate-850'
                        }`}
                      >
                        {sh.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Caption / Label under icon */}
                <label className="flex flex-col gap-1">
                  <span className="text-slate-300 font-medium">
                    متن برچسب (اختیاری):
                  </span>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="مثال: تضمین کیفیت کالا"
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-700">
                <button
                  onClick={handleApply}
                  className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {existingIconBlock ? 'ثبت تغییرات آیکون' : 'افزودن این آیکون'}
                  </span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
