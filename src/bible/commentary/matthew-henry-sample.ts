// PILOTO: Comentario de Matthew Henry traducido al español con IA (Claude), a partir
// del texto ORIGINAL en INGLÉS de DOMINIO PÚBLICO (Matthew Henry Concise Commentary).
//
// LEGAL: el original en inglés es dominio público. Esta traducción es una obra derivada.
// Para que sea TU propiedad exclusiva y licenciable a terceros, requiere un PASE EDITORIAL
// HUMANO (revisión de exactitud/estilo) — la salida cruda de IA no es registrable en EE.UU.
// Por eso cada entrada lleva needsReview: true hasta que un revisor la apruebe.

export type CommentaryEntry = {
  source: 'matthew-henry';
  book: number;      // índice de libro (mismo esquema que la Biblia)
  chapter: number;
  title: string;
  bodyEs: string;    // traducción al español (revisar antes de publicar)
  license: 'dominio-publico-original';
  needsReview: boolean;
};

export const MATTHEW_HENRY_SAMPLE: CommentaryEntry[] = [
  {
    source: 'matthew-henry',
    book: 18,       // Salmos
    chapter: 23,
    title: 'Salmo 23 — El Señor es mi pastor',
    license: 'dominio-publico-original',
    needsReview: true,
    bodyEs:
`"Jehová es mi pastor." En estas palabras se enseña al creyente a expresar su satisfacción en el cuidado del gran Pastor del universo, el Redentor y Preservador de los hombres. Con gozo reflexiona en que tiene un pastor, y que ese pastor es Jehová. Un rebaño de ovejas, mansas e inofensivas, que se alimenta en verdes praderas bajo el cuidado de un pastor hábil, vigilante y tierno, es un emblema de los creyentes que han sido traídos de vuelta al Pastor de sus almas. La mayor abundancia no es más que un pasto seco para el hombre malvado, que solo saborea en ella lo que agrada a los sentidos; pero para el hombre piadoso, que por la fe gusta la bondad de Dios en todos sus deleites, aunque tenga poco del mundo, es un verde prado. El Señor da quietud y contentamiento a la mente, cualquiera que sea la suerte que a uno le toque. Si somos bendecidos con los verdes prados de sus ordenanzas, no pensemos que basta con atravesarlos: permanezcamos en ellos. Los consuelos del Espíritu Santo son las aguas de reposo junto a las cuales son guiados los santos; las corrientes que fluyen de la Fuente de aguas vivas. Solo son guiados junto a esas aguas tranquilas del consuelo aquellos que andan por sendas de justicia. El camino del deber es el camino verdaderamente placentero. La obra de la justicia se hace en paz. Por estas sendas no podemos andar, a menos que Dios nos guíe a ellas y nos guíe en ellas. El descontento y la desconfianza proceden de la incredulidad, y un andar inestable es su consecuencia: confiemos, pues, sencillamente en el cuidado de nuestro Pastor, y escuchemos su voz.

El valle de sombra de muerte puede denotar la aflicción más severa y terrible, o la más oscura disposición de la providencia, bajo la cual el salmista pudiera jamás encontrarse. Entre la parte del rebaño que está en la tierra y la que ya se ha ido al cielo, la muerte se extiende como un valle oscuro que ha de atravesarse al pasar de una a la otra. Pero aun en esto hay palabras que aminoran el terror. Es solo la sombra de muerte: la sombra de una serpiente no pica, ni la sombra de una espada mata. Es un valle, profundo en verdad, oscuro y cenagoso; pero los valles suelen ser fértiles, y así también la muerte misma es fértil en consuelos para el pueblo de Dios. Es un andar a través de él: no se perderán en este valle, sino que llegarán a salvo al monte del otro lado. La muerte es rey de espantos, pero no para las ovejas de Cristo. Cuando llegan a morir, Dios reprenderá al enemigo; los guiará con su vara y los sostendrá con su cayado. Hay suficiente en el evangelio para consolar a los santos al morir, y debajo de ellos están los brazos eternos.

El pueblo del Señor se sienta a su mesa, a disfrutar de las provisiones de su amor. Ni Satanás ni los hombres malvados son capaces de destruir sus consuelos, mientras están ungidos con el Espíritu Santo y beben de la copa de salvación, que siempre está rebosando. La experiencia pasada enseña a los creyentes a confiar en que la bondad y la misericordia de Dios los seguirán todos los días de su vida; y su deseo y determinación es buscar su felicidad aquí, en el servicio a Dios, esperando gozar de su amor para siempre en el cielo. Mientras están aquí, el Señor puede hacer agradable cualquier situación mediante la unción de su Espíritu y los gozos de su salvación. Pero los que quieran ser saciados con las bendiciones de su casa deben mantenerse fieles a los deberes de ella.`,
  },
];
