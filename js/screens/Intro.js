import { ref, onMounted } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.js';
import { PROCESS, MYTHS } from '../data.js';
import { next } from '../store.js';

export default {
    setup() {
        const openIndex = ref(null);
        const bgLoaded = ref(false); // Estado para controlar la carga del fondo
        
        const toggleMyth = (index) => {
            openIndex.value = openIndex.value === index ? null : index;
        };

        onMounted(() => {
            // Verificamos que el fondo se haya descargado
            const img = new Image();
            img.onload = () => { bgLoaded.value = true; };
            img.onerror = () => { bgLoaded.value = true; }; // Si falla, mostramos el texto igual
            img.src = './src/images/paper.svg';
        });

        return { openIndex, toggleMyth, PROCESS, MYTHS, next, bgLoaded };
    },
    template: `
        <section class="card">
            <span class="tag">Antes de empezar</span>
            
            <div class="paper-container">
                <!-- El texto se mantiene transparente hasta que bgLoaded sea true -->
                <div class="paper-content" :style="{ opacity: bgLoaded ? 1 : 0, transition: 'opacity 0.6s ease-in-out' }">
                    
                    <!-- MENÚ 1: PROCESOS EN FILAS -->
                    <div>
                        <h2 class="paper-title">Proceso</h2>
                        <div class="paper-row" v-for="(s,i) in PROCESS">
                            <strong>{{i+1}}. {{s[0]}}</strong>
                            <div style="font-size: 0.85em; color: #444; margin-top: 4px;">{{s[1]}}</div>
                        </div>
                        <p style="font-size: 0.8em; font-weight: 700; color: #c4202f; margin-top: 14px;">
- Requisitos base: 18 a 65 años, buena salud, sin enfermedades transmisibles.
                        </p>
                    </div>
                    
                    <!-- MENÚ 2: MITOS EN FILAS DESPLEGABLES ANIMADAS -->
                    <div>
                        <h2 class="paper-title">Mitos</h2>
                        <div class="paper-row" v-for="(m,i) in MYTHS" @click="toggleMyth(i)" style="cursor: pointer;">
                            
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <strong>{{m[0]}}</strong>
                                <span class="myth-arrow" :class="{ 'is-open': openIndex === i }">▼</span>
                            </div>
                            
                            <div class="myth-accordion" :class="{ 'is-open': openIndex === i }">
                                <div class="myth-accordion-content">
                                    <div style="margin-top: 8px; color: #2f9e57; font-weight: 700; font-size: 0.9em; padding-bottom: 6px;">
                                        ✔ {{m[1]}}
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                </div>
            </div>
            
            <!-- El botón también aparece con fade-in junto con las letras -->
            <button class="btn red" 
                :style="{ opacity: bgLoaded ? 1 : 0, pointerEvents: bgLoaded ? 'auto' : 'none', transition: 'opacity 0.6s ease-in-out', position: 'sticky', bottom: '24px', zIndex: 10, marginTop: 'auto', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }" 
                @click="next()">Estoy listo, ir al hospital →</button>
        </section>
    `
};