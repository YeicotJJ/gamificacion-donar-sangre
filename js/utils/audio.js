// js/utils/audio.js — Motor de audio completo (BGM + SFX) con síntesis Web Audio y soporte de archivos MP3/OGG
import { G } from '../store.js';

let audioCtx = null;
let bgmAudioElement = null;
let bgmSynthInterval = null;
let isBgmPlaying = false;
let userHasInteracted = false;

// Obtener o inicializar el contexto de Web Audio
function getAudioContext() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

// Inicializar en la primera interacción del usuario para cumplir políticas de autoplay
export function initAudio() {
    if (userHasInteracted) return;
    userHasInteracted = true;
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
        ctx.resume();
    }
    // Si la música está habilitada en G, reproducirla
    if (!G.musicMuted && G.musicVolume > 0 && !isBgmPlaying) {
        playBgm();
    }
}

if (typeof window !== 'undefined') {
    window.addEventListener('pointerdown', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// 🎵 MÚSICA DE FONDO (BGM)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Inicia la música de fondo:
 * 1. Intenta cargar './src/audio/bgm.mp3' o './src/audio/bgm.ogg'.
 * 2. Si no existe o falla, reproduce un sintetizador ambiental suave y relajante con Web Audio API.
 */
export function playBgm() {
    if (isBgmPlaying) return;
    const vol = G.musicMuted ? 0 : (G.musicVolume / 100);

    // Intentar reproducir archivo de audio si existe
    if (!bgmAudioElement) {
        bgmAudioElement = new Audio();
        bgmAudioElement.src = './src/audio/bgm.mp3';
        bgmAudioElement.loop = true;
        bgmAudioElement.volume = vol;

        bgmAudioElement.play().then(() => {
            isBgmPlaying = true;
        }).catch(() => {
            // Si el archivo no existe o falla, usar sintetizador ambiental Web Audio
            startAmbientSynthBgm();
        });
    } else {
        bgmAudioElement.volume = vol;
        bgmAudioElement.play().then(() => {
            isBgmPlaying = true;
        }).catch(() => {
            startAmbientSynthBgm();
        });
    }
}

export function pauseBgm() {
    if (bgmAudioElement) {
        bgmAudioElement.pause();
    }
    stopAmbientSynthBgm();
    isBgmPlaying = false;
}

export function updateBgmVolume() {
    const vol = G.musicMuted ? 0 : (G.musicVolume / 100);
    if (bgmAudioElement) {
        bgmAudioElement.volume = vol;
    }
    if (vol === 0 && isBgmPlaying) {
        // Silenciado
    } else if (vol > 0 && !isBgmPlaying && userHasInteracted) {
        playBgm();
    }
}

// Sintetizador ambiental procedural relajante (Pentatónica suave)
function startAmbientSynthBgm() {
    if (bgmSynthInterval) return;
    isBgmPlaying = true;

    const chords = [
        [261.63, 329.63, 392.00], // C mayor (C4, E4, G4)
        [220.00, 261.63, 329.63], // A menor (A3, C4, E4)
        [174.61, 220.00, 261.63], // F mayor (F3, A3, C4)
        [196.00, 246.94, 293.66], // G mayor (G3, B3, D4)
    ];
    let chordIdx = 0;

    const playChordStep = () => {
        if (!isBgmPlaying || G.musicMuted || G.musicVolume === 0) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const vol = (G.musicVolume / 100) * 0.12; // volumen base suave
        const now = ctx.currentTime;
        const currentChord = chords[chordIdx % chords.length];
        chordIdx++;

        currentChord.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            // Ataque suave, sostenido y decaimiento
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(vol / (i + 1), now + 1.2);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 4.0);
        });
    };

    playChordStep();
    bgmSynthInterval = setInterval(playChordStep, 3800);
}

function stopAmbientSynthBgm() {
    if (bgmSynthInterval) {
        clearInterval(bgmSynthInterval);
        bgmSynthInterval = null;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔊 EFECTOS DE SONIDO (SFX)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reproduce un efecto de sonido:
 * Intenta cargar el archivo './src/audio/${name}.mp3'; si no existe,
 * sintetiza el efecto en tiempo real con Web Audio API.
 *
 * @param {'click' | 'correct' | 'wrong' | 'star' | 'next'} type Nombre del efecto
 */
export function playSfx(type = 'click') {
    if (G.sfxMuted || G.sfxVolume === 0) return;

    initAudio();
    const vol = (G.sfxVolume / 100);

    // Intentar archivo de audio personalizado primero
    const fileAudio = new Audio(`./src/audio/${type}.mp3`);
    fileAudio.volume = vol;
    const playPromise = fileAudio.play();

    if (playPromise) {
        playPromise.catch(() => {
            // Si no existe el archivo .mp3, usar síntesis Web Audio
            synthesizeSfx(type, vol);
        });
    } else {
        synthesizeSfx(type, vol);
    }
}

// Síntesis de sonido Web Audio para cada tipo de efecto
function synthesizeSfx(type, volumeMultiplier = 0.8) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    switch (type) {
        case 'click': {
            // Pop / Click nítido de botón
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(750, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

            gain.gain.setValueAtTime(0.35 * volumeMultiplier, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.06);
            break;
        }

        case 'correct': {
            // Campana armónica brillante y ascendente (C5 -> E5 -> G5 -> C6)
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, idx) => {
                const noteTime = now + (idx * 0.08);
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, noteTime);

                gain.gain.setValueAtTime(0.001, noteTime);
                gain.gain.linearRampToValueAtTime(0.3 * volumeMultiplier, noteTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(noteTime);
                osc.stop(noteTime + 0.38);
            });
            break;
        }

        case 'wrong': {
            // Tono descendente de error suave (F#3 -> D3)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(185, now);
            osc.frequency.linearRampToValueAtTime(120, now + 0.28);

            // Filtro paso bajo para que no suene áspero
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(450, now);

            gain.gain.setValueAtTime(0.28 * volumeMultiplier, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.32);
            break;
        }

        case 'star': {
            // Arpegio festivo con campanas mágicas (E5, B5, E6, G#6)
            const starNotes = [659.25, 987.77, 1318.51, 1661.22];
            starNotes.forEach((freq, idx) => {
                const noteTime = now + (idx * 0.09);
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, noteTime);

                gain.gain.setValueAtTime(0.001, noteTime);
                gain.gain.linearRampToValueAtTime(0.35 * volumeMultiplier, noteTime + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(noteTime);
                osc.stop(noteTime + 0.48);
            });
            break;
        }

        case 'next': {
            // Sweep sutil de transición de diálogo
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(650, now + 0.08);

            gain.gain.setValueAtTime(0.2 * volumeMultiplier, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.09);
            break;
        }
    }
}
