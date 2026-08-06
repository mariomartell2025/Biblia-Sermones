# Biblia: licencias, costos y modelo free/suscripción

**Objetivo:** una Biblia completa (versiones + concordancia + diccionario + comentarios) con un **tier gratis** y un **tier por suscripción**, sin problemas legales.
Fecha: 2026-08-05

---

## ⚠️ Lo primero (y lo más importante): la RV60 NO es gratis de distribuir

Querías la **RV60 (Reina Valera 1960) en el tier gratis**. Aclaración clave:

- La **RV1960** es **marca registrada y con derechos** de **Sociedades Bíblicas Unidas** (en EE.UU., la administra **American Bible Society**). **Necesita licencia siempre** — incluso si la pones "gratis" dentro de una app que monetiza por otro lado. Para efectos legales, una app con suscripción es **comercial en su totalidad**, así que la RV60 en el tier gratis **también paga licencia** (y el costo suele escalar con **todos** tus usuarios, no solo los que pagan).
- Lo que **sí es 100% gratis y sin licencia** es el **dominio público**: **Reina Valera 1909** (ya la tienes en la app), **Reina Valera Antigua (RVA)**, y en inglés la **KJV**.

**Conclusión práctica:** hay dos caminos para el tier gratis 👇

| Opción | Tier gratis | Costo de licencia | Recomendación |
|---|---|---|---|
| **A (recomendada)** | **RV1909** (dominio público) | **$0** | Arrancas sin costo ni riesgo; RV60 y modernas van en el tier de pago |
| **B** | **RV60** gratis | Pagas licencia por **todos** los usuarios (caro al crecer) | Solo si la RV60 gratis es un diferenciador que justifique el costo |

> Muchas apps grandes (YouVersion, etc.) tienen RV60 gratis porque son **organizaciones sin fines de lucro con acuerdos** o licencias amplias. Para una app comercial nueva, lo seguro es licenciar.

---

## 1. Versiones bíblicas — rutas y costos

### Dominio público (gratis, sin licencia, offline) — para el tier gratis
- **Reina Valera 1909** ✅ (ya incluida)
- **Reina Valera Antigua (RVA)**
- (Inglés) **KJV**, **ASV**, **Webster**
Costo de licencia: **$0**. Solo cuesta empaquetarlas (una vez).

### Con derechos (para el tier de pago): RV60, NVI, NTV, LBLA, DHH, RVC…
Dos formas de licenciarlas:

**a) Vía API.Bible (scripture.api.bible)** — la más práctica; la opera American Bible Society.
- **Starter (gratis):** $0, 5,000 llamadas/mes, hasta 3 traducciones con derechos… **pero SOLO uso NO comercial** (sin ads, sin freemium, sin suscripción). No te sirve para una app monetizada.
- **Pro:** desde **$29/mes** (150,000 llamadas); excedente **$1 por cada 1,000** llamadas.
- **Licencia comercial de cada traducción con derechos:** **desde ~$10/mes por traducción**, y **varía según el titular de derechos y tu número de usuarios/mes**. El costo exacto lo ves **al agregar la Biblia en el checkout**. Algunas traducciones tienen tope de usuarios; la **NIV no está disponible** para licencia comercial ahí.

**b) Licencia directa con Sociedades Bíblicas / editoriales** — para RV60 y otras.
- Contacto: **American Bible Society** → `licensing@americanbible.org`.
- Modelo típico: **cuota anual fija** o **regalías** (a veces % de ingresos o por descarga). Se negocia; pide su tarifario para "digital/app con suscripción".

> **Referencia de mercado:** apps de RV60 "premium" cobran **~$12.99/mes** o **~$69.99/año**. Eso te da un techo realista para tu precio de suscripción.

---

## 2. Concordancia — casi todo dominio público ✅

- **Concordancia de Strong** + **Diccionario Hebreo/Griego de Strong** (los famosos **números Strong**): **dominio público**. Es la base de casi todas las apps de estudio.
- Puedes **enlazar cada palabra del texto bíblico a su número Strong** y mostrar la definición. En español existen concordancias mapeadas a los números Strong.
- Costo de licencia: **$0** (usando la obra original de Strong). Solo necesitas el dataset (hay versiones abiertas del léxico Strong).

**Diferenciador de pago:** concordancia temática moderna o exhaustiva con derechos → licencia aparte.

---

## 3. Diccionario bíblico

| Recurso | Estado | Costo |
|---|---|---|
| **Easton's Bible Dictionary** | Dominio público (inglés) | $0 |
| **Smith's Bible Dictionary** | Dominio público (inglés) | $0 |
| **ISBE** (International Standard Bible Encyclopedia) | Dominio público (inglés) | $0 |
| Diccionarios **modernos en español** (ej. Ilustrado Holman, Vila-Escuain de CLIE) | Con derechos | Licencia con la editorial |

