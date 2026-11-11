import { reactive } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.js';
import { CASES } from './data.js';

export const G = reactive({
    i: 0,
    picks: [],
    score: 0,
    streak: 0,
    badges: [],
    toast: null,
    playerName: '',
    playerAvatar: null,
    // --- JUICING STATES ---
    shake: false,
    flash: null,
    floaters: [],
    showExpediente: false
});

export const bestOf = c => c.o[0].m <= c.o[1].m ? 0 : 1; 

export function fire(n = 80) {
    if (window.confetti) confetti({ particleCount: n, spread: 75, origin: { y: .7 } });
}

export function unlock(b) {
    if (G.badges.includes(b)) return;
    G.badges.push(b);
    G.toast = b;
    setTimeout(() => G.toast = null, 2600);
}

// --- JUICING: Textos Flotantes ---
let floaterId = 0;
export function spawnFloater(x, y, text, color = 'var(--ok)') {
    const id = floaterId++;
    G.floaters.push({ id, x, y, text, color });
    setTimeout(() => {
        G.floaters = G.floaters.filter(f => f.id !== id);
    }, 1000); // Se elimina después de la animación
}

export function next() {
    G.i++;
}

// Actualizamos pick para recibir el evento del ratón ($event)
export function pick(ci, k, event) {
    const ok = k === bestOf(CASES[ci]);
    G.picks[ci] = k;
    
    // Obtenemos coordenadas del clic (o centro por defecto)
    const x = event ? event.clientX : window.innerWidth / 2;
    const y = event ? event.clientY : window.innerHeight / 2;
    
    if (ok) {
        G.streak++;
        const pts = 100 + (G.streak * 50);
        G.score += pts;
        
        unlock(CASES[ci].badge);
        fire(50);
        
        // Efectos Visuales de Acierto
        G.flash = 'ok';
        spawnFloater(x, y, '+' + pts + ' 🌟');
    } else {
        G.streak = 0;
        
        // Efectos Visuales de Fallo
        G.shake = true;
        G.flash = 'bad';
        spawnFloater(x, y, '¡Fallo! 💔', 'var(--warn)');
    }

    // Limpiamos los efectos globales rápido
    setTimeout(() => { G.shake = false; G.flash = null; }, 400);

    // PAUSA DRAMÁTICA antes de cambiar de pantalla (Juicing)
    setTimeout(() => {
        next();
    }, 600); 
}

export const hits = () => G.picks.filter((k, i) => k === bestOf(CASES[i])).length;

export const restart = () => {
    Object.assign(G, { 
        i: 0, picks: [], score: 0, streak: 0, badges: [], toast: null, 
        shake: false, flash: null, floaters: [], showExpediente: false,
        playerName: '', playerAvatar: null, 
    });
};