const translations = {
  es: {
    // Navigation
    "home": "Inicio",

    // Hero
    "hello": "Hola, soy",
    "backend_dev": "Desarrollador Backend",
    "hero_desc": "Especializado en crear soluciones robustas y escalables. Desarrollo de módulos, APIs e integraciones con Python y PostgreSQL.",
    "contact_me": "Contáctame",
    "view_projects": "Ver proyectos",

    // About
    "about": "Sobre mí",
    "about_title": "Desarrollador Backend con enfoque en Python",
    "about_desc1": "Desarrollador backend Python con experiencia en módulos Odoo, integraciones XML-RPC y bases de datos PostgreSQL. Inglés C1.",
    "about_desc2": "Formación en administración Linux (Red Hat) y automatización con Ansible. Enfocado en código limpio que resuelva problemas reales.",
    "highlight_python": "Python & Odoo",
    "highlight_python_desc": "Módulos personalizados",
    "highlight_db": "PostgreSQL",
    "highlight_db_desc": "Bases de datos",
    "highlight_linux": "Linux",
    "highlight_linux_desc": "Red Hat & Ansible",
    "highlight_english": "Inglés C1",
    "highlight_english_desc": "Avanzado",

    // Experience - Odoo
    "experience_nav": "Experiencia",
    "experience_title": "Experiencia Profesional",
    "exp_odoo_title": "Desarrollador Backend Odoo",
    "exp_odoo_subtitle": "Odoo 17/18 · Python · PostgreSQL · ORM · Owl · XML-RPC",
    "exp_odoo_desc": "Módulos en producción para múltiples clientes: reabastecimiento multi-almacén, postnómina con dashboard Owl e integración de datos en tiempo real.",
    "exp_odoo_1": "Reabastecimiento en cascada multi-almacén con sourcing parcial, stock mínimo configurable y transferencias batch",
    "exp_odoo_2": "Dashboard de postnómina con Owl: vistas múltiples, gauges SVG, tracking de dispersión y filtrado avanzado",
    "exp_odoo_3": "Integración con Watchdog: monitoreo de directorios, parseo XML/CSV/JSON y creación automática de registros vía XML-RPC",
    "exp_odoo_4": "Integración CFDI: timbrado automático, detección de bancos mexicanos, layouts bancarios y comprobantes SPEI",
    "exp_odoo_5": "Reportes QWeb avanzados: pólizas de nómina por departamento, facturación CFDI y dispersión multi-concepto",
    "exp_odoo_6": "Detección automática de contactos bancarios con normalización Unicode, extracción de RFC y matching difuso",
    "exp_odoo_7": "Override de procurement core (_run_pull) con resolución dinámica de almacenes y encadenamiento de movimientos",
    "exp_odoo_8": "API REST con endpoints de dashboard, reconciliación de pagos y generación batch de PDFs",
    "exp_odoo_9": "Migración de módulos Odoo v17 → v18, adaptando modelos, vistas y componentes Owl",
    "exp_odoo_10": "Herencia de 6+ modelos estándar (account.move, hr.payslip.run, stock.rule, etc.) con lógica personalizada",

    // Experience - Odoo Metrics
    "metric_odoo_1": "Multi-almacén",
    "metric_odoo_2": "Dashboard Owl",
    "metric_odoo_3": "API REST",
    "metric_odoo_4": "CFDI",
    "show_more": "Ver más",
    "show_less": "Ver menos",

    // Experience - Social Service
    "exp_ss_title": "Programador Full Stack — Servicio Social",
    "exp_ss_subtitle": "Biblioteca FCFM-UANL · Flask · SQL Server · 3 Sistemas en Producción",
    "exp_ss_desc": "3 sistemas para la biblioteca FCFM-UANL: préstamos, control de asistencia e inventario. Arquitectura dual de BD, dashboards y reportes. Desplegados en producción.",
    "exp_ss_1": "Sistema de préstamos: monitoreo en tiempo real, dashboard analítico con Chart.js y cierre automático de sesiones",
    "exp_ss_2": "Registro de entradas y salidas: autenticación bcrypt, control por roles y reportes de asistencia",
    "exp_ss_3": "Inventario de libros: app de escritorio con escaneo de código de barras y merge de bases de datos",
    "exp_ss_4": "Reportes PDF y Excel con formato avanzado y análisis de datos con Pandas",
    "exp_ss_5": "Arquitectura dual SQLite + SQL Server con queries parametrizadas",
    "exp_ss_6": "Importación masiva desde Excel/CSV con validación y resolución de conflictos",
    "exp_ss_7": "Despliegue en producción con Waitress y compilación a ejecutables con PyInstaller",

    // Experience - SS Metrics
    "metric_ss_1": "3 Sistemas",
    "metric_ss_2": "Dual DB",
    "metric_ss_3": "Dashboards",
    "metric_ss_4": "Producción",

    // Skills
    "skills": "Habilidades",
    "tech_skills": "Habilidades Técnicas",
    "backend_databases": "Backend & Bases de Datos",
    "web_development": "Desarrollo Web",
    "devops_tools": "DevOps & Herramientas",
    "programming_languages": "Lenguajes de Programación",

    // Projects
    "projects": "Proyectos Destacados",
    "projectsh": "Proyectos",
    "more_projects": "Todos mis Proyectos",
    "book_management": "Gestión de Libros de Acervo",
    "book_desc": "Sistema web con 13+ endpoints para gestión de préstamos, monitoreo de computadoras en tiempo real, dashboard analítico con Chart.js, reportes PDF/Excel, importación masiva y tareas programadas con APScheduler.",
    "attendance": "Registro de Entradas y Salidas",
    "attendance_desc": "Sistema de control de asistencias con autenticación bcrypt, roles Admin/Usuario, estadísticas por alumno (días, horas, promedios), reportes Excel/PDF y cierre automático de registros.",
    "timer-title": "Cronómetro para Cubo Rubik",
    "timer-desc": "Cronómetro web en React para speedcubing con inspección, estadísticas, visualización 2D y personalización.",
    "inventory": "Inventario de Libros",
    "inventory_desc": "App de escritorio con escaneo de código de barras, búsqueda con normalización Unicode, merge de múltiples bases de datos con detección de conflictos, historial de auditoría y exportación a 5 reportes Excel.",
    "portafolio": "Portafolio",
    "portafolio_desc": "Portafolio personal con todos mis proyectos y habilidades de programación.",
    "demo": "Demo",
    "code": "Código",

    // Education
    "education": "Formación",
    "degree": "Licenciatura en Ciencias Computacionales",
    "university": "Universidad Autónoma de Nuevo León, Facultad de Ciencias Físico Matemáticas",
    "certifications": "Certificaciones Técnicas",
    "rh124": "Red Hat System Administration I (RH124)",
    "rh124_desc": "Red Hat System Administration I",
    "rh134": "Red Hat System Administration II (RH134)",
    "rh134_desc": "Red Hat System Administration II",
    "rh294": "Red Hat Enterprise Linux Automation with Ansible (RH294)",
    "rh294_desc": "Red Hat Enterprise Linux Automation with Ansible",
    "view_certificate": "Ver Certificado",

    // Recognitions
    "recognitions": "Reconocimientos",
    "recommendation": "Reconocimiento por la elaboración de 3 sistemas para biblioteca",
    "recommendation_desc": "Reconocimiento por la elaboración de los sistemas: Entradas y Salidas, Registro de Libros de Acervo e Inventario de Libros.",
    "view_letter": "Ver Carta",
    "egel_award": "EGEL-CENEVAL",
    "egel_desc": "Testimonio de Desempeño Sobresaliente en el EGEL de Ciencias Computacionales, otorgado por CENEVAL.",

    // Testimonials
    "testimonials": "Testimonios",
    "testimonial1_text": "\"Jesús Garza demostró ser un elemento muy valioso por su gran responsabilidad y atención al detalle. Su iniciativa y compromiso superaron las expectativas, logrando mejoras significativas en los procesos internos de nuestra Biblioteca.\"",
    "testimonial1_name": "Dra. Aleida Magdalena Gil González",
    "testimonial1_position": "Subdirectora de Calidad e Innovación Educativa, FCFM - UANL",

    // Stats
    "stat_projects": "Proyectos Completados",
    "stat_modules": "Módulos Odoo",
    "stat_certs": "Certificaciones Red Hat",
    "stat_tech": "Tecnologías",

    // Status Badge
    "status_available": "Disponible para trabajar",

    // Contact
    "contact": "Contacto",
    "contact_title": "Trabajemos juntos",
    "contact_intro": "¿Tienes un proyecto en mente o quieres colaborar? No dudes en contactarme.",
    "email": "Email",
    "github": "GitHub",
    "name": "Nombre",
    "subject": "Asunto",
    "message": "Mensaje",
    "send_message": "Enviar Mensaje",

    // Portal
    "portal_title": "Explora mis proyectos",
    "portal_subtitle": "Haz click para entrar",

    // Footer
    "rights": `© ${new Date().getFullYear()} Jesús Gerardo Garza García. Todos los derechos reservados.`
  },

  en: {
    // Navigation
    "home": "Home",

    // Hero
    "hello": "Hello, I'm",
    "backend_dev": "Backend Developer",
    "hero_desc": "Specialized in building robust and scalable solutions. Module development, APIs, and integrations with Python and PostgreSQL.",
    "contact_me": "Contact Me",
    "view_projects": "View Projects",

    // About
    "about": "About Me",
    "about_title": "Backend Developer focused on Python",
    "about_desc1": "Python backend developer experienced in Odoo modules, XML-RPC integrations, and PostgreSQL databases. C1 English level.",
    "about_desc2": "Trained in Linux administration (Red Hat) and Ansible automation. Focused on clean code that solves real problems.",
    "highlight_python": "Python & Odoo",
    "highlight_python_desc": "Custom modules",
    "highlight_db": "PostgreSQL",
    "highlight_db_desc": "Databases",
    "highlight_linux": "Linux",
    "highlight_linux_desc": "Red Hat & Ansible",
    "highlight_english": "English C1",
    "highlight_english_desc": "Advanced",

    // Experience - Odoo
    "experience_nav": "Experience",
    "experience_title": "Professional Experience",
    "exp_odoo_title": "Odoo Backend Developer",
    "exp_odoo_subtitle": "Odoo 17/18 · Python · PostgreSQL · ORM · Owl · XML-RPC",
    "exp_odoo_desc": "Production modules for multiple clients: multi-warehouse replenishment, post-payroll Owl dashboard, and real-time data integration.",
    "exp_odoo_1": "Multi-warehouse cascading replenishment with partial sourcing, configurable minimum stock, and batch transfers",
    "exp_odoo_2": "Post-payroll Owl dashboard: multiple views, SVG gauges, dispersal tracking, and advanced filtering",
    "exp_odoo_3": "Watchdog integration: directory monitoring, XML/CSV/JSON parsing, and automatic record creation via XML-RPC",
    "exp_odoo_4": "CFDI integration: automatic invoice stamping, Mexican bank detection, bank layouts, and SPEI proofs",
    "exp_odoo_5": "Advanced QWeb reports: payroll policies by department, CFDI invoicing, and multi-concept dispersal",
    "exp_odoo_6": "Automatic bank contact detection with Unicode normalization, RFC extraction, and fuzzy matching",
    "exp_odoo_7": "Core procurement override (_run_pull) with dynamic warehouse resolution and movement chaining",
    "exp_odoo_8": "REST API with dashboard endpoints, payment reconciliation, and batch PDF generation",
    "exp_odoo_9": "Module migration Odoo v17 → v18, adapting models, views, and Owl components",
    "exp_odoo_10": "Inheritance of 6+ standard models (account.move, hr.payslip.run, stock.rule, etc.) with custom logic",

    // Experience - Odoo Metrics
    "metric_odoo_1": "Multi-warehouse",
    "metric_odoo_2": "Owl Dashboard",
    "metric_odoo_3": "REST API",
    "metric_odoo_4": "CFDI",
    "show_more": "Show more",
    "show_less": "Show less",

    // Experience - Social Service
    "exp_ss_title": "Full Stack Developer — Social Service",
    "exp_ss_subtitle": "FCFM-UANL Library · Flask · SQL Server · 3 Production Systems",
    "exp_ss_desc": "3 systems for the FCFM-UANL library: lending, attendance control, and inventory. Dual DB architecture, dashboards, and reports. Deployed in production.",
    "exp_ss_1": "Lending system: real-time monitoring, Chart.js analytics dashboard, and automatic session closure",
    "exp_ss_2": "Entry and exit register: bcrypt authentication, role-based access, and attendance reports",
    "exp_ss_3": "Book inventory: desktop app with barcode scanning and multi-database merge",
    "exp_ss_4": "PDF and Excel reports with advanced formatting and Pandas data analysis",
    "exp_ss_5": "Dual SQLite + SQL Server architecture with parameterized queries",
    "exp_ss_6": "Bulk import from Excel/CSV with validation and conflict resolution",
    "exp_ss_7": "Production deployment with Waitress and PyInstaller executable compilation",

    // Experience - SS Metrics
    "metric_ss_1": "3 Systems",
    "metric_ss_2": "Dual DB",
    "metric_ss_3": "Dashboards",
    "metric_ss_4": "Production",

    // Skills
    "skills": "Skills",
    "tech_skills": "Technical Skills",
    "backend_databases": "Backend & Databases",
    "web_development": "Web Development",
    "devops_tools": "DevOps & Tools",
    "programming_languages": "Programming Languages",

    // Projects
    "projects": "Featured Projects",
    "projectsh": "Projects",
    "more_projects": "All My Projects",
    "book_management": "Library Book Management",
    "book_desc": "Web system with 13+ endpoints for loan management, real-time computer monitoring, Chart.js analytics dashboard, PDF/Excel reports, bulk data import, and APScheduler background tasks.",
    "attendance": "Entry & Exit Register",
    "attendance_desc": "Attendance management system with bcrypt authentication, Admin/User roles, per-student statistics (days, hours, averages), Excel/PDF reports, and automatic record closure.",
    "timer-title": "Rubik's Cube Timer",
    "timer-desc": "React web timer for speedcubing with inspection, stats, 2D visualization, and customization.",
    "inventory": "Book Inventory",
    "inventory_desc": "Desktop app with barcode scanning, Unicode-normalized search, multi-database merge with conflict detection, audit trail, and export to 5 Excel reports.",
    "portafolio": "Portfolio",
    "portafolio_desc": "Personal portfolio with all my projects and programming skills.",
    "demo": "Demo",
    "code": "Code",

    // Education
    "education": "Education",
    "degree": "Bachelor's Degree in Computer Science",
    "university": "Autonomous University of Nuevo León (UANL), Faculty of Physical and Mathematical Sciences (FCFM)",
    "certifications": "Technical Certifications",
    "rh124": "Red Hat System Administration I (RH124)",
    "rh124_desc": "Red Hat System Administration I",
    "rh134": "Red Hat System Administration II (RH134)",
    "rh134_desc": "Red Hat System Administration II",
    "rh294": "Red Hat Enterprise Linux Automation with Ansible (RH294)",
    "rh294_desc": "Red Hat Enterprise Linux Automation with Ansible",
    "view_certificate": "View Certificate",

    // Recognitions
    "recognitions": "Recognitions",
    "recommendation": "Recognition for developing 3 library systems",
    "recommendation_desc": "Recognition for the development of the systems: Entry and Exit, Book Collection Register, and Book Inventory.",
    "view_letter": "View Letter",
    "egel_award": "EGEL-CENEVAL",
    "egel_desc": "Certificate of Outstanding Performance in the EGEL of Computer Sciences, awarded by CENEVAL.",

    // Testimonials
    "testimonials": "Testimonials",
    "testimonial1_text": "\"Jesús Garza proved to be a valuable asset due to his great responsibility and attention to detail. His initiative and commitment exceeded expectations, resulting in significant improvements in our library's internal processes.\"",
    "testimonial1_name": "Dr. Aleida Magdalena Gil González",
    "testimonial1_position": "Deputy Director of Educational Quality and Innovation, FCFM - UANL",

    // Stats
    "stat_projects": "Completed Projects",
    "stat_modules": "Odoo Modules",
    "stat_certs": "Red Hat Certifications",
    "stat_tech": "Technologies",

    // Status Badge
    "status_available": "Available for work",

    // Contact
    "contact": "Contact",
    "contact_title": "Let's work together",
    "contact_intro": "Have a project in mind or want to collaborate? Don't hesitate to reach out.",
    "email": "Email",
    "github": "GitHub",
    "name": "Name",
    "subject": "Subject",
    "message": "Message",
    "send_message": "Send Message",

    // Portal
    "portal_title": "Explore my projects",
    "portal_subtitle": "Click to enter",

    // Footer
    "rights": `© ${new Date().getFullYear()} Jesús Gerardo Garza García. All rights reserved.`
  }
};

function changeLanguage(lang) {
  localStorage.setItem('preferredLanguage', lang);

  document.querySelectorAll('.language-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Update portal tooltip
  const portalTrigger = document.getElementById('portalTrigger');
  if (portalTrigger) {
    portalTrigger.setAttribute('data-tooltip', lang === 'en' ? 'Explore projects' : 'Explorar proyectos');
  }

  // Update expand/collapse buttons
  document.querySelectorAll('.expand-toggle').forEach((btn) => {
    const span = btn.querySelector('span');
    const isExpanded = btn.classList.contains('active');
    if (isExpanded) {
      span.textContent = translations[lang]['show_less'];
    } else {
      span.textContent = translations[lang]['show_more'];
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const preferredLanguage = localStorage.getItem('preferredLanguage') || 'es';
  changeLanguage(preferredLanguage);

  document.querySelectorAll('.language-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      changeLanguage(btn.dataset.lang);
    });
  });
});
