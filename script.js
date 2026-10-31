/**
 * PROYECTO 02: Contador de Palabras, Caracteres y Métricas en Tiempo Real
 * Arquitectura: Modular (Imports de Lógica Pura -> Caché DOM -> UI Controller -> Eventos)
 * Versión: 2.1 (Modularizada con Unit Tests)
 */

// ==========================================================================
// 1. IMPORTACIONES DE LÓGICA PURA Y CONFIGURACIÓN
// ==========================================================================
import {
    CONFIG,
    calculateWords,
    calculateCharsNoSpaces,
    calculateSentences,
    calculateParagraphs,
    calculateReadingTime,
    calculateSpeakingTime
} from './analyzer.js';

// Constantes locales exclusivas de la interfaz
const UI_CONFIG = {
    MAX_CONFIRM_LENGTH: 50,       // Caracteres mínimos para pedir confirmación al borrar
    TOAST_DURATION: 1500          // Duración del mensaje "¡Copiado!" (ms)
};

// ==========================================================================
// 2. CACHÉ DEL DOM (Referencias seguras a elementos)
// ==========================================================================
const DOM = {
    // Entrada de texto y selectores
    textInput: document.getElementById('text-input'),
    limitSelect: document.getElementById('char-limit') || document.getElementById('limit-select'),

    // Contenedor y barra de progreso
    progressContainer: document.getElementById('progress-container'),
    progressBarFill: document.getElementById('progress-bar-fill'),
    progressText: document.getElementById('progress-text'),
    progressPercentage: document.getElementById('progress-percentage'),

    // Métricas en pantalla
    wordCount: document.getElementById('word-count'),
    charCount: document.getElementById('char-count'),
    charNoSpaces: document.getElementById('char-no-spaces-count'),
    sentenceCount: document.getElementById('sentence-count'),
    paragraphCount: document.getElementById('paragraph-count'),
    readingTime: document.getElementById('reading-time'),
    speakingTime: document.getElementById('speaking-time'),

    // Botones de acción
    btnUpper: document.getElementById('btn-uppercase') || document.getElementById('btn-upper'),
    btnLower: document.getElementById('btn-lowercase') || document.getElementById('btn-lower'),
    btnCopy: document.getElementById('btn-copy'),
    btnClear: document.getElementById('btn-clear'),

    // Modo oscuro
    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.getElementById('theme-icon')
};

// ==========================================================================
// 3. CONTROLADOR DE INTERFAZ (UI Controller con rAF)
// ==========================================================================

// ==========================================================================
// 4. CONTROLADOR DE INTERFAZ (UI Controller con rAF)
// ==========================================================================
let updatePending = false;

/**
 * Coordina la actualización visual usando requestAnimationFrame para 60fps fluidos.
 */
function scheduleMetricsUpdate() {
    if (updatePending) return;
    updatePending = true;

    requestAnimationFrame(() => {
        updateMetrics();
        updatePending = false;
    });
}

function updateMetrics() {
    if (!DOM.textInput) return;

    const text = DOM.textInput.value;

    // 1. Cálculos de métricas
    const words = calculateWords(text);
    const chars = text.length;
    const charsNoSpaces = calculateCharsNoSpaces(text);
    const sentences = calculateSentences(text);
    const paragraphs = calculateParagraphs(text);

    // 2. Actualizar valores en el DOM con formato local
    if (DOM.wordCount) DOM.wordCount.textContent = words.toLocaleString('es-ES');
    if (DOM.charCount) DOM.charCount.textContent = chars.toLocaleString('es-ES');
    if (DOM.charNoSpaces) DOM.charNoSpaces.textContent = charsNoSpaces.toLocaleString('es-ES');
    if (DOM.sentenceCount) DOM.sentenceCount.textContent = sentences.toLocaleString('es-ES');
    if (DOM.paragraphCount) DOM.paragraphCount.textContent = paragraphs.toLocaleString('es-ES');
    if (DOM.readingTime) DOM.readingTime.textContent = calculateReadingTime(words);
    if (DOM.speakingTime) DOM.speakingTime.textContent = calculateSpeakingTime(words);

    // 3. Barra de progreso de caracteres
    updateProgressBar(chars);
}

/**
 * Actualiza la barra visual de progreso y sus roles de accesibilidad.
 */
/**
 * Actualiza la barra visual de progreso y sus roles de accesibilidad.
 */
