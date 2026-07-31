/**
 * Genera las imágenes de Open Graph por sección (tarea 5.9).
 *
 *   node scripts/generar-og.mjs
 *
 * Escribe un .svg y un .png por sección en public/. El SVG es la fuente; el
 * PNG es lo que se publica, porque ninguna red social acepta SVG en og:image.
 *
 * Rasteriza con sharp, que ya viene con Astro: no añade dependencias. Ojo con
 * las tipografías: Instrument Serif, Inter Tight y JetBrains Mono no están en
 * el sistema, así que sharp cae a los sustitutos declarados en cada `font-
 * family`. El resultado es idéntico al og-image.png que había antes, señal de
 * que se generó igual. Si algún día se quiere la tipografía real, hay que
 * instalarla en la máquina que genere las imágenes y volver a lanzar esto.
 */

import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLICO = join(RAIZ, 'public');

// Cada entrada cambia solo el kicker y las dos líneas de descripción. El resto
// del lienzo es fijo para que las cinco se lean como una familia.
const SECCIONES = [
  {
    archivo: 'og-image',
    kicker: 'DOCTORANDO FPI · UNIVERSIDAD DE EXTREMADURA',
    lineas: ['Tecnología educativa, con evidencia.', 'IA generativa y aprendizaje en juegos.'],
  },
  {
    archivo: 'og-investigacion',
    kicker: 'INVESTIGACIÓN',
    lineas: ['IA generativa y pensamiento crítico.', 'Mecánicas de juego como evidencia.'],
  },
  {
    archivo: 'og-recursos',
    kicker: 'RECURSOS ABIERTOS',
    lineas: ['Datasets, herramientas y mapas', 'para docentes e investigadores.'],
  },
  {
    archivo: 'og-astillas',
    kicker: 'ASTILLAS',
    lineas: ['Notas sobre investigación, educación', 'y lo que me incomoda.'],
  },
  {
    archivo: 'og-sobre-mi',
    kicker: 'SOBRE MÍ',
    lineas: ['Doctorando FPI en la Universidad', 'de Extremadura.'],
  },
];

const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const plantilla = ({ kicker, lineas }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <!-- Generado por scripts/generar-og.mjs. No editar a mano. -->
  <rect width="1200" height="630" fill="#FAFAF7"/>

  <!-- Marca terracota: barra vertical izquierda -->
  <rect x="80" y="80" width="6" height="470" fill="#D86842" rx="3"/>

  <text x="120" y="180" font-family="'JetBrains Mono', monospace" font-size="22" fill="#8B8B9E" letter-spacing="2.5">${escapar(kicker)}</text>

  <text x="120" y="285" font-family="'Instrument Serif', Georgia, serif" font-size="84" fill="#0F0F1A" letter-spacing="-2">Javier García-Álvarez</text>

  <text x="120" y="365" font-family="'Inter Tight', sans-serif" font-size="32" fill="#4A4A5C" font-weight="400">${escapar(lineas[0])}</text>
  <text x="120" y="408" font-family="'Inter Tight', sans-serif" font-size="32" fill="#4A4A5C" font-weight="400">${escapar(lineas[1])}</text>

  <line x1="120" y1="455" x2="320" y2="455" stroke="#D86842" stroke-width="3"/>

  <text x="120" y="555" font-family="'JetBrains Mono', monospace" font-size="22" fill="#0F0F1A" font-weight="500">javiergarciaalvarez.com</text>
</svg>
`;

for (const seccion of SECCIONES) {
  const svg = plantilla(seccion);
  writeFileSync(join(PUBLICO, `${seccion.archivo}.svg`), svg, 'utf8');

  await sharp(Buffer.from(svg), { density: 72 })
    .resize(1200, 630)
    .png()
    .toFile(join(PUBLICO, `${seccion.archivo}.png`));

  console.log(`✓ ${seccion.archivo}.svg + .png`);
}
