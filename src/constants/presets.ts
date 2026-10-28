import {
  CatalogDimension,
  CatalogSizeKey,
  CatalogThemePalette,
  FontKey,
  FontWeightKey,
  BlockType,
  CatalogBlock,
  CatalogState,
  EditorUiTheme,
} from '../types/catalog';

export const CATALOG_SIZES: Record<CatalogSizeKey, CatalogDimension> = {
  a4: { width: 595, height: 842, label: 'A4 عمودی', desc: 'استاندارد چاپی و PDF کاتالوگ' },
  a4l: { width: 842, height: 595, label: 'A4 افقی', desc: 'مناسب نمایش دسکتاپ و اسلاید' },
  a5: { width: 420, height: 595, label: 'A5 جیبی', desc: 'دفترچه و بروشور فشرده' },
  sq: { width: 700, height: 700, label: 'مربع (1:1)', desc: 'پست اینستاگرام و وب' },
  st: { width: 450, height: 800, label: 'استوری موبایل', desc: 'مناسب گوشی و واتساپ' },
  sl: { width: 960, height: 540, label: 'اسلاید (16:9)', desc: 'پرزنتیشن و صفحه عریض' },
};

export const THEME_PALETTES: CatalogThemePalette[] = [
  { name: 'نارنجی پرانرژی (RCG)', bg: '#0A1A44', fg: '#FFFFFF', ac: '#FF5500', sf: '#14295F', r: 12 },
  { name: 'مدرن روز روشن', bg: '#FFFFFF', fg: '#0A1A44', ac: '#FF5500', sf: '#F2F4F9', r: 10 },
  { name: 'زمردی ارگانیک', bg: '#0D2818', fg: '#F2FBF5', ac: '#10B981', sf: '#164227', r: 14 },
  { name: 'یاقوتی لوکس', bg: '#1C0B1B', fg: '#FFF5F9', ac: '#F43F5E', sf: '#341433', r: 12 },
  { name: 'نیلی تکنولوژی', bg: '#090D1A', fg: '#F0F4FF', ac: '#6366F1', sf: '#131B33', r: 12 },
  { name: 'طلایی سلطنتی', bg: '#141318', fg: '#FAF6F0', ac: '#F59E0B', sf: '#22202A', r: 10 },
  { name: 'اقیانوسی آرامش', bg: '#082032', fg: '#F0F9FF', ac: '#0EA5E9', sf: '#14344E', r: 14 },
  { name: 'حداقل‌گرای سفید', bg: '#FAFAFA', fg: '#18181B', ac: '#2563EB', sf: '#FFFFFF', r: 8 },
  { name: 'خاکستری نئومدرن', bg: '#18181B', fg: '#F4F4F5', ac: '#38BDF8', sf: '#27272A', r: 12 },
  { name: 'بنفش سایبر', bg: '#0F0926', fg: '#FAF5FF', ac: '#A855F7', sf: '#1D1345', r: 14 },
  { name: 'چوبی گرم و طبیعی', bg: '#231B15', fg: '#FDFBF7', ac: '#D97706', sf: '#382B21', r: 10 },
  { name: 'تیره بلک‌استون', bg: '#050505', fg: '#EDEDED', ac: '#FF6B00', sf: '#141414', r: 8 },
];

export const ACCENT_COLORS = [
  '#FF5500', // RCG Orange
  '#F43F5E', // Rose
  '#10B981', // Emerald
  '#6366F1', // Indigo
  '#0EA5E9', // Sky Cyan
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#3B82F6', // Blue
  '#E11D48', // Deep Rose
  '#84CC16', // Lime
];

export const FONT_WEIGHTS: Record<FontWeightKey, { label: string; weight: number; desc: string }> = {
  regular: { label: 'معمولی (Regular)', weight: 400, desc: 'خوانایی بالا برای متون طولانی' },
  medium: { label: 'متوسط (Medium)', weight: 500, desc: 'پیش‌فرض متعادل برای کاتالوگ' },
  bold: { label: 'ضخیم (Bold)', weight: 700, desc: 'تیترها و تأکید ویژه' },
  black: { label: 'فوق‌ضخیم (Black)', weight: 900, desc: 'تیترهای بزرگ تجاری و سرتیترها' },
};

