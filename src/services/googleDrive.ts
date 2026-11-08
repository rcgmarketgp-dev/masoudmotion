// Google Drive API integration using client-side OAuth Bearer token

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  modifiedTime?: string;
  size?: string;
}

// Upload file (HTML or JSON) to Google Drive
export async function uploadToGoogleDrive(
  accessToken: string,
  fileName: string,
  content: string,
  mimeType = 'text/html'
): Promise<{ id: string; name: string; webViewLink?: string }> {
  const metadata = {
    name: fileName,
    mimeType: mimeType,
    description: 'کاتالوگ دیجیتال ایجاد شده با Smart Catalog Builder',
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}; charset=UTF-8\r\n\r\n` +
    content +
    closeDelimiter;

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`خطا در آپلود به گوگل درایو: ${errorText}`);
  }

  return response.json();
}

// List user's catalog files in Google Drive
export async function listGoogleDriveCatalogs(
  accessToken: string
): Promise<DriveFileItem[]> {
  const query = encodeURIComponent("name contains 'catalog' or mimeType = 'text/html' or mimeType = 'application/json'");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,webViewLink,modifiedTime,size)&pageSize=25&orderBy=modifiedTime desc`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`خطا در دریافت فایل‌های درایو: ${errorText}`);
  }

  const data = await response.json();
  return data.files || [];
}

// Download file content from Google Drive
export async function downloadFromGoogleDrive(
  accessToken: string,
  fileId: string
): Promise<string> {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('خطا در دانلود فایل از گوگل درایو');
  }

  return response.text();
}
