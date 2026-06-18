import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://prlogistics.fr',
  integrations: [sitemap({
    // Exclure les pages de prévisualisation internes
    filter: (page) => !page.includes('/preview-'),
  }), react(), tailwind()],
});