import React, { useState, useEffect } from 'react';
import { CatalogState } from '../types/catalog';
import { CATALOG_SIZES, FONT_CONFIG, FONT_WEIGHTS } from '../constants/presets';
import { CatalogPageRenderer } from './CatalogPreview/CatalogPageRenderer';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  ChevronLeft,
  X,
  Menu,
} from 'lucide-react';

interface FullscreenViewerProps {
  state: CatalogState;
  initialPage: number;
  onClose: () => void;
}

export const FullscreenViewer: React.FC<FullscreenViewerProps> = ({
  state,
  initialPage,
  onClose,
}) => {
  const [cur, setCur] = useState(initialPage);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [direction, setDirection] = useState(1);
  const [scale, setScale] = useState(1);

  const dim = CATALOG_SIZES[state.sz] || CATALOG_SIZES.a4;
  const c = state.c;
  const total = state.pg.length;
  const fontConf = FONT_CONFIG[state.f] || FONT_CONFIG.v;

  useEffect(() => {
    const handleResize = () => {
      const availW = window.innerWidth - (window.innerWidth < 640 ? 16 : 48);
      const availH = window.innerHeight - (window.innerWidth < 640 ? 90 : 110);
      const s = Math.max(0.2, Math.min(1.2, Math.min(availW / dim.width, availH / dim.height)));
      setScale(s);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dim.width, dim.height]);

  const handlePrev = () => {
    if (cur > 0) {
      setDirection(-1);
      setCur((p) => p - 1);
    }
  };

  const handleNext = () => {
    if (cur < total - 1) {
      setDirection(1);
      setCur((p) => p + 1);
    }
  };

  const handleJump = (idx: number) => {
    setDirection(idx > cur ? 1 : -1);
    setCur(idx);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleNext();
      if (e.key === 'ArrowRight') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [cur, total]);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-between p-4 overflow-hidden select-none"
      style={{
        fontFamily: fontConf.bodyFont,
        fontWeight: FONT_WEIGHTS[state.fw || 'medium']?.weight || 500,
      }}
    >
      {/* Top Floating Header */}
      <div className="w-full flex items-center justify-between z-30 max-w-5xl">
        <div className="flex items-center gap-3">
          <span
            className="w-3.5 h-3.5 rounded-full shadow-sm"
            style={{ backgroundColor: c.ac }}
          />
          <h1 className="text-sm md:text-base font-black text-white truncate max-w-xs md:max-w-md">
            {state.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline">فهرست صفحات</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-red-500/80 text-white transition-colors cursor-pointer"
            title="خروج از حالت تمام صفحه (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Catalog Viewport */}
      <div className="flex-1 flex items-center justify-center w-full relative min-h-0">
        <div
          className="relative transition-all duration-300"
          style={{
            width: `${dim.width * scale}px`,
            height: `${dim.height * scale}px`,
          }}
        >
          <div
            className="absolute top-0 left-0 origin-top-left"
            style={{
              transform: `scale(${scale})`,
              width: `${dim.width}px`,
              height: `${dim.height}px`,
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={cur}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full"
              >
                <CatalogPageRenderer
                  page={state.pg[cur]}
                  pageIndex={cur}
                  totalPages={total}
                  state={state}
                  onNavigatePage={handleJump}
                  isInteractiveMode={true}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div
        className="flex items-center gap-3 px-6 py-2.5 rounded-full shadow-2xl border border-white/10 z-30 mb-2 backdrop-blur-md"
        style={{
          backgroundColor: c.bg,
          color: c.fg,
        }}
      >
        <button
          onClick={handlePrev}
          disabled={cur <= 0}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 hover:opacity-100"
          style={{
            backgroundColor: `color-mix(in srgb, ${c.fg} 10%, transparent)`,
          }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <span className="text-xs font-black font-mono px-3">
          {cur + 1} / {total}
        </span>
        <button
          onClick={handleNext}
          disabled={cur >= total - 1}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 hover:opacity-100"
          style={{
            backgroundColor: `color-mix(in srgb, ${c.fg} 10%, transparent)`,
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Table of Contents Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md p-6 rounded-3xl shadow-2xl z-10 flex flex-col gap-4 text-right max-h-[80vh] overflow-y-auto"
              style={{
                backgroundColor: c.bg,
                color: c.fg,
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-current/15">
                <h3 className="font-black text-base" style={{ color: c.ac }}>
                  فهرست صفحات کاتالوگ
                </h3>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-lg opacity-70 hover:opacity-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {state.pg.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => handleJump(idx)}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                      idx === cur
                        ? 'font-bold shadow-sm'
                        : 'opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                    style={{
                      backgroundColor:
                        idx === cur
                          ? `color-mix(in srgb, ${c.ac} 18%, transparent)`
                          : 'transparent',
                      color: idx === cur ? c.ac : 'inherit',
                    }}
                  >
                    <span>{p.t}</span>
                    <span className="font-mono text-xs font-bold">
                      صفحه {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
