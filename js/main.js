import { createApp, computed, ref, onMounted } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.js';
import { G, next } from './store.js';
import { CASES } from './data.js';

// Importar Componentes Modulares
import Hud from './components/Hud.js';
import Expediente from './components/Expediente.js';
import Start from './screens/Start.js';
import SelectCharacter from './screens/SelectCharacter.js';
import Intro from './screens/Intro.js';
import Situation from './screens/Situation.js';
import Stock from './screens/Stock.js';
import Case from './screens/Case.js';
import Feedback from './screens/Feedback.js';
import Compare from './screens/Compare.js';
import Result from './screens/Result.js';
import Final from './screens/Final.js';

// 1. LISTA DE IMÁGENES A PRECARGAR
// Agrega aquí cualquier imagen nueva que pongas en la carpeta src/images
const ASSETS_TO_PRELOAD = [
    './src/images/circular-progress.webp',
    './src/images/paper.webp',
    './src/images/fondo.webp',
    './src/images/chico.webp',
    './src/images/chica.webp',
    './src/images/expediente.webp'
];
const SCREENS = [
    { c: Start }, { c: SelectCharacter }, { c: Intro }, { c: Situation }, { c: Stock },
    ...CASES.flatMap((_, ci) => [{ c: Case, p: { ci } }, { c: Feedback, p: { ci } }]),
    { c: Compare }, { c: Result }, { c: Final }
];

const App = {
    components: { Hud, Expediente },
    setup() {
        const isLoading = ref(true);
        const progress = ref(0); // Nueva variable para el porcentaje

        onMounted(() => {
            const total = ASSETS_TO_PRELOAD.length;
            let loaded = 0;

            if (total === 0) {
                isLoading.value = false;
                return;
            }

            // Cargamos cada imagen y actualizamos la barra
            ASSETS_TO_PRELOAD.forEach(url => {
                const img = new Image();
                
                // Función que avanza el progreso cuando la imagen carga (o falla)
                const advanceProgress = () => {
                    loaded++;
                    progress.value = Math.floor((loaded / total) * 100);
                    
                    // Si ya cargaron todas, esperamos un instante y quitamos la pantalla
                    if (loaded === total) {
                        setTimeout(() => {
                            isLoading.value = false;
                        }, 450);
                    }
                };

                img.onload = advanceProgress;
                img.onerror = advanceProgress;
                img.src = url;
            });
        });

        return { 
            G, 
            SCREENS, 
            cur: computed(() => SCREENS[G.i]),
            isLoading,
            progress
        };
    },
    template: `
        <!-- PANTALLA DE CARGA CON BARRA -->
        <div v-if="isLoading" class="loading-screen">
            <img src="./src/images/circular-progress.webp" class="spinner" alt="">
            <p>Cargando recursos... {{ progress }}%</p>
            
            <!-- Contenedor de la barra de progreso -->
            <div class="loading-bar-container">
                <div class="loading-bar-fill" :style="{ width: progress + '%' }"></div>
            </div>
        </div>

        <!-- APP PRINCIPAL -->
        <div v-else :class="{ 'juicing-shake': G.shake }" :style="{ pointerEvents: G.flash ? 'none' : 'auto' }">
            <div class="juicing-flash" :class="G.flash"></div>
            
            <div v-for="f in G.floaters" :key="f.id" class="floating-text" :style="{ left: f.x + 'px', top: f.y + 'px', color: f.color }">
                {{ f.text }}
            </div>

            <div class="bar">
                <i v-for="n in SCREENS.length" :class="{on: n - 1 <= G.i}"></i>
            </div>
            
            <Hud v-if="G.i > 0"/>
            <Expediente v-if="G.showExpediente" />
            
            <Transition name="slide">
                <component :is="cur.c" v-bind="cur.p" :key="G.i" />
            </Transition>
            
            <Transition name="pop">
                <div class="toast" v-if="G.toast">🏅 Insignia: {{G.toast}}</div>
            </Transition>
        </div>
    `
};

const app = createApp(App);
Object.assign(app.config.globalProperties, { G, next });
app.mount("#app");