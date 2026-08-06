# App de la Biblia + Navegador de Sermones

**Documento de producto y especificación técnica**
Autor: Mario Martell · Fecha: 2026-08-05 · Estado: borrador v1

---

## 1. Visión

Una app móvil de la Biblia (español, EE.UU./LatAm) con dos pilares:

1. **Lectura bíblica** completa y offline, al nivel de apps de referencia como **CeluBiblia AIO** (varias versiones, búsqueda, marcadores, notas, modo oscuro, lectura diaria).
2. **Navegador de sermones**: una sección donde el usuario **crea, pega y edita** sus propios sermones —texto tipo "predicación"— y los navega en tarjetas con imagen, título y fecha, exactamente como la experiencia de la app *Dante Gebel Live!* que sirvió de referencia visual (carrusel de tarjetas: imagen de portada, título "#985 | Estigma", fecha "Publicado el 24/07/2026", cuerpo editable).

El diferenciador frente a CeluBiblia y similares: **el sermón es contenido de primera clase, creado y editable por el propio usuario**, vinculado a los versículos de la Biblia.

---

## 2. Referencias analizadas

### CeluBiblia AIO / PRO (ERC Systems) — qué copiar
- 14 versiones de la Biblia, offline total (sin conexión).
- Diccionarios, comentarios (Diario Vivir, Spurgeon), mapas bíblicos.
- Devocionales / plan de lectura diaria (hasta ~5000 días).
- Lectura personalizable: tamaño de fuente, color de fondo, **tema oscuro**.
- Búsqueda rápida de versículo/capítulo/libro; marcadores y notas.

**Lección:** el estándar mínimo esperado es *offline + multi-versión + personalización de lectura + notas*. Si falta eso, se percibe como un MVP plano.

### Dante Gebel Live! — el modelo del navegador de sermones
De las capturas: cada sermón es una **tarjeta** con
- Imagen de portada (banner con número de episodio y foto).
- Título con numeración: `#984 | Mi encuentro conmigo`.
- Fecha de publicación: `Publicado el 12/07/2026`.
- Cuerpo de texto largo, scrolleable.
- Navegación tipo **carrusel** (dots inferiores: ● ● ● …) entre sermones.

**Lección:** el usuario quiere esa misma sensación editorial pero con **texto pegable y editable propio**, no consumo pasivo.

### Fuentes de datos bíblicos (para no transcribir la Biblia a mano)
- **wldeh/bible-api** — 200+ versiones/idiomas, sin API key, JSON. Ideal para semilla offline.
- **alejandroch1202/biblia-api** — Reina Valera 1960 en JSON.
- **jh0rman/biblia-api** — Reina Valera 1909 en JSON.
- **API.Bible (scripture.api.bible)** — RVR1960, KJV, etc. (requiere key).
- **getbible/v2** — datasets JSON descargables por versión.

> Ojo con licencias: RVR1960 tiene derechos (Sociedades Bíblicas). Para publicar en tiendas usa versiones de **dominio público** (Reina Valera 1909, KJV) o consigue licencia. Guarda esto como riesgo legal (§9).

---

## 3. Público y casos de uso

- **Predicador / líder** que prepara y guarda sus predicaciones, las pega desde notas y las edita en el teléfono.
- **Miembro de iglesia** que lee la Biblia, subraya y toma notas.
- **Reutilización de tu ecosistema**: encaja con tu proyecto de app de iglesia (multi-tenant) — un pastor podría publicar sermones a su congregación.

Casos de uso núcleo:
1. Leer un capítulo, subrayar un versículo, guardar nota.
2. Crear un sermón nuevo: título, fecha, imagen de portada, pegar/editar cuerpo.
3. Navegar sermones en carrusel y abrir uno a pantalla completa.
4. Insertar una **cita de versículo** dentro del sermón (se enlaza al texto bíblico).
5. Buscar dentro de mis sermones y dentro de la Biblia.

---

## 4. Funcionalidades

### 4.1 Módulo Biblia (MVP)
- Selector de **versión** (empezar con 1–2 de dominio público + estructura para añadir).
- Navegación Libro → Capítulo → Versículo.
- Lectura con: tamaño de fuente, interlineado, tema claro/oscuro/sepia.
- **Búsqueda** por texto y por referencia (ej. "Juan 3:16").
- **Resaltados** (colores), **marcadores**, **notas** por versículo.
- Compartir versículo (imagen o texto).