> **Ojo (gotcha real):** el dominio público aplica a la **obra original**. Una **traducción moderna al español** de un diccionario/comentario **puede tener copyright propio** aunque el original en inglés sea libre. Para español: usa un texto genuinamente de dominio público **o** licencia la traducción.

---

## 4. Comentarios bíblicos

| Comentario | Estado | Uso |
|---|---|---|
| **Matthew Henry** | Original inglés: dominio público. Traducción española: **verificar** (muchas ediciones tienen copyright editorial) | Buscar una traducción PD o licenciar |
| **Jamieson-Fausset-Brown**, **Adam Clarke**, **Barnes' Notes**, **Spurgeon** | Dominio público (inglés) | Gratis (traducción: mismo cuidado) |
| Comentarios modernos (ej. serie con derechos de Vida, CLIE, Grupo Nelson, B&H) | Con derechos | Licencia / revenue share → **tier de pago** |

Editoriales para licenciar contenido moderno en español: **Editorial CLIE**, **Editorial Vida (HarperCollins)**, **Grupo Nelson**, **B&H Español**.

---

## 5. Modelo recomendado (free / suscripción)

```
TIER GRATIS ($0 de licencia, todo offline y empaquetado):
  • Reina Valera 1909 (dominio público)
  • Concordancia Strong + diccionario Strong (números)
  • 1 diccionario bíblico de dominio público
  • Búsqueda, resaltados, notas, devocional, sermones
     → Ya tienes casi todo esto construido.

TIER SUSCRIPCIÓN (contenido con licencia, detrás del paywall):
  • RV60, NVI, NTV, LBLA, RVC, DHH… (vía API.Bible o licencia directa)
  • Comentarios modernos (Matthew Henry en español con licencia, u otros)
  • Diccionario ilustrado moderno
  • Planes de estudio, audio, etc.
```

### Arquitectura para que "la Biblia esté lista" para esto
1. **Empaqueta lo de dominio público** en la app (offline, $0) → tier gratis.
2. **El contenido licenciado se sirve desde tu backend** (Supabase + Stripe para el paywall), o directo de **API.Bible**, **solo a suscriptores**. Así el **costo por versión escala con los que pagan**, no con todos.
3. **Registro de versiones** con bandera `free`/`premium` y `source` (`bundled` | `api`), para prender/apagar contenido sin tocar la UI. (Scaffold añadido en `src/bible/versions.ts`.)
4. Concordancia = enlazar el texto a **números Strong** (léxico empaquetado, gratis).

---

## 6. Estimación de costos (rangos realistas)

| Concepto | Costo aproximado |
|---|---|
| Versiones dominio público (RV1909, RVA, KJV…) | **$0** |
| Concordancia + diccionario Strong (PD) | **$0** |
| Diccionario/comentario PD (inglés) | **$0** |
| API.Bible plan Pro (para servir versiones con derechos) | **desde $29/mes** + excedentes |
| Licencia comercial por traducción con derechos (RV60, NVI…) | **desde ~$10/mes c/u**, escala con usuarios |
| Licencia directa RV60 (Sociedades Bíblicas) | Cuota anual/regalía **a negociar** (pide tarifario) |
| Comentario/diccionario moderno en español (editorial) | Licencia o **revenue share** (varía; a negociar) |

**Presupuesto inicial realista para lanzar:**
- **Tier gratis:** **$0 de licencias** (solo dominio público) → puedes lanzar ya.
- **Tier de pago (arranque, pocos usuarios):** ~**$29/mes** (API.Bible Pro) **+ ~$10–30/mes por cada versión con derechos** que ofrezcas. Sube conforme crecen los suscriptores.
- **Precio de venta sugerido:** alinéate al mercado → **~$4.99–$9.99/mes** o **~$39–$69/año** (deja margen sobre el costo de licencias).

---

## 7. Checklist de acción

