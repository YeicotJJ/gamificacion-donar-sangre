import { onMounted } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.js';
import { CASES } from '../data.js';
import { G, hits, next, unlock, fire } from '../store.js';

export default {
    setup() {
        const h = hits();
        const n = CASES.length;
        
        onMounted(() => {
            if (h === n) {
                unlock("Ruta perfecta");
                fire(160);
            }
        });
        
        return { 
            h, n, G, next 
        };
    },
    template: `
        <section class="card c">
            <span class="tag">Resultado de simulación</span>
            <div class="stars">{{'★'.repeat(h)}}{{'☆'.repeat(n-h)}}</div>
            
            <!-- Mostramos el puntaje final basado en respuestas y rachas -->
            <div class="big">{{G.score}} pts</div>
            
            <p>Respuesta óptima en <b>{{h}} de {{n}}</b> decisiones</p>
            <div>
                <span class="badge" v-for="b in G.badges">🏅 {{b}}</span>
            </div>
            <div class="note" :class="h===n?'ok':''">
                {{h===n?'¡Ruta perfecta! Una donación a tiempo hace la diferencia.':'Cada buena decisión hace la diferencia.'}}
            </div>
            <button class="btn" @click="next()">Continuar →</button>
        </section>
    `
};