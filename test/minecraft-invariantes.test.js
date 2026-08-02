import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/**
 * Invariantes del conjunto de datos de la revisión sobre Minecraft.
 *
 * Son la única defensa contra una regresión silenciosa en el pipeline: si
 * build-data.py cambia y estos números se mueven, el explorador seguiría
 * dibujando gráficos preciosos con datos equivocados, y nadie se enteraría.
 *
 *   npm run test:datos
 *
 * Usa node:test, que viene con Node, para no añadir dependencias.
 */

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const { meta, studies } = JSON.parse(readFileSync(join(raiz, 'src/data/minecraft.json'), 'utf8'));

const cuenta = (arr, clave) =>
  arr.reduce((m, x) => { const k = clave(x); m[k] = (m[k] || 0) + 1; return m; }, {});

const conIntervencion = studies.filter((s) => s.iv === 1);

test('106 estudios en total, 71 con intervención', () => {
  assert.equal(studies.length, 106);
  assert.equal(meta.n, 106);
  assert.equal(conIntervencion.length, 71);
});

test('contexto educativo entre los estudios con intervención', () => {
  const c = cuenta(conIntervencion, (s) => s.edu);
  assert.equal(c['No formal'] ?? 0, 39);
  assert.equal(c['Formal'] ?? 0, 30);
  assert.equal(c['Combinado'] ?? 0, 2);
  assert.equal(c['Informal'] ?? 0, 0);
});

test('nivel educativo en contexto formal con intervención', () => {
  const c = cuenta(conIntervencion.filter((s) => s.edu === 'Formal'), (s) => s.lvl);
  assert.equal(c['Secundaria'] ?? 0, 10);
  assert.equal(c['Primaria'] ?? 0, 8);
  assert.equal(c['Universidad'] ?? 0, 5);
  assert.equal(c['Formación del profesorado'] ?? 0, 3);
  assert.equal(c['Educación superior'] ?? 0, 2);
  assert.equal(c['Multinivel'] ?? 0, 2);
});

test('80 de 106 estudios no declaran ninguna teoría', () => {
  assert.equal(studies.filter((s) => s.th.length === 0).length, 80);
});

test('publicaciones por año, de 2014 a 2024', () => {
  const c = cuenta(studies, (s) => s.y);
  const esperado = [2, 6, 5, 9, 9, 9, 9, 13, 14, 13, 17];
  assert.deepEqual(
    esperado.map((_, i) => c[2014 + i] ?? 0),
    esperado,
  );
});
