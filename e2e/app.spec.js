import { test, expect } from '@playwright/test';

test.describe('Pruebas E2E: Contador de Palabras y Métricas', () => {

  test.beforeEach(async ({ page }) => {
    // Abre la aplicación a través del servidor local HTTP (CORS habilitado)
    await page.goto('/');
  });

  test('debe cargar la página con contadores en cero y autofocus en el textarea', async ({ page }) => {
    await expect(page.locator('#word-count')).toHaveText('0');
    await expect(page.locator('#char-count')).toHaveText('0');
    await expect(page.locator('#text-input')).toBeFocused();
  });

  test('debe actualizar métricas en tiempo real al escribir texto', async ({ page }) => {
    const textarea = page.locator('#text-input');
    
    // Escribir texto de prueba
    await textarea.fill('Hola mundo. Esto es una prueba de arquitectura frontend.');

    // Verificar métricas calculadas
    await expect(page.locator('#word-count')).toHaveText('9');
    await expect(page.locator('#sentence-count')).toHaveText('2');
    await expect(page.locator('#paragraph-count')).toHaveText('1');
    await expect(page.locator('#reading-time')).toHaveText('~1 min');
  });

  test('debe transformar texto a MAYÚSCULAS y minúsculas con los botones', async ({ page }) => {
    const textarea = page.locator('#text-input');
    await textarea.fill('texto en minuscula');

    // Clic en MAYÚSCULAS
    await page.locator('#btn-uppercase').click();
    await expect(textarea).toHaveValue('TEXTO EN MINUSCULA');

    // Clic en minúsculas
    await page.locator('#btn-lowercase').click();
    await expect(textarea).toHaveValue('texto en minuscula');
  });

  test('debe mostrar la barra de progreso al seleccionar un límite y cambiar color al excederlo', async ({ page }) => {
    const limitSelect = page.locator('#char-limit');
    const progressContainer = page.locator('#progress-container');
    const progressBarFill = page.locator('#progress-bar-fill');
    const textarea = page.locator('#text-input');

    // Por defecto "Sin límite" está oculto
    await expect(progressContainer).toBeHidden();

    // Seleccionar límite Twitter (280)
    await limitSelect.selectOption('280');
    await expect(progressContainer).toBeVisible();

    // Escribir 10 caracteres
    await textarea.fill('1234567890');
    await expect(page.locator('#progress-text')).toHaveText('10 / 280 caracteres');

    // Exceder el límite intencionalmente (300 caracteres)
    const textoLargo = 'a'.repeat(300);
    await textarea.fill(textoLargo);

    // Verificar que la barra se pinte de rojo (--clr-danger / rgb(239, 68, 68))
    await expect(progressBarFill).toHaveCSS('background-color', 'rgb(239, 68, 68)');
  });

  test('debe alternar entre Modo Claro y Modo Oscuro al pulsar el botón de tema', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    const html = page.locator('html');

    // Clic para cambiar a modo oscuro
    await themeToggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');

    // Clic para volver a modo claro
    await themeToggle.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
  });

  test('debe limpiar el texto al hacer clic en Limpiar', async ({ page }) => {
    const textarea = page.locator('#text-input');
    await textarea.fill('Texto corto');

    await page.locator('#btn-clear').click();

    await expect(textarea).toHaveValue('');
    await expect(page.locator('#word-count')).toHaveText('0');
  });
  
  test('Prueba de Estrés E2E: procesa 50,000 palabras en Chromium sin congelar la UI', async ({ page }) => {
    const textarea = page.locator('#text-input');
    
    // Generar bloque masivo de texto: 50,000 palabras
    const parrafo = 'Frontend moderno con JavaScript puro y arquitectura modular en capas. ';
    const textoGigante = parrafo.repeat(5000);

    const tiempoInicio = Date.now();

    // Pegar el texto masivo en el editor
    await textarea.fill(textoGigante);

    // Esperar a que el contador de palabras refleje las 50,000 palabras formateadas
    await expect(page.locator('#word-count')).toHaveText('50.000');

    const duracion = Date.now() - tiempoInicio;
    console.log(`\n⚡ Tiempo total de pegado, cálculo y renderizado en pantalla: ${duracion}ms`);

    // Criterio de Aceptación: Todo el flujo de UI debe completarse en menos de 2,500ms
    expect(duracion).toBeLessThan(2500);

    // Comprobar que los botones siguen respondiendo tras el esfuerzo masivo
    await page.locator('#btn-uppercase').click();
    await expect(page.locator('#word-count')).toHaveText('50.000');
  });

});
