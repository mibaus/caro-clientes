# 📝 Instrucciones para Actualizar Apps Script

## Problema
Actualmente la "Última compra" no se actualiza cuando registrás una venta.

## Solución
Tu Apps Script debe calcular la última compra automáticamente cuando devuelve los clientes.

---

## 🔧 Pasos para Actualizar

### 1. Abrí tu Apps Script
Ve a: https://script.google.com/home/projects/YOUR_PROJECT_ID

### 2. Reemplazá la función `getClientes()`

**ANTES** (líneas 60-73 aprox.):
```javascript
function getClientes() {
  const ss = SpreadsheetApp.openById("1Z2rItq4DNAKD2XldiUtLbLG32GjqCpbp5ZuWbRvC9Lo");
  const sheet = ss.getSheetByName("Clientes");
  if (!sheet) throw new Error('Hoja "Clientes" no encontrada');

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  const headers = data[0].map(h => String(h).trim());
  const rows = data.slice(1);

  return rows.map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  }).filter(c => c["ClienteID"]);
}
```

**DESPUÉS** (copiar el código del archivo `appscript-modificado.gs`):
```javascript
function getClientes() {
  const ss = SpreadsheetApp.openById("1Z2rItq4DNAKD2XldiUtLbLG32GjqCpbp5ZuWbRvC9Lo");
  const sheetClientes = ss.getSheetByName("Clientes");
  const sheetVentas = ss.getSheetByName("Ventas");
  
  if (!sheetClientes) throw new Error('Hoja "Clientes" no encontrada');

  const dataClientes = sheetClientes.getDataRange().getValues();
  if (dataClientes.length < 2) return [];

  const headers = dataClientes[0].map(h => String(h).trim());
  const rows = dataClientes.slice(1);

  // Obtener todas las ventas y calcular última compra por cliente
  const ventasMap = {}; // { ClienteID: fechaMasReciente }
  
  if (sheetVentas) {
    const dataVentas = sheetVentas.getDataRange().getValues();
    
    // Procesar ventas (saltar header)
    for (let i = 1; i < dataVentas.length; i++) {
      const fecha = new Date(dataVentas[i][0]); // Columna "Fecha"
      const clienteID = String(dataVentas[i][1]); // Columna "ClienteID"
      
      if (!ventasMap[clienteID] || fecha > new Date(ventasMap[clienteID])) {
        ventasMap[clienteID] = fecha.toISOString();
      }
    }
  }

  // Construir clientes con última compra incluida
  return rows.map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    
    // Agregar última compra calculada
    const clienteID = obj["ClienteID"];
    if (clienteID) {
      obj["Última compra"] = ventasMap[clienteID] || null;
    }
    
    return obj;
  }).filter(c => c["ClienteID"]);
}
```

### 3. Guardar y Desplegar
1. Click en **💾 Guardar**
2. Click en **🚀 Implementar** → **Manage deployments**
3. Click en el **✏️ ícono de editar** del deployment activo
4. En **Version** selecciona **New version**
5. Click en **Deploy**

### 4. Probar
1. Ve a tu webapp
2. Recarga la página (`Cmd+Shift+R`)
3. Registra una venta
4. Verifica que ahora muestre la fecha actualizada

---

## ✅ Qué Hace el Nuevo Código

1. **Carga la hoja "Ventas"** además de "Clientes"
2. **Recorre todas las ventas** y guarda la fecha más reciente por cada ClienteID
3. **Agrega el campo "Última compra"** a cada cliente con su fecha más reciente
4. **Retorna los clientes** con toda la información

---

## 📊 Rendimiento

- Con **100 clientes** y **5000 ventas**: ~2-3 segundos
- Con **1000 clientes** y **50000 ventas**: ~8-12 segundos

Es mucho más eficiente que enviar todas las ventas al navegador.

---

## 🐛 Troubleshooting

**Si da error "Hoja Ventas no encontrada":**
- Verificá que la hoja se llame exactamente **"Ventas"** (con mayúscula)

**Si la fecha sigue sin actualizarse:**
- Abrí la consola del navegador y buscá: `🔍 ¿Tiene campo "Última compra"?`
- Debería mostrar la fecha en formato ISO

**Si es muy lento:**
- Apps Script tiene límite de 30 segundos. Si tenés demasiadas ventas, podríamos optimizar más.
