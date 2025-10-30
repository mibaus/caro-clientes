/**
 * GOOGLE APPS SCRIPT - SISTEMA DE GESTIÓN DE CLIENTES
 * 
 * IMPORTANTE: Antes de usar este código, ajustá las siguientes variables:
 * 1. TOKEN_SECRETO - Tu token de autenticación
 * 2. NOMBRE_HOJA - El nombre de tu hoja (ej: "Respuestas de formulario 1")
 * 3. COLUMNA_ID - Número de columna donde está el ID
 * 4. COLUMNA_CONTACTADO - Número de columna donde está "Contactado"
 */

// ========== CONFIGURACIÓN ==========
const TOKEN_SECRETO = 'TU_TOKEN_AQUI'; // Cambiar por tu token real
const NOMBRE_HOJA = 'Respuestas de formulario 1'; // Cambiar por el nombre de tu hoja

// Números de columna (contar desde 1: A=1, B=2, C=3...)
const COLUMNA_ID = 1;         // Columna del ID del cliente
const COLUMNA_CONTACTADO = 8; // Columna "Contactado" (ajustar según tu hoja)

// ========== FUNCIONES PRINCIPALES ==========

/**
 * Manejar peticiones GET
 * Ejemplo: ?action=getClientes&token=xxx
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    const token = e.parameter.token;
    
    // Validar token
    if (token !== TOKEN_SECRETO) {
      return crearRespuesta({ error: 'Token inválido' });
    }
    
    // Ejecutar acción
    if (action === 'getClientes') {
      return getClientes();
    } else {
      return crearRespuesta({ error: 'Acción no reconocida' });
    }
    
  } catch (error) {
    return crearRespuesta({ error: error.message });
  }
}

/**
 * Manejar peticiones POST
 * Body debe ser JSON con: { action, token, ...params }
 */
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const token = params.token;
    const action = params.action;
    
    // Validar token
    if (token !== TOKEN_SECRETO) {
      return crearRespuesta({ error: 'Token inválido' });
    }
    
    // Ejecutar acción según el tipo
    if (action === 'guardarCliente') {
      return guardarCliente(params);
    } 
    else if (action === 'marcarContactado') {
      return marcarContactado(params.clienteId);
    }
    else if (action === 'registrarVenta') {
      return registrarVenta(params);
    }
    else {
      return crearRespuesta({ error: 'Acción no reconocida' });
    }
    
  } catch (error) {
    return crearRespuesta({ error: error.message });
  }
}

// ========== OBTENER CLIENTES ==========

/**
 * Obtiene todos los clientes de la hoja
 * Retorna array de objetos con todos los campos
 */
function getClientes() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOMBRE_HOJA);
    
    if (!sheet) {
      return crearRespuesta({ error: 'Hoja no encontrada: ' + NOMBRE_HOJA });
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return crearRespuesta({ clientes: [] });
    }
    
    // Primera fila = headers
    const headers = data[0];
    
    // Resto = datos de clientes
    const rows = data.slice(1);
    
    // Convertir cada fila en un objeto
    const clientes = rows.map(row => {
      let obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
    
    return crearRespuesta({ clientes: clientes });
    
  } catch (error) {
    return crearRespuesta({ error: error.message });
  }
}

// ========== MARCAR CLIENTE COMO CONTACTADO ==========

/**
 * Marca un cliente como contactado
 * @param {string} clienteId - ID del cliente a marcar
 */
function marcarContactado(clienteId) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOMBRE_HOJA);
    
    if (!sheet) {
      return crearRespuesta({ error: 'Hoja no encontrada: ' + NOMBRE_HOJA });
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Buscar la fila del cliente por ID
    for (let i = 1; i < data.length; i++) { // Empezar en 1 para saltar el header
      const idEnFila = String(data[i][COLUMNA_ID - 1]); // -1 porque array empieza en 0
      
      if (idEnFila === String(clienteId)) {
        // Marcar como contactado
        sheet.getRange(i + 1, COLUMNA_CONTACTADO).setValue('Sí');
        
        return crearRespuesta({ 
          success: true, 
          message: 'Cliente marcado como contactado',
          clienteId: clienteId,
          fila: i + 1
        });
      }
    }
    
    // Si llegamos aquí, no se encontró el cliente
    return crearRespuesta({ 
      error: 'Cliente no encontrado',
      clienteId: clienteId 
    });
    
  } catch (error) {
    return crearRespuesta({ error: error.message });
  }
}

