# Caro Clientes - Sistema de Gestión

Sistema de gestión de clientes integrado con Google Sheets.

## 🔧 Configuración de Variables de Entorno

### Desarrollo Local

1. **Copia el archivo de ejemplo:**
   ```bash
   cp .env.example .env.local
   ```

2. **Completa las variables en `.env.local`:**

   - **SHEET_ID**: ID de tu Google Sheet (se encuentra en la URL)
   - **GOOGLE_SHEETS_API_KEY**: API Key de Google Cloud Console
   - **APPS_SCRIPT_URL**: URL de tu Apps Script desplegado
   - **APPS_SCRIPT_TOKEN**: Token de seguridad personalizado

### Configuración en Vercel

Para que funcione en producción, debes configurar las mismas variables en Vercel:

1. **Ve a tu proyecto en Vercel Dashboard**
2. **Settings > Environment Variables**
3. **Agrega cada variable:**

   ```
   SHEET_ID = [tu_valor]
   GOOGLE_SHEETS_API_KEY = [tu_valor]
   APPS_SCRIPT_URL = [tu_valor]
   APPS_SCRIPT_TOKEN = [tu_valor]
   ```

4. **Importante:** Selecciona en qué entornos aplicar (Production, Preview, Development)
5. **Redeploy** tu proyecto después de agregar las variables

### ✅ Cómo Obtener las Credenciales

#### Google Sheets API Key:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea o selecciona un proyecto
3. Navega a **APIs & Services > Library**
4. Busca "Google Sheets API" y actívala
5. Ve a **APIs & Services > Credentials**
6. Click en **Create Credentials > API Key**
7. **Importante:** Restringe la API Key:
   - En **API restrictions**, selecciona "Google Sheets API"
   - En **Application restrictions**, considera restringir por HTTP referrer

#### Sheet ID:

Es el ID en la URL de tu Google Sheet:
```
https://docs.google.com/spreadsheets/d/ESTE_ES_TU_SHEET_ID/edit
```

#### Permisos del Google Sheet:

Asegúrate de que tu Google Sheet tenga permisos de **Anyone with the link can view** o que la API Key tenga acceso.

## 📝 Estructura del Proyecto

```
/api
  /clientes.js   - API para gestión de clientes
  /ventas.js     - API para registro de ventas
index.html       - Frontend de la aplicación
vercel.json      - Configuración de Vercel
```

## 🚀 Deploy

El proyecto está configurado para deployarse automáticamente en Vercel. Asegúrate de configurar las variables de entorno antes del deploy.

## 🐛 Solución de Problemas

### Error: "Faltan credenciales del entorno"

- **Causa:** Las variables de entorno no están configuradas
- **Solución:** 
  1. Verifica que `.env.local` existe y tiene los valores correctos (local)
  2. Verifica que las variables estén configuradas en Vercel Dashboard (producción)
  3. Redeploy el proyecto en Vercel después de agregar variables

### Error: "No se encontraron datos"

- **Causa:** La hoja "Clientes" no existe en el Google Sheet o está vacía
- **Solución:** Verifica que tu Google Sheet tenga una hoja llamada "Clientes" con datos

### Error de permisos en Google Sheets

- **Causa:** El Google Sheet es privado
- **Solución:** Cambia los permisos a "Anyone with the link can view"
