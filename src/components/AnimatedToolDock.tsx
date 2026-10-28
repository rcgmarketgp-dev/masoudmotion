import React, { useState } from 'react';
import { BlockType } from '../types/catalog';
import { motion, AnimatePresence } from 'motion/react';
import { soundEffects } from '../utils/soundEffects';
import {
  Type,
  AlignRight,
  Image as ImageIcon,
  Package,
  Link,
  ListOrdered,
  MessageSquare,
  Sparkles,
  Phone,
  Bookmark,
  Layers,
  Minus,
  MoveVertical,
  Plus,
  Zap,
} from 'lucide-react';

interface AnimatedToolDockProps {
  onAddBlock: (type: BlockType) => void;
  onOpenIconModal?: () => void;
}

interface ToolItemDef {
  type: BlockType;
  label: string;
  badge?: string;
  gradient: string;
  iconColor: string;
  shadowColor: string;
  glowColor: string;
  icon: React.ReactNode;
}

export const ANIMATED_TOOLS: ToolItemDef[] = [
  {
    type: 'h',
    label: 'تیتر جذاب',
    badge: 'H2 عنوان',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    iconColor: 'text-amber-50',
    shadowColor: 'shadow-orange-500/30',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    icon: <Type className="w-5 h-5" />,
  },
  {
    type: 'p',
    label: 'پاراگراف متن',
    badge: 'توضیحات',
    gradient: 'from-blue-400 via-indigo-500 to-violet-600',
    iconColor: 'text-blue-50',
    shadowColor: 'shadow-indigo-500/30',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    icon: <AlignRight className="w-5 h-5" />,
  },
  {
    type: 'img',
    label: 'تصویر و گالری',
    badge: 'PNG/JPG/PDF',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    iconColor: 'text-emerald-50',
    shadowColor: 'shadow-emerald-500/30',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    icon: <ImageIcon className="w-5 h-5" />,
  },
  {
    type: 'prod',
    label: 'کارت محصول',
    badge: 'فروشگاهی',
    gradient: 'from-fuchsia-500 via-purple-600 to-indigo-600',
    iconColor: 'text-fuchsia-50',
    shadowColor: 'shadow-purple-500/30',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    icon: <Package className="w-5 h-5" />,
  },
  {
    type: 'btn',
    label: 'دکمه تعاملی',
    badge: 'لینک / تماس',
    gradient: 'from-rose-500 via-pink-500 to-amber-500',
    iconColor: 'text-rose-50',
    shadowColor: 'shadow-rose-500/30',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    icon: <Link className="w-5 h-5" />,
  },
  {
    type: 'icon',
    label: 'آیکون متحرک',
    badge: 'SVG پویا',
    gradient: 'from-violet-500 via-pink-500 to-orange-400',
    iconColor: 'text-violet-50',
    shadowColor: 'shadow-pink-500/30',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    type: 'list',
    label: 'لیست ویژگی‌ها',
    badge: 'تیک‌دار',
    gradient: 'from-cyan-400 via-sky-500 to-blue-600',
    iconColor: 'text-cyan-50',
    shadowColor: 'shadow-cyan-500/30',
    glowColor: 'rgba(14, 165, 233, 0.4)',
    icon: <ListOrdered className="w-5 h-5" />,
  },
  {
    type: 'box',
    label: 'کادر برجسته',
    badge: 'های‌لایت / نقل',
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    iconColor: 'text-yellow-50',
    shadowColor: 'shadow-amber-500/30',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    type: 'features',
    label: 'مزایای ۳گانه',
    badge: 'باکس چندگانه',
    gradient: 'from-teal-400 via-emerald-500 to-green-600',
    iconColor: 'text-teal-50',
    shadowColor: 'shadow-teal-500/30',
    glowColor: 'rgba(20, 184, 166, 0.4)',
    icon: <Zap className="w-5 h-5" />,
  },
  {
    type: 'contact',
    label: 'کارت تماس',
    badge: 'تلفن و لوکیشن',
    gradient: 'from-sky-400 via-indigo-500 to-violet-600',
    iconColor: 'text-sky-50',
    shadowColor: 'shadow-sky-500/30',
    glowColor: 'rgba(14, 165, 233, 0.4)',
    icon: <Phone className="w-5 h-5" />,
  },
  {
    type: 'logo',
    label: 'لوگوی برند',
    badge: 'آرم و نشان',
    gradient: 'from-orange-500 via-red-500 to-amber-600',
    iconColor: 'text-orange-50',
    shadowColor: 'shadow-orange-500/30',
    glowColor: 'rgba(255, 85, 0, 0.4)',
    icon: <Layers className="w-5 h-5" />,
  },
  {
    type: 'toc',
    label: 'فهرست مطالب',
    badge: 'لینک صفحات',
    gradient: 'from-purple-500 via-indigo-600 to-blue-700',
    iconColor: 'text-purple-50',
    shadowColor: 'shadow-purple-500/30',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    icon: <Bookmark className="w-5 h-5" />,
  },
  {
    type: 'hr',
    label: 'خط جداکننده',
    badge: 'دیوایدر شیک',
    gradient: 'from-slate-600 via-slate-700 to-slate-800',
    iconColor: 'text-slate-200',
    shadowColor: 'shadow-slate-600/30',
    glowColor: 'rgba(100, 116, 139, 0.3)',
    icon: <Minus className="w-5 h-5" />,
  },
  {
    type: 'sp',
    label: 'فاصله‌ساز خالی',
    badge: 'اسپیسر',
    gradient: 'from-zinc-600 via-zinc-700 to-zinc-800',
    iconColor: 'text-zinc-200',
    shadowColor: 'shadow-zinc-600/30',
    glowColor: 'rgba(113, 113, 122, 0.3)',
    icon: <MoveVertical className="w-5 h-5" />,
  },
];

