import React from 'react';
import { EditorUiTheme } from '../types/catalog';
import { EDITOR_UI_THEMES_INFO } from '../constants/presets';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Check, X } from 'lucide-react';

interface UiStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: EditorUiTheme;
  onSelectTheme: (theme: EditorUiTheme) => void;
}

export const UiStyleModal: React.FC<UiStyleModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 text-slate-100 flex flex-col gap-5 z-10 text-right overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shadow-md shadow-orange-500/20">
                <Palette className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg text-white">
                    انتخاب استایل محیط کاربری استودیو
                  </h3>
                  <span className="text-xs bg-orange-500/20 text-orange-400 px-2.5 py-0.5 rounded-full font-bold">
                    تم ظاهری نرم‌افزار
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  محیط کاری دلخواه خود را برای طراحی راحت‌تر در طول شب یا روز انتخاب نمایید
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

          {/* Grid of UI Environment Themes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(EDITOR_UI_THEMES_INFO) as EditorUiTheme[]).map((themeKey) => {
              const info = EDITOR_UI_THEMES_INFO[themeKey];
              const isSelected = currentTheme === themeKey;

              return (
                <div
                  key={themeKey}
                  onClick={() => {
                    onSelectTheme(themeKey);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 relative group ${
                    isSelected
                      ? 'border-orange-500 bg-slate-800/90 ring-2 ring-orange-500/30 shadow-lg shadow-orange-500/10'
                      : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/70 hover:border-slate-700'
                  }`}
                >
                  {/* Top info */}
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <b className="text-sm font-bold text-white">{info.title}</b>
                        <span className="text-[10px] bg-slate-700/80 text-slate-300 px-2 py-0.5 rounded-md font-mono">
                          {info.subtitle}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {info.desc}
                      </p>
                    </div>
                    {isSelected ? (
                      <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center flex-none shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full border border-slate-700 group-hover:border-slate-500 flex-none" />
                    )}
                  </div>

                  {/* Visual Environment Mockup Miniature */}
                  <div
                    className="w-full h-28 rounded-xl p-2 flex flex-col gap-1.5 border border-white/10 overflow-hidden shadow-inner relative"
                    style={{ backgroundColor: info.previewBg }}
                  >
                    {/* Mock header */}
                    <div className="h-4 rounded-md bg-white/15 flex items-center justify-between px-2">
                      <div className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: info.previewAccent }}
                        />
                        <div className="w-12 h-1.5 rounded-full bg-white/25" />
                      </div>
                      <div className="flex gap-1">
                        <div className="w-6 h-1.5 rounded-full bg-white/20" />
                        <div className="w-4 h-1.5 rounded-full bg-white/20" />
                      </div>
                    </div>

                    {/* Mock editor body */}
                    <div className="flex-1 flex gap-1.5">
                      {/* Mock sidebar */}
                      <div className="w-16 rounded-md bg-white/10 flex flex-col gap-1 p-1">
                        <div className="w-full h-2 rounded bg-white/20" />
                        <div className="w-full h-2 rounded bg-white/20" />
                        <div className="w-full h-2 rounded bg-white/20" />
                      </div>
                      {/* Mock preview catalog */}
                      <div className="flex-1 rounded-md bg-white/5 flex items-center justify-center p-1 border border-white/5">
                        <div className="w-14 h-18 rounded bg-white/20 shadow-sm flex flex-col p-1 gap-1">
                          <div
                            className="w-4 h-1 rounded"
                            style={{ backgroundColor: info.previewAccent }}
                          />
                          <div className="w-full h-6 rounded bg-white/30" />
                          <div className="w-8 h-1 rounded bg-white/20" />
                        </div>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-white font-semibold">
                      {info.badge}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTheme(themeKey);
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-slate-700/60 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isSelected ? 'تم فعال فعلی' : 'انتخاب و اعمال این استایل'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer Notice */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
            <span>تم انتخاب شده به صورت خودکار در حافظه مرورگر ذخیره می‌شود.</span>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors cursor-pointer"
            >
              بستن
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
