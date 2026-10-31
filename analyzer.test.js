import { describe, it, expect } from 'vitest';
import {
    calculateWords,
    calculateCharsNoSpaces,
    calculateSentences,
    calculateParagraphs,
    calculateReadingTime,
    calculateSpeakingTime
} from './analyzer.js';

describe('Suite de Pruebas Unitarias: Analizador de Texto', () => {

    describe('calculateWords (Conteo de Palabras)', () => {
        it('debe retornar 0 si el texto está vacío o son solo espacios', () => {
            expect(calculateWords('')).toBe(0);
            expect(calculateWords('   \n  \t  ')).toBe(0);
        });

        it('debe contar palabras estándar correctamente', () => {
            expect(calculateWords('Aprender JavaScript es fascinante')).toBe(4);
        });

        it('no debe contar secuencias solitarias de signos de puntuación', () => {
            expect(calculateWords('... --- ??? !!!')).toBe(0);
            expect(calculateWords('Hola ... mundo ???')).toBe(2);
        });

        it('debe contar correctamente palabras compuestas o con apóstrofes', () => {
            expect(calculateWords("state-of-the-art don't let's")).toBe(3);
        });

        it('debe soportar caracteres Unicode con tildes y eñes', () => {
            expect(calculateWords('Murciélago pingüino año')).toBe(3);
        });
    });

    describe('calculateCharsNoSpaces (Caracteres sin Espacios)', () => {
        it('debe ignorar espacios, tabulaciones y saltos de línea', () => {
            expect(calculateCharsNoSpaces('A B C')).toBe(3);
            expect(calculateCharsNoSpaces('Hola\nMundo\t!')).toBe(10);
        });

        it('debe retornar 0 para cadenas vacías', () => {
            expect(calculateCharsNoSpaces('')).toBe(0);
            expect(calculateCharsNoSpaces('     ')).toBe(0);
        });
    });

    describe('calculateSentences (Conteo de Oraciones)', () => {
        it('debe retornar 0 para texto vacío', () => {
            expect(calculateSentences('')).toBe(0);
        });

        it('debe contar oraciones terminadas en punto, interrogación o exclamación', () => {
            const texto = 'Hola mundo. ¿Cómo estás? ¡Todo excelente!';
            expect(calculateSentences(texto)).toBe(3);
        });

        it('no debe dividir oraciones ante números decimales (ej. 3.50)', () => {
            const texto = 'El café cuesta 3.50 euros. Lo compraré mañana.';
            expect(calculateSentences(texto)).toBe(2);
        });
    });

    describe('calculateParagraphs (Conteo de Párrafos)', () => {
        it('debe retornar 0 para texto vacío', () => {
            expect(calculateParagraphs('')).toBe(0);
        });

        it('no debe contar saltos de línea vacíos repetidos', () => {
            const texto = 'Párrafo uno.\n\n\n\nPárrafo dos.\n\n\nPárrafo tres.';
            expect(calculateParagraphs(texto)).toBe(3);
        });
    });

    describe('Tiempos Estimados (Lectura y Habla)', () => {
        it('debe retornar ~0 min si hay 0 palabras', () => {
            expect(calculateReadingTime(0)).toBe('~0 min');
            expect(calculateSpeakingTime(0)).toBe('~0 min');
        });

        it('debe calcular lectura redondeando hacia arriba (~200 ppm)', () => {
            expect(calculateReadingTime(150)).toBe('~1 min');
            expect(calculateReadingTime(250)).toBe('~2 min');
            expect(calculateReadingTime(400)).toBe('~2 min');
        });

        it('debe calcular tiempo de habla (~130 ppm)', () => {
            expect(calculateSpeakingTime(130)).toBe('~1 min');
            expect(calculateSpeakingTime(200)).toBe('~2 min');
        });
    });

});
