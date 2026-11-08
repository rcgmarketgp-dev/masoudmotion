import React, { useState, useEffect } from 'react';
import {
  CatalogState,
  MenuStyle,
  NavButtonShape,
  NavPosition,
  NavStyle,
  TransitionEffect,
  ElementAnimationPreset,
} from '../../types/catalog';
import {
  Compass,
  Sliders,
  Sparkles,
  BookOpen,
  PanelRightClose,
  PanelBottomClose,
  AppWindow,
  Maximize,
  PlusCircle,
  ExternalLink,
  Layers,
  Sparkle,
  Palette,
  Eye,
  Check,
  RotateCcw,
  Play,
  Repeat,
  Gauge,
  Monitor,
  Menu as MenuIcon,
  ChevronRight,
  ChevronLeft,
  Zap,
  Activity,
  Heart,
  Feather,
  Flame,
  MousePointerClick,
  CheckCircle2,
  Sparkles as SparklesIcon,
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { motion, AnimatePresence, type Variants } from 'motion/react';

export interface ElementAnimationPresetDef {
  id: ElementAnimationPreset;
  title: string;
  desc: string;
  badge: string;
  gradient: string;
  icon: React.ReactNode;
  cssClass: string;
}

export const ELEMENT_ANIMATION_PRESETS: ElementAnimationPresetDef[] = [
  {
    id: 'soft-entry',
    title: 'ورود نرم',
    desc: 'ظهور تدریجی و آرام با فید و صعود ملایم',
    badge: 'Fade + Rise',
    gradient: 'from-blue-500 to-indigo-600',
    icon: <Feather className="w-4 h-4 text-blue-400" />,
    cssClass: 'animate-soft-entry',
  },
  {
    id: 'turbulent',
    title: 'ظهور متلاطم و فنری',
    desc: 'جهش ارتجاعی فنری پرانرژی با تکان ملایم',
    badge: 'Spring Bouncy',
    gradient: 'from-orange-500 to-amber-500',
    icon: <Zap className="w-4 h-4 text-orange-400" />,
    cssClass: 'animate-turbulent-spring',
  },
  {
    id: 'gentle-shake',
    title: 'لرزش ملایم',
    desc: 'لرزش ظریف دوره‌ای برای جلب توجه مخاطب',
    badge: 'Gentle Wobble',
    gradient: 'from-fuchsia-500 to-pink-500',
    icon: <Activity className="w-4 h-4 text-fuchsia-400" />,
    cssClass: 'animate-gentle-shake',
  },
  {
    id: 'pulse',
    title: 'پالس ضربانی قلب',
    desc: 'نبض ریتمیک منظم همراه با درخشش هاله',
    badge: 'Rhythmic Pulse',
    gradient: 'from-rose-500 to-red-600',
    icon: <Heart className="w-4 h-4 text-rose-400" />,
    cssClass: 'animate-pulse-glow',
  },
  {
    id: 'spin-scale',
    title: 'چرخش و بزرگ‌نمایی',
    desc: 'چرخش پرشتاب ۳۶۰ درجه‌ای با بزرگ‌نمایی',
    badge: '360 Spin & Scale',
    gradient: 'from-purple-500 to-violet-600',
    icon: <RotateCcw className="w-4 h-4 text-purple-400" />,
    cssClass: 'animate-spin-scale',
  },
  {
    id: 'glow-slide',
    title: 'لغزش درخشان نئونی',
    desc: 'حرکت اسلایدی سریع همراه با شیب نورانی',
    badge: 'Neon Glow Slide',
    gradient: 'from-cyan-500 to-blue-600',
    icon: <Flame className="w-4 h-4 text-cyan-400" />,
    cssClass: 'animate-glow-slide',
  },
  {
    id: 'float',
    title: 'شناور معلق در فضا',
    desc: 'موج مداوم و شناور بدون توقف',
    badge: 'Continuous Cloud',
    gradient: 'from-teal-500 to-emerald-600',
    icon: <Sparkles className="w-4 h-4 text-teal-400" />,
    cssClass: 'animate-float-slow',
  },
  {
    id: 'hover-lift',
    title: 'معلق شدن با هاور',
    desc: 'واکنش نرم به حرکت ماوس و ارتقای لایه',
    badge: 'Hover Elevation',
    gradient: 'from-amber-400 to-orange-500',
    icon: <MousePointerClick className="w-4 h-4 text-amber-300" />,
    cssClass: 'hover:-translate-y-2',
  },
  {
    id: 'glass-fade',
    title: 'ورود شیشه‌ای بلورین',
    desc: 'پدیدار شدن با بلور شیشه‌ای و مقیاس نرم',
    badge: 'Glass Morphism',
    gradient: 'from-indigo-500 to-purple-600',
    icon: <Layers className="w-4 h-4 text-indigo-400" />,
    cssClass: 'animate-glass-fade',
  },
  {
    id: 'none',
    title: 'بدون انیمیشن (ثابت)',
    desc: 'ایستا، بدون حرکت و تغییر',
    badge: 'Static',
    gradient: 'from-slate-600 to-slate-700',
    icon: <Check className="w-4 h-4 text-slate-400" />,
    cssClass: '',
  },
];

interface NavigationPanelProps {
  state: CatalogState;
  currentPageIndex?: number;
  selectedBlockId?: string;
  selectedBlockIds?: string[];
  onUpdateState: (updater: (prev: CatalogState) => CatalogState) => void;
  onApplyAnimationToBlock?: (blockId: string, anim: ElementAnimationPreset) => void;
  onApplyAnimationToAllBlocks?: (anim: ElementAnimationPreset) => void;
  onBatchApplyAnimation?: (anim: ElementAnimationPreset) => void;
  onAddTocPage: () => void;
  onOpenCanvaModal?: () => void;
  onInsertCanvaToc?: (style: 'journal' | 'cards' | 'minimal') => void;
}

export const NavigationPanel: React.FC<NavigationPanelProps> = ({
  state,
  currentPageIndex = 0,
  selectedBlockId,
  selectedBlockIds = [],
  onUpdateState,
  onApplyAnimationToBlock,
  onApplyAnimationToAllBlocks,
  onBatchApplyAnimation,
  onAddTocPage,
  onOpenCanvaModal,
  onInsertCanvaToc,
}) => {
  const nav = state.nav;
  const c = state.c;

  // Live Animation Preview State
  const [previewKey, setPreviewKey] = useState(0);
  const [previewTarget, setPreviewTarget] = useState<'page' | 'preset' | 'menu' | 'navbar'>('page');
  const [activePresetPreview, setActivePresetPreview] = useState<ElementAnimationPreset>('soft-entry');
  const [isLooping, setIsLooping] = useState(true);
  const [previewSpeed, setPreviewSpeed] = useState<number>(1);
  const [activeNavDot, setActiveNavDot] = useState(1);

  // Active selected block information
  const currentPage = state.pg[currentPageIndex] || state.pg[0];
  const selectedBlock = currentPage?.bl.find((b) => b.id === selectedBlockId);
  const selectedCount = selectedBlockIds?.length || (selectedBlockId ? 1 : 0);

  const updateNav = (updates: Partial<typeof nav>) => {
    onUpdateState((prev) => ({
      ...prev,
      nav: {
        ...prev.nav,
        ...updates,
      },
    }));
    // Replay animation whenever settings change
    setPreviewKey((k) => k + 1);
  };

  const handleReplay = () => {
    soundEffects.playPop();
    setPreviewKey((k) => k + 1);
  };

  const handleApplyPreset = (presetId: ElementAnimationPreset) => {
    setActivePresetPreview(presetId);
    setPreviewTarget('preset');
    setPreviewKey((k) => k + 1);
    soundEffects.playAdd();

    if (selectedCount > 1 && onBatchApplyAnimation) {
      onBatchApplyAnimation(presetId);
    } else if (selectedBlockId && onApplyAnimationToBlock) {
      onApplyAnimationToBlock(selectedBlockId, presetId);
    }
  };

  // Auto-loop animation every 2.4s if enabled
  useEffect(() => {
    if (!isLooping) return;
    const interval = setInterval(() => {
      setPreviewKey((k) => k + 1);
      setActiveNavDot((d) => (d >= 3 ? 0 : d + 1));
    }, 2400 / previewSpeed);
    return () => clearInterval(interval);
  }, [isLooping, previewSpeed, nav.tr, previewTarget, activePresetPreview]);

  // Compute animation transition based on selected nav.tr
  const getPreviewVariants = (tr: TransitionEffect): Variants => {
    const dur = (tr === 'none' ? 0.01 : 0.5) / previewSpeed;
    switch (tr) {
      case 'flip':
        return {
          initial: { opacity: 0, rotateY: 75, transformPerspective: 1000, scale: 0.92 },
          animate: {
            opacity: 1,
            rotateY: 0,
            transformPerspective: 1000,
            scale: 1,
            transition: { duration: dur, ease: [0.25, 1, 0.5, 1] as const },
          },
          exit: { opacity: 0, rotateY: -75, scale: 0.92, transition: { duration: dur * 0.7 } },
        };
      case 'curl':
        return {
          initial: { opacity: 0, rotateZ: -10, rotateY: 60, transformPerspective: 1000, scale: 0.9 },
          animate: {
            opacity: 1,
            rotateZ: 0,
            rotateY: 0,
            scale: 1,
            transition: { duration: dur, ease: [0.22, 1, 0.36, 1] as const },
          },
          exit: { opacity: 0, rotateZ: 10, rotateY: -60, scale: 0.9, transition: { duration: dur * 0.7 } },
        };
      case 'cube':
        return {
          initial: { opacity: 0, rotateY: 85, x: 60, transformPerspective: 1200 },
          animate: {
            opacity: 1,
            rotateY: 0,
            x: 0,
            transformPerspective: 1200,
            transition: { duration: dur, ease: [0.2, 0.8, 0.2, 1] as const },
          },
          exit: { opacity: 0, rotateY: -85, x: -60, transition: { duration: dur * 0.7 } },
        };
      case 'magazine':
        return {
          initial: { opacity: 0, rotateY: 50, scale: 0.95, transformPerspective: 1000 },
          animate: {
            opacity: 1,
            rotateY: 0,
            scale: 1,
            transformPerspective: 1000,
            transition: { duration: dur, ease: [0.16, 1, 0.3, 1] as const },
          },
          exit: { opacity: 0, rotateY: -50, scale: 0.95, transition: { duration: dur * 0.7 } },
        };
      case 'stack':
        return {
          initial: { opacity: 0, y: 40, scale: 0.88, rotate: 3 },
          animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            transition: { type: 'spring', damping: 20, stiffness: 260 },
          },
          exit: { opacity: 0, y: -30, scale: 1.05, transition: { duration: dur * 0.7 } },
        };
      case 'slide':
        return {
          initial: { opacity: 0, x: 50, scale: 1 },
          animate: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { duration: dur, ease: [0.22, 1, 0.36, 1] as const },
          },
          exit: { opacity: 0, x: -40, transition: { duration: dur * 0.7 } },
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.78 },
          animate: {
            opacity: 1,
            scale: 1,
            transition: { duration: dur, ease: [0.22, 1, 0.36, 1] as const },
          },
          exit: { opacity: 0, scale: 1.08, transition: { duration: dur * 0.7 } },
        };
      case 'rise':
        return {
          initial: { opacity: 0, y: 40, scale: 0.96 },
          animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', damping: 20, stiffness: 260 },
          },
          exit: { opacity: 0, y: -25, transition: { duration: dur * 0.7 } },
        };
      case 'soft-scale':
        return {
          initial: { opacity: 0, scale: 0.93 },
          animate: {
            opacity: 1,
            scale: 1,
            transition: { duration: dur, ease: 'easeOut' as const },
          },
          exit: { opacity: 0, scale: 0.97, transition: { duration: dur * 0.7 } },
        };
      case 'none':
        return {
          initial: { opacity: 1 },
          animate: { opacity: 1, transition: { duration: 0.01 } },
          exit: { opacity: 1 },
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: {
            opacity: 1,
            transition: { duration: dur, ease: 'easeInOut' as const },
          },
          exit: { opacity: 0, transition: { duration: dur * 0.7 } },
        };
    }
  };

  // Menu items animation with Fade-in, Slide-in, and Scale-up
  const menuItemVariants: Variants = {
    closed: {
      opacity: 0,
      x: 35,
      scale: 0.9,
      transition: { duration: 0.18 / previewSpeed },
    },
    open: (customIndex: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: (customIndex * 0.07) / previewSpeed,
        type: 'spring',
        damping: 24,
        stiffness: 280,
      },
    }),
  };

  const transitionLabels: Record<TransitionEffect, string> = {
    flip: 'ورق زدن ۳ بعدی کتابی (3D Flip)',
    curl: 'پیچش گوشه برگه و مجله (Page Curl)',
    cube: 'چرخش مکعب ۳ بعدی (Cube 3D)',
    magazine: 'ورق زدن ژورنال لوکس (Magazine Spread)',
    stack: 'اسلاید کارتی پشته‌ای (Deck Stack)',
    slide: 'لغزش افقی پیوسته (Slide)',
    zoom: 'زوم سینمایی پروازی (Cinematic Zoom)',
    rise: 'صعود از پایین (Rise)',
    fade: 'محو و پیدایش ملایم (Fade)',
    'soft-scale': 'مقیاس نرم و ارتجاعی (Soft-Scale)',
    none: 'تعویض آنی (Instant)',
  };

  return (
    <div className="flex flex-col gap-6 p-4 text-right">
      {/* ========================================================
          LIVE ANIMATION PREVIEW WINDOW (پنجره پیش‌نمایش زنده انیمیشن)
          ======================================================== */}
      <section className="flex flex-col gap-3 p-4 rounded-3xl bg-slate-900 text-white border border-purple-500/30 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ backgroundColor: c.ac }}
        />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full blur-2xl opacity-20 bg-purple-600 pointer-events-none" />

        {/* Header of Preview Box */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-500 to-orange-500 flex items-center justify-center shadow-md">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-black flex items-center gap-1.5">
                <span>پیش‌نمایش زنده انیمیشن</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </h3>
              <p className="text-[10px] text-slate-400">
                مشاهده لحظه‌ای روی المان نمونه با افکت‌های انتخابی
              </p>
            </div>
          </div>

          {/* Quick controls: Loop & Replay */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer border ${
                isLooping
                  ? 'bg-purple-500/25 text-purple-300 border-purple-500/50'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
              title={isLooping ? 'تکرار خودکار فعال است' : 'تکرار خودکار غیرفعال است'}
            >
              <Repeat className={`w-3.5 h-3.5 ${isLooping ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
              <span className="hidden sm:inline">تکرار</span>
            </button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92, rotate: -30 }}
              onClick={handleReplay}
              className="p-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer hover:brightness-110 transition-all"
              title="اجرای مجدد انیمیشن"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>پخش</span>
            </motion.button>
          </div>
        </div>

        {/* Preview Mode Selector Tabs (4 Modes) */}
        <div className="grid grid-cols-4 gap-1 bg-black/40 p-1 rounded-2xl border border-white/10 text-[10px] font-bold z-10">
          <button
            onClick={() => {
              soundEffects.playClick();
              setPreviewTarget('page');
              setPreviewKey((k) => k + 1);
            }}
            className={`py-1.5 px-1 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              previewTarget === 'page'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>تعویض صفحه</span>
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setPreviewTarget('preset');
              setPreviewKey((k) => k + 1);
            }}
            className={`py-1.5 px-1 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              previewTarget === 'preset'
                ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>پیش‌تنظیم المان</span>
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setPreviewTarget('menu');
              setPreviewKey((k) => k + 1);
            }}
            className={`py-1.5 px-1 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              previewTarget === 'menu'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MenuIcon className="w-3 h-3" />
            <span>منوی ناوبری</span>
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setPreviewTarget('navbar');
              setPreviewKey((k) => k + 1);
            }}
            className={`py-1.5 px-1 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              previewTarget === 'navbar'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>نوار پایین</span>
          </button>
        </div>

        {/* Live Animation Stage (The Mini Viewport) */}
        <div
          className="relative min-h-[160px] rounded-2xl bg-black/60 border border-white/10 p-3.5 flex items-center justify-center overflow-hidden z-10"
          style={{ perspective: 1000 }}
        >
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* 1. Page Transition Target Mode */}
          {previewTarget === 'page' && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`page-anim-${nav.tr}-${previewKey}`}
                variants={getPreviewVariants(nav.tr)}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full max-w-[280px] p-3.5 rounded-2xl shadow-xl flex flex-col gap-2.5 text-right border border-white/15 cursor-pointer relative"
                style={{
                  backgroundColor: c.bg || '#1e293b',
                  color: c.fg || '#ffffff',
                }}
                onClick={handleReplay}
                title="کلیک برای پخش مجدد انیمیشن"
              >
                {/* Sample Card Badge & Status */}
                <div className="flex items-center justify-between pb-2 border-b border-current/15">
                  <span
                    className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white shadow-sm flex items-center gap-1"
                    style={{ backgroundColor: c.ac }}
                  >
                    <Sparkle className="w-2.5 h-2.5" />
                    <span>المان نمونه کاتالوگ</span>
                  </span>
                  <span className="text-[10px] opacity-60 font-mono font-bold">
                    افکت: {nav.tr}
                  </span>
                </div>

                {/* Sample Content Details */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner shrink-0"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${c.ac} 25%, transparent)`,
                    }}
                  >
                    <Sparkles className="w-6 h-6" style={{ color: c.ac }} />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <h4 className="text-xs font-black truncate">
                      {state.title || 'کاتالوگ هوشمند محصولات'}
                    </h4>
                    <p className="text-[10px] opacity-70 line-clamp-1">
                      انیمیشن نرم و هماهنگ ({transitionLabels[nav.tr]})
                    </p>
                  </div>
                </div>

                {/* Sample Footer Bar */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono font-bold opacity-75">
                    صفحه ۲ از {state.pg.length}
                  </span>
                  <div
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: c.ac }}
                  >
                    مشاهده جزئیات
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* 2. Element Animation Preset Target Mode (پیش‌تنظیمات انیمیشنی المان‌ها) */}
          {previewTarget === 'preset' && (
            <div
              key={`preset-preview-${activePresetPreview}-${previewKey}`}
              onClick={handleReplay}
              className={`w-full max-w-[280px] p-3.5 rounded-2xl shadow-xl flex flex-col gap-2.5 text-right border border-fuchsia-500/40 cursor-pointer relative ${
                ELEMENT_ANIMATION_PRESETS.find((p) => p.id === activePresetPreview)?.cssClass || ''
              }`}
              style={{
                backgroundColor: c.bg || '#1e293b',
                color: c.fg || '#ffffff',
              }}
              title="کلیک برای پخش مجدد انیمیشن المان"
            >
              {/* Badge & Active Preset Indicator */}
              <div className="flex items-center justify-between pb-2 border-b border-current/15">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black text-white shadow-sm flex items-center gap-1 bg-gradient-to-r from-fuchsia-600 to-pink-600">
                  <Zap className="w-2.5 h-2.5" />
                  <span>
                    {ELEMENT_ANIMATION_PRESETS.find((p) => p.id === activePresetPreview)?.title || 'پیش‌تنظیم المان'}
                  </span>
                </span>
                <span className="text-[10px] font-mono font-bold text-fuchsia-300">
                  {ELEMENT_ANIMATION_PRESETS.find((p) => p.id === activePresetPreview)?.badge}
                </span>
              </div>

              {/* Sample Element Body */}
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0 bg-gradient-to-tr from-fuchsia-500 to-pink-500 text-white"
                >
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <h4 className="text-xs font-black truncate">
                    {selectedBlock ? `المان: ${selectedBlock.t}` : 'کارت کاتالوگ نمونه'}
                  </h4>
                  <p className="text-[10px] opacity-75 line-clamp-1">
                    {ELEMENT_ANIMATION_PRESETS.find((p) => p.id === activePresetPreview)?.desc}
                  </p>
                </div>
              </div>

              {/* Footer info */}
              <div className="flex items-center justify-between pt-1 border-t border-current/10 text-[9px] opacity-75 font-semibold">
                <span>تست زنده روی المان</span>
                <span className="text-fuchsia-400 font-bold">کلیک روی هر پیش‌تنظیم در پایین</span>
              </div>
            </div>
          )}

          {/* 3. Menu Items Navigation Mode (Fade-in + Slide-in + Scale-up) */}
          {previewTarget === 'menu' && (
            <div className="w-full max-w-[280px] flex flex-col gap-1.5 z-10">
              <div className="flex items-center justify-between pb-1 px-1 text-[10px] text-purple-300 font-bold">
                <span>ورود ترتیبی با Fade-in + Slide-in + Scale-up:</span>
                <span className="opacity-70 font-mono">Staggered</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`menu-anim-${previewKey}`}
                  className="flex flex-col gap-1.5"
                >
                  {[
                    { id: 1, title: 'صفحه نخست و معرفی برند', icon: '01' },
                    { id: 2, title: 'فهرست محصولات پرفروش', icon: '02' },
                    { id: 3, title: 'راهنمای ثبت سفارش و پشتیبانی', icon: '03' },
                  ].map((item, idx) => (
                    <motion.div
                      key={item.id}
                      custom={idx}
                      variants={menuItemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      whileHover={{ scale: 1.02, x: -3 }}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/10 backdrop-blur-md flex items-center justify-between text-right cursor-pointer hover:bg-white/15 transition-colors"
                      style={idx === 0 ? { borderColor: c.ac } : {}}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-lg text-[10px] font-mono font-black flex items-center justify-center text-white"
                          style={{
                            backgroundColor: idx === 0 ? c.ac : 'rgba(255,255,255,0.15)',
                          }}
                        >
                          {item.icon}
                        </span>
                        <span className="text-[11px] font-bold text-white">
                          {item.title}
                        </span>
                      </div>
                      <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* 4. Navigation Bar Live Miniature Mode */}
          {previewTarget === 'navbar' && (
            <div className="flex flex-col items-center gap-3 w-full max-w-[280px] z-10">
              <span className="text-[10px] text-slate-300 font-bold opacity-80">
                پیش‌نمایش زنده استایل نوار کنترل ({nav.st}):
              </span>
              <motion.div
                key={`navbar-preview-${nav.st}-${nav.sh}-${previewKey}`}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 backdrop-blur-md shadow-lg"
                style={{
                  backgroundColor: c.bg || '#0f172a',
                  color: c.fg || '#ffffff',
                }}
              >
                <div
                  className={`w-7 h-7 flex items-center justify-center opacity-70 hover:opacity-100 ${
                    nav.sh === 'round' ? 'rounded-full' : 'rounded-lg'
                  }`}
                  style={{
                    backgroundColor: `color-mix(in srgb, ${c.fg} 15%, transparent)`,
                  }}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>

                {/* Sub-style preview */}
                {nav.st === 'dots' ? (
                  <div className="flex items-center gap-1.5 px-2">
                    {[0, 1, 2, 3].map((dot) => (
                      <div
                        key={dot}
                        className={`transition-all duration-300 ${
                          dot === activeNavDot
                            ? 'w-5 h-2 rounded-full shadow-sm'
                            : 'w-2 h-2 rounded-full opacity-40'
                        }`}
                        style={{
                          backgroundColor: dot === activeNavDot ? c.ac : 'currentColor',
                        }}
                      />
                    ))}
                  </div>
                ) : nav.st === 'tabs' ? (
                  <div className="flex items-center gap-1 px-1">
                    {[1, 2, 3].map((num) => (
                      <div
                        key={num}
                        className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center ${
                          num === 2 ? 'text-white shadow-sm' : 'opacity-60'
                        }`}
                        style={{
                          backgroundColor: num === 2 ? c.ac : 'transparent',
                        }}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                ) : nav.st === 'line' ? (
                  <div className="w-24 h-2 rounded-full bg-white/15 overflow-hidden mx-1">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: '65%',
                        backgroundColor: c.ac,
                      }}
                    />
                  </div>
                ) : nav.st === 'mini' ? (
                  <span className="text-[11px] font-black font-mono px-2">
                    ۲ / ۴
                  </span>
                ) : (
                  <div className="flex items-center gap-1 font-mono text-[11px] font-bold px-2">
                    <span style={{ color: c.ac }}>۲</span>
                    <span className="opacity-40">/</span>
                    <span>۴</span>
                  </div>
                )}

                <div
                  className={`w-7 h-7 flex items-center justify-center opacity-70 hover:opacity-100 ${
                    nav.sh === 'round' ? 'rounded-full' : 'rounded-lg'
                  }`}
                  style={{
                    backgroundColor: `color-mix(in srgb, ${c.fg} 15%, transparent)`,
                  }}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Footer info: Speed control & Active details */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/10 z-10">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-orange-400" />
            <span>سرعت نمایش:</span>
            {[
              { val: 0.5, label: '۰.۵x' },
              { val: 1, label: '۱x' },
              { val: 1.5, label: '۱.۵x' },
            ].map((sp) => (
              <button
                key={sp.val}
                onClick={() => {
                  setPreviewSpeed(sp.val);
                  setPreviewKey((k) => k + 1);
                }}
                className={`px-1.5 py-0.5 rounded-md font-mono font-bold cursor-pointer transition-all ${
                  previewSpeed === sp.val
                    ? 'bg-orange-500 text-white font-black'
                    : 'bg-white/5 hover:bg-white/15 text-slate-300'
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 font-semibold text-slate-300">
            <span>
              {previewTarget === 'preset' ? 'پیش‌تنظیم فعال:' : 'افکت تعویض صفحه:'}
            </span>
            <span className="text-orange-400 font-bold truncate max-w-[140px]">
              {previewTarget === 'preset'
                ? ELEMENT_ANIMATION_PRESETS.find((p) => p.id === activePresetPreview)?.title
                : transitionLabels[nav.tr]}
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          NEW SECTION: ELEMENT ANIMATION PRESETS (پیش‌تنظیمات انیمیشنی المان‌ها)
          ======================================================== */}
      <section className="flex flex-col gap-3 p-4 rounded-3xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/10 via-purple-500/5 to-slate-900/40 shadow-lg">
        <div className="flex items-center justify-between border-b border-current/15 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-pink-500 flex items-center justify-center text-white shadow-md">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <b className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">
                  پیش‌تنظیمات انیمیشنی المان‌ها (Animation Presets)
                </b>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                  ۱-Click
                </span>
              </div>
              <span className="text-[10px] opacity-70">
                اعمال مستقیم روی المان انتخاب‌شده با یک کلیک و تست زنده
              </span>
            </div>
          </div>
        </div>

        {/* Selected Block Info or Friendly Guide Banner */}
        <div
          className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2.5 ${
            selectedCount > 0
              ? 'bg-fuchsia-500/15 border-fuchsia-500/40 text-fuchsia-200'
              : 'bg-black/10 dark:bg-white/5 border-current/10 opacity-80'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs min-w-0">
            <span
              className={`w-3 h-3 rounded-full shrink-0 ${
                selectedCount > 0 ? 'bg-fuchsia-400 animate-ping' : 'bg-slate-500'
              }`}
            />
            <div className="flex flex-col min-w-0">
              <span className="font-bold truncate">
                {selectedCount === 1
                  ? `المان فعال: ${selectedBlock?.t === 'h' ? 'تیتر' : selectedBlock?.t === 'prod' ? 'کارت محصول' : selectedBlock?.t === 'btn' ? 'دکمه تعاملی' : selectedBlock?.t === 'img' ? 'تصویر' : selectedBlock?.t === 'icon' ? 'آیکون متحرک' : 'عنصر کاتالوگ'}`
                  : selectedCount > 1
                  ? `${selectedCount} المان انتخاب شده`
                  : 'هیچ المانی انتخاب نشده است'}
              </span>
              <span className="text-[10px] opacity-75 truncate">
                {selectedCount > 0
                  ? selectedBlock?.anim
                    ? `انیمیشن فعلی: ${ELEMENT_ANIMATION_PRESETS.find((p) => p.id === selectedBlock.anim)?.title || selectedBlock.anim}`
                    : 'بدون انیمیشن (کلیک روی هر گزینه برای اعمال آنی)'
                  : 'روی یک المان در صفحه کلیک کنید، یا روی دکمه‌های زیر برای تست بزنید'}
              </span>
            </div>
          </div>

          {selectedCount > 0 && selectedBlock?.anim && selectedBlock.anim !== 'none' && (
            <button
              onClick={() => handleApplyPreset('none')}
              className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-white/10 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/15 cursor-pointer transition-all shrink-0"
              title="حذف انیمیشن از این المان"
            >
              حذف افکت
            </button>
          )}
        </div>

        {/* Grid of Preset Cards */}
        <div className="grid grid-cols-2 gap-2">
          {ELEMENT_ANIMATION_PRESETS.map((preset) => {
            const isSelected =
              (selectedBlock && selectedBlock.anim === preset.id) ||
              (!selectedBlock && activePresetPreview === preset.id);

            return (
              <motion.button
                key={preset.id}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleApplyPreset(preset.id)}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col gap-1.5 relative group shadow-sm ${
                  isSelected
                    ? 'border-fuchsia-500 bg-fuchsia-500/20 ring-2 ring-fuchsia-500/40 shadow-md shadow-fuchsia-500/20'
                    : 'border-current/15 hover:border-fuchsia-500/40 bg-black/5 dark:bg-white/5'
                }`}
              >
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shadow-sm bg-gradient-to-tr ${preset.gradient} text-white`}
                    >
                      {preset.icon}
                    </div>
                    <b className={`text-xs ${isSelected ? 'text-fuchsia-300 font-black' : ''}`}>
                      {preset.title}
                    </b>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
                  )}
                </div>

                <p className="text-[10px] opacity-70 line-clamp-1">
                  {preset.desc}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-current/10 text-[9px]">
                  <span className="font-mono opacity-60 text-fuchsia-300">
                    {preset.badge}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 text-fuchsia-400 font-bold transition-opacity">
                    اعمال ➔
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Global Page Action: Apply to all blocks */}
        {onApplyAnimationToAllBlocks && (
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playAdd();
                onApplyAnimationToAllBlocks(activePresetPreview);
              }}
              className="flex-1 py-2 px-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white text-xs font-black shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                اعمال «{ELEMENT_ANIMATION_PRESETS.find((p) => p.id === activePresetPreview)?.title}» روی تمام المان‌های این صفحه
              </span>
            </button>
          </div>
        )}
      </section>

      {/* 1. Page Transition Animation Selection */}
      <section className="flex flex-col gap-2.5 pt-3 border-t border-current/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold opacity-75">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>انیمیشن تعویض صفحات (Page Transitions):</span>
          </div>
          <span className="text-[10px] opacity-60">کلیک برای انتخاب و تست زنده</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'flip', label: 'ورق زدن ۳ بعدی (Flip)', desc: 'چرخش پرسپکتیو واقعی کتابی' },
            { id: 'curl', label: 'ورق زدن مجله‌ای (Curl)', desc: 'پیچش گوشه برگه و تا خوردن' },
            { id: 'cube', label: 'چرخش مکعبی (Cube 3D)', desc: 'گردش وجه سه‌بعدی صفحه' },
            { id: 'magazine', label: 'ژورنال لوکس (Magazine)', desc: 'تاخوردگی با خط تا مرکزی' },
            { id: 'stack', label: 'پشته کارتی (Deck Stack)', desc: 'اسلاید کارت‌ها با زاویه لایه‌ای' },
            { id: 'slide', label: 'لغزش افقی (Slide)', desc: 'حرکت اسلایدی افقی پیوسته' },
            { id: 'zoom', label: 'زوم پروازی (Zoom)', desc: 'بزرگ‌نمایی نرم صفحه جدید' },
            { id: 'rise', label: 'صعود از پایین (Rise)', desc: 'بالا آمدن با فنریت ارتجاعی' },
            { id: 'fade', label: 'محو و پیدایش (Fade)', desc: 'پدیدار شدن تدریجی و ملایم' },
            { id: 'soft-scale', label: 'مقیاس نرم (Scale)', desc: 'نوسان آرام و شیک ابعاد' },
            { id: 'none', label: 'بدون انیمیشن (Instant)', desc: 'تعویض آنی و بدون مکث' },
          ].map((tr) => {
            const isSelected = nav.tr === tr.id;
            return (
              <motion.button
                key={tr.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  soundEffects.playPop();
                  updateNav({ tr: tr.id as TransitionEffect });
                  setPreviewTarget('page');
                }}
                className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col gap-0.5 relative ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500/15 shadow-sm ring-1 ring-orange-500/40'
                    : 'border-current/15 hover:border-orange-500/40 bg-black/5 dark:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <b className={`text-xs ${isSelected ? 'text-orange-400' : ''}`}>
                    {tr.label}
                  </b>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                  )}
                </div>
                <span className="text-[10px] opacity-65">{tr.desc}</span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* 2. Navigation Bar Type */}
      <section className="flex flex-col gap-2.5 pt-4 border-t border-current/10">
        <div className="flex items-center gap-2 text-xs font-bold opacity-75">
          <Compass className="w-4 h-4 text-orange-500" />
          <span>استایل نوار ناوبری کاتالوگ:</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'arrows', label: 'فلش و شمارنده عددی', desc: 'کامل و خوانا' },
            { id: 'dots', label: 'نقطه‌ای متحرک (Dots)', desc: 'مینیمال با گسترش نقطه فعال' },
            { id: 'tabs', label: 'دکمه‌های شماره‌دار', desc: 'دسترسی تک‌کلیک به هر صفحه' },
            { id: 'line', label: 'نوار پیشرفت پیوسته', desc: 'خط پیشرفت پر شونده مدرن' },
            { id: 'mini', label: 'مینی کپسول فشرده', desc: 'کمترین اشغال فضا' },
          ].map((st) => {
            const isSelected = nav.st === st.id;
            return (
              <button
                key={st.id}
                onClick={() => updateNav({ st: st.id as NavStyle })}
                className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col gap-0.5 ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500/15 shadow-sm ring-1 ring-orange-500/40'
                    : 'border-current/15 hover:border-orange-500/40 bg-black/5 dark:bg-white/5'
                }`}
              >
                <b className={`text-xs ${isSelected ? 'text-orange-400' : ''}`}>
                  {st.label}
                </b>
                <span className="text-[10px] opacity-65">{st.desc}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Bar Position & Button Shapes */}
      <section className="flex flex-col gap-3 pt-4 border-t border-current/10">
        <div className="flex items-center gap-2 text-xs font-bold opacity-75">
          <Sliders className="w-4 h-4 text-orange-500" />
          <span>موقعیت و هندسه دکمه‌ها:</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex flex-col gap-1">
            <span className="opacity-70 text-[11px] font-semibold">محل نوار:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => updateNav({ ps: 'bottom' })}
                className={`py-2 rounded-xl border text-center font-semibold cursor-pointer ${
                  nav.ps === 'bottom'
                    ? 'border-orange-500 bg-orange-500/15 text-orange-400 font-bold'
                    : 'border-current/15'
                }`}
              >
                پایین صفحه
              </button>
              <button
                onClick={() => updateNav({ ps: 'top' })}
                className={`py-2 rounded-xl border text-center font-semibold cursor-pointer ${
                  nav.ps === 'top'
                    ? 'border-orange-500 bg-orange-500/15 text-orange-400 font-bold'
                    : 'border-current/15'
                }`}
              >
                بالای صفحه
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="opacity-70 text-[11px] font-semibold">شکل دکمه‌ها:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => updateNav({ sh: 'round' })}
                className={`py-2 rounded-xl border text-center font-semibold cursor-pointer ${
                  nav.sh === 'round'
                    ? 'border-orange-500 bg-orange-500/15 text-orange-400 font-bold'
                    : 'border-current/15'
                }`}
              >
                دایره‌ای
              </button>
              <button
                onClick={() => updateNav({ sh: 'square' })}
                className={`py-2 rounded-xl border text-center font-semibold cursor-pointer ${
                  nav.sh === 'square'
                    ? 'border-orange-500 bg-orange-500/15 text-orange-400 font-bold'
                    : 'border-current/15'
                }`}
              >
                مربعی نرم
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 Quick Navigation Shortcuts & Bottom Menu Button */}
      <section className="flex flex-col gap-3 pt-4 border-t border-current/10">
        <div className="flex items-center gap-2 text-xs font-bold opacity-75">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>منوی پرکاربرد و کلید منوی کاتالوگ:</span>
        </div>

        <div className="flex flex-col gap-2.5 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10">
          <label className="flex items-center justify-between cursor-pointer select-none text-xs">
            <span className="font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>نمایش نوار میانبرهای پرکاربرد (صفحه اول، میانه، پایانی)</span>
            </span>
            <input
              type="checkbox"
              checked={nav.quickShortcutsEnabled !== false}
              onChange={(e) => updateNav({ quickShortcutsEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-orange-500 accent-orange-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer select-none text-xs pt-2 border-t border-current/10">
            <span className="font-semibold flex items-center gap-1.5">
              <MenuIcon className="w-3.5 h-3.5 text-orange-500" />
              <span>کلید استاندارد منو در پایین کاتالوگ (با انیمیشن نرم)</span>
            </span>
            <input
              type="checkbox"
              checked={nav.bottomMenuButtonEnabled !== false}
              onChange={(e) => updateNav({ bottomMenuButtonEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-orange-500 accent-orange-500 cursor-pointer"
            />
          </label>
        </div>
      </section>

      {/* 4. Table of Contents Menu Drawer Style */}
      <section className="flex flex-col gap-2.5 pt-4 border-t border-current/10">
        <div className="flex items-center gap-2 text-xs font-bold opacity-75">
          <BookOpen className="w-4 h-4 text-orange-500" />
          <span>استایل منوی فهرست صفحات:</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              id: 'side',
              label: 'کشویی از راست (Drawer)',
              desc: 'کلاسیک و استاندارد',
              icon: <PanelRightClose className="w-4 h-4 text-orange-500" />,
            },
            {
              id: 'bottom',
              label: 'ورق از پایین (Sheet)',
              desc: 'عالی برای صفحات لمسی',
              icon: <PanelBottomClose className="w-4 h-4 text-orange-500" />,
            },
            {
              id: 'center',
              label: 'پنجره پاپ‌آپ (Modal)',
              desc: 'وسط‌چین با بلور پس‌زمینه',
              icon: <AppWindow className="w-4 h-4 text-orange-500" />,
            },
            {
              id: 'fullscreen',
              label: 'پرده کامل (Overlay)',
              desc: 'نمایش فراگیر همه عناوین',
              icon: <Maximize className="w-4 h-4 text-orange-500" />,
            },
          ].map((mn) => {
            const isSelected = nav.mn === mn.id;
            return (
              <button
                key={mn.id}
                onClick={() => updateNav({ mn: mn.id as MenuStyle })}
                className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col gap-1 ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500/15 shadow-sm ring-1 ring-orange-500/40'
                    : 'border-current/15 hover:border-orange-500/40 bg-black/5 dark:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {mn.icon}
                  <b className={`text-xs ${isSelected ? 'text-orange-400' : ''}`}>
                    {mn.label}
                  </b>
                </div>
                <span className="text-[10px] opacity-65">{mn.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Quick action: Insert TOC page */}
        <button
          onClick={onAddTocPage}
          className="mt-2 flex items-center justify-center gap-2 p-3 rounded-2xl border border-orange-500/40 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>افزودن برگه اختصاصی فهرست در کاتالوگ</span>
        </button>
      </section>

      {/* 5. Canva Design Hub & Table of Contents Integration */}
      <section className="flex flex-col gap-3 pt-4 border-t border-current/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#00c4cc] to-[#7d2ae8] flex items-center justify-center shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-extrabold">
              قالب‌های آماده Canva برای فهرست و ناوبری
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Canva Connect
          </span>
        </div>

        <p className="text-[11px] opacity-70 leading-relaxed">
          فهرست صفحات کاتالوگ خود را با الگوها و پالت‌های ترند Canva طراحی کنید یا از قالب‌های آماده زیر استفاده نمایید:
        </p>

        {/* Canva TOC Style Presets */}
        <div className="grid grid-cols-1 gap-2">
          {[
            {
              id: 'journal',
              title: 'فهرست ژورنالی مینیمال Canva',
              desc: 'دارای کادر نقل‌قول، خط گرادیانت و دسته‌بندی شیک فصول',
              gradient: 'from-violet-900/40 via-purple-900/30 to-indigo-900/40',
              accent: '#A855F7',
            },
            {
              id: 'cards',
              title: 'فهرست کارتی و بلوکی Canva',
              desc: 'تفکیک مدرن با پالت کنتراست بالا و مناسب کاتالوگ‌های شاپینگ',
              gradient: 'from-cyan-900/40 via-sky-900/30 to-blue-900/40',
              accent: '#06B6D4',
            },
            {
              id: 'minimal',
              title: 'فهرست کلاسیک دو ستونه شرکتی',
              desc: 'مرتب، رسمی و خوانا مناسب اسناد و بروشورهای سازمانی',
              gradient: 'from-emerald-900/40 via-teal-900/30 to-slate-900/40',
              accent: '#10B981',
            },
          ].map((preset) => (
            <div
              key={preset.id}
              className={`p-3 rounded-2xl border border-white/10 bg-gradient-to-r ${preset.gradient} flex items-center justify-between gap-3 text-right hover:border-purple-500/40 transition-all`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: preset.accent }}
                  />
                  <span>{preset.title}</span>
                </span>
                <span className="text-[10px] text-slate-300 opacity-80">
                  {preset.desc}
                </span>
              </div>

              <button
                onClick={() => {
                  soundEffects.playAdd();
                  if (onInsertCanvaToc) {
                    onInsertCanvaToc(preset.id as any);
                  } else {
                    onAddTocPage();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 border border-white/20"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>درج فوری</span>
              </button>
            </div>
          ))}
        </div>

        {/* Big Launch Canva Hub Button */}
        {onOpenCanvaModal && (
          <button
            onClick={() => {
              soundEffects.playPop();
              onOpenCanvaModal();
            }}
            className="mt-1 p-3 rounded-2xl bg-gradient-to-r from-[#00c4cc] to-[#7d2ae8] hover:from-[#00b2b9] hover:to-[#6c24cd] text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 cursor-pointer transition-all"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>جستجو در تمام قالب‌ها و الهام‌گیری از Canva</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>
        )}
      </section>
    </div>
  );
};
