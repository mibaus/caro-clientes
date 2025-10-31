# Personalizar el ícono de la aplicación

## ✅ Pasos rápidos:

1. **Consigue tu imagen** (puede ser JPG, PNG, o cualquier formato)

2. **Genera los tamaños necesarios:**
   - Ve a: https://realfavicongenerator.net/ (LA MÁS FÁCIL)
   - O usa: https://favicon.io/
   
3. **Lo que necesitas generar:**
   - `icon-192.png` (192x192 píxeles)
   - `icon-512.png` (512x512 píxeles)

4. **Coloca los archivos:**
   - Guarda ambos en esta carpeta: `public/`
   - Los nombres deben ser EXACTAMENTE: `icon-192.png` y `icon-512.png`

5. **Sube y redeploy:**
   ```bash
   git add public/icon-192.png public/icon-512.png
   git commit -m "Actualizar ícono de la app"
   git push
   ```
   - En Vercel, el deploy se hará automáticamente

6. **Prueba en tu celular:**
   - Abre la app en el navegador
   - Menú → "Agregar a pantalla de inicio"
   - ¡Listo! Tu nuevo ícono aparecerá

## Consejos de diseño:

- ✅ Usa colores sólidos y contrastes fuertes
- ✅ Diseño centrado (considera el efecto "maskable" en Android)
- ✅ Evita texto pequeño (difícil de leer en iconos pequeños)
- ❌ No uses transparencias complejas
- ❌ No uses degradados muy sutiles

## Herramientas recomendadas:

- **Canva**: Para crear diseños desde cero
- **RealFaviconGenerator**: Para generar todos los tamaños automáticamente
- **ImageMagick**: Para redimensionar desde línea de comandos:
  ```bash
  # Si tienes una imagen grande llamada icon.png
  convert icon.png -resize 192x192 icon-192.png
  convert icon.png -resize 512x512 icon-512.png
  ```
