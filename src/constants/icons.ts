export interface SvgIconDef {
  id: string;
  name: string;
  category: 'industry' | 'commerce' | 'badges' | 'contact' | 'tech' | 'lifestyle';
  tags: string[];
  svg: string; // inner svg paths and elements for a 24x24 viewBox
  color?: string; // colorful default accent
}

export const ICON_CATEGORIES = [
  { id: 'all', label: 'همه آیکون‌ها' },
  { id: 'industry', label: 'صنعتی و کارگاهی' },
  { id: 'commerce', label: 'فروشگاه و تجارت' },
  { id: 'badges', label: 'مدال‌ها و نشان‌ها' },
  { id: 'contact', label: 'ارتباطات و آدرس' },
  { id: 'tech', label: 'فناوری و دقت' },
  { id: 'lifestyle', label: 'سبک و زیبایی' },
];

export const SVG_ICONS: SvgIconDef[] = [
  // --- Industry & Tools ---
  {
    id: 'wrench',
    name: 'آچار و تنظیمات فنی',
    category: 'industry',
    color: '#F97316',
    tags: ['ابزار', 'فنی', 'تنظیم', 'تعمیر', 'tool', 'wrench'],
    svg: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  },
  {
    id: 'hammer',
    name: 'چکش و ساخت‌وساز',
    category: 'industry',
    color: '#EF4444',
    tags: ['چکش', 'ساخت', 'کارگاه', 'تولید'],
    svg: '<path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 3.26-6.36 6.36a2 2 0 0 0 0 2.83l.88.88a2 2 0 0 0 2.83 0l6.36-6.36c.6-.6.7-1.53.24-2.24l-1.71-1.71c-.71-.46-1.64-.36-2.24.24z"/>',
  },
  {
    id: 'cog',
    name: 'چرخ‌دنده و موتور',
    category: 'industry',
    color: '#0EA5E9',
    tags: ['چرخ دنده', 'موتور', 'مکانیک', 'تنظیمات', 'گیربکس'],
    svg: '<path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  },
  {
    id: 'factory',
    name: 'کارخانه و کارگاه تولیدی',
    category: 'industry',
    color: '#6366F1',
    tags: ['کارخانه', 'تولید', 'صنعت', 'مجتمع'],
    svg: '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/>',
  },
  {
    id: 'ruler',
    name: 'خط‌کش و دقت مهندسی',
    category: 'industry',
    color: '#EAB308',
    tags: ['خط کش', 'اندازه', 'دقت', 'مهندسی'],
    svg: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>',
  },
  {
    id: 'box',
    name: 'بسته و تحویل کالا',
    category: 'industry',
    color: '#8B5CF6',
    tags: ['جعبه', 'کارتن', 'انبار', 'محصول', 'بسته بندی'],
    svg: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  },
  // --- Commerce, Shopping & Discounts ---
  {
    id: 'tag',
    name: 'برچسب قیمت و آفر',
    category: 'commerce',
    color: '#EC4899',
    tags: ['تخفیف', 'قیمت', 'آفر', 'فروش ویژه', 'اتیکت'],
    svg: '<path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><circle cx="7" cy="7" r="1.5"/>',
  },
  {
    id: 'percent',
    name: 'درصد تخفیف طلایی',
    category: 'commerce',
    color: '#10B981',
    tags: ['تخفیف', 'درصد', 'آفر', 'تخفیف ویژه'],
    svg: '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  },
  {
    id: 'shopping-cart',
    name: 'سبد خرید و سفارش',
    category: 'commerce',
    color: '#F97316',
    tags: ['سبد', 'خرید', 'سفارش', 'فروشگاه'],
    svg: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  },
  {
    id: 'shopping-bag',
    name: 'کیسه خرید و تحویل',
    category: 'commerce',
    color: '#8B5CF6',
    tags: ['کیف', 'خرید', 'پک', 'کیسه'],
    svg: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  },
  {
    id: 'credit-card',
    name: 'پرداخت امن و کارت',
    category: 'commerce',
    color: '#3B82F6',
    tags: ['کارت', 'بانک', 'پرداخت', 'شتاب', 'آنلاین'],
    svg: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
  },
  // --- Quality, Badges & Guarantees ---
  {
    id: 'shield-check',
    name: 'سپر گارانتی و اصالت',
    category: 'badges',
    color: '#10B981',
    tags: ['گارانتی', 'اصالت', 'تضمین', 'سپر', 'امنیت'],
    svg: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  },
  {
    id: 'award',
    name: 'مدال افتخار و رتبه برتر',
    category: 'badges',
    color: '#F59E0B',
    tags: ['مدال', 'جایزه', 'کیفیت', 'برتر', 'رتبه'],
    svg: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  },
  {
    id: 'star',
    name: 'ستاره رضایت و امتیاز',
    category: 'badges',
    color: '#FBBF24',
    tags: ['ستاره', 'امتیاز', 'ستاره دار', 'برگزیده', 'عالی'],
    svg: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  },
  {
    id: 'sparkles',
    name: 'درخشش و جادوی نوآوری',
    category: 'badges',
    color: '#A855F7',
    tags: ['جرقه', 'جدید', 'نوآوری', 'ویژه', 'لوکس'],
    svg: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
  },
  {
    id: 'crown',
    name: 'تاج پادشاهی و VIP',
    category: 'badges',
    color: '#F59E0B',
    tags: ['تاج', 'شاهکار', 'وی آی پی', 'مشتری طلایی', 'vip'],
    svg: '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.735H5.81a1 1 0 0 1-.957-.735L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>',
  },
  {
    id: 'flame',
    name: 'شعله داغ و پرفروش',
    category: 'badges',
    color: '#EF4444',
    tags: ['آتش', 'داغ', 'پرفروش', 'پیشنهاد شگفت انگیز'],
    svg: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  },
  // --- Contact, Shipping & Services ---
  {
    id: 'truck',
    name: 'ارسال سریع به تمام نقاط',
    category: 'contact',
    color: '#0284C7',
    tags: ['حمل و نقل', 'ارسال', 'پیک', 'پست', 'باربری'],
    svg: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18.5" r="2.5"/><circle cx="7" cy="18.5" r="2.5"/>',
  },
  {
    id: 'clock',
    name: 'پشتیبانی ۲۴ ساعته',
    category: 'contact',
    color: '#10B981',
    tags: ['ساعت', 'زمان', 'سرعت', 'پشتیبانی', 'سریع'],
    svg: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  },
  {
    id: 'phone',
    name: 'تلفن مستقیم مشاوره',
    category: 'contact',
    color: '#10B981',
    tags: ['تلفن', 'تماس', 'مشاوره', 'پشتیبانی'],
    svg: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  },
  {
    id: 'map-pin',
    name: 'لوکیشن و آدرس کارخانه',
    category: 'contact',
    color: '#EF4444',
    tags: ['آدرس', 'نقشه', 'لوکیشن', 'موقعیت', 'دفتر'],
    svg: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  },
  {
    id: 'mail',
    name: 'ایمیل و مکاتبات رسمی',
    category: 'contact',
    color: '#6366F1',
    tags: ['ایمیل', 'نامه', 'پیام', 'استعلام'],
    svg: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  },
  {
    id: 'globe',
    name: 'وبسایت و پورتال آنلاین',
    category: 'contact',
    color: '#0EA5E9',
    tags: ['سایت', 'اینترنت', 'جهانی', 'وب'],
    svg: '<circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  },
  // --- Tech & Energy ---
  {
    id: 'zap',
    name: 'انرژی پرقدرت و سرعت',
    category: 'tech',
    color: '#F59E0B',
    tags: ['برق', 'توان', 'سرعت', 'انرژی', 'پرقدرت'],
    svg: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  },
  {
    id: 'cpu',
    name: 'پردازنده و کنترلر هوشمند',
    category: 'tech',
    color: '#10B981',
    tags: ['هوشمند', 'پردازنده', 'کنترلر', 'کامپیوتر', 'cnc'],
    svg: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
  },
  {
    id: 'lock',
    name: 'امنیت و قفل ایمنی',
    category: 'tech',
    color: '#EC4899',
    tags: ['امنیت', 'قفل', 'ایمنی', 'محافظ'],
    svg: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  },
  // --- Lifestyle ---
  {
    id: 'heart',
    name: 'علاقه‌مندی و رضایت مشتری',
    category: 'lifestyle',
    color: '#F43F5E',
    tags: ['قلب', 'دوست داشتنی', 'محبوب', 'کیفیت'],
    svg: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  },
  {
    id: 'leaf',
    name: 'سازگار با محیط زیست',
    category: 'lifestyle',
    color: '#84CC16',
    tags: ['طبیعت', 'سبز', 'اکو', 'محیط زیست'],
    svg: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  },
  {
    id: 'gift',
    name: 'هدیه و اشانتیون سفارش',
    category: 'lifestyle',
    color: '#A855F7',
    tags: ['جایزه', 'هدیه', 'پاداش', 'سورپرایز'],
    svg: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
  },
];

export function getSvgIcon(id: string): SvgIconDef {
  const found = SVG_ICONS.find((i) => i.id === id);
  return found || SVG_ICONS[0];
}

export function generateSvgTag(
  iconId: string,
  size = 24,
  color = 'currentColor',
  customPath?: string
): string {
  const icon = getSvgIcon(iconId);
  const content = customPath || icon.svg;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`;
}
