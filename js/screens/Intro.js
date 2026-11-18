import { ref, computed, watch, onMounted, onUnmounted } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.js';
import { G, formatText } from '../store.js';
import { resolveBackground } from '../utils/backgrounds.js';
import { playSfx } from '../utils/audio.js';

// ── Composable reutilizable de animación de texto ──────────────────────────
function useTextAnimation(textRef) {
    const displayed   = ref('');
    const isAnimating = ref(false);
    let   _timer      = null;

    const start = (fullText) => {
        clearTimeout(_timer);
        const mode = G.textAnimation;
        if (mode === 'none') {
            displayed.value   = fullText;
            isAnimating.value = false;
            return;
        }
        if (mode === 'fade') {
            displayed.value   = fullText;
            isAnimating.value = true;
            setTimeout(() => { isAnimating.value = false; }, 600);
            return;
        }
        // typewriter
        displayed.value   = '';
        isAnimating.value = true;
        let i = 0;
        const type = () => {
            if (i <= fullText.length) {
                displayed.value = fullText.slice(0, i);
                i++;
                _timer = setTimeout(type, 22);
            } else {
                isAnimating.value = false;
            }
        };
        type();
    };

    const skipToEnd = (fullText) => {
        clearTimeout(_timer);
        displayed.value   = fullText;
        isAnimating.value = false;
    };

    onUnmounted(() => clearTimeout(_timer));

    return { displayed, isAnimating, start, skipToEnd };
}

const INTRO_SLIDES = [
    {
        bg: './src/images/levels/bg_nivel1_situacion_clean.webp',
        bgVertical: './src/images/levels/bg_nivel1_situacion_clean_v.webp',
        bgMale: null,
        bgMaleVertical: null,
        bgFemale: null,
        bgFemaleVertical:null,
        text: 'Son las 00:17 en el Hospital Regional. Ingresa un paciente en estado crítico por un accidente múltiple en la carretera. Necesita transfusiones de sangre urgentes de grupo O negativo para sobrevivir a la cirugía.'
    },
    {
        bg: './src/images/levels/bg_nivel1_conversacion_clean.webp',
        bgVertical: './src/images/levels/bg_nivel1_conversacion_clean_v.webp',
        bgMale: null,
        bgMaleVertical: null,
        bgFemale: null,
        bgFemaleVertical: null,
        text: 'Al consultar con el Banco de Sangre, la noticia es alarmante: no hay unidades de reserva disponibles. En el Perú, solo entre 4 y 5 de cada 1,000 personas aptas donan de manera voluntaria, por lo que reponer la sangre es una lucha contrarreloj.'
    },
    {
        bg:null,
        bgVertical: null,
        bgMale: './src/images/levels/bg_intro_eleccion_chico.webp',
        bgMaleVertical: './src/images/levels/bg_intro_eleccion_chico_v.webp',
        bgFemale: './src/images/levels/bg_intro_eleccion_chica.webp',
        bgFemaleVertical: './src/images/levels/bg_intro_eleccion_chica_v.webp',
        text: '¡{name}, tienes menos de dos horas para resolver la crisis y conseguir un donante seguro! Cada decisión que tomes puede salvar una vida... o ponerla en peligro. ¿Estás {listo/lista} para tomar las decisiones correctas?'
    }
];

export default {
    setup() {
        const slideIndex  = ref(0);
        const panelHidden = ref(false);

        // ── Animación de texto ──
        const { displayed, isAnimating, start, skipToEnd } = useTextAnimation();

        // Detección reactiva de orientación vertical (modo celular)
        const isPortrait = ref(
            window.matchMedia('(orientation: portrait)').matches || (window.innerWidth < window.innerHeight)
        );

        const onResize = () => {
            isPortrait.value = window.matchMedia('(orientation: portrait)').matches || (window.innerWidth < window.innerHeight);
        };

        onMounted(() => {
            window.addEventListener('resize', onResize);
            window.addEventListener('orientationchange', onResize);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('orientationchange', onResize);
        });

        const currentSlide = computed(() => INTRO_SLIDES[slideIndex.value]);

        // Selector dinámico WebP según orientación y avatar seleccionado
        const currentBg = computed(() => {
            return resolveBackground(currentSlide.value, G.playerAvatar, isPortrait.value);
        });

        const isLast = computed(() => slideIndex.value >= INTRO_SLIDES.length - 1);

        // Texto completo procesado
        const fullText = computed(() => formatText(currentSlide.value.text));

        // Lanzar animación al cambiar diapositiva
        const triggerAnimation = () => {
            start(fullText.value);
        };

        // Lanzar al montar y al cambiar diapositiva
        onMounted(triggerAnimation);
        watch(slideIndex, () => triggerAnimation());

        const nextSlide = () => {
            playSfx('next');
            if (slideIndex.value < INTRO_SLIDES.length - 1) {
                slideIndex.value++;
            } else {
                G.screen = 'levelSelect';
            }
        };

        const goToMap = () => {
            playSfx('click');
            G.screen = 'levelSelect';
        };

        const togglePanel = () => {
            panelHidden.value = !panelHidden.value;
        };

        return {
            slideIndex, currentSlide, currentBg, isLast, isPortrait, G, formatText,
            nextSlide, goToMap,
            displayed, isAnimating, panelHidden, togglePanel,
        };
    },
    template: `
        <section class="vn-screen" :style="{ backgroundImage: 'url(' + currentBg + ')' }">

            <!-- ══ BADGE SUPERIOR IZQUIERDO: 'INTRODUCCIÓN' ══ -->
            <div class="vn-top-badge">
                Introducción
            </div>

            <!-- ══ HUD SUPERIOR DISCRETO (SALTAR) ══ -->
            <div class="vn-top-hud">
                <button class="vn-hud-btn" @click="goToMap()" title="Saltar al mapa de niveles">
                    <span>Saltar</span>
                    <span>⏩</span>
                </button>
            </div>

            <!-- ══ PANEL ROJO INFERIOR (ESTILO SITUACIÓN DEL NIVEL) ══ -->
            <div class="vn-panel" :class="{ 'vn-panel--hidden': panelHidden }">

                <!-- Botón ojo para ocultar/mostrar el panel -->
                <button
                    class="vn-panel-eye-btn"
                    @click="togglePanel()"
                    :title="panelHidden ? 'Mostrar textos' : 'Ocultar textos y ver fondo'"
                    :aria-label="panelHidden ? 'Mostrar textos' : 'Ocultar textos y ver fondo'"
                >
                    <!-- Icono ojo: para mostrar cuando está oculto -->
                    <svg v-if="panelHidden" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <!-- Icono ojo tachado: para ocultar cuando está visible -->
                    <svg v-else viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                </button>

                <div class="vn-situation-box" v-show="!panelHidden">
                    <p
                        class="vn-situation-text"
                        :class="{ 'vn-text--fade': G.textAnimation === 'fade' && isAnimating }"
                    >{{ displayed }}<span v-if="G.textAnimation === 'typewriter' && isAnimating" class="vn-cursor">▌</span></p>
                    <div class="vn-situation-actions">
                        <button class="vn-btn-continue" @click="nextSlide()">
                            {{ isLast ? '¡Ir al mapa! 🗺️' : 'Continuar' }}
                        </button>
                    </div>
                </div>
            </div>

        </section>
    `
};
