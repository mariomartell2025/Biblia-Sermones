import { Devotional } from '../types';
import { newId } from '../split';

// Devocionales CURADOS (contenido original propio, no genérico), coherentes con la Biblia.
// Sirven de ejemplo y de respaldo cuando aún no hay backend de IA conectado.
export function seedDevotionals(): Devotional[] {
  const now = Date.now();
  return [
    {
      id: newId('d'),
      date: '05/08/2026',
      title: 'Los que esperan',
      theme: 'Esperar en Dios',
      keyVerse: {
        book: 22, chapter: 40, verse: 31, ref: 'Is 40:31',
        text: 'Mas los que esperan á Jehová tendrán nuevas fuerzas; levantarán las alas como águilas, correrán, y no se cansarán, caminarán, y no se fatigarán.',
      },
      source: 'curado',
      createdAt: now,
      points: [
        { id: newId(), kind: 'pensamiento', heading: 'Esperar no es no hacer nada',
          body: 'En la Biblia, esperar en Dios no es cruzarse de brazos: es cambiar la fuente de mi fuerza. El águila no bate las alas contra la tormenta; se apoya en el viento que la sostiene.' },
        { id: newId(), kind: 'reflexion', heading: 'La fatiga tiene una causa',
          body: 'Muchas veces me canso no por hacer demasiado, sino por sostenerlo todo con mis propias fuerzas. La renovación llega cuando suelto el peso en Aquel que no se fatiga.' },
        { id: newId(), kind: 'aplicacion', heading: 'Hoy',
          body: 'Antes de resolver el día a la carrera, dale a Dios los primeros cinco minutos. No para pedirle fuerzas para tu plan, sino para recibir el suyo.' },
        { id: newId(), kind: 'oracion', heading: 'Oración',
          body: 'Señor, cambio mi prisa por tu paso. Renueva mis fuerzas hoy, no para volar lejos de ti, sino más cerca. Amén.' },
      ],
    },
    {
      id: newId('d'),
      date: '04/08/2026',
      title: 'Árbol junto al agua',
      theme: 'Raíces profundas',
      keyVerse: {
        book: 18, chapter: 1, verse: 3, ref: 'Sal 1:3',
        text: 'Y será como el árbol plantado junto á arroyos de aguas, que da su fruto en su tiempo, y su hoja no cae; y todo lo que hace, prosperará.',
      },
      source: 'curado',
      createdAt: now - 86400000,
      points: [
        { id: newId(), kind: 'pensamiento', heading: 'El fruto se ve; la raíz no',
          body: 'Todos quieren el fruto, pocos cuidan la raíz. Pero el árbol que permanece verde en sequía no es el más alto: es el que echó raíces hacia el agua escondida.' },
        { id: newId(), kind: 'reflexion', heading: '"A su tiempo"',
          body: 'El salmo no promete fruto inmediato, sino fruto "en su tiempo". La vida con Dios no siempre es rápida, pero es constante: hoja que no cae.' },
        { id: newId(), kind: 'aplicacion', heading: 'Hoy',
          body: 'Identifica una raíz que necesitas regar esta semana: una amistad, un hábito de oración, una verdad que olvidaste. Riégala aunque nadie lo note.' },
        { id: newId(), kind: 'oracion', heading: 'Oración',
          body: 'Padre, hazme árbol junto a tu corriente. Cuando venga la sequía, que mis raíces te encuentren. Amén.' },
      ],
    },
    {
      id: newId('d'),
      date: '03/08/2026',
      title: 'Fuerza en la grieta',
      theme: 'Gracia en la debilidad',
      keyVerse: {
        book: 46, chapter: 12, verse: 9, ref: '2Co 12:9',
        text: 'Y me ha dicho: Bástate mi gracia; porque mi potencia en la flaqueza se perfecciona.',
      },
      source: 'curado',
      createdAt: now - 2 * 86400000,
      points: [
        { id: newId(), kind: 'pensamiento', heading: 'Por donde entra la luz',
          body: 'Pablo pidió que le quitaran la debilidad; Dios le dio gracia para atravesarla. A veces la grieta no es el problema: es por donde entra la luz.' },
        { id: newId(), kind: 'reflexion', heading: 'Suficiente',
          body: '"Bástate mi gracia." No dice "te daré más fuerzas"; dice "yo soy suficiente". La respuesta a tu límite no siempre es más de ti, sino más de Él.' },
        { id: newId(), kind: 'aplicacion', heading: 'Hoy',
          body: 'Deja de esconder esa área donde te sientes débil. Nómbrala delante de Dios y pídele, no que la borre, sino que la use.' },
        { id: newId(), kind: 'oracion', heading: 'Oración',
          body: 'Señor, donde soy débil, sé tú mi fuerza. Que tu gracia me baste hoy. Amén.' },
      ],
    },
  ];
}
