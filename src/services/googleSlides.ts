// Google Slides API integration: Create Presentation and export catalog pages

import { CatalogState } from '../types/catalog';

export interface SlidesExportResult {
  presentationId: string;
  title: string;
  slidesUrl: string;
}

export async function exportCatalogToGoogleSlides(
  accessToken: string,
  state: CatalogState
): Promise<SlidesExportResult> {
  const title = `${state.title || 'کاتالوگ هوشمند'} - پرزنتیشن Google Slides`;

  // 1. Create a blank Google Slides presentation
  const createRes = await fetch('https://slides.googleapis.com/v1/presentations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`خطا در ایجاد پرزنتیشن گوگل اسلایدز: ${errText}`);
  }

  const presentation = await createRes.json();
  const presentationId = presentation.presentationId;

  // 2. Prepare requests to populate slides for each catalog page
  const requests: any[] = [];

  state.pg.forEach((page, index) => {
    const slideId = `slide_page_${index}_${Math.random().toString(36).substring(2, 7)}`;
    const titleBoxId = `title_${slideId}`;
    const descBoxId = `desc_${slideId}`;

    // Create a new blank slide
    requests.push({
      createSlide: {
        objectId: slideId,
        insertionIndex: index + 1,
        slideLayoutReference: {
          predefinedLayout: 'BLANK',
        },
      },
    });

    // Create title textbox
    requests.push({
      createShape: {
        objectId: titleBoxId,
        shapeType: 'TEXT_BOX',
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: 550, unit: 'PT' },
            height: { magnitude: 60, unit: 'PT' },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 80,
            translateY: 40,
            unit: 'PT',
          },
        },
      },
    });

    // Insert title text
    const pageHeading = page.t || `صفحه ${index + 1}`;
    requests.push({
      insertText: {
        objectId: titleBoxId,
        text: pageHeading,
        insertionIndex: 0,
      },
    });

    // Style title text
    requests.push({
      updateTextStyle: {
        objectId: titleBoxId,
        style: {
          bold: true,
          fontSize: { magnitude: 26, unit: 'PT' },
          foregroundColor: {
            opaqueColor: {
              rgbColor: { red: 0.1, green: 0.2, blue: 0.4 },
            },
          },
        },
        fields: 'bold,fontSize,foregroundColor',
      },
    });

    // Create Content Box with page blocks summarized
    const blockSummaries = page.bl
      .map((b) => {
        if (b.t === 'h') return `• ${(b as any).x}`;
        if (b.t === 'p') return (b as any).x;
        if (b.t === 'prod') return `[محصول]: ${(b as any).n} - قیمت: ${(b as any).pr || '-'}`;
        if (b.t === 'btn') return `[دکمه]: ${(b as any).x}`;
        return '';
      })
      .filter(Boolean)
      .slice(0, 6)
      .join('\n\n');

    if (blockSummaries) {
      requests.push({
        createShape: {
          objectId: descBoxId,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: slideId,
            size: {
              width: { magnitude: 550, unit: 'PT' },
              height: { magnitude: 250, unit: 'PT' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 80,
              translateY: 120,
              unit: 'PT',
            },
          },
        },
      });

      requests.push({
        insertText: {
          objectId: descBoxId,
          text: blockSummaries,
          insertionIndex: 0,
        },
      });

      requests.push({
        updateTextStyle: {
          objectId: descBoxId,
          style: {
            fontSize: { magnitude: 14, unit: 'PT' },
          },
          fields: 'fontSize',
        },
      });
    }
  });

  // Batch update presentation
  if (requests.length > 0) {
    const batchRes = await fetch(
      `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests }),
      }
    );

    if (!batchRes.ok) {
      console.warn('Batch update had partial errors:', await batchRes.text());
    }
  }

  const slidesUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`;

  return {
    presentationId,
    title,
    slidesUrl,
  };
}
