export interface DictionaryEntry {
  word: string;
  origin?: { es: string; en: string };
  definition: {
    es: string;
    en: string;
  };
  // Para palabras compuestas de varias raíces (frecuente en hebreo bíblico),
  // desglosa cada parte y su significado individual.
  breakdown?: { es: string; en: string };
}

export const BIBLE_DICTIONARY: DictionaryEntry[] = [
  {
    word: 'Kadosh',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Santo. Palabra hebrea que significa separado, consagrado o apartado para Dios. Describe la santidad y pureza divina.',
      en: 'Holy. Hebrew word meaning separated, consecrated or set apart for God. Describes divine holiness and purity.',
    }
  },
  {
    word: 'Logos',
    origin: { es: 'Griego', en: 'Greek' },
    definition: {
      es: 'Palabra. Término griego que significa palabra, razón o mensaje divino. En Juan 1:1 se refiere a Jesús como la Palabra de Dios.',
      en: 'Word. Greek term meaning word, reason or divine message. In John 1:1 it refers to Jesus as the Word of God.',
    }
  },
  {
    word: 'Ágape',
    origin: { es: 'Griego', en: 'Greek' },
    definition: {
      es: 'Amor incondicional. El amor más alto en el cristianismo, el amor sacrificial de Dios hacia la humanidad.',
      en: 'Unconditional love. The highest form of love in Christianity, God\'s sacrificial love for humanity.',
    }
  },
  {
    word: 'Metanoia',
    origin: { es: 'Griego', en: 'Greek' },
    definition: {
      es: 'Arrepentimiento. Cambio de mente o transformación del pensamiento que resulta en un cambio de dirección moral.',
      en: 'Repentance. Change of mind or transformation of thought resulting in moral change of direction.',
    }
  },
  {
    word: 'Dunamis',
    origin: { es: 'Griego', en: 'Greek' },
    definition: {
      es: 'Poder. Fuerza o capacidad divina. La raíz de la palabra "dinamo". Poder transformador y milagroso.',
      en: 'Power. Divine strength or capacity. The root of the word "dynamo". Transforming and miraculous power.',
    }
  },
  {
    word: 'Soteria',
    origin: { es: 'Griego', en: 'Greek' },
    definition: {
      es: 'Salvación. Rescate, liberación y sanidad espiritual. Significa ser salvado del pecado y sus consecuencias.',
      en: 'Salvation. Rescue, liberation and spiritual healing. Means to be saved from sin and its consequences.',
    }
  },
  {
    word: 'Shalom',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Paz. Palabra hebrea que significa paz, completitud, bienestar y armonía. Va más allá de la ausencia de conflicto.',
      en: 'Peace. Hebrew word meaning peace, wholeness, well-being and harmony. Goes beyond the absence of conflict.',
    }
  },
  {
    word: 'Koinonia',
    origin: { es: 'Griego', en: 'Greek' },
    definition: {
      es: 'Comunión. Participación, compañerismo o comunidad. La relación íntima entre creyentes y con Dios.',
      en: 'Communion. Participation, fellowship or community. Intimate relationship between believers and with God.',
    }
  },
  {
    word: 'Maranatha',
    origin: { es: 'Arameo', en: 'Aramaic' },
    definition: {
      es: 'El Señor viene. Frase aramea que expresa la expectativa del regreso de Jesucristo.',
      en: 'The Lord comes. Aramaic phrase expressing expectation of Jesus Christ\'s return.',
    }
  },
  {
    word: 'Elohim',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Dios. Nombre hebreo plural para Dios que enfatiza la majestad, poder y autoridad divina.',
      en: 'God. Hebrew plural name for God emphasizing divine majesty, power and authority.',
    }
  },
  {
    word: 'Jehová',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Señor. Nombre divino sagrado, frecuentemente traducido como SEÑOR. Significa "El que es" o "existencia eterna".',
      en: 'Lord. Sacred divine name, frequently translated as LORD. Means "He who is" or "eternal existence".',
    }
  },
  {
    word: 'Mesías',
    origin: { es: 'Hebreo', en: 'Hebrew' },
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
  {
    word: 'Yaweh',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Nombre divino sagrado, frecuentemente traducido como SEÑOR. Significa "El que es" o existencia eterna.',
      en: 'Sacred divine name, frequently translated as LORD. Means "He who is" or eternal existence.',
    }
  },
  {
    word: 'Shadai',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Dios Todopoderoso. Nombre hebreo que significa "El que es suficiente" o "Dios Fuerte y Poderoso".',
      en: 'God Almighty. Hebrew name meaning "The One who is sufficient" or "Strong and Mighty God".',
    }
  },
  {
    word: 'Belén',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Casa del pan. Pequeño pueblo en Judea donde nació Jesucristo. Sitio histórico y religioso significativo.',
      en: 'House of bread. Small town in Judea where Jesus Christ was born. Significant historical and religious site.',
    },
    breakdown: {
      es: 'Palabra compuesta: "beit" (casa, morada) + "léjem" (pan, alimento) → "casa del pan". Un nombre profético para el lugar donde nació el Pan de Vida (Juan 6:35).',
      en: 'Compound word: "beit" (house, dwelling) + "lechem" (bread, food) → "house of bread". A prophetic name for the place where the Bread of Life was born (John 6:35).',
    },
  },
  {
    word: 'Espíritu Santo',
    definition: {
      es: 'Tercera persona de la Trinidad. Agente divino de santificación, consuelo y poder en la vida cristiana.',
      en: 'Third person of the Trinity. Divine agent of sanctification, comfort and power in Christian life.',
    }
  },
  {
    word: 'Trinidad',
    definition: {
      es: 'Doctrina cristiana de que Dios existe como tres personas: Padre, Hijo y Espíritu Santo, en una sola esencia.',
      en: 'Christian doctrine that God exists as three persons: Father, Son and Holy Spirit, in one essence.',
    }
  },
  {
    word: 'Redención',
    definition: {
      es: 'Acción de rescatar o liberar. Salvación a través de la muerte y resurrección de Jesucristo.',
      en: 'Action of rescuing or liberating. Salvation through the death and resurrection of Jesus Christ.',
    }
  },
  {
    word: 'Justificación',
    definition: {
      es: 'Acto de Dios por el cual declara justo al pecador mediante la fe en Cristo. Imputación de justicia divina.',
      en: 'Act of God by which He declares the sinner righteous through faith in Christ. Imputation of divine justice.',
    }
  },
  {
    word: 'Santificación',
    definition: {
      es: 'Proceso continuo de ser apartado para Dios y hacerse cada vez más como Cristo en carácter y conducta.',
      en: 'Continuous process of being set apart for God and becoming increasingly like Christ in character and conduct.',
    }
  },
  {
    word: 'Resurrección',
    definition: {
      es: 'Levantamiento de los muertos. Especialmente la resurrección de Jesucristo al tercer día después de su muerte.',
      en: 'Rising from the dead. Especially the resurrection of Jesus Christ on the third day after his death.',
    }
  },
  {
    word: 'Arrepentimiento',
    definition: {
      es: 'Cambio de mente y vuelta del pecado. Rechazo del pecado y regreso a Dios en obediencia.',
      en: 'Change of mind and turning from sin. Rejection of sin and return to God in obedience.',
    }
  },
  {
    word: 'Pecado',
    definition: {
      es: 'Transgresión de la ley de Dios. Acto, pensamiento o naturaleza que viola la voluntad y santidad divina.',
      en: 'Transgression of God\'s law. Act, thought or nature that violates divine will and holiness.',
    }
  },
  {
    word: 'Perdón',
    definition: {
      es: 'Remisión de castigo merecido. Acto de Dios de liberar al culpable de la culpa y condenación del pecado.',
      en: 'Remission of deserved punishment. Act of God to free the guilty from guilt and condemnation of sin.',
    }
  },
  {
    word: 'Hesed',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Misericordia pactual. Amor leal e inquebrantable de Dios hacia su pueblo, ligado a su promesa y fidelidad.',
      en: 'Covenant mercy. God\'s loyal, unwavering love toward his people, bound to his promise and faithfulness.',
    }
  },
  {
    word: 'Ruach',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Espíritu, viento o aliento. Palabra hebrea usada para el Espíritu de Dios que da vida y se mueve sobre la creación.',
      en: 'Spirit, wind or breath. Hebrew word used for the Spirit of God that gives life and moves over creation.',
    }
  },
  {
    word: 'Torá',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Ley o instrucción. Los primeros cinco libros de la Biblia (el Pentateuco), la enseñanza fundamental dada a Israel.',
      en: 'Law or instruction. The first five books of the Bible (the Pentateuch), the foundational teaching given to Israel.',
    }
  },
  {
    word: 'Emet',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Verdad. Palabra hebrea que denota firmeza, fidelidad y confiabilidad, no solo exactitud de un hecho.',
      en: 'Truth. Hebrew word denoting firmness, faithfulness and reliability, not just factual accuracy.',
    }
  },
  {
    word: 'Selah',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Pausa, detente. Término usado con frecuencia en los Salmos, probablemente una indicación musical para reflexionar.',
      en: 'Pause, stop. Term frequently used in the Psalms, likely a musical cue to pause and reflect.',
    }
  },
  {
    word: 'Aleluya',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Alaben a Yah. Del hebreo "Hallelu-Yah", una exclamación de alabanza dirigida a Dios.',
      en: 'Praise Yah. From the Hebrew "Hallelu-Yah", an exclamation of praise directed to God.',
    },
    breakdown: {
      es: 'Palabra compuesta: "hallelu" (alaben, forma imperativa plural) + "Yah" (forma corta del nombre divino YHWH) → "alaben a Yah". Aparece al inicio o final de varios Salmos.',
      en: 'Compound word: "hallelu" (praise, plural imperative) + "Yah" (short form of the divine name YHWH) → "praise Yah". Appears at the start or end of several Psalms.',
    },
  },
  {
    word: 'Yeshua',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Forma hebrea del nombre de Jesús. Significa "salvación" o "él salva", de la raíz "yasha" (salvar, liberar).',
      en: 'Hebrew form of the name Jesus. Means "salvation" or "he saves", from the root "yasha" (to save, deliver).',
    },
  },
  {
    word: 'Adonai',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Mi Señor. Título hebreo de majestad para Dios, usado tradicionalmente al leer en voz alta el nombre sagrado YHWH.',
      en: 'My Lord. Hebrew title of majesty for God, traditionally used when reading the sacred name YHWH aloud.',
    },
  },
  {
    word: 'Abba',
    origin: { es: 'Arameo', en: 'Aramaic' },
    definition: {
      es: 'Padre. Término arameo íntimo y familiar, usado por Jesús en Getsemaní (Marcos 14:36) y por los creyentes (Romanos 8:15).',
      en: 'Father. Intimate, familial Aramaic term, used by Jesus in Gethsemane (Mark 14:36) and by believers (Romans 8:15).',
    },
  },
  {
    word: 'Néfesh',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Alma o ser viviente. Palabra hebrea que designa a la persona completa, no solo una parte inmaterial.',
      en: 'Soul or living being. Hebrew word designating the whole living person, not just an immaterial part.',
    },
  },
  {
    word: 'Berit',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Pacto. Palabra hebrea para un acuerdo solemne y vinculante, central en la relación de Dios con su pueblo.',
      en: 'Covenant. Hebrew word for a solemn, binding agreement, central to God\'s relationship with his people.',
    },
  },
  {
    word: 'Shekiná',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Presencia manifiesta de Dios habitando entre su pueblo. Del hebreo "shakán" (habitar, morar).',
      en: 'The manifest presence of God dwelling among his people. From the Hebrew "shakan" (to dwell).',
    },
  },
  {
    word: 'Kairos',
    origin: { es: 'Griego', en: 'Greek' },
    definition: {
      es: 'El momento oportuno o decisivo. Tiempo cualitativo, distinto de "cronos" (el tiempo cronológico que transcurre).',
      en: 'The opportune or decisive moment. Qualitative time, distinct from "chronos" (sequential, measured time).',
    },
  },
  {
    word: 'Cronos',
    origin: { es: 'Griego', en: 'Greek' },
    definition: {
      es: 'Tiempo cronológico y secuencial, el que se mide en horas y días, en contraste con "kairos" (el momento oportuno).',
      en: 'Sequential, measured time — hours and days — in contrast with "kairos" (the opportune moment).',
    },
  },
  {
    word: 'Jaris',
    origin: { es: 'Griego', en: 'Greek' },
    definition: {
      es: 'Gracia. Palabra griega detrás del término "gracia": favor inmerecido y generoso que Dios da libremente.',
      en: 'Grace. The Greek word behind the term "grace": unmerited, generous favor freely given by God.',
    },
  },
  {
    word: 'Pistis',
    origin: { es: 'Griego', en: 'Greek' },
    definition: {
      es: 'Fe. Convicción de la verdad unida a la confianza personal; la palabra griega detrás de "fe" en el Nuevo Testamento.',
      en: 'Faith. Conviction of truth joined with personal trust; the Greek word behind "faith" in the New Testament.',
    },
  },
  {
    word: 'Eclesía',
    origin: { es: 'Griego', en: 'Greek' },
    definition: {
      es: 'Asamblea o "los llamados a salir". Palabra griega traducida como "iglesia" en el Nuevo Testamento.',
      en: 'Assembly or "those called out". Greek word translated as "church" in the New Testament.',
    },
  },
  {
    word: 'Kyrios',
    origin: { es: 'Griego', en: 'Greek' },
    definition: {
      es: 'Señor o Amo. Título griego aplicado a Jesús que afirma su autoridad y divinidad.',
      en: 'Lord or Master. Greek title applied to Jesus affirming his authority and deity.',
    },
  },
  {
    word: 'Pneuma',
    origin: { es: 'Griego', en: 'Greek' },
    definition: {
      es: 'Espíritu, aliento o viento. Palabra griega paralela al hebreo "ruaj", usada para el Espíritu Santo.',
      en: 'Spirit, breath or wind. Greek word paralleling the Hebrew "ruach", used for the Holy Spirit.',
    },
  },
  {
    word: 'Emanuel',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Dios con nosotros. Nombre profético del Mesías anunciado en Isaías 7:14 y cumplido en el nacimiento de Jesús (Mateo 1:23).',
      en: 'God with us. Prophetic name of the Messiah announced in Isaiah 7:14 and fulfilled in the birth of Jesus (Matthew 1:23).',
    },
    breakdown: {
      es: 'Palabra compuesta de tres partes: "im" (con) + "anu" (nosotros) + "El" (Dios) → "Dios con nosotros". Una de las palabras compuestas más conocidas de la profecía bíblica.',
      en: 'Compound word made of three parts: "im" (with) + "anu" (us) + "El" (God) → "God with us". One of the best-known compound words in biblical prophecy.',
    },
  },
  {
    word: 'Amén',
    origin: { es: 'Hebreo', en: 'Hebrew' },
    definition: {
      es: 'Así sea. Palabra hebrea de afirmación y confirmación, de la misma raíz que "emet" (verdad).',
      en: 'So be it. Hebrew word of affirmation and confirmation, from the same root as "emet" (truth).',
    }
  },
];

export function searchDictionary(query: string, language: 'es' | 'en' = 'es'): DictionaryEntry[] {
  const lowerQuery = query.toLowerCase().trim();
  return BIBLE_DICTIONARY.filter(entry =>
    entry.word.toLowerCase().includes(lowerQuery)
  );
}
