import React, { useRef, useState } from 'react';
import { CatalogBlock, CatalogPage, CatalogState } from '../../types/catalog';
import { CATALOG_SIZES } from '../../constants/presets';
import { BlockRenderer } from './BlockRenderer';
import { Move } from 'lucide-react';

interface CatalogPageRendererProps {
  page: CatalogPage;
  pageIndex: number;
  totalPages: number;
  state: CatalogState;
  selectedBlockId?: string;
  selectedBlockIds?: string[];
  onSelectBlock?: (blockId: string, isMulti?: boolean) => void;
  onNavigatePage?: (pageIndex: number) => void;
  onUpdateBlockPosition?: (blockId: string, posX: number, posY: number) => void;
  onTogglePageLayoutMode?: () => void;
  isPrintMode?: boolean;
  isInteractiveMode?: boolean;
}

export const CatalogPageRenderer: React.FC<CatalogPageRendererProps> = ({
  page,
  pageIndex,
  totalPages,
  state,
  selectedBlockId,
  selectedBlockIds = [],
  onSelectBlock,
  onNavigatePage,
  onUpdateBlockPosition,
  onTogglePageLayoutMode,
  isPrintMode = false,
  isInteractiveMode = false,
}) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const dim = CATALOG_SIZES[state.sz] || CATALOG_SIZES.a4;
  const c = state.c;

  const isBlockSelected = (id: string) => {
    if (selectedBlockIds && selectedBlockIds.length > 0) {
      return selectedBlockIds.includes(id);
    }
    return id === selectedBlockId;
  };

  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
  const [dragCoord, setDragCoord] = useState<{ x: number; y: number } | null>(null);

  // Determine page colors based on bg tone
  const bgTone = page.bg || 0;
  let bg = c.bg;
  let fg = c.fg;
  let cardSurface = c.sf;

  if (bgTone === 1) {
    bg = c.sf;
    cardSurface = c.bg;
  } else if (bgTone === 2) {
    bg = c.fg;
    fg = c.bg;
    cardSurface = `color-mix(in srgb, ${c.bg} 15%, transparent)`;
  } else if (bgTone === 3) {
    bg = `color-mix(in srgb, ${c.ac} 12%, ${c.bg})`;
    cardSurface = c.sf;
  }

  const isFreePage = page.layoutMode === 'free';
  const flowBlocks = isFreePage ? [] : page.bl.filter((b) => !b.isFree);
  const freeBlocks = isFreePage ? page.bl : page.bl.filter((b) => b.isFree);

  const wideBlockTypes = [
    'h',
    'hr',
    'toc',
    'logo',
    'sp',
    'btn',
    'box',
    'list',
    'features',
    'contact',
    'icon',
  ];

  // Pointer drag handler for moving elements freely on the page
  const handleStartDrag = (e: React.PointerEvent, block: CatalogBlock) => {
    if (isPrintMode || isInteractiveMode || !onUpdateBlockPosition) return;
    e.stopPropagation();
    if (onSelectBlock) {
      onSelectBlock(block.id);
    }

    const currentX = block.posX ?? 50;
    const currentY = block.posY ?? 50;
    setDraggingBlockId(block.id);
    setDragCoord({ x: currentX, y: currentY });

    const startClientX = e.clientX;
    const startClientY = e.clientY;

    const onPointerMove = (moveEvt: PointerEvent) => {
      if (!pageRef.current) return;
      const rect = pageRef.current.getBoundingClientRect();
      const deltaX = ((moveEvt.clientX - startClientX) / rect.width) * 100;
      const deltaY = ((moveEvt.clientY - startClientY) / rect.height) * 100;

      const newX = Math.max(3, Math.min(97, Math.round(currentX + deltaX)));
      const newY = Math.max(3, Math.min(97, Math.round(currentY + deltaY)));
      setDragCoord({ x: newX, y: newY });
    };

    const onPointerUp = (upEvt: PointerEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      if (pageRef.current) {
        const rect = pageRef.current.getBoundingClientRect();
        const deltaX = ((upEvt.clientX - startClientX) / rect.width) * 100;
        const deltaY = ((upEvt.clientY - startClientY) / rect.height) * 100;
        const finalX = Math.max(3, Math.min(97, Math.round(currentX + deltaX)));
        const finalY = Math.max(3, Math.min(97, Math.round(currentY + deltaY)));
        onUpdateBlockPosition(block.id, finalX, finalY);
      }
      setDraggingBlockId(null);
      setDragCoord(null);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const branding = state.branding;

  return (
    <div
      ref={pageRef}
      className="catalog-page-card relative overflow-hidden select-none flex flex-col justify-between text-right"
      style={
        {
          width: `${dim.width}px`,
          height: `${dim.height}px`,
          backgroundColor: bg,
          color: fg,
          borderRadius: isPrintMode ? 0 : `${c.r}px`,
          boxShadow: isPrintMode ? 'none' : '0 16px 48px rgba(0,0,0,0.22)',
          '--card-sf': cardSurface,
        } as React.CSSProperties
      }
    >
      {/* Background Image of Uploaded Catalog Page */}
      {page.bgImage && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src={page.bgImage}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full"
            style={{ objectFit: page.bgImageFit || 'cover' }}
          />
        </div>
      )}

      {/* Global Corporate Logo on ALL pages if enabled */}
      {branding?.logoEnabled && branding?.logoUrl && (
        <div
          className={`absolute z-20 pointer-events-none transition-all ${
            branding.logoPosition === 'top-left'
              ? 'top-4 left-6'
              : branding.logoPosition === 'top-center'
              ? 'top-4 left-1/2 -translate-x-1/2'
              : branding.logoPosition === 'bottom-right'
              ? 'bottom-12 right-6'
              : branding.logoPosition === 'bottom-left'
              ? 'bottom-12 left-6'
              : 'top-4 right-6'
          }`}
          style={{
            opacity: branding.logoOpacity ?? 0.95,
            width: `${branding.logoWidth ?? 120}px`,
          }}
        >
          <img
            src={branding.logoUrl}
            alt="لوگوی سازمانی"
            className="max-h-12 w-auto object-contain filter drop-shadow-sm"
          />
        </div>
      )}

      {/* Decorative Ornaments */}
      {state.dc === 'cn' && !page.bgImage && (
        <div
          className="absolute top-0 left-0 w-24 h-24 pointer-events-none z-10 opacity-90"
          style={{
            backgroundColor: c.ac,
            clipPath: 'polygon(0 0, 100% 0, 0 100%)',
          }}
        />
      )}
      {state.dc === 'bar' && !page.bgImage && (
        <div
          className="absolute top-0 left-0 right-0 h-3.5 pointer-events-none z-10"
          style={{ backgroundColor: c.ac }}
        />
      )}
      {state.dc === 'side' && !page.bgImage && (
        <div
          className="absolute top-0 right-0 bottom-0 w-4 pointer-events-none z-10"
          style={{ backgroundColor: c.ac }}
        />
      )}
      {state.dc === 'frm' && !page.bgImage && (
        <div
          className="absolute inset-3.5 pointer-events-none z-10"
          style={{
            border: `2px solid ${c.ac}`,
            borderRadius: `${Math.max(4, c.r - 2)}px`,
          }}
        />
      )}
      {state.dc === 'gradient' && !page.bgImage && (
        <div
          className="absolute -top-20 -right-20 w-56 h-56 rounded-full pointer-events-none z-10 blur-2xl opacity-40"
          style={{
            background: `radial-gradient(circle, ${c.ac} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Mode Toggle Indicator on Page (Editor only) */}
      {!isPrintMode && !isInteractiveMode && onTogglePageLayoutMode && (
        <div className="absolute top-3.5 left-3.5 z-30 flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePageLayoutMode();
            }}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 backdrop-blur-md shadow-md transition-all cursor-pointer ${
              isFreePage
                ? 'bg-orange-500 text-white border-orange-400'
                : 'bg-black/50 text-white/90 border-white/20 hover:bg-black/70'
            }`}
            title="تغییر نحوه چیدمان صفحه"
          >
            <Move className="w-3 h-3" />
            <span>{isFreePage ? 'چیدمان آزاد (شناور)' : 'چیدمان ستونی'}</span>
          </button>
        </div>
      )}

      {/* Main Page Flow Body (Standard Column layout) */}
      <div
        className={`catalog-page-body relative z-10 p-10 flex flex-col gap-4 flex-1 overflow-hidden ${
          page.cols === 2 ? 'grid grid-cols-2 gap-4 content-start' : ''
        }`}
      >
        {flowBlocks.map((block) => {
          const isWide = wideBlockTypes.includes(block.t);
          return (
            <div
              key={block.id}
              className={page.cols === 2 && isWide ? 'col-span-2' : ''}
            >
              <BlockRenderer
                block={block}
                state={state}
                isSelected={isBlockSelected(block.id)}
                onSelect={(e) =>
                  onSelectBlock &&
                  onSelectBlock(block.id, Boolean(e?.shiftKey || e?.ctrlKey || e?.metaKey))
                }
                onNavigatePage={onNavigatePage}
                isInteractiveMode={isInteractiveMode}
              />
            </div>
          );
        })}
      </div>

      {/* Free Positioning 2D Canvas Layer (Absolute Elements) */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {freeBlocks.map((block, idx) => {
          const isSelected = isBlockSelected(block.id);
          const isDragging = draggingBlockId === block.id;
          const defaultX = 50;
          const defaultY = Math.min(85, 14 + idx * 14);
          const curX = isDragging && dragCoord ? dragCoord.x : block.posX ?? defaultX;
          const curY = isDragging && dragCoord ? dragCoord.y : block.posY ?? defaultY;

          return (
            <div
              key={block.id}
              className={`absolute pointer-events-auto transition-transform ${
                isDragging ? 'cursor-grabbing scale-105 z-50' : 'cursor-grab'
              }`}
              style={{
                left: `${curX}%`,
                top: `${curY}%`,
                width: block.posW ? `${block.posW}%` : 'auto',
                zIndex: isDragging ? 50 : block.posZ ?? (20 + idx),
                transform: 'translate(-50%, -50%)',
                transformOrigin: 'center center',
              }}
            >
              {/* Drag handle & Coordinate badge (shown in editor when selected or dragged) */}
              {!isPrintMode && !isInteractiveMode && (
                <div
                  onPointerDown={(e) => handleStartDrag(e, block)}
                  className={`absolute -top-7 right-0 flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold shadow-md transition-all select-none ${
                    isSelected || isDragging
                      ? 'bg-orange-500 text-white ring-2 ring-white/30'
                      : 'bg-black/70 text-white/80 opacity-0 group-hover:opacity-100'
                  }`}
                  title="کشیدن برای جابجایی آزاد"
                >
                  <Move className="w-3 h-3" />
                  <span>
                    X:{curX}% Y:{curY}%
                  </span>
                </div>
              )}
              <div
                onPointerDown={(e) => {
                  if (isSelected && !isInteractiveMode) {
                    handleStartDrag(e, block);
                  }
                }}
              >
                <BlockRenderer
                  block={block}
                  state={state}
                  isSelected={isSelected}
                  onSelect={(e) =>
                    onSelectBlock &&
                    onSelectBlock(block.id, Boolean(e?.shiftKey || e?.ctrlKey || e?.metaKey))
                  }
                  onNavigatePage={onNavigatePage}
                  isInteractiveMode={isInteractiveMode}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Page Footer */}
      <div className="catalog-page-footer px-10 pb-3.5 pt-2.5 flex items-center justify-between text-[11px] font-bold opacity-60 border-t border-current/10 relative z-10">
        <span className="tracking-wide truncate max-w-[280px]">{state.title || 'کاتالوگ اختصاصی'}</span>
        <span className="font-mono">
          صفحه {pageIndex + 1} از {totalPages}
        </span>
      </div>
    </div>
  );
};
