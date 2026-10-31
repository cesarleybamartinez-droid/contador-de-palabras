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

## Suite Integral de Pruebas y Calidad (QA)

El proyecto fue sometido a una pirámide completa de pruebas de software:

### 1. Auditoría Web (Google Lighthouse)

- **Rendimiento (Performance)**: **100 / 100**
- **Accesibilidad (A11y)**: **100 / 100**
- **Mejores Prácticas**: **100 / 100**
- **SEO**: **100 / 100**
- **Agentic Browsing**: **2 / 2**

### 2. Pruebas Unitarias de Lógica Pura (Vitest)

- **15 pruebas unitarias automatizadas** en `analyzer.test.js` evaluando funciones puras independientes del DOM.
- Casos límite evaluados: cadenas vacías, saltos de línea repetidos, signos solitarios (`... --- ???`), números decimales y caracteres con acentos/eñes.
- Tiempo de ejecución de la suite: **~240 ms**.

### 3. Pruebas End-to-End (Playwright)

- **7 pruebas completas de interacción de usuario** en `e2e/app.spec.js` ejecutadas sobre un navegador Chromium real:
  - Carga inicial y autofocus en el editor.
  - Actualización de contadores en vivo al teclear.
  - Transformación de texto a mayúsculas/minúsculas.
  - Visualización y alerta por desbordamiento de la barra de progreso.
  - Cambio y persistencia de temas claro y oscuro.
  - Limpieza del editor con confirmación.
  - Prueba de estrés con 50,000 palabras en el navegador (**renderizado en 191 ms**).

### 4. Pruebas de Rendimiento y Estrés (Benchmark & Load Testing)

- **Benchmark Algorítmico (`analyzer.bench.js`)**:
  - Procesamiento masivo de **100,000 palabras (~550 KB de texto)** en memoria.
  - Tiempo total de ejecución del pipeline: **25.54 ms** (>100 ops/segundo).
- **Prueba de Carga Concurrente (Autocannon)**:
  - **100 conexiones concurrentes continuas** durante 10 segundos.
  - **1,771 peticiones por segundo** respondidas con **0% de errores** (18,000 peticiones en 10s con latencia media de 55ms).

---

## Tecnologías y Arquitectura

- **Frontend**: HTML5 Semántico, CSS3 Modular (Variables nativas y CSS Grid), Vanilla JavaScript (ES6+ Modules).
- **Testing & Tooling**: Node.js, Vitest, Playwright, Autocannon y HTTP-Server.
- **Arquitectura**: Separación limpia en capas (Lógica Pura en `analyzer.js` $\rightarrow$ Caché DOM y UI Controller en `script.js` $\rightarrow$ Suites de Test en `analyzer.test.js` y `e2e/`).

---

## Estructura del Proyecto

```text
contador_de_palabras/
├── index.html            # Estructura semántica y componentes de la UI
├── style.css             # Tokens de diseño, CSS Grid y temas claro/oscuro
├── script.js             # Controlador de interfaz (UI Controller) y eventos
├── analyzer.js           # Módulo de lógica pura de cálculo (desacoplado del DOM)
├── analyzer.test.js      # 15 Pruebas unitarias con Vitest
├── analyzer.bench.js     # Benchmark de estrés para 100,000 palabras
├── e2e/
│   └── app.spec.js       # 7 Pruebas End-to-End con Playwright
├── playwright.config.js  # Configuración de Playwright con webServer local
├── package.json          # Dependencias y scripts de prueba (test, bench, e2e, load)
├── favicon.svg           # Icono vectorial tipográfico en formato SVG
├── .gitignore            # Exclusión de node_modules y reportes temporales
└── README.md             # Documentación técnica y reporte de QA

## Instalación y Comandos de Prueba

1. Clona el repositorio: git clone https://github.com/cesarleybamartinez-droid/contador-de-palabras.git
cd contador-de-palabras

2. Instala las dependencias de desarrollo:
npm install

3. Ejecuta los diferentes niveles de prueba:

# Pruebas Unitarias (Nivel 2)
npm test
# Benchmark de Estrés (Nivel 4)
npm run bench
# Pruebas End-to-End (Nivel 3)
npm run test:e2e
# Prueba de Carga Masiva con 100 usuarios (Nivel 4)
npm run test:load
```
