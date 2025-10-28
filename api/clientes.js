// /api/clientes.js

export default async function handler(req, res) {
    const { method } = req;
    
    // Debug: verificar todas las variables disponibles
    const envVars = {
      scriptUrl: process.env.scriptUrl,
      token: process.env.token,
      APPSCRIPT_URL: process.env.APPSCRIPT_URL,
      APPSCRIPT_TOKEN: process.env.APPSCRIPT_TOKEN,
    };
    
    console.log('Variables de entorno disponibles:', envVars);
    
    const scriptUrl = process.env.scriptUrl || process.env.APPSCRIPT_URL;
    const token = process.env.token || process.env.APPSCRIPT_TOKEN;
  
    if (!scriptUrl || !token) {
      return res.status(500).json({ 
        error: "Faltan credenciales del entorno",
        debug: {
          scriptUrlExists: !!scriptUrl,
          tokenExists: !!token,
          availableKeys: Object.keys(process.env).filter(k => k.toLowerCase().includes('script') || k.toLowerCase().includes('token'))
        }
      });
    }
  
    try {
      if (method === "GET") {
        // Obtener clientes desde Apps Script
        const url = `${scriptUrl}?action=getClientes&token=${token}`;
        const response = await fetch(url);
        const data = await response.json();
        return res.status(200).json(data);
      }
  
      else if (method === "POST") {
        // Registrar cliente nuevo
        const payload = req.body;
  
        const response = await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            action: "guardarCliente",
            token,
            ...payload
          })
        });
        const data = await response.json();
        return res.status(200).json(data);
      }
  
      else {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Método ${method} no permitido`);
      }
  
    } catch (err) {
      console.error("Error en /api/clientes:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  