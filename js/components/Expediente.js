import { PROCESS, MYTHS, CASES } from '../data.js';
import { G, bestOf } from '../store.js';

export default {
    setup() {
        // Función para saber qué eligió el jugador en cada caso
        const getChoice = (ci) => {
            const pick = G.picks[ci];
            if (pick === undefined) return null;
            const caseData = CASES[ci];
            const isCorrect = pick === bestOf(caseData);
            return {
                tag: caseData.tag,
                text: caseData.o[pick].t,
                isCorrect
            };
        };
        return { G, PROCESS, MYTHS, CASES, getChoice };
    },
    template: `
        <!-- Overlay oscuro. Si haces clic fuera de la caja blanca (.self), se cierra -->
        <div class="modal-overlay" @click.self="G.showExpediente = false">
            <div class="modal-content">
                <button class="modal-close" @click="G.showExpediente = false">×</button>
                
                <!-- Cabecera del expediente -->
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                    <img v-if="G.playerAvatar" :src="'./src/images/' + (G.playerAvatar === 'male' ? 'chico' : 'chica') + '.webp'" style="width: 65px; height: 65px; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15));">
                    <div>
                        <h2 style="margin: 0; color: var(--navy);">Expediente Informátivo</h2>
                        <div style="font-size: 0.95em; color: var(--mut); margin-top: 4px;">
                            <b>{{ G.playerName || 'Guardia' }}</b> · ⭐ {{G.score}} pts
                        </div>
                    </div>
                </div>

                <!-- 1. HISTORIAL DE DECISIONES -->
                <div class="modal-section" v-if="G.picks.length > 0">
                    <h3>Tus Decisiones</h3>
                    <div v-for="(c, ci) in CASES" :key="'case-'+ci">
                        <div v-if="getChoice(ci)" class="modal-item" :class="getChoice(ci).isCorrect ? 'ok' : 'bad'">
                            <strong>{{ getChoice(ci).tag }}</strong><br>
                            <div style="margin: 6px 0; color: var(--mut); font-size: 0.9em;">Elegiste: {{ getChoice(ci).text }}</div>
                            <div style="font-weight: 800; font-size: 0.85em;" :style="{color: getChoice(ci).isCorrect ? 'var(--ok)' : 'var(--warn)'}">
                                {{ getChoice(ci).isCorrect ? '✅ Decisión óptima' : '⚠️ Había una mejor opción' }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 2. PROCESOS -->
                <div class="modal-section">
                    <h3>Proceso de Donación</h3>
                    <div class="modal-item" style="border-left-color: var(--blue);" v-for="(s,i) in PROCESS" :key="'proc-'+i">
                        <strong>{{i+1}}. {{s[0]}}</strong><br>
                        <span style="font-size: 0.85em; color: var(--mut);">{{s[1]}}</span>
                    </div>
                </div>

                <!-- 3. MITOS -->
                <div class="modal-section">
                    <h3>Mitos Comunes</h3>
                    <div class="modal-item" style="border-left-color: var(--blue);" v-for="(m,i) in MYTHS" :key="'myth-'+i">
                        <strong>{{m[0]}}</strong><br>
                        <span style="font-size: 0.85em; color: var(--mut);">{{m[1]}}</span>
                    </div>
                </div>
                
            </div>
        </div>
    `
};