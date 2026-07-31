# javiergarciaalvarez.com v2 — Estado y siguientes pasos

Punto de retomada del trabajo. Escrito el 31 de julio de 2026, al cerrar el Bloque 1.

Este documento existe para que una sesión nueva —en otro ordenador, sin nada del contexto anterior— pueda continuar sin volver a reconstruirlo todo. Si estás retomando, empieza por la sección 0.

---

## 0. Cómo retomar esto en otro ordenador

### Arranque

```bash
gh repo clone srgalvarezzz/javiergarciaalvarez-web
cd javiergarciaalvarez-web
npm install
npm run build
```

Requiere **Node 22 o superior** (`.node-version` dice 22; probado también en 24). El build debe salir limpio con **8 páginas**. Si sale limpio, estás en el mismo punto en el que se dejó.

Para ver el sitio construido no hace falta servidor de desarrollo: `npm run dev` levanta Astro en `localhost:4321`.

### Estado del repositorio

| | |
|---|---|
| `main` | La historia real del sitio, 53 commits. **No se ha tocado.** |
| `bloque-1-correcciones` | Bloque 1 completo, un commit sobre `main`. |
| PR abierto | [#2 — Bloque 1](https://github.com/srgalvarezzz/javiergarciaalvarez-web/pull/2), sin mergear, a la espera de revisión. |
| Desplegado | **No.** El sitio en producción sigue siendo el de `main`. |

Para ver qué cambió el bloque: `git diff main..bloque-1-correcciones`

> **Nota sobre cómo se llegó aquí.** El trabajo empezó sobre una carpeta descargada en zip, sin `.git`, así que hubo que inicializar un repositorio local con un commit sintético de partida. Al aparecer el repositorio real se comprobó que el árbol remoto era **idéntico** a ese punto de partida, y el commit del Bloque 1 se rebasó sobre la historia real. El commit sintético se descartó. **No hay historia perdida y no hace falta ningún force-push.** Si alguna vez surge la tentación de forzar un push sobre `main`, es señal de que algo se ha hecho mal: para y comprueba.

### Qué decirle a una sesión nueva de Claude Code

> Lee `SIGUIENTES-PASOS.md` en la raíz del repo. Retomamos el proyecto v2 de javiergarciaalvarez.com desde ahí. Las reglas de trabajo (un PR por bloque, no tocar el sistema de diseño, no instalar dependencias sin avisar, no inventar datos académicos) siguen vigentes.

Conviene pasarle también la lista original de tareas por bloques, porque este documento la resume pero no la sustituye.

---

## 1. Qué se ha hecho

**Bloque 1 completo** (1.1 a 1.7), verificado contra el HTML construido:

- Eliminada la cita apócrifa atribuida a Lincoln en `/sobre-mi`, con su CSS huérfano. No hizo falta frase puente: el "Eso" del párrafo siguiente apuntaba en realidad al párrafo anterior.
- Eliminado el panel de Métricas de `/investigacion`, junto con el `fetch` a Google Scholar en tiempo de build y `src/data/metrics.json`. La página pasó de 915 ms a 34 ms de build.
- Publicaciones en el orden correcto: Minecraft primero, Cáceres después.
- Contadores de `/recursos` derivados del mismo cálculo: ya no pueden contradecirse.
- Los dos recursos "Próximamente", retirados de la vista con `published: false` y filtrados en el render. Probado que revertir es cambiar un booleano.
- `TODO` en el subtítulo de la home, sin tocar el texto en producción.
- Fechas en formato español largo. No queda ninguna fecha ISO en el sitio.

Los detalles completos de verificación están en el cuerpo del [PR #2](https://github.com/srgalvarezzz/javiergarciaalvarez-web/pull/2).

**Bloque 2: bloqueado.** No se ha ejecutado nada de él. Ver sección 2.

---

## 2. La decisión de posicionamiento

Lo dicho hasta ahora — línea académica principal **tecnología educativa**, intereses generales en **aprendizaje y educación** — corresponde a la **Opción C** del planteamiento original: un marco común de nivel superior, con Game-Based Learning e IA generativa colgando de él como aplicaciones.

Eso desbloquea la *estructura*. No desbloquea todavía el Bloque 2.

### Lo que queda sin resolver

1. **Cuál de las dos aplicaciones lidera.** Hay una contradicción viva en el sitio: la home vende Game-Based Learning en primer lugar y `/investigacion` abre con la umbrella review de IA generativa como "Proyecto principal". Decir que el marco es tecnología educativa no dice cuál va delante. Esto determina 2.4 (orden de las tres tarjetas de `01 / Áreas`) y 2.5 (coherencia entre home e investigación). **Es la única pregunta que cambia trabajo real.**
2. **Línea secundaria, H1 y subtítulo aprobados.** Siguen en blanco.

### Objeción registrada

"Tecnología educativa" como titular describe el programa de doctorado más que una línea de investigación: un lector experto no aprende nada de esa etiqueta porque cabe casi todo dentro. Funciona bien como *marco* interno que ordena las áreas, y mal como *promesa* de la home. La sugerencia es que el marco viva en la arquitectura del sitio (orden de las tarjetas, jerarquía de `/investigacion`) y que el H1 y el subtítulo digan algo más estrecho.

Es una decisión de carrera, no de copy. Si se confirma que se quiere el marco explícito en el titular, se redacta así y punto.

### Cómo cerrarlo

Basta con decidir **qué aplicación lidera**. Con eso se preparan, en un solo mensaje y sin tocar el repo:

- dos propuestas de H1,
- dos de subtítulo (integrando la frase "escribo sobre lo que me incomoda" o eliminándola, que es la tarea 3.2),
- las dos propuestas de la tarjeta de Inteligencia Artificial que pide 2.3, con la investigación propia como sujeto y DIDACT.IA como marco de financiación.

Se elige y se ejecuta el Bloque 2 entero de una vez.

---

## 3. Ruta recomendada

Reordenada respecto a la lista original, por dependencias y por lo que puede avanzar sin decisiones.

### Fase A — Se puede hacer ya, sin esperar nada

| Tarea | Qué implica | Coste |
|---|---|---|
| 3.1 Astillas fuera del nav | Una constante en `BaseLayout` que filtra `navLinks`, más el enlace en el footer. La vuelta atrás, una sola línea. | S |
| 3.4 Auditar `/contacto` | **Es un informe, no un arreglo.** Ver sección 6. | S |
| 5.6 Página 404 | Ya existe y cumple. Solo falta el enlace a Recursos. | XS |
| 5.8 `rel="me"` en ORCID y Scholar | Dos atributos en el footer. | XS |
| 5.10 Enlaces rotos | Barrido de internos y externos. Informar, no arreglar los externos por cuenta propia. | S |
| 6.4 "Saltar al contenido" | Enlace al principio del DOM, visible al foco, más un `id` en `<main>`. | XS |
| 6.7 Jerarquía de encabezados | Ya auditado: **no se encontraron violaciones**. Confirmar sobre el HTML construido y cerrar. | XS |
| 4.6 Versión en inglés | Evaluación de tres escenarios. Documento, cero código. | M |

Esta fase deja el sitio desplegable y no depende de ninguna decisión pendiente. **Es lo propuesto como siguiente bloque.**

### Fase B — En cuanto se respondan las decisiones D2, D3, D4 y D5

6.1 (serie numérica), 6.2 (contraste), 6.3 (foco + bug de teclado en móvil), 3.3 (fecha de actualización), 5.4 y 5.5 (RSS, sitemap, robots).

### Fase C — Bloque 2 y su estela

2.1 a 2.5 en un solo bloque, más 3.2, que es la misma frase.

### Fase D — Contenido que depende de datos externos

Bloque 4 completo, 5.1, 5.2, 5.3, 5.7 y 5.9. Ver secciones 6 y 7.

---

## 4. Lo que no se hace sin autorización explícita

- Instalar `@astrojs/rss` o `@astrojs/sitemap` (regla 5).
- Cambiar un valor de `tokens.css`, aunque 6.2 lo exija de facto (regla 4).
- Redactar H1, subtítulo o cualquier texto del Bloque 2 antes de cerrar la decisión.
- Inventar datos académicos. Donde falte uno, marcador y pregunta.
- Forzar un push sobre `main`.

---

## 5. Decisiones pendientes

| # | Decisión | Recomendación |
|---|---|---|
| **D1** | ¿GBL o IAG lidera la jerarquía? | Sin recomendación: es una decisión de carrera. Pero el sitio hoy se contradice, así que hay que elegir. |
| **D2** | **6.1**: ¿numerar las seis secciones o eliminar la numeración? | **Eliminarla.** La serie promete un orden que el sitio no tiene —Sobre mí y Contacto nunca entraron, y con 3.1 Astillas sale del nav— y mantenerla obliga a renumerar cada vez que cambie la arquitectura. |
| **D3** | **6.2**: ¿autorizar el cambio de `--color-ink-muted`? | **Sí.** Está en 3,19:1 sobre `#FAFAF7` y se usa en todos los kickers, metadatos, fechas y pies: es un incumplimiento de AA generalizado. Es un solo valor, pero afecta a las seis rutas. La tabla completa de ratios va antes de tocar nada. |
| **D4** | **3.3**: ¿de dónde sale "Última actualización"? | **Del dato, no del build.** La fecha de build cambia en cada despliegue aunque el contenido no se mueva: sería una fecha que miente. Propuesta: un campo `actualizado` en los datos, y mostrar el máximo. |
| **D5** | **5.4 / 5.5**: ¿integraciones oficiales? | Sí para `@astrojs/rss`. Para el sitemap se puede evitar la dependencia con un endpoint propio de ~30 líneas, que además permite excluir rutas no publicadas con control fino. |
| **D6** | **5.9 og:image por página** | Requiere decidir enfoque antes de escribir código. Generarlas en build exige una dependencia de peso (`satori` + rasterizado). Alternativa barata: una imagen por astilla hecha a mano y la genérica para el resto. |
| **D7** | **Formulario de contacto**: ¿se construye? | Ver sección 6. Si la respuesta es sí, hay que elegir backend. |
| **D8** | Fecha de Astillas en mayúsculas: ¿bajarla a caja normal? | Es tocar el diseño, así que no se ha hecho. |

---

## 6. El asunto de `/contacto` (tarea 3.4)

Resultado adelantado de la auditoría, porque cambia el tamaño de la tarea:

**No hay formulario.** `/contacto` es una página de enlaces (email, X, LinkedIn) más una tabla de afiliación. Por tanto:

- El parámetro `?recurso=` **no existe ni se lee**. Los enlaces "Feedback" de `/recursos` construyen `/contacto?recurso=Minecraft%20Component%20Lists` y el parámetro se descarta en silencio.
- No hay confirmación tras el envío ni manejo de error, porque no hay envío.
- Lo que sí hay es accesible por teclado.

"Auditar" se convierte en "construir". Y un formulario en este stack obliga a elegir backend: Astro Actions con `prerender = false` sobre el Worker de Cloudflare, o un servicio externo. **Es la tarea más grande que queda en toda la lista.**

**Parche disponible sin construir nada:** que los enlaces "Feedback" abran el cliente de correo con el asunto ya relleno con el nombre del recurso. Cumple la intención de `?recurso=` en dos minutos.

---

## 7. Datos que faltan

Nada de esto se puede inventar. Para cada uno: primero la plantilla con datos de ejemplo evidentes y marcados, luego revisión, y solo entonces el contenido real.

| Tarea | Qué falta |
|---|---|
| 4.1 CV | El PDF. La "URL estable a la última versión" tiene coste **fuera del repo**: `public/_redirects` está vacío a propósito porque las redirecciones se gestionan desde el panel de Cloudflare. |
| 4.2 Docencia | Asignatura, titulación, curso académico, nivel, créditos u horas. |
| 4.3 Congresos | Autoría, título, congreso, tipo de contribución, lugar y fecha. |
| 4.4 Revisión por pares | Revista, año, número de revisiones. |
| 4.5 DIDACT.IA | Se conocen el código (PID2024-157674NB-I00) y el contrato FPI (PREP2024-002324). Faltan **IP, entidad financiadora y periodo**. |
| 5.1 Mapa Educraft | El DOI de Zenodo cuando el archivo esté subido. Mientras tanto: enlace directo a Drive sin acortador, formato, versión de Minecraft Education y peso. |
| 5.2 Cómo citar Educraft | Año y editor. Sin eso el generador de citas no lo considera citable, y por eso hoy es el único recurso publicado sin ese bloque. |

---

## 8. Mapa del código

Lo mínimo para orientarse sin volver a explorarlo todo.

```
src/
├── components/    Footer · Icon (wrapper de Lucide) · VoiceMarker (logo SVG)
├── content/astillas/            1 entrada, en Markdown
├── content.config.ts            content collection (Content Layer, glob loader)
├── data/recursos.json           los 5 recursos, con el flag published
├── layouts/BaseLayout.astro     head, SEO, nav de escritorio y móvil, footer
├── pages/                       index · sobre-mi · investigacion · recursos
│                                contacto · astillas · astillas/[...slug] · 404
└── styles/  global.css (restos de Tailwind) · tokens.css (el sistema real)
```

**El contenido es mixto.** Solo Astillas usa content collection. Recursos vive en un JSON. Todo lo demás —home, áreas, proyectos, publicaciones, sobre mí, contacto— está hardcodeado dentro de los `.astro`. Conviene saberlo antes de prometer que algo "sale de los datos": muchas veces no.

**Stack:** Astro 6.4.0, adapter de Cloudflare, Tailwind 4 vía plugin de Vite, `lucide-astro`. Despliegue con Wrangler sobre Cloudflare Workers. Cero integraciones de Astro activas: no hay sitemap, ni RSS, ni MDX.

---

## 9. Notas técnicas que conviene no perder

- **No hay `astro check` ni linter instalados.** La verificación de cada bloque solo puede apoyarse hoy en `npm run build`. Instalar `@astrojs/check` + `typescript` son dos dependencias de desarrollo; requiere autorización.
- **`npm install` reporta 13 vulnerabilidades** (1 baja, 12 altas), todas en el árbol de desarrollo. No se ha tocado nada. Merece una revisión aparte, fuera de estos bloques.
- **Bug de accesibilidad, anterior a este trabajo:** a 375 px la navegación es inalcanzable por teclado. El botón hamburguesa es un `<label>` (no recibe foco) que gobierna un `<input type="checkbox">` con `display: none` (tampoco). Verificado con `checkVisibility()`: cero enlaces de navegación alcanzables en móvil. Entra en 6.3, pero es más grave que un estado de foco: con teclado, en móvil, no se puede salir de la página.
- **El fondo real del sitio es `#FAFAF7`**, aunque `<body>` lleve `bg-white` de Tailwind: el CSS sin capa de `tokens.css` gana a `@layer utilities`. Importa para los cálculos de contraste.
- **Restos del rediseño, fuera de alcance:** `global.css` declara un tema de Tailwind (Inter, Space Grotesk, `brand-*`) que ya no se usa, y `BaseLayout` carga dos hojas de Google Fonts, una de ellas muerta. Limpiarlo aceleraría la carga, pero no lo pide ninguna tarea.
- **Las tarjetas de recursos conservan las ramas `status === 'upcoming'`** aunque hoy sean código muerto. Es lo que permite que reactivar un recurso sea cambiar un booleano.
