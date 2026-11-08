import React, { useState, useEffect, useRef } from 'react';
import { CatalogState } from '../../types/catalog';
import { CATALOG_SIZES, FONT_CONFIG, FONT_WEIGHTS } from '../../constants/presets';
import { CatalogPageRenderer } from './CatalogPageRenderer';
import { SelectionFloatingToolbar } from './SelectionFloatingToolbar';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import {
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Plus,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Hand,
  Move,
  Layers,
  Tag,
  Zap,
  Bookmark,
} from 'lucide-react';

interface CatalogStageProps {
  state: CatalogState;
  currentPageIndex: number;
  selectedBlockId?: string;
  selectedBlockIds?: string[];
  onSelectBlock?: (blockId: string, isMulti?: boolean) => void;
  onPageChange: (index: number) => void;
  onAddPage: () => void;
  onToggleFullscreen?: () => void;
  onUpdateBlockPosition?: (blockId: string, posX: number, posY: number) => void;
  onTogglePageLayoutMode?: () => void;
  onBatchDelete?: () => void;
  onBatchResizeDelta?: (delta: number) => void;
  onBatchSetScale?: (scale: number) => void;
  onBatchDuplicate?: () => void;
  onBatchChangeLayer?: (action: 'front' | 'back' | 'forward' | 'backward') => void;
  onBatchAlign?: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onBatchDistribute?: (direction: 'horizontal' | 'vertical') => void;
  onBatchToggleLock?: (forcedState?: boolean) => void;
  onSelectAllBlocks?: () => void;
  onClearSelection?: () => void;
}

// Staggered Container for Table of Contents navigation menu items
const tocListVariants: Variants = {
  closed: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.045,
    },
  },
};

