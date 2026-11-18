import { ref, computed, watch, onMounted, onUnmounted } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.js';
import { LEVELS } from '../data.js';
import {
    G, answerQuestion, advanceLevelStep, backToLevelSelect,
    fire, spawnFloater, formatText, resolveAvatar, resolveSpeaker
} from '../store.js';
import { resolveBackground } from '../utils/backgrounds.js';
import { playSfx } from '../utils/audio.js';

// ── Composable reutilizable de animación de texto ──────────────────────────
function useTextAnimation() {
    const displayed   = ref('');
    const isAnimating = ref(false);
    let   _timer      = null;

    const start = (fullText) => {
        clearTimeout(_timer);
        const mode = G.textAnimation;
        if (!mode || mode === 'none') {
            displayed.value   = fullText;
            isAnimating.value = false;
            return;
        }
        if (mode === 'fade') {
            displayed.value   = fullText;
            isAnimating.value = true;
            _timer = setTimeout(() => { isAnimating.value = false; }, 650);
            return;
        }
        // typewriter
        displayed.value   = '';
        isAnimating.value = true;
        let i = 0;
        const type = () => {
            if (i <= fullText.length) {
                displayed.value = fullText.slice(0, i);
                i++;
                _timer = setTimeout(type, 22);
            } else {
                isAnimating.value = false;
            }
        };
        type();
    };

    const skipToEnd = (fullText) => {
        clearTimeout(_timer);
        displayed.value   = fullText;
        isAnimating.value = false;
    };

    const cleanup = () => clearTimeout(_timer);

    return { displayed, isAnimating, start, skipToEnd, cleanup };
}

