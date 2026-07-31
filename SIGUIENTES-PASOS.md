# javiergarciaalvarez.com v2 — Estado y siguientes pasos

Punto de retomada. Actualizado el 31 de julio de 2026, al cerrar los seis bloques.

Este documento existe para que una sesión nueva, en otro ordenador y sin nada del contexto anterior, pueda continuar sin reconstruirlo todo. Si estás retomando, empieza por la sección 0.

---

## 0. Cómo retomar esto

```bash
gh repo clone srgalvarezzz/javiergarciaalvarez-web
cd javiergarciaalvarez-web
npm install
npm run check   # 0 errores, 0 avisos
npm run build   # 10 páginas
```

Requiere **Node 22 o superior** (probado en 24). Si `check` y `build` salen limpios, estás en el mismo punto en el que se dejó.

`npm run dev` levanta el sitio en `localhost:4321`.

### Estado del repositorio

| | |
|---|---|
| `main` | Todo el trabajo v2. **Los seis bloques están mergeados y desplegados.** |
| Ramas de bloque | `bloque-1-correcciones` … `bloque-6-accesibilidad`, ya integradas. Se pueden borrar. |
| Despliegue | Automático desde `main` a Cloudflare Workers. **Mergear es publicar.** |

---

## 1. Qué se hizo

**Bloque 1 — correcciones inmediatas.** Fuera la cita apócrifa atribuida a Lincoln y el panel de métricas, que además hacía un `fetch` a Google Scholar en tiempo de build (la página pasó de 915 ms a 34 ms). Publicaciones reordenadas. Los contadores de `/recursos` pasan a derivarse de un único cálculo.

**Bloque 2 — posicionamiento.** Decisión tomada: marco común de tecnología educativa, con IA generativa y aprendizaje basado en juegos en paralelo. H1 «Tecnología educativa, con evidencia». Las tarjetas de áreas pasan de tres a dos: *Game Mechanics* se funde en *Game-Based Learning*, porque separadas sumaban 2 contra 1 y la home leía como si los juegos fueran la línea principal.

**Bloque 3 — contenido existente.** Astillas sale del nav (reversible con una línea: `ASTILLAS_EN_NAV` en `BaseLayout`). El contenido de `/investigacion` se extrae a `src/data/investigacion.json`. Pies de «Última actualización» derivados del máximo de los datos.

**Bloque 4 — contenido nuevo.** Seis comunicaciones en congresos, revisión por pares y página del proyecto DIDACT.IA. Los datos salen del CVN de FECYT del autor; nada personal (DNI, domicilio, teléfono) entró en el repo.

**Bloque 5 — infraestructura y SEO.** `sitemap.xml` propio, `robots.txt`, feed RSS, JSON-LD validado contra schema.org con cero errores en las cuatro rutas que lo llevan, `rel="me"`, cinco imágenes de Open Graph por sección y página propia para la calculadora de baremos.

**Bloque 6 — accesibilidad.** El menú móvil deja de ser inalcanzable con teclado. Dos tokens de color pasan a cumplir WCAG AA. Enlace de salto al contenido. Se elimina la numeración de secciones.

**Cierre.** `npm audit` de 13 vulnerabilidades a 4, chequeo de tipos instalado, y limpieza de los restos del rediseño anterior.

---

## 2. Decisiones ya cerradas

No hace falta volver sobre ellas. Están aquí para no reabrirlas por descuido.

| Decisión | Resuelta como |
|---|---|
| Línea principal del sitio | Marco común de tecnología educativa (opción C) |
| Numeración de secciones | Eliminada |
| Contraste | Autorizado tocar `tokens.css` |
| Fecha de actualización | Del dato, no del build |
| RSS | Integración oficial `@astrojs/rss` |
| `og:image` | Una por sección, generadas con `scripts/generar-og.mjs` |
| Versión en inglés | **Monolingüe.** Se retiró el código que prometía un `/en` inexistente |
| CV descargable | **No se publica** |
| Docencia | No hay todavía; la tarea se retiró |
| Mapa Educraft | Eliminado del sitio |
| Autoría en congresos | No se lista, en ninguno, para no dar a entender que alguno fue en solitario |

---

## 3. Lo que queda

### Con dueño claro

