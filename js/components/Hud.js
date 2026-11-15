import { G } from '../store.js';

export default {
    setup() { return { G }; },
    template: `
        <div class="hud">
            <div class="hud-stars-row">
                <span
                    v-for="(s, i) in G.levelStars"
                    :key="i"
                    class="hud-star-pip"
                    :class="{ earned: s }"
                >{{ s ? '⭐' : '☆' }}</span>
            </div>
        </div>
    `
};
