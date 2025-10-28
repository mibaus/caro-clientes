// REEMPLAZA tu función getClientes() con esta versión:

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
