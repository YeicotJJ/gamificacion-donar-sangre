import { restart } from '../store.js';

export default {
    setup() {
        return { restart };
    },
    template: `
        <section class="card c">
            <span class="tag">Análisis final: componentes</span>
            <p>Una sola donación se separa en tres componentes:</p>
            <div class="three">
                <div class="comp"><b>🔴 Glóbulos rojos</b>Para accidentes o cirugías.</div>
                <div class="comp"><b>🟡 Plaquetas</b>Para pacientes con cáncer o leucemia.</div>
                <div class="comp"><b>🟣 Plasma</b>Para grandes quemados o problemas de coagulación.</div>
            </div>
            <div class="note"><b>Un solo gesto puede ayudar hasta a 3 personas.</b></div>
            <h2 style="margin-top:16px">❤️ Dona sangre. Salva vidas.</h2>
            <button class="btn red" @click="restart()">Finalizar · Empezar de nuevo</button>
        </section>
    `
};