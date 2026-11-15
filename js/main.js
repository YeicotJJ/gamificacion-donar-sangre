import { createApp, computed, ref, onMounted, watch } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.js';
import { G, next, applyTextSize, updateDesktopMode } from './store.js';

// Pantallas
import Start           from './screens/Start.js';
import SelectCharacter from './screens/SelectCharacter.js';
import Intro           from './screens/Intro.js';
import LevelSelect     from './screens/LevelSelect.js';
import LevelPlay       from './screens/LevelPlay.js';
import LevelResult     from './screens/LevelResult.js';
import FinalScreen     from './screens/FinalScreen.js';

// Componentes globales
import SettingsModal   from './components/SettingsModal.js';
import { initAudio }   from './utils/audio.js';

// Imágenes a precargar (todas en formato .webp)
const ASSETS = [
    './src/images/circular-progress.webp',
    './src/images/fondo.webp',
    './src/images/fondo_v.webp',
    './src/images/fondo_chico.webp',
    './src/images/fondo_chico_v.webp',
    './src/images/fondo_chica.webp',
    './src/images/fondo_chica_v.webp',
    './src/images/chico.webp',
    './src/images/chica.webp',
    './src/images/levels/bg_nivel1_situacion_clean.webp',
    './src/images/levels/bg_nivel1_situacion_clean_v.webp',
    './src/images/levels/bg_nivel1_situacion_chico.webp',
    './src/images/levels/bg_nivel1_situacion_chico_v.webp',
    './src/images/levels/bg_nivel1_situacion_chica.webp',
    './src/images/levels/bg_nivel1_situacion_chica_v.webp',
    './src/images/levels/bg_nivel1_conversacion_clean.webp',
    './src/images/levels/bg_nivel1_conversacion_clean_v.webp',
    './src/images/levels/bg_nivel1_conversacion_chico.webp',
    './src/images/levels/bg_nivel1_conversacion_chico_v.webp',
    './src/images/levels/bg_nivel1_conversacion_chica.webp',
    './src/images/levels/bg_nivel1_conversacion_chica_v.webp',
    './src/images/levels/bg_nivel1_eleccion_clean.webp',
    './src/images/levels/bg_nivel1_eleccion_clean_v.webp',
    './src/images/levels/bg_nivel1_eleccion_chico.webp',
    './src/images/levels/bg_nivel1_eleccion_chico_v.webp',
    './src/images/levels/bg_nivel1_eleccion_chica.webp',
    './src/images/levels/bg_nivel1_eleccion_chica_v.webp',
    './src/images/levels/marcos_portrait_talk.webp',
    './src/images/levels/marcos_portrait_doubt.webp',
];

// Pantallas lineales de intro (controladas por G.i)
// 0 → Start  |  1 → SelectCharacter  |  2 → Intro  → LevelSelect (via G.screen)
const INTRO = [
    { c: Start          },
    { c: SelectCharacter },
    { c: Intro          },
];

const App = {
    setup() {
        const isLoading = ref(true);
        const progress  = ref(0);

        onMounted(() => {
            applyTextSize(G.textSize);
            updateDesktopMode();

            const total = ASSETS.length;
            let loaded = 0;
            if (total === 0) { isLoading.value = false; return; }
            ASSETS.forEach(url => {
                const img = new Image();
                const advance = () => {
                    loaded++;
                    progress.value = Math.floor((loaded / total) * 100);
                    if (loaded === total) setTimeout(() => { isLoading.value = false; }, 400);
                };
                img.onload  = advance;
                img.onerror = advance;
                img.src = url;
            });
        });

        watch(() => G.textSize, (newSize) => {
            applyTextSize(newSize);
        });

        watch(() => G.orientationMode, () => {
            updateDesktopMode();
        });

        // Router
        const curComponent = computed(() => {
            const s = G.screen;
            if (s === 'levelSelect') return { c: LevelSelect, p: {} };
            if (s === 'levelPlay')   return { c: LevelPlay,   p: {} };
            if (s === 'levelResult') return { c: LevelResult,  p: {} };
            if (s === 'final')       return { c: FinalScreen,  p: {} };
            // Intro lineal
            if (G.i < INTRO.length) return { c: INTRO[G.i].c, p: {} };
            return { c: LevelSelect, p: {} };
        });

        return { G, curComponent, isLoading, progress };
    },
    components: {
        SettingsModal
    },
    template: `
        <!-- CARGA -->
        <div v-if="isLoading" class="loading-screen">
            <img src="./src/images/circular-progress.webp" class="spinner" alt="">
            <p>Cargando... {{ progress }}%</p>
            <div class="loading-bar-container">
                <div class="loading-bar-fill" :style="{ width: progress + '%' }"></div>
            </div>
        </div>

        <!-- APP -->
        <div v-else
            :class="{ 'juicing-shake': G.shake }"
            :style="{ pointerEvents: G.flash ? 'none' : 'auto' }"
        >
            <div class="juicing-flash" :class="G.flash"></div>

            <div
                v-for="f in G.floaters" :key="f.id"
                class="floating-text"
                :style="{ left: f.x + 'px', top: f.y + 'px', color: f.color }"
            >{{ f.text }}</div>

            <!-- BOTÓN FLOTANTE GLOBAL DE OPCIONES (accesible en todo momento) -->
            <button
                class="global-settings-trigger"
                @click="G.showSettingsModal = true"
                title="Opciones y sonido"
            >
                ⚙️
            </button>

            <Transition name="slide">
                <component
                    :is="curComponent.c"
                    v-bind="curComponent.p"
                    :key="G.screen + '-' + G.i + '-' + G.currentLevel + '-' + G.currentLevelStep"
                />
            </Transition>

            <!-- MODAL GLOBAL DE OPCIONES -->
            <SettingsModal v-if="G.showSettingsModal" />

            <Transition name="pop">
                <div class="toast" v-if="G.toast">⭐ {{ G.toast }}</div>
            </Transition>
        </div>
    `
};

const app = createApp(App);
Object.assign(app.config.globalProperties, { G, next });
app.mount('#app');
