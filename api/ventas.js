export default async function handler(req, res) {
    try {
      const scriptUrl = process.env.scriptUrl;
      const token = process.env.token;
      
      if (!scriptUrl || !token) {
        return res.status(500).json({ error: "Faltan credenciales del entorno" });
      }
  
      if (req.method === "POST") {
        const { clienteID } = req.body;
        console.log('📦 Datos recibidos:', { clienteID });
        
        if (!clienteID) return res.status(400).json({ error: "Falta ClienteID" });
  
        // Generar fecha actual en formato YYYY-MM-DD
        const fecha = new Date().toISOString().split('T')[0];
        
        const payload = { 
          action: "guardarVenta",
          token,
          clienteID,
          fecha
        };
        
        console.log('📤 Enviando a Apps Script:', payload);
  
        const response = await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
  
        const result = await response.json();
        console.log('📥 Respuesta de Apps Script:', result);
        console.log('Status de respuesta:', response.status);
        
        return res.status(200).json(result);
      }
  
      res.setHeader("Allow", ["POST"]);
      return res.status(405).json({ error: `Método ${req.method} no permitido` });
    } catch (error) {
      console.error("Error en /api/ventas:", error);
      return res.status(500).json({ error: "Error al registrar venta" });
    }
  }
  