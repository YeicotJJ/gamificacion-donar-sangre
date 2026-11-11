import { next } from '../store.js';

export default {
    setup() {
        return { next };
    },
    template: `
        <section class="card c">
            <span class="tag">Situación 1: Stock hospitalario</span>
            <p>Consultas la reserva del hospital y descubres que el stock de O- está en cero.</p>
            <div class="drop">🩸</div>
            <div class="big">Stock: 0</div>
            <div class="note"><b>Dato:</b> menos del 1.5% de la población en Perú dona sangre de forma voluntaria.</div>
            <button class="btn" @click="next()">Continuar →</button>
        </section>
    `
};