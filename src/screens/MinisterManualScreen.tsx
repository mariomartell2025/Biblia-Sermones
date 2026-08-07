import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../useTheme';
import { useSettings } from '../SettingsContext';

type Ceremony = 'cena' | 'boda' | 'bautismo' | 'funeral' | 'oracion' | 'presentacion';

const CEREMONIES = {
  boda: {
    es: 'Matrimonio',
    en: 'Wedding',
    icon: '💒',
    content: {
      es: `CEREMONIA DE MATRIMONIO

BIENVENIDA Y PROPÓSITO
"Hermanos, nos reunimos en esta ocasión especial para celebrar la unión de dos
vidas en matrimonio. El matrimonio es una institución divina, una alianza sagrada
donde dos personas se comprometen ante Dios y esta congregación a amarse,
respetarse y servirse mutuamente por el resto de sus vidas."

LECTURA BÍBLICA - FUNDAMENTO DEL MATRIMONIO
Génesis 2:24
"Por tanto, dejará el hombre a su padre y a su madre, y se unirá a su mujer,
y serán una sola carne."

Efesios 5:25-33
"Maridos, amad a vuestras mujeres, así como Cristo amó a la iglesia, y se
entregó a sí mismo por ella..."

PRESENTACIÓN DE LOS CONTRAYENTES
"Presentamos hoy a [nombre] e [nombre], quienes han decidido unir sus vidas
en matrimonio ante Dios. Ellos traen a esta ceremonia sus sueños, esperanzas
y compromiso mutuo."

DECLARACIÓN DE INTENCIONES
Ministro: "¿[Nombre], promete amar, honrar y cuidar a [nombre], en las alegrías
y en las tristezas, en la salud y en la enfermedad, hasta que la muerte les
separe?"
Novio: "Prometo."

Ministro: "¿[Nombre], promete amar, honrar y cuidar a [nombre], en las alegrías
y en las tristezas, en la salud y en la enfermedad, hasta que la muerte les
separe?"
Novia: "Prometo."

INTERCAMBIO DE ANILLOS
"Estos anillos simbolizan la eternidad de vuestro amor. Son círculos sin fin,
que representan un compromiso infinito. Al colocarlos, sellan la promesa de
este día."

[Se intercambian los anillos]

ORACIÓN INTERCESORA
"Padre celestial, mira con amor a esta pareja. Bendice su unión con tu gracia.
Que encuentren en el otro un compañero fiel, un confidente leal y un apoyo
en los caminos de la vida. Guíalos para que construyan un hogar fundado en tu
palabra, en el respeto y en el amor incondicional."

LECTURA ESPECIAL - EL AMOR
1 Corintios 13:4-7
"El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso,
no se envanece..."

EXHORTACIÓN A LA PAREJA
"Que en los momentos difíciles recuerden el compromiso de hoy. Que busquen
siempre la reconciliación antes que el conflicto. Que oren juntos, que se
apoyen mutuamente y que hagan de su hogar un lugar de paz y de testimonio
del amor de Cristo."

PROCLAMACIÓN OFICIAL
"Por la autoridad que me ha sido conferida, declaro que [nombre] e [nombre]
son marido y mujer legítimamente unidos ante Dios y esta congregación. Lo que
Dios ha unido, no lo separe el hombre."

BENDICIÓN NUPCIAL
"Que el Señor los bendiga y los guarde. Que Él haga resplandecer su rostro
sobre ustedes. Que les levante Su rostro y les dé paz. Que Él abundante en
misericordia, proteja su unión, y que caminemos juntos en fe, esperanza y amor.
En el nombre del Padre, del Hijo y del Espíritu Santo, amén."

PRESENTACIÓN A LA CONGREGACIÓN
"Les presentamos como marido y mujer. Les invitamos a rodear a esta pareja
con vuestras oraciones, vuestro amor y vuestro apoyo en el camino que inician
hoy."`,
      en: `WEDDING CEREMONY

WELCOME AND PURPOSE
"Brothers and sisters, we gather on this special occasion to celebrate the union
of two lives in marriage. Marriage is a divine institution, a sacred covenant
where two people commit before God and this congregation to love, respect and
serve one another for the rest of their lives."

BIBLICAL READING - FOUNDATION OF MARRIAGE
Genesis 2:24
"Therefore a man will leave his father and mother and be united to his wife,
and they will become one flesh."

Ephesians 5:25-33
"Husbands, love your wives, just as Christ loved the church and gave himself up
for her..."

PRESENTATION OF THE COUPLE
"We present to you today [name] and [name], who have decided to unite their
lives in marriage before God. They bring to this ceremony their dreams, hopes
and mutual commitment."

DECLARATION OF INTENTIONS
Minister: "Do you, [name], promise to love, honor and cherish [name], in joy
and in sorrow, in health and in sickness, until death parts you?"
Groom: "I do."

Minister: "Do you, [name], promise to love, honor and cherish [name], in joy
and in sorrow, in health and in sickness, until death parts you?"
Bride: "I do."

EXCHANGE OF RINGS
"These rings symbolize the eternity of your love. They are circles without end,
representing an infinite commitment. By placing them, you seal the promise of
this day."

[Rings are exchanged]

INTERCESSORY PRAYER
"Heavenly Father, look with love upon this couple. Bless their union with your
grace. May they find in each other a faithful companion, a loyal confidant and
a support in the paths of life. Guide them to build a home founded on your word,
on respect and on unconditional love."

SPECIAL READING - LOVE
1 Corinthians 13:4-7
"Love is patient, love is kind. It does not envy, it does not boast, it is not
proud..."

EXHORTATION TO THE COUPLE
"In difficult moments, remember the commitment of this day. Always seek reconciliation
before conflict. Pray together, support one another, and make your home a place
of peace and a testimony to the love of Christ."

OFFICIAL PROCLAMATION
"By the authority vested in me, I declare that [name] and [name] are husband
and wife legitimately united before God and this congregation. What God has
joined together, let no one separate."

NUPTIAL BLESSING
"The Lord bless you and keep you. The Lord make his face to shine upon you
and be gracious to you. The Lord lift up his face upon you and give you peace.
May He abound in mercy, protect your union, and may we walk together in faith,
hope and love. In the name of the Father, the Son and the Holy Spirit, amen."

PRESENTATION TO THE CONGREGATION
"We present to you husband and wife. We invite you to surround this couple with
your prayers, your love and your support on the journey they begin today."`,
    }
  },
  cena: {
    es: 'Santa Cena',
    en: 'Communion',
    icon: '🍷',
    content: {
      es: `ADMINISTRACIÓN DE LA SANTA CENA

INTRODUCCIÓN
"Hermanos, hoy celebramos el memorial más sagrado de nuestra fe: la Santa Cena del Señor. Este acto nos transporta al aposento alto, donde Cristo partió el pan y compartió la copa como símbolo de su cuerpo y sangre derramados por nuestros pecados."

LECTURA BÍBLICA
1 Corintios 11:23-26
"Porque yo recibí del Señor lo que también os he enseñado: Que el Señor Jesús, la noche que fue entregado, tomó pan..."

PREDICACIÓN
La Santa Cena es:
• Memorativo: Recordamos el sacrificio de Cristo
• Anticipatorio: Esperamos su regreso
• Espiritual: Nos une con Cristo y la iglesia

EXHORTACIÓN A LA COMUNIÓN
"Que cada creyente examine su corazón. Si hemos creído en Cristo, estamos limpios por su sangre. Si hemos pecado, confesemos. Entonces, participemos dignamente."

PREPARACIÓN
- Verificar que el pan y la copa estén presentes
- Orar por los participantes
- Preparar el corazón en silencio

ORACIÓN POR EL PAN
"Señor Jesús, bendice este pan que representa tu cuerpo inmolado. Que nos recuerde tu amor sin límites y tu sacrificio por nuestros pecados. Hazlos uno en ti."

DISTRIBUCIÓN DEL PAN
El pan se distribuye a todos los comulgantes en memoria del cuerpo de Cristo.

ORACIÓN POR LA COPA
"Señor, bendice esta copa que simboliza tu sangre derramada por la remisión de nuestros pecados. Que beba dignamente quien crea en ti."

DISTRIBUCIÓN DE LA COPA
La copa se reparte a todos los que desean comulgar.

CONCLUSIÓN
"Recordemos que cada vez que comemos este pan y bebemos esta copa, anunciamos la muerte del Señor hasta que Él venga. Que este acto nos fortalezca en fe y nos inspire a vivir consagrados a Cristo."`,
      en: `ADMINISTRATION OF COMMUNION

INTRODUCTION
"Brothers, today we celebrate the most sacred memorial of our faith: the Lord's Supper. This act transports us to the upper room, where Christ broke bread and shared the cup as a symbol of His body and blood shed for our sins."

BIBLICAL READING
1 Corinthians 11:23-26
"For I received from the Lord what I also passed on to you: The Lord Jesus, on the night he was betrayed, took bread..."

PROCLAMATION
The Communion is:
• Memorial: We remember Christ's sacrifice
• Anticipatory: We await His return
• Spiritual: It unites us with Christ and the church

EXHORTATION TO COMMUNION
"Let each believer examine their heart. If we have believed in Christ, we are cleansed by His blood. If we have sinned, let us confess. Then, let us participate worthily."

PREPARATION
- Verify that bread and cup are present
- Pray for the participants
- Prepare hearts in silence

PRAYER FOR THE BREAD
"Lord Jesus, bless this bread which represents Your broken body. May it remind us of Your limitless love and Your sacrifice for our sins. Make us one in You."

DISTRIBUTION OF BREAD
The bread is distributed to all communicants in remembrance of Christ's body.

PRAYER FOR THE CUP
"Lord, bless this cup which symbolizes Your blood shed for the forgiveness of our sins. Let him who believes in You drink worthily."

DISTRIBUTION OF THE CUP
The cup is shared with all who wish to commune.

CONCLUSION
"Remember that each time we eat this bread and drink this cup, we proclaim the Lord's death until He comes. May this act strengthen us in faith and inspire us to live devoted to Christ."`,
    }
  },
  bautismo: {
    es: 'Bautismo',
    en: 'Baptism',
    icon: '💧',
    content: {
      es: `ADMINISTRACIÓN DEL BAUTISMO

BIENVENIDA Y PROPÓSITO
"Hermanos, hoy tenemos el privilegio de bautizar a aquellos que han decidido
seguir a Jesucristo. El bautismo es la declaración pública de fe en Cristo, la
identificación del creyente con la muerte, sepultura y resurrección de nuestro
Señor. Es un acto de obediencia que simboliza el nuevo nacimiento espiritual."

LECTURA BÍBLICA - IMPORTANCIA DEL BAUTISMO
Mateo 28:19-20
"Por tanto, id, y haced discípulos a todas las naciones, bautizándolos en el
nombre del Padre, y del Hijo, y del Espíritu Santo..."

Romanos 6:3-4
"¿O no sabéis que todos los que hemos sido bautizados en Cristo Jesús, hemos
sido bautizados en su muerte?..."

PRESENTACIÓN DE LOS CANDIDATOS
"Presentamos a [nombre(s)] quienes han profundido su fe en Jesucristo y ahora
desean bautizarse como testimonio público de su decisión de seguir a Cristo."

TESTIMONIO PERSONAL
[El candidato comparte brevemente su experiencia de conversión y su decisión
de bautizarse]

INSTRUCCIÓN SOBRE EL SIGNIFICADO DEL BAUTISMO
"El bautismo representa:
• La muerte del viejo hombre de pecado
• La sepultura de nuestra vida pasada
• La resurrección a una nueva vida en Cristo
• Nuestra identificación con la muerte y resurrección de Jesús
• El lavamiento de nuestros pecados por la sangre de Cristo"

PREGUNTAS AL CANDIDATO
Ministro: "¿Crees de todo corazón que Jesucristo es el Hijo de Dios?"
Candidato: "Sí, creo."

Ministro: "¿Has arrepentido de tus pecados y has aceptado a Jesucristo como tu
Salvador y Señor?"
Candidato: "Sí, he arrepentido y lo he aceptado como mi Salvador."

Ministro: "¿Deseas ser bautizado en el nombre del Padre, del Hijo y del
Espíritu Santo?"
Candidato: "Sí, deseo ser bautizado."

ORACIÓN DE BENDICIÓN
"Padre celestial, bendice a este/estos hermano(s) que hoy desea(n) ser bautizado(s).
Que el agua del bautismo sea para él/ella/os un símbolo vivo de su fe. Que reciba(n)
la plenitud del Espíritu Santo. Que esta decisión marque el inicio de una vida
consagrada a ti. Amén."

ADMINISTRACIÓN DEL BAUTISMO
[El candidato entra al agua]

"[Nombre], por tu fe en Jesucristo, siendo bautizado en la muerte de Cristo,
en el nombre del Padre, del Hijo y del Espíritu Santo, te bautizo."

[Se realiza la inmersión completa]

RECIBIMIENTO EN LA CONGREGACIÓN
"Bienvenido(a) hermano(a) [nombre]. La congregación te recibe con alegría.
Somos una familia en Cristo. Nos comprometemos a apoyarte, amarte y orar por ti
en tu caminar cristiano."

BENDICIÓN FINAL
"Que el Señor te guarde. Que Él sea tu fortaleza y tu escudo. Que el Espíritu
Santo more en tu vida y te capacite para vivir una vida que honre a Dios.
En el nombre de Jesucristo, amén."`,
      en: `ADMINISTRATION OF BAPTISM

WELCOME AND PURPOSE
"Brothers and sisters, today we have the privilege of baptizing those who have
decided to follow Jesus Christ. Baptism is the public declaration of faith in
Christ, the believer's identification with the death, burial and resurrection
of our Lord. It is an act of obedience that symbolizes spiritual rebirth."

BIBLICAL READING - IMPORTANCE OF BAPTISM
Matthew 28:19-20
"Therefore go and make disciples of all nations, baptizing them in the name of
the Father and of the Son and of the Holy Spirit..."

Romans 6:3-4
"Or don't you know that all of us who were baptized into Christ Jesus were
baptized into his death?..."

PRESENTATION OF THE CANDIDATES
"We present to you [name(s)] who have professed their faith in Jesus Christ and
now wish to be baptized as a public testimony of their decision to follow Christ."

PERSONAL TESTIMONY
[The candidate briefly shares their experience of conversion and decision to be baptized]

INSTRUCTION ON THE MEANING OF BAPTISM
"Baptism represents:
• The death of the old sinful nature
• The burial of our past life
• Resurrection to new life in Christ
• Our identification with the death and resurrection of Jesus
• The washing away of our sins by the blood of Christ"

QUESTIONS TO THE CANDIDATE
Minister: "Do you believe with all your heart that Jesus Christ is the Son of God?"
Candidate: "Yes, I believe."

Minister: "Have you repented of your sins and accepted Jesus Christ as your
Savior and Lord?"
Candidate: "Yes, I have repented and accepted Him as my Savior."

Minister: "Do you desire to be baptized in the name of the Father, the Son and
the Holy Spirit?"
Candidate: "Yes, I desire to be baptized."

BLESSING PRAYER
"Heavenly Father, bless this/these brother(s) who today wish(es) to be baptized.
May the water of baptism be a living symbol of his/her/their faith. May he/she/they
receive the fullness of the Holy Spirit. May this decision mark the beginning of
a life consecrated to you. Amen."

ADMINISTRATION OF BAPTISM
[The candidate enters the water]

"[Name], by your faith in Jesus Christ, being baptized in the death of Christ,
in the name of the Father, the Son and the Holy Spirit, I baptize you."

[Full immersion is performed]

RECEPTION INTO THE CONGREGATION
"Welcome, brother/sister [name]. The congregation receives you with joy.
We are one family in Christ. We commit to supporting you, loving you and praying
for you in your Christian walk."

FINAL BLESSING
"May the Lord keep you. May He be your strength and shield. May the Holy Spirit
dwell in your life and empower you to live a life that honors God.
In the name of Jesus Christ, amen."`,
    }
  },
  funeral: {
    es: 'Funeral',
    en: 'Funeral',
    icon: '🕊️',
    content: {
      es: `CEREMONIA FÚNEBRE - SERVICIO DE DESPEDIDA

BIENVENIDA Y PROPÓSITO
"Hermanos, nos reunimos en esta ocasión para honrar la memoria de [nombre],
quien partió a la presencia del Señor. Aunque nuestros corazones están tristes,
confiamos en que quien creyó en Jesucristo vivirá para siempre en su presencia.
Estamos aquí para consolar a la familia y reafirmar nuestra esperanza en la
resurrección."

HIMNO O MÚSICA
[Se canta un himno reconfortante]

LECTURA BÍBLICA - CONSUELO EN LA AFLICCIÓN
Salmo 23
"El Señor es mi pastor; nada me faltará..."

1 Tesalonicenses 4:13-14
"Tampoco queremos, hermanos, que ignoréis acerca de los que duermen, para que
no os entristezcáis como los otros que no tienen esperanza. Porque si creemos
que Jesús murió y resucitó, así también traerá Dios con Jesús a los que
durmieron en él."

2 Corintios 5:8
"Así que estamos llenos de valor, y más bien quisimos estar ausentes del cuerpo,
y presentes al Señor."

PALABRAS DE CONSUELO
"La muerte es la separación del cuerpo, pero para el creyente no es el fin.
[Nombre] descansa ahora en paz, en los brazos de nuestro Dios. Su sufrimiento
ha terminado. Su lucha ha sido ganada. Aunque la extrañaremos, sabemos que
volveremos a verla en la eternidad."

EULOGÍA - MEMORIA DEL FALLECIDO
[Se invita a familiares y amigos a compartir recuerdos, anécdotas y el legado
que dejó el difunto]

"[Nombre] fue un testigo de Cristo. Su vida marcó a quienes la rodeaban. Su
legado vive en el corazón de su familia y en la iglesia. Que su ejemplo nos
inspire a vivir con fe y amor."

REFLEXIÓN - LA ESPERANZA EN CRISTO
"La muerte del cuerpo no es derrota, sino victoria. Cristo vencio la muerte
por nosotros. Por eso, aunque hoy lloramos, no lloramos como quienes no tienen
esperanza. Sabemos que existe la resurrección, la vida eterna, la recompensa
que Dios ha preparado para quienes lo aman."

ORACIÓN INTERCESORA
"Padre, en esta hora de dolor, derrama tu consuelo sobre esta familia.
Sana sus corazones quebrantados. Fortalece su fe. Recuérdales que [nombre]
está en tu presencia, descansando en paz. Que puedan llorar, pero sin
desesperación. Que la esperanza en la resurrección llene sus corazones.
Te encomendamos esta familia. Amén."

ORACIÓN DE ENCOMENDACIÓN
"Señor, encomendamos el espíritu de [nombre] en tus manos. Que descanse en
paz en tu presencia eterna. Que sea recibido por los ángeles. Que goza de
la visión de tu gloria. Que encuentre descanso eterno."

BENDICIÓN FINAL
"Que la paz de Dios, que sobrepasa todo entendimiento, guarde vuestros corazones
y vuestras mentes en Cristo Jesús. Que el consuelo del Espíritu Santo sostega
a esta familia en los días venideros. Que la esperanza en la resurrección les
fortalezca. En el nombre de Jesucristo, amén."

CIERRE
"Honremos la memoria de [nombre] viviendo con fe, amor y esperanza. Que su
recuerdo nos inspire a estar listos para encontrarnos con nuestro Señor."`,
      en: `FUNERAL SERVICE - FAREWELL SERVICE

WELCOME AND PURPOSE
"Brothers and sisters, we gather on this occasion to honor the memory of [name],
who has departed to the presence of the Lord. Though our hearts are sad, we trust
that those who believed in Jesus Christ will live forever in His presence.
We are here to comfort the family and reaffirm our hope in the resurrection."

HYMN OR MUSIC
[A comforting hymn is sung]

BIBLICAL READING - COMFORT IN GRIEF
Psalm 23
"The Lord is my shepherd, I shall not want..."

1 Thessalonians 4:13-14
"Brothers and sisters, we do not want you to be uninformed about those who have
died, so that you do not grieve like the rest of mankind, who have no hope.
For we believe that Jesus died and rose again..."

2 Corinthians 5:8
"We are confident, I say, and would prefer to be away from the body and at home
with the Lord."

WORDS OF COMFORT
"Death is the separation of the body, but for the believer it is not the end.
[Name] now rests in peace, in the arms of our God. His/Her suffering is over.
His/Her struggle has been won. Though we will miss him/her, we know we will see
him/her again in eternity."

EULOGY - MEMORY OF THE DECEASED
[Family and friends are invited to share memories, anecdotes and the legacy left by the deceased]

"[Name] was a witness to Christ. His/Her life touched those around him/her.
His/Her legacy lives in the hearts of his/her family and the church. May his/her
example inspire us to live with faith and love."

REFLECTION - HOPE IN CHRIST
"Death of the body is not defeat, but victory. Christ conquered death for us.
Therefore, though we mourn today, we do not mourn as those who have no hope.
We know there is resurrection, eternal life, the reward God has prepared for
those who love Him."

INTERCESSORY PRAYER
"Father, in this hour of sorrow, pour out your comfort on this family.
Heal their broken hearts. Strengthen their faith. Remind them that [name]
is in your presence, resting in peace. May they grieve, but without despair.
May the hope of resurrection fill their hearts. We commit this family to you. Amen."

PRAYER OF COMMENDATION
"Lord, we commit the spirit of [name] into your hands. May he/she rest in peace
in your eternal presence. May he/she be received by the angels. May he/she enjoy
the vision of your glory. May he/she find eternal rest."

FINAL BLESSING
"May the peace of God, which transcends all understanding, guard your hearts and
your minds in Christ Jesus. May the comfort of the Holy Spirit sustain this family
in the coming days. May the hope of resurrection strengthen you. In the name of
Jesus Christ, amen."

CLOSING
"Let us honor the memory of [name] by living with faith, love and hope.
May his/her memory inspire us to be ready to meet our Lord."`,
    }
  },
  oracion: {
    es: 'Oración Pública',
    en: 'Public Prayer',
    icon: '🙏',
    content: {
      es: `DIRECCIÓN DE ORACIÓN PÚBLICA EN LA CONGREGACIÓN

PROPÓSITO DE LA ORACIÓN PÚBLICA
"La oración pública es el acto de interceder por la congregación, por el país,
por los enfermos y por las necesidades del mundo. Es el ministerio de llevar
ante Dios los anhelos, las preocupaciones y las alegrías de nuestro pueblo."

PREPARACIÓN DEL MINISTRO
Antes de dirigir la oración:
• Prepara tu corazón en intimidad con Dios
• Ayuna y ora, si es posible
• Conoce las necesidades específicas de la congregación
• Ten una lista mental de peticiones importantes
• Acércate a Dios con reverencia y sinceridad

ESTRUCTURA DE LA ORACIÓN PÚBLICA

1. INTRODUCCIÓN
"Inclinemos nuestras cabezas. Acerquémonos al trono de la gracia de Dios."

2. ADORACIÓN - RECONOCER LA GRANDEZA DE DIOS
"Padre glorioso, venimos ante tu presencia con reverencia. Reconocemos tu
poder, tu sabiduría y tu amor infinito. Tú eres el Rey de reyes, el Señor de
señores. Tu nombre es digno de ser alabado. Tu poder no tiene límites."

3. CONFESIÓN - ARREPENTIMIENTO
"Confesamos nuestras debilidades y pecados. Pedimos perdón por nuestras
faltas. Reconocemos que sin ti no podemos hacer nada. Lávanos, Señor, en
la sangre de Jesucristo."

4. PETICIÓN - PRESENTAR NECESIDADES
"Traemos ante ti las necesidades de esta congregación. Te pedimos por los
enfermos: [menciona nombres específicos si es apropiado]. Sana sus cuerpos
y fortalece sus espíritus.

Intercedemos por nuestros líderes, que tengan sabiduría para guiar.
Pedimos por las familias que están pasando dificultades económicas.
Levanta a los caídos. Consuela a los afligidos."

5. INTERCESIÓN - ORAR POR OTROS
"Oramos por nuestro país y sus autoridades. Que busquen la justicia y la paz.
Intercedemos por las misiones, por el evangelio que se predica en tierras
lejanas. Que muchos vengan a Cristo.

Pedimos por la unidad de la iglesia. Que seamos un cuerpo con un solo corazón,
dedicados a la obra del reino de Dios."

6. ACCIÓN DE GRACIAS - GRATITUD
"Damos gracias por tu cuidado constante. Por la sangre de Jesús que nos salva.
Por el Espíritu Santo que nos guía. Por esta iglesia y por quienes la componen.
Por las respuestas a nuestras oraciones pasadas.

Agradecemos tu misericordia cada mañana. Tu fidelidad cada día."

7. CONSAGRACIÓN - DEDICACIÓN
"Nos consagramos a ti, Señor. Que tu voluntad se haga en nuestras vidas.
Capacítanos para ser testigos fieles de tu amor. Dame fuerzas para vencer
toda tentación."

8. CIERRE EN AUTORIDAD
"Todo esto lo pedimos en el nombre de Jesucristo, nuestro Señor y Salvador,
quien vive y reina contigo y con el Espíritu Santo por los siglos de los siglos.
Amén."

PAUTAS PARA UNA ORACIÓN PÚBLICA EFECTIVA

Voz y Tono:
• Habla con claridad y volumen suficiente
• Mantén un tono reverente pero accesible
• Varía el ritmo para mantener la atención
• Pausa después de puntos importantes

Lenguaje:
• Usa palabras que la congregación entienda
• Evita jerga religiosa excesiva
• Sé específico en las peticiones
• Evita repeticiones innecesarias

Duración:
• Una oración pública típica dura 3-5 minutos
• No sea excesivamente larga
• Mantén el equilibrio entre elementos

Contenido:
• No prediques en la oración
• No corrijas a la congregación mediante la oración
• Sé genuino y sincero
• Expresa los sentimientos de la congregación

ERRORES A EVITAR
• Usar palabras grandilocuentes para impresionar
• Olvidar peticiones específicas
• Hacer la oración sobre ti mismo
• Ser murmurante o inaudible
• Terminar abruptamente sin cierre apropiado`,
      en: `LEADING PUBLIC PRAYER IN THE CONGREGATION

PURPOSE OF PUBLIC PRAYER
"Public prayer is the act of interceding for the congregation, for the country,
for the sick and for the needs of the world. It is the ministry of bringing
before God the desires, concerns and joys of our people."

PREPARATION OF THE MINISTER
Before leading prayer:
• Prepare your heart in intimacy with God
• Fast and pray, if possible
• Know the specific needs of the congregation
• Keep a mental list of important petitions
• Approach God with reverence and sincerity

STRUCTURE OF PUBLIC PRAYER

1. INTRODUCTION
"Let us bow our heads. Let us draw near to the throne of God's grace."

2. WORSHIP - RECOGNIZE GOD'S GREATNESS
"Glorious Father, we come before your presence with reverence. We acknowledge
your power, your wisdom and your infinite love. You are the King of kings,
the Lord of lords. Your name is worthy of praise. Your power has no limits."

3. CONFESSION - REPENTANCE
"We confess our weaknesses and sins. We ask for forgiveness for our failures.
We acknowledge that without you we can do nothing. Wash us, Lord, in the blood
of Jesus Christ."

4. PETITION - PRESENT NEEDS
"We bring before you the needs of this congregation. We ask for the sick:
[mention specific names if appropriate]. Heal their bodies and strengthen their
spirits.

We intercede for our leaders, that they may have wisdom to guide.
We ask for families passing through economic difficulties.
Lift up the fallen. Comfort the afflicted."

5. INTERCESSION - PRAY FOR OTHERS
"We pray for our country and its authorities. May they seek justice and peace.
We intercede for the missions, for the gospel being preached in distant lands.
May many come to Christ.

We ask for the unity of the church. May we be one body with one heart, dedicated
to the work of God's kingdom."

6. THANKSGIVING - GRATITUDE
"We give thanks for your constant care. For the blood of Jesus that saves us.
For the Holy Spirit who guides us. For this church and those who make it up.
For the answers to our past prayers.

We thank you for your mercy every morning. Your faithfulness every day."

7. CONSECRATION - DEDICATION
"We consecrate ourselves to you, Lord. May your will be done in our lives.
Empower us to be faithful witnesses to your love. Give me strength to overcome
all temptation."

8. CLOSING IN AUTHORITY
"All this we ask in the name of Jesus Christ, our Lord and Savior, who lives
and reigns with you and the Holy Spirit forever and ever. Amen."

GUIDELINES FOR EFFECTIVE PUBLIC PRAYER

Voice and Tone:
• Speak with clarity and sufficient volume
• Maintain a reverent but accessible tone
• Vary the pace to maintain attention
• Pause after important points

Language:
• Use words the congregation understands
• Avoid excessive religious jargon
• Be specific in petitions
• Avoid unnecessary repetitions

Duration:
• A typical public prayer lasts 3-5 minutes
• Don't be excessively long
• Maintain balance between elements

Content:
• Don't preach in prayer
• Don't correct the congregation through prayer
• Be genuine and sincere
• Express the feelings of the congregation

MISTAKES TO AVOID
• Using grandiose words to impress
• Forgetting specific petitions
• Making the prayer about yourself
• Being inaudible or mumbling
• Ending abruptly without proper closure`,
    }
  },
  presentacion: {
    es: 'Presentación de Niños',
    en: 'Child Dedication',
    icon: '👶',
    content: {
      es: `CEREMONIA DE PRESENTACIÓN DE NIÑOS ANTE DIOS

BIENVENIDA Y PROPÓSITO
"Hermanos, nos alegra recibir a familias que desean presentar a sus hijos ante
Dios y esta congregación. La presentación de niños es un acto de fe donde los
padres reconocen que sus hijos son una bendición divina y los consagran al
cuidado del Señor. Es un compromiso público de criarlos en la fe cristiana."

LECTURA BÍBLICA - EJEMPLO BÍBLICO
Lucas 2:22-32 - La presentación de Jesús
"Cuando se cumplieron los días de la purificación de ellos, conforme a la ley
de Moisés, lo llevaron a Jerusalén para presentarlo al Señor..."

Proverbios 22:6
"Instruye al niño en su camino, y aun cuando fuere viejo no se apartará de él."

1 Samuel 1:27-28
"Por este niño oraba yo, y el Señor me otorgó mi petición que le había hecho.
Yo pues, lo dedico también al Señor; todos los días que viviere, será dedicado
al Señor."

INVITACIÓN A LAS FAMILIAS
"Invitamos a las familias a acercarse al frente. Traigan a sus hijos para
presentarlos ante Dios."

[Las familias avanzan al frente con sus niños]

PRESENTACIÓN FORMAL
[El ministro pregunta el nombre del niño y de los padres]
"Presentamos a [nombre], hijo(a) de [nombres de los padres]. Esta familia desea
consagrar a su hijo(a) a Dios y comprometerse a educarlo(a) en la fe cristiana."

PREGUNTAS A LOS PADRES
Ministro: "¿Desean ustedes presentar a [nombre] ante Dios y esta congregación,
reconociendo que es una bendición del Señor?"
Padres: "Sí, deseamos."

Ministro: "¿Se comprometen a instruir a [nombre] en los caminos de Dios, a enseñarle
las verdades de la Biblia y a ser ejemplo de vida cristiana?"
Padres: "Nos comprometemos."

Ministro: "¿Prometen orar por [nombre], protegerlo(a) y guiarlo(a) con amor y
disciplina cristiana?"
Padres: "Lo prometemos."

EXHORTACIÓN A LOS PADRES
"Ser padres es una responsabilidad sagrada. Ustedes no son dueños de sus hijos,
sino mayordomos del regalo que Dios les ha dado. Oren por ellos, modelen la fe
ante ellos, y enséñenles a amar a Jesucristo. Los años de la infancia son preciosos
y decisivos. Dediquen tiempo a guiar sus corazones hacia Dios."

EXHORTACIÓN A LA CONGREGACIÓN
"Hermanos, les pedimos que se comprometan a apoyar a esta familia. Sean padrinos
espirituales de estos niños. Oren por ellos, amen a sus familias y ayuden a
criarlos en la fe. Todos somos responsables de la siguiente generación."

ORACIÓN DE DEDICACIÓN
[El ministro coloca sus manos sobre el niño]

"Padre celestial, te presentamos a [nombre]. Gracias por este regalo precioso.
Pedimos que guardes a este(a) niño(a) todos los días de su vida. Protégelo(a)
del mal. Guía a sus padres con sabiduría. Que crezca(a) en gracia, conocimiento
y en el temor de ti. Que llegue(a) a conocer a Jesucristo como su Salvador
personal. Que sea(a) una luz en este mundo oscuro. Que viva(a) para tu gloria
y tu reino. Amén."

BENDICIÓN SOBRE EL NIÑO
"Que el Señor te bendiga y te guarde. Que Él haga resplandecer su rostro sobre ti.
Que sea tu escudo, tu protector y tu guía. Que conozcas a Jesucristo y vivas en
su amor. En el nombre del Padre, del Hijo y del Espíritu Santo, amén."

PRESENTACIÓN A LA CONGREGACIÓN
"Presentamos a [nombre] como hijo(a) de esta iglesia. Que crezca(a) rodeado(a)
de nuestro amor y oración. Que esta congregación sea(a) su familia espiritual."

HIMNO O CÁNTICO
[Se canta un himno apropiado sobre la bendición de los niños]

CONCLUSIÓN
"Que estas familias vayan en paz. Que el Señor las guíe y las proteja. Que
estos niños crezcan en fe y conocimiento del Señor. Que esta promesa hecha
hoy sea el inicio de una vida consagrada a Cristo."`,
      en: `CEREMONY OF CHILD DEDICATION BEFORE GOD

WELCOME AND PURPOSE
"Brothers and sisters, we are glad to receive families who wish to present their
children before God and this congregation. Child dedication is an act of faith
where parents acknowledge that their children are a divine blessing and consecrate
them to the Lord's care. It is a public commitment to raise them in Christian faith."

BIBLICAL READING - BIBLICAL EXAMPLE
Luke 2:22-32 - The Presentation of Jesus
"When the time of their purification according to the Law of Moses had been
completed, Joseph and Mary took him to Jerusalem to present him to the Lord..."

Proverbs 22:6
"Start children off on the right way and even when they are old they will not
depart from it."

1 Samuel 1:27-28
"I prayed for this child, and the Lord has granted me what I asked of him.
So now I give him to the Lord. For his whole life he will be given over to the Lord."

INVITATION TO FAMILIES
"We invite the families to come to the front. Bring your children to present them
before God."

[Families come forward with their children]

FORMAL PRESENTATION
[The minister asks the child's name and parents' names]
"We present [name], son/daughter of [parents' names]. This family wishes to
dedicate their child to God and commit to raising him/her in Christian faith."

QUESTIONS TO THE PARENTS
Minister: "Do you wish to present [name] before God and this congregation,
acknowledging that he/she is a blessing from the Lord?"
Parents: "Yes, we do."

Minister: "Do you commit to teaching [name] in God's ways, to teach him/her the
truths of the Bible and to be an example of Christian life?"
Parents: "We commit."

Minister: "Do you promise to pray for [name], protect him/her and guide him/her
with love and Christian discipline?"
Parents: "We promise."

EXHORTATION TO THE PARENTS
"Parenthood is a sacred responsibility. You are not owners of your children, but
stewards of the gift God has given you. Pray for them, model faith before them,
and teach them to love Jesus Christ. The years of childhood are precious and
decisive. Dedicate time to guiding their hearts toward God."

EXHORTATION TO THE CONGREGATION
"Brothers and sisters, we ask you to commit to supporting this family. Be spiritual
godparents to these children. Pray for them, love their families and help raise them
in the faith. We are all responsible for the next generation."

PRAYER OF DEDICATION
[The minister places hands on the child]

"Heavenly Father, we present [name] to you. Thank you for this precious gift.
We ask that you keep this child all the days of his/her life. Protect him/her from
evil. Guide his/her parents with wisdom. May he/she grow in grace, knowledge and
in the fear of you. May he/she come to know Jesus Christ as his/her personal Savior.
May he/she be a light in this dark world. May he/she live for your glory and your
kingdom. Amen."

BLESSING UPON THE CHILD
"May the Lord bless you and keep you. May He make his face to shine upon you.
May He be your shield, your protector and your guide. May you come to know Jesus
Christ and live in his love. In the name of the Father, the Son and the Holy Spirit, amen."

PRESENTATION TO THE CONGREGATION
"We present [name] as a child of this church. May he/she grow surrounded by our
love and prayer. May this congregation be his/her spiritual family."

HYMN OR SONG
[An appropriate hymn about God's blessing on children is sung]

CONCLUSION
"May these families go in peace. May the Lord guide and protect you. May these
children grow in faith and knowledge of the Lord. May the promise made today be
the beginning of a life dedicated to Christ."`,
    }
  }
};