// ========== GUARDAR NUEVO CLIENTE ==========

/**
 * Guarda un nuevo cliente en la hoja
 * @param {object} params - Datos del cliente
 */
function guardarCliente(params) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOMBRE_HOJA);
    
    if (!sheet) {
      return crearRespuesta({ error: 'Hoja no encontrada: ' + NOMBRE_HOJA });
    }
    
    // Obtener headers para saber el orden de las columnas
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Crear array con los valores en el orden correcto
    const nuevaFila = headers.map(header => params[header] || '');
    
    // Agregar la fila al final
    sheet.appendRow(nuevaFila);
    
    return crearRespuesta({ 
      success: true, 
      message: 'Cliente guardado correctamente' 
    });
    
  } catch (error) {
    return crearRespuesta({ error: error.message });
  }
}

// ========== REGISTRAR VENTA ==========

/**
 * Registra una venta para un cliente (actualiza fecha de última compra)
 * @param {object} params - Debe incluir clienteId
 */
function registrarVenta(params) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOMBRE_HOJA);
    
    if (!sheet) {
      return crearRespuesta({ error: 'Hoja no encontrada: ' + NOMBRE_HOJA });
    }
    
    const clienteId = params.clienteId;
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Buscar columna "Última compra" o "Marca temporal"
    let columnaUltimaCompra = -1;
    for (let i = 0; i < headers.length; i++) {
      if (headers[i] === 'Última compra' || headers[i] === 'Marca temporal') {
        columnaUltimaCompra = i + 1; // +1 porque getRange usa base 1
        break;
      }
    }
    
    if (columnaUltimaCompra === -1) {
      return crearRespuesta({ error: 'Columna de última compra no encontrada' });
    }
    
    // Buscar cliente por ID
    for (let i = 1; i < data.length; i++) {
      const idEnFila = String(data[i][COLUMNA_ID - 1]);
      
      if (idEnFila === String(clienteId)) {
        // Actualizar fecha de última compra
        const fechaActual = new Date();
        sheet.getRange(i + 1, columnaUltimaCompra).setValue(fechaActual);
        
        return crearRespuesta({ 
          success: true, 
          message: 'Venta registrada correctamente',
          clienteId: clienteId,
          fecha: fechaActual
        });
      }
    }
    
    return crearRespuesta({ 
      error: 'Cliente no encontrado',
      clienteId: clienteId 
    });
    
  } catch (error) {
    return crearRespuesta({ error: error.message });
  }
}

// ========== FUNCIONES AUXILIARES ==========

/**
 * Crea una respuesta JSON estandarizada
 * @param {object} data - Datos a retornar
 */
function crearRespuesta(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ========== FUNCIONES DE TESTING ==========

/**
 * Función de prueba para verificar que el script funciona
 * Ejecutar desde el editor para probar
 */
function testGetClientes() {
  const resultado = getClientes();
  Logger.log(resultado.getContent());
}

/**
 * Función de prueba para marcar un cliente como contactado
 * Cambiá '1' por un ID real de tu hoja
 */
function testMarcarContactado() {
  const resultado = marcarContactado('1');
  Logger.log(resultado.getContent());
}

/**
 * Muestra información de configuración para debugging
 */
function mostrarConfiguracion() {
  Logger.log('=== CONFIGURACIÓN ACTUAL ===');
  Logger.log('Nombre de hoja: ' + NOMBRE_HOJA);
  Logger.log('Columna ID: ' + COLUMNA_ID);
  Logger.log('Columna Contactado: ' + COLUMNA_CONTACTADO);
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOMBRE_HOJA);
  if (sheet) {
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    Logger.log('\n=== HEADERS DE TU HOJA ===');
    headers.forEach((header, index) => {
      Logger.log('Columna ' + (index + 1) + ': ' + header);
    });
  } else {
    Logger.log('ERROR: No se encontró la hoja "' + NOMBRE_HOJA + '"');
  }
}
