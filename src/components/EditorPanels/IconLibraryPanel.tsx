import React, { useState, useMemo } from 'react';
import {
  SVG_ICONS,
  ICON_CATEGORIES,
  generateSvgTag,
} from '../../constants/icons';
import { CatalogState, IconBlock } from '../../types/catalog';
import {
  Search,
  Sparkles,
  Plus,
  X,
  Flame,
} from 'lucide-react';

interface IconLibraryPanelProps {
  state: CatalogState;
  currentPageIndex: number;
  onAddIconBlock: (block: IconBlock) => void;
  onOpenModal?: () => void;
}

export const IconLibraryPanel: React.FC<IconLibraryPanelProps> = ({
  state,
  currentPageIndex,
  onAddIconBlock,
  onOpenModal,
}) => {
  const [selectedIconId, setSelectedIconId] = useState('shield-check');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Icon options
  const [iconSize, setIconSize] = useState(48);
  const [colorType, setColorType] = useState<'accent' | 'text' | 'custom'>('accent');
  const [customColor, setCustomColor] = useState(state.c.ac);
  const [bgShape, setBgShape] = useState<'none' | 'circle' | 'rounded' | 'soft' | 'border' | 'gradient'>('circle');
  const [animation, setAnimation] = useState<'none' | 'float' | 'pulse' | 'bounce' | 'wiggle'>('float');
  const [caption, setCaption] = useState('کیفیت و اصالت قطعات');
  const [captionPos, setCaptionPos] = useState<'bottom' | 'side'>('bottom');
  const [align, setAlign] = useState<'right' | 'center' | 'left'>('center');

  const currentPage = state.pg[currentPageIndex] || state.pg[0];

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

  const effectiveColor =
    colorType === 'accent'
      ? state.c.ac
      : colorType === 'text'
      ? state.c.fg
      : customColor;

  const handleAdd = () => {
    const newBlock: IconBlock = {
      id: 'b_' + Math.random().toString(36).substring(2, 9),
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
    };
    onAddIconBlock(newBlock);
  };

  return (
    <div className="flex flex-col gap-5 p-4 text-right">
      {/* Top Banner & Quick Modal Trigger */}
      <div className="p-4 rounded-2xl border border-orange-500/40 bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-rose-500/15 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/30">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <b className="text-xs font-black text-orange-400 block">
              آیکون‌های وکتور متحرک و رنگی
            </b>
            <span className="text-[10px] opacity-75">
              آیکون‌های تعاملی با انیمیشن‌های نرم
            </span>
          </div>
        </div>
        {onOpenModal && (
          <button
            onClick={onOpenModal}
            className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold transition-all shadow-md cursor-pointer flex-none active:scale-95"
          >
            کتابخانه بزرگ
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 opacity-50" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجوی آیکون (گارانتی، ابزار، تماس...)"
          className="w-full pr-10 pl-8 py-2.5 rounded-xl border border-current/20 bg-black/5 dark:bg-white/5 text-xs font-semibold focus:outline-none focus:border-orange-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 opacity-50 hover:opacity-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {ICON_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'border border-current/15 bg-black/5 dark:bg-white/5 opacity-75 hover:opacity-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Icon Grid (Compact for sidebar) */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold opacity-75">
          انتخاب آیکون ({filteredIcons.length} مورد):
        </span>
        <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto no-scrollbar p-1.5 border border-current/10 rounded-2xl bg-black/5 dark:bg-white/5">
          {filteredIcons.map((item) => {
            const isSelected = selectedIconId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedIconId(item.id)}
                className={`p-2 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group relative ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500/20 shadow-md ring-2 ring-orange-500/40'
                    : 'border-transparent hover:border-current/20 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title={item.name}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${item.color || state.c.ac} 18%, transparent)`,
                    color: item.color || state.c.ac,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: generateSvgTag(item.id, 20, item.color || state.c.ac),
                  }}
                />
                <span className="text-[9px] font-bold truncate max-w-full opacity-80 group-hover:opacity-100">
                  {item.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="flex flex-col gap-2 p-3.5 rounded-2xl border border-current/15 bg-black/5 dark:bg-white/5">
        <span className="text-[11px] font-bold opacity-75">پیش‌نمایش زنده با انیمیشن:</span>
        <div
          className="h-32 rounded-2xl flex items-center justify-center p-3 relative shadow-inner overflow-hidden"
          style={{ backgroundColor: state.c.bg }}
        >
          <div
            className={`inline-flex items-center transition-all ${
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
              captionPos === 'side' ? 'flex-row gap-3' : 'flex-col gap-1.5'
            } ${
              bgShape === 'circle'
                ? 'rounded-full'
                : bgShape === 'rounded'
                ? 'rounded-2xl'
                : bgShape === 'border'
                ? 'rounded-2xl border-2'
                : bgShape === 'soft'
                ? 'rounded-2xl backdrop-blur-sm'
                : bgShape === 'gradient'
                ? 'rounded-2xl shadow-md'
                : ''
            }`}
            style={{
              padding: bgShape !== 'none' ? `${Math.max(8, iconSize * 0.28)}px` : '0',
              backgroundColor:
                bgShape === 'circle' || bgShape === 'rounded'
                  ? `color-mix(in srgb, ${effectiveColor} 18%, transparent)`
                  : bgShape === 'soft'
                  ? 'var(--card-sf, rgba(128,128,128,0.12))'
                  : bgShape === 'gradient'
                  ? `linear-gradient(135deg, color-mix(in srgb, ${effectiveColor} 30%, transparent), color-mix(in srgb, ${effectiveColor} 10%, transparent))`
                  : 'transparent',
              borderColor: bgShape === 'border' ? effectiveColor : 'transparent',
            }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: generateSvgTag(selectedIconId, iconSize, effectiveColor),
              }}
            />
            {caption && (
              <span
                className="font-bold text-xs"
                style={{ color: state.c.fg }}
              >
                {caption}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Animation & Customization Sliders */}
      <div className="flex flex-col gap-3 text-xs">
        {/* Animation Selector */}
        <div className="flex flex-col gap-1">
          <span className="opacity-75 font-semibold">نوع انیمیشن نرم:</span>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'float', label: 'شناور نرم' },
              { id: 'pulse', label: 'پالس درخشان' },
              { id: 'wiggle', label: 'چرخش ملایم' },
              { id: 'bounce', label: 'جهش با لمس' },
              { id: 'none', label: 'ثابت' },
            ].map((ani) => (
              <button
                key={ani.id}
                onClick={() => setAnimation(ani.id as any)}
                className={`py-1.5 rounded-xl border text-[11px] font-semibold text-center cursor-pointer transition-all ${
                  animation === ani.id
                    ? 'border-orange-500 bg-orange-500/20 text-orange-400 font-bold'
                    : 'border-current/15 hover:border-orange-400/40'
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
            <span className="opacity-75">اندازه آیکون:</span>
            <span className="font-mono text-orange-500 font-bold">{iconSize}px</span>
          </div>
          <input
            type="range"
            min="24"
            max="80"
            value={iconSize}
            onChange={(e) => setIconSize(parseInt(e.target.value, 10))}
            className="w-full accent-orange-500 cursor-pointer"
          />
        </div>

        {/* Frame Shape */}
        <div className="flex flex-col gap-1">
          <span className="opacity-75 font-semibold">قالب کادر آیکون:</span>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'circle', label: 'دایره‌ای' },
              { id: 'rounded', label: 'مربعی نرم' },
              { id: 'gradient', label: 'گرادیان' },
              { id: 'border', label: 'خط دور' },
              { id: 'soft', label: 'شیشه‌ای' },
              { id: 'none', label: 'بدون کادر' },
            ].map((sh) => (
              <button
                key={sh.id}
                onClick={() => setBgShape(sh.id as any)}
                className={`py-1.5 rounded-xl border text-[10px] font-semibold text-center cursor-pointer transition-all ${
                  bgShape === sh.id
                    ? 'border-orange-500 bg-orange-500/20 text-orange-400 font-bold'
                    : 'border-current/15'
                }`}
              >
                {sh.label}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Caption */}
        <label className="flex flex-col gap-1">
          <span className="opacity-75 font-semibold">متن زیر یا کنار آیکون:</span>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="مثال: تضمین اصالت کالا"
            className="w-full px-3 py-2 rounded-xl border border-current/20 bg-black/5 dark:bg-white/5 font-semibold text-xs"
          />
        </label>
      </div>

      {/* Add Button */}
      <button
        onClick={handleAdd}
        className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer mt-1 active:scale-98"
      >
        <Plus className="w-4 h-4" />
        <span>افزودن این آیکون به {currentPage.t}</span>
      </button>
    </div>
  );
};
