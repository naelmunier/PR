import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://prlogistics.fr',
  integrations: [
    sitemap({
      // Exclure les pages de prévisualisation internes
      filter: (page) => !page.includes('/preview-'),
    }),
  ],
});