type Section =
  | { kind: 'header'; text: string }
  | { kind: 'citation'; text: string }
  | { kind: 'stage'; text: string }
  | { kind: 'speaker'; speaker: string; text: string }
  | { kind: 'quote'; text: string }
  | { kind: 'bullet'; text: string }
  | { kind: 'text'; text: string };

const HEADER_RE = /^[A-ZÁÉÍÓÚÑ0-9][A-ZÁÉÍÓÚÑ0-9\s\-]{2,}$/;
const CITATION_RE = /^[A-ZÁÉÍÓÚÑ][A-Za-záéíóúñÁÉÍÓÚÑ.]*(\s[A-Za-záéíóúñÁÉÍÓÚÑ0-9.]+)*\s\d+(:\d+(-\d+)?)?(\s-\s.+)?$/;
const SPEAKER_RE = /^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+):\s(.+)$/;

function parseLine(raw: string): Section {
  const line = raw.trim();
  if (!line) return { kind: 'text', text: '' };
  if (line.startsWith('[') && line.endsWith(']')) return { kind: 'stage', text: line };
  if (line.startsWith('•') || line.startsWith('-')) return { kind: 'bullet', text: line.replace(/^[•-]\s*/, '') };
  const speakerMatch = line.match(SPEAKER_RE);
  if (speakerMatch && line.includes('"')) return { kind: 'speaker', speaker: speakerMatch[1], text: speakerMatch[2] };
  if (line.startsWith('"')) return { kind: 'quote', text: line };
  if (line.length < 60 && !line.startsWith('"') && HEADER_RE.test(line)) return { kind: 'header', text: line };
  if (line.length < 60 && CITATION_RE.test(line) && /\d/.test(line)) return { kind: 'citation', text: line };
  return { kind: 'text', text: line };
}

