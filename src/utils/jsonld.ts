/**
 * Datos estructurados schema.org (tarea 5.7).
 *
 * Se construyen aquí y BaseLayout los pinta en el <head>. Todo sale de los
 * mismos JSON que alimentan la página visible, para que el marcado no pueda
 * decir algo distinto de lo que el visitante lee.
 */

const SITE = 'https://javiergarciaalvarez.com';
const ORCID = 'https://orcid.org/0009-0002-2876-2683';
const SCHOLAR = 'https://scholar.google.es/citations?user=mYf-JyQAAAAJ&hl=es';

/** El autor del sitio, reutilizado como creator en artículos y datasets. */
const AUTOR = {
  '@type': 'Person',
  name: 'Javier García-Álvarez',
  url: SITE,
};

export const persona = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE}/#persona`,
  name: 'Javier García-Álvarez',
  url: SITE,
  email: 'mailto:alvarez@unex.es',
  jobTitle: 'Personal Investigador en Formación (FPI)',
  identifier: ORCID,
  affiliation: {
    '@type': 'CollegeOrUniversity',
    name: 'Universidad de Extremadura',
    department: {
      '@type': 'Organization',
      name: 'Departamento de Ciencias de la Educación',
    },
  },
  sameAs: [ORCID, SCHOLAR],
};

interface Autor {
  nombre: string;
  orcid: string | null;
}

interface Publicacion {
  titulo: string;
  autores: Autor[] | null;
  anio: string | null;
  revista: string | null;
  editorial: string | null;
  url: string | null;
  doi?: string | null;
}

/**
 * Un artículo por entrada de Publicaciones.
 * `datePublished` solo se emite cuando el año es un año: las entradas "en
 * prensa" o "enviado" no tienen fecha de publicación, y ponerla sería mentir
 * en un formato que las máquinas se creen.
 */
export function articulo(pub: Publicacion) {
  const esAnio = pub.anio ? /^\d{4}$/.test(pub.anio) : false;

  return {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: pub.titulo,
    name: pub.titulo,
    // El ORCID va como sameAs: es lo que permite a un agregador saber que este
    // "García-Álvarez, J." es la misma persona que el de otro artículo.
    author: (pub.autores ?? []).map((a) => ({
      '@type': 'Person',
      name: a.nombre,
      ...(a.orcid ? { sameAs: `https://orcid.org/${a.orcid}`, identifier: `https://orcid.org/${a.orcid}` } : {}),
    })),
    // El DOI manda como identificador y como URL canónica. La ficha de Scholar
    // ya no se enseña en la página, pero se declara como sameAs: ahí sí sirve,
    // para que un agregador sepa que ambos registros son el mismo trabajo.
    ...(pub.doi ? { identifier: `https://doi.org/${pub.doi}` } : {}),
    ...(esAnio ? { datePublished: pub.anio } : {}),
    ...(pub.revista ? { isPartOf: { '@type': 'Periodical', name: pub.revista } } : {}),
    ...(pub.editorial ? { publisher: { '@type': 'Organization', name: pub.editorial } } : {}),
    ...(pub.doi ? { url: `https://doi.org/${pub.doi}` } : pub.url ? { url: pub.url } : {}),
    ...(pub.doi && pub.url ? { sameAs: pub.url } : {}),
  };
}

interface Recurso {
  titulo: string;
  descripcion: string;
  doi: string | null;
  version: string | null;
  licencia: string | null;
  editor: string | null;
  actualizado?: string | null;
  accion?: { url: string } | null;
}

/** Solo para recursos con DOI: sin identificador persistente no hay Dataset que valga. */
export function dataset(r: Recurso) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: r.titulo,
    description: r.descripcion,
    identifier: `https://doi.org/${r.doi}`,
    url: `https://doi.org/${r.doi}`,
    creator: AUTOR,
    ...(r.editor ? { publisher: { '@type': 'Organization', name: r.editor } } : {}),
    ...(r.version ? { version: r.version } : {}),
    ...(r.actualizado ? { datePublished: r.actualizado } : {}),
    ...(r.licencia === 'CC-BY 4.0'
      ? { license: 'https://creativecommons.org/licenses/by/4.0/' }
      : {}),
  };
}
