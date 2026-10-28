import React from 'react';
import { CatalogBlock, CatalogState, IconBlock } from '../../types/catalog';
import { generateSvgTag } from '../../constants/icons';
import {
  Shield,
  Truck,
  Clock,
  Phone,
  Globe,
  Mail,
  MapPin,
  Instagram,
  Check,
  Star,
  ExternalLink,
} from 'lucide-react';

interface BlockRendererProps {
  block: CatalogBlock;
  state: CatalogState;
  isSelected?: boolean;
  onSelect?: (e?: React.MouseEvent) => void;
  onNavigatePage?: (pageIndex: number) => void;
  isInteractiveMode?: boolean;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  state,
  isSelected,
  onSelect,
  onNavigatePage,
  isInteractiveMode = false,
}) => {
  const c = state.c;

  const effectiveActionType =
    block.actionType ||
    (block.t === 'icon' && (block as any).link ? 'link' : undefined) ||
    (block.t === 'btn' && (block as any).u ? ((block as any).u.startsWith('#') ? 'page' : 'link') : undefined);

  const effectiveActionUrl =
    block.actionUrl ||
    (block.t === 'icon' ? (block as any).link : undefined) ||
    (block.t === 'btn' ? (block as any).u : undefined);

  const effectiveActionPage =
    typeof block.actionPage === 'number'
      ? block.actionPage
      : block.t === 'btn' && (block as any).u?.startsWith('#')
      ? parseInt((block as any).u.slice(1), 10) - 1
      : undefined;

  const hasAction = Boolean(
    effectiveActionType &&
      effectiveActionType !== 'none' &&
      (effectiveActionType === 'page' ? typeof effectiveActionPage === 'number' : true)
  );

  const triggerAction = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (effectiveActionType === 'page' && typeof effectiveActionPage === 'number' && onNavigatePage) {
      onNavigatePage(effectiveActionPage);
      return;
    }
    if (effectiveActionType === 'link' && effectiveActionUrl) {
      const target =
        effectiveActionUrl.startsWith('http://') ||
        effectiveActionUrl.startsWith('https://') ||
        effectiveActionUrl.startsWith('tel:') ||
        effectiveActionUrl.startsWith('mailto:')
          ? effectiveActionUrl
          : `https://${effectiveActionUrl}`;
      window.open(target, '_blank', 'noopener,noreferrer');
      return;
    }
    if (effectiveActionType === 'tel' && block.actionTel) {
      window.location.href = `tel:${block.actionTel}`;
      return;
    }
    if (effectiveActionType === 'email' && block.actionEmail) {
      window.location.href = `mailto:${block.actionEmail}`;
      return;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isInteractiveMode && hasAction) {
      triggerAction(e);
      return;
    }
    if (onSelect) {
      onSelect(e);
    }
  };

  const renderContent = () => {
    switch (block.t) {
      case 'h': {
        const alignClass =
          block.al === 'center'
            ? 'text-center'
            : block.al === 'left'
            ? 'text-left'
            : 'text-right';
        let styleClass = '';
        const customStyle: React.CSSProperties = {
          fontSize: `${block.sz}px`,
          color: block.customColor || 'inherit',
          lineHeight: 1.35,
        };
        if (block.hs === 'b') {
          styleClass = 'border-r-4 pr-3';
          customStyle.borderRightColor = c.ac;
        } else if (block.hs === 'c') {
          styleClass = 'border-b-2 pb-2 inline-block';
          customStyle.borderBottomColor = c.ac;
        } else if (block.hs === 'd') {
          styleClass = 'px-3 py-1 rounded-xl inline-block';
          customStyle.backgroundColor = `color-mix(in srgb, ${c.ac} 16%, transparent)`;
          customStyle.color = c.ac;
        }
        return (
          <div className={alignClass}>
            <h2 className={`font-extrabold tracking-tight ${styleClass}`} style={customStyle}>
              {block.x}
            </h2>
          </div>
        );
      }

      case 'p': {
        const alignClass =
          block.al === 'center'
            ? 'text-center'
            : block.al === 'left'
            ? 'text-left'
            : 'text-right';
        return (
          <p
            className={`${alignClass} opacity-85 leading-relaxed whitespace-pre-line`}
            style={{
              fontSize: `${block.sz}px`,
              color: block.customColor || 'inherit',
            }}
          >
            {block.x}
          </p>
        );
      }

      case 'img': {
        const alignClass = 'text-center';
        return (
          <div className={alignClass}>
            {block.src ? (
              <img
                src={block.src}
                alt={block.caption || 'تصویر کاتالوگ'}
                referrerPolicy="no-referrer"
                className="w-full transition-transform duration-300 hover:scale-[1.01]"
                style={{
                  height: `${block.ht}px`,
                  objectFit: block.fit,
                  borderRadius: `${block.customRadius ?? c.r}px`,
                }}
                onError={(e) => {
                  // Fallback container on broken image
                  (e.target as HTMLElement).style.display = 'none';
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent && !parent.querySelector('.img-fallback')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'img-fallback w-full flex flex-col items-center justify-center p-6 bg-slate-800/40 border border-slate-700/50 rounded-xl text-xs text-slate-400 gap-1';
                    fallback.innerHTML = `<span>🖼️ تصویر کاتالوگ</span><small class="opacity-70">${block.caption || ''}</small>`;
                    parent.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <div
                className="w-full flex items-center justify-center opacity-70 border-2 border-dashed border-current/20"
                style={{
                  height: `${block.ht}px`,
                  backgroundColor: 'var(--card-sf)',
                  borderRadius: `${block.customRadius ?? c.r}px`,
                }}
              >
                <span>(محل قرارگیری تصویر)</span>
              </div>
            )}
            {block.caption && (
              <span className="block mt-1.5 text-xs opacity-65 text-center font-medium">
                {block.caption}
              </span>
            )}
          </div>
        );
      }

      case 'logo': {
        const alignClass =
          block.al === 'center'
            ? 'text-center'
            : block.al === 'left'
            ? 'text-left'
            : 'text-right';
        return (
          <div className={alignClass}>
            <div
              className="inline-flex items-center justify-center px-5 py-2.5 shadow-sm border border-current/10"
              style={{
                width: `${block.w}%`,
                backgroundColor: 'var(--card-sf)',
                borderRadius: `${block.customRadius ?? c.r}px`,
              }}
            >
              {block.customSrc ? (
                <img
                  src={block.customSrc}
                  alt="لوگو"
                  className="max-h-12 object-contain"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-sm"
                    style={{ backgroundColor: c.ac }}
                  >
                    R
                  </div>
                  <span
                    className="font-black text-xl tracking-wider"
                    style={{ color: c.ac }}
                  >
                    RCG
                  </span>
                  <span className="text-xs font-semibold opacity-60 mr-1">
                    صنایع مدرن
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'btn': {
        const alignClass =
          block.al === 'center'
            ? 'text-center'
            : block.al === 'left'
            ? 'text-left'
            : 'text-right';
        const btnClasses =
          'inline-flex items-center justify-center gap-2 px-6 py-3 font-bold text-sm transition-all shadow-md hover:brightness-110 active:scale-95 cursor-pointer';
        const btnStyle: React.CSSProperties = {
          borderRadius:
            block.sh === 'p'
              ? '9999px'
              : block.sh === 's'
              ? '0px'
              : `${block.customRadius ?? c.r}px`,
        };
        if (block.sh === 'o') {
          btnStyle.border = `2px solid ${c.ac}`;
          btnStyle.color = c.ac;
          btnStyle.backgroundColor = 'transparent';
        } else if (block.sh === 'd') {
          btnStyle.backgroundColor = `color-mix(in srgb, ${c.ac} 16%, transparent)`;
          btnStyle.color = c.ac;
        } else if (block.sh === 'gradient') {
          btnStyle.background = `linear-gradient(135deg, ${c.ac} 0%, color-mix(in srgb, ${c.ac} 75%, #ff0077) 100%)`;
          btnStyle.color = '#ffffff';
          btnStyle.boxShadow = `0 6px 20px color-mix(in srgb, ${c.ac} 35%, transparent)`;
        } else {
          btnStyle.backgroundColor = c.ac;
          btnStyle.color = '#ffffff';
        }

        const handleBtnClick = (e: React.MouseEvent) => {
          if (block.u && block.u.startsWith('#') && onNavigatePage) {
            e.preventDefault();
            e.stopPropagation();
            const pNum = parseInt(block.u.slice(1), 10) - 1;
            if (!isNaN(pNum)) onNavigatePage(pNum);
          }
        };

        return (
          <div className={alignClass}>
            <a
              href={block.u || '#'}
              onClick={handleBtnClick}
              className={btnClasses}
              style={btnStyle}
            >
              <span>{block.x}</span>
              {block.u && !block.u.startsWith('#') && (
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              )}
            </a>
          </div>
        );
      }

      case 'prod': {
        const isVert = block.layout === 'vertical';
        return (
          <div
            className={`flex gap-3.5 p-3.5 transition-all hover:shadow-lg border border-current/10 ${
              isVert ? 'flex-col items-stretch' : 'flex-row items-center'
            }`}
            style={{
              backgroundColor: 'var(--card-sf)',
              borderRadius: `${block.customRadius ?? c.r}px`,
            }}
          >
            {block.src ? (
              <img
                src={block.src}
                alt={block.x}
                referrerPolicy="no-referrer"
                className={`object-cover flex-none ${
                  isVert ? 'w-full h-34' : 'w-24 h-24'
                }`}
                style={{ borderRadius: `${Math.max(4, c.r * 0.7)}px` }}
              />
            ) : (
              <div
                className={`flex items-center justify-center opacity-60 text-xs ${
                  isVert ? 'w-full h-28' : 'w-24 h-24'
                }`}
                style={{
                  backgroundColor: 'color-mix(in srgb, currentColor 6%, transparent)',
                  borderRadius: `${Math.max(4, c.r * 0.7)}px`,
                }}
              >
                محصول
              </div>
            )}
            <div className="flex flex-col gap-1 flex-1 text-right min-w-0">
              {block.badge && (
                <span
                  className="self-start text-[10px] font-black px-2.5 py-0.5 rounded-full text-white shadow-sm"
                  style={{ backgroundColor: c.ac }}
                >
                  {block.badge}
                </span>
              )}
              <h4 className="font-bold text-sm leading-snug truncate">{block.x}</h4>
              <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">
                {block.d}
              </p>
              <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-current/10">
                <span
                  className="font-extrabold text-xs"
                  style={{ color: c.ac }}
                >
                  {block.pr}
                </span>
                {block.u && (
                  <span
                    className="text-[11px] font-bold underline opacity-85 hover:opacity-100"
                    style={{ color: c.ac }}
                  >
                    جزئیات کامل
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'list': {
        const lines = String(block.x || '').split('\n').filter(Boolean);
        return (
          <ul
            className="flex flex-col gap-2.5 text-right leading-relaxed"
            style={{ fontSize: `${block.sz}px` }}
          >
            {lines.map((line, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span
                  className="flex-none mt-1 flex items-center justify-center font-bold"
                  style={{ color: c.ac }}
                >
                  {block.st === 'k' ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : block.st === 'n' ? (
                    <span className="text-xs font-bold w-4 h-4 rounded-full border border-current flex items-center justify-center">
                      {idx + 1}
                    </span>
                  ) : block.st === 'star' ? (
                    <Star className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <span className="text-xl leading-none">•</span>
                  )}
                </span>
                <span className="flex-1 opacity-90">{line}</span>
              </li>
            ))}
          </ul>
        );
      }

      case 'box': {
        const alignClass =
          block.al === 'center'
            ? 'text-center'
            : block.al === 'left'
            ? 'text-left'
            : 'text-right';
        const boxStyle: React.CSSProperties = {
          borderRadius: `${block.customRadius ?? c.r}px`,
          fontSize: `${block.sz}px`,
        };
        let styleClasses = 'p-4 leading-relaxed text-right shadow-sm';
        if (block.st === 'accent-right') {
          boxStyle.backgroundColor = 'var(--card-sf)';
          boxStyle.borderRight = `5px solid ${c.ac}`;
        } else if (block.st === 'glass') {
          boxStyle.backgroundColor = `color-mix(in srgb, ${c.ac} 10%, transparent)`;
          boxStyle.border = `1px solid color-mix(in srgb, ${c.ac} 25%, transparent)`;
          styleClasses += ' backdrop-blur-sm';
        } else if (block.st === 'quote') {
          boxStyle.backgroundColor = 'var(--card-sf)';
          styleClasses += ' italic pr-9 relative';
        } else {
          boxStyle.backgroundColor = 'var(--card-sf)';
          boxStyle.border = '1px solid color-mix(in srgb, currentColor 10%, transparent)';
        }
        return (
          <div className={alignClass}>
            <div className={styleClasses} style={boxStyle}>
              {block.st === 'quote' && (
                <span
                  className="absolute right-2.5 top-1 text-3xl font-serif font-black leading-none opacity-80"
                  style={{ color: c.ac }}
                >
                  “
                </span>
              )}
              {block.title && (
                <h5
                  className="font-bold text-sm mb-1.5"
                  style={{ color: c.ac }}
                >
                  {block.title}
                </h5>
              )}
              <p className="opacity-90">{block.x}</p>
            </div>
          </div>
        );
      }

      case 'toc': {
        return (
          <div className="flex flex-col gap-1 w-full">
            {block.title && (
              <h4
                className="font-extrabold text-sm mb-1 pb-1 border-b border-current/10"
                style={{ color: c.ac }}
              >
                {block.title}
              </h4>
            )}
            <div className="flex flex-col divide-y divide-current/10">
              {state.pg.map((p, idx) => {
                if (!p.toc && idx !== 0) return null;
                return (
                  <button
                    key={p.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onNavigatePage) onNavigatePage(idx);
                    }}
                    className="flex items-center justify-between py-2.5 px-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-right cursor-pointer"
                  >
                    <span className="font-semibold text-xs opacity-90">
                      {p.t}
                    </span>
                    <span
                      className="font-black text-xs px-2.5 py-0.5 rounded-lg"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${c.ac} 15%, transparent)`,
                        color: c.ac,
                      }}
                    >
                      صفحه {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      }

      case 'hr': {
        return (
          <div className="my-1.5">
            <hr
              style={{
                border: 'none',
                borderTop:
                  block.st === 'dashed'
                    ? `2px dashed ${c.ac}`
                    : `3px solid ${c.ac}`,
                width: '70px',
                borderRadius: '2px',
              }}
            />
          </div>
        );
      }

      case 'sp': {
        return <div style={{ height: `${block.ht}px` }} />;
      }

      case 'features': {
        return (
          <div className="grid grid-cols-3 gap-3 my-1.5">
            {block.items.map((it, idx) => (
              <div
                key={idx}
                className="p-3 text-center flex flex-col items-center gap-1.5 border border-current/10 shadow-sm"
                style={{
                  backgroundColor: 'var(--card-sf)',
                  borderRadius: `${block.customRadius ?? c.r}px`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-inner"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${c.ac} 16%, transparent)`,
                    color: c.ac,
                  }}
                >
                  {it.icon === 'shield' ? (
                    <Shield className="w-4 h-4" />
                  ) : it.icon === 'truck' ? (
                    <Truck className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>
                <b className="text-xs font-bold leading-tight">{it.title}</b>
                <span className="text-[10px] opacity-70 leading-snug">
                  {it.desc}
                </span>
              </div>
            ))}
          </div>
        );
      }

      case 'contact': {
        return (
          <div
            className="p-4 grid grid-cols-2 gap-3 text-xs border border-current/10 shadow-sm"
            style={{
              backgroundColor: 'var(--card-sf)',
              borderRadius: `${block.customRadius ?? c.r}px`,
            }}
          >
            {block.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-none" style={{ color: c.ac }} />
                <span className="font-semibold">{block.phone}</span>
              </div>
            )}
            {block.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 flex-none" style={{ color: c.ac }} />
                <span className="truncate font-mono">{block.website}</span>
              </div>
            )}
            {block.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-none" style={{ color: c.ac }} />
                <span className="truncate font-mono">{block.email}</span>
              </div>
            )}
            {block.instagram && (
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 flex-none" style={{ color: c.ac }} />
                <span className="font-semibold font-mono">{block.instagram}</span>
              </div>
            )}
            {block.address && (
              <div className="col-span-2 flex items-start gap-2 pt-2 mt-1 border-t border-current/10">
                <MapPin className="w-4 h-4 flex-none mt-0.5" style={{ color: c.ac }} />
                <span className="opacity-80 leading-relaxed">{block.address}</span>
              </div>
            )}
          </div>
        );
      }

      case 'icon': {
        const iconColor =
          block.customColor ||
          (block.colorType === 'accent'
            ? c.ac
            : block.colorType === 'text'
            ? c.fg
            : block.customColor || c.ac);

        const alignClass =
          block.al === 'center'
            ? 'text-center'
            : block.al === 'left'
            ? 'text-left'
            : 'text-right';

        const customBg = block.customBg;

        // Dynamic animation classes
        const animClass =
          block.animation === 'float'
            ? 'animate-float-slow'
            : block.animation === 'pulse'
            ? 'animate-pulse-glow'
            : block.animation === 'wiggle'
            ? 'animate-wiggle-soft'
            : block.animation === 'bounce'
            ? 'hover:animate-bounce'
            : '';

        return (
          <div className={alignClass}>
            <div
              onClick={hasAction ? triggerAction : undefined}
              className={`inline-flex items-center transition-all duration-200 group/icon ${
                hasAction ? 'cursor-pointer hover:scale-105 active:scale-95' : 'hover:scale-102'
              } ${
                block.captionPos === 'side'
                  ? 'flex-row gap-3'
                  : 'flex-col gap-2'
              } ${
                block.bgShape === 'circle'
                  ? 'rounded-full'
                  : block.bgShape === 'rounded'
                  ? 'rounded-2xl'
                  : block.bgShape === 'border'
                  ? 'rounded-2xl border-2'
                  : block.bgShape === 'soft'
                  ? 'rounded-2xl backdrop-blur-sm'
                  : block.bgShape === 'gradient'
                  ? 'rounded-2xl shadow-lg'
                  : ''
              } ${animClass}`}
              style={{
                padding:
                  block.bgShape !== 'none' || customBg
                    ? `${Math.max(10, block.sz * 0.3)}px`
                    : '0',
                backgroundColor:
                  customBg ||
                  (block.bgShape === 'circle' || block.bgShape === 'rounded'
                    ? `color-mix(in srgb, ${iconColor} 18%, transparent)`
                    : block.bgShape === 'soft'
                    ? 'var(--card-sf)'
                    : block.bgShape === 'gradient'
                    ? `linear-gradient(135deg, color-mix(in srgb, ${iconColor} 25%, transparent), color-mix(in srgb, ${iconColor} 8%, transparent))`
                    : 'transparent'),
                borderColor:
                  block.customBorderColor ||
                  (block.bgShape === 'border' ? iconColor : 'transparent'),
                borderRadius:
                  typeof block.customRadius === 'number'
                    ? `${block.customRadius}px`
                    : undefined,
              }}
            >
              <div
                className="transition-transform duration-300 group-hover/icon:scale-110"
                dangerouslySetInnerHTML={{
                  __html: generateSvgTag(
                    block.iconName,
                    block.sz,
                    iconColor,
                    block.customSvgPath
                  ),
                }}
              />
              {block.caption && (
                <span
                  className="font-bold text-xs leading-snug"
                  style={{ color: block.customColor || 'inherit' }}
                >
                  {block.caption}
                </span>
              )}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative group rounded-xl transition-all duration-200 ${
        isInteractiveMode && hasAction ? 'cursor-pointer hover:brightness-105' : 'cursor-pointer'
      } ${
        isSelected
          ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-transparent shadow-lg shadow-orange-500/15'
          : 'hover:ring-1 hover:ring-orange-400/50'
      }`}
      style={{
        backgroundColor: block.customBg,
        borderRadius: typeof block.customRadius === 'number' ? `${block.customRadius}px` : undefined,
        borderColor: block.customBorderColor,
        borderWidth: block.customBorderColor ? '1px' : undefined,
        borderStyle: block.customBorderColor ? 'solid' : undefined,
        transform: block.scale && block.scale !== 1 ? `scale(${block.scale})` : undefined,
        transformOrigin: 'center center',
      }}
    >
      {renderContent()}

      {/* Visual Selection & Resize Corner Handles */}
      {isSelected && !isInteractiveMode && (
        <>
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-orange-500 border-2 border-white shadow-sm pointer-events-none z-30" />
          <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-orange-500 border-2 border-white shadow-sm pointer-events-none z-30" />
          <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-orange-500 border-2 border-white shadow-sm pointer-events-none z-30" />
          <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-orange-500 border-2 border-white shadow-sm pointer-events-none z-30" />
          {block.scale && block.scale !== 1 && (
            <span className="absolute -bottom-5 right-2 px-1.5 py-0.2 rounded bg-orange-600 text-white font-mono text-[9px] font-bold shadow pointer-events-none z-30">
              {Math.round(block.scale * 100)}%
            </span>
          )}
        </>
      )}

      {/* Action Indicator & Quick Tester Badge (Shown when selected or hovered in editor) */}
      {hasAction && !isInteractiveMode && (
        <div
          onClick={triggerAction}
          className="absolute -top-3.5 left-2 hidden group-hover:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold shadow-lg cursor-pointer z-30 hover:bg-orange-600 transition-transform active:scale-95"
          title="تست کلیک و هدایت این دکمه"
        >
          <ExternalLink className="w-2.5 h-2.5" />
          <span>
            {effectiveActionType === 'page'
              ? `صفحه ${(effectiveActionPage ?? 0) + 1}`
              : effectiveActionType === 'tel'
              ? 'تماس'
              : effectiveActionType === 'email'
              ? 'ایمیل'
              : 'لینک'}
          </span>
        </div>
      )}
    </div>
  );
};
