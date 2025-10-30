// FUNCIÓN marcarContactado CON LOGS - Reemplazá solo esta función en tu Apps Script

function marcarContactado(clienteId) {
  try {
    console.log('🟡 [APPS SCRIPT] Función marcarContactado iniciada');
    console.log('🟡 [APPS SCRIPT] clienteId recibido:', clienteId);
    
    const ss = SpreadsheetApp.openById("1Z2rItq4DNAKD2XldiUtLbLG32GjqCpbp5ZuWbRvC9Lo");
    console.log('🟡 [APPS SCRIPT] Spreadsheet abierto');
    
    const sheet = ss.getSheetByName("Clientes");
    
    if (!sheet) {
      console.error('❌ [APPS SCRIPT] Hoja "Clientes" no encontrada');
      throw new Error('Hoja "Clientes" no encontrada');
    }
    
    console.log('🟡 [APPS SCRIPT] Hoja "Clientes" encontrada');
    
    const data = sheet.getDataRange().getValues();
    console.log('🟡 [APPS SCRIPT] Total de filas:', data.length);
    
    const headers = data[0];
    console.log('🟡 [APPS SCRIPT] Headers:', headers);
    
    // Buscar índice de columnas
    const colClienteID = headers.indexOf("ClienteID");
    const colContactado = headers.indexOf("Contactado");
    
    console.log('🟡 [APPS SCRIPT] Índice columna ClienteID:', colClienteID);
    console.log('🟡 [APPS SCRIPT] Índice columna Contactado:', colContactado);
    
    if (colClienteID === -1) {
      console.error('❌ [APPS SCRIPT] Columna "ClienteID" no encontrada');
      throw new Error('Columna "ClienteID" no encontrada');
    }
    
    if (colContactado === -1) {
      console.error('❌ [APPS SCRIPT] Columna "Contactado" no encontrada');
      throw new Error('Columna "Contactado" no encontrada. Debes agregar una columna llamada "Contactado" en tu hoja.');
    }
    
    // Buscar la fila del cliente
    console.log('🟡 [APPS SCRIPT] Buscando cliente...');
    
    for (let i = 1; i < data.length; i++) {
      const idEnFila = String(data[i][colClienteID]);
      
      if (i <= 3) { // Log de las primeras 3 filas para debug
        console.log(`🟡 [APPS SCRIPT] Fila ${i}: ID="${idEnFila}" vs buscado="${clienteId}"`);
      }
      
      if (idEnFila === String(clienteId)) {
        console.log(`✅ [APPS SCRIPT] Cliente encontrado en fila ${i + 1}`);
        console.log(`🟡 [APPS SCRIPT] Marcando celda en fila ${i + 1}, columna ${colContactado + 1}`);
        
        // Marcar como contactado
        sheet.getRange(i + 1, colContactado + 1).setValue('Sí');
        
        console.log('✅ [APPS SCRIPT] Cliente marcado exitosamente');
        
        return {
          success: true,
          message: 'Cliente marcado como contactado',
          clienteId: clienteId,
          fila: i + 1
        };
      }
    }
    
    // Si llegamos aquí, no se encontró el cliente
    console.error('❌ [APPS SCRIPT] Cliente no encontrado después de revisar todas las filas');
    return {
      error: 'Cliente no encontrado',
      clienteId: clienteId,
      totalFilasRevisadas: data.length - 1
    };
    
  } catch (error) {
    console.error('❌ [APPS SCRIPT] Error en marcarContactado:', error);
    console.error('❌ [APPS SCRIPT] Stack:', error.stack);
    return {
      error: error.message || String(error),
      stack: error.stack
    };
  }
}
