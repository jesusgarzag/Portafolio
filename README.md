# Portafolio · Jesús Garza

![Estado](https://img.shields.io/badge/estado-activo-success) ![Versión](https://img.shields.io/badge/versión-v4%20sello-c63d24) ![HTML5](https://img.shields.io/badge/html5-e34f26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-f7df1e?logo=javascript&logoColor=000000) ![GSAP](https://img.shields.io/badge/animación-GSAP%203-0ae448) ![i18n](https://img.shields.io/badge/i18n-ES%2FEN-blue) ![Sin build](https://img.shields.io/badge/build-ninguno-4b5563)

Portafolio de **Jesús Gerardo Garza García**, desarrollador Odoo especializado en **localización mexicana**: CFDI 4.0 y sus complementos, nómina e IMSS, tesorería y conciliación bancaria, EDI e integraciones sobre Odoo 17, 18 y 19.

🔗 **En vivo:** https://jesusgarza.pages.dev/

## Concepto · v4 "sello"

El sitio está diseñado como un documento fiscal mexicano: un **CFDI timbrado**. Todo el lenguaje visual viene de la impresión de seguridad (billetes, actas, estados de cuenta):

- **Sello guilloché** generado en canvas: rosetas en capas que giran a distinta velocidad, con paralaje al puntero y un barrido de "timbrado" al cargar.
- **Microtexto** en anillos SVG, **folio fiscal** con UUID por visita y cadena original al pie.
- **Estado de cuenta** de módulos con sello de goma "TIMBRADO" que cae al hacer scroll.
- Formulario de contacto con forma de **solicitud de propuesta** (serie, folio, emisor, receptor) que se "timbra" al enviarse.
- Tipografía **Fraunces** (display), **Geist** (texto) y **JetBrains Mono** (datos); tema oscuro y claro con transición circular.

## Lo que hay dentro

- **Siete casos explicados como videos**, pero sin archivos de video: escenas SVG construidas en JavaScript y animadas con GSAP. Tienen capítulos, subtítulos, barra de progreso arrastrable, pantalla completa, atajos (`K`, `C`, `F`, `1`–`9`), se reproducen solas al quedar visibles, se encadenan cuando hay dos en pantalla y cambian de composición (horizontal o vertical) según el ancho. Respetan `prefers-reduced-motion`.
- **Un año en números**: gráfica de ritmo de entrega (clic en un mes filtra el catálogo) y las empresas que usan el código.
- **Catálogo de 91 módulos** como estado de cuenta: búsqueda, filtros por área y versión, orden por tamaño, renglones expandibles y acceso directo al caso en video y al código real.
- **Código real** de cada caso en un visor con resaltado de sintaxis.
- **Paleta de comandos** (`Ctrl+K`) y **consola** (`` ` ``) con comandos (`help`, `stats`, `modules v19`, `play imss`, `code cfdi`, `sudo hire`…).
- **Perfil**, formación, certificaciones, distribución del código por lenguaje y proyectos anteriores.
- **Contacto** vía Formspree, QR con tarjeta vCard y hora local de Monterrey.
- **ES/EN**, PWA con service worker *network-first*, accesible con teclado (trampa de foco en diálogos, `aria` en controles del reproductor) y con versión para imprimir.

## Datos

Las cifras salen del historial de git de los repositorios de los clientes, módulo por módulo, contando solo los módulos donde Jesús es autor principal (octubre de 2025 a septiembre de 2026):

| | |
|---|---|
| Módulos entregados | 91 (30 en Odoo 17, 23 en Odoo 18, 38 en Odoo 19) |
| Empresas | 22 |
| Líneas de Python | 52,201 (78,925 con XML, CSS y JS) |
| Pruebas automatizadas | 265 |

El catálogo vive en [`js/data.js`](js/data.js).

## Estructura

```
index.html              página única
404.html                página de error con el mismo sello
manifest.webmanifest    PWA
sw.js                   service worker (red primero, caché como respaldo)
css/
  base.css              tokens, temas claro/oscuro, texturas
  layout.css            header, hero, secciones, footer
  components.css        métricas, gráfica, estado de cuenta, perfil, formulario, diálogos
  player.css            reproductor de casos
  terminal.css          paleta de comandos y consola
  responsive.css        breakpoints y estilos de impresión
js/
  vendor/               GSAP 3 y plugins (ScrollTrigger, SplitText, DrawSVG, MotionPath, ScrambleText, CustomEase)
  data.js               catálogo de módulos, empresas y cifras
  i18n.js               ES/EN con data-i18n
  guilloche.js          sello guilloché, texturas y máscaras
  player.js             motor del reproductor (capítulos, subtítulos, autoplay, teclado)
  scenes/               una escena por caso: tesoreria, edi, cfdi, imss, ptu, banxico, sepomex
  main.js               orquestación: hero, métricas, gráfica, catálogo, diálogos, formulario
  terminal.js           consola
i18n/
  es.json · en.json     traducciones
assets/                 íconos, imagen OG, QR, vCard y certificados (incluye los CV en PDF)
tools/cv/               plantilla y script que generan los CV en PDF
```

## Ejecutar local

Sirve la carpeta con cualquier servidor estático (el `fetch` de las traducciones no funciona con `file://`):

```powershell
py -m http.server 8000
```

Luego abre http://localhost:8000. En macOS o Linux: `python3 -m http.server 8000`.

## Regenerar el CV

Los CV en PDF (`assets/certificados/cv_es.pdf` y `cv_en.pdf`) se generan desde [`tools/cv/cv.html`](tools/cv/cv.html) con Chromium. Carta, 2 páginas, fuentes incrustadas y texto seleccionable para los ATS:

```powershell
py -m pip install playwright
py -m playwright install chromium
py tools/cv/build.py
```

El script avisa si alguna página se desborda o si alguna fuente no cargó. Para cambiar cifras o textos edita el objeto `C` de la plantilla.

## Versiones

| Versión | Concepto | Dónde |
|---|---|---|
| v4 | sello · documento fiscal timbrado | `main` · https://jesusgarza.pages.dev/ |
| v3 | terminal interactiva | rama `terminal` · https://terminal.jesusgarza.pages.dev/ |
| v2 | minimalista | rama `minimalist` · https://minimalist.jesusgarza.pages.dev/ |
| v1 | gateway | rama `gateway` · https://gateway.jesusgarza.pages.dev/ |

## Contacto

- **Correo:** jesusgarzacia@hotmail.com
- **GitHub:** https://github.com/jesusgarzag
- **LinkedIn:** https://www.linkedin.com/in/jesusgarzacia

---

# Portfolio · Jesús Garza

Portfolio of **Jesús Gerardo Garza García**, an Odoo developer specialized in **Mexican localization**: CFDI 4.0 e-invoicing and its complements, payroll and social security (IMSS), treasury and bank reconciliation, EDI and integrations on Odoo 17, 18 and 19.

🔗 **Live:** https://jesusgarza.pages.dev/

## Concept · v4 "seal"

The site is designed as a Mexican tax document: a **stamped CFDI**. The visual language comes from security printing (banknotes, certificates, bank statements): a canvas **guilloché seal** with layered rotating rosettes, SVG **microtext** rings, a per-visit **tax folio** UUID, an **account statement** of modules with a rubber "STAMPED" seal, and a contact form shaped like a **proposal request** that gets stamped when sent. Type is Fraunces, Geist and JetBrains Mono, with dark and light themes.

## What's inside

- **Seven case studies explained like videos**, with no video files: SVG scenes built in JavaScript and animated with GSAP, with chapters, captions, a draggable timeline, fullscreen, shortcuts (`K`, `C`, `F`, `1`–`9`), autoplay when visible, chained playback, and horizontal or vertical layouts depending on width. They honor `prefers-reduced-motion`.
- **A year in numbers**: shipping cadence chart (click a month to filter the catalog) and the companies running the code.
- **Catalog of 91 modules** as an account statement: search, area and version filters, size sorting, expandable rows, and links to each video case and its real code.
- **Command palette** (`Ctrl+K`) and **console** (`` ` ``).
- **Contact** through Formspree, vCard QR code and Monterrey local time.
- **ES/EN**, network-first PWA, keyboard accessible, printable.

## Data

Numbers come from the clients' git history, module by module, counting only modules where Jesús is the main author (October 2025 to September 2026): **91 modules** (30 on Odoo 17, 23 on Odoo 18, 38 on Odoo 19), **22 companies**, **52,201 lines of Python** (78,925 including XML, CSS and JS) and **265 automated tests**.

## Run locally

```powershell
py -m http.server 8000
```

Then open http://localhost:8000 (on macOS or Linux: `python3 -m http.server 8000`).

## Rebuild the résumé

The PDF résumés are generated from [`tools/cv/cv.html`](tools/cv/cv.html) with Chromium (Letter, 2 pages, embedded fonts, ATS-readable text):

```powershell
py -m pip install playwright
py -m playwright install chromium
py tools/cv/build.py
```

## Contact

- **Email:** jesusgarzacia@hotmail.com
- **GitHub:** https://github.com/jesusgarzag
- **LinkedIn:** https://www.linkedin.com/in/jesusgarzacia