export const FONT_CONFIG: Record<FontKey, { name: string; bodyFont: string; headingFont: string; desc: string }> = {
  v: {
    name: 'وزیرمتن (Vazirmatn)',
    bodyFont: "'Vazirmatn', system-ui, Tahoma, sans-serif",
    headingFont: "'Vazirmatn', system-ui, Tahoma, sans-serif",
    desc: 'محبوب‌ترین فونت استاندارد وب فارسی با خوانایی بسیار بالا',
  },
  c: {
    name: 'قاهره (Cairo)',
    bodyFont: "'Cairo', system-ui, Tahoma, sans-serif",
    headingFont: "'Cairo', system-ui, Tahoma, sans-serif",
    desc: 'مدرن، زاویه‌دار و عالی برای کاتالوگ‌های صنعتی و فروشگاهی',
  },
  l: {
    name: 'لاله‌زار (Lalezar)',
    bodyFont: "'Vazirmatn', system-ui, Tahoma, sans-serif",
    headingFont: "'Lalezar', 'Vazirmatn', cursive",
    desc: 'تیترهای چشمگیر تبلیغاتی، رترو و پرانرژی',
  },
  n: {
    name: 'نسخ (Noto Naskh)',
    bodyFont: "'Noto Naskh Arabic', Georgia, serif",
    headingFont: "'Noto Naskh Arabic', Georgia, serif",
    desc: 'رسمی، کلاسیک، مناسب کتاب و محصولات فرهنگی و لوکس',
  },
  iy: {
    name: 'ایران‌یکان (سیستمی)',
    bodyFont: "'IRANYekan', 'Vazirmatn', system-ui, sans-serif",
    headingFont: "'IRANYekan', 'Vazirmatn', system-ui, sans-serif",
    desc: 'در صورت نصب بودن روی دستگاه مخاطب اعمال می‌شود',
  },
  is: {
    name: 'ایران‌سنس (سیستمی)',
    bodyFont: "'IRANSans', 'IRANSansX', 'Vazirmatn', system-ui, sans-serif",
    headingFont: "'IRANSans', 'IRANSansX', 'Vazirmatn', system-ui, sans-serif",
    desc: 'در صورت نصب بودن روی سیستم فراخوانی می‌شود',
  },
  sh: {
    name: 'شبنم (Shabnam)',
    bodyFont: "'Shabnam', 'Vazirmatn', system-ui, sans-serif",
    headingFont: "'Shabnam', 'Vazirmatn', system-ui, sans-serif",
    desc: 'حالت نرم و گرد حروف، دوستانه و زیبا',
  },
  custom: {
    name: 'فونت دلخواه (آپلود شده)',
    bodyFont: "'CustomUploadedFont', 'Vazirmatn', sans-serif",
    headingFont: "'CustomUploadedFont', 'Vazirmatn', sans-serif",
    desc: 'فونت آپلود شده شما (فرمت WOFF2 یا TTF)',
  },
};

export const SAMPLE_IMAGES = [
  {
    title: 'دستگاه مدرن کارگاهی',
    category: 'صنعتی',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'مبلمان و دکوراسیون چوبی',
    category: 'دکوراسیون',
    url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'محصولات الکترونیکی هوشمند',
    category: 'فناوری',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'ابزار دقیق صنعتی',
    category: 'تجهیزات',
    url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'فضای استودیو طراحی',
    category: 'معماری',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'تجهیزات مدرن بسته بندی',
    category: 'لجستیک',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
  },
];

export const EDITOR_UI_THEMES_INFO: Record<
  EditorUiTheme,
  {
    id: EditorUiTheme;
    title: string;
    subtitle: string;
    desc: string;
    previewBg: string;
    previewAccent: string;
    headerBg: string;
    sidebarBg: string;
    stageBg: string;
    badge: string;
  }
