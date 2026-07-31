/**
 * Formato de fecha del sitio (tareas 1.7 y 3.3).
 *
 * Las fechas viven en los datos como cadenas ISO (YYYY-MM-DD) y solo se
 * convierten a texto aquí, para que nunca haya una fecha escrita a mano en
 * una plantilla.
 */

/** Convierte '2026-07-31' en '31 de julio de 2026'. */
export function formatearFechaLarga(iso: string): string {
  // Mediodía y no medianoche: `new Date('2026-07-31')` se interpreta como UTC,
  // y en husos negativos toLocaleDateString devolvería el día anterior.
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Fecha de la entrada modificada más recientemente, ya formateada.
 * Las entradas sin `actualizado` se ignoran; si no queda ninguna, devuelve
 * null y quien llama decide no pintar nada.
 */
export function ultimaActualizacion(
  entradas: ReadonlyArray<{ actualizado?: string | null }>,
): string | null {
  const fechas = entradas
    .map((e) => e.actualizado)
    .filter((f): f is string => typeof f === 'string' && f.length > 0);

  if (fechas.length === 0) return null;

  // Las cadenas ISO ordenan igual como texto que como fecha.
  return formatearFechaLarga(fechas.reduce((a, b) => (a > b ? a : b)));
}
