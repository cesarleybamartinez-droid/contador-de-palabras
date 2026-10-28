Contador de Palabras y Métricas de Redacción en Tiempo Real

> Aplicación web interactiva de análisis lingüístico, métricas de redacción y estimación de tiempos de lectura en tiempo real construida con **HTML5 Semántico**, **CSS3 Modular (CSS Grid)** y **Vanilla JavaScript (ES6+)**.

---

## Demostración y Características

- **Análisis en Tiempo Real (60 FPS)**: Conteo instantáneo sincronizado con `requestAnimationFrame` para evitar retrasos en textos extensos.
- **Métricas de Redacción**:
  - Palabras reales (ignora secuencias de puntuación aisladas mediante expresiones regulares Unicode).
  - Caracteres totales (con espacios) y caracteres netos (sin espacios).
  - Conteo de oraciones (blindado contra números decimales como `3.50`).
  - Conteo de párrafos activos.
  - Tiempo estimado de lectura silenciosa (~200 palabras/minuto).
  - Tiempo estimado de exposición oral (~130 palabras/minuto).
- **Control de Metas y Límites de Caracteres**:
  - Selector con preajustes populares: X/Twitter (280), Resumen corto (500) y LinkedIn (1,000).
  - Barra de progreso reactiva con semáforo de colores: Normal (<85%), Alerta (85%-100%) y Excedido (>100%).
- **Herramientas Rápidas de Edición**:
  - Conversión a MAYÚSCULAS y minúsculas.
  - Copiado rápido al portapapeles con la API moderna `navigator.clipboard` (con fallback de compatibilidad y retroalimentación visual).
  - Limpieza segura de contenido con diálogo de confirmación para textos largos.
- **Modo Oscuro / Claro**: Persistencia de preferencia en `localStorage` con cambio de iconos accesible.
- **100% Accesible y Responsive**:
  - Estructura semántica HTML5 con soporte ARIA para lectores de pantalla.
  - Grid auto-adaptable con `repeat(auto-fit, minmax(180px, 1fr))` para móviles, tablets y monitores.

---

## Tecnologías y Arquitectura

- **HTML5**: Semántica estricta (`<header>`, `<main>`, `<section>`, `<textarea>`, `<button>`), accesibilidad con clases `.visually-hidden` y roles ARIA (`role="progressbar"`).
- **CSS3**: Variables nativas (_Design Tokens_), Reset universal con control de especificidad para `[hidden]`, animaciones sutiles y maquetación fluida sin dependencias externas.
- **Vanilla JavaScript (ES6+)**:
  - Arquitectura modular desacoplada: Caché del DOM $\rightarrow$ Funciones puras de cálculo $\rightarrow$ Controlador de interfaz (UI) $\rightarrow$ Manejadores de eventos.
  - Expresiones regulares modernas compatibles con Unicode (`/\p{L}\p{N}/gu`).
  - Prevención de _frame drops_ con `requestAnimationFrame`.

---

## Estructura del Proyecto

```text
contador_de_palabras/
├── index.html        # Estructura semántica y componentes de la UI
├── style.css         # Tokens de diseño, CSS Grid y temas claro/oscuro
├── script.js         # Lógica pura de cálculo y controlador de eventos
├── favicon.svg       # Icono vectorial tipográfico en formato SVG
└── README.md         # Documentación técnica del proyecto
```
