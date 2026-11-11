import { G } from '../store.js';

export default {
    setup() {
        return { G };
    },
    template: `
        <!-- MARCADOR DE PUNTOS (Aparece a partir del Perfil, G.i > 0) -->
        <div class="hud" style="width: 100%; display: flex; justify-content: flex-end;">
            <div style="display: flex; gap: 8px;">
                <span>⭐ {{G.score}} pts</span>
                <span v-if="G.streak > 1">🔥 x{{G.streak}}</span>
            </div>
        </div>

        <!-- IMAGEN FLOTANTE EXPEDIENTE -->
        <!-- v-if="G.i >= 4" hace que solo aparezca desde la Situación 1 (Stock hospitalario) en adelante -->
        <button v-if="G.i >= 4" class="btn-expediente" @click="G.showExpediente = true" title="Abrir Expediente">
            <img src="./src/images/expediente.webp" alt="Expediente">
        </button>
    `
};