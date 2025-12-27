// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

import tailwindVite from '@tailwindcss/vite';

import db from '@astrojs/db';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'http://localhost:4321', // Local dev site
  output: 'server',
  adapter: netlify(),

  vite: {
    plugins: [tailwindVite()]
  },

  integrations: [db(), react()]
});