### 4.2 Módulo Sermones — el "cue cards" carrusel (el diferenciador)

> **Concepto central.** En la app de Dante Gebel el flujo es *lista → detalle con descripción → carrusel de contenido publicado*. Aquí lo invertimos: el **carrusel ES la estructura del sermón**. Cada tarjeta = **un punto de la predicación**. El predicador **desliza de lado a lado** para avanzar punto por punto mientras predica. Es un **teleprompter de tarjetas / cue cards** — el porqué del nombre `cuemd`.

**Flujo de uso (idéntico patrón al que te gusta):**
1. **Lista de sermones** — feed de tarjetas: portada, título numerado (`#985 | Estigma`), fecha, extracto. Como "Mensajes en YouTube".
2. **Detalle** — al seleccionar, se abre con la **descripción/introducción** arriba (el resumen del mensaje, tipo el texto de Gebel).
3. **Carrusel de puntos** — abajo, deslizable horizontal con **dots (● ● ● …)**. Cada slide es **un punto del bosquejo** del sermón: título del punto + notas + versículo(s) + ilustración. Deslizas → siguiente punto.

**Modo Predicar (a pantalla completa):**
- Tipografía grande, alto contraste, tema oscuro.
- Swipe izquierda/derecha = avanzar/retroceder punto. Dots indican progreso ("punto 3 de 7").
- Opcional: mantener pantalla encendida, tamaño de letra ajustable en caliente, y un mini-índice para saltar a cualquier punto.

**Editor de sermón:**
- Título (autonumeración opcional `#985 | …`), fecha, imagen de portada.
- **Descripción/introducción** (texto enriquecido).
- **Puntos (cards) ordenables**: agregar, reordenar (drag), duplicar, eliminar. Cada punto:
  - Encabezado del punto.
  - Cuerpo editable — **pegar desde el portapapeles** y editar (negrita, cursiva, listas, cita).
  - **Insertar versículo**: buscador que pega la cita formateada y la enlaza a la Biblia.
- **Importar/pegar sermón completo** y **auto-dividirlo en puntos** por encabezados o separadores (`##`, `1.`, `---`) → Markdown = fuente de verdad (`cuemd`).

**Organización y salida:**
- Etiquetas/series, favoritos, ordenar por fecha.
- **Exportar** sermón (PDF / Markdown / imagen para redes).
- Búsqueda dentro de sermones.

### 4.3 General
- Todo **offline-first**; sincronización opcional en la nube (fase 2).
- Backup/restore de sermones y notas.
- Ajustes de apariencia globales.

---

## 5. Prioridades (MoSCoW)

| Prioridad | Alcance |
|---|---|
| **Must** | Biblia 1 versión offline + navegación + búsqueda; CRUD de sermones con puntos ordenables, pegar/auto-dividir; **carrusel de puntos + Modo Predicar** (swipe punto por punto); tema oscuro; almacenamiento local. |
| **Should** | Notas/resaltados en Biblia; insertar versículo en sermón; imagen de portada; exportar sermón; múltiples versiones. |
| **Could** | Sincronización en la nube; series/etiquetas; devocional diario; audio TTS del sermón. |
| **Won't (v1)** | Comentarios/diccionarios completos tipo CeluBiblia; comunidad/comentarios sociales; publicación pública. |

---

## 6. Modelo de datos

```
BibleVersion { id, name, abbr, language, license, source }
Book { id, versionId, name, abbr, order, chapterCount }
Verse { id, versionId, bookId, chapter, verse, text }

Highlight { id, verseRef, color, createdAt }
Note      { id, verseRef, text, createdAt, updatedAt }
Bookmark  { id, verseRef, createdAt }

Sermon {
  id, number, title, date,
  coverImageUri,
  intro,             // descripción/introducción (markdown)
  tags[], series, isFavorite,
  createdAt, updatedAt
}
SermonPoint {        // cada tarjeta del carrusel = un punto del bosquejo
  id, sermonId, order,
  heading,           // título del punto
  bodyMd,            // notas del punto (markdown, editable/pegable)
}
SermonVerseLink { id, sermonId, pointId, verseRef }   // cita ligada a un punto
```

El **cuerpo canónico de un sermón es Markdown** (`intro` + puntos). Importar/pegar texto se parsea a puntos por encabezados/separadores; exportar reserializa. De ahí `cuemd` = *cue cards en Markdown*.

