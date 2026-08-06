import { Sermon } from './types';
import { newId } from './split';

// Sermón de ejemplo ORIGINAL (contenido propio, no de terceros).
// Sirve como plantilla para mostrar el flujo lista → detalle → carrusel → Modo Predicar.
export function seedSermons(): Sermon[] {
  const now = Date.now();
  return [
    {
      id: newId('s'),
      number: '001',
      title: 'El ancla del alma',
      date: '05/08/2026',
      intro:
        'Toda tormenta pone a prueba dónde echamos raíces. Cuando el viento arrecia, no sobrevive el barco más grande, sino el que está bien anclado. La esperanza no es un deseo frágil: es el ancla que sostiene el alma cuando todo lo demás se mueve. Hoy quiero recordarte que tu ancla no depende de la calma del mar, sino de la firmeza de Aquel a quien está sujeta.',
      keyVerse: {
        book: 57,
        chapter: 6,
        verse: 19,
        ref: 'He 6:19',
        text: 'La cual tenemos como segura y firme ancla del alma, y que entra hasta dentro del velo;',
      },
      points: [
        {
          id: newId(),
          heading: '1. El ancla no evita la tormenta',
          bodyMd:
            'Tener fe no es tener el mar en calma; es tener dónde sostenerte cuando no lo está.\n\nEl ancla no discute con las olas: solo se aferra a lo firme.',
        },
        {
          id: newId(),
          heading: '2. La fuerza está en lo que no se ve',
          bodyMd:
            'El ancla trabaja bajo el agua, donde nadie la aplaude.\n\nLo que sostiene tu vida no siempre es visible; muchas veces es lo que hiciste a solas con Dios.',
        },
        {
          id: newId(),
          heading: '3. Anclados en la esperanza, no en las circunstancias',
          bodyMd:
            'Las circunstancias cambian; la promesa no.\n\nAncla tu alma en lo eterno y ninguna marea podrá arrastrarte del todo.',
        },
      ],
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    },
  ];
}
