// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://javiergarciaalvarez.com',

  // El sitio es estático y no usa sesiones. Declaramos un driver de sesión
  // en memoria para que el adapter de Cloudflare NO inyecte un binding KV:
  // su provisioning automático fallaba al intentar recrear el namespace
  // "javiergarciaalvarez-web-session" (ya existente) en cada deploy.
  session: {
    driver: 'memory'
  },

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare()
});