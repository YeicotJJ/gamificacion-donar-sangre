import { ref, computed, onMounted, onUnmounted } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.js';
import { G, next } from '../store.js';
import { resolveBackground } from '../utils/backgrounds.js';

const START_CONFIG = {
    bg: './src/images/fondo.webp',
    bgVertical: './src/images/fondo_v.webp',
    bgMale: './src/images/fondo.webp',
    bgMaleVertical: './src/images/fondo_v.webp',
    bgFemale: './src/images/fondo.webp',
    bgFemaleVertical: './src/images/fondo_v.webp',
};

export default {
    setup() {
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

        const bgUrl = computed(() =>
            resolveBackground(START_CONFIG, G.playerAvatar, isPortrait.value)
        );

        return { next, bgUrl, isPortrait };
    },
    template: `
        <section class="card c start-screen-bg" :style="{
            backgroundImage: 'url(' + bgUrl + ')',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            justifyContent: 'flex-end',
            paddingBottom: '15%'
        }">
            <!-- Botón flotando sobre la imagen -->
            <button class="btn red" style="box-shadow: 0 8px 20px rgba(0,0,0,0.5); max-width: 320px; align-self: center;" @click="next()">
                ▶ Empezar
            </button>
        </section>
    `
};