function LiturgyContent({ content, styles }: { content: string; styles: any }) {
  const paragraphs = content.split('\n\n');
  return (
    <>
      {paragraphs.map((para, idx) => (
        <View key={idx} style={{ marginBottom: 14 }}>
          {para.split('\n').map((line, lineIdx) => {
            const section = parseLine(line);
            if (!section.text && section.kind === 'text') return null;
            switch (section.kind) {
              case 'header':
                return <Text key={lineIdx} style={styles.sectionHeader}>{section.text}</Text>;
              case 'citation':
                return <Text key={lineIdx} style={styles.citation}>{section.text}</Text>;
              case 'stage':
                return <Text key={lineIdx} style={styles.stageDirection}>{section.text}</Text>;
              case 'speaker':
                return (
                  <Text key={lineIdx} style={styles.paragraph}>
                    <Text style={styles.speakerName}>{section.speaker}: </Text>
                    <Text style={styles.quoteText}>{section.text}</Text>
                  </Text>
                );
              case 'quote':
                return <Text key={lineIdx} style={styles.quoteText}>{section.text}</Text>;
              case 'bullet':
                return (
                  <View key={lineIdx} style={{ flexDirection: 'row', marginBottom: 4 }}>
                    <Text style={styles.paragraph}>•  </Text>
                    <Text style={[styles.paragraph, { flex: 1 }]}>{section.text}</Text>
                  </View>
                );
              default:
                return <Text key={lineIdx} style={styles.paragraph}>{section.text}</Text>;
            }
          })}
        </View>
      ))}
    </>
  );
}

