import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * Feed de Astillas (tarea 5.4), con la integración oficial de Astro.
 *
 * Astillas está fuera del nav (tarea 3.1) mientras no haya cadencia, así que
 * el feed y el enlace del footer son hoy las dos vías de suscripción.
 */

const FALLBACK = 'https://javiergarciaalvarez.com';

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL(FALLBACK);

  const astillas = await getCollection('astillas', ({ data }) => !data.draft);

  return rss({
    title: 'Astillas · Javier García-Álvarez',
    description: 'Notas sobre investigación, educación y lo que me incomoda.',
    site: base,
    // Más reciente primero: un lector de feeds no reordena por su cuenta.
    items: astillas
      .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
      .map((astilla) => ({
        title: astilla.data.title,
        description: astilla.data.description,
        pubDate: astilla.data.publishedAt,
        link: `/astillas/${astilla.id}/`,
      })),
    customData: '<language>es-es</language>',
  });
};