- **Astro 7.** Las 4 vulnerabilidades restantes solo se cierran con el salto mayor. Hoy su superficie de ataque es nula (ver sección 5), así que es mantenimiento planificable, no urgencia.
- **`Content-Type` sin `charset`.** El servidor devuelve `text/html` a secas. El navegador se apaña con el `<meta charset>`, pero declararlo en la cabecera es lo correcto. Es configuración de Cloudflare, fuera del repo.

### Sin decidir

- **Formulario de contacto.** `/contacto` sigue sin formulario. Los botones «Feedback» de `/recursos` abren el correo con el asunto puesto, que cumple la intención sin construir backend. Hacerlo de verdad obliga a elegir entre Astro Actions con `prerender = false` sobre el Worker, o un servicio externo. Es la tarea más grande que queda.
- **El deeplink de Outlook.** `/contacto` abre el correo con un enlace de Office 365; el footer y los «Feedback» usan `mailto:`. El deeplink fue deliberado (`4842f20`), pero en un enlace público deja a quien no tenga sesión en la UEx frente a un login de Microsoft. Conviven dos criterios a propósito.
- **Fecha de Astillas en mayúsculas.** `.writing-date` lleva `text-transform: uppercase`, así que se lee «31 DE JULIO DE 2026». Es diseño, no contenido.

---

## 4. Mapa del código

```
src/
├── components/    Footer · Icon (wrapper de Lucide) · VoiceMarker (logo SVG)
├── content/astillas/            1 entrada, en Markdown
├── content.config.ts            content collection (Content Layer, glob loader)
├── data/
│   ├── investigacion.json       proyecto principal, publicaciones,
│   │                            comunicaciones, revisiones y DIDACT.IA
│   └── recursos.json            los recursos, con flag published
├── layouts/BaseLayout.astro     head, SEO, JSON-LD, nav, footer, menú móvil
├── pages/                       index · sobre-mi · investigacion · recursos
│                                contacto · astillas · 404
│                                investigacion/didactia
│                                recursos/calculadora-baremos
│                                sitemap.xml.ts · rss.xml.ts
├── styles/  global.css (solo Tailwind de layout) · tokens.css (el sistema)
└── utils/   fechas.ts · jsonld.ts
scripts/generar-og.mjs           imágenes de Open Graph
```

**El contenido sigue siendo mixto.** Astillas usa content collection, Investigación y Recursos viven en JSON, y la home, `/sobre-mi`, `/contacto` y las dos páginas nuevas siguen con el texto incrustado en el `.astro`. Conviene saberlo antes de prometer que algo «sale de los datos».

**Stack:** Astro 6.4.8, adapter de Cloudflare, Tailwind 4 vía plugin de Vite, `lucide-astro`, `@astrojs/rss`. Despliegue con Wrangler sobre Cloudflare Workers.

---

## 5. Notas técnicas que conviene no perder

- **El fondo real del sitio es `#FAFAF7`**, definido en `tokens.css`. El `bg-white` de Tailwind que llevaba el `<body>` se retiró justamente porque hacía creer lo contrario al calcular contrastes.
- **El sitemap es un endpoint propio con lista manual de rutas.** Al añadir una página hay que darla de alta en `src/pages/sitemap.xml.ts`. Es el precio de poder excluir rutas con control fino.
- **Las tipografías del sistema no están instaladas en el equipo de desarrollo.** `scripts/generar-og.mjs` rasteriza con `sharp` y cae a los sustitutos declarados en cada `font-family`. El resultado es consistente con las imágenes anteriores, pero si algún día se quiere la tipografía real hay que instalarla y volver a lanzar el script.
- **Las 4 vulnerabilidades que quedan no tienen superficie aquí.** Comprobado: el repo no usa View Transitions ni spread props, que son los vectores de las dos XSS de Astro; el único `set:html` es `JSON.stringify` de datos propios; `sharp` solo corre en build sobre SVG del repo; y el fallo de `esbuild` afecta al servidor de desarrollo en Windows.
- **Las tarjetas de recursos conservan las ramas `status === 'upcoming'`** aunque hoy sean código muerto. Hay dos banderas para el mismo concepto (`published` y `status`): si algún día se reactiva un recurso poniendo `published: true` sin tocar `status`, vuelve la píldora «Próximamente» y además se cuenta como disponible. Es la contradicción que mató la tarea 1.4, y puede volver.
- **`npm run check` y `npm run build` son la verificación completa.** No hay linter de estilo instalado; no se ha considerado necesario.
