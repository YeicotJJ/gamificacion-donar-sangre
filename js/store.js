// store.js — Estado reactivo global y controladores de la gamificación
import { reactive } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.js';
import { LEVELS } from './data.js';

// 5 Tamaños predefinidos de texto
export const TEXT_SIZES = [
    { id: 1, key: 'xs', label: 'Muy pequeño', shortLabel: 'Muy peq.', scale: 0.85, sampleSize: '11px' },
    { id: 2, key: 'sm', label: 'Pequeño',     shortLabel: 'Pequeño',  scale: 0.92, sampleSize: '13px' },
    { id: 3, key: 'md', label: 'Normal',      shortLabel: 'Normal',   scale: 1.00, sampleSize: '15px' },
    { id: 4, key: 'lg', label: 'Grande',      shortLabel: 'Grande',   scale: 1.15, sampleSize: '18px' },
    { id: 5, key: 'xl', label: 'Muy grande',  shortLabel: 'Muy gde.', scale: 1.30, sampleSize: '21px' },
];

// Cargar preferencias guardadas en localStorage
const savedSettings = (() => {
    try {
        const raw = localStorage.getItem('agy_donation_settings');
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
})();

export const G = reactive({
    screen: 'start',   // 'start' | 'selectCharacter' | 'intro' | 'levelSelect' | 'levelPlay' | 'levelResult' | 'final'
    i: 0,              // índice intro screens
    toast: null,
    playerName: '',
    playerAvatar: null,
    // Sistema de niveles multi-paso
    currentLevel: 0,
    currentLevelStep: 0,
    levelAllCorrect: true,
    levelStars:    Array(LEVELS.length).fill(false),
    levelUnlocked: Array(LEVELS.length).fill(false).map((_, i) => i === 0),
    // Modales
    showHowToPlay:     false,
    showProfile:       false,
    showSettingsModal: false,
    // Configuración de audio, orientación y tamaño de texto
    musicVolume:     savedSettings?.musicVolume ?? 60,
    sfxVolume:       savedSettings?.sfxVolume ?? 80,
    musicMuted:      savedSettings?.musicMuted ?? false,
    sfxMuted:        savedSettings?.sfxMuted ?? false,
    orientationMode: savedSettings?.orientationMode ?? 'auto', // 'auto' | 'horizontal' | 'vertical'
    textSize:        savedSettings?.textSize ?? 3,             // 1 | 2 | 3 | 4 | 5 (predeterminado: 3 = Normal)
    // Juicing
    shake: false,
    flash: null,
    floaters: [],
});

// Guardar configuración en localStorage
export function saveSettings() {
    try {
        localStorage.setItem('agy_donation_settings', JSON.stringify({
            musicVolume: G.musicVolume,
            sfxVolume: G.sfxVolume,
            musicMuted: G.musicMuted,
            sfxMuted: G.sfxMuted,
            orientationMode: G.orientationMode,
            textSize: G.textSize,
        }));
    } catch (e) {
        // Ignorar si localStorage no está disponible
    }
}

// Aplicar tamaño de texto en el DOM de forma reactiva
export function applyTextSize(sizeId = G.textSize) {
    const item = TEXT_SIZES.find(s => s.id === sizeId) || TEXT_SIZES[2];
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-text-size', String(item.id));
        document.documentElement.style.setProperty('--text-scale', String(item.scale));
    }
}

// Comprobar y actualizar si está en modo escritorio (PC o pantalla horizontal)
export function isDesktopMode() {
    if (G.orientationMode === 'horizontal') return true;
    if (G.orientationMode === 'vertical') return false;
    if (typeof window !== 'undefined') {
        return window.innerWidth > 768 && window.innerWidth >= window.innerHeight;
    }
    return true;
}

export function updateDesktopMode() {
    if (typeof document === 'undefined') return;
    const desktop = isDesktopMode();
    document.documentElement.setAttribute('data-mode', desktop ? 'desktop' : 'mobile');
    document.documentElement.classList.toggle('mode-desktop', desktop);
    document.documentElement.classList.toggle('mode-mobile', !desktop);
}

// Inicializar de inmediato en el entorno de ejecución
applyTextSize();
updateDesktopMode();

if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateDesktopMode);
    window.addEventListener('orientationchange', updateDesktopMode);
}

// ── Juicing helpers ─────────────────────────────────────────────────
export function fire(n = 80) {
    if (window.confetti) confetti({ particleCount: n, spread: 70, origin: { y: 0.65 } });
}

let _fid = 0;
export function spawnFloater(x, y, text, color = 'var(--ok)') {
    const id = _fid++;
    G.floaters.push({ id, x, y, text, color });
    setTimeout(() => { G.floaters = G.floaters.filter(f => f.id !== id); }, 1200);
}

