import React, { useState, useRef } from 'react';
import { CatalogPage } from '../types/catalog';
import { motion, AnimatePresence } from 'motion/react';
import {
  UploadCloud,
  FileImage,
  X,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface UploadCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportPages: (pages: CatalogPage[], mode: 'replace' | 'append') => void;
  currentPagesCount: number;
}

interface UploadedPageItem {
  id: string;
  name: string;
  previewUrl: string;
}

export const UploadCatalogModal: React.FC<UploadCatalogModalProps> = ({
  isOpen,
  onClose,
  onImportPages,
  currentPagesCount,
}) => {
  const [pages, setPages] = useState<UploadedPageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const [statusMsg, setStatusMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const loadPdfJs = (): Promise<any> => {
    if ((window as any).pdfjsLib) {
      return Promise.resolve((window as any).pdfjsLib);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        const lib = (window as any).pdfjsLib;
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(lib);
      };
      script.onerror = () => reject(new Error('بارگذاری موتور پردازش PDF ناموفق بود.'));
      document.head.appendChild(script);
    });
  };

  const handlePdfFile = async (file: File) => {
    setIsProcessing(true);
    setStatusMsg('در حال بارگذاری موتور پردازش PDF...');
    try {
      const pdfjs = await loadPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;
      const newPages: UploadedPageItem[] = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setStatusMsg(`در حال تبدیل صفحه ${pageNum} از ${numPages} به تصویر...`);
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          newPages.push({
            id: 'up_' + Math.random().toString(36).substring(2, 9),
            name: `${file.name.replace(/\.[^/.]+$/, '')} - صفحه ${pageNum}`,
            previewUrl: dataUrl,
          });
        }
      }
      setPages((prev) => [...prev, ...newPages]);
    } catch (err) {
      console.error('PDF error:', err);
      alert('خطا در پردازش فایل PDF. لطفاً فایل تصویری مستقیم آپلود کنید.');
    } finally {
      setIsProcessing(false);
      setStatusMsg('');
    }
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);

    const pdfFile = fileList.find(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfFile) {
      await handlePdfFile(pdfFile);
      return;
    }

    setIsProcessing(true);
    setStatusMsg('در حال خواندن صفحات...');
    fileList.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    const newPages: UploadedPageItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const dataUrl = await readFileAsDataUrl(file);
      newPages.push({
        id: 'up_' + Math.random().toString(36).substring(2, 9),
        name: file.name.replace(/\.[^/.]+$/, ''),
        previewUrl: dataUrl,
      });
    }
    setPages((prev) => [...prev, ...newPages]);
    setIsProcessing(false);
    setStatusMsg('');
  };

  const handleDeletePage = (idx: number) => {
    setPages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFinishImport = () => {
    if (pages.length === 0) return;

    const importedCatalogPages: CatalogPage[] = pages.map((item, idx) => ({
      id: 'p_' + Math.random().toString(36).substring(2, 9),
      t: item.name || `صفحه ${idx + 1}`,
      toc: true,
      bgImage: item.previewUrl,
      bgImageFit: 'cover',
      bl: [
        {
          id: 'b_' + Math.random().toString(36).substring(2, 9),
          t: 'btn',
          x: 'مشاهده جزئیات و خرید',
          u: 'https://',
          al: 'left',
          sh: 'gradient',
        },
      ],
    }));

    onImportPages(importedCatalogPages, importMode);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-5 md:p-6 text-slate-100 flex flex-col gap-4 z-10 text-right overflow-hidden max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shadow-md shadow-orange-500/20">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base md:text-lg text-white">
                    تبدیل کاتالوگ موجود (PDF / تصاویر) به کاتالوگ هوشمند
                  </h3>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold">
                    تعاملی‌سازی
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  فایل PDF یا صفحات اسکن شده را آپلود کنید تا دکمه‌ها و آیکون‌های متحرک روی آنها قرار گیرند
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Upload Dropzone */}
          <div className="flex flex-col gap-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf,.pdf"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
            <div
              onClick={() => !isProcessing && fileInputRef.current?.click()}
              className="border-2 border-dashed border-orange-500/40 hover:border-orange-500 bg-orange-500/5 hover:bg-orange-500/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/20">
                {isProcessing ? (
                  <Sparkles className="w-6 h-6 animate-spin" />
                ) : (
                  <FileImage className="w-6 h-6" />
                )}
              </div>
              <b className="text-sm font-bold text-white group-hover:text-orange-300">
                {isProcessing
                  ? statusMsg || 'در حال آماده‌سازی...'
                  : 'انتخاب یا رها کردن فایل کاتالوگ (PDF یا عکس‌های JPG/PNG)'}
              </b>
              <span className="text-xs text-slate-400 max-w-md">
                هر صفحه به صورت خودکار به یک برگ کاتالوگ با قابلیت افزودن دکمه‌های خرید و آیکون‌های تعاملی تبدیل می‌شود.
              </span>
            </div>
          </div>

          {/* Uploaded Pages Grid Preview */}
          {pages.length > 0 && (
            <div className="flex-1 flex flex-col gap-2 min-h-0 overflow-hidden">
              <div className="flex items-center justify-between flex-none">
                <span className="text-xs font-bold text-slate-300">
                  صفحات شناسایی شده ({pages.length} صفحه):
                </span>
                <button
                  onClick={() => setPages([])}
                  className="text-[11px] text-red-400 hover:underline cursor-pointer"
                >
                  پاک کردن همه
                </button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
                {pages.map((p, idx) => (
                  <div
                    key={p.id}
                    className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-800 flex flex-col"
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden bg-slate-950 relative">
                      <img
                        src={p.previewUrl}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white font-bold">
                        صفحه {idx + 1}
                      </span>
                      <button
                        onClick={() => handleDeletePage(idx)}
                        className="absolute top-2 left-2 p-1.5 rounded-lg bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
                        title="حذف این صفحه"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-2 flex items-center justify-between text-xs font-semibold truncate">
                      <span className="truncate">{p.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Import Mode: Replace vs Append */}
          {pages.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700 text-xs flex-none">
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-bold">روش اعمال:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setImportMode('replace')}
                    className={`px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                      importMode === 'replace'
                        ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                        : 'border-slate-700 bg-slate-800'
                    }`}
                  >
                    جایگزینی کل کاتالوگ
                  </button>
                  <button
                    onClick={() => setImportMode('append')}
                    className={`px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                      importMode === 'append'
                        ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                        : 'border-slate-700 bg-slate-800'
                    }`}
                  >
                    افزودن به انتهای صفحات فعلی ({currentPagesCount})
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleFinishImport}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>تأیید و ورود به ویرایشگر تعاملی</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
