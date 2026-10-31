/**
 * analyzer.bench.js - Benchmark de Rendimiento & Prueba de Estrés
 * Mide el rendimiento algorítmico procesando 100,000 palabras en memoria.
 */

import {
    calculateWords,
    calculateCharsNoSpaces,
    calculateSentences,
    calculateParagraphs
} from './analyzer.js';

// Generar un texto masivo de prueba: ~100,000 palabras (una novela completa)
const parrafoBase = 'El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja.\n\n';
const REPETICIONES = 5000;
const textoMasivo = parrafoBase.repeat(REPETICIONES); 

console.log('='.repeat(65));
console.log('🚀 BENCHMARK DE ESTRÉS: PROCESAMIENTO DE TEXTO MASIVO');
console.log('='.repeat(65));
console.log(`📦 Tamaño del texto de prueba: ${(textoMasivo.length / 1024).toFixed(2)} KB (~100,000 palabras)\n`);

function medirFuncion(nombre, fn) {
    const inicio = performance.now();
    const resultado = fn();
    const duracion = performance.now() - inicio;

    const opsPorSegundo = Math.round(1000 / duracion);
    console.log(`⚡ ${nombre.padEnd(30)} | ${duracion.toFixed(2).padStart(8)} ms | ${resultado.toLocaleString().padStart(8)} items | ~${opsPorSegundo} ops/s`);
    return duracion;
}

const t1 = medirFuncion('calculateWords', () => calculateWords(textoMasivo));
const t2 = medirFuncion('calculateCharsNoSpaces', () => calculateCharsNoSpaces(textoMasivo));
const t3 = medirFuncion('calculateSentences', () => calculateSentences(textoMasivo));
const t4 = medirFuncion('calculateParagraphs', () => calculateParagraphs(textoMasivo));

const total = t1 + t2 + t3 + t4;
console.log('-'.repeat(65));
console.log(`🏁 TIEMPO TOTAL DEL PIPELINE COMPLETO: ${total.toFixed(2)} ms`);

if (total < 100) {
    console.log('✅ ESTADO: RENDIMIENTO SOBRESALIENTE (Menos de 100ms para 100,000 palabras)');
} else {
    console.log('⚠️ ESTADO: ACEPTABLE (Mayor a 100ms)');
}
console.log('='.repeat(65));
