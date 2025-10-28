# 🐛 Diagnóstico del Problema: "No se encontraron clientes"

## 📋 Problema Reportado
La app muestra el mensaje: **"No se encontraron clientes en la respuesta"**

---

## 🔍 Pasos para Diagnosticar

### **Paso 1: Verificar Variables de Entorno en Vercel**

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `caro-clientes`
3. Ve a **Settings** → **Environment Variables**

**Verifica que tengas configuradas**:
```
✅ VITE_AUTH_KEY = tu_clave_secreta
✅ APPSCRIPT_URL = https://script.google.com/macros/s/TU_ID/exec
✅ APPSCRIPT_TOKEN = tu_token
```

**⚠️ IMPORTANTE**: 
- Si falta alguna → Agrégala
- Si las agregaste recién → Redeploy el proyecto
- Settings → Deployments → Click en los 3 puntos → Redeploy

---

### **Paso 2: Ver Logs en la Consola del Navegador**

He agregado logs detallados para diagnosticar. Sigue estos pasos:

1. **Abre la app** en tu navegador
2. **Abre la consola de desarrollo**:
   - Chrome/Edge: `F12` o `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
   - Safari: `Cmd+Option+C`
3. **Refresca la página** (`F5` o `Cmd+R`)
4. **Busca estos mensajes** en la consola:

```
📡 Respuesta completa del API: {...}
📊 Tipo de respuesta: ...
🔍 Es array?: ...
```

---

### **Paso 3: Interpretar los Logs**

#### **Escenario A: Error de API**
Si ves:
```
❌ Error del API: Faltan credenciales del entorno
```

**Solución**:
- Las variables de entorno no están configuradas en Vercel
- Ve al Paso 1 y configúralas
- Redeploy

---

#### **Escenario B: Error de Apps Script**
Si ves:
```
❌ Error del API: Unauthorized
```
o
```
❌ Error del API: Invalid token
```

**Solución**:
- El `APPSCRIPT_TOKEN` es incorrecto
- Verifica en tu Apps Script cuál es el token correcto
- Actualiza en Vercel
- Redeploy

---

#### **Escenario C: Apps Script no responde**
Si ves:
```
📡 Respuesta completa del API: {}
⚠️ Formato de respuesta no reconocido: []
```

**Solución**:
- El Apps Script está retornando vacío
- Verifica que tu Google Sheet tenga datos en la hoja "Clientes"
- Verifica que el Apps Script esté desplegado correctamente

---

#### **Escenario D: URL incorrecta**
Si ves un error de red:
```
Error al cargar clientes: Failed to fetch
```

**Solución**:
- La `APPSCRIPT_URL` es incorrecta
- Verifica que sea la URL del Web App desplegado
- Debe terminar en `/exec`

---

### **Paso 4: Verificar Google Apps Script**

1. **Abre tu Apps Script**: [script.google.com](https://script.google.com)
2. **Abre tu proyecto**
3. **Verifica que la función `getClientes()` exista**
4. **Prueba manualmente**:
   - Ejecutar → Selecciona `getClientes`
   - Click en "Run"
   - Debe retornar datos

5. **Verifica el despliegue**:
   - Deploy → Manage deployments
   - Debe haber un Web App activo
   - Copia la URL (debe terminar en `/exec`)

---

### **Paso 5: Verificar Google Sheet**

1. **Abre tu Google Sheet**
2. **Verifica que tenga una hoja llamada "Clientes"** (exacto, con mayúscula)
3. **Verifica que tenga datos**:
   - Fila 1: Headers (ClienteID, Nombre, etc.)
   - Fila 2+: Datos de clientes

4. **Verifica los permisos**:
   - Share → Anyone with the link can view
   - O asegúrate que el Apps Script tiene acceso

---

## 🔧 Soluciones Rápidas

### **Solución 1: Reconfigurar Variables de Entorno**

En Vercel, asegúrate de tener:

```bash
# Nombre EXACTO     |  Valor de ejemplo
VITE_AUTH_KEY       = MiClave2024!
APPSCRIPT_URL       = https://script.google.com/macros/s/AKfycbxxx.../exec
APPSCRIPT_TOKEN     = mi-token-secreto-123
```

**Después de agregar/editar → REDEPLOY**

---

### **Solución 2: Verificar Apps Script URL**

Tu `APPSCRIPT_URL` debe verse así:
```
https://script.google.com/macros/s/AKfycbxxxxxxxxx.../exec
                                      ^^^^^^^^^^^^^
                                      Tu ID único
```

**Cómo obtenerla**:
1. Apps Script → Deploy → Manage deployments
2. Click en el deployment activo
3. Copia la "Web app URL"
4. Pégala en Vercel como `APPSCRIPT_URL`

---

### **Solución 3: Redeploy en Vercel**

Después de hacer cambios:
1. Vercel Dashboard → Tu proyecto
2. Deployments
3. Click en los 3 puntos del último deploy
4. "Redeploy"
5. Espera 1-2 minutos

---

## 📸 Qué Compartir para Ayuda

Si el problema persiste, copia y pega esto:

1. **Logs de la consola** (screenshot o texto)
2. **Variables de entorno en Vercel** (sin mostrar valores sensibles):
   ```
   ✅ VITE_AUTH_KEY = configurada
   ✅ APPSCRIPT_URL = configurada
   ✅ APPSCRIPT_TOKEN = configurada
   ```
3. **Respuesta del API** (el objeto JSON que aparece en consola)

---

## ✅ Checklist Completo

- [ ] Variables de entorno configuradas en Vercel
- [ ] Redeploy después de configurar variables
- [ ] Apps Script desplegado como Web App
- [ ] URL del Apps Script correcta (termina en /exec)
- [ ] Token del Apps Script correcto
- [ ] Google Sheet tiene hoja "Clientes"
- [ ] Hoja "Clientes" tiene datos
- [ ] Permisos del Google Sheet correctos
- [ ] Logs en consola revisados
- [ ] App refrescada después de cambios

---

## 🆘 Solución de Emergencia

Si nada funciona, prueba esto:

1. **Verifica que el Apps Script funcione solo**:
   - Abre el Web App URL directamente en el navegador
   - Agrega: `?action=getClientes&token=TU_TOKEN`
   - Ejemplo: `https://script.google.com/.../exec?action=getClientes&token=mi-token`
   - Deberías ver un JSON con tus clientes

2. **Si esto funciona** → El problema está en las variables de Vercel
3. **Si esto NO funciona** → El problema está en el Apps Script

---

## 📞 Siguiente Paso

1. Sigue el **Paso 2** (ver logs en consola)
2. Copia el mensaje que aparece
3. Compártelo y te ayudo a resolverlo

**Con los logs sabré exactamente qué está fallando.** 🎯
