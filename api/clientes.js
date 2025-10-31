// /api/clientes.js

export default async function handler(req, res) {
    const { method } = req;
    
    const scriptUrl = process.env.scriptUrl || process.env.APPSCRIPT_URL;
    const token = process.env.token || process.env.APPSCRIPT_TOKEN;
  
    if (!scriptUrl || !token) {
      return res.status(500).json({ 
        error: "Faltan credenciales del entorno"
      });
    }
  
    try {
      if (method === "GET") {
        // Obtener clientes desde Apps Script
        const url = `${scriptUrl}?action=getClientes&token=${token}`;
        const response = await fetch(url);
        const data = await response.json();
        
        // Agregar headers de caché para reducir llamadas
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
        
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
  