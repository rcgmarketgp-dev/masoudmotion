import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// In the Base44 sandbox the app is served through a preview proxy, so the
// browser's requests reach Vite with a proxied hostname. Allow those hosts only
// when BASE44_PREVIEW_MODE is exactly "1"; otherwise the default (localhost/IP
// only) behavior is preserved.
const previewAllowedHosts =
  process.env.BASE44_PREVIEW_MODE === '1'
    ? [
        process.env.BASE44_PUBLIC_HOST_SUFFIX
          ? `3000-${process.env.BASE44_PUBLIC_HOST_SUFFIX}`
          : '',
        process.env.BASE44_SANDBOX_HOST_DOMAIN
          ? `.${process.env.BASE44_SANDBOX_HOST_DOMAIN}`
          : '',
      ].filter(Boolean)
    : [];

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      allowedHosts: previewAllowedHosts.length ? previewAllowedHosts : undefined,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
