import { CASES } from '../data.js';
import { G, bestOf, next } from '../store.js';

export default {
    setup() {
        const X = [50, 240, 430, 620];
        const Y = j => 34 + j * 52;
        const yy = (lv, idx) => {
            const sp = 2 ** (3 - lv);
            return Y(idx * sp + (sp - 1) / 2);
        };
        const me = G.picks;
        const bt = CASES.map(bestOf);
        const edges = [];
        const leaves = [];
        const path = (x1, y1, x2, y2) => {
            const m = (x1 + x2) / 2;
            return "M" + x1 + "," + y1 + " C" + m + "," + y1 + " " + m + "," + y2 + " " + x2 + "," + y2;
        };
        
        const walk = (lv, idx, pk0) => {
            for (let k = 0; k < 2; k++) {
                const o = CASES[lv].o[k];
                const ci = idx * 2 + k;
                const pk = [...pk0, k];
                const y1 = yy(lv, idx);
                const y2 = yy(lv + 1, ci);
                
                edges.push({
                    d: path(X[lv], y1, X[lv + 1], y2),
                    lv, l: o.s, mx: (X[lv] + X[lv + 1]) / 2, my: (y1 + y2) / 2,
                    x2: X[lv + 1], y2, me: pk.every((v, i) => v === me[i]), best: pk.every((v, i) => v === bt[i])
                });
                
                if (lv === 2) {
                    leaves.push({ y: y2, best: pk.every((v, i) => v === bt[i]), me: pk.every((v, i) => v === me[i]) });
                } else {
                    walk(lv + 1, ci, pk);
                }
            }
        };
        
        walk(0, 0, []);
        edges.sort((a, b) => (a.me || a.best) - (b.me || b.best));
        
        return { 
            X, edges, leaves, next,
            root: { x: X[0], y: yy(0, 0) }, 
            heads: ["Familia", "Donante pagado", "Banco de sangre"] 
        };
    },
    template: `
        <section class="card">
            <span class="tag">Ramificación de decisiones</span>
            <h2>Todos los caminos posibles</h2>
            <p class="mut">Verde: ruta óptima · Rojo: tu ruta. Desliza si no cabe →</p>
            <div class="tl">
                <svg viewBox="0 0 860 440" class="svg">
                    <text v-for="(h,i) in heads" :x="(X[i]+X[i+1])/2" y="16" class="h" text-anchor="middle">{{h}}</text>
                    <path v-for="e in edges" :d="e.d" class="e" :class="{best:e.best,me:e.me&&!e.best}" :style="{animationDelay:(.2+e.lv*.6)+'s'}"/>
                    <circle :cx="root.x" :cy="root.y" r="9" class="nd best"/>
                    <circle v-for="e in edges" :cx="e.x2" :cy="e.y2" r="6" class="nd" :class="{best:e.best,me:e.me&&!e.best}" :style="{animationDelay:(.6+e.lv*.6)+'s'}"/>
                    <text v-for="e in edges" :x="e.mx" :y="e.my-7" text-anchor="middle" class="lb" :style="{animationDelay:(.5+e.lv*.6)+'s'}">{{e.l}}</text>
                    <g v-for="l in leaves" class="lf" style="animation-delay:2.1s">
                        <text v-if="l.best||l.me" :x="X[3]+20" :y="l.y+4" class="lb2" :class="l.best?'g':'r'">{{l.best&&l.me?'★ Tu ruta es la óptima':l.best?'★ Ruta óptima':'◀ Tu ruta'}}</text>
                    </g>
                </svg>
            </div>
            <button class="btn red" @click="next()">Ver mi puntaje →</button>
        </section>
    `
};