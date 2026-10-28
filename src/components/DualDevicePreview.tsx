import React, { useState } from 'react';
import { CatalogState } from '../types/catalog';
import { CATALOG_SIZES, FONT_CONFIG, FONT_WEIGHTS } from '../constants/presets';
import { CatalogPageRenderer } from './CatalogPreview/CatalogPageRenderer';
import {
  Smartphone,
  Monitor,
  ChevronRight,
  ChevronLeft,
  X,
} from 'lucide-react';

interface DualDevicePreviewProps {
  state: CatalogState;
  onClose: () => void;
}

export const DualDevicePreview: React.FC<DualDevicePreviewProps> = ({
  state,
  onClose,
}) => {
  const [mobilePage, setMobilePage] = useState(0);
  const [desktopPage, setDesktopPage] = useState(0);
  const dim = CATALOG_SIZES[state.sz] || CATALOG_SIZES.a4;
  const total = state.pg.length;
  const fontConf = FONT_CONFIG[state.f] || FONT_CONFIG.v;

  const mobileScale = 320 / dim.width;
  const desktopScale = Math.min(0.65, 520 / dim.width);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 md:p-6 overflow-y-auto text-slate-100"
      style={{
        fontFamily: fontConf.bodyFont,
        fontWeight: FONT_WEIGHTS[state.fw || 'medium']?.weight || 500,
      }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shadow-md shadow-orange-500/20">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">
              پیش‌نمایش همزمان در موبایل و دسکتاپ
            </h2>
            <p className="text-xs text-slate-400">
              بررسی تعاملی صفحات و عملکرد دکمه‌ها و لینک‌ها روی گوشی و مانیتور
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-xs font-bold"
        >
          <X className="w-4 h-4" />
          <span>بستن پیش‌نمایش</span>
        </button>
      </div>

      {/* Side-by-side Devices Display */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 py-6 my-auto">
        {/* Device 1: Mobile Smartphone Mockup */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Smartphone className="w-4 h-4 text-orange-400" />
            <span>نمای گوشی هوشمند (Mobile View)</span>
          </div>
          <div className="relative w-[340px] h-[640px] bg-slate-900 border-4 border-slate-700 rounded-[44px] shadow-2xl p-2.5 flex flex-col items-center justify-between overflow-hidden">
            {/* Notch / Speaker */}
            <div className="w-28 h-5 bg-slate-950 rounded-b-xl flex items-center justify-center gap-2 z-20">
              <div className="w-3 h-3 rounded-full bg-slate-800" />
              <div className="w-8 h-1 rounded-full bg-slate-800" />
            </div>

            {/* Scaled Mobile Viewport */}
            <div className="flex-1 w-full flex items-center justify-center overflow-hidden my-1 relative">
              <div
                className="origin-center"
                style={{
                  transform: `scale(${mobileScale})`,
                  width: `${dim.width}px`,
                  height: `${dim.height}px`,
                }}
              >
                <CatalogPageRenderer
                  page={state.pg[mobilePage]}
                  pageIndex={mobilePage}
                  totalPages={total}
                  state={state}
                  onNavigatePage={(p) => setMobilePage(p)}
                  isInteractiveMode={true}
                />
              </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-950/80 rounded-2xl border border-white/5 text-xs z-20">
              <button
                disabled={mobilePage <= 0}
                onClick={() => setMobilePage((p) => p - 1)}
                className="p-1 rounded-full hover:bg-white/10 disabled:opacity-20 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="font-mono font-bold text-orange-400 text-[11px]">
                {mobilePage + 1} / {total}
              </span>
              <button
                disabled={mobilePage >= total - 1}
                onClick={() => setMobilePage((p) => p + 1)}
                className="p-1 rounded-full hover:bg-white/10 disabled:opacity-20 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            {/* Home indicator bar */}
            <div className="w-32 h-1 rounded-full bg-slate-600 mt-1 mb-0.5" />
          </div>
        </div>

        {/* Device 2: Desktop / Laptop Monitor Mockup */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Monitor className="w-4 h-4 text-blue-400" />
            <span>نمای نمایشگر دسکتاپ و تبلت (Desktop View)</span>
          </div>
          <div className="relative w-full max-w-[620px] bg-slate-900 border-4 border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            {/* Desktop Window Title Bar */}
            <div className="h-8 bg-slate-800 px-3 flex items-center justify-between border-b border-slate-700 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {state.title}
              </span>
              <div className="w-10" />
            </div>

            {/* Desktop Scaled Viewport */}
            <div className="w-full h-[480px] bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
              <div
                className="origin-center"
                style={{
                  transform: `scale(${desktopScale})`,
                  width: `${dim.width}px`,
                  height: `${dim.height}px`,
                }}
              >
                <CatalogPageRenderer
                  page={state.pg[desktopPage]}
                  pageIndex={desktopPage}
                  totalPages={total}
                  state={state}
                  onNavigatePage={(p) => setDesktopPage(p)}
                  isInteractiveMode={true}
                />
              </div>
            </div>

            {/* Desktop Bottom Navigation Bar */}
            <div className="p-3 bg-slate-850 border-t border-slate-800 flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <button
                  disabled={desktopPage <= 0}
                  onClick={() => setDesktopPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>صفحه قبلی</span>
                </button>
                <button
                  disabled={desktopPage >= total - 1}
                  onClick={() => setDesktopPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>صفحه بعدی</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs font-bold font-mono text-orange-400">
                صفحه {desktopPage + 1} از {total}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
