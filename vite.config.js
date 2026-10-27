import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base keeps assets working on GitHub Pages project sites
  // (https://<user>.github.io/<repo>/) as well as on any sub-path host.
  base: './',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1200,
  },
});
