// @ts-check
import { defineConfig } from 'astro/config';

import tailwindVite from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindVite()]
  }
});