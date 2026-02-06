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
    "about_desc1": "Soy un desarrollador backend especializado en Python con experiencia en el desarrollo de módulos personalizados para Odoo, integraciones mediante XML-RPC, automatización de procesos y manejo de bases de datos con PostgreSQL. Mi nivel de inglés es C1, lo que me permite colaborar eficazmente en entornos internacionales.",
    "about_desc2": "Cuento con formación en administración de sistemas Linux (Red Hat) y automatización con Ansible. Mi enfoque se centra en escribir código limpio, eficiente y mantenible que resuelva problemas reales de negocio.",
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
    "exp_odoo_desc": "Desarrollo de módulos de producción para múltiples clientes, incluyendo un sistema de reabastecimiento en cascada multi-almacén, un módulo de postnómina con dashboard interactivo Owl, y un sistema de integración de datos en tiempo real con Watchdog y XML-RPC.",
    "exp_odoo_1": "Módulo de reabastecimiento en cascada: sourcing parcial desde 3 almacenes priorizados, stock mínimo configurable, transferencias consolidadas batch y notificaciones BUS en tiempo real",
    "exp_odoo_2": "Dashboard interactivo de postnómina con componente Owl: 3 modos de vista, gauges SVG, tracking de dispersión en 6 pasos, filtrado avanzado y paginación",
    "exp_odoo_3": "Sistema de integración con Watchdog: monitoreo de directorios en tiempo real, parseo de XML/CSV/JSON, creación automática de clientes, productos y facturas en Odoo vía XML-RPC",
    "exp_odoo_4": "Integración CFDI: timbrado automático de facturas, detección inteligente de bancos mexicanos con 8 patrones regex, generación de layouts CELEX/Banregio y comprobantes SPEI en PDF",
    "exp_odoo_5": "Reportes avanzados: Póliza con Conceptos (60+ conceptos de nómina agrupados por departamento/sucursal), reportes QWeb de facturación con CFDI, y reportes de dispersión multi-concepto",
    "exp_odoo_6": "Detección automática de contactos bancarios: normalización Unicode, extracción de RFC, matching difuso de nombres y 8 patrones regex para números de cuenta/CLABE",
    "exp_odoo_7": "Override de procurement core (_run_pull): algoritmo de cascada con resolución dinámica de almacenes, encadenamiento de movimientos en tránsito y gestión de orderpoints",
    "exp_odoo_8": "API REST personalizada con 3 endpoints para dashboard, reconciliación de pagos con matching por UUID/folio, y generación batch de PDFs de comprobantes",
    "exp_odoo_9": "Migración de módulos entre versiones de Odoo (v17 → v18), adaptando modelos, vistas, controladores y componentes Owl",
    "exp_odoo_10": "Herencia de 6+ modelos estándar (account.move, hr.payslip.run, stock.rule, account.payment, bank.statement.line, stock.picking) con lógica de negocio personalizada",

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
    "exp_ss_desc": "Diseño, desarrollo e implementación de 3 sistemas completos para la biblioteca de la FCFM-UANL, digitalizando procesos manuales. Incluye arquitectura dual de bases de datos (SQLite + SQL Server), autenticación con bcrypt, dashboards analíticos con Chart.js, generación de reportes PDF/Excel, y tareas programadas en segundo plano. Sistemas compilados como ejecutables (.exe) y desplegados en producción.",
    "exp_ss_1": "Sistema de préstamos de libros y computadoras: 13+ endpoints, monitoreo en tiempo real con AJAX, dashboard analítico con Chart.js, y cierre automático de sesiones con APScheduler",
    "exp_ss_2": "Sistema de registro de entradas y salidas: autenticación con bcrypt, control de acceso por roles (Admin/Usuario), paginación avanzada y recuperación de contraseña con preguntas de seguridad",
    "exp_ss_3": "Sistema de inventario de libros: app de escritorio con Tkinter, escaneo de código de barras, búsqueda con normalización Unicode, merge de múltiples bases de datos con detección de conflictos",
    "exp_ss_4": "Generación de reportes profesionales en PDF (ReportLab) y Excel (openpyxl/xlsxwriter) con formato avanzado, gráficos y análisis de datos con Pandas",
    "exp_ss_5": "Arquitectura dual de bases de datos (SQLite + SQL Server) con la misma lógica de aplicación, queries parametrizadas y prevención de SQL injection",
    "exp_ss_6": "Importación masiva de datos desde Excel/CSV con validación, mapeo de columnas y resolución de conflictos",
    "exp_ss_7": "Despliegue en producción con Waitress (WSGI), compilación a ejecutables con PyInstaller, y documentación completa de usuario y código",

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
    "rights": "© 2025 Jesús Gerardo Garza García. Todos los derechos reservados."
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
    "about_desc1": "I'm a backend developer specialized in Python with experience building custom Odoo modules, XML-RPC integrations, process automation, and database management with PostgreSQL. My English level is C1, enabling effective collaboration in international environments.",
    "about_desc2": "I have training in Linux system administration (Red Hat) and automation with Ansible. My approach focuses on writing clean, efficient, and maintainable code that solves real business problems.",
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
    "exp_odoo_desc": "Development of production modules for multiple clients, including a multi-warehouse cascading replenishment system, a post-payroll module with interactive Owl dashboard, and a real-time data integration system with Watchdog and XML-RPC.",
    "exp_odoo_1": "Cascading replenishment module: partial sourcing from 3 prioritized warehouses, configurable minimum stock, consolidated batch transfers, and real-time BUS notifications",
    "exp_odoo_2": "Interactive post-payroll dashboard with Owl component: 3 view modes, SVG gauges, 6-step dispersal tracking, advanced filtering, and pagination",
    "exp_odoo_3": "Watchdog integration system: real-time directory monitoring, XML/CSV/JSON parsing, automatic creation of customers, products, and invoices in Odoo via XML-RPC",
    "exp_odoo_4": "CFDI integration: automatic invoice stamping, smart Mexican bank detection with 8 regex patterns, CELEX/Banregio layout generation, and SPEI PDF payment proofs",
    "exp_odoo_5": "Advanced reports: Poliza con Conceptos (60+ payroll concepts grouped by department/branch), QWeb invoice reports with CFDI, and multi-concept dispersal reports",
    "exp_odoo_6": "Automatic bank contact detection: Unicode normalization, RFC extraction, fuzzy name matching, and 8 regex patterns for account/CLABE number detection",
    "exp_odoo_7": "Core procurement override (_run_pull): cascade algorithm with dynamic warehouse resolution, transit movement chaining, and orderpoint management",
    "exp_odoo_8": "Custom REST API with 3 dashboard endpoints, payment reconciliation with UUID/folio matching, and batch PDF receipt generation",
    "exp_odoo_9": "Module migration across Odoo versions (v17 → v18), adapting models, views, controllers, and Owl components",
    "exp_odoo_10": "Inheritance of 6+ standard models (account.move, hr.payslip.run, stock.rule, account.payment, bank.statement.line, stock.picking) with custom business logic",

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
    "exp_ss_desc": "Design, development, and deployment of 3 complete systems for the FCFM-UANL library, digitizing manual processes. Includes dual database architecture (SQLite + SQL Server), bcrypt authentication, Chart.js analytics dashboards, PDF/Excel report generation, and background scheduled tasks. Systems compiled as executables (.exe) and deployed in production.",
    "exp_ss_1": "Book and computer lending system: 13+ endpoints, real-time monitoring with AJAX, Chart.js analytics dashboard, and automatic session closure with APScheduler",
    "exp_ss_2": "Entry and exit registration system: bcrypt authentication, role-based access control (Admin/User), advanced pagination, and password recovery with security questions",
    "exp_ss_3": "Book inventory system: Tkinter desktop app, barcode scanning, Unicode-normalized search, multi-database merge with conflict detection",
    "exp_ss_4": "Professional PDF (ReportLab) and Excel (openpyxl/xlsxwriter) report generation with advanced formatting, charts, and Pandas data analysis",
    "exp_ss_5": "Dual database architecture (SQLite + SQL Server) with shared application logic, parameterized queries, and SQL injection prevention",
    "exp_ss_6": "Bulk data import from Excel/CSV with validation, column mapping, and conflict resolution",
    "exp_ss_7": "Production deployment with Waitress (WSGI), PyInstaller executable compilation, and comprehensive user and code documentation",

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
    "rights": "© 2025 Jesús Gerardo Garza García. All rights reserved."
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