export default function MinisterManualScreen() {
  const themeColors = useTheme();
  const settings = useSettings();
  const lang = settings.language as 'es' | 'en';
  const [selected, setSelected] = useState<Ceremony>('boda');

  const ceremony = CEREMONIES[selected];
  const content = ceremony.content[lang];

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: themeColors.bg },
    header: {
      backgroundColor: themeColors.header,
      paddingTop: 52,
      paddingBottom: 16,
      paddingHorizontal: 20,
    },
    headerTitle: { color: themeColors.text, fontSize: 20, fontWeight: '800' },
    tabs: {
      flexDirection: 'row',
      backgroundColor: themeColors.bgElevated,
      paddingVertical: 12,
      paddingHorizontal: 12,
      gap: 8,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.cardBorder,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: themeColors.card,
      borderWidth: 1,
      borderColor: themeColors.cardBorder,
    },
    tabActive: {
      backgroundColor: themeColors.accent,
      borderColor: themeColors.accent,
    },
    tabText: { color: themeColors.text, fontSize: 11, fontWeight: '600', textAlign: 'center' },
    tabTextActive: { color: themeColors.accentText, fontWeight: '800' },
    content: { flex: 1, padding: 20, paddingBottom: 40 },
    ceremonyTitle: { color: themeColors.text, fontSize: 24, fontWeight: '800', marginBottom: 16, textAlign: 'center' },
    sectionHeader: {
      color: themeColors.accent,
      fontSize: settings.fontSize - 1,
      fontWeight: '800',
      letterSpacing: 0.5,
      marginTop: 4,
      marginBottom: 6,
    },
    citation: {
      color: themeColors.textMuted,
      fontSize: settings.fontSize - 2,
      fontWeight: '700',
      fontStyle: 'italic',
      marginBottom: 2,
    },
    stageDirection: {
      color: themeColors.textMuted,
      fontSize: settings.fontSize - 2,
      fontStyle: 'italic',
      marginVertical: 4,
    },
    speakerName: {
      color: themeColors.accent,
      fontSize: settings.fontSize,
      fontWeight: '800',
    },
    quoteText: {
      color: themeColors.text,
      fontSize: settings.fontSize,
      lineHeight: settings.fontSize * 1.6,
      fontStyle: 'italic',
    },
    paragraph: {
      color: themeColors.text,
      fontSize: settings.fontSize,
      lineHeight: settings.fontSize * 1.6,
    },
  });

  const ceremoniesList: Array<{ key: Ceremony; label: string; iconName: keyof typeof Ionicons.glyphMap }> = [
    { key: 'boda', label: lang === 'es' ? 'Matrimonio' : 'Wedding', iconName: 'heart' },
    { key: 'cena', label: lang === 'es' ? 'Santa Cena' : 'Communion', iconName: 'wine' },
    { key: 'bautismo', label: lang === 'es' ? 'Bautismo' : 'Baptism', iconName: 'water' },
    { key: 'presentacion', label: lang === 'es' ? 'Niños' : 'Children', iconName: 'happy' },
    { key: 'funeral', label: lang === 'es' ? 'Funeral' : 'Funeral', iconName: 'leaf' },
    { key: 'oracion', label: lang === 'es' ? 'Oración' : 'Prayer', iconName: 'flame' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{lang === 'es' ? 'Manual del Ministro' : "Minister's Manual"}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {ceremoniesList.map((item) => (
          <Pressable
            key={item.key}
            style={[styles.tab, selected === item.key && styles.tabActive]}
            onPress={() => setSelected(item.key)}
          >
            <Ionicons name={item.iconName} size={20} color={selected === item.key ? themeColors.accentText : themeColors.text} style={{ marginBottom: 4 }} />
            <Text style={[styles.tabText, selected === item.key && styles.tabTextActive]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <Ionicons name={ceremoniesList.find(c => c.key === selected)?.iconName || 'book'} size={40} color={themeColors.accent} />
        </View>
        <Text style={styles.ceremonyTitle}>{ceremony[lang]}</Text>
        <LiturgyContent content={content} styles={styles} />
      </ScrollView>
    </View>
  );
}
