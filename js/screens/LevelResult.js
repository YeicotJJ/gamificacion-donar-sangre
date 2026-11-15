import { onMounted } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.js';
import { LEVELS } from '../data.js';
import { G, backToLevelSelect, goToFinal, fire, formatText } from '../store.js';
import { playSfx } from '../utils/audio.js';

export default {
    setup() {
        const ci       = G.currentLevel;
        const level    = LEVELS[ci];
        const earned   = G.levelStars[ci];
        const allStars = G.levelStars.every(Boolean);
        const isLast   = ci === LEVELS.length - 1;

        onMounted(() => {
            if (earned) {
                fire(100);
                playSfx('star');
            } else {
                playSfx('wrong');
            }
        });

        return { earned, allStars, isLast, level, G, ci, LEVELS, formatText, backToLevelSelect, goToFinal };
    },
    template: `
        <section class="card c lr-screen">

            <!-- GANÓ ESTRELLA -->
            <template v-if="earned">
                <span class="tag" style="background:var(--ok); align-self:center;">
                    ⭐ ¡Nivel superado!
                </span>

                <!-- Estrella animada -->
                <div class="lr-star-anim">⭐</div>

                <!-- Mensaje de recompensa -->
                <p class="lr-reward-msg">{{ formatText(level.rewardMsg) }}</p>
                <p class="lr-reward-sub">¡Te llevas tu <strong>Estrella {{ ci + 1 }}</strong> de 3!</p>

                <!-- Estrellas acumuladas -->
                <div class="lr-stars-row">
                    <span v-for="(s, i) in G.levelStars" :key="i" class="lr-star-pip" :class="{ earned: s }">
                        {{ s ? '⭐' : '☆' }}
                    </span>
                </div>

                <!-- Botón: ir al sellado si ya tiene todas -->
                <button v-if="allStars" class="btn red lr-cta" @click="goToFinal()">
                    🎖️ ¡Ver tu Sellado de Donante!
                </button>
                <button v-else class="btn red lr-cta" @click="backToLevelSelect()">
                    ← Volver al mapa
                </button>
            </template>

            <!-- NO GANÓ ESTRELLA -->
            <template v-else>
                <span class="tag" style="background:var(--warn); align-self:center;">
                    Inténtalo de nuevo
                </span>
                <div class="lr-fail-icon">💔</div>
                <p class="lr-fail-msg">
                    Algunas respuestas no fueron las óptimas. ¡La estrella te espera cuando aciertes!
                </p>
                <div class="lr-stars-row">
                    <span v-for="(s, i) in G.levelStars" :key="i" class="lr-star-pip" :class="{ earned: s }">
                        {{ s ? '⭐' : '☆' }}
                    </span>
                </div>
                <button class="btn red lr-cta" @click="backToLevelSelect()">
                    ↺ Volver al mapa e intentar de nuevo
                </button>
            </template>

        </section>
    `
};
