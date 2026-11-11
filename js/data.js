export const BASE = 15;

export const PROCESS = [
    ["Registro y entrevista", "Datos personales y cuestionario de salud, confidencial."],
    ["Chequeo previo", "Peso, presión arterial, pulso y hemoglobina."],
    ["Donación", "Dura unos 10 a 15 minutos; se extrae cerca de 450 ml."],
    ["Descanso y refrigerio", "Reposo breve, hidratación y algo de comer."],
    ["Tamizaje y fraccionamiento", "Se analiza la unidad (VIH, hepatitis, sífilis, Chagas) y se separa en componentes."]
];

export const MYTHS = [
    ["“Los tatuajes me impiden donar”", "Mito. Un tatuaje antiguo no impide donar; si es reciente se pide un período de espera."],
    ["“Donar me debilita”", "Mito. El cuerpo repone el volumen en horas y los glóbulos rojos en semanas."],
    ["“Si tuve hepatitis de niño ya no puedo”", "Depende del caso: se evalúa en la entrevista médica, no se descarta por cuenta propia."],
    ["“Donar engorda o adelgaza”", "Mito. No altera tu peso."],
    ["“Hay que pagar o dar sangre en reposición”", "Lo ideal es la donación voluntaria y gratuita: es la más segura."]
];

export const CASES = [
    {
        tag: "Situación 2: Llamada a la familia",
        badge: "Mito derribado",
        txt: "La familia del paciente está desesperada y aparecen mitos comunes: “Tengo tatuajes”, “Tuve hepatitis de niño”, “Me voy a quedar débil”. ¿Qué haces?",
        o: [
            { t: "Informar y aclarar los mitos", s: "Informar", m: 20, f: "¡Correcto! Los tatuajes no descartan la donación y la debilidad es un mito. Criterios reales: buena salud general, edad entre 18 y 65 años, sin enfermedades transmisibles. (Un tatuaje reciente suele pedir un tiempo de espera; el banco de sangre lo evalúa.)" },
            { t: "Exigir 4 donantes de inmediato", s: "Exigir 4", m: 50, f: "La presión genera miedo y rechazo: muchos familiares se retiran o llegan sin información y varios quedan diferidos. Se pierde tiempo valioso." }
        ]
    },
    {
        tag: "Situación 3: Donante pagado",
        badge: "Cero comercio",
        txt: "En la puerta del hospital, una persona ofrece “vender” su sangre para agilizar el trámite: «Te pago por tu sangre…». ¿Aceptas la donación?",
        o: [
            { t: "No, busco donación voluntaria", s: "Rechazar", m: 0, f: "Bien. El pago comercial incentiva a ocultar conductas de riesgo, aumentando el riesgo de infecciones como VIH, hepatitis B/C y Chagas. Se recomienda siempre la donación voluntaria y gratuita." },
            { t: "Sí, acepto", s: "Aceptar", m: 35, f: "Riesgo alto: quien cobra suele ocultar conductas de riesgo (VIH, hepatitis B/C, Chagas). Además, los tamizajes pueden descartar la unidad y hay que empezar de nuevo." }
        ]
    },
    {
        tag: "Situación 4: ¿Dónde conseguir la sangre?",
        badge: "Red voluntaria",
        txt: "Los bancos de sangre en Piura tienen presupuesto limitado y no alcanzan para toda la demanda. ¿Qué haces?",
        o: [
            { t: "Activar la red de donantes voluntarios registrados", s: "Red voluntaria", m: 15, f: "Excelente. Contar con donantes voluntarios habituales y campañas permanentes evita depender de la emergencia. Menos del 1.5% de la población en Perú dona de forma voluntaria: cada donante cuenta." },
            { t: "Esperar a que el banco de sangre reponga stock", s: "Esperar", m: 45, f: "Con presupuesto limitado y baja donación voluntaria, la reposición es lenta e incierta. Esperar sin actuar consume tiempo crítico." }
        ]
    }
];