> = {
  'dark-obsidian': {
    id: 'dark-obsidian',
    title: 'ابسیدین شب',
    subtitle: 'Dark Obsidian Pro',
    desc: 'حالت تیره حرفه‌ای با بالاترین کنتراست و تمرکز بصری روی رنگ‌های کاتالوگ',
    previewBg: '#090d16',
    previewAccent: '#ff5500',
    headerBg: 'bg-slate-950/95 border-b border-slate-800 text-slate-100',
    sidebarBg: 'bg-slate-900/95 border-l border-slate-800 text-slate-200',
    stageBg: 'bg-slate-950',
    badge: 'پیشنهادی استودیو',
  },
  'clean-ivory': {
    id: 'clean-ivory',
    title: 'عاجی روشن',
    subtitle: 'Clean Ivory Studio',
    desc: 'محیط کاری روشن، مینیمال و پاکیزه برای طراحی روزانه',
    previewBg: '#f4f5f8',
    previewAccent: '#2563eb',
    headerBg: 'bg-white border-b border-slate-200 text-slate-800 shadow-sm',
    sidebarBg: 'bg-slate-50 border-l border-slate-200 text-slate-700',
    stageBg: 'bg-slate-200/80',
    badge: 'حالت روشن',
  },
  'glass-modern': {
    id: 'glass-modern',
    title: 'شیشه‌ای نئومدرن',
    subtitle: 'Glassmorphic Neo',
    desc: 'طراحی شیشه‌ای با شفافیت ظریف و گرادیان پس‌زمینه کهکشانی',
    previewBg: '#0e172a',
    previewAccent: '#8b5cf6',
    headerBg: 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 text-white',
    sidebarBg: 'bg-slate-900/70 backdrop-blur-xl border-l border-white/10 text-slate-200',
    stageBg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950',
    badge: 'شفاف و مدرن',
  },
  'vivid-creative': {
    id: 'vivid-creative',
    title: 'خلاقانه پرانرژی',
    subtitle: 'Vivid Creative Studio',
    desc: 'محیط تاریک با مرزهای های‌لایت سبز زمردی و دکمه‌های پرحرارت',
    previewBg: '#18181b',
    previewAccent: '#10b981',
    headerBg: 'bg-zinc-900 border-b-2 border-emerald-500 text-zinc-100',
    sidebarBg: 'bg-zinc-900 border-l border-zinc-800 text-zinc-200',
    stageBg: 'bg-zinc-950',
    badge: 'پرانرژی',
  },
};

