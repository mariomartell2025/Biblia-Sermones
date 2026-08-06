# Biblia + Sermones

App móvil (Expo + React Native + TypeScript) con dos módulos:

- **Biblia** — lectura offline (por construir; ver [APP_BIBLIA_SERMONES.md](APP_BIBLIA_SERMONES.md)).
- **Sermones** — el usuario crea/pega/edita predicaciones y las predica en un
  **carrusel de tarjetas**: cada tarjeta es un punto del bosquejo y se avanza
  deslizando de lado a lado ("Modo Predicar"). Inspirado en la sección
  "Mensajes en YouTube" de la app Dante Gebel.

> Proyecto **independiente** de `~/cuemd` (señales para alabanza) y de la app de
> iglesia. No mezclar.

## Correr

```bash
npm install
npm run web      # navegador (http://localhost:8081)
npm run ios      # simulador iOS (requiere Xcode)
npm run android  # emulador Android
```

O directamente: `npx expo start` y elige plataforma.

## Estructura

```
App.tsx                  Router liviano + carga/guardado (AsyncStorage)
src/
  types.ts               Modelo: Sermon + SermonPoint (Markdown = fuente de verdad)
  theme.ts               Tema oscuro (estilo Dante Gebel)
  split.ts               Auto-dividir texto pegado en puntos (##, 1., ---, párrafos)
  seed.ts                Sermón de ejemplo (#985 Estigma)
  storage.ts             Persistencia local
  screens/
    ListScreen.tsx       Feed de tarjetas de sermones
    DetailScreen.tsx     Intro + carrusel de puntos (dots) + botón Predicar
    PreachScreen.tsx     Modo Predicar a pantalla completa (swipe punto por punto)
    EditScreen.tsx       Crear/editar: pegar+auto-dividir, reordenar, insertar
```

## Estado actual (prototipo verificado en web)

- [x] Lista de sermones
- [x] Detalle: introducción + carrusel de puntos con dots y contador
- [x] Modo Predicar: pantalla completa, swipe + botones Anterior/Siguiente
- [x] Editor: pegar bosquejo → auto-dividir en puntos; reordenar (↑↓) y eliminar
- [x] **Importar archivo** → texto → auto-dividir: `.txt`, `.md`, `.rtf`, `.docx` (offline)
- [x] Persistencia local (AsyncStorage)
- [x] **Módulo Biblia offline (Reina Valera, dominio público)**: 66 libros AT/NT,
      navegación Libro › Capítulo › Versículo, lector con Anterior/Siguiente,
      búsqueda por texto y por referencia (parseo "Juan 3:16")
- [ ] Importar `.pdf` (texto: pdf.js en web / nube en móvil) y OCR para PDF escaneado
- [ ] Insertar versículo dentro de un punto (Biblia → sermón)
- [ ] Resaltados/notas por versículo · auto-scroll al versículo buscado
- [ ] Imagen de portada, exportar (PDF/imagen), etiquetas/series
- [ ] Sync en la nube (Supabase)
