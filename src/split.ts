import { SermonPoint } from './types';

let counter = 0;
export function newId(prefix = 'p'): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter}`;
}

/**
 * Auto-divide un sermón pegado en puntos (tarjetas).
 * Reconoce separadores comunes de bosquejo:
 *   - Encabezados markdown:  #, ##, ###
 *   - Listas numeradas:      "1.", "1)", "2 -"
 *   - Separadores:           líneas con solo "---" o "***"
 *   - Viñetas de nivel alto:  "•", "- " al inicio de línea (como punto nuevo)
 * Si no encuentra estructura, divide por líneas en blanco dobles (párrafos).
 */
export function splitIntoPoints(raw: string): SermonPoint[] {
  const text = (raw || '').replace(/\r\n/g, '\n').trim();
  if (!text) return [];

  const lines = text.split('\n');
  const points: SermonPoint[] = [];
  let current: { heading: string; body: string[] } | null = null;

  const push = () => {
    if (current && (current.heading.trim() || current.body.join('').trim())) {
      points.push({
        id: newId(),
        heading: current.heading.trim(),
        bodyMd: current.body.join('\n').trim(),
      });
    }
  };

  const headingMatchers: { re: RegExp; strip: (s: string) => string }[] = [
    { re: /^#{1,6}\s+/, strip: (s) => s.replace(/^#{1,6}\s+/, '') },
    { re: /^\d+[.)]\s+/, strip: (s) => s.replace(/^\d+[.)]\s+/, '') },
    { re: /^\d+\s*[-–]\s+/, strip: (s) => s.replace(/^\d+\s*[-–]\s+/, '') },
  ];
  const isSeparator = (s: string) => /^\s*([-*_]){3,}\s*$/.test(s);

  for (const line of lines) {
    if (isSeparator(line)) {
      push();
      current = { heading: '', body: [] };
      continue;
    }
    const matcher = headingMatchers.find((m) => m.re.test(line));
    if (matcher) {
      push();
      current = { heading: matcher.strip(line).trim(), body: [] };
      continue;
    }
    if (!current) current = { heading: '', body: [] };
    current.body.push(line);
  }
  push();

  // Fallback: si quedó un solo punto gigante, dividir por párrafos (doble salto).
  if (points.length <= 1) {
    const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    if (paras.length > 1) {
      return paras.map((p) => ({ id: newId(), heading: '', bodyMd: p }));
    }
  }

  return points.length ? points : [{ id: newId(), heading: '', bodyMd: text }];
}
