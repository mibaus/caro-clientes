# 📋 Instrucciones: Sistema de Seguimiento de Clientes Contactados

## 🎯 Objetivo
Implementar una columna en Google Sheets para marcar qué clientes nuevos ya fueron contactados. Esta información se compartirá entre todos los dispositivos y navegadores.

---

## 📊 PASO 1: Agregar Columna en Google Sheets

### 1.1 Abrir tu hoja de cálculo
Ve a tu Google Sheets donde se registran los clientes.

### 1.2 Agregar nueva columna
- Ubica la última columna con datos (ejemplo: "Última compra" o "Marca temporal")
- Crea una **nueva columna** al lado (o al final)
- Nombra la columna: **`Contactado`**
- Puede ir en cualquier posición, pero te recomiendo ponerla después de "Marca temporal"

### 1.3 Formato recomendado
- **Nombre de columna**: `Contactado` (respetando mayúsculas)
- **Valores permitidos**: 
  - Vacío (cliente no contactado)
  - `Sí` (cliente ya fue contactado)
  - `SI` (también válido)

### 1.4 Ejemplo de estructura

```
| ID | Nombre | Apellido | Zona | Celular | Fecha cumpleaños | Marca temporal | Contactado |
|----|--------|----------|------|---------|------------------|----------------|------------|
| 1  | Juan   | Pérez    | Norte| 1234567 | 15/05/1990      | 2024-01-15     |            |
| 2  | María  | López    | Sur  | 7654321 | 20/08/1985      | 2024-01-16     | Sí         |
```

---

## ⚙️ PASO 2: Actualizar Google Apps Script

### 2.1 Abrir el editor de scripts
1. En tu Google Sheet, ve a: **Extensiones** → **Apps Script**
2. Se abrirá el editor de código

### 2.2 Identificar el número de columna "Contactado"

**IMPORTANTE**: Necesitás saber en qué **número de columna** pusiste "Contactado"

Ejemplo:
- Columna A = 1
- Columna B = 2
- Columna C = 3
- ...
- Columna H = 8

Si pusiste "Contactado" en la **columna H**, entonces es el número **8**.

### 2.3 Agregar función para obtener clientes con campo "contactado"

Buscá la función `getClientes()` en tu script y **modificala** para incluir el campo contactado.

**Ejemplo de código actualizado:**

