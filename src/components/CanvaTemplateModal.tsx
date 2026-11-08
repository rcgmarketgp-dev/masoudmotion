import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CANVA_CATALOG_TEMPLATES,
  CANVA_CATEGORIES,
  CanvaTemplateItem,
} from '../constants/canvaTemplates';
import { CatalogPage, CatalogThemePalette } from '../types/catalog';
import { soundEffects } from '../utils/soundEffects';
import {
  X,
  Search,
  Sparkles,
  ExternalLink,
  Plus,
  RefreshCw,
  Palette,
  Eye,
  Star,
  Users,
  Check,
  Tag,
  SlidersHorizontal,
  Bookmark,
  Layers,
  FileText,
  Package,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface CanvaTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (page: CatalogPage, mode: 'new' | 'replace') => void;
  onApplyPalette: (palette: CatalogThemePalette) => void;
  onPinInspiration?: (template: CanvaTemplateItem) => void;
  pinnedTemplateId?: string | null;
  initialSearch?: string;
}

export const CanvaTemplateModal: React.FC<CanvaTemplateModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
  onApplyPalette,
  onPinInspiration,
  pinnedTemplateId,
  initialSearch = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inspectedTemplate, setInspectedTemplate] = useState<CanvaTemplateItem | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Sync initialSearch if prop changes
  React.useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const filteredTemplates = useMemo(() => {
    return CANVA_CATALOG_TEMPLATES.filter((tpl) => {
      const matchesCategory =
        selectedCategory === 'all' || tpl.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;

      const inTitle = tpl.title.toLowerCase().includes(q);
      const inSubtitle = tpl.subtitle.toLowerCase().includes(q);
      const inDesc = tpl.description.toLowerCase().includes(q);
      const inCategory = tpl.categoryLabel.toLowerCase().includes(q);
      const inTags = tpl.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && (inTitle || inSubtitle || inDesc || inCategory || inTags);
    });
  }, [searchQuery, selectedCategory]);

  const handleOpenCanvaExternal = (query?: string) => {
    soundEffects.playPop();
    const term = query ? encodeURIComponent(query + ' catalog brochure') : 'catalog+brochure';
    const url = `https://www.canva.com/search/templates?q=${term}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleInspect = (tpl: CanvaTemplateItem) => {
    soundEffects.playPop();
    setInspectedTemplate(tpl);
  };

  const handleApply = (tpl: CanvaTemplateItem, mode: 'new' | 'replace') => {
    soundEffects.playAdd();
    // Clone page with unique IDs
    const clonedPage: CatalogPage = {
      ...tpl.pageTemplate,
      id: 'p_canva_' + Math.random().toString(36).substring(2, 9),
      bl: tpl.pageTemplate.bl.map((b) => ({
        ...b,
        id: 'b_canva_' + Math.random().toString(36).substring(2, 9),
      })),
    };
    onApplyTemplate(clonedPage, mode);
    onClose();
  };

  const handleApplyColors = (tpl: CanvaTemplateItem) => {
    soundEffects.playPop();
    onApplyPalette(tpl.palette);
    setCopiedNotification(`پالت رنگی «${tpl.palette.name}» اعمال شد.`);
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  const handlePin = (tpl: CanvaTemplateItem) => {
    soundEffects.playPop();
    if (onPinInspiration) {
      onPinInspiration(tpl);
      setCopiedNotification(`قالب «${tpl.title}» برای الهام در پنل ابزارها پین شد.`);
      setTimeout(() => setCopiedNotification(null), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/80 backdrop-blur-md overflow-hidden text-right font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100 overflow-hidden"
        >
          {/* Top Header with Canva Gradient Branding */}
          <div className="flex-none p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00c4cc] via-[#7d2ae8] to-[#ff416c] flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-2 ring-white/10 flex-none">
                  <Sparkles className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      مخزن قالب‌ها و طراحی‌های Canva
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-[#00c4cc] to-[#7d2ae8] text-white shadow-sm">
                      CANVA INSPIRED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    جستجو و الهام‌گیری از الگوهای ترند Canva، اعمال با یک کلیک و ارتقای بصری کاتالوگ شما
                  </p>
                </div>
              </div>

              {/* Close Button & External Canva Link */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenCanvaExternal(searchQuery)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  title="جستجو در وب‌سایت اصلی Canva"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>جستجو در Canva.com</span>
                </button>
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    onClose();
                  }}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Interactive Search Bar */}
            <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجو بر اساس نام قالب، دسته‌بندی، تگ‌ها (مثال: محصول، مینیمال، قهوه، تخفیف، فشن)..."
                  className="w-full pr-11 pl-10 py-3 rounded-2xl bg-slate-950/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-right"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Counter Pill */}
              <div className="flex items-center gap-2 justify-end sm:justify-start">
                <span className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300 whitespace-nowrap">
                  {filteredTemplates.length} قالب آماده
                </span>
                <button
                  onClick={() => handleOpenCanvaExternal(searchQuery)}
                  className="sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Canva.com</span>
                </button>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {CANVA_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      soundEffects.playPop();
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#00c4cc] to-[#7d2ae8] text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                    }`}
                  >
                    {isActive && <Check className="w-3 h-3 text-white" />}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toast Alert Inside Modal */}
          <AnimatePresence>
            {copiedNotification && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-6 mt-3 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{copiedNotification}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Area (Template Cards Grid) */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 no-scrollbar">
            {filteredTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
                <div className="w-16 h-16 rounded-3xl bg-slate-800/80 flex items-center justify-center mb-4 text-slate-500">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-200">
                  قالبی با عبارت «{searchQuery}» یافت نشد
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
                  می‌توانید کلمه کلیدی را تغییر دهید یا مستقیماً آرشیو میلیونی سایت Canva را جستجو کنید.
                </p>
                <button
                  onClick={() => handleOpenCanvaExternal(searchQuery)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#00c4cc] to-[#7d2ae8] text-white text-xs font-black shadow-lg shadow-indigo-500/25 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>جستجوی «{searchQuery || 'کاتالوگ'}» در Canva.com</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTemplates.map((tpl) => {
                  const isPinned = pinnedTemplateId === tpl.id;
                  const elementsCount = tpl.pageTemplate.bl.length;

                  return (
                    <div
                      key={tpl.id}
                      className="group relative flex flex-col rounded-3xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10"
                    >
                      {/* Top Visual Mockup Preview Area */}
                      <div
                        className={`relative h-44 p-4 bg-gradient-to-br ${tpl.previewBg} overflow-hidden flex flex-col justify-between`}
                      >
                        {/* Overlay pattern */}
                        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

                        {/* Badges bar */}
                        <div className="relative z-10 flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-xl bg-black/50 backdrop-blur-md text-[10px] font-black text-white border border-white/10 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-[#00c4cc]" />
                            <span>{tpl.categoryLabel}</span>
                          </span>

                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-md text-[10px] font-bold text-amber-300 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                              <span>{tpl.rating}</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-md text-[10px] text-slate-300 flex items-center gap-0.5">
                              <Users className="w-3 h-3 text-slate-400" />
                              <span>{tpl.useCount}</span>
                            </span>
                          </div>
                        </div>

                        {/* Mockup Wireframe Graphic */}
                        <div className="relative z-10 my-auto flex flex-col items-center justify-center">
                          <div className="w-4/5 py-2.5 px-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/15 shadow-lg flex flex-col gap-1.5">
                            <div className="h-2 rounded-full w-2/3 bg-white/70" />
                            <div className="h-1.5 rounded-full w-4/5 bg-white/30" />
                            <div className="flex items-center gap-2 mt-1">
                              <div
                                className="w-4 h-4 rounded-full flex-none"
                                style={{ backgroundColor: tpl.accentColor }}
                              />
                              <div className="h-1.5 rounded-full w-1/2 bg-white/40" />
                            </div>
                          </div>
                        </div>

                        {/* Palette Swatches Bar */}
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10">
                            {[tpl.palette.bg, tpl.palette.sf, tpl.palette.ac, tpl.palette.fg].map(
                              (color, idx) => (
                                <div
                                  key={idx}
                                  className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              )
                            )}
                            <span className="text-[9px] font-mono text-slate-300 mr-1">
                              {tpl.palette.name.split(' ')[0]}
                            </span>
                          </div>

                          <span className="text-[10px] font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded-lg">
                            {elementsCount} المان فعال
                          </span>
                        </div>
                      </div>

                      {/* Card Content & Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors">
                              {tpl.title}
                            </h4>
                            {isPinned && (
                              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[9px] font-bold flex items-center gap-1">
                                <Bookmark className="w-2.5 h-2.5 fill-indigo-400" />
                                <span>پین‌شده</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {tpl.description}
                          </p>

                          {/* Tag Chips */}
                          <div className="mt-2.5 flex items-center gap-1 flex-wrap">
                            {tpl.tags.slice(0, 4).map((tag, idx) => (
                              <span
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSearchQuery(tag);
                                }}
                                className="px-2 py-0.5 rounded-lg bg-slate-900/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[10px] transition-colors cursor-pointer"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons Grid */}
                        <div className="pt-3 border-t border-slate-700/50 flex flex-col gap-2">
                          {/* Primary Action: Add as New Page */}
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => handleApply(tpl, 'new')}
                              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00c4cc] to-[#7d2ae8] hover:from-[#00b2b9] hover:to-[#6c24cd] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>افزودن برگه جدید</span>
                            </button>

                            <button
                              onClick={() => handleInspect(tpl)}
                              className="py-2.5 px-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-slate-600/60"
                            >
                              <Eye className="w-3.5 h-3.5 text-indigo-400" />
                              <span>پیش‌نمایش جزئیات</span>
                            </button>
                          </div>

                          {/* Secondary Utilities: Replace page / Apply palette / Pin */}
                          <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400">
                            <button
                              onClick={() => handleApply(tpl, 'replace')}
                              className="px-2 py-1 rounded-lg hover:bg-slate-700/60 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1"
                              title="جایگزینی کامل محتوای صفحه در حال ویرایش"
                            >
                              <RefreshCw className="w-3 h-3 text-amber-400" />
                              <span>جایگزینی صفحه فعلی</span>
                            </button>

                            <button
                              onClick={() => handleApplyColors(tpl)}
                              className="px-2 py-1 rounded-lg hover:bg-slate-700/60 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1"
                              title="اعمال پالت رنگی قالب روی کل کاتالوگ"
                            >
                              <Palette className="w-3 h-3 text-cyan-400" />
                              <span>اعمال پالت</span>
                            </button>

                            <button
                              onClick={() => handlePin(tpl)}
                              className={`p-1.5 rounded-lg hover:bg-slate-700/60 transition-colors cursor-pointer ${
                                isPinned ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'
                              }`}
                              title={isPinned ? 'پین شده در پنل ابزارها' : 'سنجاق در پنل ابزارها برای الهام‌گیری'}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${isPinned ? 'fill-indigo-400' : ''}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Footer with Inspiration Tips & Quick Actions */}
          <div className="flex-none p-4 px-6 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 flex-none" />
              <span>
                <b>راهنما:</b> تمام قالب‌های بالا به صورت ۱۰۰٪ قابل ویرایش در کاتالوگ شما درج می‌شوند (متون، تصاویر، رنگ‌ها و موقعیت‌ها).
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleOpenCanvaExternal()}
                className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>مشاهده قالب‌های رسمی در Canva</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Inspection Drawer / Overlay when user clicks 'پیش‌نمایش جزئیات' */}
        <AnimatePresence>
          {inspectedTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
              onClick={() => setInspectedTemplate(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 flex flex-col overflow-hidden text-right"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: inspectedTemplate.accentColor }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">
                        {inspectedTemplate.title}
                      </h3>
                      <span className="text-xs text-slate-400">
                        {inspectedTemplate.categoryLabel} • {inspectedTemplate.pageTemplate.bl.length} المان آماده
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setInspectedTemplate(null)}
                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body details */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 text-xs leading-relaxed text-slate-300">
                    <b className="text-white block mb-1">فلسفه طراحی و چیدمان:</b>
                    {inspectedTemplate.description}
                  </div>

                  {/* Palette inspection */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                    <div>
                      <span className="text-xs font-bold text-white block">پالت رنگی پیشنهادی:</span>
                      <span className="text-[11px] text-slate-400">{inspectedTemplate.palette.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950 border border-slate-800">
                        {[
                          { label: 'پس‌زمینه', color: inspectedTemplate.palette.bg },
                          { label: 'کارت', color: inspectedTemplate.palette.sf },
                          { label: 'تأکیدی', color: inspectedTemplate.palette.ac },
                          { label: 'متن', color: inspectedTemplate.palette.fg },
                        ].map((c, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-lg border border-white/20 shadow-sm"
                            style={{ backgroundColor: c.color }}
                            title={`${c.label}: ${c.color}`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => handleApplyColors(inspectedTemplate)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-bold border border-indigo-500/40 cursor-pointer"
                      >
                        اعمال پالت
                      </button>
                    </div>
                  </div>

                  {/* Blocks listing */}
                  <div>
                    <h5 className="text-xs font-black text-slate-300 mb-2.5 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>لایه‌ها و محتویات موجود در این صفحه Canva:</span>
                    </h5>
                    <div className="space-y-2">
                      {inspectedTemplate.pageTemplate.bl.map((block, idx) => (
                        <div
                          key={block.id || idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/70 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 font-mono text-[10px] flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-slate-200">
                              {block.t === 'h' && 'تیتر اصلی'}
                              {block.t === 'p' && 'پاراگراف متن'}
                              {block.t === 'prod' && 'کارت محصول و قیمت'}
                              {block.t === 'img' && 'تصویر کاتالوگ'}
                              {block.t === 'btn' && 'دکمه اکشن / لینک'}
                              {block.t === 'features' && 'لیست آیکون و ویژگی‌ها'}
                              {block.t === 'list' && 'لیست قیمت و موارد'}
                              {block.t === 'box' && 'کادر نقل‌قول / هشدار'}
                              {block.t === 'contact' && 'بلوک اطلاعات تماس'}
                              {block.t === 'toc' && 'فهرست مطالب کاتالوگ'}
                              {block.t === 'hr' && 'خط جداکننده'}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {block.t === 'h' && (block as any).x}
                            {block.t === 'prod' && (block as any).x}
                            {block.t === 'btn' && (block as any).x}
                            {block.t === 'img' && 'ابعاد بهینه‌شده'}
                            {block.t === 'features' && `${(block as any).items?.length || 3} مورد فنی`}
                            {block.t === 'list' && 'لیست خطی'}
                            {block.t === 'box' && (block as any).title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handlePin(inspectedTemplate)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>سنجاق در ابزارها</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        handleApply(inspectedTemplate, 'replace');
                        setInspectedTemplate(null);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold cursor-pointer transition-all"
                    >
                      جایگزینی در صفحه فعلی
                    </button>
                    <button
                      onClick={() => {
                        handleApply(inspectedTemplate, 'new');
                        setInspectedTemplate(null);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00c4cc] to-[#7d2ae8] text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>افزودن به عنوان صفحه جدید</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};
