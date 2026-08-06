# Generar Assets (Logo, Icons, Screenshots)

## **Opción A: Online (Más fácil, 5 min)**

### 1️⃣ Convertir SVG a PNG

Usa **Cloudconvert** (gratis):
- Ve a https://cloudconvert.com/svg-to-png
- Sube `assets/logo.svg`
- Descarga en estas dimensiones:

```
icon.png           → 512x512 px (para app.json)
icon-192.png       → 192x192 px (Android)
icon-rounded.png   → 512x512 px (con bordes redondeados)
featured-image.png → 1024x500 px (Play Store)
```

### 2️⃣ Imagen destacada Play Store (1024x500)

Usa **Canva** (gratis):
1. Ve a canva.com
2. Crea diseño "Custom size" → 1024x500
3. Fondo: azul marino (#0b1018)
4. Texto grande: "Biblia + Sermones"
5. Subtítulo: "Offline. Libre. Para predicadores."
6. Descarga como PNG

### 3️⃣ Screenshots (Play Store necesita 5)

Tomarás en tu emulador/device:
1. **Biblia - Lectura** → abre Juan 3:16
2. **Biblia - Búsqueda** → busca "amor"
3. **Sermones - Lista** → muestra sermones
4. **Modo Predicador** → fullscreen de un punto
5. **Ajustes** → tema/idioma/tamaño

**Herramienta fácil para editar screenshots:**
- https://www.canva.com/templates/EADfVx8RLDw-simple-app-screenshot/
- Sube screenshot + añade callouts/text

---

## **Opción B: Local (Si tienes ImageMagick)**

```bash
# Instalar ImageMagick (Mac)
brew install imagemagick

# Convertir SVG a PNG en múltiples tamaños
convert -background none -size 512x512 assets/logo.svg -resize 512x512 assets/icon.png
convert -background none -size 192x192 assets/logo.svg -resize 192x192 assets/icon-192.png

# Crear imagen destacada (1024x500 con fondo)
convert -size 1024x500 xc:'#0b1018' \
  -gravity center \
  -pointsize 80 \
  -fill '#e8ecf4' \
  -annotate 0 "Biblia + Sermones" \
  -pointsize 32 \
  -annotate +0+80 "Offline. Libre. Para predicadores." \
  assets/featured-image.png
```

---

## **Checklist de Assets para Play Store**

```
✓ icon.png (512x512) → app.json
✓ icon-192.png (192x192) → Android
✓ featured-image.png (1024x500) → Play Store banner
✓ android-icon-foreground.png (108x108) → Adaptive icon
✓ android-icon-background.png (108x108) → Adaptive icon color

✓ screenshot-1.png (1080x1920) → Lectura
✓ screenshot-2.png (1080x1920) → Búsqueda
✓ screenshot-3.png (1080x1920) → Sermones
✓ screenshot-4.png (1080x1920) → Predicador
✓ screenshot-5.png (1080x1920) → Ajustes
```

---

## **Actualizar app.json**

Después de generar los assets, update `app.json`:

```json
{
  "expo": {
    "name": "Biblia + Sermones",
    "slug": "biblia-sermones",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#0b1018",
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundImage": "./assets/android-icon-background.png"
      }
    }
  }
}
```

---

## **Mi recomendación: Opción A (Canva + Cloudconvert)**

1. Ve a **Cloudconvert**, sube el SVG
2. Descarga `icon-512.png` → guarda como `assets/icon.png`
3. Ve a **Canva**, crea imagen 1024x500
4. Toma screenshots en tu emulador (usa Android Studio)
5. Edita screenshots en Canva si quieres callouts

**Total: 20-30 minutos**

---

## **Colores del branding**

Si necesitas versiones adicionales del logo:

- **Primario:** #6ea8fe (azul accent)
- **Fondo:** #0b1018 (navy oscuro)
- **Texto:** #e8ecf4 (blanco)
- **Muted:** #9aa4b8 (gris)

---

## **Después de generar assets:**

```bash
# Copiar todos los PNG a assets/
mv ~/Downloads/icon-*.png assets/
mv ~/Downloads/featured-image.png assets/
mv ~/Downloads/android-icon-*.png assets/

# Verificar que existen
ls assets/*.png
```

Luego puedes proceder con `eas build`.
