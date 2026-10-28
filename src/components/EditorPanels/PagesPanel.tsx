import React from 'react';
import { CatalogPage, CatalogState } from '../../types/catalog';
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Columns,
  Square,
  Layers,
} from 'lucide-react';

interface PagesPanelProps {
  state: CatalogState;
  currentPageIndex: number;
  onPageChange: (index: number) => void;
  onUpdateState: (updater: (prev: CatalogState) => CatalogState) => void;
}

export const PagesPanel: React.FC<PagesPanelProps> = ({
  state,
  currentPageIndex,
  onPageChange,
  onUpdateState,
}) => {
  const currentPage = state.pg[currentPageIndex] || state.pg[0];

  const handleAddPage = () => {
    const newPage: CatalogPage = {
      id: 'p_' + Math.random().toString(36).substring(2, 9),
      t: `صفحه ${state.pg.length + 1}`,
      toc: true,
      bl: [
        {
          id: 'b_' + Math.random().toString(36).substring(2, 9),
          t: 'h',
          x: `عنوان صفحه ${state.pg.length + 1}`,
          sz: 28,
          al: 'right',
          hs: 'b',
        },
        {
          id: 'b_' + Math.random().toString(36).substring(2, 9),
          t: 'hr',
          st: 'solid',
        },
        {
          id: 'b_' + Math.random().toString(36).substring(2, 9),
          t: 'p',
          x: 'متن توضیحات این صفحه را با سلیقه خود ویرایش کنید.',
          sz: 14,
          al: 'right',
        },
      ],
    };
    onUpdateState((prev) => ({
      ...prev,
      pg: [...prev.pg, newPage],
    }));
    onPageChange(state.pg.length);
  };

  const handleDuplicatePage = (idx: number) => {
    const pageToDup = state.pg[idx];
    const duplicated: CatalogPage = {
      ...JSON.parse(JSON.stringify(pageToDup)),
      id: 'p_' + Math.random().toString(36).substring(2, 9),
      t: `${pageToDup.t} (کپی)`,
    };
    onUpdateState((prev) => {
      const next = [...prev.pg];
      next.splice(idx + 1, 0, duplicated);
      return { ...prev, pg: next };
    });
    onPageChange(idx + 1);
  };

  const handleDeletePage = (idx: number) => {
    if (state.pg.length <= 1) {
      alert('حداقل یک صفحه باید در کاتالوگ باقی بماند.');
      return;
    }
    if (confirm(`آیا از حذف صفحه "${state.pg[idx].t}" اطمینان دارید؟`)) {
      onUpdateState((prev) => {
        const next = prev.pg.filter((_, i) => i !== idx);
        return { ...prev, pg: next };
      });
      onPageChange(Math.max(0, idx - 1));
    }
  };

  const handleMovePage = (idx: number, delta: number) => {
    const targetIdx = idx + delta;
    if (targetIdx < 0 || targetIdx >= state.pg.length) return;
    onUpdateState((prev) => {
      const next = [...prev.pg];
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      return { ...prev, pg: next };
    });
    onPageChange(targetIdx);
  };

  const handleUpdateCurrentPage = (updates: Partial<CatalogPage>) => {
    onUpdateState((prev) => {
      const nextPages = [...prev.pg];
      nextPages[currentPageIndex] = {
        ...nextPages[currentPageIndex],
        ...updates,
      };
      return { ...prev, pg: nextPages };
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 text-right">
      {/* Current Page Configuration */}
      <section className="flex flex-col gap-3 p-3.5 rounded-2xl border border-orange-500/30 bg-orange-500/5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-orange-500 text-white text-xs font-bold flex items-center justify-center font-mono shadow-sm">
              {currentPageIndex + 1}
            </span>
            <span className="text-xs font-bold">تنظیمات صفحه جاری</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleDuplicatePage(currentPageIndex)}
              className="p-1.5 rounded-xl border border-current/20 hover:bg-black/10 dark:hover:bg-white/10 text-xs flex items-center gap-1 cursor-pointer"
              title="تکثیر این صفحه"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDeletePage(currentPageIndex)}
              className="p-1.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs flex items-center gap-1 cursor-pointer"
              title="حذف این صفحه"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Page Title */}
        <div className="flex flex-col gap-1 text-xs">
          <span className="opacity-75 font-semibold">عنوان صفحه (نمایش در فهرست):</span>
          <input
            type="text"
            value={currentPage.t}
            onChange={(e) => handleUpdateCurrentPage({ t: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-current/20 bg-black/10 dark:bg-white/5 font-bold focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Show in TOC checkbox */}
        <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
          <input
            type="checkbox"
            checked={currentPage.toc}
            onChange={(e) => handleUpdateCurrentPage({ toc: e.target.checked })}
            className="w-4 h-4 rounded text-orange-500 accent-orange-500 cursor-pointer"
          />
          <span className="font-semibold">نمایش در فهرست مطالب (TOC)</span>
        </label>

        {/* Columns Layout */}
        <div className="flex flex-col gap-1.5 text-xs pt-2 border-t border-current/10">
          <span className="opacity-75 font-semibold">تعداد ستون‌های متن و محصولات:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleUpdateCurrentPage({ cols: 1 })}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                (!currentPage.cols || currentPage.cols === 1)
                  ? 'border-orange-500 bg-orange-500/15 font-bold text-orange-400 shadow-sm'
                  : 'border-current/15 hover:border-orange-500/40 bg-black/5 dark:bg-white/5'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>تک ستونه</span>
            </button>
            <button
              onClick={() => handleUpdateCurrentPage({ cols: 2 })}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                currentPage.cols === 2
                  ? 'border-orange-500 bg-orange-500/15 font-bold text-orange-400 shadow-sm'
                  : 'border-current/15 hover:border-orange-500/40 bg-black/5 dark:bg-white/5'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>دو ستونه (شبکه محصولات)</span>
            </button>
          </div>
        </div>

        {/* Page Background Shade */}
        <div className="flex flex-col gap-1.5 text-xs pt-2 border-t border-current/10">
          <span className="opacity-75 font-semibold">تم پس‌زمینه اختصاصی این صفحه:</span>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { val: 0, label: 'پیش‌فرض' },
              { val: 1, label: 'کارت' },
              { val: 2, label: 'معکوس' },
              { val: 3, label: 'اکسنت' },
            ].map((sh) => (
              <button
                key={sh.val}
                onClick={() => handleUpdateCurrentPage({ bg: sh.val as any })}
                className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center cursor-pointer transition-all ${
                  (currentPage.bg || 0) === sh.val
                    ? 'border-orange-500 bg-orange-500/20 text-orange-400 font-bold shadow-sm'
                    : 'border-current/15 hover:border-orange-500/40 bg-black/5 dark:bg-white/5'
                }`}
              >
                {sh.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pages List and Management */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold opacity-75">
            <Layers className="w-4 h-4 text-orange-500" />
            <span>مدیریت صفحات ({state.pg.length} صفحه)</span>
          </div>
          <button
            onClick={handleAddPage}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors cursor-pointer shadow-md shadow-orange-500/25 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>صفحه جدید</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {state.pg.map((p, idx) => {
            const isCurrent = idx === currentPageIndex;
            return (
              <div
                key={p.id}
                onClick={() => onPageChange(idx)}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-orange-500 bg-orange-500/10 shadow-md ring-1 ring-orange-500/30'
                    : 'border-current/15 hover:border-orange-500/40 bg-black/5 dark:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center font-mono ${
                      isCurrent
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-black/10 dark:bg-white/10 opacity-70'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold truncate">{p.t}</span>
                    <span className="text-[10px] opacity-60">
                      {p.bl.length} بلوک {p.cols === 2 ? '• دو ستونه' : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleMovePage(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                    title="جابجایی به بالا"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMovePage(idx, 1)}
                    disabled={idx === state.pg.length - 1}
                    className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                    title="جابجایی به پایین"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
