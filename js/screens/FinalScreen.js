import { onMounted } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.js';
import { G, restart, fire } from '../store.js';

export default {
    setup() {
        onMounted(() => {
            fire(200);
            setTimeout(() => fire(150), 800);
        });
        return { G, restart };
    },
    template: `
        <section class="card c final-screen">

            <!-- Fondo decorativo -->
            <div class="final-bg-circles"></div>

            <!-- Encabezado -->
            <div class="final-stars-row">
                <span class="final-star" style="animation-delay:0s">⭐</span>
                <span class="final-star" style="animation-delay:0.2s">⭐</span>
                <span class="final-star" style="animation-delay:0.4s">⭐</span>
            </div>

            <h1 class="final-title">¡Lo lograste!</h1>

            <!-- Sellado / Certificado -->
            <div class="final-seal-wrap">
                <div class="final-seal">
                    <div class="final-seal-inner">
                        <div class="seal-icon">🫀</div>
                        <div class="seal-title">Sellado de</div>
                        <div class="seal-title2">Donante Voluntario</div>
                        <div class="seal-name">{{ G.playerName }}</div>
                        <div class="seal-stars">⭐⭐⭐</div>
                        <div class="seal-subtitle">{{ G.playerAvatar === 'female' ? 'Heroína de la donación · Piura' : 'Héroe de la donación · Piura' }}</div>
                    </div>
                </div>
            </div>

            <!-- Mensaje -->
            <div class="final-message">
                <p>
                    Has superado todos los retos, reunido tus <strong>3 estrellas ⭐⭐⭐</strong>
                    y comprendido la gran verdad sobre la donación de sangre en Piura.
                </p>
                <p>
                    Como premio a tu esfuerzo, compromiso y por haber aprendido a decir
                    <strong>NO al mercado negro</strong> y <strong>SÍ a la solidaridad</strong>,
                    te llevas tu <strong>Sellado de Donante Voluntario virtual</strong>.
                </p>
                <p class="final-call">
                    ¡Ahora estás {{ G.playerAvatar === 'female' ? 'lista para ser una verdadera agente' : 'listo para ser un verdadero agente' }} de cambio y motivar a más personas en la vida real!
                </p>
            </div>

            <button class="btn final-restart-btn" @click="restart()">
                ↺ Jugar de nuevo
            </button>
        </section>
    `
};
