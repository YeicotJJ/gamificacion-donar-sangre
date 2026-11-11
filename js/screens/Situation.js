import { next } from '../store.js';

export default {
    setup() {
        return { next };
    },
    template: `
        <section class="card">
            <span class="tag">Situación inicial</span>
            <div class="drop">🏥</div>
            <p>Es medianoche en un hospital de Piura. Ingresa un paciente en estado crítico por un accidente de tránsito con hemorragia masiva. Su grupo sanguíneo es <b>O negativo</b>.</p>
            <div class="note"><b>¿De dónde proviene la sangre que salvará esta vida en las próximas dos horas?</b></div>
            <button class="btn" @click="next()">Continuar →</button>
        </section>
    `
};