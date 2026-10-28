import { CatalogState } from '../types/catalog';
import { CATALOG_SIZES, FONT_CONFIG } from '../constants/presets';
import { SVG_ICONS } from '../constants/icons';

function escapeHtml(str: string): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function generateStandaloneCatalogHtml(state: CatalogState): string {
  const dim = CATALOG_SIZES[state.sz] || CATALOG_SIZES.a4;
  const c = state.c;
  const fontConf = FONT_CONFIG[state.f] || FONT_CONFIG.v;
  const serializedState = JSON.stringify(state).replace(/</g, '\\u003c');
  const svgMap = Object.fromEntries(SVG_ICONS.map((i) => [i.id, i.svg]));
  const serializedSvgMap = JSON.stringify(svgMap).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${escapeHtml(state.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Lalezar&family=Noto+Naskh+Arabic:wght@400;600;700&family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    ${state.f === 'custom' && state.customFontUrl ? `
    @font-face {
      font-family: 'CustomUploadedFont';
      src: url('${state.customFontUrl}');
      font-display: swap;
    }
    ` : ''}
    :root {
      --bg: ${c.bg};
      --fg: ${c.fg};
      --ac: ${c.ac};
      --sf: ${c.sf};
      --r: ${c.r}px;
      --ff: ${fontConf.bodyFont};
      --fh: ${fontConf.headingFont};
      --fw: ${state.fw === 'bold' ? 700 : state.fw === 'black' ? 900 : state.fw === 'medium' ? 500 : 400};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      min-height: 100vh;
      background: color-mix(in srgb, var(--bg) 88%, #141721);
      font-family: var(--ff);
      font-weight: var(--fw);
      direction: rtl;
      color: var(--fg);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 12px;
      user-select: none;
      -webkit-user-select: none;
    }
    #stage-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
    }
    .catalog-viewport {
      position: relative;
      overflow: hidden;
      border-radius: max(6px, var(--r));
      box-shadow: 0 16px 50px rgba(0,0,0,0.25);
      perspective: 1200px;
    }
    .page-scale-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      transform-origin: 0 0;
    }
    .page-card {
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      box-sizing: border-box;
      direction: rtl;
    }
    .page-body {
      padding: 44px 38px 48px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
    }
    .page-body.cols-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-content: start;
      gap: 16px;
    }
    .page-body.cols-2 > .full-width {
      grid-column: 1 / -1;
    }
    .page-footer {
      position: absolute;
      bottom: 12px;
      left: 36px;
      right: 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      font-weight: 700;
      opacity: 0.6;
      letter-spacing: 0.05em;
    }
    /* Headings */
    h2.head-a { font-weight: 800; line-height: 1.35; font-family: var(--fh); }
    h2.head-b { font-weight: 800; line-height: 1.35; font-family: var(--fh); border-right: 5px solid var(--ac); padding-right: 12px; }
    h2.head-c { font-weight: 800; line-height: 1.35; font-family: var(--fh); border-bottom: 3px solid var(--ac); padding-bottom: 8px; }
    h2.head-d { display: inline-block; font-weight: 800; line-height: 1.35; font-family: var(--fh); background: color-mix(in srgb, var(--ac) 15%, transparent); color: var(--ac); padding: 4px 12px; border-radius: var(--r); }
    /* Product Card */
    .prod-card {
      background: var(--sf);
      border-radius: var(--r);
      padding: 12px;
      display: flex;
      gap: 14px;
      align-items: center;
      border: 1px solid color-mix(in srgb, currentColor 8%, transparent);
    }
    .prod-card.vert {
      flex-direction: column;
      align-items: stretch;
    }
    .prod-card img {
      width: 96px;
      height: 96px;
      object-fit: cover;
      border-radius: calc(var(--r) * 0.7);
      flex: none;
    }
    .prod-card.vert img {
      width: 100%;
      height: 130px;
    }
    .prod-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      text-align: right;
    }
    .prod-badge {
      display: inline-block;
      align-self: flex-start;
      font-size: 10px;
      font-weight: 800;
      background: var(--ac);
      color: #fff;
      padding: 2px 8px;
      border-radius: 9999px;
    }
    .prod-price {
      color: var(--ac);
      font-weight: 800;
      font-size: 13px;
    }
    /* Buttons */
    .cat-btn {
      display: inline-block;
      padding: 10px 22px;
      border-radius: var(--r);
      text-decoration: none;
      font-weight: 700;
      font-size: 13px;
      background: var(--ac);
      color: #fff;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .cat-btn.sh-o { background: transparent; border: 2px solid var(--ac); color: var(--ac); }
    .cat-btn.sh-p { border-radius: 9999px; }
    .cat-btn.sh-d { background: color-mix(in srgb, var(--ac) 18%, transparent); color: var(--ac); }
    .cat-btn.sh-s { border-radius: 0; }
    .cat-btn.sh-gradient { background: linear-gradient(135deg, var(--ac) 0%, color-mix(in srgb, var(--ac) 70%, #ff0077) 100%); box-shadow: 0 4px 14px color-mix(in srgb, var(--ac) 35%, transparent); }
    .cat-btn:hover { filter: brightness(1.12); transform: translateY(-1px); }
    /* Lists */
    .cat-list { list-style: none; display: flex; flex-direction: column; gap: 8px; line-height: 1.8; text-align: right; }
    .cat-list li { position: relative; padding-right: 24px; }
    .cat-list li::before { position: absolute; right: 0; color: var(--ac); font-weight: 800; content: "•"; font-size: 18px; }
    .cat-list.st-k li::before { content: "✓"; font-size: 14px; }
    .cat-list.st-n { counter-reset: c; }
    .cat-list.st-n li { counter-increment: c; }
    .cat-list.st-n li::before { content: counter(c) "."; font-size: 12px; }
    .cat-list.st-star li::before { content: "★"; font-size: 13px; }
    /* Tip Boxes */
    .cat-box {
      background: var(--sf);
      border-radius: var(--r);
      padding: 14px 18px;
      line-height: 1.85;
      font-weight: 600;
      text-align: right;
      border-right: 5px solid var(--ac);
    }
    .cat-box.st-glass {
      background: color-mix(in srgb, var(--ac) 10%, transparent);
      backdrop-filter: blur(8px);
      border: 1px solid color-mix(in srgb, var(--ac) 30%, transparent);
    }
    .cat-box.st-quote {
      font-style: italic;
      border: none;
      position: relative;
      padding-right: 28px;
    }
    .cat-box.st-quote::before {
      content: "“";
      position: absolute;
      right: 4px;
      top: -2px;
      font-size: 24px;
      color: var(--ac);
    }
    /* TOC items */
    .cat-toc-list { list-style: none; display: flex; flex-direction: column; gap: 2px; }
    .cat-toc-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 4px;
      border-bottom: 1px solid color-mix(in srgb, currentColor 14%, transparent);
      text-decoration: none;
      color: inherit;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .cat-toc-item:hover { color: var(--ac); }
    .cat-toc-num { color: var(--ac); font-weight: 800; font-size: 15px; }
    /* Features Grid */
    .feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 6px 0; }
    .feat-card {
      background: var(--sf);
      border-radius: var(--r);
      padding: 10px;
      text-align: center;
      border: 1px solid color-mix(in srgb, currentColor 8%, transparent);
    }
    .feat-title { font-weight: 800; font-size: 13px; margin: 4px 0 2px; }
    .feat-desc { font-size: 11px; opacity: 0.75; line-height: 1.4; }
    /* Contact Card */
    .contact-card {
      background: var(--sf);
      border-radius: var(--r);
      padding: 14px 18px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      font-size: 12px;
      text-align: right;
    }
    .contact-item { display: flex; align-items: center; gap: 8px; }
    .contact-item b { color: var(--ac); }
    /* Decorations */
    .cat-decor { position: absolute; pointer-events: none; z-index: 1; }
    .d-cn { top: 0; left: 0; width: 80px; height: 80px; background: var(--ac); clip-path: polygon(0 0, 100% 0, 0 100%); }
    .d-bar { top: 0; left: 0; right: 0; height: 12px; background: var(--ac); }
    .d-side { top: 0; right: 0; bottom: 0; width: 14px; background: var(--ac); }
    .d-frm { inset: 14px; border: 2px solid var(--ac); border-radius: var(--r); }
    .d-gradient { top: -80px; right: -80px; width: 220px; height: 220px; background: radial-gradient(circle, color-mix(in srgb, var(--ac) 40%, transparent) 0%, transparent 70%); border-radius: 50%; }
    .d-no { display: none; }
    /* Navigation Bar */
    .catalog-nav {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--bg);
      color: var(--fg);
      padding: 6px 14px;
      border-radius: 9999px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.18);
      border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
      z-index: 20;
    }
    .catalog-nav.shape-square { border-radius: 12px; }
    .catalog-nav button {
      background: color-mix(in srgb, var(--fg) 10%, transparent);
      color: var(--fg);
      border: 0;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      transition: all 0.2s ease;
    }
    .catalog-nav.shape-square button { border-radius: 8px; }
    .catalog-nav button:hover { background: var(--ac); color: #fff; }
    .catalog-nav button:disabled { opacity: 0.3; pointer-events: none; }
    .nav-counter { font-size: 13px; font-weight: 700; min-width: 60px; text-align: center; }
    .nav-line-bar { width: 120px; height: 6px; border-radius: 3px; background: color-mix(in srgb, var(--fg) 18%, transparent); overflow: hidden; }
    .nav-line-bar i { display: block; height: 100%; background: var(--ac); transition: width 0.4s ease; }
    .nav-dot { width: 9px; height: 9px; padding: 0; border-radius: 50%; background: color-mix(in srgb, var(--fg) 20%, transparent); transition: all 0.25s ease; border: none; cursor: pointer; }
    .nav-dot.active { width: 24px; border-radius: 6px; background: var(--ac); }
    .nav-tab-btn { font-size: 12px; font-weight: 700; width: 28px !important; height: 28px !important; border-radius: 6px !important; }
    .nav-tab-btn.active { background: var(--ac) !important; color: #fff !important; }
    /* Transitions */
    .trans-fade { animation: aniFade 0.45s ease-out; }
    .trans-slide-next { animation: aniSlideNext 0.45s cubic-bezier(0.2, 0.7, 0.2, 1); }
    .trans-slide-prev { animation: aniSlidePrev 0.45s cubic-bezier(0.2, 0.7, 0.2, 1); }
    .trans-zoom { animation: aniZoom 0.45s cubic-bezier(0.2, 0.7, 0.2, 1); }
    .trans-rise { animation: aniRise 0.45s cubic-bezier(0.2, 0.7, 0.2, 1); }
    .trans-flip { animation: aniFlip 0.6s cubic-bezier(0.2, 0.7, 0.2, 1); }
    .trans-soft-scale { animation: aniSoftScale 0.45s ease; }
    @keyframes aniFade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes aniSlideNext { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes aniSlidePrev { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes aniZoom { from { opacity: 0; transform: scale(0.93); } to { opacity: 1; transform: scale(1); } }
    @keyframes aniRise { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes aniFlip { from { opacity: 0; transform: perspective(1000px) rotateY(18deg); } to { opacity: 1; transform: perspective(1000px) rotateY(0deg); } }
    @keyframes aniSoftScale { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
    /* Drawer / Modal TOC */
    .toc-modal {
      position: absolute;
      inset: 0;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.35s ease;
      z-index: 50;
    }
    .toc-modal.open { opacity: 1; pointer-events: auto; }
    .toc-backdrop { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.55); backdrop-filter: blur(4px); }
    .toc-panel {
      position: absolute;
      background: var(--bg);
      color: var(--fg);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow-y: auto;
      transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    .toc-modal.style-side .toc-panel { top: 0; bottom: 0; right: 0; width: min(290px, 80%); transform: translateX(100%); }
    .toc-modal.style-bottom .toc-panel { left: 0; right: 0; bottom: 0; max-height: 75%; transform: translateY(100%); border-radius: 20px 20px 0 0; }
    .toc-modal.style-center .toc-panel { left: 50%; top: 50%; width: min(340px, 85%); max-height: 80%; border-radius: 18px; transform: translate(-50%, -46%) scale(0.95); opacity: 0; transition: transform 0.35s ease, opacity 0.35s ease; }
    .toc-modal.style-center.open .toc-panel { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    .toc-modal.style-fullscreen .toc-panel { inset: 0; justify-content: center; align-items: center; transform: scale(1.04); opacity: 0; transition: transform 0.35s ease, opacity 0.35s ease; }
    .toc-modal.style-fullscreen.open .toc-panel { transform: scale(1); opacity: 1; }
    .toc-modal.open .toc-panel { transform: none; }
    .toc-title-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid color-mix(in srgb, currentColor 12%, transparent); padding-bottom: 10px; }
    .toc-title-header h4 { font-weight: 800; color: var(--ac); font-size: 16px; }
    .toc-close-btn { background: none; border: 0; color: inherit; font-size: 20px; cursor: pointer; padding: 4px; }
    .toc-nav-item {
      background: none;
      border: 0;
      color: inherit;
      text-align: right;
      padding: 12px 10px;
      border-radius: var(--r);
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      font: inherit;
      font-weight: 600;
      transition: background 0.2s ease;
    }
    .toc-nav-item:hover, .toc-nav-item.active { background: color-mix(in srgb, var(--ac) 15%, transparent); color: var(--ac); }
    .toc-page-num { font-weight: 800; font-size: 13px; color: var(--ac); }
    /* Print */
    @media print {
      body { background: white !important; padding: 0 !important; }
      .catalog-nav, .toc-modal { display: none !important; }
      .catalog-viewport { box-shadow: none !important; width: 100% !important; height: auto !important; }
      .page-scale-wrapper { position: relative !important; transform: none !important; width: 100% !important; height: 100% !important; }
      .page-card { break-after: page; page-break-after: always; width: ${dim.width}px !important; height: ${dim.height}px !important; margin: 0 auto; }
      @page { size: ${dim.width}px ${dim.height}px; margin: 0; }
    }
  </style>
</head>
<body>
  <div id="stage-container"></div>
  <script>
    const STATE = ${serializedState};
    const SVG_MAP = ${serializedSvgMap};
    const W = ${dim.width};
    const H = ${dim.height};
    let cur = 0;
    let menuOpen = false;
    let lastDir = 1;

    function esc(s) {
      return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function renderBlock(b) {
      const a = 'text-align:' + (b.al || 'right');
      let act = '';
      if (b.actionType === 'page' && typeof b.actionPage === 'number') {
        act = ' data-go="' + b.actionPage + '" style="cursor:pointer;"';
      } else if (b.actionType === 'link' && b.actionUrl) {
        var u = b.actionUrl.startsWith('http') ? b.actionUrl : ('https://' + b.actionUrl);
        act = ' onclick="window.open(\\'' + esc(u) + '\\',\\'_blank\\')" style="cursor:pointer;"';
      } else if (b.actionType === 'tel' && b.actionTel) {
        act = ' onclick="window.location.href=\\'tel:' + esc(b.actionTel) + '\\'" style="cursor:pointer;"';
      } else if (b.actionType === 'email' && b.actionEmail) {
        act = ' onclick="window.location.href=\\'mailto:' + esc(b.actionEmail) + '\\'" style="cursor:pointer;"';
      } else if (b.t === 'icon' && b.link) {
        var u = b.link.startsWith('http') ? b.link : ('https://' + b.link);
        act = ' onclick="window.open(\\'' + esc(u) + '\\',\\'_blank\\')" style="cursor:pointer;"';
      }

      var wrapStyles = [];
      if (b.customBg) wrapStyles.push('background:' + b.customBg);
      if (typeof b.customRadius === 'number') wrapStyles.push('border-radius:' + b.customRadius + 'px');
      if (b.customBorderColor) wrapStyles.push('border:1px solid ' + b.customBorderColor);
      if (b.scale && b.scale !== 1) wrapStyles.push('transform:scale(' + b.scale + ')');
      var wrapStyleStr = wrapStyles.length ? ' style="' + wrapStyles.join(';') + ';"' : '';

      var innerHtml = '';
      switch (b.t) {
        case 'h':
          var hClr = b.customColor ? 'color:' + b.customColor + ';' : '';
          innerHtml = '<h2 class="head-' + (b.hs || 'a') + '" style="' + a + ';' + hClr + 'font-size:' + b.sz + 'px;">' + esc(b.x) + '</h2>';
          break;
        case 'p':
          var pClr = b.customColor ? 'color:' + b.customColor + ';' : '';
          innerHtml = '<p style="' + a + ';' + pClr + 'font-size:' + b.sz + 'px;line-height:1.85;opacity:0.85;">' + esc(b.x) + '</p>';
          break;
        case 'img':
          innerHtml = '<div style="' + a + ';width:100%;">' +
            (b.src ? '<img src="' + esc(b.src) + '" alt="" style="width:100%;height:' + b.ht + 'px;object-fit:' + (b.fit || 'cover') + ';border-radius:var(--r);display:block;">' : '<div style="height:' + b.ht + 'px;background:var(--sf);border-radius:var(--r);display:grid;place-items:center;">تصویر</div>') +
            (b.caption ? '<small style="display:block;margin-top:4px;opacity:0.65;font-size:11px;">' + esc(b.caption) + '</small>' : '') +
            '</div>';
          break;
        case 'logo':
          innerHtml = '<div style="' + a + ';width:100%;"><div style="display:inline-block;background:var(--sf);border:1px solid color-mix(in srgb, currentColor 10%, transparent);padding:8px 16px;border-radius:var(--r);font-weight:900;font-size:20px;letter-spacing:0.1em;color:var(--ac);">RCG</div></div>';
          break;
        case 'btn':
          var btnHref = b.u || '#';
          if (btnHref.startsWith('#')) {
            var pNum = parseInt(btnHref.slice(1), 10) - 1;
            innerHtml = '<div style="' + a + ';"><button class="cat-btn sh-' + (b.sh || 'f') + '" data-go="' + pNum + '">' + esc(b.x) + '</button></div>';
          } else {
            innerHtml = '<div style="' + a + ';"><a class="cat-btn sh-' + (b.sh || 'f') + '" href="' + esc(btnHref) + '" target="_blank">' + esc(b.x) + '</a></div>';
          }
          break;
        case 'prod':
          innerHtml = '<div class="prod-card' + (b.layout === 'vertical' ? ' vert' : '') + '">' +
            (b.src ? '<img src="' + esc(b.src) + '" alt="">' : '<div style="width:96px;height:96px;background:var(--sf);border-radius:var(--r);display:grid;place-items:center;">محصول</div>') +
            '<div class="prod-info">' +
              (b.badge ? '<span class="prod-badge">' + esc(b.badge) + '</span>' : '') +
              '<b style="font-size:14px;font-weight:800;">' + esc(b.x) + '</b>' +
              '<small style="font-size:11px;opacity:0.75;line-height:1.5;">' + esc(b.d) + '</small>' +
              '<span class="prod-price">' + esc(b.pr) + '</span>' +
              (b.u ? '<a class="cat-btn sh-o" style="padding:4px 12px;font-size:11px;align-self:flex-start;margin-top:4px;" href="' + esc(b.u) + '" target="_blank">مشاهده</a>' : '') +
            '</div>' +
          '</div>';
          break;
        case 'list':
          innerHtml = '<ul class="cat-list st-' + (b.st || 'k') + '" style="font-size:' + b.sz + 'px;">' +
            String(b.x || '').split('\\n').filter(Boolean).map(function(l) { return '<li>' + esc(l) + '</li>'; }).join('') +
            '</ul>';
          break;
        case 'box':
          innerHtml = '<div class="cat-box st-' + (b.st || 'accent-right') + '" style="' + a + ';font-size:' + b.sz + 'px;">' +
            (b.title ? '<strong style="display:block;margin-bottom:4px;color:var(--ac);font-size:1.05em;">' + esc(b.title) + '</strong>' : '') +
            esc(b.x) +
          '</div>';
          break;
        case 'toc':
          innerHtml = '<div class="cat-toc-list">' +
            STATE.pg.map(function(p, i) {
              return '<button class="cat-toc-item" data-go="' + i + '" style="background:none;border:0;width:100%;font:inherit;text-align:right;">' +
                '<span>' + esc(p.t) + '</span>' +
                '<span class="cat-toc-num">' + (i + 1) + '</span>' +
              '</button>';
            }).join('') +
          '</div>';
          break;
        case 'hr':
          innerHtml = '<hr style="border:0;border-top:2px solid var(--ac);width:60px;margin:4px 0;">';
          break;
        case 'sp':
          innerHtml = '<div style="height:' + b.ht + 'px;"></div>';
          break;
        case 'features':
          innerHtml = '<div class="feat-grid">' +
            (b.items || []).map(function(it) {
              return '<div class="feat-card"><div class="feat-title">' + esc(it.title) + '</div><div class="feat-desc">' + esc(it.desc) + '</div></div>';
            }).join('') +
          '</div>';
          break;
        case 'contact':
          innerHtml = '<div class="contact-card">' +
            (b.phone ? '<div class="contact-item"><b>تلفن:</b> ' + esc(b.phone) + '</div>' : '') +
            (b.website ? '<div class="contact-item"><b>وبسایت:</b> ' + esc(b.website) + '</div>' : '') +
            (b.email ? '<div class="contact-item"><b>ایمیل:</b> ' + esc(b.email) + '</div>' : '') +
            (b.instagram ? '<div class="contact-item"><b>اینستاگرام:</b> ' + esc(b.instagram) + '</div>' : '') +
            (b.address ? '<div class="contact-item" style="grid-column:1/-1;"><b>آدرس:</b> ' + esc(b.address) + '</div>' : '') +
          '</div>';
          break;
        case 'icon':
          var clr = b.customColor || (b.colorType === 'text' ? STATE.c.fg : (b.colorType === 'custom' && b.customColor ? b.customColor : STATE.c.ac));
          var svgPath = b.customSvgPath || SVG_MAP[b.iconName] || '<circle cx="12" cy="12" r="10"/>';
          var svgEl = '<svg xmlns="http://www.w3.org/2000/svg" width="' + b.sz + '" height="' + b.sz + '" viewBox="0 0 24 24" fill="none" stroke="' + clr + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + svgPath + '</svg>';
          var bgSt = '';
          if (b.bgShape === 'circle') bgSt = 'border-radius:9999px;background:color-mix(in srgb, ' + clr + ' 16%, transparent);padding:' + Math.max(8, b.sz * 0.28) + 'px;';
          else if (b.bgShape === 'rounded') bgSt = 'border-radius:18px;background:color-mix(in srgb, ' + clr + ' 16%, transparent);padding:' + Math.max(8, b.sz * 0.28) + 'px;';
          else if (b.bgShape === 'border') bgSt = 'border-radius:18px;border:2px solid ' + clr + ';padding:' + Math.max(8, b.sz * 0.28) + 'px;';
          else if (b.bgShape === 'soft') bgSt = 'border-radius:18px;background:var(--sf);padding:' + Math.max(8, b.sz * 0.28) + 'px;';
          var fld = b.captionPos === 'side' ? 'flex-direction:row;gap:10px;' : 'flex-direction:column;gap:6px;';
          innerHtml = '<div style="text-align:' + (b.al || 'center') + ';">' +
            '<div style="display:inline-flex;align-items:center;' + fld + bgSt + '">' +
              svgEl +
              (b.caption ? '<span style="font-weight:700;font-size:12px;' + (b.customColor ? 'color:' + b.customColor + ';' : '') + '">' + esc(b.caption) + '</span>' : '') +
            '</div>' +
          '</div>';
          break;
        default:
          innerHtml = '';
      }
      return '<div' + act + wrapStyleStr + '>' + innerHtml + '</div>';
    }

    function renderPageHtml(p, idx) {
      const c = STATE.c;
      const bgTone = p.bg || 0;
      let bg = c.bg;
      let fg = c.fg;
      let sf = c.sf;
      if (bgTone === 1) { bg = c.sf; sf = c.bg; }
      else if (bgTone === 2) { bg = c.fg; fg = c.bg; sf = 'color-mix(in srgb, ' + c.bg + ' 15%, transparent)'; }
      else if (bgTone === 3) { bg = 'color-mix(in srgb, ' + c.ac + ' 12%, ' + c.bg + ')'; }

      const wideTypes = ['h', 'hr', 'toc', 'logo', 'sp', 'btn', 'box', 'list', 'features', 'contact', 'icon'];
      const isFreePage = p.layoutMode === 'free';
      const flowBlocks = isFreePage ? [] : p.bl.filter(function(b) { return !b.isFree; });
      const freeBlocks = isFreePage ? p.bl : p.bl.filter(function(b) { return b.isFree; });

      const branding = STATE.branding;
      let logoHtml = '';
      if (branding && branding.logoEnabled && branding.logoUrl) {
        let posStyles = 'top:16px;right:24px;';
        if (branding.logoPosition === 'top-left') posStyles = 'top:16px;left:24px;';
        else if (branding.logoPosition === 'top-center') posStyles = 'top:16px;left:50%;transform:translateX(-50%);';
        else if (branding.logoPosition === 'bottom-right') posStyles = 'bottom:48px;right:24px;';
        else if (branding.logoPosition === 'bottom-left') posStyles = 'bottom:48px;left:24px;';
        logoHtml = '<div style="position:absolute;z-index:25;pointer-events:none;opacity:' + (branding.logoOpacity != null ? branding.logoOpacity : 1) + ';width:' + (branding.logoWidth || 120) + 'px;' + posStyles + '"><img src="' + esc(branding.logoUrl) + '" style="max-height:48px;width:auto;object-fit:contain;" alt=""></div>';
      }

      return '<div class="page-card" style="width:' + W + 'px;height:' + H + 'px;background:' + bg + ';color:' + fg + ';--sf:' + sf + ';position:relative;overflow:hidden;">' +
        logoHtml +
        (p.bgImage ? '<div style="position:absolute;inset:0;z-index:0;overflow:hidden;"><img src="' + esc(p.bgImage) + '" style="width:100%;height:100%;object-fit:' + (p.bgImageFit || 'cover') + ';" alt=""></div>' : '') +
        (!p.bgImage ? '<div class="cat-decor d-' + (STATE.dc || 'cn') + '"></div>' : '') +
        '<div class="page-body' + (p.cols === 2 ? ' cols-2' : '') + '" style="position:relative;z-index:10;">' +
          flowBlocks.map(function(b) {
            return '<div class="' + (wideTypes.indexOf(b.t) !== -1 ? 'full-width' : '') + '">' + renderBlock(b) + '</div>';
          }).join('') +
        '</div>' +
        (freeBlocks.length ? '<div style="position:absolute;inset:0;z-index:20;pointer-events:none;overflow:hidden;">' +
          freeBlocks.map(function(b, bIdx) {
            var left = b.posX != null ? b.posX : 50;
            var top = b.posY != null ? b.posY : (15 + bIdx * 14);
            var w = b.posW ? (b.posW + '%') : 'auto';
            var z = b.posZ || (20 + bIdx);
            return '<div style="position:absolute;left:' + left + '%;top:' + top + '%;width:' + w + ';z-index:' + z + ';transform:translate(-50%,-50%);pointer-events:auto;">' + renderBlock(b) + '</div>';
          }).join('') +
        '</div>' : '') +
        '<div class="page-footer" style="position:relative;z-index:10;">' +
          '<span>' + esc(STATE.title || 'RCG') + '</span>' +
          '<span>صفحه ' + (idx + 1) + ' از ' + STATE.pg.length + '</span>' +
        '</div>' +
      '</div>';
    }

    function renderNavHtml(st, curIdx, total) {
      const pv = '<button data-go="prev" ' + (curIdx <= 0 ? 'disabled' : '') + ' aria-label="قبلی">❮</button>';
      const nx = '<button data-go="next" ' + (curIdx >= total - 1 ? 'disabled' : '') + ' aria-label="بعدی">❯</button>';
      const mn = '<button data-go="menu" aria-label="فهرست">☰</button>';
      let mid = '';
      if (st === 'dots') {
        mid = STATE.pg.map(function(_, i) {
          return '<button class="nav-dot' + (i === curIdx ? ' active' : '') + '" data-go="' + i + '"></button>';
        }).join('');
      } else if (st === 'tabs') {
        mid = STATE.pg.map(function(_, i) {
          return '<button class="nav-tab-btn' + (i === curIdx ? ' active' : '') + '" data-go="' + i + '">' + (i + 1) + '</button>';
        }).join('');
      } else if (st === 'line') {
        mid = '<span class="nav-line-bar"><i style="width:' + (((curIdx + 1) / total) * 100) + '%;"></i></span>';
      } else if (st === 'mini') {
        return pv + mn + nx;
      } else {
        mid = '<span class="nav-counter">' + (curIdx + 1) + ' / ' + total + '</span>';
      }
      return pv + mid + nx + mn;
    }

    function renderTocModalHtml() {
      const mn = STATE.nav.mn || 'side';
      return '<div class="toc-modal style-' + mn + (menuOpen ? ' open' : '') + '">' +
        '<div class="toc-backdrop" data-go="close"></div>' +
        '<div class="toc-panel">' +
          '<div class="toc-title-header">' +
            '<h4>فهرست صفحات</h4>' +
            '<button class="toc-close-btn" data-go="close">✕</button>' +
          '</div>' +
          STATE.pg.map(function(p, i) {
            return '<button class="toc-nav-item' + (i === cur ? ' active' : '') + '" data-go="' + i + '">' +
              '<span>' + esc(p.t) + '</span>' +
              '<span class="toc-page-num">' + (i + 1) + '</span>' +
            '</button>';
          }).join('') +
        '</div>' +
      '</div>';
    }

    function calcScale() {
      const padW = window.innerWidth < 640 ? 16 : 32;
      const padH = window.innerWidth < 640 ? 110 : 130;
      const sX = (window.innerWidth - padW) / W;
      const sY = (window.innerHeight - padH) / H;
      return Math.max(0.2, Math.min(1.2, Math.min(sX, sY)));
    }

    function draw() {
      const scale = calcScale();
      const p = STATE.pg[cur];
      const navCfg = STATE.nav;
      const tr = navCfg.tr || 'fade';
      let transClass = '';
      if (tr === 'slide') {
        transClass = lastDir > 0 ? 'trans-slide-next' : 'trans-slide-prev';
      } else if (tr !== 'none') {
        transClass = 'trans-' + tr;
      }

      const navHtml = '<div class="catalog-nav shape-' + (navCfg.sh || 'round') + '">' +
        renderNavHtml(navCfg.st, cur, STATE.pg.length) +
      '</div>';

      const pageHtml = '<div class="catalog-viewport" style="width:' + (W * scale) + 'px;height:' + (H * scale) + 'px;">' +
        '<div class="page-scale-wrapper" style="transform:scale(' + scale + ');">' +
          '<div class="' + transClass + '">' +
            renderPageHtml(p, cur) +
          '</div>' +
        '</div>' +
        renderTocModalHtml() +
      '</div>';

      const container = document.getElementById('stage-container');
      container.innerHTML = navCfg.ps === 'top' ? (navHtml + pageHtml) : (pageHtml + navHtml);
    }

    function go(target) {
      if (target === 'menu' || target === 'close') {
        menuOpen = (target === 'menu') ? !menuOpen : false;
        draw();
        return;
      }
      menuOpen = false;
      const oldCur = cur;
      let nextIdx = cur;
      if (target === 'prev') nextIdx = cur - 1;
      else if (target === 'next') nextIdx = cur + 1;
      else nextIdx = parseInt(target, 10);
      nextIdx = Math.max(0, Math.min(STATE.pg.length - 1, nextIdx));
      if (nextIdx !== oldCur) {
        lastDir = nextIdx > oldCur ? 1 : -1;
        cur = nextIdx;
        window.location.hash = (cur + 1);
        draw();
      }
    }

    // Touch Swipe Detection for mobile phones
    let touchStartX = 0;
    let touchStartY = 0;
    document.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
      const diffX = e.changedTouches[0].screenX - touchStartX;
      const diffY = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(diffX) > 40 && Math.abs(diffY) < 60) {
        if (diffX > 0) go('prev'); // RTL swipe right is previous
        else go('next');
      }
    }, { passive: true });

    // Keyboard navigation
    window.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') go('next');
      if (e.key === 'ArrowRight') go('prev');
      if (e.key === 'Escape' && menuOpen) { menuOpen = false; draw(); }
    });

    // Hash change
    window.addEventListener('hashchange', function() {
      const h = window.location.hash.slice(1);
      if (/^\\d+$/.test(h)) {
        const pageNum = parseInt(h, 10) - 1;
        if (pageNum >= 0 && pageNum < STATE.pg.length && pageNum !== cur) {
          cur = pageNum;
          draw();
        }
      }
    });

    document.addEventListener('click', function(e) {
      const a = e.target.closest('a[href^="#"]');
      if (a) {
        e.preventDefault();
        const pNum = parseInt(a.getAttribute('href').slice(1), 10) - 1;
        if (!isNaN(pNum)) go(pNum);
        return;
      }
      const b = e.target.closest('[data-go]');
      if (b) {
        go(b.dataset.go);
      }
    });

    window.addEventListener('resize', draw);

    // Initial hash check
    const initHash = window.location.hash.slice(1);
    if (/^\\d+$/.test(initHash)) {
      const pIdx = parseInt(initHash, 10) - 1;
      if (pIdx >= 0 && pIdx < STATE.pg.length) cur = pIdx;
    }
    draw();
  </script>
</body>
</html>`;
}
