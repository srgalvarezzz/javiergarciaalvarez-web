import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * Sitemap propio en lugar de @astrojs/sitemap (tarea 5.5).
 *
 * Son treinta líneas y evitan una dependencia, pero sobre todo dan control
 * fino sobre qué se indexa: la integración oficial enumera todas las rutas
 * construidas, incluida /404, y aquí hace falta poder dejar cosas fuera.
 *
 * Al añadir una ruta nueva al sitio hay que añadirla también aquí. Es el
 * precio de no usar la integración; a cambio, nada se publica por descuido.
 */

const RUTAS_FIJAS = [
  '/',
  '/sobre-mi',
  '/investigacion',
  '/recursos',
  '/recursos/calculadora-baremos',
  '/astillas',
];

const FALLBACK = 'https://javiergarciaalvarez.com';

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL(FALLBACK);

  // Las astillas en borrador no existen para el índice.
  const astillas = await getCollection('astillas', ({ data }) => !data.draft);

  const urls = [
    ...RUTAS_FIJAS.map((ruta) => ({ loc: new URL(ruta, base).href, lastmod: null as string | null })),
    ...astillas.map((astilla) => ({
      loc: new URL(`/astillas/${astilla.id}`, base).href,
      lastmod: (astilla.data.updatedAt ?? astilla.data.publishedAt).toISOString().slice(0, 10),
    })),
  ];

  const cuerpo = urls
    .map(({ loc, lastmod }) =>
      ['  <url>', `    <loc>${loc}</loc>`, lastmod ? `    <lastmod>${lastmod}</lastmod>` : null, '  </url>']
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cuerpo}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