// Item animation combining Fade-In, Slide-In (from right), and Scale-Up
const tocItemVariants: Variants = {
  closed: {
    opacity: 0,
    x: 30,
    scale: 0.9,
    transition: {
      duration: 0.16,
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

export const CatalogStage: React.FC<CatalogStageProps> = ({
  state,
  currentPageIndex,
  selectedBlockId,
  selectedBlockIds = [],
  onSelectBlock,
  onPageChange,
  onAddPage,
  onToggleFullscreen,
  onUpdateBlockPosition,
  onTogglePageLayoutMode,
  onBatchDelete,
  onBatchResizeDelta,
  onBatchSetScale,
  onBatchDuplicate,
  onBatchChangeLayer,
  onBatchAlign,
  onBatchDistribute,
  onBatchToggleLock,
  onSelectAllBlocks,
  onClearSelection,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.85);
  const [zoomManual, setZoomManual] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [direction, setDirection] = useState(1);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Canvas Pan (Space + Mouse Drag or Pan Tool)
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanToolActive, setIsPanToolActive] = useState(false);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const dim = CATALOG_SIZES[state.sz] || CATALOG_SIZES.a4;
  const c = state.c;
  const fontConf = FONT_CONFIG[state.f] || FONT_CONFIG.v;
  const totalPages = state.pg.length;
  const currentPage = state.pg[currentPageIndex] || state.pg[0];

  const isPanMode = isSpacePressed || isPanToolActive;

  // Auto-calculate responsive scale
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const availWidth = rect.width - (window.innerWidth < 768 ? 24 : 48);
      const availHeight = rect.height - (window.innerWidth < 768 ? 140 : 160);
      const sX = availWidth / dim.width;
      const sY = availHeight / dim.height;
      const calculatedScale = Math.max(0.2, Math.min(1.15, Math.min(sX, sY)));
      setScale(calculatedScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dim.width, dim.height, state.sz]);

  const effectiveScale = zoomManual ?? scale;

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setDirection(-1);
      onPageChange(currentPageIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) {
      setDirection(1);
      onPageChange(currentPageIndex + 1);
    }
  };

  const handleJump = (idx: number) => {
    setDirection(idx > currentPageIndex ? 1 : -1);
    onPageChange(idx);
    setIsMenuOpen(false);
  };

  // Space key listener for Canvas Pan + Arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
      if (e.key === 'ArrowLeft') handleNext();
      if (e.key === 'ArrowRight') handlePrev();
      if (e.key === 'Escape' && isMenuOpen) setIsMenuOpen(false);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsDraggingCanvas(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentPageIndex, totalPages, isMenuOpen]);

  // Mouse pan handlers
  const handleStageMouseDown = (e: React.MouseEvent) => {
    if (isPanMode && e.button === 0) {
      e.preventDefault();
      setIsDraggingCanvas(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      startOffsetRef.current = { ...panOffset };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingCanvas) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPanOffset({
        x: startOffsetRef.current.x + dx,
        y: startOffsetRef.current.y + dy,
      });
    };

    const handleMouseUp = () => {
      if (isDraggingCanvas) {
        setIsDraggingCanvas(false);
      }
    };

    if (isDraggingCanvas) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingCanvas]);

  const handleResetPan = () => {
    setPanOffset({ x: 0, y: 0 });
  };

  // Expanded Rich Page Flip and Transition Variants
  const getVariants = (): Variants => {
    const tr = state.nav.tr;
    switch (tr) {
      case 'flip':
        // 3D Realistic Book Page Flip with perspective
        return {
          initial: {
            opacity: 0,
            rotateY: direction > 0 ? 80 : -80,
            transformOrigin: direction > 0 ? 'right center' : 'left center',
            transformPerspective: 1400,
            scale: 0.95,
          },
          animate: {
            opacity: 1,
            rotateY: 0,
            transformOrigin: direction > 0 ? 'right center' : 'left center',
            transformPerspective: 1400,
            scale: 1,
            transition: { duration: 0.65, ease: [0.25, 1, 0.5, 1] as const },
          },
          exit: {
            opacity: 0,
            rotateY: direction > 0 ? -80 : 80,
            transformOrigin: direction > 0 ? 'left center' : 'right center',
            transformPerspective: 1400,
            scale: 0.95,
            transition: { duration: 0.5, ease: [0.5, 0, 0.75, 0] as const },
          },
        };

      case 'curl':
        // Magazine Corner Curl & Page Fold
        return {
          initial: {
            opacity: 0,
            rotateZ: direction > 0 ? -12 : 12,
            rotateY: direction > 0 ? 65 : -65,
            transformOrigin: direction > 0 ? 'top right' : 'top left',
            transformPerspective: 1200,
            scale: 0.92,
          },
          animate: {
            opacity: 1,
            rotateZ: 0,
            rotateY: 0,
            transformOrigin: direction > 0 ? 'top right' : 'top left',
            transformPerspective: 1200,
            scale: 1,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
          },
          exit: {
            opacity: 0,
            rotateZ: direction > 0 ? 12 : -12,
            rotateY: direction > 0 ? -65 : 65,
            transformOrigin: direction > 0 ? 'top left' : 'top right',
            transformPerspective: 1200,
            scale: 0.92,
            transition: { duration: 0.45 },
          },
        };

      case 'cube':
        // 3D Cube Rotation
        return {
          initial: {
            opacity: 0,
            rotateY: direction > 0 ? 90 : -90,
            x: direction > 0 ? 120 : -120,
            transformPerspective: 1500,
          },
          animate: {
            opacity: 1,
            rotateY: 0,
            x: 0,
            transformPerspective: 1500,
            transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const },
          },
          exit: {
            opacity: 0,
            rotateY: direction > 0 ? -90 : 90,
            x: direction > 0 ? -120 : 120,
            transformPerspective: 1500,
            transition: { duration: 0.5 },
          },
        };

      case 'magazine':
        // Luxury Magazine Spread Turn
        return {
          initial: {
            opacity: 0,
            rotateY: direction > 0 ? 55 : -55,
            transformOrigin: direction > 0 ? 'right center' : 'left center',
            transformPerspective: 1300,
            scale: 0.96,
          },
          animate: {
            opacity: 1,
            rotateY: 0,
            transformOrigin: direction > 0 ? 'right center' : 'left center',
            transformPerspective: 1300,
            scale: 1,
            transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
          },
          exit: {
            opacity: 0,
            rotateY: direction > 0 ? -55 : 55,
            transformOrigin: direction > 0 ? 'left center' : 'right center',
            transformPerspective: 1300,
            scale: 0.96,
            transition: { duration: 0.45 },
          },
        };

      case 'stack':
        // Card Deck Stack Fan & Slide
        return {
          initial: {
            opacity: 0,
            y: direction > 0 ? 60 : -60,
            scale: 0.88,
            rotate: direction > 0 ? 4 : -4,
          },
          animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            transition: { type: 'spring', damping: 22, stiffness: 260 },
          },
          exit: {
            opacity: 0,
            y: direction > 0 ? -50 : 50,
            scale: 1.05,
            transition: { duration: 0.35 },
          },
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

  // Unique categories across all pages
  const allCategories = Array.from(
    new Set(
      state.pg
        .map((p) => p.category?.trim())
        .filter((cat): cat is string => Boolean(cat && cat.length > 0))
    )
  );

  const displayedPages =
    selectedCategoryFilter === 'all'
      ? state.pg.map((p, idx) => ({ page: p, originalIndex: idx }))
      : state.pg
          .map((p, idx) => ({ page: p, originalIndex: idx }))
          .filter((item) => (item.page.category || 'سایر') === selectedCategoryFilter);

  // Render navigation bar
  const renderNavBar = () => {
    const nav = state.nav;
    const isRound = nav.sh === 'round';
    const btnShape = isRound ? 'rounded-full' : 'rounded-xl';

    return (
      <div className="flex flex-col items-center gap-1.5 z-30">
        <motion.div
          layout
          className={`flex items-center gap-2.5 px-4 py-2 border shadow-2xl backdrop-blur-md transition-all duration-300 ${
            isRound ? 'rounded-full' : 'rounded-2xl'
          }`}
          style={{
            backgroundColor: c.bg,
            color: c.fg,
            borderColor: `color-mix(in srgb, ${c.fg} 15%, transparent)`,
          }}
        >
          <button
            onClick={handlePrev}
            disabled={currentPageIndex <= 0}
            className={`w-9 h-9 flex items-center justify-center transition-all cursor-pointer disabled:opacity-25 disabled:pointer-events-none hover:text-white active:scale-95 ${btnShape}`}
            style={{
              backgroundColor: `color-mix(in srgb, ${c.fg} 10%, transparent)`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.ac)}
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = `color-mix(in srgb, ${c.fg} 10%, transparent)`)
            }
            title="صفحه قبل (کلید راست)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Center navigation component */}
          {nav.st === 'dots' ? (
            <div className="flex items-center gap-1.5 px-2">
              {state.pg.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleJump(i)}
                  className={`transition-all duration-300 cursor-pointer ${
                    i === currentPageIndex
                      ? 'w-7 h-2.5 rounded-full shadow-sm'
                      : 'w-2.5 h-2.5 rounded-full opacity-40 hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: i === currentPageIndex ? c.ac : c.fg,
                  }}
                />
              ))}
            </div>
          ) : nav.st === 'tabs' ? (
            <div className="flex items-center gap-1 px-1">
              {state.pg.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleJump(i)}
                  className={`w-7 h-7 text-xs font-bold transition-all cursor-pointer rounded-lg ${
                    i === currentPageIndex ? 'text-white shadow-sm' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: i === currentPageIndex ? c.ac : 'transparent',
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          ) : nav.st === 'line' ? (
            <div className="w-32 h-2.5 rounded-full overflow-hidden bg-black/15 dark:bg-white/15 mx-1">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${((currentPageIndex + 1) / totalPages) * 100}%`,
                  backgroundColor: c.ac,
                }}
              />
            </div>
          ) : nav.st === 'mini' ? (
            <span className="text-xs font-extrabold opacity-80 px-2 font-mono">
              {currentPageIndex + 1}
            </span>
          ) : (
            <div className="flex items-center gap-1.5 px-2 text-xs font-bold font-mono">
              <span style={{ color: c.ac }}>{currentPageIndex + 1}</span>
              <span className="opacity-40">/</span>
              <span>{totalPages}</span>
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={currentPageIndex >= totalPages - 1}
            className={`w-9 h-9 flex items-center justify-center transition-all cursor-pointer disabled:opacity-25 disabled:pointer-events-none hover:text-white active:scale-95 ${btnShape}`}
            style={{
              backgroundColor: `color-mix(in srgb, ${c.fg} 10%, transparent)`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.ac)}
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = `color-mix(in srgb, ${c.fg} 10%, transparent)`)
            }
            title="صفحه بعد (کلید چپ)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="h-5 w-px bg-current/20 mx-0.5" />

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-9 h-9 flex items-center justify-center transition-all cursor-pointer hover:text-white active:scale-95 ${btnShape}`}
            style={{
              backgroundColor: isMenuOpen ? c.ac : `color-mix(in srgb, ${c.fg} 10%, transparent)`,
              color: isMenuOpen ? '#fff' : 'inherit',
            }}
            title="فهرست و منوی صفحات"
          >
            <Menu className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Quick Shortcuts Bar in Navigation */}
        {nav.quickShortcutsEnabled !== false && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 dark:bg-black/50 backdrop-blur-md border border-white/10 text-[10px] text-white/90">
            <span className="flex items-center gap-1 font-bold text-amber-300">
              <Zap className="w-3 h-3" />
              <span>دسترسی پرکاربرد:</span>
            </span>
            <button
              onClick={() => handleJump(0)}
              className="px-2 py-0.5 rounded-md hover:bg-white/20 transition-colors cursor-pointer font-medium"
            >
              صفحه ۱
            </button>
            {state.pg.length > 2 && (
              <button
                onClick={() => handleJump(Math.floor(state.pg.length / 2))}
                className="px-2 py-0.5 rounded-md hover:bg-white/20 transition-colors cursor-pointer font-medium"
              >
                میانه
              </button>
            )}
            <button
              onClick={() => handleJump(state.pg.length - 1)}
              className="px-2 py-0.5 rounded-md hover:bg-white/20 transition-colors cursor-pointer font-medium"
            >
              آخرین صفحه
            </button>
            {currentPage.category && (
              <span className="mr-1 px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                {currentPage.category}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render TOC modal/drawer with content categorization & quick shortcuts
  const renderTocDrawer = () => {
    const mn = state.nav.mn;
    const panelClass = 'p-6 flex flex-col gap-3 shadow-2xl';
    let panelPosClass = '';

    if (mn === 'side') {
      panelPosClass = 'top-0 bottom-0 right-0 w-88 max-w-[90%]';
    } else if (mn === 'bottom') {
      panelPosClass = 'bottom-0 left-0 right-0 max-h-[80%] rounded-t-3xl';
    } else if (mn === 'center') {
      panelPosClass = 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 max-w-[92%] rounded-2xl max-h-[85vh]';
    } else {
      panelPosClass = 'inset-0 items-center justify-center';
    }

    return (
      <AnimatePresence>
        {isMenuOpen && (
          <div className="absolute inset-0 z-50 overflow-hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Menu Panel */}
            <motion.div
              initial={
                mn === 'side'
                  ? { x: '100%' }
                  : mn === 'bottom'
                  ? { y: '100%' }
                  : mn === 'center'
                  ? { scale: 0.9, opacity: 0, x: '-50%', y: '-50%' }
                  : { opacity: 0 }
              }
              animate={
                mn === 'side'
                  ? { x: 0 }
                  : mn === 'bottom'
                  ? { y: 0 }
                  : mn === 'center'
                  ? { scale: 1, opacity: 1, x: '-50%', y: '-50%' }
                  : { opacity: 1 }
              }
              exit={
                mn === 'side'
                  ? { x: '100%' }
                  : mn === 'bottom'
                  ? { y: '100%' }
                  : mn === 'center'
                  ? { scale: 0.9, opacity: 0, x: '-50%', y: '-50%' }
                  : { opacity: 0 }
              }
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className={`absolute ${panelPosClass} ${panelClass} overflow-y-auto`}
              style={{
                backgroundColor: c.bg,
                color: c.fg,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-current/15">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: c.ac }}
                  />
                  <div>
                    <h3 className="font-extrabold text-base" style={{ color: c.ac }}>
                      فهرست و دسته‌بندی کاتالوگ
                    </h3>
                    <p className="text-[11px] opacity-70">
                      {state.pg.length} صفحه در {allCategories.length || 1} دسته‌بندی
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-xl opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Filter Tabs */}
              {allCategories.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar border-b border-current/10">
                  <button
                    onClick={() => setSelectedCategoryFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-none ${
                      selectedCategoryFilter === 'all'
                        ? 'text-white shadow-sm'
                        : 'opacity-70 hover:opacity-100 bg-black/5 dark:bg-white/5'
                    }`}
                    style={{
                      backgroundColor: selectedCategoryFilter === 'all' ? c.ac : undefined,
                    }}
                  >
                    همه ({state.pg.length})
                  </button>
                  {allCategories.map((cat) => {
                    const count = state.pg.filter((p) => p.category === cat).length;
                    const isActive = selectedCategoryFilter === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-none flex items-center gap-1 ${
                          isActive
                            ? 'text-white shadow-sm'
                            : 'opacity-70 hover:opacity-100 bg-black/5 dark:bg-white/5'
                        }`}
                        style={{
                          backgroundColor: isActive ? c.ac : undefined,
                        }}
                      >
                        <Tag className="w-3 h-3" />
                        <span>{cat}</span>
                        <span className="text-[10px] opacity-75">({count})</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Quick Jump Shortcuts Section */}
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-black/5 dark:bg-white/5 text-[11px]">
                <Zap className="w-3.5 h-3.5 text-amber-500 flex-none" />
                <span className="font-bold opacity-80 flex-none">پرکاربرد:</span>
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => handleJump(0)}
                    className="px-2 py-0.5 rounded-lg bg-current/10 hover:bg-current/20 transition-all font-semibold flex-none"
                  >
                    شروع کاتالوگ
                  </button>
                  {state.pg.find((p) => p.category === 'محصولات') && (
                    <button
                      onClick={() => {
                        const idx = state.pg.findIndex((p) => p.category === 'محصولات');
                        if (idx >= 0) handleJump(idx);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-current/10 hover:bg-current/20 transition-all font-semibold flex-none"
                    >
                      بخش محصولات
                    </button>
                  )}
                  {state.pg.find((p) => p.category === 'تماس با ما') && (
                    <button
                      onClick={() => {
                        const idx = state.pg.findIndex((p) => p.category === 'تماس با ما');
                        if (idx >= 0) handleJump(idx);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-current/10 hover:bg-current/20 transition-all font-semibold flex-none"
                    >
                      اطلاعات تماس
                    </button>
                  )}
                  <button
                    onClick={() => handleJump(state.pg.length - 1)}
                    className="px-2 py-0.5 rounded-lg bg-current/10 hover:bg-current/20 transition-all font-semibold flex-none"
                  >
                    صفحه پایانی
                  </button>
                </div>
              </div>

              {/* Menu items list with staggered Fade-In, Slide-In and Scale-Up */}
              <motion.div
                variants={tocListVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="flex flex-col gap-2 my-2 flex-1 overflow-y-auto no-scrollbar"
              >
                {displayedPages.map(({ page: p, originalIndex: idx }) => (
                  <motion.button
                    key={p.id}
                    variants={tocItemVariants}
                    whileHover={{ scale: 1.02, x: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleJump(idx)}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer text-right shadow-sm ${
                      idx === currentPageIndex
                        ? 'font-extrabold shadow-md'
                        : 'opacity-85 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                    style={{
                      backgroundColor:
                        idx === currentPageIndex
                          ? `color-mix(in srgb, ${c.ac} 20%, transparent)`
                          : 'color-mix(in srgb, var(--card-sf, currentColor) 5%, transparent)',
                      color: idx === currentPageIndex ? c.ac : 'inherit',
                      border:
                        idx === currentPageIndex
                          ? `1px solid color-mix(in srgb, ${c.ac} 40%, transparent)`
                          : '1px solid transparent',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center font-mono shadow-sm flex-none"
                        style={{
                          backgroundColor:
                            idx === currentPageIndex ? c.ac : 'var(--card-sf, rgba(120,120,120,0.15))',
                          color: idx === currentPageIndex ? '#fff' : 'inherit',
                        }}
                      >
                        {idx + 1}
                      </span>
                      <div className="flex flex-col text-right">
                        <span className="text-sm font-semibold">{p.t}</span>
                        {p.category && (
                          <span className="text-[10px] opacity-60 flex items-center gap-1 mt-0.5">
                            <Tag className="w-2.5 h-2.5" />
                            {p.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-none">
                      {p.fullPageLink?.enabled && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-lg font-bold flex items-center gap-1"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${c.ac} 25%, transparent)`,
                            color: c.ac,
                          }}
                          title={`دارای لینک تمام‌صفحه به ${p.fullPageLink.url || p.fullPageLink.targetPageId}`}
                        >
                          🔗 تمام‌صفحه
                        </span>
                      )}
                      {p.toc && (
                        <span className="text-[10px] px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 opacity-70">
                          فهرست
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </motion.div>

              <motion.button
                variants={tocItemVariants}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onAddPage();
                  setIsMenuOpen(false);
                }}
                className="mt-auto flex items-center justify-center gap-2 py-3 border-2 border-dashed border-current/25 rounded-2xl text-xs font-bold hover:border-current transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن صفحه جدید</span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 w-full h-full flex flex-col items-center justify-between overflow-hidden p-3 md:p-6"
      style={{
        fontFamily: fontConf.bodyFont,
        fontWeight: FONT_WEIGHTS[state.fw || 'medium']?.weight || 500,
      }}
    >
      {/* Top Floating Utility Controls (Zoom, Pan, Fit, Fullscreen) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white/90 p-1.5 rounded-2xl border border-white/10 text-xs shadow-xl">
        {/* Pan Tool Toggle */}
        <button
          onClick={() => setIsPanToolActive((prev) => !prev)}
          className={`p-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
            isPanMode
              ? 'bg-orange-500 text-white shadow-md ring-1 ring-orange-300'
              : 'hover:bg-white/20 text-slate-300 hover:text-white'
          }`}
          title="ابزار حرکت صفحه (Pan) - نگه‌داشتن کلید Space و حرکت موس"
        >
          <Hand className="w-4 h-4" />
          <span className="text-[10px] font-bold hidden sm:inline">
            {isPanMode ? 'Pan فعال' : 'Pan (Space)'}
          </span>
        </button>

        <div className="h-4 w-px bg-white/20 mx-0.5" />

        <button
          onClick={() => setZoomManual((prev) => Math.min(1.4, (prev ?? scale) + 0.1))}
          className="p-1.5 hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
          title="بزرگ‌نمایی"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="px-1.5 font-mono text-[11px] font-bold">
          {Math.round(effectiveScale * 100)}%
        </span>
        <button
          onClick={() => setZoomManual((prev) => Math.max(0.25, (prev ?? scale) - 0.1))}
          className="p-1.5 hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
          title="کوچک‌نمایی"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {(zoomManual !== null || panOffset.x !== 0 || panOffset.y !== 0) && (
          <button
            onClick={() => {
              setZoomManual(null);
              handleResetPan();
            }}
            className="p-1.5 hover:bg-white/20 rounded-xl transition-colors cursor-pointer text-orange-400 flex items-center gap-1"
            title="بازنشانی اندازه و موقعیت بوم به مرکز (Reset View)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">ریست بوم</span>
          </button>
        )}

        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 hover:bg-white/20 rounded-xl transition-colors cursor-pointer mr-0.5 border-r border-white/15"
            title="حالت پرده کامل (Fullscreen)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Floating Space + Pan Active Indicator */}
      {isPanMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/90 text-white text-xs font-bold shadow-xl border border-orange-300/40 backdrop-blur-md">
          <Hand className="w-4 h-4 animate-bounce" />
          <span>حالت جابه‌جایی بوم فعال است (موس را بکشید یا کلید Space را رها کنید)</span>
        </div>
      )}

      {/* Top Navigation if configured */}
      {state.nav.ps === 'top' && (
        <div className="mb-3 flex-none">{renderNavBar()}</div>
      )}

      {/* Center Scaled Viewport Container with Canvas Pan Interaction */}
      <div
        onMouseDown={handleStageMouseDown}
        className={`flex-1 flex items-center justify-center w-full min-h-0 relative select-none ${
          isPanMode ? (isDraggingCanvas ? 'cursor-grabbing' : 'cursor-grab') : ''
        }`}
      >
        <div
          className="relative transition-all duration-150"
          style={{
            width: `${dim.width * effectiveScale}px`,
            height: `${dim.height * effectiveScale}px`,
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          <div
            className="absolute top-0 left-0 origin-top-left"
            style={{
              transform: `scale(${effectiveScale})`,
              width: `${dim.width}px`,
              height: `${dim.height}px`,
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentPage.id}
                variants={getVariants()}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  duration: state.nav.tr === 'none' ? 0 : 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-full h-full"
              >
                <CatalogPageRenderer
                  page={currentPage}
                  pageIndex={currentPageIndex}
                  totalPages={totalPages}
                  state={state}
                  selectedBlockId={selectedBlockId}
                  selectedBlockIds={selectedBlockIds}
                  onSelectBlock={isPanMode ? undefined : onSelectBlock}
                  onNavigatePage={handleJump}
                  onUpdateBlockPosition={onUpdateBlockPosition}
                  onTogglePageLayoutMode={onTogglePageLayoutMode}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Drawer / Menu Overlay within viewport */}
          {renderTocDrawer()}
        </div>

        {/* Floating Selection & Batch Operations Toolbar (Resize, Layer, Delete) */}
        {((selectedBlockIds && selectedBlockIds.length > 0) || selectedBlockId) && onBatchDelete && (
          <SelectionFloatingToolbar
            selectedBlockIds={
              selectedBlockIds && selectedBlockIds.length > 0
                ? selectedBlockIds
                : selectedBlockId
                ? [selectedBlockId]
                : []
            }
            blocks={currentPage.bl}
            onResizeDelta={(delta) => onBatchResizeDelta && onBatchResizeDelta(delta)}
            onSetScale={(sc) => onBatchSetScale && onBatchSetScale(sc)}
            onDelete={() => onBatchDelete && onBatchDelete()}
            onDuplicate={onBatchDuplicate}
            onChangeLayer={(action) => onBatchChangeLayer && onBatchChangeLayer(action)}
            onAlign={(alignment) => onBatchAlign && onBatchAlign(alignment)}
            onDistribute={(dir) => onBatchDistribute && onBatchDistribute(dir)}
            onToggleLock={(forced) => onBatchToggleLock && onBatchToggleLock(forced)}
            onSelectAll={() => onSelectAllBlocks && onSelectAllBlocks()}
            onClearSelection={() => onClearSelection && onClearSelection()}
          />
        )}
      </div>

      {/* Bottom Navigation if configured */}
      {state.nav.ps === 'bottom' && (
        <div className="mt-2 flex-none">{renderNavBar()}</div>
      )}

      {/* Standard-Sized Bottom Catalog Menu Button with Smooth Spring Animation */}
      {state.nav.bottomMenuButtonEnabled !== false && (
        <motion.div
          className="flex-none my-1 flex items-center justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center gap-2.5 px-5 py-2 rounded-2xl shadow-lg hover:shadow-xl backdrop-blur-md border font-extrabold text-xs cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: c.bg,
              color: c.fg,
              borderColor: `color-mix(in srgb, ${c.ac} 35%, transparent)`,
              boxShadow: `0 6px 20px -3px color-mix(in srgb, ${c.ac} 25%, transparent)`,
            }}
            title="باز کردن منو و فهرست دسته‌بندی‌شده کاتالوگ"
          >
            <div
              className="w-2.5 h-2.5 rounded-full animate-pulse flex-none"
              style={{ backgroundColor: c.ac }}
            />
            <Menu className="w-4 h-4 flex-none" style={{ color: c.ac }} />
            <span>منوی دسته‌بندی و صفحات</span>
            <span
              className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold"
              style={{
                backgroundColor: `color-mix(in srgb, ${c.ac} 18%, transparent)`,
                color: c.ac,
              }}
            >
              {totalPages} صفحه
            </span>
          </motion.button>
        </motion.div>
      )}

      {/* Bottom Page Thumbnails Carousel Strip */}
      <div className="w-full max-w-4xl mt-3 pt-2.5 border-t border-black/10 dark:border-white/10 flex items-center gap-2 overflow-x-auto py-1.5 px-3 no-scrollbar flex-none">
        <span className="text-[11px] font-bold opacity-60 flex-none ml-1">
          ورق زدن سریع:
        </span>
        {state.pg.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => handleJump(idx)}
            className={`flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              idx === currentPageIndex
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105 ring-2 ring-orange-400/40'
                : 'bg-black/5 dark:bg-white/5 opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            <span className="font-mono text-[10px] opacity-80">{idx + 1}.</span>
            <span className="truncate max-w-[120px]">{p.t}</span>
          </button>
        ))}
        <button
          onClick={onAddPage}
          className="flex-none px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-500/10 text-orange-400 border border-dashed border-orange-500/40 hover:bg-orange-500/20 transition-all flex items-center gap-1 cursor-pointer"
          title="افزودن صفحه جدید"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن صفحه</span>
        </button>
      </div>
    </div>
  );
};
