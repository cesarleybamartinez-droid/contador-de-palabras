/**
 * analyzer.js - Módulo de Lógica Pura (Pure Business Logic)
 * Funciones matemáticas e independientes del DOM.
 */

export const CONFIG = {
    WORDS_PER_MINUTE_READ: 200,   // Velocidad promedio de lectura silenciosa
    WORDS_PER_MINUTE_SPEAK: 130,  // Velocidad promedio de habla en oratoria
};

/**
 * Cuenta palabras reales que contengan caracteres alfanuméricos válidos.
 * Ignora secuencias solitarias de signos de puntuación (... --- ???).
 */
export function calculateWords(text) {
    if (!text || text.trim().length === 0) return 0;
    const matches = text.trim().match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu);
    return matches ? matches.length : 0;
}

/**
 * Cuenta caracteres excluyendo cualquier espacio en blanco o salto de línea.
 */
export function calculateCharsNoSpaces(text) {
    return text ? text.replace(/\s+/g, '').length : 0;
}

/**
 * Cuenta oraciones evitando falsos positivos con decimales (ej. 3.50).
 */
export function calculateSentences(text) {
    if (!text || text.trim().length === 0) return 0;
    const sentences = text.trim().split(/(?<=[.!?])(?:\s+|$)/).filter(s => s.trim().length > 0);
    return sentences.length;
}

/**
 * Cuenta párrafos reales con texto, ignorando múltiples Enter seguidos.
 */
export function calculateParagraphs(text) {
    if (!text || text.trim().length === 0) return 0;
    const paragraphs = text.split(/\n+/).filter(para => para.trim().length > 0);
    return paragraphs.length;
}

/**
 * Calcula el tiempo estimado de lectura en minutos.
 */
export function calculateReadingTime(words) {
    if (words === 0) return '~0 min';
    const minutes = Math.ceil(words / CONFIG.WORDS_PER_MINUTE_READ);
    return `~${minutes} min`;
}

/**
 * Calcula el tiempo estimado de habla/exposición en minutos.
 */
export function calculateSpeakingTime(words) {
    if (words === 0) return '~0 min';
    const minutes = Math.ceil(words / CONFIG.WORDS_PER_MINUTE_SPEAK);
    return `~${minutes} min`;
}
