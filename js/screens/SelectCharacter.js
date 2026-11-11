import { ref, computed } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.js';
import { G, next } from '../store.js';

export default {
    setup() {
        const name = ref(G.playerName);
        const avatar = ref(G.playerAvatar);

        const selectAvatar = (type) => {
            avatar.value = type;
        };

        // El botón solo se activa si hay nombre y avatar seleccionado
        const canContinue = computed(() => name.value.trim().length > 0 && avatar.value !== null);

        const saveAndNext = () => {
            if (canContinue.value) {
                G.playerName = name.value.trim();
                G.playerAvatar = avatar.value;
                next();
            }
        };

        return { name, avatar, selectAvatar, canContinue, saveAndNext };
    },
    template: `
        <section class="card">
            <span class="tag">Perfil</span>
            <h2>Identifícate</h2>
            <p class="mut">Ingresa tu nombre y elige tu avatar para comenzar tu guardia.</p>
            
            <input type="text" v-model="name" class="name-input" placeholder="Tu nombre..." maxlength="15">
            
            <div class="avatar-grid">
                <!-- Tarjeta Mujer -->
                <div class="avatar-card" :class="{ selected: avatar === 'female' }" @click="selectAvatar('female')">
                    <img src="./src/images/chica.webp" alt="Mujer">
                    <div>Doctora</div>
                </div>
                <!-- Tarjeta Hombre -->
                <div class="avatar-card" :class="{ selected: avatar === 'male' }" @click="selectAvatar('male')">
                    <img src="./src/images/chico.webp" alt="Hombre">
                    <div>Doctor</div>
                </div>
            </div>

            <!-- Botón pegado abajo como en Intro -->
            <button class="btn red" 
                :style="{ opacity: canContinue ? 1 : 0.5, pointerEvents: canContinue ? 'auto' : 'none', position: 'sticky', bottom: '24px', zIndex: 10, marginTop: 'auto' }" 
                @click="saveAndNext()">
                Guardar perfil →
            </button>
        </section>
    `
};