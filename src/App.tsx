/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CatalogBlock,
  CatalogPage,
  CatalogState,
  EditorUiTheme,
  IconBlock,
  BlockType,
  ArchivedCatalog,
  ProjectSnapshot,
} from './types/catalog';
import {
  INITIAL_CATALOG_STATE,
  BLANK_CATALOG_STATE,
  EDITOR_UI_THEMES_INFO,
  createBlock,
} from './constants/presets';
import { Header } from './components/Header';
import { HamburgerMenu } from './components/HamburgerMenu';
import { CatalogStage } from './components/CatalogPreview/CatalogStage';
import { ThemePanel } from './components/EditorPanels/ThemePanel';
import { PagesPanel } from './components/EditorPanels/PagesPanel';
import { ContentPanel } from './components/EditorPanels/ContentPanel';
import { IconLibraryPanel } from './components/EditorPanels/IconLibraryPanel';
import { NavigationPanel } from './components/EditorPanels/NavigationPanel';
import { ExportPanel } from './components/EditorPanels/ExportPanel';
import { UiStyleModal } from './components/UiStyleModal';
import { DualDevicePreview } from './components/DualDevicePreview';
import { FullscreenViewer } from './components/FullscreenViewer';
import { IconPickerModal } from './components/IconPickerModal';
import { UploadCatalogModal } from './components/UploadCatalogModal';
import { ArchiveModal } from './components/ArchiveModal';
import { CodeExportModal } from './components/CodeExportModal';
import { generateStandaloneCatalogHtml } from './utils/htmlExporter';
import { soundEffects } from './utils/soundEffects';
import { motion, AnimatePresence } from 'motion/react';
import {
  Palette,
  Layers,
  Edit3,
  Compass,
  Download,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Type,
  ImageIcon,
  Package,
  Link,
  Phone,
} from 'lucide-react';

const MAX_HISTORY_STEPS = 12;

