/**
 * Backend de generación de devocionales con IA (Claude).
 *
 * POR QUÉ UN BACKEND: la API key de Anthropic NUNCA debe ir dentro de la app
 * (cualquiera la extraería del binario). La app llama a ESTE servidor; el servidor
 * guarda la key y llama a Claude. Es el mismo patrón que ya usas con Supabase.
 *
 * Desplegar en: Vercel / Cloud Run / Render / tu VPS. Luego pon su URL en
 * src/devocional/generate.ts → BACKEND_URL.
 *
 * Requisitos:
 *   npm i express @anthropic-ai/sdk
 *   export ANTHROPIC_API_KEY=sk-ant-...
 *   export DEVOCIONAL_API_KEY=... (secreto propio; la app lo manda en el header x-api-key)
 *   node server/devocional-endpoint.js
 *
 * Necesita los mismos datos que la app: assets/bible/index.json y assets/bible/rvr.json
 * (para insertar el texto EXACTO del versículo, no una paráfrasis del modelo).
 */
const express = require('express');
const crypto = require('crypto');
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.DEVOCIONAL_API_KEY;
if (!API_KEY) {
  console.error('Falta DEVOCIONAL_API_KEY en el entorno. El servidor no arrancará sin ella.');
  process.exit(1);
}

const app = express();
app.use(express.json({ limit: '10kb' }));
const client = new Anthropic(); // usa ANTHROPIC_API_KEY del entorno

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a)); const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Biblia (Reina Valera, dominio público) para citar el versículo con exactitud.
const INDEX = JSON.parse(fs.readFileSync(path.join(__dirname, '../assets/bible/index.json'), 'utf8'));
const RVR = JSON.parse(fs.readFileSync(path.join(__dirname, '../assets/bible/rvr.json'), 'utf8'));
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
function findBook(name) {
  const q = norm(name);
  let i = INDEX.findIndex((b) => norm(b.name) === q || norm(b.abbr) === q);
  if (i < 0) i = INDEX.findIndex((b) => norm(b.name).startsWith(q));
  return i;
}
function verseText(bookIdx, ch, v) {
  const b = RVR[bookIdx];
  return b && b.chapters[ch - 1] && b.chapters[ch - 1][v - 1] ? b.chapters[ch - 1][v - 1] : null;
}

// Esquema de salida estructurada: JSON garantizado.
const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    theme: { type: 'string' },
    reference: {
      type: 'object', additionalProperties: false,
      properties: { book: { type: 'string' }, chapter: { type: 'integer' }, verse: { type: 'integer' } },
      required: ['book', 'chapter', 'verse'],
    },
    points: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          kind: { type: 'string', enum: ['pensamiento', 'reflexion', 'aplicacion', 'oracion'] },
          heading: { type: 'string' },
          body: { type: 'string' },
        },
        required: ['kind', 'heading', 'body'],
      },
    },
  },
  required: ['title', 'theme', 'reference', 'points'],
};

const SYSTEM = `Eres un escritor devocional cristiano en español (Reina Valera). Escribes devocionales BREVES, ORIGINALES y NO GENÉRICOS: nada de frases hechas ("Dios te ama y tiene un plan"), nada de relleno. Cada devocional gira en torno a UN versículo base concreto y coherente con su contexto bíblico.

Reglas:
- Elige un versículo base real de la Biblia (libro, capítulo, versículo). Da el nombre del libro en español (ej. "Isaías", "2 Corintios", "Salmos").
- Escribe 4 puntos en este orden y con estos "kind": "pensamiento", "reflexion", "aplicacion", "oracion".
- "pensamiento": una idea fresca, con una imagen concreta, anclada al versículo.
- "reflexion": profundiza en una palabra o matiz del texto; evita lo obvio.
- "aplicacion": un paso concreto para HOY (no abstracto).
- "oracion": 1-2 frases, en primera persona, breve.
- Cada "body": 2 a 4 frases. Lenguaje cálido, directo, no cursi.
- El "title" es corto y evocador (2-4 palabras), no un resumen.
- Cita fielmente el sentido del texto; no inventes doctrina.
No incluyas el texto del versículo tú mismo (el servidor lo insertará exacto).`;

app.post('/devocional', async (req, res) => {
  const providedKey = req.get('x-api-key');
  if (!providedKey || !timingSafeEqual(providedKey, API_KEY)) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const { theme, date } = req.body || {};
  if (theme !== undefined && (typeof theme !== 'string' || theme.length === 0 || theme.length > 120)) {
    return res.status(400).json({ error: 'theme inválido: debe ser texto de 1 a 120 caracteres' });
  }
  if (date !== undefined && (typeof date !== 'string' || date.length > 20)) {
    return res.status(400).json({ error: 'date inválido: debe ser texto de hasta 20 caracteres' });
  }

  try {
    const userMsg = theme
      ? `Genera un devocional para hoy (${date || ''}) sobre el tema: "${theme}".`
      : `Genera un devocional para hoy (${date || ''}). Elige tú un tema y un versículo base que no sean de los más trillados.`;

    const msg = await client.messages.create({
      model: 'claude-opus-5', // Para una app diaria puedes usar 'claude-sonnet-5' (más barato) o 'claude-haiku-4-5' (el más barato). Tú decides el equilibrio costo/calidad.
      max_tokens: 1500,
      system: SYSTEM,
      output_config: { format: { type: 'json_schema', schema: SCHEMA } },
      messages: [{ role: 'user', content: userMsg }],
    });

    // Extraer el JSON de la respuesta.
    const textBlock = msg.content.find((b) => b.type === 'text');
    const data = JSON.parse(textBlock.text);

    // Insertar el texto EXACTO del versículo desde la Reina Valera.
    const bi = findBook(data.reference.book);
    if (bi < 0) return res.status(422).json({ error: 'Libro no reconocido: ' + data.reference.book });
    const text = verseText(bi, data.reference.chapter, data.reference.verse);
    if (!text) return res.status(422).json({ error: 'Versículo fuera de rango' });

    res.json({
      date: date || '',
      title: data.title,
      theme: data.theme,
      keyVerse: {
        book: bi,
        chapter: data.reference.chapter,
        verse: data.reference.verse,
        ref: `${INDEX[bi].abbr} ${data.reference.chapter}:${data.reference.verse}`,
        text,
      },
      points: data.points,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error generando el devocional' });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => console.log(`Devocional API en http://localhost:${PORT}`));
