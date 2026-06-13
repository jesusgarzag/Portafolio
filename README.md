# Portafolio · Jesús Garza

![Estado](https://img.shields.io/badge/estado-activo-success) ![HTML5](https://img.shields.io/badge/html5-e34f26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-f7df1e?logo=javascript&logoColor=000000) ![i18n](https://img.shields.io/badge/i18n-ES%2FEN-blue) ![Sin build](https://img.shields.io/badge/build-ninguno-4b5563)

Portafolio web personal de **Jesús Garza**, desarrollador backend especializado en **Odoo** (Python, PostgreSQL, OWL, CFDI). La interfaz es una **sesión de terminal interactiva**: tipografía monoespaciada, prompts por sección, status bar tipo vim y un puñado de "programas" que se abren como overlays. Sin frameworks ni build — solo HTML, CSS y JS.

🔗 **En vivo:** https://jesusgarza.pages.dev/

## Concepto

Todo el sitio simula un entorno de terminal. La navegación son comandos (`cat about.md`, `ls -la modules/`, `man certifications`) y cada interacción refuerza el tema:

- **Command palette** (`Ctrl+K`) — busca y ejecuta cualquier acción.
- **Shell interactiva** en el hero — escribe comandos reales (`help`, `ls`, `neofetch`, `sudo hire`, `theme`, `clear`…) y responde en pantalla.
- **8 colorschemes** (terminal-dark, light, nord, gruvbox, dracula, tokyo-night, catppuccin, solarized) + toggle claro/oscuro.
- **`vim`** — abre el código real de cada módulo Odoo desde la lista (clic en una fila de `ls`).
- **`htop`** — los 10 clientes atendidos como procesos del sistema.
- **`./build --all`** — log de CI animado que "compila y testea" los 23 módulos.
- **`man jesus`**, **`./hire`** (info pack para reclutadores), **historial de comandos**, **cheatsheet** (`?`).
- **Cubo de Rubik 2×2 / 3×3** funcional con timer, PB y solver, arrastrable en 3D.
- **i18n ES/EN** vía JSON, reloj de Monterrey en vivo, heatmap de contribuciones de GitHub.
- Easter eggs: **código Konami → modo CRT**, logo ×5 → dev panel, `fortune` aleatorio al cargar.

## Contenido

- **Sobre mí** y estadísticas (empresas, módulos, certificaciones).
- **Experiencia profesional** como árbol de directorios (`tree experience/`).
- **23+ módulos Odoo** en producción para 10 empresas, agrupados por área funcional, con casos de éxito.
- **Proyectos** destacados, **habilidades**, **formación** y **contacto** (formulario vía Formspree).

## Estructura

```
index.html            página única (terminal + overlays)
404.html              fallback de routing
manifest.webmanifest  PWA
sw.js                 service worker (shell cache-first)
css/
  base.css            tokens de diseño + temas
  terminal.css        prompts, palette, overlays, rubik
  layout.css          topbar, sidebar, hero, secciones
  components.css      ls, tree, skills, vim, htop, formulario
  responsive.css      breakpoints
js/
  i18n.js             cambio de idioma ES/EN
  terminal.js         palette, overlays, rubik, build log, vim
  main.js             tema, scroll spy, reveals, contadores, GitHub
i18n/
  es.json · en.json   traducciones
assets/               certificados, demo, imágenes
```

## Ejecutar local

Abre [index.html](index.html) en el navegador. No requiere dependencias ni build.
Para que el `fetch` de los JSON de i18n funcione, sirve la carpeta con un servidor estático, p. ej.:

```bash
python -m http.server 8000   # luego abre http://localhost:8000
```

## Contacto

- **Email:** jesusgarzacia@hotmail.com
- **GitHub:** https://github.com/jesusgarzag
- **LinkedIn:** https://www.linkedin.com/in/jesusgarzacia

---

# Portfolio · Jesús Garza

Personal portfolio of **Jesús Garza**, a backend developer specialized in **Odoo** (Python, PostgreSQL, OWL, CFDI). The whole UI is an **interactive terminal session**: monospace type, per-section prompts, a vim-style status bar, and a handful of "programs" that open as overlays. No frameworks, no build step — just HTML, CSS and JS.

🔗 **Live:** https://jesusgarza.pages.dev/

## Concept

The site mimics a terminal environment. Navigation is commands (`cat about.md`, `ls -la modules/`, `man certifications`) and every interaction reinforces the theme:

- **Command palette** (`Ctrl+K`) to search and run any action.
- **Interactive shell** in the hero — type real commands (`help`, `ls`, `neofetch`, `sudo hire`, `theme`, `clear`…).
- **8 colorschemes** + light/dark toggle.
- **`vim`** opens the real code of each Odoo module from the list.
- **`htop`** shows the 10 clients as system processes.
- **`./build --all`** animated CI log that "builds and tests" all 23 modules.
- **`man jesus`**, **`./hire`** recruiter info pack, command history, cheatsheet (`?`).
- Functional **Rubik's cube** (2×2 / 3×3) with timer, PB and solver.
- **ES/EN i18n**, live Monterrey clock, GitHub contributions heatmap.
- Easter eggs: **Konami code → CRT mode**, logo ×5 → dev panel, random `fortune` on load.

## Run locally

Open [index.html](index.html) in your browser. No dependencies. Serve the folder with any static server so the i18n JSON `fetch` works:

```bash
python -m http.server 8000
```

## Contact

- **Email:** jesusgarzacia@hotmail.com
- **GitHub:** https://github.com/jesusgarzag
- **LinkedIn:** https://www.linkedin.com/in/jesusgarzacia
