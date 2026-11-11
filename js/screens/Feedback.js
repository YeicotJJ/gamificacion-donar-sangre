import { CASES } from '../data.js';
import { G, bestOf, next } from '../store.js';

export default {
    props: ["ci"],
    setup(p) {
        const c = CASES[p.ci];
        const k = G.picks[p.ci];
        const b = bestOf(c);
        return { 
            o: c.o[k], 
            good: k === b,
            next
        };
    },
    template: `
        <section class="card">
            <span class="tag">{{good?'¡Correcto!':'Si eliges eso…'}}</span>
            <div class="note" :class="good?'ok':'bad'">{{good?'✅':'⚠️'}} {{o.f}}</div>
            <button class="btn" @click="next()">Continuar →</button>
        </section>
    `
};