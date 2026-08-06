export interface DictionaryEntry {
  word: string;
  definition: {
    es: string;
    en: string;
  };
}

export const BIBLE_DICTIONARY: DictionaryEntry[] = [
  {
    word: 'Kadosh',
    definition: {
      es: 'Santo. Palabra hebrea que significa separado, consagrado o apartado para Dios. Describe la santidad y pureza divina.',
      en: 'Holy. Hebrew word meaning separated, consecrated or set apart for God. Describes divine holiness and purity.',
    }
  },
  {
    word: 'Logos',
    definition: {
      es: 'Palabra. Término griego que significa palabra, razón o mensaje divino. En Juan 1:1 se refiere a Jesús como la Palabra de Dios.',
      en: 'Word. Greek term meaning word, reason or divine message. In John 1:1 it refers to Jesus as the Word of God.',
    }
  },
  {
    word: 'Ágape',
    definition: {
      es: 'Amor incondicional. El amor más alto en el cristianismo, el amor sacrificial de Dios hacia la humanidad.',
      en: 'Unconditional love. The highest form of love in Christianity, God\'s sacrificial love for humanity.',
    }
  },
  {
    word: 'Metanoia',
    definition: {
      es: 'Arrepentimiento. Cambio de mente o transformación del pensamiento que resulta en un cambio de dirección moral.',
      en: 'Repentance. Change of mind or transformation of thought resulting in moral change of direction.',
    }
  },
  {
    word: 'Dunamis',
    definition: {
      es: 'Poder. Fuerza o capacidad divina. La raíz de la palabra "dinamo". Poder transformador y milagroso.',
      en: 'Power. Divine strength or capacity. The root of the word "dynamo". Transforming and miraculous power.',
    }
  },
  {
    word: 'Soteria',
    definition: {
      es: 'Salvación. Rescate, liberación y sanidad espiritual. Significa ser salvado del pecado y sus consecuencias.',
      en: 'Salvation. Rescue, liberation and spiritual healing. Means to be saved from sin and its consequences.',
    }
  },
  {
    word: 'Shalom',
    definition: {
      es: 'Paz. Palabra hebrea que significa paz, completitud, bienestar y armonía. Va más allá de la ausencia de conflicto.',
      en: 'Peace. Hebrew word meaning peace, wholeness, well-being and harmony. Goes beyond the absence of conflict.',
    }
  },
  {
    word: 'Koinonia',
    definition: {
      es: 'Comunión. Participación, compañerismo o comunidad. La relación íntima entre creyentes y con Dios.',
      en: 'Communion. Participation, fellowship or community. Intimate relationship between believers and with God.',
    }
  },
  {
    word: 'Maranatha',
    definition: {
      es: 'El Señor viene. Frase aramea que expresa la expectativa del regreso de Jesucristo.',
      en: 'The Lord comes. Aramaic phrase expressing expectation of Jesus Christ\'s return.',
    }
  },
  {
    word: 'Elohim',
    definition: {
      es: 'Dios. Nombre hebreo plural para Dios que enfatiza la majestad, poder y autoridad divina.',
      en: 'God. Hebrew plural name for God emphasizing divine majesty, power and authority.',
    }
  },
  {
    word: 'Jehová',
    definition: {
      es: 'Señor. Nombre divino sagrado, frecuentemente traducido como SEÑOR. Significa "El que es" o "existencia eterna".',
      en: 'Lord. Sacred divine name, frequently translated as LORD. Means "He who is" or "eternal existence".',
    }
  },
  {
    word: 'Mesías',
    definition: {
      es: 'Ungido. Palabra que significa "el que es ungido" o "el escogido". Referencia a Jesucristo como el Salvador prometido.',
      en: 'Anointed. Word meaning "the one who is anointed" or "the chosen one". Reference to Jesus Christ as the promised Savior.',
    }
  },
  {
    word: 'Evangelio',
    definition: {
      es: 'Buenas noticias. Mensaje de salvación y redención a través de Jesucristo. Los primeros cuatro libros del Nuevo Testamento.',
      en: 'Good news. Message of salvation and redemption through Jesus Christ. The first four books of the New Testament.',
    }
  },
  {
    word: 'Parábola',
    definition: {
      es: 'Comparación. Relato corto que ilustra una verdad espiritual mediante un ejemplo o comparación.',
      en: 'Comparison. Short narrative illustrating spiritual truth through an example or comparison.',
    }
  },
  {
    word: 'Gracia',
    definition: {
      es: 'Favor inmerecido. El regalo gratuito de Dios de salvación sin depender de las obras humanas. Amor sin merecimiento.',
      en: 'Undeserved favor. God\'s free gift of salvation not dependent on human works. Love without merit.',
    }
  },
];

export function searchDictionary(query: string, language: 'es' | 'en' = 'es'): DictionaryEntry[] {
  const lowerQuery = query.toLowerCase().trim();
  return BIBLE_DICTIONARY.filter(entry =>
    entry.word.toLowerCase().includes(lowerQuery)
  );
}
