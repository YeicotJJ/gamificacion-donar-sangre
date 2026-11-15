import { ref, computed } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.js';
import { G, next } from '../store.js';

export default {
    setup() {
        const name   = ref(G.playerName);
        const avatar = ref(G.playerAvatar);

        const selectAvatar = (type) => { avatar.value = type; };

        const canContinue = computed(() => name.value.trim().length > 0 && avatar.value !== null);

        const saveAndNext = () => {
            if (canContinue.value) {
                G.playerName   = name.value.trim();
                G.playerAvatar = avatar.value;
                next();
            }
        };

        return { name, avatar, selectAvatar, canContinue, saveAndNext };
    },
    template: `
        <section class="card">
            <span class="tag">¡Hola!</span>
            <h2>¡Bienvenido!</h2>
            <p style="line-height:1.6; margin-bottom:20px;">
                ¡Qué bueno tenerte por aquí! Para empezar esta aventura sobre la donación de sangre
                en Piura, escribe tu nombre y elige tu avatar favorito.
                <br><br>
                ¡Cada nivel superado te dará una estrella ⭐ y al final te espera una gran sorpresa!
            </p>

            <input
                type="text"
                v-model="name"
                class="name-input"
                placeholder="Tu nombre..."
                maxlength="15"
            >

            <div class="avatar-grid">
                <!-- Familiar femenina -->
                <div
                    class="avatar-card"
                    :class="{ selected: avatar === 'female' }"
                    @click="selectAvatar('female')"
                >
                    <img src="./src/images/chica.webp" alt="Mujer">
                    <div>Familiar ♀</div>
                </div>
                <!-- Familiar masculino -->
                <div
                    class="avatar-card"
                    :class="{ selected: avatar === 'male' }"
                    @click="selectAvatar('male')"
                >
                    <img src="./src/images/chico.webp" alt="Hombre">
                    <div>Familiar ♂</div>
                </div>
            </div>

            <button
                class="btn red"
                :style="{
                    opacity: canContinue ? 1 : 0.5,
                    pointerEvents: canContinue ? 'auto' : 'none',
                    position: 'sticky', bottom: '24px', zIndex: 10, marginTop: 'auto'
                }"
                @click="saveAndNext()"
            >
                ¡Comenzar la aventura! →
            </button>
        </section>
    `
};
