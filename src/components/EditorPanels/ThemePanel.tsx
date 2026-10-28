import React, { useRef, useState } from 'react';
import {
  CatalogSizeKey,
  CatalogState,
  DecorationStyle,
  FontKey,
  FontWeightKey,
} from '../../types/catalog';
import {
  ACCENT_COLORS,
  CATALOG_SIZES,
  FONT_CONFIG,
  FONT_WEIGHTS,
  THEME_PALETTES,
} from '../../constants/presets';
import { processCatalogMediaFile } from '../../utils/fileUploadHelper';
import { soundEffects } from '../../utils/soundEffects';
import {
  Palette,
  Sparkles,
  Sliders,
  Type,
  Layout,
  Check,
  Upload,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';

interface ThemePanelProps {
  state: CatalogState;
  onUpdateState: (updater: (prev: CatalogState) => CatalogState) => void;
}

export const ThemePanel: React.FC<ThemePanelProps> = ({
  state,
  onUpdateState,
}) => {
  const currentPaletteIndex = state.tp;
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const handleSelectPalette = (idx: number) => {
    soundEffects.playPop();
    const selected = THEME_PALETTES[idx];
    onUpdateState((prev) => ({
      ...prev,
      tp: idx,
      c: { ...selected },
    }));
  };

  const handleColorChange = (key: 'bg' | 'fg' | 'ac' | 'sf', val: string) => {
    onUpdateState((prev) => ({
      ...prev,
      tp: -1, // custom
      c: {
        ...prev.c,
        [key]: val,
      },
    }));
  };

  const handleRadiusChange = (r: number) => {
    onUpdateState((prev) => ({
      ...prev,
      c: {
        ...prev.c,
        r,
      },
    }));
  };

  const handleSizeChange = (sz: CatalogSizeKey) => {
    soundEffects.playPop();
    onUpdateState((prev) => ({
      ...prev,
      sz,
    }));
  };

  const handleFontChange = (f: FontKey) => {
    soundEffects.playPop();
    onUpdateState((prev) => ({
      ...prev,
      f,
    }));
  };

  const handleDecorationChange = (dc: DecorationStyle) => {
    soundEffects.playPop();
    onUpdateState((prev) => ({
      ...prev,
      dc,
    }));
  };

  const handleUploadGlobalLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const { dataUrl } = await processCatalogMediaFile(file, 900);
      onUpdateState((prev) => ({
        ...prev,
        branding: {
          ...prev.branding,
          logoUrl: dataUrl,
          logoEnabled: true,
          logoPosition: prev.branding?.logoPosition || 'top-right',
          logoWidth: prev.branding?.logoWidth || 120,
          logoOpacity: prev.branding?.logoOpacity || 1,
        },
      }));
      soundEffects.playChime();
    } catch (err) {
      alert('خطا در بارگذاری لوگو. لطفاً فرمت PNG، JPG، SVG یا PDF انتخاب کنید.');
    } finally {
      setIsUploadingLogo(false);
      e.target.value = '';
    }
  };

  const branding = state.branding;

  return (
    <div className="flex flex-col gap-6 p-4 text-right">
      {/* 0. Global Corporate Logo & Branding on ALL pages */}
      <section className="flex flex-col gap-3 p-3.5 rounded-2xl border border-orange-500/40 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
            <Layers className="w-4 h-4" />
            <span>لوگوی سازمانی در تمامی صفحات کاتالوگ:</span>
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold">
            <input
              type="checkbox"
              checked={Boolean(branding?.logoEnabled)}
              onChange={(e) => {
                soundEffects.playPop();
                onUpdateState((prev) => ({
                  ...prev,
                  branding: {
                    ...prev.branding,
                    logoEnabled: e.target.checked,
                  },
                }));
              }}
              className="w-4 h-4 rounded text-orange-500 accent-orange-500 cursor-pointer"
            />
            <span>فعال</span>
          </label>
        </div>

        {/* Upload Logo supporting PDF, PNG, JPG, SVG */}
        <input
          ref={logoInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.svg,.pdf,application/pdf,image/*"
          onChange={handleUploadGlobalLogo}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => logoInputRef.current?.click()}
          disabled={isUploadingLogo}
          className="p-3 rounded-xl border-2 border-dashed border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <Upload className="w-4 h-4" />
          <span>
            {isUploadingLogo
              ? 'در حال خواندن فایل...'
              : branding?.logoUrl
              ? 'تغییر لوگوی سراسری (PNG / SVG / PDF)'
              : 'آپلود لوگوی شرکت برای تمامی صفحات'}
          </span>
        </button>

        {branding?.logoUrl && (
          <div className="flex flex-col gap-2.5 pt-2 border-t border-current/10 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-black/10 dark:bg-white/5 border border-current/15">
              <span className="font-semibold text-[11px] opacity-75">پیش‌نمایش لوگو:</span>
              <img
                src={branding.logoUrl}
                alt="لوگو"
                className="max-h-8 max-w-[120px] object-contain"
              />
            </div>

            {/* Position */}
            <div className="flex flex-col gap-1">
              <span className="opacity-75 font-semibold text-[11px]">موقعیت در صفحه:</span>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: 'top-right', label: 'بالا راست' },
                  { id: 'top-center', label: 'بالا وسط' },
                  { id: 'top-left', label: 'بالا چپ' },
                  { id: 'bottom-right', label: 'پایین راست' },
                  { id: 'bottom-left', label: 'پایین چپ' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => {
                      soundEffects.playPop();
                      onUpdateState((prev) => ({
                        ...prev,
                        branding: {
                          ...prev.branding,
                          logoPosition: pos.id as any,
                        },
                      }));
                    }}
                    className={`py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all ${
                      (branding.logoPosition || 'top-right') === pos.id
                        ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                        : 'border-current/15 hover:border-orange-400/30'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Width slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="opacity-75">اندازه عرض:</span>
                <span className="font-mono text-orange-400 font-bold">
                  {branding.logoWidth ?? 120}px
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="240"
                value={branding.logoWidth ?? 120}
                onChange={(e) =>
                  onUpdateState((prev) => ({
                    ...prev,
                    branding: {
                      ...prev.branding,
                      logoWidth: parseInt(e.target.value, 10),
                    },
                  }))
                }
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>
          </div>
        )}
      </section>

      {/* 1. Catalog Dimensions & Display Size */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-xs font-bold opacity-75">
          <Layout className="w-4 h-4 text-orange-500" />
          <span>ابعاد و قطع کاتالوگ:</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(CATALOG_SIZES) as CatalogSizeKey[]).map((key) => {
            const dim = CATALOG_SIZES[key];
            const isSelected = state.sz === key;
            return (
              <button
                key={key}
                onClick={() => handleSizeChange(key)}
                className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col gap-1 ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500/10 shadow-sm ring-1 ring-orange-500/40'
                    : 'border-current/15 hover:border-orange-500/50 bg-black/5 dark:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <b className="text-xs font-bold">{dim.label}</b>
                  {isSelected && <Check className="w-3.5 h-3.5 text-orange-500" />}
                </div>
                <span className="text-[10px] opacity-60 font-mono">
                  {dim.width} × {dim.height}px
                </span>
                <span className="text-[10px] opacity-75 line-clamp-1">
                  {dim.desc}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Color Palettes Presets */}
      <section className="flex flex-col gap-2.5 pt-4 border-t border-current/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold opacity-75">
            <Palette className="w-4 h-4 text-orange-500" />
            <span>پالت‌های رنگی آماده:</span>
          </div>
          {currentPaletteIndex === -1 && (
            <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-bold">
              شخصی‌سازی شده
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {THEME_PALETTES.map((pal, idx) => {
            const isSelected = currentPaletteIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectPalette(idx)}
                className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col gap-2 ${
                  isSelected
                    ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md'
                    : 'border-current/15 hover:border-current/30'
                }`}
                style={{ backgroundColor: pal.bg, color: pal.fg }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold truncate">{pal.name}</span>
                  {isSelected && (
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-sm"
                      style={{ backgroundColor: pal.ac }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-1.5 w-full">
                  <div
                    className="h-2.5 flex-1 rounded-sm shadow-sm"
                    style={{ backgroundColor: pal.ac }}
                  />
                  <div
                    className="h-2.5 flex-1 rounded-sm"
                    style={{ backgroundColor: pal.sf }}
                  />
                  <div
                    className="h-2.5 flex-1 rounded-sm border border-current/20"
                    style={{ backgroundColor: pal.bg }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Detailed Custom Colors & Corner Radius */}
      <section className="flex flex-col gap-3 pt-4 border-t border-current/10">
        <div className="flex items-center gap-2 text-xs font-bold opacity-75">
          <Sliders className="w-4 h-4 text-orange-500" />
          <span>تنظیم دقیق رنگ‌ها و خمیدگی:</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <label className="flex items-center justify-between p-2.5 rounded-xl border border-current/15 bg-black/5 dark:bg-white/5 cursor-pointer">
            <span className="font-medium">پس‌زمینه اصلی:</span>
            <input
              type="color"
              value={state.c.bg}
              onChange={(e) => handleColorChange('bg', e.target.value)}
              className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
            />
          </label>
          <label className="flex items-center justify-between p-2.5 rounded-xl border border-current/15 bg-black/5 dark:bg-white/5 cursor-pointer">
            <span className="font-medium">رنگ متون:</span>
            <input
              type="color"
              value={state.c.fg}
              onChange={(e) => handleColorChange('fg', e.target.value)}
              className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
            />
          </label>
          <label className="flex items-center justify-between p-2.5 rounded-xl border border-current/15 bg-black/5 dark:bg-white/5 cursor-pointer">
            <span className="font-medium">رنگ تأکیدی (اکسنت):</span>
            <input
              type="color"
              value={state.c.ac}
              onChange={(e) => handleColorChange('ac', e.target.value)}
              className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
            />
          </label>
          <label className="flex items-center justify-between p-2.5 rounded-xl border border-current/15 bg-black/5 dark:bg-white/5 cursor-pointer">
            <span className="font-medium">رنگ کادرها و کارت:</span>
            <input
              type="color"
              value={state.c.sf}
              onChange={(e) => handleColorChange('sf', e.target.value)}
              className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
            />
          </label>
        </div>

        {/* Quick Accent Swatches */}
        <div className="flex flex-col gap-1.5 mt-1">
          <span className="text-[11px] opacity-70">انتخاب سریع رنگ سازمانی:</span>
          <div className="flex flex-wrap gap-2">
            {ACCENT_COLORS.map((clr) => (
              <button
                key={clr}
                onClick={() => {
                  soundEffects.playPop();
                  handleColorChange('ac', clr);
                }}
                className={`w-7 h-7 rounded-xl border-2 transition-transform cursor-pointer shadow-sm ${
                  state.c.ac.toLowerCase() === clr.toLowerCase()
                    ? 'border-white scale-110 shadow-md ring-2 ring-orange-500'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: clr }}
                title={clr}
              />
            ))}
          </div>
        </div>

        {/* Radius Slider */}
        <div className="flex flex-col gap-1.5 mt-2">
          <div className="flex justify-between text-xs">
            <span className="font-medium">میزان گردی گوشه‌ها (Border Radius):</span>
            <span className="font-mono text-orange-500 font-bold">{state.c.r}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="28"
            value={state.c.r}
            onChange={(e) => handleRadiusChange(parseInt(e.target.value, 10))}
            className="w-full accent-orange-500 cursor-pointer"
          />
        </div>
      </section>

      {/* 4. Page Decoration Style */}
      <section className="flex flex-col gap-2.5 pt-4 border-t border-current/10">
        <div className="flex items-center gap-2 text-xs font-bold opacity-75">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>تزیینات گرافیکی حاشیه صفحه:</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'cn', label: 'گوشه بریده RCG' },
            { id: 'bar', label: 'نوار فوقانی' },
            { id: 'side', label: 'نوار عمودی راست' },
            { id: 'frm', label: 'کادر حاشیه' },
            { id: 'gradient', label: 'هاله گرادیان' },
            { id: 'no', label: 'ساده بدون طرح' },
          ].map((item) => {
            const isSelected = state.dc === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleDecorationChange(item.id as DecorationStyle)}
                className={`p-2 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500/10 font-bold ring-1 ring-orange-500/30'
                    : 'border-current/15 hover:border-orange-500/40 bg-black/5 dark:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Typography / Fonts & Weights */}
      <section className="flex flex-col gap-3 pt-4 border-t border-current/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold opacity-75">
            <Type className="w-4 h-4 text-orange-500" />
            <span>فونت و تایپوگرافی فارسی:</span>
          </div>
        </div>

        {/* Font Weight Selector */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl border border-current/15 bg-black/5 dark:bg-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold">وزن قلم (Font Weight):</span>
            <span className="text-[11px] font-mono text-orange-400 font-bold">
              {FONT_WEIGHTS[state.fw || 'medium'].weight}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-1">
            {(Object.keys(FONT_WEIGHTS) as FontWeightKey[]).map((wKey) => {
              const wItem = FONT_WEIGHTS[wKey];
              const isSelected = (state.fw || 'medium') === wKey;
              return (
                <button
                  key={wKey}
                  onClick={() => {
                    soundEffects.playPop();
                    onUpdateState((prev) => ({
                      ...prev,
                      fw: wKey,
                    }));
                  }}
                  className={`p-2 rounded-xl border text-right transition-all cursor-pointer flex flex-col gap-0.5 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-500/15 text-orange-400 font-bold shadow-sm'
                      : 'border-current/15 hover:border-orange-500/30'
                  }`}
                >
                  <span
                    className="text-xs"
                    style={{ fontWeight: wItem.weight }}
                  >
                    {wItem.label}
                  </span>
                  <span className="text-[9px] opacity-65 line-clamp-1">
                    {wItem.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Family List */}
        <div className="flex flex-col gap-1.5">
          {(Object.keys(FONT_CONFIG) as FontKey[]).map((fKey) => {
            const fItem = FONT_CONFIG[fKey];
            const isSelected = state.f === fKey;
            return (
              <button
                key={fKey}
                onClick={() => handleFontChange(fKey)}
                className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500/10 ring-1 ring-orange-500/40'
                    : 'border-current/15 hover:border-orange-500/40 bg-black/5 dark:bg-white/5'
                }`}
                style={{
                  fontFamily: fItem.bodyFont,
                  fontWeight: FONT_WEIGHTS[state.fw || 'medium'].weight,
                }}
              >
                <div className="flex flex-col gap-0.5">
                  <b className="text-sm">{fItem.name}</b>
                  <span className="text-[11px] opacity-65 font-sans font-normal">
                    {fKey === 'custom' && state.customFontName
                      ? `فایل انتخاب شده: ${state.customFontName}`
                      : fItem.desc}
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-orange-500" />}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
