// js/components/SettingsModal.js — Modal de Opciones y Configuración de Audio/Pantalla
import { ref, computed } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.js';
import { G, restart, saveSettings, TEXT_SIZES, applyTextSize, updateDesktopMode } from '../store.js';
import { playSfx, updateBgmVolume } from '../utils/audio.js';

export default {
    setup() {
        const showConfirmReset = ref(false);

        const close = () => {
            playSfx('click');
            G.showSettingsModal = false;
            showConfirmReset.value = false;
        };

        const setOrientation = (mode) => {
            playSfx('click');
            G.orientationMode = mode;
            updateDesktopMode();
            saveSettings();
        };

        const setTextSize = (sizeId) => {
            playSfx('click');
            G.textSize = sizeId;
            applyTextSize(sizeId);
            saveSettings();
        };

        const currentTextSizeLabel = computed(() => {
            return TEXT_SIZES.find(s => s.id === G.textSize)?.label || 'Normal';
        });

        const onMusicInput = () => {
            if (G.musicMuted && G.musicVolume > 0) {
                G.musicMuted = false;
            }
            updateBgmVolume();
            saveSettings();
        };

        const toggleMusic = () => {
            playSfx('click');
            G.musicMuted = !G.musicMuted;
            updateBgmVolume();
            saveSettings();
        };

        const onSfxInput = () => {
            if (G.sfxMuted && G.sfxVolume > 0) {
                G.sfxMuted = false;
            }
            saveSettings();
        };

        const toggleSfx = () => {
            G.sfxMuted = !G.sfxMuted;
            if (!G.sfxMuted) playSfx('click');
            saveSettings();
        };

        const testSfx = (type = 'correct') => {
            playSfx(type);
        };

        const executeReset = () => {
            playSfx('click');
            restart();
            showConfirmReset.value = false;
            G.showSettingsModal = false;
        };

        return {
            G, showConfirmReset,
            textSizes: TEXT_SIZES, currentTextSizeLabel, setTextSize,
            close, setOrientation,
            onMusicInput, toggleMusic,
            onSfxInput, toggleSfx, testSfx,
            executeReset
        };
    },
    template: `
        <div class="modal-overlay" @click.self="close()">
            <div class="modal-content settings-modal-content">
                <button class="modal-close" @click="close()">×</button>

                <h2 class="settings-modal-title">
                    ⚙️ Opciones de la aventura
                </h2>

                <!-- ── 1. MODO DE PANTALLA (ORIENTACIÓN) ── -->
                <div class="settings-section">
                    <label class="settings-label">
                        <strong>📱 Modo de pantalla:</strong>
                        <span class="settings-subtext">Adapta el mapa y los fondos automáticamente</span>
                    </label>

                    <div class="settings-mode-pills">
                        <button
                            class="settings-mode-btn"
                            :class="{ active: G.orientationMode === 'auto' }"
                            @click="setOrientation('auto')"
                        >
                            🔄 Automático
                        </button>
                        <button
                            class="settings-mode-btn"
                            :class="{ active: G.orientationMode === 'horizontal' }"
                            @click="setOrientation('horizontal')"
                        >
                            🖥️ Horizontal (PC)
                        </button>
                        <button
                            class="settings-mode-btn"
                            :class="{ active: G.orientationMode === 'vertical' }"
                            @click="setOrientation('vertical')"
                        >
                            📱 Vertical (Móvil)
                        </button>
                    </div>
                </div>

                <!-- ── 2. TAMAÑO DE TEXTOS (5 NIVELES PREDEFINIDOS) ── -->
                <div class="settings-section">
                    <div class="settings-slider-header">
                        <label class="settings-label">
                            <strong>🔤 Tamaño del texto:</strong>
                            <span class="settings-subtext">5 tamaños para ajustar la lectura en diálogos y pantallas</span>
                        </label>
                        <span class="settings-val">{{ currentTextSizeLabel }}</span>
                    </div>

                    <div class="settings-text-size-grid">
                        <button
                            v-for="size in textSizes"
                            :key="size.id"
                            class="settings-size-btn"
                            :class="{ active: G.textSize === size.id }"
                            @click="setTextSize(size.id)"
                            :title="size.label"
                        >
                            <span class="size-letter" :style="{ fontSize: size.sampleSize }">A</span>
                            <span class="size-name">{{ size.shortLabel }}</span>
                        </button>
                    </div>

                    <!-- Vista previa en vivo -->
                    <div class="settings-size-preview">
                        <div class="preview-header">
                            <span>Vista previa:</span>
                            <span class="preview-badge">{{ currentTextSizeLabel }}</span>
                        </div>
                        <p class="preview-text">
                            «Cada donación voluntaria salva vidas en momentos críticos.»
                        </p>
                    </div>
                </div>

                <!-- ── 3. VOLUMEN DE MÚSICA ── -->
                <div class="settings-section">
                    <div class="settings-slider-header">
                        <span class="settings-label">
                            <strong>🎵 Música de fondo:</strong>
                        </span>
                        <div class="settings-slider-meta">
                            <span class="settings-val">{{ G.musicMuted ? 'Silenciado' : G.musicVolume + '%' }}</span>
                            <button class="settings-mute-btn" @click="toggleMusic()" :title="G.musicMuted ? 'Activar música' : 'Silenciar música'">
                                {{ G.musicMuted ? '🔇' : '🔊' }}
                            </button>
                        </div>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        v-model.number="G.musicVolume"
                        @input="onMusicInput"
                        class="settings-range-slider"
                    >
                </div>

                <!-- ── 4. VOLUMEN DE EFECTOS (SFX) ── -->
                <div class="settings-section">
                    <div class="settings-slider-header">
                        <span class="settings-label">
                            <strong>🔔 Efectos de sonido:</strong>
                        </span>
                        <div class="settings-slider-meta">
                            <span class="settings-val">{{ G.sfxMuted ? 'Silenciado' : G.sfxVolume + '%' }}</span>
                            <button class="settings-mute-btn" @click="toggleSfx()" :title="G.sfxMuted ? 'Activar efectos' : 'Silenciar efectos'">
                                {{ G.sfxMuted ? '🔇' : '🔊' }}
                            </button>
                        </div>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        v-model.number="G.sfxVolume"
                        @input="onSfxInput"
                        class="settings-range-slider"
                    >
                    <div class="settings-test-row">
                        <button class="settings-test-btn" @click="testSfx('correct')">
                            Probar acierto 🔔
                        </button>
                        <button class="settings-test-btn" @click="testSfx('wrong')">
                            Probar error 💔
                        </button>
                        <button class="settings-test-btn" @click="testSfx('star')">
                            Probar estrella ⭐
                        </button>
                    </div>
                </div>

                <!-- ── 6. REINICIAR TODA LA GAMIFICACIÓN ── -->
                <div class="settings-danger-section">
                    <div v-if="!showConfirmReset">
                        <button class="btn btn-warning-reset" @click="showConfirmReset = true">
                            ↺ Reiniciar toda la gamificación
                        </button>
                    </div>
                    <div v-else class="settings-confirm-box">
                        <p style="margin: 0 0 10px; font-weight: 700; color: #dc2626;">
                            ⚠️ ¿Estás seguro de que deseas reiniciar todo el progreso, estrellas y volver al inicio?
                        </p>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn red" style="flex: 1; margin: 0; padding: 10px;" @click="executeReset()">
                                Sí, reiniciar todo
                            </button>
                            <button class="btn" style="flex: 1; margin: 0; padding: 10px; background: var(--mut);" @click="showConfirmReset = false">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>

                <button class="btn red" style="margin-top: 14px;" @click="close()">
                    Cerrar
                </button>
            </div>
        </div>
    `
};
