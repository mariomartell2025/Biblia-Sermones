import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../useTheme';
import { useSettings } from '../SettingsContext';

type Ceremony = 'cena' | 'boda' | 'bautismo' | 'funeral' | 'oracion';

const CEREMONIES = {
  cena: {
    es: 'Santa Cena',
    en: 'Communion',
    icon: '🍷',
    content: {
      es: `ADMINISTRACIÓN DE LA SANTA CENA

1. PREPARACIÓN
- Verificar los elementos (pan y copa)
- Preparar la mesa con dignidad
- Convocar a la congregación

2. INTRODUCCIÓN
"Hermanos, nos reunimos para conmemorar la muerte de nuestro Señor Jesucristo"

3. ORACIÓN POR EL PAN
"Señor, bendice este pan que representa el cuerpo de Cristo..."

4. FRACCIÓN DEL PAN
Partir el pan en trozos para la congregación

5. DISTRIBUCIÓN
El pan se distribuye a los comulgantes

6. ORACIÓN POR LA COPA
"Señor, bendice esta copa que representa la sangre de Cristo..."

7. DISTRIBUCIÓN DE LA COPA
La copa se distribuye a los comulgantes

8. REFLEXIÓN FINAL
Palabras de despedida y bendición`,
      en: `ADMINISTRATION OF COMMUNION

1. PREPARATION
- Check elements (bread and cup)
- Prepare the table with dignity
- Gather the congregation

2. INTRODUCTION
"Brothers, we gather to remember the death of our Lord Jesus Christ"

3. PRAYER FOR THE BREAD
"Lord, bless this bread that represents the body of Christ..."

4. BREAKING OF BREAD
Break the bread into pieces for the congregation

5. DISTRIBUTION
The bread is distributed to the communicants

6. PRAYER FOR THE CUP
"Lord, bless this cup that represents the blood of Christ..."

7. DISTRIBUTION OF CUP
The cup is distributed to the communicants

8. CLOSING REFLECTION
Words of farewell and blessing`,
    }
  },
  boda: {
    es: 'Matrimonio',
    en: 'Wedding',
    icon: '💒',
    content: {
      es: `CEREMONIA DE MATRIMONIO

1. RECEPCIÓN
Los novios ingresan acompañados por sus familiares

2. INTRODUCCIÓN
"Nos reunimos hoy en presencia de Dios para unir a..."

3. DECLARACIÓN DE INTENCIONES
Se pregunta a los novios si desean casarse

4. INTERCAMBIO DE ANILLOS
Los novios intercambian anillos como símbolo del pacto

5. ORACIÓN
Oración pidiendo bendición sobre la pareja

6. LECTURA BÍBLICA
Pasaje sobre el matrimonio (Efesios 5:25-33 o similar)

7. EXHORTACIÓN
Consejos para una vida matrimonial exitosa

8. DECLARACIÓN FINAL
"Los declaro marido y mujer ante Dios"

9. BENDICIÓN
Bendición final sobre la pareja`,
      en: `WEDDING CEREMONY

1. RECEPTION
The couple enters accompanied by family

2. INTRODUCTION
"We gather today in God's presence to unite..."

3. DECLARATION OF INTENTIONS
The couple is asked if they wish to marry

4. EXCHANGE OF RINGS
The couple exchanges rings as a symbol of covenant

5. PRAYER
Prayer for blessing upon the couple

6. BIBLICAL READING
Passage about marriage (Ephesians 5:25-33 or similar)

7. EXHORTATION
Advice for a successful marriage

8. FINAL DECLARATION
"I declare you husband and wife before God"

9. BLESSING
Final blessing upon the couple`,
    }
  },
  bautismo: {
    es: 'Bautismo',
    en: 'Baptism',
    icon: '💧',
    content: {
      es: `ADMINISTRACIÓN DEL BAUTISMO

1. PREPARACIÓN
- Verificar el lugar y el agua
- Preparar al candidato

2. TESTIMONIO
El candidato comparte su experiencia de fe

3. INSTRUCCIÓN
Breve enseñanza sobre el significado del bautismo

4. ORACIÓN
Oración por el candidato y el ministerio

5. INMERSIÓN
El ministro bautiza al candidato en el nombre de la Trinidad
"Por la fe en Jesucristo, yo te bautizo..."

6. BIENVENIDA
Se recibe al nuevo miembro en la congregación

7. BENDICIÓN
Bendición final`,
      en: `ADMINISTRATION OF BAPTISM

1. PREPARATION
- Check the location and water
- Prepare the candidate

2. TESTIMONY
The candidate shares their faith experience

3. INSTRUCTION
Brief teaching on the meaning of baptism

4. PRAYER
Prayer for the candidate and ministry

5. IMMERSION
The minister baptizes the candidate in the name of the Trinity
"By faith in Jesus Christ, I baptize you..."

6. WELCOME
The new member is welcomed into the congregation

7. BLESSING
Final blessing`,
    }
  },
  funeral: {
    es: 'Funeral',
    en: 'Funeral',
    icon: '🕊️',
    content: {
      es: `CEREMONIA FÚNEBRE

1. INTRODUCCIÓN
"Nos reunimos hoy para honrar la memoria de..."

2. LECTURA BÍBLICA
Pasajes de consuelo (Salmo 23, 1 Tesalonicenses 4:13-18)

3. ORACIÓN
Oración de consuelo para los deudos

4. EULOGÍA
Se comparten recuerdos y legado del fallecido

5. REFLEXIÓN
Meditación sobre la esperanza en Cristo

6. ORACIÓN FINAL
Oración de despedida y encomendación

7. BENDICIÓN
Bendición para los enlutados`,
      en: `FUNERAL SERVICE

1. INTRODUCTION
"We gather today to honor the memory of..."

2. BIBLICAL READING
Passages of comfort (Psalm 23, 1 Thessalonians 4:13-18)

3. PRAYER
Prayer of comfort for the bereaved

4. EULOGY
Memories and legacy of the deceased are shared

5. REFLECTION
Meditation on hope in Christ

6. FINAL PRAYER
Prayer of farewell and commendation

7. BLESSING
Blessing for the grieving`,
    }
  },
  oracion: {
    es: 'Oración Pública',
    en: 'Public Prayer',
    icon: '🙏',
    content: {
      es: `ORACIÓN PÚBLICA EN IGLESIA

1. INTRODUCCIÓN
"Inclinemos nuestras cabezas en oración"

2. DIRECCIÓN
El ministro dirige la oración con voz clara

3. ELEMENTOS ESENCIALES
- Adoración: Reconocer a Dios
- Petición: Pedir por necesidades
- Intercesión: Orar por otros
- Acción de gracias: Dar gracias

4. LENGUAJE
- Reverente y apropiado
- Evitar repeticiones
- Voz pausada y clara

5. CIERRE
"En el nombre de Jesucristo, amén"

6. AMÉN
La congregación responde "Amén"`,
      en: `PUBLIC PRAYER IN CHURCH

1. INTRODUCTION
"Let us bow our heads in prayer"

2. DIRECTION
The minister leads the prayer with clear voice

3. ESSENTIAL ELEMENTS
- Worship: Acknowledge God
- Petition: Request for needs
- Intercession: Pray for others
- Thanksgiving: Give thanks

4. LANGUAGE
- Reverent and appropriate
- Avoid repetitions
- Measured and clear voice

5. CLOSING
"In the name of Jesus Christ, amen"

6. AMEN
The congregation responds "Amen"`,
    }
  }
};

