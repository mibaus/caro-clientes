// /api/clientes.js

export default async function handler(req, res) {
    const { method } = req;
    const sheetId = process.env.SHEET_ID;
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  
    // Debug temporal - REMOVER después de solucionar
    console.log('Variables disponibles:', {
      SHEET_ID_exists: !!sheetId,
      SHEET_ID_length: sheetId?.length || 0,
      API_KEY_exists: !!apiKey,
      API_KEY_length: apiKey?.length || 0,
      all_env_keys: Object.keys(process.env).filter(k => k.includes('SHEET') || k.includes('GOOGLE'))
    });
  
    if (!sheetId || !apiKey) {
      return res.status(500).json({ 
        error: "Faltan credenciales del entorno",
        debug: {
          SHEET_ID: !!sheetId,
          GOOGLE_SHEETS_API_KEY: !!apiKey
        }
      });
    }
  
    const sheetRange = "Clientes!A:G"; // Nombre exacto de la hoja
  
    try {
      if (method === "GET") {
        // Leer datos
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetRange)}?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
  
        // Debug temporal
        console.log('Google Sheets Response:', { 
          status: response.status, 
          hasValues: !!data.values,
          error: data.error,
          data: JSON.stringify(data).substring(0, 200)
        });
  
        if (!data.values) {
          return res.status(404).json({ 
            error: "No se encontraron datos",
            debug: {
              googleResponse: data,
              responseStatus: response.status
            }
          });
        }
  
        const [headers, ...rows] = data.values;
        const clientes = rows.map((row) => {
          const cliente = {};
          headers.forEach((h, i) => (cliente[h] = row[i]));
          return cliente;
        });
  
        return res.status(200).json(clientes);
      }
  
      else if (method === "POST") {
        // Agregar nuevo cliente
        const nuevo = req.body;
  
        if (!nuevo.Nombre || !nuevo.Celular) {
          return res.status(400).json({ error: "Datos incompletos" });
        }
  
        const fechaActual = new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Cordoba" });
        const values = [[
          fechaActual,
          nuevo.Nombre,
          nuevo.Apellido || "",
          nuevo.FechaCumpleaños || "",
          nuevo.Celular,
          nuevo.Zona || "",
          nuevo.ClienteID || ""
        ]];
  
        const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetRange)}:append?valueInputOption=USER_ENTERED&key=${apiKey}`;
        await fetch(appendUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ values })
        });
  
        return res.status(201).json({ message: "Cliente agregado con éxito" });
      }
  
      else {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Método ${method} no permitido`);
      }
    } catch (error) {
      console.error("Error en /api/clientes:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  