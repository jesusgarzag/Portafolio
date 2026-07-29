from pathlib import Path

import fitz


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "cv_es_2026.pdf"

A4_WIDTH = 595.276
A4_HEIGHT = 841.89
MARGIN = 40
CONTENT_WIDTH = A4_WIDTH - (MARGIN * 2)

FONT_REGULAR = Path(r"C:\Windows\Fonts\segoeui.ttf")
FONT_SEMIBOLD = Path(r"C:\Windows\Fonts\seguisb.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\segoeuib.ttf")

NAVY = (20 / 255, 35 / 255, 58 / 255)
NAVY_2 = (29 / 255, 50 / 255, 78 / 255)
TEAL = (0 / 255, 139 / 255, 139 / 255)
TEAL_LIGHT = (226 / 255, 244 / 255, 243 / 255)
TEXT = (35 / 255, 45 / 255, 55 / 255)
MUTED = (91 / 255, 104 / 255, 117 / 255)
LIGHT = (244 / 255, 247 / 255, 249 / 255)
LINE = (216 / 255, 224 / 255, 231 / 255)
WHITE = (1, 1, 1)


class CV:
    def __init__(self):
        self.doc = fitz.open()
        self.fonts = {
            "regular": fitz.Font(fontfile=str(FONT_REGULAR)),
            "semibold": fitz.Font(fontfile=str(FONT_SEMIBOLD)),
            "bold": fitz.Font(fontfile=str(FONT_BOLD)),
        }
        self.page = None

    def new_page(self):
        self.page = self.doc.new_page(width=A4_WIDTH, height=A4_HEIGHT)
        self.page.insert_font(fontname="regular", fontfile=str(FONT_REGULAR))
        self.page.insert_font(fontname="semibold", fontfile=str(FONT_SEMIBOLD))
        self.page.insert_font(fontname="bold", fontfile=str(FONT_BOLD))
        return self.page

    def width(self, text, size, font="regular"):
        return self.fonts[font].text_length(text, fontsize=size)

    def text(self, x, y, value, size=9, color=TEXT, font="regular"):
        self.page.insert_text(
            (x, y),
            value,
            fontname=font,
            fontsize=size,
            color=color,
            overlay=True,
        )
        return self.width(value, size, font)

    def link_text(self, x, y, value, uri, size=8.1, color=WHITE, font="regular"):
        width = self.text(x, y, value, size=size, color=color, font=font)
        self.page.insert_link(
            {
                "kind": fitz.LINK_URI,
                "from": fitz.Rect(x, y - size, x + width, y + 2),
                "uri": uri,
            }
        )
        return width

    def wrap(self, value, width, size=9, font="regular"):
        paragraphs = value.splitlines() or [""]
        lines = []
        for paragraph in paragraphs:
            words = paragraph.split()
            if not words:
                lines.append("")
                continue
            current = words[0]
            for word in words[1:]:
                candidate = f"{current} {word}"
                if self.width(candidate, size, font) <= width:
                    current = candidate
                else:
                    lines.append(current)
                    current = word
            lines.append(current)
        return lines

    def paragraph(
        self,
        x,
        y,
        width,
        value,
        size=9,
        line_height=11.5,
        color=TEXT,
        font="regular",
    ):
        for line in self.wrap(value, width, size, font):
            self.text(x, y, line, size=size, color=color, font=font)
            y += line_height
        return y

    def section(self, title, y):
        self.page.draw_rect(
            fitz.Rect(MARGIN, y - 9, MARGIN + 4, y + 4),
            color=TEAL,
            fill=TEAL,
            overlay=True,
        )
        self.text(MARGIN + 12, y, title.upper(), size=10.2, color=NAVY, font="bold")
        title_width = self.width(title.upper(), 10.2, "bold")
        self.page.draw_line(
            fitz.Point(MARGIN + 20 + title_width, y - 3),
            fitz.Point(A4_WIDTH - MARGIN, y - 3),
            color=LINE,
            width=0.8,
            overlay=True,
        )
        return y + 18

    def bullet(self, x, y, width, value, size=8.6, line_height=11.2):
        lines = self.wrap(value, width - 14, size)
        self.page.draw_circle(
            fitz.Point(x + 3, y - 3.2),
            1.8,
            color=TEAL,
            fill=TEAL,
            overlay=True,
        )
        for line in lines:
            self.text(x + 13, y, line, size=size, color=TEXT)
            y += line_height
        return y + 2

    def label_value(self, x, y, label, value, width, size=8.4):
        label_width = self.text(x, y, label, size=size, color=NAVY, font="semibold")
        return self.paragraph(
            x + label_width + 5,
            y,
            width - label_width - 5,
            value,
            size=size,
            line_height=10.8,
            color=TEXT,
        )

    def footer(self, page_number):
        self.page.draw_line(
            fitz.Point(MARGIN, A4_HEIGHT - 28),
            fitz.Point(A4_WIDTH - MARGIN, A4_HEIGHT - 28),
            color=LINE,
            width=0.7,
            overlay=True,
        )
        self.text(
            MARGIN,
            A4_HEIGHT - 14,
            "Jesús Gerardo Garza García · CV actualizado en julio de 2026",
            size=7.2,
            color=MUTED,
        )
        page_label = f"{page_number} / 2"
        self.text(
            A4_WIDTH - MARGIN - self.width(page_label, 7.2),
            A4_HEIGHT - 14,
            page_label,
            size=7.2,
            color=MUTED,
        )

    def primary_header(self):
        self.page.draw_rect(
            fitz.Rect(0, 0, A4_WIDTH, 120),
            color=NAVY,
            fill=NAVY,
            overlay=True,
        )
        self.page.draw_rect(
            fitz.Rect(0, 116, A4_WIDTH, 120),
            color=TEAL,
            fill=TEAL,
            overlay=True,
        )
        self.text(
            MARGIN,
            42,
            "JESÚS GERARDO GARZA GARCÍA",
            size=22,
            color=WHITE,
            font="bold",
        )
        self.text(
            MARGIN,
            67,
            "Desarrollador Backend · Especialista Odoo 17/18/19",
            size=11.4,
            color=(210 / 255, 235 / 255, 239 / 255),
            font="semibold",
        )

        y = 91
        x = MARGIN
        x += self.text(x, y, "Monterrey, Nuevo León, México", size=8.1, color=WHITE)
        x += self.text(x, y, "   ·   ", size=8.1, color=(150 / 255, 184 / 255, 194 / 255))
        x += self.link_text(
            x,
            y,
            "jesusgarzacia@hotmail.com",
            "mailto:jesusgarzacia@hotmail.com",
        )
        x += self.text(x, y, "   ·   ", size=8.1, color=(150 / 255, 184 / 255, 194 / 255))
        self.link_text(
            x,
            y,
            "jesusgarza.pages.dev",
            "https://jesusgarza.pages.dev/",
        )

        y = 108
        x = MARGIN
        x += self.link_text(
            x,
            y,
            "linkedin.com/in/jesusgarzacia",
            "https://www.linkedin.com/in/jesusgarzacia",
            color=(210 / 255, 235 / 255, 239 / 255),
        )
        x += self.text(x, y, "   ·   ", size=8.1, color=(150 / 255, 184 / 255, 194 / 255))
        self.link_text(
            x,
            y,
            "github.com/jesusgarzag",
            "https://github.com/jesusgarzag",
            color=(210 / 255, 235 / 255, 239 / 255),
        )

    def continuation_header(self):
        self.page.draw_rect(
            fitz.Rect(0, 0, A4_WIDTH, 58),
            color=NAVY,
            fill=NAVY,
            overlay=True,
        )
        self.page.draw_rect(
            fitz.Rect(0, 55, A4_WIDTH, 58),
            color=TEAL,
            fill=TEAL,
            overlay=True,
        )
        self.text(
            MARGIN,
            29,
            "JESÚS GERARDO GARZA GARCÍA",
            size=13.2,
            color=WHITE,
            font="bold",
        )
        self.text(
            MARGIN,
            46,
            "Desarrollador Backend · Especialista Odoo 17/18/19",
            size=8.3,
            color=(210 / 255, 235 / 255, 239 / 255),
            font="semibold",
        )
        self.link_text(
            A4_WIDTH - MARGIN - self.width("jesusgarza.pages.dev", 8.1),
            36,
            "jesusgarza.pages.dev",
            "https://jesusgarza.pages.dev/",
            size=8.1,
        )

    def metric_card(self, x, y, width, number, label):
        self.page.draw_rect(
            fitz.Rect(x, y, x + width, y + 47),
            color=LINE,
            fill=LIGHT,
            width=0.8,
            overlay=True,
        )
        number_width = self.width(number, 15.2, "bold")
        self.text(
            x + (width - number_width) / 2,
            y + 20,
            number,
            size=15.2,
            color=TEAL,
            font="bold",
        )
        label_width = self.width(label, 7.3, "semibold")
        self.text(
            x + (width - label_width) / 2,
            y + 36,
            label,
            size=7.3,
            color=MUTED,
            font="semibold",
        )

    def job_header(self, y, title, company, dates):
        self.text(MARGIN, y, title, size=9.8, color=NAVY, font="bold")
        date_width = self.width(dates, 8.2, "semibold")
        self.text(
            A4_WIDTH - MARGIN - date_width,
            y,
            dates,
            size=8.2,
            color=TEAL,
            font="semibold",
        )
        self.text(MARGIN, y + 15, company, size=8.4, color=MUTED, font="semibold")
        return y + 31

    def module_group(self, y, title, count, text):
        self.text(MARGIN, y, title, size=8.7, color=NAVY, font="bold")
        count_text = f"  ·  {count}"
        self.text(
            MARGIN + self.width(title, 8.7, "bold"),
            y,
            count_text,
            size=7.8,
            color=TEAL,
            font="semibold",
        )
        y += 13
        y = self.paragraph(
            MARGIN,
            y,
            CONTENT_WIDTH,
            text,
            size=7.8,
            line_height=10.1,
            color=TEXT,
        )
        return y + 6

    def build_page_one(self):
        self.new_page()
        self.primary_header()

        y = self.section("Perfil profesional", 145)
        profile = (
            "Licenciado en Ciencias Computacionales y desarrollador backend especializado en "
            "Odoo para empresas mexicanas. Diseño módulos, automatizaciones e integraciones "
            "orientadas a contabilidad, CFDI 4.0, SAT, pedimentos, nómina, inventario y EDI. "
            "Trabajo sobre Odoo 17, 18 y 19 con Python, PostgreSQL, ORM, Owl, QWeb, REST y XML-RPC."
        )
        y = self.paragraph(
            MARGIN,
            y,
            CONTENT_WIDTH,
            profile,
            size=9.15,
            line_height=12.2,
        )

        y += 9
        gap = 8
        card_width = (CONTENT_WIDTH - gap * 3) / 4
        cards = [
            ("23+", "MÓDULOS ODOO"),
            ("10", "EMPRESAS"),
            ("17–19", "VERSIONES ODOO"),
            ("6", "ÁREAS FUNCIONALES"),
        ]
        for index, (number, label) in enumerate(cards):
            self.metric_card(MARGIN + index * (card_width + gap), y, card_width, number, label)
        y += 70

        y = self.section("Experiencia profesional", y)
        y = self.job_header(
            y,
            "Consultor Técnico / Desarrollador Odoo",
            "Integra Informática Administrativa S.A. de C.V.",
            "Ago 2025 — Presente",
        )
        bullets = [
            "Desarrollo y mantenimiento de 23+ módulos en producción para 10 empresas, cubriendo contabilidad, fiscal, nómina, inventario, aduanas, compras, ventas e integraciones.",
            "Implementación de cumplimiento mexicano: CFDI 4.0 y Pagos20, DIOT, XML del SAT, tipos de cambio Banxico/DOF, pedimentos, IMSS, INFONAVIT, FONACOT, SUA y PTU.",
            "Automatización de reabastecimiento multi-almacén, trazabilidad histórica por ubicación, recepción masiva de lotes y flujos compra → proyecto.",
            "Dashboards y reportes con Owl, QWeb, openpyxl y xlsxwriter; generación dinámica de columnas, PDFs batch y análisis de dispersión de nómina.",
            "Integraciones REST, XML-RPC y webhooks con idempotencia; protocolo de avisos EDI 944/945/947/852 entre Odoo y middleware SAP/AS2.",
            "Migración de módulos entre Odoo 17, 18 y 19, adaptación de vistas y componentes Owl, overrides del core y soporte a incidencias productivas.",
        ]
        for item in bullets:
            y = self.bullet(MARGIN + 2, y, CONTENT_WIDTH - 2, item)
        y = self.label_value(
            MARGIN,
            y + 1,
            "Stack:",
            "Python · PostgreSQL · Odoo ORM · Owl · QWeb · XML-RPC · REST · CFDI · Docker · Git",
            CONTENT_WIDTH,
            size=8.1,
        )

        y += 12
        y = self.job_header(
            y,
            "Programador Full Stack",
            "Biblioteca FCFM–UANL · Contrato por proyecto",
            "Ene 2025 — Jun 2025",
        )
        bullets = [
            "Desarrollo y puesta en producción de tres sistemas: gestión de préstamos, control de entradas/salidas e inventario bibliográfico.",
            "Aplicaciones Flask con autenticación bcrypt, roles, 13+ endpoints, monitoreo en tiempo real, dashboards Chart.js y reportes PDF/Excel.",
            "Aplicación de escritorio con Tkinter, escaneo de códigos de barras, normalización Unicode, fusión de bases y cinco reportes Excel.",
            "Arquitectura SQLite + SQL Server, importación masiva validada, análisis con Pandas y despliegue con Waitress/PyInstaller.",
        ]
        for item in bullets:
            y = self.bullet(MARGIN + 2, y, CONTENT_WIDTH - 2, item)

        y += 8
        y = self.section("Competencias técnicas", y)
        skills = [
            ("Odoo:", "17/18/19 · ORM · Owl · QWeb · XML-RPC · REST · l10n_mx_edi · hr_payroll · stock · account"),
            ("Backend y datos:", "Python · Flask · PostgreSQL · SQL Server · SQLite · Pandas · openpyxl · xlsxwriter"),
            ("Web:", "JavaScript · React · HTML5 · CSS3 · Chart.js · APIs y webhooks"),
            ("DevOps:", "Docker · Git/GitHub · Linux/Red Hat · Ansible · Waitress · PyInstaller"),
            ("Idiomas:", "Español nativo · Inglés avanzado"),
        ]
        for label, value in skills:
            y = self.label_value(MARGIN, y, label, value, CONTENT_WIDTH, size=8.2) + 2
        y = self.label_value(
            MARGIN,
            y + 2,
            "Empresas:",
            "Avalia · Dimex · Casa Guerra · Cosesa · Forrajera Elizondo · Recavisa · Interenter · FGH · Invent · Ikigai",
            CONTENT_WIDTH,
            size=8.2,
        )

        self.footer(1)

    def build_page_two(self):
        self.new_page()
        self.continuation_header()

        y = self.section("Portafolio de soluciones Odoo", 83)
        y = self.paragraph(
            MARGIN,
            y,
            CONTENT_WIDTH,
            "23 módulos en producción para 10 empresas, organizados en seis áreas funcionales:",
            size=8.4,
            line_height=10.8,
            color=MUTED,
        )
        y += 5

        groups = [
            (
                "Contabilidad y cumplimiento fiscal",
                "9 módulos",
                "Suite de 9 reportes financieros; conciliación bancaria; cartera vencida; corrección fiscal de anticipos DIOT; reconocimiento automático de IVA; REP SAT/CFDI 4.0 Pagos20; tipo de cambio Banxico/DOF; reportes SAT XML; cancelación intercompañía.",
            ),
            (
                "Nómina y recursos humanos",
                "6 módulos",
                "Gestión de vacaciones; reportes de nómina auto-configurables; integración nómina–caja de ahorro; cálculo y exportación IMSS/SUA; cálculo de PTU; timbrado de nómina en paralelo.",
            ),
            (
                "Inventario, almacén y aduanas",
                "4 módulos",
                "Trazabilidad histórica multi-ubicación; control de pedimentos en CFDI; corrección rápida de lotes; recepción masiva de series y lotes.",
            ),
            (
                "Ventas y compras",
                "2 módulos",
                "Catálogo inteligente para +35,000 productos; automatización de compras a proyectos con cadena PO → Picking → Moves → confirmación.",
            ),
            (
                "Integraciones y API",
                "1 módulo",
                "Avisos EDI 944/945/947/852 hacia middleware SAP/AS2 mediante webhooks, token, idempotencia, bitácora y reintentos por cron.",
            ),
            (
                "Herramientas UI/UX",
                "1 módulo",
                "Restauración de columnas opcionales en órdenes mediante patches de componentes Owl sobre Odoo 19.",
            ),
        ]
        for title, count, value in groups:
            y = self.module_group(y, title, count, value)

        y += 2
        y = self.section("Resultados seleccionados", y)
        results = [
            ("−70%", "en tiempo de conciliación bancaria diaria, sin saldos vacíos al cierre y con trazabilidad completa."),
            ("0", "incidencias críticas de pedimentos después del despliegue del control aduanal."),
            ("0", "avisos EDI duplicados gracias a idempotencia y reintento automático de fallos transitorios."),
            ("Horas → minutos", "para generar reportes de nómina, sin ajustes manuales de formato en operación regular."),
        ]
        column_gap = 14
        result_width = (CONTENT_WIDTH - column_gap) / 2
        result_y = y
        for index, (metric, description) in enumerate(results):
            column = index % 2
            row = index // 2
            x = MARGIN + column * (result_width + column_gap)
            top = result_y + row * 43
            self.page.draw_rect(
                fitz.Rect(x, top - 9, x + result_width, top + 28),
                color=LINE,
                fill=LIGHT,
                width=0.7,
                overlay=True,
            )
            metric_width = self.text(
                x + 9,
                top + 5,
                metric,
                size=9.2,
                color=TEAL,
                font="bold",
            )
            self.paragraph(
                x + 13 + metric_width,
                top + 5,
                result_width - metric_width - 22,
                description,
                size=7.1,
                line_height=8.8,
                color=TEXT,
            )
        y = result_y + 88

        y = self.section("Proyectos destacados", y)
        projects = [
            (
                "Gestión de Libros de Acervo",
                "Flask · SQL Server · Pandas · Chart.js",
                "13+ endpoints, préstamos, monitoreo en tiempo real, dashboard, reportes PDF/Excel e importación masiva.",
                "https://gestion-de-libros-de-acervo.onrender.com/",
            ),
            (
                "Registro de Entradas y Salidas",
                "Flask · SQL Server · bcrypt · Pandas",
                "Asistencias con roles, estadísticas, reportes PDF/Excel y cierre automático de sesiones.",
                "https://registros-entradas-salidas-dqkv.onrender.com/",
            ),
            (
                "Inventario de Libros",
                "Python · Tkinter · SQLite · PyInstaller",
                "Escaneo de códigos, búsqueda Unicode, fusión de bases y cinco reportes Excel.",
                "https://jesusgarza.pages.dev/#projects",
            ),
            (
                "Cronómetro para Cubo Rubik",
                "React · JavaScript · Responsive",
                "Inspección, estadísticas, visualización 2D y personalización para speedcubing.",
                "https://rtimer.pages.dev/",
            ),
        ]
        for name, stack, description, uri in projects:
            name_width = self.link_text(
                MARGIN,
                y,
                name,
                uri,
                size=8.2,
                color=NAVY,
                font="bold",
            )
            self.text(
                MARGIN + name_width + 6,
                y,
                f"· {stack}",
                size=7.4,
                color=TEAL,
                font="semibold",
            )
            y = self.paragraph(
                MARGIN,
                y + 12,
                CONTENT_WIDTH,
                description,
                size=7.7,
                line_height=9.8,
                color=TEXT,
            )
            y += 4

        y += 2
        y = self.section("Formación, certificaciones y reconocimientos", y)
        y = self.label_value(
            MARGIN,
            y,
            "Licenciatura:",
            "Ciencias Computacionales · Universidad Autónoma de Nuevo León, FCFM · 2021–2025",
            CONTENT_WIDTH,
            size=8.1,
        )
        y = self.label_value(
            MARGIN,
            y + 3,
            "Red Hat:",
            "RH124 System Administration I · RH134 System Administration II · RH294 Enterprise Linux Automation with Ansible · 2024",
            CONTENT_WIDTH,
            size=8.1,
        )
        y = self.label_value(
            MARGIN,
            y + 3,
            "CENEVAL:",
            "Testimonio de Desempeño Sobresaliente en el EGEL de Ciencias Computacionales · 2025",
            CONTENT_WIDTH,
            size=8.1,
        )
        y = self.label_value(
            MARGIN,
            y + 3,
            "UANL:",
            "Reconocimiento y carta de recomendación por la elaboración de tres sistemas para la Biblioteca FCFM · 2025",
            CONTENT_WIDTH,
            size=8.1,
        )

        note = "Certificados, carta y demostraciones disponibles en el portafolio."
        self.link_text(
            MARGIN,
            y + 7,
            note,
            "https://jesusgarza.pages.dev/#education",
            size=7.6,
            color=TEAL,
            font="semibold",
        )

        self.footer(2)

    def save(self):
        metadata = {
            "title": "CV de Jesús Gerardo Garza García — 2026",
            "author": "Jesús Gerardo Garza García",
            "subject": "Desarrollador Backend y especialista Odoo 17/18/19",
            "keywords": "Odoo, Python, PostgreSQL, CFDI, SAT, pedimentos, Owl, QWeb, REST, XML-RPC",
            "creator": "PyMuPDF",
        }
        self.doc.set_metadata(metadata)
        self.doc.subset_fonts()
        self.doc.save(
            OUTPUT,
            garbage=4,
            deflate=True,
            clean=True,
        )
        self.doc.close()


def main():
    cv = CV()
    cv.build_page_one()
    cv.build_page_two()
    cv.save()
    print(OUTPUT)


if __name__ == "__main__":
    main()