```javascript
function getClientes() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Respuestas de formulario 1');
    const data = sheet.getDataRange().getValues();
    
    // Primera fila = headers
    const headers = data[0];
    
    // Resto = datos
    const rows = data.slice(1);
    
    const clientes = rows.map(row => {
      let obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({ clientes: clientes }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 2.4 Agregar nueva función: marcarContactado

**Agrega esta función NUEVA** al final de tu script:

```javascript
function marcarContactado(clienteId) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Respuestas de formulario 1');
    const data = sheet.getDataRange().getValues();
    
    // IMPORTANTE: Ajustar estos números según tu hoja
    const COLUMNA_ID = 1;         // Columna donde está el ID (ejemplo: columna A = 1)
    const COLUMNA_CONTACTADO = 8; // Columna donde está "Contactado" (ejemplo: columna H = 8)
    
    // Buscar la fila del cliente
    for (let i = 1; i < data.length; i++) { // Empezar en 1 (saltar header)
      const idEnFila = String(data[i][COLUMNA_ID - 1]); // -1 porque el array empieza en 0
      
      if (idEnFila === String(clienteId)) {
        // Marcar como contactado en la columna correspondiente
        sheet.getRange(i + 1, COLUMNA_CONTACTADO).setValue('Sí');
        
        return ContentService
          .createTextOutput(JSON.stringify({ 
            success: true, 
            message: 'Cliente marcado como contactado',
            clienteId: clienteId 
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Si llegamos aquí, no se encontró el cliente
    return ContentService
      .createTextOutput(JSON.stringify({ 
        error: 'Cliente no encontrado',
        clienteId: clienteId 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 2.5 Actualizar función doPost

Buscá la función `doPost` y agregá el manejo de la acción `marcarContactado`:

```javascript
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const token = params.token;
    const action = params.action;
    
    // Validar token
    if (token !== 'TU_TOKEN_SECRETO') {
      return ContentService
        .createTextOutput(JSON.stringify({ error: 'Token inválido' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Manejar diferentes acciones
    if (action === 'guardarCliente') {
      return guardarCliente(params);
    } 
    else if (action === 'marcarContactado') {
      return marcarContactado(params.clienteId);
    }
    else {
      return ContentService
        .createTextOutput(JSON.stringify({ error: 'Acción no reconocida' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 2.6 **MUY IMPORTANTE**: Ajustar números de columna

En la función `marcarContactado`, **DEBES ajustar** estos valores según TU hoja:

```javascript
const COLUMNA_ID = 1;         // ¿En qué columna está el ID?
const COLUMNA_CONTACTADO = 8; // ¿En qué columna pusiste "Contactado"?
```

**Cómo saber el número:**
- Abrí tu Google Sheet
- Contá las columnas desde la izquierda (A=1, B=2, C=3...)
- Anotá el número de la columna "ID" y "Contactado"

### 2.7 Guardar y desplegar

1. **Guardar**: Click en el ícono del disco 💾 o `Ctrl+S`
2. **Desplegar**: 
   - Click en **Implementar** → **Nueva implementación**
   - Tipo: **Aplicación web**
   - "Ejecutar como": **Yo**
   - "Quién tiene acceso": **Cualquier persona**
   - Click en **Implementar**
3. **Autorizar**: Si te pide permisos, autorizá el script

---

## ✅ PASO 3: Verificar que Funciona

### 3.1 Probar desde la aplicación
1. Abrí tu aplicación web
2. Andá al menú → "🆕 Nuevos clientes"
3. Deberías ver la lista de clientes nuevos
4. Click en el botón **✓** de algún cliente
5. El cliente debería desaparecer de la lista

### 3.2 Verificar en Google Sheets
1. Abrí tu Google Sheet
2. Buscá el cliente que marcaste
3. En la columna "Contactado" debería aparecer **"Sí"**

### 3.3 Probar en otro navegador
1. Abrí la app en otro navegador (Chrome, Safari, etc.)
2. El cliente que marcaste NO debería aparecer en "Nuevos clientes"
3. ✅ Esto confirma que funciona la persistencia compartida

---

## 🐛 Solución de Problemas

### Problema 1: "Cliente no encontrado"
**Causa**: El ID del cliente no coincide o el número de columna está mal.

**Solución**:
- Verificá que `COLUMNA_ID` tenga el número correcto
- Abrí la consola del navegador (F12) y fijate qué ID se está enviando
- Compará con el ID en tu Google Sheet

### Problema 2: No se marca la columna
**Causa**: El número de `COLUMNA_CONTACTADO` está mal.

**Solución**:
- Contá nuevamente las columnas en tu Sheet
- Ajustá el valor de `COLUMNA_CONTACTADO`
- Guardá y volvé a desplegar el script

### Problema 3: Error de permisos
**Causa**: El script no tiene permisos para escribir en la hoja.

**Solución**:
- En Apps Script, andá a: **Implementar** → **Administrar implementaciones**
- Editá la implementación
- Asegurate que "Ejecutar como" sea **Yo** (tu usuario)
- Volvé a autorizar si es necesario

### Problema 4: El botón se queda "cargando"
**Causa**: Error en el script o el token no es válido.

**Solución**:
- Verificá en Apps Script que el token coincida
- Abrí la consola del navegador (F12) → pestaña "Console"
- Fijate si hay algún error en rojo
- Si dice "Token inválido", verificá las variables de entorno en Vercel

---

## 📝 Resumen de Cambios

### En Google Sheets:
- ✅ Agregar columna "Contactado"

### En Apps Script:
- ✅ Modificar `getClientes()` para incluir campo contactado
- ✅ Agregar función `marcarContactado()`
- ✅ Actualizar `doPost()` para manejar acción "marcarContactado"
- ✅ Ajustar números de columna según tu hoja
- ✅ Guardar y desplegar

### En la aplicación:
- ✅ Ya está todo actualizado en el código (hice los cambios)

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, tu sistema de seguimiento de clientes contactados estará funcionando y se sincronizará entre todos los dispositivos y navegadores.

Si tenés algún problema, revisá la sección "Solución de Problemas" o avisame para ayudarte.
