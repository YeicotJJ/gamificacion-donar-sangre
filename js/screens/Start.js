import { next } from '../store.js';

export default {
    setup() {
        return { next };
    },
    template: `
        <section class="card c" style="
            background-image: url('../src/images/fondo-menu.svg'); 
            background-size: cover; 
            background-position: center; 
            background-repeat: no-repeat;
            justify-content: flex-end; /* Empuja el botón hacia la parte inferior */
            padding-bottom: 15%; /* Le da espacio para que no pegue con el borde */
        ">
            <!-- Solo queda el botón flotando sobre la imagen -->
            <button class="btn red" style="box-shadow: 0 8px 20px rgba(0,0,0,0.5);" @click="next()">▶ Empezar</button>
        </section>
    `
};