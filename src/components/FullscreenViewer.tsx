import React, { useState, useEffect } from 'react';
import { CatalogState } from '../types/catalog';
import { CATALOG_SIZES, FONT_CONFIG, FONT_WEIGHTS } from '../constants/presets';
import { CatalogPageRenderer } from './CatalogPreview/CatalogPageRenderer';
import { motion, AnimatePresence, type Variants } from 'motion/react';
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

// Staggered Container for TOC navigation items
const tocListVariants: Variants = {
  closed: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
  open: {
    opacity: 1,
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.045,
    },
  },
};

// Item Animation combining Fade-In, Slide-In (from right), and Scale-Up
const tocItemVariants: Variants = {
  closed: {
    opacity: 0,
    x: 30,
    scale: 0.9,
    transition: {
      duration: 0.18,
      ease: [0.32, 0, 0.67, 0] as const,
    },
  },
  open: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 24,
      stiffness: 280,
    },
  },
};

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

  const getFullscreenVariants = (): Variants => {
    const tr = state.nav.tr;
    switch (tr) {
      case 'flip':
        return {
          initial: { opacity: 0, rotateY: direction > 0 ? 80 : -80, transformOrigin: direction > 0 ? 'right center' : 'left center', transformPerspective: 1400, scale: 0.95 },
          animate: { opacity: 1, rotateY: 0, transformPerspective: 1400, scale: 1, transition: { duration: 0.65, ease: [0.25, 1, 0.5, 1] as const } },
          exit: { opacity: 0, rotateY: direction > 0 ? -80 : 80, transformOrigin: direction > 0 ? 'left center' : 'right center', transformPerspective: 1400, scale: 0.95, transition: { duration: 0.5 } },
        };
      case 'curl':
        return {
          initial: { opacity: 0, rotateZ: direction > 0 ? -12 : 12, rotateY: direction > 0 ? 65 : -65, transformOrigin: direction > 0 ? 'top right' : 'top left', transformPerspective: 1200, scale: 0.92 },
          animate: { opacity: 1, rotateZ: 0, rotateY: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
          exit: { opacity: 0, rotateZ: direction > 0 ? 12 : -12, rotateY: direction > 0 ? -65 : 65, scale: 0.92, transition: { duration: 0.45 } },
        };
      case 'cube':
        return {
          initial: { opacity: 0, rotateY: direction > 0 ? 90 : -90, x: direction > 0 ? 120 : -120, transformPerspective: 1500 },
          animate: { opacity: 1, rotateY: 0, x: 0, transformPerspective: 1500, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const } },
          exit: { opacity: 0, rotateY: direction > 0 ? -90 : 90, x: direction > 0 ? -120 : 120, transformPerspective: 1500, transition: { duration: 0.5 } },
        };
      case 'magazine':
        return {
          initial: { opacity: 0, rotateY: direction > 0 ? 55 : -55, transformOrigin: direction > 0 ? 'right center' : 'left center', transformPerspective: 1300, scale: 0.96 },
          animate: { opacity: 1, rotateY: 0, scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
          exit: { opacity: 0, rotateY: direction > 0 ? -55 : 55, scale: 0.96, transition: { duration: 0.45 } },
        };
      case 'stack':
        return {
          initial: { opacity: 0, y: direction > 0 ? 60 : -60, scale: 0.88, rotate: direction > 0 ? 4 : -4 },
          animate: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { type: 'spring', damping: 22, stiffness: 260 } },
          exit: { opacity: 0, y: direction > 0 ? -50 : 50, scale: 1.05, transition: { duration: 0.35 } },
        };
      case 'slide':
        return {
          initial: { opacity: 0, x: direction * -80 },
          animate: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
          exit: { opacity: 0, x: direction * 80, transition: { duration: 0.35 } },
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.85 },
          animate: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
          exit: { opacity: 0, scale: 1.08, transition: { duration: 0.35 } },
        };
      case 'rise':
        return {
          initial: { opacity: 0, y: 50, scale: 0.96 },
          animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 22, stiffness: 280 } },
          exit: { opacity: 0, y: -40, scale: 0.98, transition: { duration: 0.35 } },
        };
      case 'soft-scale':
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
          exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3 } },
        };
      case 'none':
        return {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          exit: { opacity: 1 },
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: 0.35, ease: 'easeInOut' as const } },
          exit: { opacity: 0, transition: { duration: 0.25 } },
        };
    }
  };

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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline">فهرست صفحات</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-red-500/80 text-white transition-colors cursor-pointer"
            title="خروج از حالت تمام صفحه (Esc)"
          >
            <X className="w-5 h-5" />
          </motion.button>
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
                variants={getFullscreenVariants()}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  duration: state.nav.tr === 'none' ? 0 : 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
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
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="flex items-center gap-3 px-6 py-2.5 rounded-full shadow-2xl border border-white/10 z-30 mb-2 backdrop-blur-md"
        style={{
          backgroundColor: c.bg,
          color: c.fg,
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={handlePrev}
          disabled={cur <= 0}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 hover:opacity-100"
          style={{
            backgroundColor: `color-mix(in srgb, ${c.fg} 10%, transparent)`,
          }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
        <span className="text-xs font-black font-mono px-3">
          {cur + 1} / {total}
        </span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleNext}
          disabled={cur >= total - 1}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 hover:opacity-100"
          style={{
            backgroundColor: `color-mix(in srgb, ${c.fg} 10%, transparent)`,
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Table of Contents Modal with Staggered Fade-in, Slide-in, and Scale-up */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md p-6 rounded-3xl shadow-2xl z-10 flex flex-col gap-4 text-right max-h-[82vh] overflow-hidden"
              style={{
                backgroundColor: c.bg,
                color: c.fg,
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-current/15">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: c.ac }}
                  />
                  <h3 className="font-black text-base" style={{ color: c.ac }}>
                    فهرست صفحات کاتالوگ
                  </h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-xl opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Staggered Navigation List */}
              <motion.div
                variants={tocListVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="flex flex-col gap-2 overflow-y-auto pr-1 -mr-1 max-h-[calc(82vh-100px)] custom-scrollbar"
              >
                {state.pg.map((p, idx) => (
                  <motion.button
                    key={p.id}
                    variants={tocItemVariants}
                    whileHover={{ scale: 1.02, x: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleJump(idx)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl transition-colors cursor-pointer border ${
                      idx === cur
                        ? 'font-bold shadow-md border-current/25'
                        : 'opacity-85 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 border-transparent'
                    }`}
                    style={{
                      backgroundColor:
                        idx === cur
                          ? `color-mix(in srgb, ${c.ac} 18%, transparent)`
                          : 'transparent',
                      color: idx === cur ? c.ac : 'inherit',
                    }}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-mono font-black flex items-center justify-center shrink-0 ${
                          idx === cur ? 'bg-current text-white' : 'bg-black/10 dark:bg-white/10'
                        }`}
                        style={idx === cur ? { backgroundColor: c.ac, color: '#fff' } : {}}
                      >
                        {idx + 1}
                      </span>
                      <span className="truncate text-sm font-semibold">{p.t}</span>
                    </div>
                    <span className="font-mono text-xs opacity-60 shrink-0">
                      صفحه {idx + 1}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
