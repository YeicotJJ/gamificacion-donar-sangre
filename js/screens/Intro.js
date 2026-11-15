import { ref, computed, onMounted, onUnmounted } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.js';
import { G, formatText } from '../store.js';
import { resolveBackground } from '../utils/backgrounds.js';
import { playSfx } from '../utils/audio.js';

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
        bgMale: './src/images/levels/bg_nivel1_eleccion_chico.webp',
        bgMaleVertical: './src/images/levels/bg_nivel1_eleccion_chico_v.webp',
        bgFemale: './src/images/levels/bg_nivel1_eleccion_chica.webp',
        bgFemaleVertical: './src/images/levels/bg_nivel1_eleccion_chica_v.webp',
        text: '¡{name}, tienes menos de dos horas para resolver la crisis y conseguir un donante seguro! Cada decisión que tomes puede salvar una vida... o ponerla en peligro. ¿Estás {listo/lista} para tomar las decisiones correctas?'
    }
];

export default {
    setup() {
        const slideIndex = ref(0);

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

        return {
            slideIndex, currentSlide, currentBg, isLast, isPortrait, G, formatText,
            nextSlide, goToMap
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
            <div class="vn-panel">
                <div class="vn-situation-box">
                    <p class="vn-situation-text">{{ formatText(currentSlide.text) }}</p>
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
