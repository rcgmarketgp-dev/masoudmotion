import React, { useRef, useState } from 'react';
import { CatalogState } from '../../types/catalog';
import { generateStandaloneCatalogHtml } from '../../utils/htmlExporter';
import { INITIAL_CATALOG_STATE } from '../../constants/presets';
import { soundEffects } from '../../utils/soundEffects';
import {
  Download,
  Printer,
  Copy,
  FileCode,
  FolderUp,
  RotateCcw,
  QrCode,
  Check,
  Code2,
  FolderArchive,
  FilePlus,
  Globe,
} from 'lucide-react';

interface ExportPanelProps {
  state: CatalogState;
  onUpdateState: (updater: (prev: CatalogState) => CatalogState) => void;
  onPrint: () => void;
  onOpenCodeModal?: () => void;
  onOpenArchiveModal?: () => void;
  onSaveToArchive?: () => void;
  onNewCatalog?: () => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  state,
  onUpdateState,
  onPrint,
  onOpenCodeModal,
  onOpenArchiveModal,
  onSaveToArchive,
  onNewCatalog,
}) => {
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  // Download Standalone HTML
  const handleDownloadHtml = () => {
    soundEffects.playChime();
    const htmlContent = generateStandaloneCatalogHtml(state);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.title || 'smart-catalog'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy HTML to clipboard
  const handleCopyHtml = async () => {
    try {
      const htmlContent = generateStandaloneCatalogHtml(state);
      await navigator.clipboard.writeText(htmlContent);
      soundEffects.playPop();
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2500);
    } catch (err) {
      alert('خطا در کپی به کلیپ‌بورد.');
    }
  };

  // Download JSON project file
  const handleDownloadJson = () => {
    soundEffects.playPop();
    const jsonStr = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.title || 'smart-catalog'}-project.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON project file
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as CatalogState;
        if (parsed.pg && Array.isArray(parsed.pg)) {
          soundEffects.playChime();
          onUpdateState(() => parsed);
          alert('پروژه کاتالوگ با موفقیت بارگذاری شد.');
        } else {
          alert('فرمت فایل کاتالوگ نامعتبر است.');
        }
      } catch (err) {
        alert('خطا در خواندن فایل JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Reset to default
  const handleReset = () => {
    soundEffects.playPop();
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 4000);
      return;
    }
    onUpdateState(() => INITIAL_CATALOG_STATE);
    setResetConfirm(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4 text-right">
      {/* 0. Quick Hub: Code, New Catalog & Archive */}
      <section className="flex flex-col gap-2 p-3.5 rounded-2xl border border-orange-500/40 bg-gradient-to-br from-orange-500/15 via-amber-500/5 to-transparent shadow-sm">
        <span className="text-xs font-black text-orange-400">
          امکانات مدیریت، کد و کاتالوگ جدید:
        </span>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {onOpenCodeModal && (
            <button
              onClick={() => {
                soundEffects.playPop();
                onOpenCodeModal();
              }}
              className="p-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm active:scale-95"
            >
              <Code2 className="w-4 h-4" />
              <span>مشاهده کد و امبد</span>
            </button>
          )}

          {onOpenArchiveModal && (
            <button
              onClick={() => {
                soundEffects.playPop();
                onOpenArchiveModal();
              }}
              className="p-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm active:scale-95"
            >
              <FolderArchive className="w-4 h-4" />
              <span>بایگانی پروژه‌ها</span>
            </button>
          )}

          {onNewCatalog && (
            <button
              onClick={() => {
                soundEffects.playAdd();
                onNewCatalog();
              }}
              className="col-span-2 p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:brightness-110 transition-all active:scale-95"
            >
              <FilePlus className="w-4 h-4" />
              <span>ساخت کاتالوگ جدید (خام و ریست صفحات)</span>
            </button>
          )}
        </div>
      </section>

      {/* 1. Final Delivery & Export */}
      <section className="flex flex-col gap-2.5">
        <span className="text-xs font-bold opacity-75">
          خروجی نهایی کاتالوگ دیجیتال و تعاملی:
        </span>

        {/* Standalone HTML */}
        <button
          onClick={handleDownloadHtml}
          className="p-3.5 rounded-2xl border border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 transition-all cursor-pointer flex items-center justify-between group shadow-sm active:scale-98"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-right">
              <b className="text-sm font-bold text-white group-hover:text-orange-400">
                دانلود فایل تعاملی مستقل (HTML)
              </b>
              <span className="text-[11px] opacity-75">
                بدون نیاز به اینترنت، با تمام انیمیشن‌ها و ناوبری
              </span>
            </div>
          </div>
        </button>

        {/* Print / PDF */}
        <button
          onClick={onPrint}
          className="p-3.5 rounded-2xl border border-current/15 hover:border-blue-500/50 bg-black/5 dark:bg-white/5 transition-all cursor-pointer flex items-center justify-between group active:scale-98"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Printer className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-right">
              <b className="text-sm font-bold">چاپ مستقیم و خروجی PDF</b>
              <span className="text-[11px] opacity-65">
                تنظیم دقیق صفحه برای پرینت یا ذخیره PDF
              </span>
            </div>
          </div>
        </button>

        {/* Copy HTML Code */}
        <button
          onClick={handleCopyHtml}
          className="p-3.5 rounded-2xl border border-current/15 hover:border-emerald-500/50 bg-black/5 dark:bg-white/5 transition-all cursor-pointer flex items-center justify-between group active:scale-98"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              {copiedHtml ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </div>
            <div className="flex flex-col text-right">
              <b className="text-sm font-bold">
                {copiedHtml ? 'کد کپی شد!' : 'کپی سورس کد کامل HTML'}
              </b>
              <span className="text-[11px] opacity-65">
                جهت قرار دادن در هاست اختصاصی یا سایت شرکت
              </span>
            </div>
          </div>
        </button>

        {/* QR Code and Quick Share */}
        <button
          onClick={() => {
            soundEffects.playPop();
            setShowQr(!showQr);
          }}
          className="p-3.5 rounded-2xl border border-current/15 hover:border-purple-500/50 bg-black/5 dark:bg-white/5 transition-all cursor-pointer flex items-center justify-between group active:scale-98"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-right">
              <b className="text-sm font-bold">نمایش بارکد QR کاتالوگ</b>
              <span className="text-[11px] opacity-65">
                اسکن با دوربین گوشی موبایل مشتریان
              </span>
            </div>
          </div>
        </button>

        {/* QR Modal View */}
        {showQr && (
          <div className="p-4 rounded-3xl border border-purple-500/30 bg-purple-500/10 flex flex-col items-center gap-3 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-36 h-36 bg-white p-3 rounded-2xl flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                <rect x="0" y="0" width="30" height="30" rx="3" />
                <rect x="6" y="6" width="18" height="18" fill="#fff" />
                <rect x="10" y="10" width="10" height="10" />
                <rect x="70" y="0" width="30" height="30" rx="3" />
                <rect x="76" y="6" width="18" height="18" fill="#fff" />
                <rect x="80" y="10" width="10" height="10" />
                <rect x="0" y="70" width="30" height="30" rx="3" />
                <rect x="6" y="76" width="18" height="18" fill="#fff" />
                <rect x="10" y="80" width="10" height="10" />
                <rect x="38" y="12" width="6" height="6" />
                <rect x="52" y="12" width="8" height="6" />
                <rect x="42" y="38" width="16" height="16" />
                <rect x="70" y="50" width="10" height="8" />
                <rect x="50" y="72" width="8" height="12" />
                <rect x="72" y="75" width="18" height="15" />
              </svg>
            </div>
            <span className="text-xs font-bold text-purple-300">
              بارکد اشتراک سریع کاتالوگ
            </span>
            <span className="text-[11px] opacity-75 max-w-xs leading-relaxed">
              پس از آپلود فایل HTML در سرور، مشتریان با اسکن این کیوآرکد به صورت آنلاین کاتالوگ را مشاهده خواهند کرد.
            </span>
          </div>
        )}
      </section>

      {/* 2. Project File Backup & Restore */}
      <section className="flex flex-col gap-2.5 pt-4 border-t border-current/10">
        <span className="text-xs font-bold opacity-75">
          ذخیره پروژه و پشتیبان‌گیری:
        </span>
        <div className="grid grid-cols-2 gap-2">
          {/* Download JSON */}
          <button
            onClick={handleDownloadJson}
            className="p-3 rounded-2xl border border-current/15 hover:border-orange-500/40 bg-black/5 dark:bg-white/5 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-all active:scale-95"
          >
            <FileCode className="w-5 h-5 text-orange-500" />
            <b className="text-xs font-bold">ذخیره پروژه (JSON)</b>
            <span className="text-[10px] opacity-65">دانلود نسخه پشتیبان</span>
          </button>
          {/* Upload JSON */}
          <button
            onClick={() => jsonInputRef.current?.click()}
            className="p-3 rounded-2xl border border-current/15 hover:border-blue-500/40 bg-black/5 dark:bg-white/5 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-all active:scale-95"
          >
            <FolderUp className="w-5 h-5 text-blue-500" />
            <b className="text-xs font-bold">بازگردانی پروژه</b>
            <span className="text-[10px] opacity-65">آپلود فایل JSON قبلی</span>
            <input
              ref={jsonInputRef}
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </button>
        </div>

        {/* Reset to initial */}
        <button
          onClick={handleReset}
          className={`mt-2 p-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
            resetConfirm
              ? 'border-red-500 bg-red-500 text-white font-bold animate-pulse'
              : 'border-red-500/25 text-red-400 hover:bg-red-500/10'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>
            {resetConfirm
              ? 'تأیید بازنشانی کامل کاتالوگ؟ (کلیک مجدد)'
              : 'بازنشانی به کاتالوگ اولیه پیش‌فرض RCG'}
          </span>
        </button>
      </section>
    </div>
  );
};
