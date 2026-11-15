// js/utils/backgrounds.js — Selector dinámico y modular de fondos WebP
import { reactive } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.js';
import { G } from '../store.js';

/**
 * Opciones para el desarrollador:
 * Permite forzar en consola o pruebas la orientación y el avatar para comprobar
 * cómo se ven todos los fondos sin tener que cambiar de pantalla o dispositivo.
 * Ejemplo en consola:
 *   window.AGY_DEV.forcedAvatar = 'female';
 *   window.AGY_DEV.forcedOrientation = 'portrait';
 */
export const devOptions = reactive({
    enabled: true,
    forcedAvatar: null,       // 'male' | 'female' | null
    forcedOrientation: null,  // 'portrait' | 'landscape' | null
});

if (typeof window !== 'undefined') {
    window.AGY_DEV = devOptions;
}

/**
 * Resuelve la imagen de fondo WebP adecuada según:
 * 1. La orientación de pantalla (configurada en opciones o por dispositivo).
 * 2. La elección de personaje del jugador (chico / chica).
 * 3. Las opciones del desarrollador (bgMale, bgMaleVertical, bgFemale, bgFemaleVertical, bgVertical, bg).
 *
 * @param {Object} config Configuración de fondos del paso o pantalla
 * @param {string} playerAvatar 'male' | 'female'
 * @param {boolean} isPortrait boolean indicando si la pantalla está en vertical
 * @returns {string} Ruta al archivo .webp correspondiente
 */
export function resolveBackground(config = {}, playerAvatar = 'male', isPortrait = false) {
    // Determinar orientación respetando la opción del usuario en G.orientationMode
    let portrait = isPortrait;
    if (G.orientationMode === 'vertical') {
        portrait = true;
    } else if (G.orientationMode === 'horizontal') {
        portrait = false;
    } else if (devOptions.forcedOrientation) {
        portrait = devOptions.forcedOrientation === 'portrait';
    }

    if (!config) {
        return portrait ? './src/images/fondo_v.webp' : './src/images/fondo.webp';
    }

    // Permitir sobrescritura por opciones del desarrollador
    const avatar = devOptions.forcedAvatar || playerAvatar || 'male';

    // 1. Si el jugador es CHICA ('female')
    if (avatar === 'female') {
        if (portrait) {
            if (config.bgFemaleVertical) return config.bgFemaleVertical;
            if (config.bgFemale)         return config.bgFemale;
            if (config.bgVertical)       return config.bgVertical;
            if (config.bg)               return config.bg;
        } else {
            if (config.bgFemale)         return config.bgFemale;
            if (config.bg)               return config.bg;
            if (config.bgFemaleVertical) return config.bgFemaleVertical;
            if (config.bgVertical)       return config.bgVertical;
        }
    }
    // 2. Si el jugador es CHICO ('male') o por defecto
    else {
        if (portrait) {
            if (config.bgMaleVertical) return config.bgMaleVertical;
            if (config.bgMale)         return config.bgMale;
            if (config.bgVertical)     return config.bgVertical;
            if (config.bg)             return config.bg;
        } else {
            if (config.bgMale)         return config.bgMale;
            if (config.bg)             return config.bg;
            if (config.bgMaleVertical) return config.bgMaleVertical;
            if (config.bgVertical)     return config.bgVertical;
        }
    }

    // 3. Fallbacks genéricos
    if (portrait && config.bgVertical) return config.bgVertical;
    if (config.bg) return config.bg;

    return portrait ? './src/images/fondo_v.webp' : './src/images/fondo.webp';
}
