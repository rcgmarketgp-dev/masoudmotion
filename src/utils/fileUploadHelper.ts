/**
 * Multi-format file uploader helper supporting PDF, PNG, JPG, JPEG, WEBP, and SVG.
 */

export async function processCatalogMediaFile(
  file: File,
  maxDimension = 1200
): Promise<{ dataUrl: string; name: string }> {
  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

  // 1. PDF Handler: renders the first page using pdf.js into high-res canvas
  if (file.type === 'application/pdf' || fileExt === 'pdf') {
    const pdfjs = await getPdfJsLibrary();
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    const page = await pdfDoc.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 }); // High-res rendering

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext('2d');

    if (context) {
      await page.render({ canvasContext: context, viewport }).promise;
      const dataUrl = canvas.toDataURL('image/png', 0.95);
      return { dataUrl, name: file.name };
    }
  }

  // 2. SVG Vector Handler: reads as clean dataURL
  if (file.type === 'image/svg+xml' || fileExt === 'svg') {
    const text = await file.text();
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(text)}`;
    return { dataUrl, name: file.name };
  }

  // 3. Standard Raster Images (PNG, JPG, JPEG, WEBP, etc.)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Preserve PNG transparency if png/webp, otherwise jpeg
          const isPng = fileExt === 'png' || file.type === 'image/png';
          const format = isPng ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(format, isPng ? 0.95 : 0.88);
          resolve({ dataUrl, name: file.name });
        } else {
          resolve({ dataUrl: reader.result as string, name: file.name });
        }
      };
      img.onerror = () => reject(new Error('خطا در پردازش تصویر'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('خطا در خواندن فایل'));
    reader.readAsDataURL(file);
  });
}

function getPdfJsLibrary(): Promise<any> {
  if ((window as any).pdfjsLib) {
    return Promise.resolve((window as any).pdfjsLib);
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      const lib = (window as any).pdfjsLib;
      lib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(lib);
    };
    script.onerror = () => reject(new Error('بارگذاری موتور پردازش PDF ناموفق بود.'));
    document.head.appendChild(script);
  });
}