`verseRef` = `versionId:bookId:chapter:verse` (formato estable para enlazar Biblia ↔ sermón).

---

## 7. Arquitectura técnica

### Recomendación
- **App**: React Native + **Expo** (un solo código iOS/Android, rápido de iterar) — o Flutter si prefieres. Dado tu stack (Next.js/Supabase) React Native reutiliza tu conocimiento de JS/TS.
- **Editor de texto enriquecido**: `@10play/tentap-editor` o similar (editor tipo Notion en RN); guardar el cuerpo como JSON/HTML.
- **Base de datos local (offline)**: **SQLite** (`expo-sqlite` / Drizzle o WatermelonDB). La Biblia se pre-empaqueta como SQLite semilla.
- **Datos de la Biblia**: importar una vez desde `wldeh/bible-api` o `getbible/v2` (JSON → SQLite en build). No llamar API en runtime → offline real.
- **Almacenamiento de imágenes**: sistema de archivos local (`expo-file-system`).
- **Sincronización (fase 2)**: **Supabase** (Postgres + Auth + Storage) — reutilizas lo que ya usas en la app de iglesia. Sync de sermones/notas por usuario.

### Diagrama lógico
```
[UI RN/Expo]
   ├─ Biblia  → SQLite (versiones semilla, solo lectura)
   ├─ Notas/Resaltados → SQLite (usuario)
   ├─ Sermones → SQLite (usuario) + FileSystem (imágenes)
   └─ (fase 2) Sync ↔ Supabase (auth, storage, postgres)
```

---

## 8. Pantallas (mapa de navegación)

- **Tabs inferiores**: `Biblia` · `Sermones` · `Búsqueda` · `Ajustes`.
- **Biblia**: selector versión → libros → capítulo (lectura). Long-press versículo → resaltar/nota/compartir.
- **Sermones**:
  - Lista (tarjetas estilo Dante Gebel: portada, `#985 | Estigma`, fecha, extracto).
  - Detalle: descripción arriba + **carrusel de puntos** (dots), botón "Predicar".
  - Modo Predicar: pantalla completa, swipe punto por punto, progreso "3 de 7", mini-índice.
  - Editor: título, fecha, portada, introducción, **lista de puntos reordenables** (drag), pegar/auto-dividir, "Insertar versículo".
- **Ajustes**: tema, tamaño de fuente, versión por defecto, backup/restore.

---

## 9. Riesgos y notas legales

- **Licencias de versiones**: RVR1960 y muchas modernas tienen copyright. Para tiendas usa **dominio público** (RV1909, KJV) o licencia oficial. — *bloqueante si publicas.*
- **Contenido de sermones ajenos**: si el usuario pega sermones de terceros (p. ej. Dante Gebel), es para **uso personal**; no habilitar publicación pública de ese contenido sin permiso.
- **Tamaño del binario**: empaquetar muchas versiones offline pesa; ofrecer descarga por versión bajo demanda.
- **Sync y privacidad**: notas/sermones son personales; cifrar/asegurar por usuario en Supabase.

---

## 10. Roadmap por fases

**Fase 1 — MVP (2–4 semanas)**
Biblia 1 versión offline (SQLite) + navegación + búsqueda + tema oscuro. Sermones CRUD con editor enriquecido, pegar/editar, portada, carrusel + modo lectura. Todo local.

**Fase 2 — Enriquecimiento**
Notas/resaltados en Biblia. Insertar versículo en sermón (enlace bidireccional). Exportar sermón (PDF/imagen). Múltiples versiones descargables.

**Fase 3 — Nube y comunidad**
Auth + sync con Supabase. Backup. (Opcional) publicar sermones a una congregación — puente con tu app de iglesia.

---

## 11. Próximo paso sugerido

Confirmar 3 decisiones y arranco el scaffold:
1. **Stack**: ¿React Native + Expo (recomendado) o Flutter?
2. **Versión bíblica inicial**: ¿RV1909 (dominio público, seguro para publicar) para empezar?
3. **Alcance v1**: ¿MVP Fase 1 tal cual, o incluir ya insertar-versículo?

---

### Fuentes
- CeluBiblia AIO (Google Play / Malavida)
- wldeh/bible-api, alejandroch1202/biblia-api, jh0rman/biblia-api, getbible/v2, API.Bible
- Referencia visual: capturas de la app *Dante Gebel Live!* (#984, #985)