export default {
    setup() {
        const level = computed(() => LEVELS[G.currentLevel]);
        const step  = computed(() => level.value?.steps?.[G.currentLevelStep]);

        const dialogueIndex = ref(0);
        const answered      = ref(false);
        const selIdx        = ref(null);
        const selCorrect    = ref(false);
        const panelHidden   = ref(false);

        // ── Animación de texto ──
        const { displayed, isAnimating, start, skipToEnd, cleanup } = useTextAnimation();

        // Detección reactiva de orientación vertical
        const isPortrait = ref(
            window.matchMedia('(orientation: portrait)').matches || (window.innerWidth < window.innerHeight)
        );

        const onResize = () => {
            isPortrait.value = window.matchMedia('(orientation: portrait)').matches || (window.innerWidth < window.innerHeight);
        };

        onMounted(() => {
            window.addEventListener('resize', onResize);
            window.addEventListener('orientationchange', onResize);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('orientationchange', onResize);
        });

        const getCurrentStepText = () => {
            const s = step.value;
            if (!s) return '';
            if (s.type === 'situation') return formatText(s.text || '');
            if (s.type === 'conversation') {
                const d = s.dialogues?.[dialogueIndex.value] || s.dialogues?.[0];
                return formatText(d?.text || '');
            }
            return formatText(s.prompt || '');
        };

        // Animación inicial al montar
        onMounted(() => {
            start(getCurrentStepText());
        });
        onUnmounted(() => cleanup());

        // Reset estado al cambiar de paso
        watch(() => G.currentLevelStep, () => {
            dialogueIndex.value = 0;
            answered.value      = false;
            selIdx.value        = null;
            selCorrect.value    = false;
            setTimeout(() => start(getCurrentStepText()), 30);
        });

        // Al cambiar de diálogo dentro de conversation, re-animar
        watch(dialogueIndex, () => {
            start(getCurrentStepText());
        });

        // Diálogo actual en caso de múltiples parlamentos
        const currentDialogue = computed(() => {
            if (step.value?.type === 'conversation' && step.value.dialogues?.length) {
                return step.value.dialogues[dialogueIndex.value] || step.value.dialogues[0];
            }
            return null;
        });

        // Imagen de fondo con selector dinámico WebP (orientación y chico/chica)
        const currentBg = computed(() => {
            return resolveBackground(step.value, G.playerAvatar, isPortrait.value);
        });

        // Avatar predeterminado del jugador según chico / chica
        const defaultAvatar = computed(() =>
            './src/images/' + (G.playerAvatar === 'male' ? 'chico' : 'chica') + '.webp'
        );

        // Textos y hablantes formateados dinámicamente
        const situationText = computed(() => formatText(step.value?.text || ''));

        const activeSpeaker = computed(() => {
            if (!currentDialogue.value) return '';
            return resolveSpeaker(currentDialogue.value.speaker, currentDialogue.value.isPlayer);
        });

        const activeAvatar = computed(() => {
            if (!currentDialogue.value) return defaultAvatar.value;
            return resolveAvatar(currentDialogue.value.avatar);
        });

        const activeDialogueText = computed(() => {
            return formatText(currentDialogue.value?.text || '');
        });

        const choiceSpeaker = computed(() => {
            if (!step.value) return '';
            return resolveSpeaker(step.value.speaker, step.value.isPlayer);
        });

        const choiceAvatar = computed(() => {
            if (!step.value) return defaultAvatar.value;
            return resolveAvatar(step.value.avatar);
        });

        const choicePrompt = computed(() => {
            return formatText(step.value?.prompt || '');
        });

        const currentFeedback = computed(() => {
            if (selIdx.value === null || !step.value?.options?.[selIdx.value]) return '';
            return formatText(step.value.options[selIdx.value].feedback);
        });

        // Avanzar al siguiente diálogo o pasar a la elección
        const nextDialogue = () => {
            playSfx('next');
            if (step.value?.type === 'conversation' && step.value.dialogues?.length) {
                if (dialogueIndex.value < step.value.dialogues.length - 1) {
                    dialogueIndex.value++;
                    return;
                }
            }
            advanceLevelStep();
        };

        const selectOption = (idx, event) => {
            if (answered.value) return;
            const opt = step.value.options[idx];
            selIdx.value     = idx;
            selCorrect.value = opt.correct;
            answered.value   = true;

            answerQuestion(opt.correct);

            const x = event?.clientX ?? window.innerWidth / 2;
            const y = event?.clientY ?? window.innerHeight / 2;

            if (opt.correct) {
                G.flash = 'ok';
                fire(50);
                playSfx('correct');
                spawnFloater(x, y, '¡Correcto! ⭐');
            } else {
                G.shake = true;
                G.flash = 'bad';
                playSfx('wrong');
                spawnFloater(x, y, '¡Incorrecto! 💔', 'var(--warn)');
            }
            setTimeout(() => { G.shake = false; G.flash = null; }, 400);
        };

        // Si eliges mal, el botón de reintentar te lleva al menú
        const retryAndGoToMenu = () => {
            playSfx('click');
            G.currentLevelStep = 0;
            G.levelAllCorrect  = true;
            backToLevelSelect();
        };

        const advance = () => {
            playSfx('next');
            advanceLevelStep();
        };

        return {
            G, level, step, dialogueIndex, currentDialogue, currentBg, defaultAvatar,
            situationText, activeSpeaker, activeAvatar, activeDialogueText,
            choiceSpeaker, choiceAvatar, choicePrompt, currentFeedback, formatText,
            answered, selIdx, selCorrect, isPortrait,
            nextDialogue, selectOption, retryAndGoToMenu, advance, backToLevelSelect,
            displayed, isAnimating, panelHidden,
        };
    },
    template: `
        <section class="vn-screen" v-if="level && step" :style="{ backgroundImage: 'url(' + currentBg + ')' }">

            <!-- ══ BADGE SUPERIOR IZQUIERDO: 'SITUACIÓN' ══ -->
            <div class="vn-top-badge" v-if="step.type === 'situation'">
                {{ step.badge || 'Situación' }}
            </div>

            <!-- ══ HUD SUPERIOR DISCRETO (Volver al mapa) ══ -->
            <div class="vn-top-hud">
                <button class="vn-hud-btn" @click="backToLevelSelect()" title="Volver al mapa de niveles">
                    <span>←</span>
                    <span>Mapa</span>
                </button>
            </div>

            <!-- ══ PANEL ROJO INFERIOR (ESTILO NOVELA VISUAL) ══ -->
            <div class="vn-panel" :class="{ 'vn-panel--hidden': panelHidden }">

                <!-- Botón ojo para ocultar/mostrar el panel -->
                <button
                    class="vn-panel-eye-btn"
                    @click="panelHidden = !panelHidden"
                    :title="panelHidden ? 'Mostrar textos' : 'Ocultar textos y ver fondo'"
                    :aria-label="panelHidden ? 'Mostrar textos' : 'Ocultar textos y ver fondo'"
                >
                    <!-- Icono ojo: para mostrar cuando está oculto -->
                    <svg v-if="panelHidden" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <!-- Icono ojo tachado: para ocultar cuando está visible -->
                    <svg v-else viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                </button>

                <!-- ── 1. LA SITUACIÓN (Fondo + Texto descriptivo) ── -->
                <div v-if="step.type === 'situation'" class="vn-situation-box" v-show="!panelHidden">
                    <p
                        class="vn-situation-text"
                        :class="{ 'vn-text--fade': G.textAnimation === 'fade' && isAnimating }"
                    >
                        {{ displayed }}<span v-if="G.textAnimation === 'typewriter' && isAnimating" class="vn-cursor">▌</span>
                    </p>
                    <div class="vn-situation-actions">
                        <button class="vn-btn-continue" @click="advance()">
                            Continuar
                        </button>
                    </div>
                </div>

                <!-- ── 2. LA CONVERSACIÓN (Avatar + Diálogo + Botón Continuar) ── -->
                <div v-else-if="step.type === 'conversation'" class="vn-dialogue-row" v-show="!panelHidden">
                    <div class="vn-avatar-col" v-if="currentDialogue">
                        <div class="vn-avatar-box">
                            <img
                                :src="activeAvatar"
                                :alt="activeSpeaker"
                                class="vn-avatar-img"
                            >
                        </div>
                        <span class="vn-speaker-label">{{ activeSpeaker }}</span>
                    </div>

                    <div class="vn-dialogue-col" v-if="currentDialogue">
                        <p
                            class="vn-speech-text"
                            :class="{ 'vn-text--fade': G.textAnimation === 'fade' && isAnimating }"
                        >
                            {{ displayed }}<span v-if="G.textAnimation === 'typewriter' && isAnimating" class="vn-cursor">▌</span>
                        </p>
                        <button class="vn-btn-continue" @click="nextDialogue()">
                            Continuar
                        </button>
                    </div>
                </div>

                <!-- ── 3. LA ELECCIÓN (Avatar con duda + Prompt + Botones Pills) ── -->
                <div v-else-if="step.type === 'choice'" class="vn-dialogue-row" v-show="!panelHidden">
                    <div class="vn-avatar-col">
                        <div class="vn-avatar-box vn-avatar-doubt-box">
                            <img
                                :src="choiceAvatar"
                                :alt="choiceSpeaker"
                                class="vn-avatar-img"
                            >
                        </div>
                        <span class="vn-speaker-label">{{ choiceSpeaker }}</span>
                    </div>

                    <div class="vn-dialogue-col">
                        <p
                            class="vn-speech-text vn-choice-prompt"
                            :class="{ 'vn-text--fade': G.textAnimation === 'fade' && isAnimating }"
                        >
                            {{ displayed }}<span v-if="G.textAnimation === 'typewriter' && isAnimating" class="vn-cursor">▌</span>
                        </p>

                        <!-- Botones de selección antes de responder -->
                        <div v-if="!answered" class="vn-choice-options-row">
                            <button
                                v-for="(opt, idx) in step.options"
                                :key="idx"
                                class="vn-choice-pill"
                                @click="selectOption(idx, $event)"
                            >{{ formatText(opt.text) }}</button>
                        </div>

                        <!-- Feedback y opciones tras responder -->
                        <div v-else class="vn-feedback-wrapper">
                            <div class="vn-choice-options-row">
                                <button
                                    v-for="(opt, idx) in step.options"
                                    :key="idx"
                                    class="vn-choice-pill"
                                    :class="{
                                        'correct': opt.correct,
                                        'wrong-picked': idx === selIdx && !opt.correct,
                                        'dimmed': idx !== selIdx && !opt.correct
                                    }"
                                    disabled
                                >
                                    <span v-if="opt.correct">✓ </span>
                                    <span v-else-if="idx === selIdx">✗ </span>
                                    {{ formatText(opt.text) }}
                                </button>
                            </div>

                            <div class="vn-choice-feedback" :class="selCorrect ? 'fb-ok' : 'fb-bad'">
                                <strong>{{ selCorrect ? '¡Correcto! ' : '¡Incorrecto! ' }}</strong>
                                <span>{{ currentFeedback }}</span>
                            </div>

                            <div class="vn-feedback-actions">
                                <!-- Si eligió mal: el botón de reintentar te lleva al menú -->
                                <button v-if="!selCorrect" class="vn-btn-continue vn-btn-retry" @click="retryAndGoToMenu()">
                                    Reintentar (Volver al mapa) ↻
                                </button>
                                <button v-else class="vn-btn-continue" @click="advance()">
                                    Continuar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </section>
    `
};