export default function MinisterManualScreen() {
  const themeColors = useTheme();
  const settings = useSettings();
  const lang = settings.language as 'es' | 'en';
  const [selected, setSelected] = useState<Ceremony>('cena');

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
    ceremonyTitle: { color: themeColors.text, fontSize: 24, fontWeight: '800', marginBottom: 16 },
    ceremonyIcon: { fontSize: 48, marginBottom: 12 },
    text: { color: themeColors.text, fontSize: settings.fontSize, lineHeight: settings.fontSize * 1.6, fontFamily: 'monospace' },
  });

  const ceremoniesList: Array<{ key: Ceremony; label: string; icon: string }> = [
    { key: 'cena', label: lang === 'es' ? 'Santa Cena' : 'Communion', icon: '🍷' },
    { key: 'boda', label: lang === 'es' ? 'Boda' : 'Wedding', icon: '💒' },
    { key: 'bautismo', label: lang === 'es' ? 'Bautismo' : 'Baptism', icon: '💧' },
    { key: 'funeral', label: lang === 'es' ? 'Funeral' : 'Funeral', icon: '🕊️' },
    { key: 'oracion', label: lang === 'es' ? 'Oración' : 'Prayer', icon: '🙏' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📖 {lang === 'es' ? 'Manual del Ministro' : 'Minister\'s Manual'}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {ceremoniesList.map((item) => (
          <Pressable
            key={item.key}
            style={[styles.tab, selected === item.key && styles.tabActive]}
            onPress={() => setSelected(item.key)}
          >
            <Text style={{ fontSize: 16, marginBottom: 4 }}>{item.icon}</Text>
            <Text style={[styles.tabText, selected === item.key && styles.tabTextActive]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        <Text style={styles.ceremonyIcon}>{ceremony.icon}</Text>
        <Text style={styles.ceremonyTitle}>{ceremony[lang]}</Text>
        <Text style={styles.text}>{content}</Text>
      </ScrollView>
    </View>
  );
}