export default function App() {
  // Load state from localStorage or initial
  const [state, setState] = useState<CatalogState>(() => {
    try {
      const saved = localStorage.getItem('smart-catalog-rcg-v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved state, using default');
    }
    return INITIAL_CATALOG_STATE;
  });

  // Undo / Redo History Stack (up to 12 moves + history descriptions)
  const [history, setHistory] = useState<CatalogState[]>([state]);
  const [historyDescriptions, setHistoryDescriptions] = useState<string[]>([
    'بارگذاری اولیه کاتالوگ',
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Archive of Created Catalogs
  const [archives, setArchives] = useState<ArchivedCatalog[]>(() => {
    try {
      const savedArchives = localStorage.getItem('smart-catalog-archive-v1');
      if (savedArchives) {
        return JSON.parse(savedArchives);
      }
    } catch (e) {}
    // Seed with initial template archive
    return [
      {
        id: 'arch_init_sample',
        title: INITIAL_CATALOG_STATE.title,
        subtitle: INITIAL_CATALOG_STATE.subtitle,
        updatedAt: Date.now() - 3600000,
        pagesCount: INITIAL_CATALOG_STATE.pg.length,
        state: INITIAL_CATALOG_STATE,
      },
    ];
  });

  // Editor UI Environment Theme
  const [editorTheme, setEditorTheme] = useState<EditorUiTheme>(() => {
    try {
      const saved = localStorage.getItem('rcg-editor-theme');
      if (
        saved &&
        ['dark-obsidian', 'clean-ivory', 'glass-modern', 'vivid-creative'].includes(saved)
      ) {
        return saved as EditorUiTheme;
      }
    } catch (e) {}
    return 'dark-obsidian';
  });

  const [activeTab, setActiveTab] = useState<'theme' | 'pages' | 'content' | 'icons' | 'nav' | 'export'>('content');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>(undefined);
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);

  // Modals
  const [showUiThemeModal, setShowUiThemeModal] = useState(false);
  const [showDualPreview, setShowDualPreview] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Snapshots in Memory for instant Save & Resume
  const [snapshots, setSnapshots] = useState<ProjectSnapshot[]>(() => {
    try {
      const saved = localStorage.getItem('smart-catalog-snapshots-v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return [];
  });

  const [lastSavedTime, setLastSavedTime] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('smart-catalog-last-saved');
      if (saved) return Number(saved);
    } catch (e) {}
    return Date.now();
  });

  // Save archives to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smart-catalog-archive-v1', JSON.stringify(archives));
    } catch (e) {}
  }, [archives]);

  // Save snapshots to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smart-catalog-snapshots-v1', JSON.stringify(snapshots));
    } catch (e) {}
  }, [snapshots]);

  // Auto-save current state to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('smart-catalog-rcg-v1', JSON.stringify(state));
        const now = Date.now();
        setLastSavedTime(now);
        localStorage.setItem('smart-catalog-last-saved', String(now));
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [state]);

  // Push state to Undo/Redo history stack
  const updateStateWithHistory = useCallback(
    (
      updater: CatalogState | ((prev: CatalogState) => CatalogState),
      actionDescription = 'ویرایش کاتالوگ'
    ) => {
      setState((prev) => {
        const nextState = typeof updater === 'function' ? updater(prev) : updater;

        // Add to history stack
        setHistory((prevHist) => {
          const slicedHist = prevHist.slice(0, historyIndex + 1);
          const newHist = [...slicedHist, nextState];
          if (newHist.length > MAX_HISTORY_STEPS) {
            newHist.shift();
          }
          return newHist;
        });

        setHistoryDescriptions((prevDesc) => {
          const slicedDesc = prevDesc.slice(0, historyIndex + 1);
          const newDesc = [...slicedDesc, actionDescription];
          if (newDesc.length > MAX_HISTORY_STEPS) {
            newDesc.shift();
          }
          return newDesc;
        });

        setHistoryIndex((prevIdx) => Math.min(MAX_HISTORY_STEPS - 1, prevIdx + 1));

        return nextState;
      });
    },
    [historyIndex]
  );

  // Undo Handler
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const targetIdx = historyIndex - 1;
      const targetState = history[targetIdx];
      if (targetState) {
        setState(targetState);
        setHistoryIndex(targetIdx);
        showToast(`بازگشت به: ${historyDescriptions[targetIdx]}`);
      }
    }
  }, [historyIndex, history, historyDescriptions]);

  // Redo Handler
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const targetIdx = historyIndex + 1;
      const targetState = history[targetIdx];
      if (targetState) {
        setState(targetState);
        setHistoryIndex(targetIdx);
        showToast(`انتقال به: ${historyDescriptions[targetIdx]}`);
      }
    }
  }, [historyIndex, history, historyDescriptions]);

  // Direct Jump in History
  const handleJumpHistory = (idx: number) => {
    if (idx >= 0 && idx < history.length) {
      setState(history[idx]);
      setHistoryIndex(idx);
      showToast(`انتقال به حرکت: ${historyDescriptions[idx]}`);
    }
  };

  // Select block handler supporting single & multi-selection
  const handleSelectBlock = useCallback((blockId: string, isMulti = false) => {
    setSelectedBlockIds((prev) => {
      if (isMulti) {
        if (prev.includes(blockId)) {
          const next = prev.filter((id) => id !== blockId);
          setSelectedBlockId(next[next.length - 1]);
          return next;
        } else {
          setSelectedBlockId(blockId);
          return [...prev, blockId];
        }
      } else {
        setSelectedBlockId(blockId);
        return [blockId];
      }
    });
  }, []);

  // Select all blocks on current page
  const handleSelectAllBlocks = useCallback(() => {
    const curP = state.pg[currentPageIndex];
    if (!curP || curP.bl.length === 0) return;
    const allIds = curP.bl.map((b) => b.id);
    setSelectedBlockIds(allIds);
    setSelectedBlockId(allIds[0]);
    showToast(`همه عناصر این صفحه انتخاب شدند (${allIds.length} مورد).`);
  }, [state.pg, currentPageIndex]);

  // Clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedBlockIds([]);
    setSelectedBlockId(undefined);
  }, []);

  // Batch / Single Delete
  const handleBatchDelete = useCallback(() => {
    const idsToDelete =
      selectedBlockIds.length > 0
        ? selectedBlockIds
        : selectedBlockId
        ? [selectedBlockId]
        : [];
    if (idsToDelete.length === 0) return;

    soundEffects.playPop();
    const count = idsToDelete.length;
    const desc = count > 1 ? `حذف دسته‌جمعی ${count} عنصر` : 'حذف عنصر';

    updateStateWithHistory((prev) => {
      const nextPages = [...prev.pg];
      const curPage = nextPages[currentPageIndex];
      if (!curPage) return prev;
      nextPages[currentPageIndex] = {
        ...curPage,
        bl: curPage.bl.filter((b) => !idsToDelete.includes(b.id)),
      };
      return { ...prev, pg: nextPages };
    }, desc);

    setSelectedBlockIds([]);
    setSelectedBlockId(undefined);
    showToast(count > 1 ? `${count} عنصر با موفقیت حذف شدند.` : 'عنصر حذف شد.');
  }, [selectedBlockIds, selectedBlockId, currentPageIndex, updateStateWithHistory]);

  // Batch / Single Resize Delta (+0.1 or -0.1)
  const handleBatchResizeDelta = useCallback(
    (delta: number) => {
      const targetIds =
        selectedBlockIds.length > 0
          ? selectedBlockIds
          : selectedBlockId
          ? [selectedBlockId]
          : [];
      if (targetIds.length === 0) return;

      const desc =
        targetIds.length > 1
          ? `تغییر سایز دسته‌جمعی (${targetIds.length} عنصر)`
          : 'تغییر سایز عنصر';

      updateStateWithHistory((prev) => {
        const nextPages = [...prev.pg];
        const curPage = nextPages[currentPageIndex];
        if (!curPage) return prev;
        nextPages[currentPageIndex] = {
          ...curPage,
          bl: curPage.bl.map((b) => {
            if (targetIds.includes(b.id)) {
              const curScale = b.scale ?? 1;
              const newScale = Math.max(
                0.4,
                Math.min(2.5, Number((curScale + delta).toFixed(2)))
              );
              return { ...b, scale: newScale };
            }
            return b;
          }),
        };
        return { ...prev, pg: nextPages };
      }, desc);
    },
    [selectedBlockIds, selectedBlockId, currentPageIndex, updateStateWithHistory]
  );

  // Batch / Single Set Absolute Scale
  const handleBatchSetScale = useCallback(
    (scaleVal: number) => {
      const targetIds =
        selectedBlockIds.length > 0
          ? selectedBlockIds
          : selectedBlockId
          ? [selectedBlockId]
          : [];
      if (targetIds.length === 0) return;

      const clamped = Math.max(0.4, Math.min(2.5, scaleVal));
      const desc =
        targetIds.length > 1
          ? `تنظیم مقیاس دسته‌جمعی به ${Math.round(clamped * 100)}%`
          : `تنظیم مقیاس به ${Math.round(clamped * 100)}%`;

      updateStateWithHistory((prev) => {
        const nextPages = [...prev.pg];
        const curPage = nextPages[currentPageIndex];
        if (!curPage) return prev;
        nextPages[currentPageIndex] = {
          ...curPage,
          bl: curPage.bl.map((b) => {
            if (targetIds.includes(b.id)) {
              return { ...b, scale: clamped };
            }
            return b;
          }),
        };
        return { ...prev, pg: nextPages };
      }, desc);
    },
    [selectedBlockIds, selectedBlockId, currentPageIndex, updateStateWithHistory]
  );

  // Batch / Single Duplicate
  const handleBatchDuplicate = useCallback(() => {
    const targetIds =
      selectedBlockIds.length > 0
        ? selectedBlockIds
        : selectedBlockId
        ? [selectedBlockId]
        : [];
    if (targetIds.length === 0) return;

    soundEffects.playAdd();
    const newAddedIds: string[] = [];

    updateStateWithHistory((prev) => {
      const nextPages = [...prev.pg];
      const curPage = nextPages[currentPageIndex];
      if (!curPage) return prev;
      const newBl = [...curPage.bl];

      curPage.bl.forEach((b, idx) => {
        if (targetIds.includes(b.id)) {
          const dup: CatalogBlock = {
            ...JSON.parse(JSON.stringify(b)),
            id: 'b_' + Math.random().toString(36).substring(2, 9),
            posX: b.posX ? Math.min(95, b.posX + 4) : undefined,
            posY: b.posY ? Math.min(95, b.posY + 4) : undefined,
          };
          newAddedIds.push(dup.id);
          newBl.splice(idx + 1, 0, dup);
        }
      });

      nextPages[currentPageIndex] = { ...curPage, bl: newBl };
      return { ...prev, pg: nextPages };
    }, `تکثیر ${targetIds.length} عنصر`);

    if (newAddedIds.length > 0) {
      setSelectedBlockIds(newAddedIds);
      setSelectedBlockId(newAddedIds[0]);
    }
    showToast(`${targetIds.length} عنصر با موفقیت تکثیر شد.`);
  }, [selectedBlockIds, selectedBlockId, currentPageIndex, updateStateWithHistory]);

  // Batch / Single Layer Change (Bring to Front, Send to Back, Move Up/Down)
  const handleBatchChangeLayer = useCallback(
    (action: 'front' | 'back' | 'forward' | 'backward') => {
      const targetIds =
        selectedBlockIds.length > 0
          ? selectedBlockIds
          : selectedBlockId
          ? [selectedBlockId]
          : [];
      if (targetIds.length === 0) return;

      soundEffects.playPop();

      updateStateWithHistory((prev) => {
        const nextPages = [...prev.pg];
        const curPage = nextPages[currentPageIndex];
        if (!curPage) return prev;

        const maxZ = curPage.bl.reduce((acc, b) => Math.max(acc, b.posZ ?? 20), 20);
        const minZ = curPage.bl.reduce((acc, b) => Math.min(acc, b.posZ ?? 20), 20);

        const updatedBl = curPage.bl.map((b) => {
          if (targetIds.includes(b.id)) {
            const curZ = b.posZ ?? 20;
            let nextZ = curZ;
            if (action === 'front') nextZ = maxZ + 3;
            else if (action === 'back') nextZ = Math.max(1, minZ - 3);
            else if (action === 'forward') nextZ = curZ + 2;
            else if (action === 'backward') nextZ = Math.max(1, curZ - 2);
            return { ...b, posZ: nextZ };
          }
          return b;
        });

        // Also if in flow mode, reorder array
        if (action === 'front' || action === 'forward') {
          const nonSelected = updatedBl.filter((b) => !targetIds.includes(b.id));
          const selected = updatedBl.filter((b) => targetIds.includes(b.id));
          nextPages[currentPageIndex] = {
            ...curPage,
            bl: [...nonSelected, ...selected],
          };
        } else {
          const nonSelected = updatedBl.filter((b) => !targetIds.includes(b.id));
          const selected = updatedBl.filter((b) => targetIds.includes(b.id));
          nextPages[currentPageIndex] = {
            ...curPage,
            bl: [...selected, ...nonSelected],
          };
        }

        return { ...prev, pg: nextPages };
      }, `تغییر ترتیب لایه عناصر`);

      showToast('ترتیب لایه عناصر با موفقیت تغییر کرد.');
    },
    [selectedBlockIds, selectedBlockId, currentPageIndex, updateStateWithHistory]
  );

  // Batch / Single Width Set (25%, 50%, 75%, 100%)
  const handleBatchSetWidth = useCallback(
    (widthPercent: number) => {
      const targetIds =
        selectedBlockIds.length > 0
          ? selectedBlockIds
          : selectedBlockId
          ? [selectedBlockId]
          : [];
      if (targetIds.length === 0) return;

      updateStateWithHistory((prev) => {
        const nextPages = [...prev.pg];
        const curPage = nextPages[currentPageIndex];
        if (!curPage) return prev;
        nextPages[currentPageIndex] = {
          ...curPage,
          bl: curPage.bl.map((b) => {
            if (targetIds.includes(b.id)) {
              return { ...b, posW: widthPercent };
            }
            return b;
          }),
        };
        return { ...prev, pg: nextPages };
      }, `تنظیم عرض عناصر به ${widthPercent}%`);
      showToast(`عرض عناصر به ${widthPercent}% تغییر یافت.`);
    },
    [selectedBlockIds, selectedBlockId, currentPageIndex, updateStateWithHistory]
  );

  // Keyboard shortcut listener for Ctrl+Z, Ctrl+Y, Delete/Backspace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedBlockIds.length > 0 || selectedBlockId) {
          e.preventDefault();
          handleBatchDelete();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, handleBatchDelete, selectedBlockIds, selectedBlockId]);

  // Save current catalog snapshot to archive
  const handleSaveCurrentToArchive = () => {
    const newArch: ArchivedCatalog = {
      id: 'arch_' + Math.random().toString(36).substring(2, 9),
      title: state.title || 'کاتالوگ بدون عنوان',
      subtitle: state.subtitle,
      updatedAt: Date.now(),
      pagesCount: state.pg.length,
      state: JSON.parse(JSON.stringify(state)),
    };
    setArchives((prev) => [newArch, ...prev]);
    showToast('نسخه فعلی کاتالوگ با موفقیت در بایگانی ذخیره شد.');
  };

  // Create New Blank Catalog (Reset all default pages to blank canvas)
  const handleNewBlankCatalog = () => {
    // 1. Auto-archive previous work first
    if (state.pg.length > 0) {
      const autoArch: ArchivedCatalog = {
        id: 'arch_auto_' + Math.random().toString(36).substring(2, 9),
        title: state.title || 'کاتالوگ قبلی',
        subtitle: state.subtitle,
        updatedAt: Date.now(),
        pagesCount: state.pg.length,
        state: JSON.parse(JSON.stringify(state)),
      };
      setArchives((prev) => [autoArch, ...prev.filter((a) => a.id !== autoArch.id)]);
    }

    // 2. Set to clean blank slate
    const freshState = JSON.parse(JSON.stringify(BLANK_CATALOG_STATE));
    setState(freshState);
    setCurrentPageIndex(0);
    setSelectedBlockId(undefined);
    setActiveTab('content');

    // 3. Reset history stack with new starting point
    setHistory([freshState]);
    setHistoryDescriptions(['شروع کاتالوگ جدید (خام)']);
    setHistoryIndex(0);

    showToast('کاتالوگ جدید ایجاد شد. تمامی صفحات پیش‌فرض ریست گردید.');
  };

  // Load an archived catalog
  const handleLoadArchivedCatalog = (archived: ArchivedCatalog) => {
    const loadedState = JSON.parse(JSON.stringify(archived.state));
    setState(loadedState);
    setCurrentPageIndex(0);
    setSelectedBlockId(undefined);

    // Reset history stack with loaded state
    setHistory([loadedState]);
    setHistoryDescriptions([`بارگذاری کاتالوگ: ${archived.title}`]);
    setHistoryIndex(0);

    showToast(`کاتالوگ "${archived.title}" با موفقیت باز شد.`);
  };

  // Delete an archive
  const handleDeleteArchive = (id: string) => {
    setArchives((prev) => prev.filter((a) => a.id !== id));
    showToast('کاتالوگ از بایگانی حذف شد.');
  };

  // Duplicate an archive
  const handleDuplicateArchive = (item: ArchivedCatalog) => {
    const duplicated: ArchivedCatalog = {
      ...JSON.parse(JSON.stringify(item)),
      id: 'arch_' + Math.random().toString(36).substring(2, 9),
      title: `${item.title} (نسخه کپی)`,
      updatedAt: Date.now(),
    };
    setArchives((prev) => [duplicated, ...prev]);
    showToast('نسخه کپی کاتالوگ در بایگانی ایجاد شد.');
  };

  // Explicit Save to Memory with full state snapshot
  const handleSaveToMemory = useCallback((customTitle?: string) => {
    const now = Date.now();
    setLastSavedTime(now);
    try {
      localStorage.setItem('smart-catalog-rcg-v1', JSON.stringify(state));
      localStorage.setItem('smart-catalog-last-saved', String(now));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }

    const newSnap: ProjectSnapshot = {
      id: 'snap_' + Math.random().toString(36).substring(2, 9),
      title: customTitle || state.title || 'کاتالوگ ذخیره شده',
      savedAt: now,
      pagesCount: state.pg.length,
      state: JSON.parse(JSON.stringify(state)),
    };

    setSnapshots((prev) => {
      // Remove duplicate snapshots from same minute, keep up to 20
      const filtered = prev.filter(
        (s) => s.title !== newSnap.title || Math.abs(s.savedAt - now) > 30000
      );
      return [newSnap, ...filtered].slice(0, 20);
    });

    showToast('تغییرات پروژه در حافظه ذخیره شد. در هر زمان می‌توانید آن را بازخوانی کنید.');
  }, [state]);

  // Restore snapshot and resume working
  const handleRestoreSnapshot = useCallback((snap: ProjectSnapshot) => {
    const restored = JSON.parse(JSON.stringify(snap.state));
    setState(restored);
    setCurrentPageIndex(0);
    setSelectedBlockId(undefined);

    // Reset history with restored point
    setHistory([restored]);
    setHistoryDescriptions([`بازخوانی نسخه "${snap.title}"`]);
    setHistoryIndex(0);

    showToast(`نسخه "${snap.title}" با موفقیت بازخوانی شد. ادامه کار فعال است.`);
  }, []);

  // Delete snapshot from memory
  const handleDeleteSnapshot = useCallback((id: string) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
    showToast('نسخه ذخیره شده از حافظه حذف شد.');
  }, []);

  // Export Project JSON backup file
  const handleExportProjectJson = useCallback(() => {
    soundEffects.playChime();
    const exportData = {
      app: 'RCG Smart Catalog Builder',
      version: '2.4',
      exportedAt: Date.now(),
      state,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.title || 'smart-catalog'}-backup.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('فایل پشتیبان پروژه (JSON) با موفقیت دانلود شد.');
  }, [state]);

  // Import Project JSON backup file to resume
  const handleImportProjectJson = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        const stateToLoad = parsed.state || parsed;
        if (stateToLoad && stateToLoad.pg && Array.isArray(stateToLoad.pg)) {
          setState(stateToLoad);
          setCurrentPageIndex(0);
          setSelectedBlockId(undefined);
          setHistory([stateToLoad]);
          setHistoryDescriptions([`بارگذاری از فایل ${file.name}`]);
          setHistoryIndex(0);
          handleSaveToMemory(stateToLoad.title || file.name.replace('.json', ''));
          showToast(`پروژه با موفقیت از فایل "${file.name}" بازخوانی شد.`);
        } else {
          showToast('فرمت فایل پشتیبان معتبر نیست.');
        }
      } catch (err) {
        showToast('خطا در خواندن فایل JSON.');
      }
    };
    reader.readAsText(file);
  }, [handleSaveToMemory]);


  const handleImportCatalogPages = (newPages: CatalogPage[], mode: 'replace' | 'append') => {
    soundEffects.playChime();
    updateStateWithHistory((prev) => {
      if (mode === 'replace') {
        return {
          ...prev,
          pg: newPages,
        };
      } else {
        return {
          ...prev,
          pg: [...prev.pg, ...newPages],
        };
      }
    }, `وارد کردن کاتالوگ (${newPages.length} صفحه)`);
    setCurrentPageIndex(mode === 'replace' ? 0 : state.pg.length);
    showToast(`کاتالوگ با موفقیت وارد شد (${newPages.length} صفحه).`);
  };

  const handleUpdateBlockPosition = (blockId: string, posX: number, posY: number) => {
    updateStateWithHistory((prev) => {
      const nextPages = [...prev.pg];
      const curBl = nextPages[currentPageIndex].bl.map((b) =>
        b.id === blockId ? { ...b, posX, posY, isFree: true } : b
      );
      nextPages[currentPageIndex] = {
        ...nextPages[currentPageIndex],
        bl: curBl,
      };
      return { ...prev, pg: nextPages };
    }, 'جابجایی موقعیت المان');
  };

  const handleTogglePageLayoutMode = () => {
    soundEffects.playPop();
    const curMode = state.pg[currentPageIndex]?.layoutMode || 'flow';
    const nextMode = curMode === 'flow' ? 'free' : 'flow';
    updateStateWithHistory((prev) => {
      const nextPages = [...prev.pg];
      nextPages[currentPageIndex] = {
        ...nextPages[currentPageIndex],
        layoutMode: nextMode,
      };
      return { ...prev, pg: nextPages };
    }, `تغییر چیدمان به ${nextMode === 'free' ? 'آزاد' : 'ستونی'}`);
    showToast(
      nextMode === 'free'
        ? 'حالت چیدمان به شناور ۲ بعدی تغییر یافت.'
        : 'حالت چیدمان به ستونی استاندارد تغییر یافت.'
    );
  };

  // Quick 1-click block insertion from floating dock
  const handleQuickAddBlock = (type: BlockType) => {
    soundEffects.playAdd();
    const newBlock = createBlock(type);
    updateStateWithHistory((prev) => {
      const nextPages = [...prev.pg];
      nextPages[currentPageIndex] = {
        ...nextPages[currentPageIndex],
        bl: [...nextPages[currentPageIndex].bl, newBlock],
      };
      return { ...prev, pg: nextPages };
    }, `افزودن ${type.toUpperCase()}`);
    setSelectedBlockId(newBlock.id);
    setActiveTab('content');
    showToast(`عنصر جدید (${type.toUpperCase()}) با انیمیشن افزوده شد.`);
  };

  // Save UI Theme
  const handleSelectTheme = (th: EditorUiTheme) => {
    soundEffects.playChime();
    setEditorTheme(th);
    try {
      localStorage.setItem('rcg-editor-theme', th);
    } catch (e) {}
    showToast(`تم محیط کاری "${EDITOR_UI_THEMES_INFO[th].title}" اعمال شد.`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddPage = () => {
    soundEffects.playAdd();
    const newIdx = state.pg.length;
    updateStateWithHistory((prev) => ({
      ...prev,
      pg: [
        ...prev.pg,
        {
          id: 'p_' + Math.random().toString(36).substring(2, 9),
          t: `صفحه جدید ${newIdx + 1}`,
          toc: true,
          bl: [
            {
              id: 'b_' + Math.random().toString(36).substring(2, 9),
              t: 'h',
              x: `عنوان صفحه ${newIdx + 1}`,
              sz: 28,
              al: 'right',
              hs: 'b',
            },
            {
              id: 'b_' + Math.random().toString(36).substring(2, 9),
              t: 'hr',
              st: 'solid',
            },
          ],
        },
      ],
    }), `افزودن صفحه ${newIdx + 1}`);
    setCurrentPageIndex(newIdx);
    setActiveTab('content');
    showToast('صفحه جدید به کاتالوگ اضافه شد.');
  };

  const handleAddTocPage = () => {
    soundEffects.playAdd();
    updateStateWithHistory((prev) => {
      const newPages = [...prev.pg];
      newPages.splice(1, 0, {
        id: 'p_' + Math.random().toString(36).substring(2, 9),
        t: 'فهرست مطالب',
        toc: false,
        bl: [
          {
            id: 'b_' + Math.random().toString(36).substring(2, 9),
            t: 'h',
            x: 'فهرست بخش‌های کاتالوگ',
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
            t: 'toc',
            title: 'فهرست هوشمند',
          },
        ],
      });
      return { ...prev, pg: newPages };
    }, 'افزودن صفحه فهرست مطالب');
    setCurrentPageIndex(1);
    showToast('صفحه فهرست با موفقیت درج شد.');
  };

  const handleAddIconBlock = (iconBlock: IconBlock) => {
    soundEffects.playAdd();
    updateStateWithHistory((prev) => {
      const nextPages = [...prev.pg];
      nextPages[currentPageIndex] = {
        ...nextPages[currentPageIndex],
        bl: [...nextPages[currentPageIndex].bl, iconBlock],
      };
      return { ...prev, pg: nextPages };
    }, `افزودن آیکون ${iconBlock.iconName}`);
    setSelectedBlockId(iconBlock.id);
    showToast('آیکون وکتور با موفقیت به صفحه افزوده شد.');
  };

  const handleDownloadHtml = () => {
    const html = generateStandaloneCatalogHtml(state);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.title || 'smart-catalog'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('فایل مستقل کاتالوگ HTML دانلود شد.');
  };

  const handlePrint = () => {
    soundEffects.playPop();
    window.print();
  };

  const themeClasses = EDITOR_UI_THEMES_INFO[editorTheme];

  const TABS = [
    {
      id: 'content',
      label: 'ابزارهای محتوا',
      icon: <Edit3 className="w-4 h-4 text-amber-400" />,
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 'icons',
      label: 'آیکون‌های متحرک',
      icon: <Sparkles className="w-4 h-4 text-fuchsia-400 animate-pulse" />,
      color: 'from-fuchsia-500 to-pink-500',
    },
    {
      id: 'pages',
      label: 'صفحات و چیدمان',
      icon: <Layers className="w-4 h-4 text-emerald-400" />,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'theme',
      label: 'رنگ و برند',
      icon: <Palette className="w-4 h-4 text-blue-400" />,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      id: 'nav',
      label: 'انیمیشن و منو',
      icon: <Compass className="w-4 h-4 text-purple-400" />,
      color: 'from-purple-500 to-violet-500',
    },
    {
      id: 'export',
      label: 'خروجی کاتالوگ',
      icon: <Download className="w-4 h-4 text-rose-400" />,
      color: 'from-rose-500 to-red-500',
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${themeClasses.stageBg}`}
    >
      {/* Fixed Top-Right Hamburger Menu with Memory Storage, Resume & Full App Features */}
      <HamburgerMenu
        state={state}
        editorTheme={editorTheme}
        snapshots={snapshots}
        lastSavedTime={lastSavedTime}
        onSaveToMemory={handleSaveToMemory}
        onRestoreSnapshot={handleRestoreSnapshot}
        onDeleteSnapshot={handleDeleteSnapshot}
        onExportProjectJson={handleExportProjectJson}
        onImportProjectJson={handleImportProjectJson}
        onNewCatalog={handleNewBlankCatalog}
        onOpenArchiveModal={() => setShowArchiveModal(true)}
        onOpenUploadModal={() => setShowUploadModal(true)}
        onOpenCodeModal={() => setShowCodeModal(true)}
        onOpenDualPreview={() => setShowDualPreview(true)}
        onOpenFullscreen={() => setShowFullscreen(true)}
        onOpenIconModal={() => setShowIconModal(true)}
        onOpenThemeModal={() => setShowUiThemeModal(true)}
        onPrint={handlePrint}
        onDownloadHtml={handleDownloadHtml}
      />

      {/* Floating Draggable Top Toolbar */}
      <div className="w-full flex justify-center py-2 px-3 z-30 pointer-events-none">
        <Header
          state={state}
          editorTheme={editorTheme}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
          historyDescriptions={historyDescriptions}
          historyIndex={historyIndex}
          onJumpHistory={handleJumpHistory}
          onOpenThemeModal={() => setShowUiThemeModal(true)}
          onOpenIconModal={() => setShowIconModal(true)}
          onOpenUploadModal={() => setShowUploadModal(true)}
          onOpenDualPreview={() => setShowDualPreview(true)}
          onOpenFullscreen={() => setShowFullscreen(true)}
          onOpenArchiveModal={() => setShowArchiveModal(true)}
          onOpenCodeModal={() => setShowCodeModal(true)}
          onNewCatalog={handleNewBlankCatalog}
          onDownloadHtml={handleDownloadHtml}
          onSaveToMemory={handleSaveToMemory}
          lastSavedTime={lastSavedTime}
          onUpdateTitle={(title) =>
            updateStateWithHistory((p) => ({ ...p, title }), 'ویرایش عنوان کاتالوگ')
          }
        />
      </div>

      {/* Main Studio Workspace: Sidebar (Controls) + Center Viewport (Catalog Stage) */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        {/* Editor Settings Sidebar with Smooth Animated Tabs */}
        <aside
          className={`w-full md:w-96 lg:w-[410px] flex flex-col flex-none z-10 transition-all duration-300 ${
            themeClasses.sidebarBg
          } ${
            mobileDrawerOpen ? 'max-h-[60vh] md:max-h-none' : 'max-h-12 md:max-h-none'
          }`}
        >
          {/* Mobile drawer toggle */}
          <div
            onClick={() => {
              soundEffects.playPop();
              setMobileDrawerOpen(!mobileDrawerOpen);
            }}
            className="md:hidden flex items-center justify-between p-3 bg-black/10 dark:bg-white/5 border-b border-inherit cursor-pointer"
          >
            <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{mobileDrawerOpen ? 'بستن پنل ابزارها' : 'باز کردن منو و ابزارها'}</span>
            </span>
            {mobileDrawerOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </div>

          {/* Navigation Tabs Header with Colorful Icons and Fluid Indicator */}
          <div className="flex items-center border-b border-inherit bg-black/10 dark:bg-white/5 overflow-x-auto no-scrollbar flex-none px-2 py-1.5 gap-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    soundEffects.playPop();
                    setActiveTab(tab.id as any);
                    setMobileDrawerOpen(true);
                  }}
                  className={`relative flex-1 py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {/* Active tab colored background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tab.color} opacity-90 -z-10 shadow-md`}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    />
                  )}
                  <div className="flex items-center gap-1">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Panel Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {activeTab === 'theme' && (
              <ThemePanel
                state={state}
                onUpdateState={(updater) => updateStateWithHistory(updater, 'تغییر تنظیمات تم و برند')}
              />
            )}
            {activeTab === 'pages' && (
              <PagesPanel
                state={state}
                currentPageIndex={currentPageIndex}
                onPageChange={setCurrentPageIndex}
                onUpdateState={(updater) => updateStateWithHistory(updater, 'مدیریت صفحات')}
              />
            )}
            {activeTab === 'content' && (
              <ContentPanel
                state={state}
                currentPageIndex={currentPageIndex}
                selectedBlockId={selectedBlockId}
                selectedBlockIds={selectedBlockIds}
                onSelectBlock={handleSelectBlock}
                onUpdateState={(updater) => updateStateWithHistory(updater, 'ویرایش محتوا')}
                onOpenIconModal={() => setShowIconModal(true)}
                onPageChange={setCurrentPageIndex}
                onSelectAllBlocks={handleSelectAllBlocks}
                onClearSelection={handleClearSelection}
                onBatchDelete={handleBatchDelete}
                onBatchResizeDelta={handleBatchResizeDelta}
                onBatchSetScale={handleBatchSetScale}
                onBatchChangeLayer={handleBatchChangeLayer}
                onBatchSetWidth={handleBatchSetWidth}
              />
            )}
            {activeTab === 'icons' && (
              <IconLibraryPanel
                state={state}
                currentPageIndex={currentPageIndex}
                onAddIconBlock={handleAddIconBlock}
                onOpenModal={() => setShowIconModal(true)}
              />
            )}
            {activeTab === 'nav' && (
              <NavigationPanel
                state={state}
                onUpdateState={(updater) => updateStateWithHistory(updater, 'تنظیمات ناوبری')}
                onAddTocPage={handleAddTocPage}
              />
            )}
            {activeTab === 'export' && (
              <ExportPanel
                state={state}
                onUpdateState={(updater) => updateStateWithHistory(updater, 'به‌روزرسانی پروژه')}
                onPrint={handlePrint}
                onOpenCodeModal={() => setShowCodeModal(true)}
                onOpenArchiveModal={() => setShowArchiveModal(true)}
                onSaveToArchive={handleSaveCurrentToArchive}
                onNewCatalog={handleNewBlankCatalog}
              />
            )}
          </div>
        </aside>

        {/* Center Live Interactive Canvas / Stage */}
        <main className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          <CatalogStage
            state={state}
            currentPageIndex={currentPageIndex}
            selectedBlockId={selectedBlockId}
            selectedBlockIds={selectedBlockIds}
            onSelectBlock={(bId, isMulti) => {
              handleSelectBlock(bId, isMulti);
              setActiveTab('content');
            }}
            onPageChange={(idx) => {
              soundEffects.playPageTurn();
              setCurrentPageIndex(idx);
              setSelectedBlockIds([]);
              setSelectedBlockId(undefined);
            }}
            onAddPage={handleAddPage}
            onToggleFullscreen={() => setShowFullscreen(true)}
            onUpdateBlockPosition={handleUpdateBlockPosition}
            onTogglePageLayoutMode={handleTogglePageLayoutMode}
            onBatchDelete={handleBatchDelete}
            onBatchResizeDelta={handleBatchResizeDelta}
            onBatchSetScale={handleBatchSetScale}
            onBatchDuplicate={handleBatchDuplicate}
            onBatchChangeLayer={handleBatchChangeLayer}
            onSelectAllBlocks={handleSelectAllBlocks}
            onClearSelection={handleClearSelection}
          />

          {/* Floating Quick Animated Tool Strip (Right edge of canvas for fast creation) */}
          <div className="absolute bottom-16 right-4 z-20 hidden md:flex flex-col gap-2.5 p-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
            <span className="text-[9px] font-black text-center text-orange-400 py-0.5">
              افزودن سریع
            </span>
            {[
              {
                type: 'h' as BlockType,
                title: 'تیتر جدید',
                color: 'from-amber-400 to-orange-500',
                icon: <Type className="w-4 h-4" />,
              },
              {
                type: 'img' as BlockType,
                title: 'تصویر و گالری',
                color: 'from-emerald-400 to-teal-500',
                icon: <ImageIcon className="w-4 h-4" />,
              },
              {
                type: 'prod' as BlockType,
                title: 'کارت محصول',
                color: 'from-violet-500 to-purple-600',
                icon: <Package className="w-4 h-4" />,
              },
              {
                type: 'btn' as BlockType,
                title: 'دکمه تعاملی',
                color: 'from-rose-500 to-pink-500',
                icon: <Link className="w-4 h-4" />,
              },
              {
                type: 'icon' as BlockType,
                title: 'آیکون متحرک',
                color: 'from-fuchsia-500 to-purple-500',
                icon: <Sparkles className="w-4 h-4" />,
              },
              {
                type: 'contact' as BlockType,
                title: 'اطلاعات تماس',
                color: 'from-sky-400 to-blue-500',
                icon: <Phone className="w-4 h-4" />,
              },
            ].map((btn) => (
              <motion.button
                key={btn.type}
                whileHover={{ scale: 1.18, x: -4 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => handleQuickAddBlock(btn.type)}
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${btn.color} text-white flex items-center justify-center shadow-md cursor-pointer transition-shadow hover:shadow-lg hover:shadow-orange-500/25`}
                title={`افزودن سریع ${btn.title}`}
              >
                {btn.icon}
              </motion.button>
            ))}
          </div>
        </main>
      </div>

      {/* Toast Notification Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-slate-900/95 text-white border border-slate-700 shadow-2xl backdrop-blur-xl text-xs font-bold ring-1 ring-white/10"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-none" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vector SVG Icon Picker Modal Popup */}
      <IconPickerModal
        isOpen={showIconModal}
        onClose={() => setShowIconModal(false)}
        state={state}
        onAddIconBlock={handleAddIconBlock}
      />

      {/* Upload Existing Catalog & Enhance Modal */}
      <UploadCatalogModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onImportPages={handleImportCatalogPages}
        currentPagesCount={state.pg.length}
      />

      {/* Editor UI Theme Comparison & Selection Modal */}
      <UiStyleModal
        isOpen={showUiThemeModal}
        onClose={() => setShowUiThemeModal(false)}
        currentTheme={editorTheme}
        onSelectTheme={handleSelectTheme}
      />

      {/* Dual Device Preview (Side-by-side Mobile & Desktop) */}
      {showDualPreview && (
        <DualDevicePreview
          state={state}
          onClose={() => setShowDualPreview(false)}
        />
      )}

      {/* Fullscreen Client Presentation Mode */}
      {showFullscreen && (
        <FullscreenViewer
          state={state}
          initialPage={currentPageIndex}
          onClose={() => setShowFullscreen(false)}
        />
      )}

      {/* Archive Modal */}
      <ArchiveModal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        archives={archives}
        onLoadCatalog={handleLoadArchivedCatalog}
        onDeleteArchive={handleDeleteArchive}
        onDuplicateArchive={handleDuplicateArchive}
        onSaveCurrentToArchive={handleSaveCurrentToArchive}
        onNewBlankCatalog={() => {
          handleNewBlankCatalog();
          setShowArchiveModal(false);
        }}
        currentCatalogTitle={state.title}
      />

      {/* Code, Link & Embed Viewer Modal */}
      <CodeExportModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        state={state}
      />
    </div>
  );
}
