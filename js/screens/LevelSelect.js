import { ref, computed, onMounted, onUnmounted } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.js';
import { G, goToLevel, goToFinal, restart } from '../store.js';
import { LEVELS } from '../data.js';
import { playSfx } from '../utils/audio.js';

export default {
    setup() {
        const windowWidth = ref(window.innerWidth);
        const isPortraitDevice = ref(window.matchMedia('(orientation: portrait)').matches);

        const onResize = () => {
            windowWidth.value = window.innerWidth;
            isPortraitDevice.value = window.matchMedia('(orientation: portrait)').matches;
        };

        onMounted(() => {
            window.addEventListener('resize', onResize);
            window.addEventListener('orientationchange', onResize);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('orientationchange', onResize);
        });

        // Modo celular / vertical reactivo respetando G.orientationMode
        const isMobile = computed(() => {
            if (G.orientationMode === 'vertical') return true;
            if (G.orientationMode === 'horizontal') return false;
            return windowWidth.value <= 768 || isPortraitDevice.value;
        });

        const onNodeClick = (i) => {
            if (G.levelUnlocked[i]) {
                playSfx('click');
                goToLevel(i);
            }
        };

        return { G, LEVELS, onNodeClick, goToFinal, restart, isMobile };
    },
    template: `
        <section class="card level-select-screen">

            <!-- ══ HUD DEL MAPA ══ -->
            <div class="map-hud">
                <div class="map-hud-left">
                    <div class="map-player-chip" v-if="G.playerName">
                        <img :src="'./src/images/' + (G.playerAvatar === 'male' ? 'chico' : 'chica') + '.webp'" alt="">
                        <span>{{ G.playerName }}</span>
                    </div>
                </div>
                <div class="map-hud-right">
                    <button class="hud-btn" @click="G.showHowToPlay = true" title="Cómo jugar">
                        <span class="hud-btn-icon">❓</span>
                        <span class="hud-btn-text">Cómo jugar</span>
                    </button>
                    <button class="hud-btn" @click="G.showProfile   = true" title="Mi perfil">
                        <span class="hud-btn-icon">👤</span>
                        <span class="hud-btn-text">Mi perfil</span>
                    </button>
                </div>
            </div>

            <!-- ══ TÍTULO ══ -->
            <div class="map-title-block">
                <h2 style="margin:0 0 4px;">Mapa de niveles</h2>
                <div class="map-stars-global">
                    <span v-for="(s,i) in G.levelStars" :key="i" class="map-star-icon" :class="{earned: s}">
                        {{ s ? '⭐' : '☆' }}
                    </span>
                    <span class="mut" style="font-size:0.85em; margin-left:6px;">
                        {{ G.levelStars.filter(Boolean).length }} / {{ LEVELS.length }} estrellas
                    </span>
                </div>
            </div>

            <!-- ══ NODOS DE NIVELES (HORIZONTAL EN PC, VERTICAL EN CELULAR) ══ -->
            <div
                class="level-map-horizontal-container"
                :class="{ 'map-vertical': isMobile, 'map-horizontal': !isMobile }"
            >
                <div class="level-map-track">
                    <div
                        v-for="(lv, i) in LEVELS"
                        :key="i"
                        class="level-node"
                        :class="{
                            'node-locked':    i > 0 && !G.levelUnlocked[i],
                            'node-done':      G.levelStars[i],
                            'node-available': G.levelUnlocked[i] && !G.levelStars[i]
                        }"
                        @click="onNodeClick(i)"
                    >
                        <!-- Círculo y conector -->
                        <div class="node-circle-wrap">
                            <div
                                v-if="i < LEVELS.length - 1"
                                class="node-connector"
                                :class="{ 'connector-done': G.levelStars[i] }"
                            ></div>

                            <div class="node-circle">
                                <span v-if="G.levelStars[i]"      class="node-star-icon">⭐</span>
                                <span v-else-if="i > 0 && !G.levelUnlocked[i]">🔒</span>
                                <span v-else class="node-num">{{ i + 1 }}</span>
                            </div>
                        </div>

                        <!-- Tarjeta descriptiva del nivel -->
                        <div class="node-label">
                            <div class="node-level-tag">Nivel {{ i + 1 }}</div>
                            <div class="node-emoji-title">{{ lv.emoji }} {{ lv.title }}</div>
                            <div v-if="G.levelStars[i]"              class="node-done-txt">¡Estrella obtenida! ⭐</div>
                            <div v-else-if="i > 0 && !G.levelUnlocked[i]" class="node-locked-txt">Completa el anterior</div>
                            <div v-else                               class="node-tap">▶ ¡Toca para jugar!</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ══ BANNER Y ACCIÓN DE SELLADO ══ -->
            <div v-if="G.levelStars.every(Boolean)" class="map-actions-block">
                <div class="all-done-banner">
                    🎉 ¡Conseguiste las 3 estrellas! Eres un héroe de la donación.
                </div>
                <button
                    class="btn red all-done-seal-btn"
                    @click="goToFinal()"
                >
                    🎖️ ¡Ver tu Sellado de Donante Voluntario!
                </button>
            </div>

            <!-- ══ MODAL: CÓMO JUGAR ══ -->
            <div v-if="G.showHowToPlay" class="modal-overlay" @click.self="G.showHowToPlay = false">
                <div class="modal-content">
                    <button class="modal-close" @click="G.showHowToPlay = false">×</button>
                    <h2 style="color:var(--navy); margin-bottom:16px; font-size:1.2em;">
                        ¿Cómo jugar y convertirte en un héroe de la donación?
                    </h2>
                    <p style="margin-bottom:16px; line-height:1.6;">
                        ¡Bienvenido a esta aventura! Aquí tomarás decisiones clave para ayudar a una familia en Piura que necesita sangre con urgencia. Sigue estas simples reglas para completar tu misión:
                    </p>
                    <div class="modal-item" style="border-left-color:var(--navy);">
                        <strong>🗺️ Supera los 3 niveles</strong><br>
                        Avanzarás por diferentes situaciones de la vida real. En cada nivel pondrás a prueba lo que sabes tomando decisiones correctas.
                    </div>
                    <div class="modal-item" style="border-left-color:var(--blue);">
                        <strong>👁️ Lee con atención las alternativas</strong><br>
                        En cada pantalla aparecerán opciones. Piensa bien antes de elegir, porque tus decisiones afectarán el rumbo de la historia.
                    </div>
                    <div class="modal-item" style="border-left-color:var(--warn);">
                        <strong>⭐ Gana estrellas</strong><br>
                        Al terminar y superar cada uno de los niveles con éxito, recibirás una estrella. ¡Tu meta es juntar las 3 estrellas!
                    </div>
                    <div class="modal-item" style="border-left-color:var(--ok);">
                        <strong>🎖️ Recompensa</strong><br>
                        Al final de todo el recorrido, si tomaste las decisiones correctas, desbloquearás tu <strong>Sellado de Donante Voluntario</strong> como reconocimiento a tu gran aprendizaje.
                    </div>
                    <button class="btn red" style="margin-top:12px;" @click="G.showHowToPlay = false">¡Entendido!</button>
                </div>
            </div>

            <!-- ══ MODAL: MI PERFIL ══ -->
            <div v-if="G.showProfile" class="modal-overlay" @click.self="G.showProfile = false">
                <div class="modal-content">
                    <button class="modal-close" @click="G.showProfile = false">×</button>

                    <div class="profile-header">
                        <img :src="'./src/images/' + (G.playerAvatar === 'male' ? 'chico' : 'chica') + '.webp'" alt="">
                        <div>
                            <h2 style="margin:0; color:var(--navy);">{{ G.playerName }}</h2>
                            <p class="mut" style="margin:4px 0 0;">
                                {{ G.playerAvatar === 'male' ? 'Familiar masculino' : 'Familiar femenina' }}
                            </p>
                        </div>
                    </div>

                    <h3 style="color:var(--navy); border-bottom:2px solid var(--blue); padding-bottom:8px; margin:16px 0 12px;">
                        ⭐ Mis estrellas
                    </h3>
                    <div
                        v-for="(lv, i) in LEVELS" :key="i"
                        class="modal-item"
                        :class="G.levelStars[i] ? 'ok' : ''"
                        :style="{ opacity: G.levelStars[i] ? 1 : 0.45 }"
                    >
                        <span style="font-size:1.5em; margin-right:10px;">
                            {{ G.levelStars[i] ? '⭐' : '☆' }}
                        </span>
                        <strong>Nivel {{ i + 1 }}: {{ lv.title }}</strong>
                        <span class="mut" style="font-size:0.85em; margin-left:6px;">
                            {{ G.levelStars[i] ? '✅ Obtenida' : '🔒 Sin desbloquear' }}
                        </span>
                    </div>

                    <button class="btn red" style="margin-top:16px;" @click="G.showProfile = false">Cerrar</button>
                </div>
            </div>

        </section>
    `
};