// ── Navegación intro ─────────────────────────────────────────────────
export function next() { G.i++; }

// ── Navegación de niveles ────────────────────────────────────────────
export function goToLevel(ci) {
    G.currentLevel     = ci;
    G.currentLevelStep = 0;
    G.levelAllCorrect  = true;
    G.screen = 'levelPlay';
}

export function backToLevelSelect() { G.screen = 'levelSelect'; }
export function goToFinal()         { G.screen = 'final'; }

// ── Lógica multi-paso ────────────────────────────────────────────────
export function answerQuestion(correct) {
    if (!correct) G.levelAllCorrect = false;
}

export function advanceLevelStep() {
    const steps = LEVELS[G.currentLevel].steps;
    const nextStep = G.currentLevelStep + 1;

    if (nextStep >= steps.length) {
        // Fin del nivel
        const ci = G.currentLevel;
        if (G.levelAllCorrect) {
            G.levelStars[ci] = true;
            if (ci + 1 < LEVELS.length) G.levelUnlocked[ci + 1] = true;
        }
        // Si es el último nivel y ganó todas las estrellas → pantalla final
        if (ci === LEVELS.length - 1 && G.levelStars.every(Boolean)) {
            G.screen = 'final';
        } else {
            G.screen = 'levelResult';
        }
    } else {
        G.currentLevelStep = nextStep;
    }
}

// ── Reinicio completo de la gamificación ─────────────────────────────
export const restart = () => {
    Object.assign(G, {
        screen: 'start', i: 0,
        toast: null, playerName: '', playerAvatar: null,
        currentLevel: 0, currentLevelStep: 0, levelAllCorrect: true,
        levelStars:    Array(LEVELS.length).fill(false),
        levelUnlocked: Array(LEVELS.length).fill(false).map((_, i) => i === 0),
        showHowToPlay: false, showProfile: false, showSettingsModal: false,
        shake: false, flash: null, floaters: [],
    });
};

// ── Helpers narrativos (nombre del jugador, género y avatares) ───────
export function formatText(text) {
    if (!text || typeof text !== 'string') return text || '';
    const name = G.playerName?.trim() || (G.playerAvatar === 'female' ? 'Amiga' : 'Amigo');
    const isFemale = G.playerAvatar === 'female';
    const companion = isFemale ? 'Marcos' : 'Lucía';

    return text
        .replace(/{name}/g, name)
        .replace(/{nombre}/g, name)
        .replace(/{jugador}/g, name)
        .replace(/{companion}/g, companion)
        .replace(/{chico\/chica}/g, isFemale ? 'chica' : 'chico')
        .replace(/{amigo\/amiga}/g, isFemale ? 'amiga' : 'amigo')
        .replace(/{el\/la}/g, isFemale ? 'la' : 'el')
        .replace(/{un\/una}/g, isFemale ? 'una' : 'un')
        .replace(/{al\/a la}/g, isFemale ? 'a la' : 'al')
        .replace(/{del\/de la}/g, isFemale ? 'de la' : 'del')
        .replace(/{él\/ella}/g, isFemale ? 'ella' : 'él')
        .replace(/{listo\/lista}/g, isFemale ? 'lista' : 'listo')
        .replace(/{seguro\/segura}/g, isFemale ? 'segura' : 'seguro')
        .replace(/{informado\/informada}/g, isFemale ? 'informada' : 'informado')
        .replace(/{tranquilo\/tranquila}/g, isFemale ? 'tranquila' : 'tranquilo')
        .replace(/{preparado\/preparada}/g, isFemale ? 'preparada' : 'preparado')
        .replace(/{motivado\/motivada}/g, isFemale ? 'motivada' : 'motivado')
        .replace(/{verdadero\/verdadera}/g, isFemale ? 'verdadera' : 'verdadero');
}

export function resolveAvatar(avatarRef) {
    if (avatarRef === 'player' || !avatarRef) {
        return './src/images/' + (G.playerAvatar === 'male' ? 'chico' : 'chica') + '.webp';
    }
    if (avatarRef === 'companion') {
        return G.playerAvatar === 'female'
            ? './src/images/levels/marcos_portrait_doubt.webp'
            : './src/images/chica.webp';
    }
    return avatarRef;
}

export function resolveSpeaker(speakerRef, isPlayer = false) {
    if (isPlayer || speakerRef === 'player' || speakerRef === '{name}' || speakerRef === 'Tú') {
        return G.playerName?.trim() || (G.playerAvatar === 'female' ? 'Jugadora' : 'Jugador');
    }
    return formatText(speakerRef);
}