export function createBlock(type: BlockType): CatalogBlock {
  const id = 'b_' + Math.random().toString(36).substring(2, 9);
  switch (type) {
    case 'h':
      return { id, t: 'h', x: 'عنوان بخش جدید', sz: 28, al: 'right', hs: 'b' };
    case 'p':
      return {
        id,
        t: 'p',
        x: 'توضیحات معرفی محصول یا خدمات با نوشتار واضح و فونت زیبا جهت انتقال کامل اطلاعات به مشتری.',
        sz: 14,
        al: 'right',
      };
    case 'img':
      return {
        id,
        t: 'img',
        src: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=80',
        ht: 220,
        fit: 'cover',
        caption: 'تصویر اصلی محصول',
      };
    case 'logo':
      return { id, t: 'logo', w: 50, al: 'center' };
    case 'btn':
      return {
        id,
        t: 'btn',
        x: 'مشاهده مشخصات و خرید آنلاین',
        u: 'https://',
        al: 'right',
        sh: 'gradient',
      };
    case 'prod':
      return {
        id,
        t: 'prod',
        x: 'دستگاه فرز CNC مدل Pro-X',
        d: 'مجهز به اسپیندل قدرتمند HSD ایتالیا با دقت صدم میلیمتر و سیستم خنک‌کننده پیشرفته اتوماتیک.',
        pr: 'تماس برای قیمت',
        src: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80',
        u: 'https://',
        badge: 'پرفروش‌ترین',
        layout: 'horizontal',
      };
    case 'list':
      return {
        id,
        t: 'list',
        x: 'ضمانت ۲۴ ماهه تعویض قطعات\nارسال رایگان به سراسر کشور\nنصب و آموزش رایگان در محل\nپشتیبانی فنی ۲۴ ساعته',
        sz: 14,
        st: 'k',
      };
    case 'box':
      return {
        id,
        t: 'box',
        title: 'نکته مهم مهندسی',
        x: 'تمامی قطعات با استاندارد بین‌المللی ISO 9001 تولید و پیش از خروج از کارخانه تست کیفیت شده‌اند.',
        sz: 14,
        al: 'right',
        st: 'accent-right',
      };
    case 'toc':
      return { id, t: 'toc', title: 'فهرست صفحات کاتالوگ' };
    case 'hr':
      return { id, t: 'hr', st: 'solid' };
    case 'sp':
      return { id, t: 'sp', ht: 24 };
    case 'features':
      return {
        id,
        t: 'features',
        items: [
          { icon: 'shield', title: 'گارانتی رسمی', desc: '۲۴ ماه ضمانت طلایی' },
          { icon: 'truck', title: 'ارسال فوری', desc: 'تحویل سریع در محل' },
          { icon: 'clock', title: 'پشتیبانی ۲۴/۷', desc: 'همراه شما در تمام مراحل' },
        ],
      };
    case 'contact':
      return {
        id,
        t: 'contact',
        phone: '۰۲۱-۸۸۸۸۹۹۹۹',
        website: 'www.rcg-industry.ir',
        email: 'info@rcg-industry.ir',
        address: 'تهران، خیابان سهروردی شمالی، پلاک ۱۱۰',
        instagram: '@rcg_industry',
      };
    case 'icon':
      return {
        id,
        t: 'icon',
        iconName: 'shield-check',
        sz: 48,
        colorType: 'accent',
        bgShape: 'circle',
        caption: 'ضمانت اصالت و کیفیت',
        captionPos: 'bottom',
        al: 'center',
        animation: 'bounce',
      };
  }
}