export const AnimatedToolDock: React.FC<AnimatedToolDockProps> = ({
  onAddBlock,
  onOpenIconModal,
}) => {
  const [clickedTool, setClickedTool] = useState<string | null>(null);

  const handleClick = (type: BlockType) => {
    soundEffects.playAdd();
    setClickedTool(type);
    onAddBlock(type);
    setTimeout(() => {
      setClickedTool(null);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Featured Vector SVG Picker Banner Button */}
      {onOpenIconModal && (
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            soundEffects.playPop();
            onOpenIconModal();
          }}
          className="relative overflow-hidden p-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-orange-500/30 flex items-center justify-between cursor-pointer group"
        >
          {/* Animated decorative shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner group-hover:rotate-12 transition-transform duration-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-sm font-black tracking-tight flex items-center gap-1.5">
                <span>کتابخانه آیکون‌های وکتور متحرک SVG</span>
                <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
              </span>
              <span className="text-[11px] opacity-90 font-medium">
                بیش از ۳۰ آیکون شاد و متحرک با افکت‌های نرم و کادرهای متنوع
              </span>
            </div>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-white/25 backdrop-blur-md text-[11px] font-bold shadow-sm group-hover:bg-white group-hover:text-orange-600 transition-colors">
            انتخاب آیکون
          </span>
        </motion.button>
      )}

      {/* Grid of Colorful Buttonized Animated Tools */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {ANIMATED_TOOLS.map((tool) => {
          const isJustClicked = clickedTool === tool.type;

          return (
            <motion.button
              key={tool.type}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleClick(tool.type)}
              className={`p-3 rounded-2xl border border-white/10 bg-slate-900/60 hover:bg-slate-800/90 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-center relative group shadow-md hover:${tool.shadowColor} select-none overflow-hidden`}
            >
              {/* Ripple feedback aura when clicked */}
              <AnimatePresence>
                {isJustClicked && (
                  <motion.div
                    initial={{ scale: 0.2, opacity: 0.9 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ backgroundColor: tool.glowColor }}
                  />
                )}
              </AnimatePresence>

              {/* Animated Colorful Icon Pill Container */}
              <motion.div
                animate={
                  isJustClicked
                    ? { rotate: [0, -15, 15, -8, 8, 0], scale: [1, 1.25, 1] }
                    : {}
                }
                transition={{ duration: 0.45 }}
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.gradient} ${tool.iconColor} flex items-center justify-center shadow-lg group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300 relative`}
              >
                {tool.icon}
                {/* Subtle highlight inner ring */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/35 group-hover:ring-white/70 transition-all" />
              </motion.div>

              <div className="flex flex-col items-center min-w-0">
                <span className="text-xs font-black text-slate-200 group-hover:text-white truncate max-w-full">
                  {tool.label}
                </span>
                {tool.badge && (
                  <span className="text-[10px] opacity-70 text-slate-400 group-hover:text-orange-400 font-semibold mt-0.5">
                    {tool.badge}
                  </span>
                )}
              </div>

              {/* Quick plus indicator */}
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
