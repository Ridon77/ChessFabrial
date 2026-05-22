import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/** Normalitza el base path per a arrel o subcarpeta (p. ex. `/escacs/`). */
function normalizeBase(base: string | undefined): string {
  if (!base || base === '/') {
    return '/';
  }
  const withLeading = base.startsWith('/') ? base : `/${base}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = normalizeBase(
    process.env.VITE_BASE_PATH ?? env.VITE_BASE_PATH,
  );

  return {
    base,
    plugins: [react()],
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    },
  };
});
