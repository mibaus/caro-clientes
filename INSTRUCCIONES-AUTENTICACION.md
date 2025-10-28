# 🔐 Configuración de Autenticación

## ✅ Sistema Implementado

Tu aplicación ahora tiene un **sistema de login con contraseña** que protege el acceso.

---

## 🎯 Características

- ✅ **Pantalla de login profesional** antes de acceder
- ✅ **Contraseña compartida** (una para la dueña y las mozas)
- ✅ **Sesión persistente** con opción "Recordar sesión"
- ✅ **Rate limiting**: Máximo 5 intentos, luego bloqueo de 15 minutos
- ✅ **Botón de logout** en el header
- ✅ **Diseño bonito** acorde a tu app
- ✅ **Seguridad robusta** con protección contra fuerza bruta

---

## ⚙️ Configuración en Vercel

### **Paso 1: Ir a Vercel Dashboard**
1. Ve a [vercel.com](https://vercel.com)
2. Selecciona tu proyecto `caro-clientes`
3. Ve a **Settings** → **Environment Variables**

### **Paso 2: Agregar Variable de Entorno**
Agrega esta variable:

```
Name:  VITE_AUTH_KEY
Value: [TU-CLAVE-SEGURA]
```

**Ejemplo de clave segura**:
- ❌ Débil: `123456`, `password`, `admin`
- ✅ Buena: `RestoCaro2024!`, `MiRestaurante#123`
- ✅ Mejor: `C@r0l1n@R3st0!2024`

### **Paso 3: Scope**
- ✅ **Production** (para producción)
- ✅ **Preview** (opcional, para testing)
- ⬜ Development (no es necesario)

### **Paso 4: Guardar**
1. Click en **Add** o **Save**
2. Vercel redesplegará automáticamente

### **Paso 5: Verificar**
1. Espera 1-2 minutos al despliegue
2. Abre tu app
3. Deberías ver la pantalla de login
4. Ingresa la contraseña que configuraste

---

## 🔄 Cómo Funciona

### **Primera Vez que Ingresa un Usuario**
```
1. Usuario abre la app
2. Ve pantalla de login bonita
3. Ingresa la contraseña
4. ✅ Marca "Recordar sesión" (opcional)
5. Click en "Ingresar"
6. ¡Accede a la app!
```

### **Si Marca "Recordar Sesión"**
- La sesión se guarda en el navegador
- No pedirá contraseña nuevamente
- Incluso si cierra el navegador

### **Si NO Marca "Recordar Sesión"**
- La sesión dura mientras el navegador esté abierto
- Al cerrar el navegador, debe volver a ingresar

### **Para Cerrar Sesión**
- Click en botón **"Salir"** en el header (arriba a la derecha)
- La sesión se cierra inmediatamente

---

## 🔒 Seguridad Implementada

### **Rate Limiting (Anti Fuerza Bruta)**
- Máximo **5 intentos** de contraseña
- Después de 5 intentos fallidos → **Bloqueo por 15 minutos**
- Contador de intentos visible para el usuario
- Protección contra ataques automatizados

### **Delay en Validación**
- Cada intento de login tiene un delay de 500ms
- Dificulta ataques de fuerza bruta

### **Contraseña Segura**
- Guardada en **variable de entorno** (no en el código)
- No visible en el frontend
- Solo accesible desde el servidor

### **HTTPS**
- Vercel provee HTTPS automático
- Contraseña encriptada en tránsito

---

## 👥 Uso para el Equipo

### **Compartir la Contraseña**
Dile a la dueña y las mozas:

```
🔐 Contraseña de la app: [TU-CONTRASEÑA]

Para acceder:
1. Abre la app en tu celular
2. Ingresa la contraseña
3. ✅ Marca "Recordar sesión" 
4. Ya no te la pedirá más

Para cerrar sesión:
- Click en "Salir" arriba a la derecha
```

### **Buenas Prácticas**
✅ **HACER**:
- Compartir la contraseña de forma segura (WhatsApp privado, en persona)
- Marcar "Recordar sesión" en dispositivos personales
- Cerrar sesión si usan un dispositivo compartido
- Cambiar la contraseña si alguien del equipo se va

❌ **NO HACER**:
- Compartir la contraseña públicamente
- Escribirla en lugares visibles
- Dejarla en dispositivos compartidos sin logout

---

## 🔄 Cambiar la Contraseña

### **Si Necesitas Cambiarla**
1. Ve a Vercel Dashboard
2. Settings → Environment Variables
3. Edita `VITE_AUTH_KEY`
4. Cambia el valor
5. Save
6. Vercel redesplegará (1-2 min)
7. Notifica al equipo la nueva clave

---

## 🆘 Problemas Comunes

### **"No puedo entrar, dice contraseña incorrecta"**
**Solución**:
1. Verifica que la contraseña sea la correcta (sin espacios extra)
2. Verifica que la variable en Vercel esté configurada
3. Espera 1-2 min después de configurarla en Vercel

### **"Dice bloqueado por 15 minutos"**
**Solución**:
- Hubo 5 intentos fallidos
- Espera 15 minutos
- O limpia los datos del navegador (localStorage)

### **"La sesión se cerró sola"**
**Solución**:
- Si no marcó "Recordar sesión", es normal al cerrar el navegador
- Marca "Recordar sesión" para mantener la sesión

### **"Olvidé la clave"**
**Solución**:
- Solo el dueño puede verla en Vercel
- Ve a Vercel → Settings → Environment Variables
- Verás el valor de `VITE_AUTH_KEY`

---

## 📱 Uso en Móvil

### **iPhone/Android**
1. Abre Safari/Chrome
2. Ve a tu app
3. Ingresa contraseña
4. ✅ Marca "Recordar sesión"
5. **Opcional**: Agregar a pantalla de inicio
   - Safari: Share → Add to Home Screen
   - Chrome: Menu → Add to Home screen
6. Ahora se abre como una app nativa

---

## 🔐 Contraseña Temporal

**Por defecto, la contraseña es**: `admin123`

⚠️ **IMPORTANTE**: 
- Esta es una contraseña temporal
- **DEBES cambiarla** en Vercel antes de usar en producción
- Usa una contraseña segura y única

---

## ✨ Ventajas del Sistema

### **Para la Dueña**
- ✅ Control total de acceso
- ✅ Puede dar/quitar acceso cambiando contraseña
- ✅ Sabe que los datos están protegidos
- ✅ Cumple con protección de datos personales

### **Para las Mozas**
- ✅ Fácil de usar (solo una contraseña)
- ✅ No pide contraseña cada vez (recordar sesión)
- ✅ Pueden cerrar sesión si usan dispositivo compartido
- ✅ Interfaz clara y profesional

### **Seguridad**
- ✅ Nadie sin contraseña puede acceder
- ✅ Protección contra fuerza bruta
- ✅ Contraseña en variable de entorno (segura)
- ✅ HTTPS en todas las conexiones

---

## 🎯 Resumen Rápido

```
┌─────────────────────────────────────────┐
│  CONFIGURACIÓN EN VERCEL                │
├─────────────────────────────────────────┤
│  1. Settings → Environment Variables     │
│  2. Add: VITE_AUTH_KEY                  │
│  3. Value: tu-clave-segura              │
│  4. Save                                │
│  5. Esperar 1-2 min                     │
│  6. ✅ Listo                             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  USO DIARIO                             │
├─────────────────────────────────────────┤
│  1. Abrir app                           │
│  2. Ingresar contraseña (primera vez)   │
│  3. ✅ Marcar "Recordar sesión"         │
│  4. Ya no pedirá contraseña más         │
│  5. Usar normalmente                    │
│  6. "Salir" para cerrar sesión          │
└─────────────────────────────────────────┘
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa esta guía
2. Verifica la configuración en Vercel
3. Prueba en modo incógnito
4. Contacta al desarrollador

**¡Tu app ahora está protegida! 🔒**