export const INITIAL_CATALOG_STATE: CatalogState = {
  title: 'کاتالوگ محصولات و خدمات صنعتی RCG',
  subtitle: 'کاتالوگ تعاملی هوشمند | پاییز ۱۴۰۴',
  tp: 0,
  c: { ...THEME_PALETTES[0] },
  sz: 'a4',
  f: 'v',
  fw: 'medium',
  dc: 'cn',
  nav: {
    st: 'arrows',
    ps: 'bottom',
    sh: 'round',
    tr: 'fade',
    mn: 'side',
  },
  pg: [
    {
      id: 'p_cover',
      t: 'جلد کاتالوگ',
      toc: false,
      bl: [
        { id: 'b_sp1', t: 'sp', ht: 40 },
        { id: 'b_lg', t: 'logo', w: 60, al: 'center' },
        { id: 'b_sp2', t: 'sp', ht: 20 },
        {
          id: 'b_h1',
          t: 'h',
          x: 'صنایع ماشین‌سازی و فناوری RCG',
          sz: 32,
          al: 'center',
          hs: 'c',
        },
        {
          id: 'b_p1',
          t: 'p',
          x: 'پیشرو در طراحی، ساخت و تأمین پیشرفته‌ترین خطوط تولید صنعتی و کارگاهی',
          sz: 15,
          al: 'center',
        },
        {
          id: 'b_im1',
          t: 'img',
          src: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=80',
          ht: 220,
          fit: 'cover',
          caption: 'تجهیزات مدرن کارگاهی با بالاترین استاندارد کیفی',
        },
        { id: 'b_sp3', t: 'sp', ht: 16 },
        {
          id: 'b_btn1',
          t: 'btn',
          x: 'ورود به فهرست و مرور محصولات',
          u: '#2',
          al: 'center',
          sh: 'gradient',
        },
      ],
    },
    {
      id: 'p_toc',
      t: 'فهرست مطالب',
      toc: false,
      bl: [
        { id: 'b_h2', t: 'h', x: 'فهرست عناوین کاتالوگ', sz: 28, al: 'right', hs: 'b' },
        { id: 'b_hr1', t: 'hr', st: 'solid' },
        {
          id: 'b_p_toc',
          t: 'p',
          x: 'برای دسترسی سریع به هر بخش، روی عنوان یا شماره صفحه مربوطه در زیر کلیک نمایید:',
          sz: 14,
          al: 'right',
        },
        { id: 'b_toc', t: 'toc', title: 'دسته‌بندی‌ها و بخش‌های اصلی' },
        {
          id: 'b_box1',
          t: 'box',
          title: 'خدمات ویژه مشتریان سازمانی',
          x: 'سفارش‌های عمده و خطوط سفارشی از تخفیف‌های ویژه و شرایط پرداخت اقساطی بهره‌مند می‌شوند.',
          sz: 13,
          al: 'right',
          st: 'glass',
        },
      ],
    },
    {
      id: 'p_prods',
      t: 'محصولات برتر',
      toc: true,
      cols: 2,
      bl: [
        { id: 'b_h3', t: 'h', x: 'تجهیزات و خطوط تولید RCG', sz: 26, al: 'right', hs: 'b' },
        { id: 'b_hr2', t: 'hr', st: 'solid' },
        {
          id: 'b_pr1',
          t: 'prod',
          x: 'دستگاه فرز CNC سه محوره RCG',
          d: 'دقت برش صدم میلیمتر با کنترلر پیشرفته Syntec و میز مکش پرقدرت.',
          pr: 'استعلام تلفنی',
          src: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80',
          u: 'https://',
          badge: 'پرفروش‌ترین',
          layout: 'vertical',
        },
        {
          id: 'b_pr2',
          t: 'prod',
          x: 'دستگاه لبه چسبان صنعتی اتوماتیک',
          d: 'موتورهای HSD ایتالیا با قابلیت تنظیم سرعت تغذیه و پیش‌گرمایش قطعه‌کار.',
          pr: 'موجود در انبار',
          src: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
          u: 'https://',
          badge: 'گارانتی طلایی',
          layout: 'vertical',
        },
        {
          id: 'b_pr3',
          t: 'prod',
          x: 'دستگاه دورکن اتوماتیک زاویه‌زن',
          d: 'طول ریل ۳۸۰ سانتیمتر با میز آلومینیومی آندایز شده سخت و موتور قدرتمند.',
          pr: 'تحویل فوری',
          src: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
          u: 'https://',
          badge: 'جدید',
          layout: 'vertical',
        },
        {
          id: 'b_pr4',
          t: 'prod',
          x: 'مکنده صنعتی دو قلو پرتوان',
          d: 'فیلتراسیون ذرات غبار تا ۹۹ درصد با کیسه‌های ضدآب و صدای بسیار کم.',
          pr: 'پیشنهاد ویژه',
          src: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
          u: 'https://',
          layout: 'vertical',
        },
      ],
    },
    {
      id: 'p_advantages',
      t: 'مزایا و تضمین‌ها',
      toc: true,
      bg: 1,
      bl: [
        { id: 'b_h4', t: 'h', x: 'چرا صنایع ماشین‌سازی RCG؟', sz: 28, al: 'right', hs: 'b' },
        { id: 'b_hr3', t: 'hr', st: 'solid' },
        {
          id: 'b_p4',
          t: 'p',
          x: 'ما با دارا بودن گواهینامه CE اروپا و استانداردهای کیفی جهانی، اطمینان از عملکرد بی‌نقص دستگاه‌ها را برای تولیدکنندگان به ارمغان می‌آوریم.',
          sz: 14,
          al: 'right',
        },
        {
          id: 'b_feat1',
          t: 'features',
          items: [
            { icon: 'shield', title: 'تضمین اصالت', desc: 'قطعات اصلی اروپایی' },
            { icon: 'truck', title: 'ارسال ایمن', desc: 'بسته‌بندی صادراتی ضدضربه' },
            { icon: 'clock', title: 'پشتیبانی ده ساله', desc: 'تأمین قطعات یدکی دائم' },
          ],
        },
        {
          id: 'b_lst1',
          t: 'list',
          x: 'تأمین ۱۰۰٪ قطعات یدکی در انبارهای مرکزی کشور\nتیم متخصص فنی برای رفع هرگونه خرابی در کمتر از ۴۸ ساعت\nنرم‌افزار کاربری بومی‌سازی شده با منوی کاملاً فارسی\nدسترسی به ویدیوهای آموزشی رایگان و دوره‌های اپراتوری',
          sz: 14,
          st: 'k',
        },
        {
          id: 'b_box2',
          t: 'box',
          title: 'دیدگاه مشتریان ما',
          x: '«از سال ۱۳۹۸ تمامی خطوط کارخانه ما با دستگاه‌های RCG تجهیز شد و راندمان تولید تا ۳ برابر افزایش پیدا کرد.»',
          sz: 13,
          al: 'right',
          st: 'quote',
        },
      ],
    },
    {
      id: 'p_contact',
      t: 'تماس و سفارش',
      toc: true,
      bl: [
        { id: 'b_h5', t: 'h', x: 'ارتباط مستقیم با کارشناسان فروش', sz: 28, al: 'right', hs: 'b' },
        { id: 'b_hr4', t: 'hr', st: 'solid' },
        {
          id: 'b_p5',
          t: 'p',
          x: 'برای دریافت مشاوره رایگان انتخاب تجهیزات و دریافت پیش‌فاکتور رسمی از طریق راه‌های زیر با ما در ارتباط باشید:',
          sz: 14,
          al: 'right',
        },
        {
          id: 'b_cnt1',
          t: 'contact',
          phone: '۰۲۱-۸۸۸۸۹۹۹۹',
          website: 'www.rcg-industry.ir',
          email: 'sales@rcg-industry.ir',
          address: 'تهران، شهرک صنعتی شمس‌آباد، بلوار بوستان، پلاک ۴۲',
          instagram: '@rcg_industry',
        },
        { id: 'b_sp4', t: 'sp', ht: 20 },
        {
          id: 'b_btn2',
          t: 'btn',
          x: 'درخواست مشاوره و استعلام قیمت آنلاین',
          u: 'https://',
          al: 'center',
          sh: 'gradient',
        },
        {
          id: 'b_btn3',
          t: 'btn',
          x: 'بازگشت به ابتدای کاتالوگ',
          u: '#1',
          al: 'center',
          sh: 'o',
        },
      ],
    },
  ],
};

export const BLANK_CATALOG_STATE: CatalogState = {
  title: 'کاتالوگ جدید من',
  subtitle: 'کاتالوگ اختصاصی خام',
  tp: 0,
  c: { ...THEME_PALETTES[0] },
  sz: 'a4',
  f: 'v',
  fw: 'medium',
  dc: 'cn',
  nav: {
    st: 'arrows',
    ps: 'bottom',
    sh: 'round',
    tr: 'fade',
    mn: 'side',
  },
  pg: [
    {
      id: 'p_blank_1',
      t: 'صفحه نخست',
      toc: true,
      bl: [
        { id: 'b_sp_init', t: 'sp', ht: 40 },
        {
          id: 'b_h_init',
          t: 'h',
          x: 'عنوان کاتالوگ جدید',
          sz: 32,
          al: 'center',
          hs: 'c',
        },
        {
          id: 'b_hr_init',
          t: 'hr',
          st: 'solid',
        },
        {
          id: 'b_p_init',
          t: 'p',
          x: 'کاتالوگ خام آماده طراحی است. از منوی ابزارها تیتر، تصاویر، محصولات و آیکون‌های متحرک دلخواه خود را اضافه کنید.',
          sz: 14,
          al: 'center',
        },
      ],
    },
  ],
};
