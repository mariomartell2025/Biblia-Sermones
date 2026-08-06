import { Platform } from 'react-native';
import JSZip from 'jszip';

// Extrae texto plano de un archivo de sermón para luego auto-dividirlo en puntos.
// Offline: .txt, .md, .rtf (básico) y .docx (Word moderno).
// .pdf y .doc antiguo se detectan y se explican (requieren pdf.js / conversión / OCR).

export type ImportResult =
  | { ok: true; text: string; kind: string }
  | { ok: false; reason: string; kind: string };

function extFromName(name: string): string {
  const m = /\.([a-z0-9]+)$/i.exec(name || '');
  return m ? m[1].toLowerCase() : '';
}

// Del XML de un .docx (word/document.xml) saca el texto respetando párrafos.
export function docxXmlToText(xml: string): string {
  // Cada <w:p> es un párrafo; <w:t> son fragmentos de texto; <w:tab/> y <w:br/> son espacios/saltos.
  const paragraphs = xml.split(/<w:p[ >]/).slice(1);
  const lines = paragraphs.map((p) => {
    const runs = [...p.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map((m) => decodeXml(m[1]));
    let line = runs.join('');
    line = line.replace(/<w:tab\/>/g, '\t');
    return line.trim();
  });
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function decodeXml(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

// RTF muy básico: quita grupos de control y comandos, deja el texto legible.
function rtfToText(rtf: string): string {
  return rtf
    .replace(/\\'[0-9a-fA-F]{2}/g, '')
    .replace(/\\[a-zA-Z]+-?\d* ?/g, ' ')
    .replace(/[{}]/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

async function getBytes(uri: string): Promise<ArrayBuffer> {
  const res = await fetch(uri);
  return await res.arrayBuffer();
}

async function getText(uri: string): Promise<string> {
  const res = await fetch(uri);
  return await res.text();
}

async function docxToText(uri: string): Promise<string> {
  const bytes = await getBytes(uri);
  const zip = await JSZip.loadAsync(bytes);
  const doc = zip.file('word/document.xml');
  if (!doc) throw new Error('El .docx no contiene word/document.xml');
  const xml = await doc.async('string');
  return docxXmlToText(xml);
}

/**
 * Recibe el archivo elegido (uri + nombre) y devuelve su texto plano.
 * `uri` funciona igual en web (blob:) y nativo (file://) porque usamos fetch().
 */
export async function extractText(uri: string, name: string): Promise<ImportResult> {
  const ext = extFromName(name);
  try {
    switch (ext) {
      case 'txt':
      case 'md':
      case 'markdown':
      case 'text':
        return { ok: true, text: await getText(uri), kind: ext };
      case 'rtf':
        return { ok: true, text: rtfToText(await getText(uri)), kind: 'rtf' };
      case 'docx':
        return { ok: true, text: await docxToText(uri), kind: 'docx' };
      case 'pdf':
        return {
          ok: false,
          kind: 'pdf',
          reason:
            'Los PDF con texto se importarán con pdf.js (web) o un paso en la nube (móvil); ' +
            'los PDF escaneados necesitan OCR. Por ahora exporta el sermón a .docx o pega el texto.',
        };
      case 'doc':
        return {
          ok: false,
          kind: 'doc',
          reason: 'El .doc antiguo (binario) no se lee sin conversión. Ábrelo en Word y guárdalo como .docx.',
        };
      default:
        // Intento leerlo como texto plano por si acaso.
        return { ok: true, text: await getText(uri), kind: ext || 'desconocido' };
    }
  } catch (e: any) {
    return { ok: false, kind: ext, reason: `No se pudo leer el archivo (${e?.message || e}).` };
  }
}
