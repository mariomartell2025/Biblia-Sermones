# Guía: Lanzar en Play Store

**Objetivo:** Publicar la app en Google Play Store (Android)
**Costo:** $25 (one-time)
**Tiempo:** ~2 horas (build) + 1-2 días (revisión Google)

---

## **PASO 1: Requisitos previos**

```bash
# Instalar/actualizar Expo CLI globalmente
npm install -g eas-cli

# Verifica que estés logueado en Expo
eas whoami
# Si no estás logueado:
eas login
# (usa tu cuenta de Expo - crea una si no tienes)
```

---

## **PASO 2: Generar keystore (certificado Android)**

```bash
# En la carpeta del proyecto, genera la clave de firma
eas build --platform android --latest

# Te pedirá:
# 1. ¿Crear nueva clave Android? → YES
# 2. ¿Usar la keystore de Expo? → YES (recomendado)
# 3. Keystore alias: usa default (Enter)
```

**Nota:** Esto genera automáticamente el keystore en Expo. Google Play lo usa para futuras actualizaciones.

---

## **PASO 3: Build de producción**

```bash
# Hacer el build AAB (Android App Bundle - formato que Play Store requiere)
eas build --platform android --profile production

# El build tarda ~10-15 minutos
# Verás output como:
# ✓ Build finished
# Download URL: https://expo.dev/artifacts/...
```

**Descarga el archivo `.aab`** (el link te lo da EAS al terminar)

---

## **PASO 4: Crear cuenta Google Play Developer**

1. Ve a https://play.google.com/console
2. Click **"Create account"** → Paga **$25** (único)
3. Completa perfil:
   - Nombre: "Mario Martell" (o tu nombre)
   - País: USA
   - Email de desarrollador

**Espera ~30 min a que se active la cuenta**

---

## **PASO 5: Crear la app en Play Console**

1. En Play Console, click **"Create app"**
2. Nombre: **"Biblia + Sermones"**
3. Idioma principal: **Español**
4. Categoría: **Libros y referencias**
5. Click **Create**

---

## **PASO 6: Llenar el App Listing**

En Play Console, sección **"App information"**:

### **Pantalla principal**
- **Título:** Biblia + Sermones
- **Descripción corta:** Biblia offline + tu gestor de sermones. Libre. Para predicadores.
- **Descripción completa:**

```
📖 Biblia offline (RV1909, dominio público)
• Navegación completa por libros, capítulos y versículos
• Búsqueda rápida de textos
• Favoritos e historial de lectura
• Tema claro/oscuro/sepia
• Idioma español/inglés

🎤 Gestor de sermones
• Crea y edita tus propios sermones
• Carrusel de puntos para predicar
• "Modo Predicador" para leer mientras hablas
• Sugesor inteligente de versículos por tema
• Conecta versículos directamente a tus sermones

✨ Características
• 100% offline - no requiere internet
• Almacenamiento local seguro
• Interfaz limpia y rápida
• Licencia abierta - contenido de dominio público

Para predicadores, líderes y cualquiera que ame la Biblia.
Gratuito. Sin publicidad. Sin restricciones.
```

### **Screenshots** (5 obligatorios)
Captura pantallas de:
1. Biblia - Lectura
2. Biblia - Búsqueda
3. Sermones - Lista
4. Sermones - Modo Predicador
5. Ajustes (Tema/Idioma)

### **Imagen de destacado** (1024x500px)
Texto: "Biblia offline + tus sermones"
Fondo: Oscuro (azul marino)

### **Icono** 
Ya tienes en `./assets/icon.png`

---

## **PASO 7: Cargar el build**

En Play Console, sección **"Releases"**:

1. Click **"Create new release"** (internal testing primero)
2. Selecciona archivo AAB (el que descargaste de EAS)
3. Release notes:
   ```
   v1.0.0 - Lanzamiento inicial
   • Biblia RV1909 completa
   • Gestor de sermones
   • Tema/Idioma personalizables
   ```
4. Click **"Review release"**
5. Click **"Start rollout to internal testing"**

---

## **PASO 8: Configurar permisos y privacidad**

Sección **"Policy"**:

- **Política de privacidad:** Crea una simple:
  ```
  Esta app almacena datos localmente en tu dispositivo.
  No recopilamos, vendemos ni compartimos datos personales.
  La app es offline - no se conecta a servidores.
  ```
  (Sube a un sitio, ej. GitHub Pages, y pega el link)

- **Contenido adecuado:** Elige "Books and Reference"
- **Target audience:** 12+

---

## **PASO 9: Llenar datos de contacto y legal**

Sección **"App content"**:

- **Email de contacto:** tu email
- **Website:** (opcional) tu sitio
- **Teléfono:** (opcional)

---

## **PASO 10: Pedir revisión y publicar**

1. Después de llenar todo, verás un checklist
2. Completa todo (debería estar todo verde)
3. Sección **"Release"** → Click **"Manage on all tracks"**
4. Click **"Create new release"** en "Production"
5. Sube el AAB de nuevo
6. Click **"Review and roll out to production"**
7. Google la revisa (1-3 días típicamente)

---

## **PASO 11: Monitorear (después del lanzamiento)**

- Vuelve a Play Console cada día los primeros 3 días
- Mira **Stats** → crashes, instalaciones
- Lee **Reviews** y responde si hay bugs
- Prepara update si encuentras algo crítico

---

## **Checklist final**

- [ ] eas.json existe en la carpeta raíz
- [ ] Hiciste `eas build --platform android --profile production`
- [ ] Descargaste el archivo `.aab`
- [ ] Pagaste $25 en Google Play Console
- [ ] Llenaste el listing (títulos, descripción, screenshots)
- [ ] Subiste el AAB
- [ ] Llenaste privacidad y contenido
- [ ] Pediste revisión a Play Store
- [ ] Esperaste aprobación (1-3 días)

---

## **Después del lanzamiento**

- Monitorea crashes en Play Console
- Actualiza según feedback
- Agrega versiones bíblicas adicionales (v1.1+)
- Implementa suscripción si quieres Premium (v2.0+)

---

## **Contacto si necesitas ayuda**

Si hay problemas en el build:
- `eas build --help` (ver opciones)
- `eas device:create` (si necesitas testing en device real)
- https://docs.expo.dev/build/introduction/ (docs oficial)

¡Éxito! 🚀