function updateProgressBar(chars) {
    if (!DOM.limitSelect || !DOM.progressContainer) return;

    const limit = parseInt(DOM.limitSelect.value, 10);

    // Si se seleccionó "Sin límite" (0): Ocultamos el contenedor
    if (isNaN(limit) || limit <= 0) {
        DOM.progressContainer.hidden = true;
        DOM.progressContainer.style.display = 'none';
        return;
    }

    // Si hay límite: Lo mostramos
    DOM.progressContainer.hidden = false;
    DOM.progressContainer.style.display = '';

    const percentage = Math.round((chars / limit) * 100);
    const clampedPercentage = Math.min(percentage, 100);

    if (DOM.progressText) {
        DOM.progressText.textContent = `${chars.toLocaleString('es-ES')} / ${limit.toLocaleString('es-ES')} caracteres`;
    }

    if (DOM.progressPercentage) {
        DOM.progressPercentage.textContent = `${percentage}%`;
    }

    if (DOM.progressBarFill) {
        DOM.progressBarFill.style.width = `${clampedPercentage}%`;
        
        // Atributos de accesibilidad para lectores de pantalla
        DOM.progressBarFill.setAttribute('role', 'progressbar');
        DOM.progressBarFill.setAttribute('aria-valuenow', percentage);
        DOM.progressBarFill.setAttribute('aria-valuemin', '0');
        DOM.progressBarFill.setAttribute('aria-valuemax', '100');

        // Semáforo de estados: Normal (<85%), Alerta (85%-100%), Excedido (>100%)
        if (chars > limit) {
            DOM.progressBarFill.style.backgroundColor = 'var(--clr-danger, #ef4444)';
        } else if (percentage >= 85) {
            DOM.progressBarFill.style.backgroundColor = 'var(--clr-warning, #f59e0b)';
        } else {
            DOM.progressBarFill.style.backgroundColor = 'var(--clr-primary, #4f46e5)';
        }
    }
}

// ==========================================================================
// 5. ACCIONES DE TEXTO (Mayúsculas, Minúsculas, Copiar, Limpiar)
// ==========================================================================

function toUpperCase() {
    if (!DOM.textInput) return;
    DOM.textInput.value = DOM.textInput.value.toUpperCase();
    scheduleMetricsUpdate();
}

function toLowerCase() {
    if (!DOM.textInput) return;
    DOM.textInput.value = DOM.textInput.value.toLowerCase();
    scheduleMetricsUpdate();
}

async function copyText() {
    if (!DOM.textInput || !DOM.btnCopy) return;
    const text = DOM.textInput.value;

    if (!text) {
        DOM.textInput.focus();
        return;
    }

    try {
        await navigator.clipboard.writeText(text);

        // Feedback temporal accesible
        const originalText = DOM.btnCopy.textContent;
        DOM.btnCopy.textContent = '\u00A1Texto Copiado! \u2713';
        DOM.btnCopy.style.backgroundColor = 'var(--clr-success, #10b981)';
        DOM.btnCopy.style.color = '#ffffff';

        setTimeout(() => {
            DOM.btnCopy.textContent = originalText;
            DOM.btnCopy.style.backgroundColor = '';
            DOM.btnCopy.style.color = '';
        }, CONFIG.TOAST_DURATION);
    } catch (err) {
        console.warn('Clipboard API no disponible, usando fallback:', err);
        // Fallback para navegadores antiguos o entornos sin HTTPS
        DOM.textInput.select();
        document.execCommand('copy');
        alert('Texto copiado al portapapeles.');
    }
}

function clearText() {
    if (!DOM.textInput || DOM.textInput.value.length === 0) return;

    if (DOM.textInput.value.length > CONFIG.MAX_CONFIRM_LENGTH) {
        const confirmClear = confirm('¿Estás seguro de que deseas borrar todo el texto?');
        if (!confirmClear) {
            DOM.textInput.focus();
            return;
        }
    }

    DOM.textInput.value = '';
    scheduleMetricsUpdate();
    DOM.textInput.focus();
}

// ==========================================================================
// 6. GESTOR DE TEMA (Modo Oscuro con localStorage)
// ==========================================================================

function initTheme() {
    if (!DOM.themeToggle) return;

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    DOM.themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const iconElement = DOM.themeIcon || (DOM.themeToggle ? DOM.themeToggle.querySelector('#theme-icon, .theme-icon') : null);
    if (!iconElement) return;

    // Sol en modo oscuro (para cambiar a claro); Luna en modo claro (para cambiar a oscuro)
    iconElement.textContent = theme === 'dark' ? '\u2600\uFE0F' : '\u{1F319}';
}

// ==========================================================================
// 7. INICIALIZACIÓN Y EVENT LISTENERS
// ==========================================================================

function initApp() {
    if (!DOM.textInput) return;

    // 1. Escuchar escritura en tiempo real con rAF
    DOM.textInput.addEventListener('input', scheduleMetricsUpdate);

    // 2. Escuchar cambio de límite de caracteres
    if (DOM.limitSelect) {
        DOM.limitSelect.addEventListener('change', scheduleMetricsUpdate);
    }

    // 3. Botones de acción del editor
    if (DOM.btnUpper) DOM.btnUpper.addEventListener('click', toUpperCase);
    if (DOM.btnLower) DOM.btnLower.addEventListener('click', toLowerCase);
    if (DOM.btnCopy) DOM.btnCopy.addEventListener('click', copyText);
    if (DOM.btnClear) DOM.btnClear.addEventListener('click', clearText);

    // 4. Inicializar tema oscuro/claro
    initTheme();

    // 5. Primera pasada de métricas (por si el usuario refrescó con texto en el textarea)
    scheduleMetricsUpdate();
}

// Arrancar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);
