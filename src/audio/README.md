# 🎵 Carpeta de Audio / Sonido

Coloca aquí tus archivos de audio para personalizar la música y los efectos sonoros de la gamificación.

### Archivos reconocidos:

| Archivo | Función | Formato recomendado |
|---|---|---|
| `bgm.mp3` | Música de fondo en bucle para todo el juego | MP3 o OGG (en bucle / loop) |
| `click.mp3` | Sonido de pulsación de botones y opciones | MP3 (corto, < 0.2s) |
| `correct.mp3` | Sonido de acierto o elección correcta | MP3 (alegre, < 0.6s) |
| `wrong.mp3` | Sonido de fallo o elección incorrecta | MP3 (< 0.5s) |
| `star.mp3` | Sonido festivo de ganar una estrella | MP3 (< 1.0s) |
| `next.mp3` | Sonido suave de avanzar texto o diálogo | MP3 (< 0.2s) |

> **Nota:** Si no colocas archivos en esta carpeta, el motor de audio (`js/utils/audio.js`) utiliza automáticamente **síntesis de sonido Web Audio en tiempo real**, garantizando que el juego tenga música y efectos siempre funcionales.