1. **Lanzar el tier gratis con dominio público** (RV1909 + Strong) — **cero licencias, cero riesgo**. Ya casi listo.
2. **Escribir a `licensing@americanbible.org`** pidiendo tarifa para **RV60 en app con suscripción** (di: plataforma, modelo freemium, usuarios estimados).
3. **Crear cuenta en [API.Bible](https://scripture.api.bible/)**, ver en el **checkout** el costo real de RV60/NVI/NTV según tus usuarios.
4. **Para comentarios/diccionarios modernos en español:** contactar **CLIE / Vida / Grupo Nelson / B&H Español**.
5. **Confirmar el estatus PD** de cualquier **traducción al español** antes de empaquetarla (el original PD no garantiza que la traducción lo sea).
6. **Mantener el paywall del lado del backend** (Supabase/Stripe) para que el contenido con licencia solo llegue a suscriptores.

---

## 8. Cómo se financia (lección de CeluBiblia AIO)

**Modelo real de CeluBiblia (confirmado):** empezó como **pago único ~$7–10 USD sin anuncios**, y **ahora la versión gratis muestra publicidad ocasional**. Es decir, diversificó a **dos ingresos**: compra del PRO **+** ads en el free. Clave de su sostenibilidad: **todo offline y empaquetado → costo de servidor ≈ $0**, así que casi todo es margen. (Sobre las licencias del contenido con derechos: no publican ninguna → probablemente **zona gris/tolerada**, riesgo alto para un desarrollador en EE.UU.)

### Tus 3 vías de ingreso (combínalas)

1. **Free con anuncios (AdMob)** — ingreso **pasivo y recurrente** de los que no pagan.
   - eCPM realista: banner ~$0.5–2; intersticial ~$3–8 (mostrado con moderación). Audiencia LatAm ≈ extremo bajo; EE.UU. ≈ más alto.
   - Estimación: `ingreso/mes ≈ usuarios_activos × impresiones_por_usuario/mes × eCPM ÷ 1000`.
     - Ej.: 20,000 activos × 20 impresiones/mes × $2 eCPM ÷ 1000 ≈ **$800/mes** (muy variable).
   - Úsalos **con moderación** ("ocasional", como CeluBiblia): en apps devocionales, saturar de ads espanta usuarios.

2. **PRO de pago único** — caja **por adelantado**. Solo con contenido que puedas **empaquetar legalmente** (dominio público: RV1909, Strong's, diccionario/comentario PD). Margen casi total (menos 15–30% de la tienda). Precio de mercado: **~$7–10 USD**.

3. **Suscripción** — para el contenido **con licencia** (RV60, NVI, NTV, comentarios modernos). Cubre el **costo recurrente** de la licencia (que escala con usuarios). Precio: **$4.99–9.99/mes** o **$39–69/año**.

### Comisión de tiendas
Apple/Google se llevan **30%** (o **15%** si calificas al programa de pequeños negocios / suscripciones tras el primer año). Considéralo en todos los cálculos.

### Recomendación de mezcla para ti (EE.UU.)
- **Free (con ads moderados)**: RV1909 + Strong's + diccionario PD, offline. Ingreso pasivo + embudo.
- **PRO pago único (~$9.99)**: quita ads + extras empaquetables legalmente (mapas, planes, más recursos PD).
- **Suscripción (~$5.99/mes)**: desbloquea RV60/NVI/modernas y comentarios con derechos, servidos desde tu backend.
> Así imitas la **eficiencia de costos** de CeluBiblia (offline + pago único para lo libre) **sin** su riesgo legal (lo licenciado va por suscripción, no empaquetado gris).

---

## 9. Estrategia elegida: RV60 GRATIS (modelo YouVersion)

Decisión de Mario: **regalar la RV60 empaquetada** (aunque él pague la licencia) y hacer la app autosostenible después. Es viable — la clave es el **tipo de licencia**.

- ❌ **Por usuario (API.Bible):** el costo crece sin control con los usuarios → NO sirve para "gratis para todos".
- ✅ **Directa fija / ministerio:** costo **acotado que tú controlas** (anual fijo o **libre de regalías**) + derecho **offline**. **Esto** hace posible el plan.
- 🎯 **A tu favor:** como la RV60 se **regala** (no es lo que cobras), calificas para condiciones **mucho más baratas, a veces gratis**. Así opera YouVersion.

**Pasos:**
1. Escribir a `licensing@americanbible.org` (dueña de RVR60): pedir permiso para **distribuir RVR60 gratis, offline, en app** — encuadre **ministerio/Escritura gratuita**. Pedir explícito: (a) offline/empaquetado, (b) gratis al usuario, (c) esquema fijo/ministerio.
2. Revisar **Digital Bible Library (DBL)** y **Digital Bible Society** (canal estándar de textos con licencia para distribución gratuita).
3. **No empaquetar la RV60 sin permiso escrito.**

**Avisos:**
- **NVI: NO se puede empaquetar offline** (Biblica no licencia uso descargable) → online/API, tier de pago.
- El "500 versículos libres" no cubre la Biblia completa.

**Puente para lanzar ya:** salir con **RV1909 (dominio público, $0)** o **RV Gómez** gratis + diferenciadores; sustituir por **RV60 gratis** al llegar el permiso.

**Autosostenible después (RV60 como gancho):** ads moderados en el free + PRO pago único (quita ads + extras PD) + suscripción para lo que NO se puede regalar (NVI/NTV online, comentarios modernos) + donaciones (el encuadre ministerio ayuda a la licencia Y a los ingresos).

---

### Fuentes
- American Bible Society — Rights & Permissions (RV60 licensing)
- API.Bible — planes, Express Licensing for Commercial Use, FAQs
- Concordancia/diccionario Strong, Matthew Henry (dominio público, con cuidado en traducciones)
