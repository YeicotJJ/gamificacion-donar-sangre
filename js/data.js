// data.js — Contenido de niveles estructurados en 3 pantallas:
// 1. La Situación (imagen de fondo + texto narrativo inferior con el jugador)
// 2. La Conversación (avatar + diálogo de personajes + intervención activa del jugador)
// 3. La Elección (avatar del jugador + pregunta/dilema + botones de opciones)
//
// Cada pantalla soporta variaciones WebP para el desarrollador:
// - bg: Horizontal genérico (.webp)
// - bgVertical: Vertical / Celular genérico (.webp)
// - bgMale: Horizontal si el jugador es chico (.webp)
// - bgMaleVertical: Vertical / Celular si el jugador es chico (.webp)
// - bgFemale: Horizontal si la jugadora es chica (.webp)
// - bgFemaleVertical: Vertical / Celular si la jugadora es chica (.webp)

export const LEVELS = [
    // ─── NIVEL 1: EL PROCESO PARA DONAR SANGRE ───────────────────────
    {
        id: 0,
        title: 'El proceso para donar sangre',
        desc: 'Aprende cómo y dónde donar',
        emoji: '🩸',
        rewardMsg: '¡Excelente, {name}! Ya conoces a dónde acudir para una donación segura.',
        steps: [
            // Pantalla 1: La Situación
            {
                type: 'situation',
                badge: 'Situación',
                // Opciones de fondo WebP (horizontal, vertical, chico, chica):
                bg: './src/images/levels/bg_nivel1_situacion_clean.webp',
                bgVertical: './src/images/levels/bg_nivel1_situacion_clean_v.webp',
                bgMale: './src/images/levels/bg_nivel1_situacion_chico.webp',
                bgMaleVertical: './src/images/levels/bg_nivel1_situacion_chico_v.webp',
                bgFemale: './src/images/levels/bg_nivel1_situacion_chica.webp',
                bgFemaleVertical: './src/images/levels/bg_nivel1_situacion_chica_v.webp',
                text: '{name} se encuentra conversando con su amigo Marcos sobre los desafíos de salud en Piura. En medio de la charla, Marcos le cuenta con gran preocupación que hace poco un familiar suyo sufrió un accidente y necesitó una transfusión de sangre de emergencia. Al acudir al hospital, se encontraron con un problema crítico: no había unidades disponibles en el banco de sangre, por lo que tuvieron que buscar donantes de manera urgente entre familiares y conocidos.'
            },
            // Pantalla 2: La Conversación
            {
                type: 'conversation',
                bg: './src/images/levels/bg_nivel1_conversacion_clean.webp',
                bgVertical: './src/images/levels/bg_nivel1_conversacion_clean_v.webp',
                bgMale: './src/images/levels/bg_nivel1_conversacion_chico.webp',
                bgMaleVertical: './src/images/levels/bg_nivel1_conversacion_chico_v.webp',
                bgFemale: './src/images/levels/bg_nivel1_conversacion_chica.webp',
                bgFemaleVertical: './src/images/levels/bg_nivel1_conversacion_chica_v.webp',
                dialogues: [
                    {
                        speaker: 'Marcos',
                        avatar: './src/images/levels/marcos_portrait_talk.webp',
                        text: '¡{name}, la encargada del banco de sangre nos explicó que las reservas eran limitadas! Según el último informe de CPI, de cada 1,000 peruanos aptos para donar, solo entre 4 y 5 lo hacen voluntariamente. Por ello, era necesario reponer las unidades utilizadas de inmediato.'
                    },
                    {
                        isPlayer: true,
                        speaker: '{name}',
                        avatar: 'player',
                        text: '¡Qué angustia debieron pasar, Marcos! Pero tranquilo, como {amigo/amiga} quiero acompañarte y poner el hombro para donar. Solo que debemos tener total seguridad sobre el lugar adecuado para hacerlo bien.'
                    },
                    {
                        speaker: 'Marcos',
                        avatar: './src/images/levels/marcos_portrait_doubt.webp',
                        text: '¡Muchísimas gracias por tu apoyo, {name}! Sabía que podía contar contigo. Pero dime, entre tantos establecimientos de salud en Piura... ¿adónde debemos dirigirnos exactamente para donar de forma segura?'
                    }
                ]
            },
            // Pantalla 3: La Elección
            {
                type: 'choice',
                bg: './src/images/levels/bg_nivel1_eleccion_clean.webp',
                bgVertical: './src/images/levels/bg_nivel1_eleccion_clean_v.webp',
                bgMale: './src/images/levels/bg_nivel1_eleccion_chico.webp',
                bgMaleVertical: './src/images/levels/bg_nivel1_eleccion_chico_v.webp',
                bgFemale: './src/images/levels/bg_nivel1_eleccion_chica.webp',
                bgFemaleVertical: './src/images/levels/bg_nivel1_eleccion_chica_v.webp',
                isPlayer: true,
                speaker: '{name}',
                avatar: 'player',
                prompt: 'Para realizar una donación voluntaria, formal y 100% segura, tengo claro que debemos acudir a...',
                options: [
                    {
                        text: 'Posta de salud',
                        correct: false,
                        feedback: '¡Uy, no! En las postas pequeñas no se realizan extracciones ni se gestionan las reservas de sangre para emergencias.'
                    },
                    {
                        text: 'Cualquier área del hospital',
                        correct: false,
                        feedback: 'Aunque los hospitales albergan bancos de sangre, debes acudir específicamente a la unidad autorizada del Banco de Sangre, no a cualquier consultorio general.'
                    },
                    {
                        text: 'Banco de sangre autorizado',
                        correct: true,
                        feedback: '¡Exacto, {name}! Debemos acudir al Banco de Sangre autorizado para conocer los requisitos reales y realizar una donación segura.'
                    }
                ]
            }
        ]
    },

    // ─── NIVEL 2: MITOS SOBRE DONACIÓN ───────────────────────────────
    {
        id: 1,
        title: 'Mitos sobre la donación',
        desc: 'Derriba los mitos más comunes',
        emoji: '💬',
        rewardMsg: '¡Impresionante, {name}! Derribaste los mitos urbanos sobre la donación.',
        steps: [
            // Pantalla 1: La Situación
            {
                type: 'situation',
                badge: 'Situación',
                bg: './src/images/levels/bg_nivel1_situacion_clean.webp',
                bgVertical: './src/images/levels/bg_nivel1_situacion_clean_v.webp',
                bgMale: './src/images/levels/bg_nivel1_situacion_chico.webp',
                bgMaleVertical: './src/images/levels/bg_nivel1_situacion_chico_v.webp',
                bgFemale: './src/images/levels/bg_nivel1_situacion_chica.webp',
                bgFemaleVertical: './src/images/levels/bg_nivel1_situacion_chica_v.webp',
                text: 'Tras la emergencia médica de un familiar, {name} y su familia se reúnen con urgencia en la sala de espera del hospital. El médico de guardia les informa que necesitan dos unidades de reposición antes del mediodía. A pesar de que hay varios familiares jóvenes y sanos reunidos, el miedo, los mitos populares y la desinformación hacen que todos duden y comiencen a dar excusas para no poner el brazo.'
            },
            // Pantalla 2: La Conversación
            {
                type: 'conversation',
                bg: './src/images/levels/bg_nivel1_conversacion_clean.webp',
                bgVertical: './src/images/levels/bg_nivel1_conversacion_clean_v.webp',
                bgMale: './src/images/levels/bg_nivel1_conversacion_chico.webp',
                bgMaleVertical: './src/images/levels/bg_nivel1_conversacion_chico_v.webp',
                bgFemale: './src/images/levels/bg_nivel1_conversacion_chica.webp',
                bgFemaleVertical: './src/images/levels/bg_nivel1_conversacion_chica_v.webp',
                dialogues: [
                    {
                        speaker: 'Don Carlos',
                        avatar: './src/images/levels/marcos_portrait_talk.webp',
                        text: 'Miren muchachos, y escúchame bien tú también, {name}... Yo quisiera ayudar, pero donar sangre te deja débil para siempre y te da una anemia severa. ¡Y ni se les ocurra donar a quienes tengan tatuajes o aretes, porque esa sangre queda prohibida de por vida!'
                    },
                    {
                        isPlayer: true,
                        speaker: '{name}',
                        avatar: 'player',
                        text: '¡Eso es un mito, tío Carlos! El Ministerio de Salud indica que quienes tenemos o tienen tatuajes sí podemos donar si ya pasaron 6 meses. Además, el material es 100% estéril y descartable, y antes de donar te evalúan la hemoglobina para cuidar tu salud.'
                    },
                    {
                        speaker: 'Don Carlos',
                        avatar: './src/images/levels/marcos_portrait_doubt.webp',
                        text: 'Vaya {name}, veo que estás muy bien {informado/informada}... Pero si queremos animar a la familia y no poner en riesgo la salud de nadie, ¿cuál es el requisito físico real que debemos verificar?'
                    }
                ]
            },
            // Pantalla 3: La Elección
            {
                type: 'choice',
                bg: './src/images/levels/bg_nivel1_eleccion_clean.webp',
                bgVertical: './src/images/levels/bg_nivel1_eleccion_clean_v.webp',
                bgMale: './src/images/levels/bg_nivel1_eleccion_chico.webp',
                bgMaleVertical: './src/images/levels/bg_nivel1_eleccion_chico_v.webp',
                bgFemale: './src/images/levels/bg_nivel1_eleccion_chica.webp',
                bgFemaleVertical: './src/images/levels/bg_nivel1_eleccion_chica_v.webp',
                isPlayer: true,
                speaker: '{name}',
                avatar: 'player',
                prompt: 'Para derribar los mitos y animar a la familia a donar hoy mismo, les recuerdo que el requisito básico real es...',
                options: [
                    {
                        text: 'Pesar más de 50 kg y tener entre 18 y 65 años',
                        correct: true,
                        feedback: '¡Excelente, {name}! Son los requisitos de peso y edad básicos del MINSA para asegurar que el organismo tolere la extracción con total seguridad.'
                    },
                    {
                        text: 'No haberse hecho nunca un tatuaje',
                        correct: false,
                        feedback: '¡Falso! Los tatuajes no impiden donar de por vida; solo requieren un periodo de espera seguro de 6 meses.'
                    },
                    {
                        text: 'Estar en ayunas estricto por 24 horas',
                        correct: false,
                        feedback: '¡Peligroso! Nunca dones en ayunas prolongadas; se recomienda un desayuno ligero sin grasas y abundante líquido.'
                    }
                ]
            }
        ]
    },

    // ─── NIVEL 3: BÚSQUEDA DE DONANTE ────────────────────────────────
    {
        id: 2,
        title: 'Búsqueda de donante',
        desc: 'Encuentra la solución segura',
        emoji: '🆘',
        rewardMsg: '¡Felicidades, {name}! Has completado todos los niveles y salvado vidas éticamente.',
        steps: [
            // Pantalla 1: La Situación
            {
                type: 'situation',
                badge: 'Situación',
                bg: './src/images/levels/bg_nivel1_situacion_clean.webp',
                bgVertical: './src/images/levels/bg_nivel1_situacion_clean_v.webp',
                bgMale: './src/images/levels/bg_nivel1_situacion_chico.webp',
                bgMaleVertical: './src/images/levels/bg_nivel1_situacion_chico_v.webp',
                bgFemale: './src/images/levels/bg_nivel1_situacion_chica.webp',
                bgFemaleVertical: './src/images/levels/bg_nivel1_situacion_chica_v.webp',
                text: 'Es medianoche frente a la puerta de emergencias. El banco de sangre del hospital no cuenta con stock disponible del grupo sanguíneo que el familiar de {name} necesita urgentemente y ningún familiar directo es compatible. Desesperados, {name} y {companion} salen a tomar aire a la vereda sin saber a quién recurrir, cuando una persona desconocida se les acerca entre las sombras ofreciendo una salida rápida.'
            },
            // Pantalla 2: La Conversación
            {
                type: 'conversation',
                bg: './src/images/levels/bg_nivel1_conversacion_clean.webp',
                bgVertical: './src/images/levels/bg_nivel1_conversacion_clean_v.webp',
                bgMale: './src/images/levels/bg_nivel1_conversacion_chico.webp',
                bgMaleVertical: './src/images/levels/bg_nivel1_conversacion_chico_v.webp',
                bgFemale: './src/images/levels/bg_nivel1_conversacion_chica.webp',
                bgFemaleVertical: './src/images/levels/bg_nivel1_conversacion_chica_v.webp',
                dialogues: [
                    {
                        speaker: '{companion}',
                        avatar: 'companion',
                        text: '¡{name}, ya llamé a todos nuestros contactos y nadie contesta a esta hora! El médico dice que la operación debe realizarse antes del amanecer o el cuadro se complicará de manera crítica...'
                    },
                    {
                        speaker: 'Intermediario',
                        avatar: './src/images/levels/marcos_portrait_talk.webp',
                        text: 'Buenas noches, amigos... Escuché que necesitan sangre urgente. Yo tengo unidades listas refrigeradas a la vuelta de la esquina. Por 350 soles se las entrego ahorita mismo, sin colas ni preguntas.'
                    },
                    {
                        speaker: '{companion}',
                        avatar: 'companion',
                        text: '¡{name}, es mucho dinero y da desconfianza, pero es una emergencia de vida o muerte! ¿Deberíamos pagarle para asegurar esa sangre y salvar a nuestro familiar?'
                    },
                    {
                        isPlayer: true,
                        speaker: '{name}',
                        avatar: 'player',
                        text: '¡De ninguna manera, {companion}! Comprar sangre en la calle es un peligro mortal: esa sangre clandestina no tiene garantía de tamizaje serológico y puede transmitir VIH, Hepatitis o Chagas. ¡La sangre nunca se compra ni se vende, no arriesgaremos a nuestro familiar!'
                    }
                ]
            },
            // Pantalla 3: La Elección
            {
                type: 'choice',
                bg: './src/images/levels/bg_nivel1_eleccion_clean.webp',
                bgVertical: './src/images/levels/bg_nivel1_eleccion_clean_v.webp',
                bgMale: './src/images/levels/bg_nivel1_eleccion_chico.webp',
                bgMaleVertical: './src/images/levels/bg_nivel1_eleccion_chico_v.webp',
                bgFemale: './src/images/levels/bg_nivel1_eleccion_chica.webp',
                bgFemaleVertical: './src/images/levels/bg_nivel1_eleccion_chica_v.webp',
                isPlayer: true,
                speaker: '{name}',
                avatar: 'player',
                prompt: 'Ante el peligro de comprar sangre en la calle y la oferta de este intermediario, nuestra decisión ética y segura debe ser...',
                options: [
                    {
                        text: 'Comprar la bolsa de sangre del desconocido',
                        correct: false,
                        feedback: '¡Peligro mortal! La sangre del mercado negro ("vampiros") no tiene garantía de tamizaje serológico (VIH, Hepatitis, Chagas) y pone en riesgo letal al paciente.'
                    },
                    {
                        text: 'Pagarle para que entre a donar como familiar',
                        correct: false,
                        feedback: '¡Grave riesgo! Los donantes remunerados mienten en el cuestionario médico para no perder el dinero, ocultando enfermedades o conductas de riesgo.'
                    },
                    {
                        text: 'Rechazar la oferta y solicitar donantes voluntarios',
                        correct: true,
                        feedback: '¡Decisión ejemplar, {name}! La sangre nunca se compra ni se vende. La sangre segura proviene solo de donantes voluntarios altruistas en bancos oficiales.'
                    }
                ]
            }
        ]
    }
];
