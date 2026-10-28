import React from 'react';
import {
  CatalogState,
  MenuStyle,
  NavButtonShape,
  NavPosition,
  NavStyle,
  TransitionEffect,
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
} from 'lucide-react';

interface NavigationPanelProps {
  state: CatalogState;
  onUpdateState: (updater: (prev: CatalogState) => CatalogState) => void;
  onAddTocPage: () => void;
}

export const NavigationPanel: React.FC<NavigationPanelProps> = ({
  state,
  onUpdateState,
  onAddTocPage,
}) => {
  const nav = state.nav;

  const updateNav = (updates: Partial<typeof nav>) => {
    onUpdateState((prev) => ({
      ...prev,
      nav: {
        ...prev.nav,
        ...updates,
      },
    }));
  };

  return (
    <div className="flex flex-col gap-6 p-4 text-right">
      {/* 1. Page Transition Animation */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-xs font-bold opacity-75">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>انیمیشن تعویض صفحات (Page Transitions):</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'fade', label: 'محو و پیدایش (Fade)', desc: 'حرکت نرم و چشم‌نواز' },
            { id: 'slide', label: 'لغزش افقی (Slide)', desc: 'حرکت اسلایدی کلاسیک' },
            { id: 'zoom', label: 'زوم سینمایی (Zoom)', desc: 'بزرگ‌نمایی نرم صفحه جدید' },
            { id: 'rise', label: 'صعود از پایین (Rise)', desc: 'بالا آمدن با فنریت نرم' },
            { id: 'flip', label: 'ورق خوردن ۳ بعدی (Flip)', desc: 'چرخش پرسپکتیو واقعی' },
            { id: 'soft-scale', label: 'مقیاس نرم', desc: 'نوسان آرام و شیک' },
            { id: 'none', label: 'بدون انیمیشن (Instant)', desc: 'تعویض آنی و بدون مکث' },
          ].map((tr) => {
            const isSelected = nav.tr === tr.id;
            return (
              <button
                key={tr.id}
                onClick={() => updateNav({ tr: tr.id as TransitionEffect })}
                className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col gap-0.5 ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500/15 shadow-sm ring-1 ring-orange-500/40'
                    : 'border-current/15 hover:border-orange-500/40 bg-black/5 dark:bg-white/5'
                }`}
              >
                <b className={`text-xs ${isSelected ? 'text-orange-400' : ''}`}>
                  {tr.label}
                </b>
                <span className="text-[10px] opacity-65">{tr.desc}</span>
              </button>
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
    </div>
  );
};
