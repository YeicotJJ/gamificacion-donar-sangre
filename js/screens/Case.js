import { CASES } from '../data.js';
import { G, pick } from '../store.js';

export default {
    props: ["ci"],
    setup(props) {
        return { 
            c: CASES[props.ci], 
            pick,
            G
        };
    },
    template: `
        <section class="card">
            <span class="tag">{{c.tag}}</span>
            
            <!-- Foto y lazo del personaje -->
            <div class="player-display">
                <!-- Se evalúa si es 'male' carga chico.svg, si no, chica.svg -->
                <img :src="'./src/images/' + (G.playerAvatar === 'male' ? 'chico' : 'chica') + '.svg'" alt="Avatar">
                <div class="player-ribbon">{{ G.playerName }}</div>
            </div>

            <p>{{c.txt}}</p>
            
            <div class="opts">
                <button class="opt" v-for="(o, k) in c.o" @click="pick(ci, k, $event)">{{o.t}}</button>
            </div>
        </section>
    `
};