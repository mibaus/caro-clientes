# 🎯 Gestión de Clientes

Aplicación web moderna y elegante para gestión de clientes y ventas, integrada con Google Sheets a través de Apps Script.

## ✨ Características

- 🔐 **Autenticación segura** con contraseña y rate limiting
- 🔍 **Búsqueda inteligente** con debounce y filtros por zona
- 📊 **Gestión de clientes** con información detallada
- 💰 **Registro de ventas instantáneo** (optimistic UI)
- 🎂 **Cumpleaños del día** con integración de WhatsApp
- 📱 **Responsive** y optimizado para móvil
- 🎨 **Diseño moderno** con TailwindCSS
- ⚡ **Ultra rápido** con lazy loading y memoización

## 🚀 Inicio Rápido

### Instalación

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build
```

## 🔧 Configuración de Variables de Entorno

### Desarrollo Local

1. **Crea el archivo `.env.local`:**
   ```bash
   touch .env.local
   ```

2. **Completa las variables en `.env.local`:**

   ```
   # Seguridad
   VITE_AUTH_KEY=tu_clave_segura
   
   # Apps Script
   APPSCRIPT_URL=https://script.google.com/macros/s/TU_SCRIPT_ID/exec
   APPSCRIPT_TOKEN=tu_token_secreto
   ```

### Configuración en Vercel

1. **Ve a tu proyecto en Vercel Dashboard**
2. **Settings > Environment Variables**
3. **Agrega las variables:**

   ```
   VITE_AUTH_KEY = tu_clave_segura
   APPSCRIPT_URL = https://script.google.com/macros/s/TU_SCRIPT_ID/exec
   APPSCRIPT_TOKEN = tu_token_secreto
   ```

4. **Importante:** Selecciona en qué entornos aplicar (Production, Preview, Development)
5. **Redeploy** tu proyecto después de agregar las variables

> 📖 **Para instrucciones detalladas de autenticación**, ver `INSTRUCCIONES-AUTENTICACION.md`

### ✅ Configuración de Apps Script

Tu Apps Script debe tener los siguientes endpoints:

#### GET - Obtener Clientes
```
?action=getClientes&token=TU_TOKEN
```

Debe retornar un array de objetos cliente:
```json
[
  {
    "id": "1",
    "nombre": "Juan",
    "apellido": "Pérez",
    "zona": "Centro",
    "telefono": "5491123456789",
    "fechaNacimiento": "1990-05-15",
    "ultimaCompra": "2025-10-20"
  }
]
```

#### POST - Guardar Venta
```json
{
  "action": "guardarVenta",
  "token": "TU_TOKEN",
  "clienteID": "1",
  "fecha": "2025-10-25"
}
```

El script debe escribir en la hoja "Ventas" con columnas "Fecha" y "ClienteID".

## 📝 Estructura del Proyecto

```
/api
  /clientes.js          - API para gestión de clientes (GET, POST)
  /ventas.js            - API para registro de ventas (POST)
/src
  /components
    SearchBar.jsx       - Buscador con filtros
    ClientList.jsx      - Lista de clientes
    ClientModal.jsx     - Modal de acciones del cliente
    BirthdayView.jsx    - Vista de cumpleaños
    Toast.jsx           - Notificaciones
  App.jsx               - Componente principal
  main.jsx              - Punto de entrada
  index.css             - Estilos globales
index.html              - HTML base
vite.config.js          - Configuración de Vite
tailwind.config.js      - Configuración de Tailwind
vercel.json             - Configuración de Vercel
```

## 🚀 Deploy en Vercel

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno (APPSCRIPT_URL, APPSCRIPT_TOKEN)
3. El build se ejecuta automáticamente con `npm run build`
4. Vercel sirve los archivos estáticos desde `/dist` y las APIs desde `/api`

## 🎨 Stack Tecnológico

- **Frontend:** React 18 + Vite
- **Estilos:** TailwindCSS
- **Iconos:** Lucide React
- **Backend:** Vercel Serverless Functions
- **Base de Datos:** Google Sheets (vía Apps Script)
- **Deploy:** Vercel

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
